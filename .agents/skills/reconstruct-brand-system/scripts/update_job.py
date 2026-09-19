#!/usr/bin/env python3
from __future__ import annotations

import argparse
import fcntl
import json
import os
import tempfile
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path


STATUSES = {"planned", "running", "completed", "failed", "skipped"}
TRANSITIONS = {
    "planned": {"planned", "running", "skipped"},
    "running": {"running", "completed", "failed", "skipped"},
    "failed": {"failed", "running", "skipped"},
    "completed": {"completed"},
    "skipped": {"skipped"},
}


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def state_path_from(value: str) -> Path:
    candidate = Path(value).expanduser().resolve()
    return candidate if candidate.name == "pipeline-state.json" else candidate / "pipeline-state.json"


def load(path: Path) -> dict:
    value = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict) or value.get("artifact_type") != "brand_pipeline_state":
        raise ValueError("invalid brand pipeline state")
    return value


def write_json_atomic(path: Path, value: dict) -> None:
    descriptor, temporary_name = tempfile.mkstemp(
        dir=path.parent,
        prefix=f".{path.name}.",
        suffix=".tmp",
    )
    temporary_path = Path(temporary_name)
    try:
        with os.fdopen(descriptor, "w", encoding="utf-8") as handle:
            json.dump(value, handle, ensure_ascii=False, indent=2)
            handle.write("\n")
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary_path, path)
    finally:
        temporary_path.unlink(missing_ok=True)


@contextmanager
def locked_state(path: Path):
    lock_path = path.with_name(f".{path.name}.lock")
    with lock_path.open("a+", encoding="utf-8") as handle:
        fcntl.flock(handle.fileno(), fcntl.LOCK_EX)
        yield
        fcntl.flock(handle.fileno(), fcntl.LOCK_UN)


def path_within(path: Path, root: Path) -> bool:
    try:
        path.relative_to(root)
        return True
    except ValueError:
        return False


def resolve_output(raw: str, base: Path) -> Path:
    candidate = Path(raw).expanduser()
    return (candidate if candidate.is_absolute() else base / candidate).resolve()


def validate_result(path: Path, stage_id: str, job_id: str, work_root: Path) -> None:
    try:
        result = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read job result {path}: {exc}") from exc
    if not isinstance(result, dict):
        raise ValueError(f"job result root must be an object: {path}")
    if (
        result.get("artifact_type") != "brand_pipeline_job_result"
        or result.get("stage") != stage_id
        or result.get("job_id") != job_id
        or result.get("status") != "completed"
    ):
        raise ValueError(f"job result identity does not match {stage_id}/{job_id}")
    for field in ("lineage", "unresolved_gaps", "files"):
        if not isinstance(result.get(field), list):
            raise ValueError(f"job result {field} must be an array: {path}")
    for raw in result["files"]:
        if not isinstance(raw, str) or not raw.strip():
            raise ValueError(f"job result files must contain non-empty paths: {path}")
        created = resolve_output(raw, work_root)
        if not path_within(created, work_root) or not created.is_file():
            raise ValueError(f"job-owned file is missing or outside its work directory: {raw}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Record one preplanned bounded parallel pipeline job as the root coordinator.")
    parser.add_argument("pipeline_directory_or_state")
    parser.add_argument("--stage", required=True, choices=("stage_1", "stage_2", "stage_3"))
    parser.add_argument("--job", required=True)
    parser.add_argument("--status", required=True, choices=tuple(sorted(STATUSES)))
    parser.add_argument("--owner", default="")
    parser.add_argument("--parallel-group", default="")
    parser.add_argument("--output", action="append", default=[])
    parser.add_argument("--note", default="")
    parser.add_argument("--wave", default="")
    parser.add_argument("--serial-fallback-reason", default="")
    args = parser.parse_args()

    path = state_path_from(args.pipeline_directory_or_state)
    try:
        with locked_state(path):
            state = load(path)
            if state.get("current_stage") != args.stage:
                raise ValueError(f"cannot update inactive Stage {args.stage}")
            stages = state.get("stages")
            stage = stages.get(args.stage) if isinstance(stages, dict) else None
            if not isinstance(stage, dict):
                raise ValueError(f"missing Stage state: {args.stage}")
            package = Path(str(stage.get("package_path", ""))).expanduser().resolve()
            if not package.is_dir():
                raise ValueError(f"Stage package does not exist: {package}")

            execution = state.get("execution")
            if not isinstance(execution, dict) or execution.get("mode") != "parallel_single_brand":
                raise ValueError("job tracking requires execution.mode=parallel_single_brand")
            jobs = execution.get("jobs")
            if not isinstance(jobs, list):
                raise ValueError("pipeline has no planned jobs; run plan_stage_jobs.py first")
            job = next((
                item for item in jobs
                if isinstance(item, dict)
                and item.get("stage") == args.stage
                and item.get("job_id") == args.job
            ), None)
            if job is None:
                raise ValueError(f"job is not in the fixed plan: {args.stage}/{args.job}")

            previous = str(job.get("status", "planned"))
            if args.status not in TRANSITIONS.get(previous, set()):
                raise ValueError(f"invalid job transition: {previous} -> {args.status}")
            if args.parallel_group and args.parallel_group != job.get("parallel_group"):
                raise ValueError("parallel group is locked by the fixed job plan")
            if args.wave and args.wave != job.get("wave"):
                raise ValueError("wave is locked by the fixed job plan")
            owner = args.owner.strip() or str(job.get("owner", "")).strip()
            if args.status in {"running", "completed"} and not owner:
                raise ValueError("running or completed jobs require an owner")
            if args.status in {"failed", "skipped"} and not (args.note.strip() or str(job.get("note", "")).strip()):
                raise ValueError(f"{args.status} jobs require a concise note")

            work_root = (package / ".work" / args.job).resolve()
            expected_raw = str(job.get("expected_output", "")).strip()
            expected_output = resolve_output(expected_raw, package) if expected_raw else None
            if expected_output and not path_within(expected_output, work_root):
                raise ValueError(f"expected output escaped its job work directory: {expected_output}")
            supplied_outputs = [resolve_output(raw, package) for raw in args.output]
            for output in supplied_outputs:
                if not path_within(output, work_root):
                    raise ValueError(f"job output escaped its work directory: {output}")

            if args.status == "completed":
                if expected_output is None or not expected_output.is_file():
                    raise ValueError(f"required job result is missing: {expected_output}")
                validate_result(expected_output, args.stage, args.job, work_root)
                for output in supplied_outputs:
                    if not output.is_file():
                        raise ValueError(f"job output is missing: {output}")

            job["status"] = args.status
            job["owner"] = owner
            if supplied_outputs:
                existing = job.get("outputs") if isinstance(job.get("outputs"), list) else []
                job["outputs"] = list(dict.fromkeys([
                    *existing,
                    *(str(item) for item in supplied_outputs),
                ]))
            if args.status == "completed" and expected_output is not None:
                existing = job.get("outputs") if isinstance(job.get("outputs"), list) else []
                job["outputs"] = list(dict.fromkeys([*existing, str(expected_output)]))
            if args.note:
                job["note"] = args.note.strip()
            if args.status == "running" and previous != "running":
                job["attempts"] = int(job.get("attempts", 0)) + 1
                job["started_at"] = now()
                job["finished_at"] = ""
            if args.status in {"completed", "failed", "skipped"}:
                job["finished_at"] = now()
            stage_jobs = [
                item for item in jobs
                if isinstance(item, dict) and item.get("stage") == args.stage
            ]
            next_job = next((
                item for item in stage_jobs
                if item.get("status") not in {"completed", "skipped"}
            ), None)
            execution["active_wave"] = (
                str(next_job.get("wave", next_job.get("parallel_group", "")))
                if next_job else f"{args.stage}_merge"
            )
            if args.serial_fallback_reason:
                if args.job != "serial_fallback" or args.status != "skipped":
                    raise ValueError("serial fallback reason belongs only to the skipped serial_fallback job")
                reasons = execution.get("serial_fallback_reason")
                if not isinstance(reasons, dict):
                    reasons = {}
                reasons[args.stage] = args.serial_fallback_reason.strip()
                execution["serial_fallback_reason"] = reasons

            state["updated_at"] = now()
            write_json_atomic(path, state)
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        print(f"ERROR: {exc}")
        return 1

    print(f"JOB={args.stage}/{args.job}")
    print(f"STATUS={args.status}")
    print(f"PIPELINE_STATE={path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
