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


PLAN_SCHEMA_VERSION = "1.0.0"


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def state_path_from(value: str) -> Path:
    candidate = Path(value).expanduser().resolve()
    return candidate if candidate.name == "pipeline-state.json" else candidate / "pipeline-state.json"


def load_json(path: Path) -> dict:
    value = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise ValueError(f"JSON root must be an object: {path}")
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


def plan_path() -> Path:
    return Path(__file__).resolve().parent.parent / "assets" / "parallel-job-plan.json"


def relative_result_path(job_id: str) -> str:
    return f".work/{job_id}/result.json"


def write_job_spec(package: Path, stage_id: str, wave: dict, job: dict) -> Path:
    job_id = str(job["job_id"])
    work_directory = package / ".work" / job_id
    work_directory.mkdir(parents=True, exist_ok=True)
    result_path = work_directory / "result.json"
    spec_path = work_directory / "job-spec.json"
    spec = {
        "schema_version": PLAN_SCHEMA_VERSION,
        "artifact_type": "brand_pipeline_job_spec",
        "stage": stage_id,
        "wave": wave["wave_id"],
        "job_id": job_id,
        "parallel_group": job["parallel_group"],
        "task": job["task"],
        "work_directory": str(work_directory),
        "result_path": str(result_path),
        "acceptance_conditions": job["acceptance_conditions"],
        "result_contract": {
            "artifact_type": "brand_pipeline_job_result",
            "status": "completed",
            "required_arrays": ["lineage", "unresolved_gaps", "files"],
        },
    }
    if spec_path.is_file():
        existing = load_json(spec_path)
        if existing != spec:
            raise ValueError(f"job spec drifted: {spec_path}")
    else:
        write_json_atomic(spec_path, spec)
    return result_path


def planned_job(stage_id: str, wave: dict, job: dict, result_path: Path) -> dict:
    return {
        "stage": stage_id,
        "job_id": job["job_id"],
        "parallel_group": job["parallel_group"],
        "wave": wave["wave_id"],
        "owner": "",
        "status": "planned",
        "attempts": 0,
        "started_at": "",
        "finished_at": "",
        "expected_output": str(result_path),
        "outputs": [],
        "note": "",
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Create the fixed bounded job plan for one active brand Stage.")
    parser.add_argument("pipeline_directory_or_state")
    parser.add_argument("--stage", choices=("stage_1", "stage_2", "stage_3"))
    parser.add_argument("--serial-fallback-reason", default="")
    args = parser.parse_args()

    state_path = state_path_from(args.pipeline_directory_or_state)
    try:
        plan = load_json(plan_path())
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        print(f"ERROR: cannot read parallel job plan: {exc}")
        return 1
    if (
        plan.get("artifact_type") != "brand_parallel_job_plan"
        or plan.get("schema_version") != PLAN_SCHEMA_VERSION
    ):
        print("ERROR: invalid parallel job plan identity")
        return 1

    try:
        with locked_state(state_path):
            state = load_json(state_path)
            if state.get("artifact_type") != "brand_pipeline_state":
                raise ValueError("invalid brand pipeline state")
            stage_id = args.stage or str(state.get("current_stage", ""))
            if stage_id != state.get("current_stage"):
                raise ValueError(f"cannot plan inactive Stage {stage_id}")
            stages = state.get("stages")
            stage = stages.get(stage_id) if isinstance(stages, dict) else None
            if not isinstance(stage, dict):
                raise ValueError(f"missing Stage state: {stage_id}")
            package = Path(str(stage.get("package_path", ""))).expanduser().resolve()
            if not package.is_dir():
                raise ValueError(f"Stage package does not exist: {package}")
            execution = state.get("execution")
            if not isinstance(execution, dict) or execution.get("mode") != "parallel_single_brand":
                raise ValueError("job planning requires execution.mode=parallel_single_brand")
            jobs = execution.get("jobs")
            if not isinstance(jobs, list):
                jobs = []
                execution["jobs"] = jobs
            existing_stage_jobs = [
                item for item in jobs
                if isinstance(item, dict) and item.get("stage") == stage_id
            ]

            if args.serial_fallback_reason.strip():
                if existing_stage_jobs:
                    raise ValueError(f"cannot replace an existing {stage_id} job plan with serial fallback")
                reason = args.serial_fallback_reason.strip()
                fallback = {
                    "stage": stage_id,
                    "job_id": "serial_fallback",
                    "parallel_group": "",
                    "wave": "serial_fallback",
                    "owner": "root",
                    "status": "skipped",
                    "attempts": 0,
                    "started_at": "",
                    "finished_at": now(),
                    "expected_output": "",
                    "outputs": [],
                    "note": reason,
                }
                jobs.append(fallback)
                reasons = execution.get("serial_fallback_reason")
                if not isinstance(reasons, dict):
                    reasons = {}
                reasons[stage_id] = reason
                execution["serial_fallback_reason"] = reasons
                execution["active_wave"] = "serial_fallback"
                execution["job_plan_version"] = PLAN_SCHEMA_VERSION
                stage_plans = execution.get("stage_plans")
                if not isinstance(stage_plans, dict):
                    stage_plans = {}
                stage_plans[stage_id] = {
                    "plan_version": PLAN_SCHEMA_VERSION,
                    "planned_at": now(),
                    "lock": "serial fallback",
                    "job_ids": ["serial_fallback"],
                }
                execution["stage_plans"] = stage_plans
                state["updated_at"] = now()
                write_json_atomic(state_path, state)
                print(f"PLANNED_STAGE={stage_id}")
                print("JOBS=serial_fallback")
                print(f"PIPELINE_STATE={state_path}")
                return 0

            stage_plan = plan.get("stages", {}).get(stage_id)
            if not isinstance(stage_plan, dict):
                raise ValueError(f"missing fixed job plan for {stage_id}")
            planned = []
            for wave in stage_plan.get("waves", []):
                for job in wave.get("jobs", []):
                    result_path = write_job_spec(package, stage_id, wave, job)
                    planned.append(planned_job(stage_id, wave, job, result_path))
            expected_ids = [item["job_id"] for item in planned]
            existing_ids = [str(item.get("job_id", "")) for item in existing_stage_jobs]
            if existing_stage_jobs:
                if existing_ids != expected_ids:
                    raise ValueError(f"existing {stage_id} job plan does not match the fixed manifest")
            else:
                jobs.extend(planned)
            selected_jobs = existing_stage_jobs or planned
            next_job = next((
                item for item in selected_jobs
                if item.get("status") not in {"completed", "skipped"}
            ), None)
            execution["job_plan_version"] = PLAN_SCHEMA_VERSION
            execution["active_wave"] = (
                str(next_job.get("wave", next_job.get("parallel_group", "")))
                if next_job else f"{stage_id}_merge"
            )
            stage_plans = execution.get("stage_plans")
            if not isinstance(stage_plans, dict):
                stage_plans = {}
            prior_plan = stage_plans.get(stage_id) if isinstance(stage_plans.get(stage_id), dict) else {}
            stage_plans[stage_id] = {
                "plan_version": PLAN_SCHEMA_VERSION,
                "planned_at": prior_plan.get("planned_at") or now(),
                "lock": stage_plan.get("lock", ""),
                "job_ids": expected_ids,
            }
            execution["stage_plans"] = stage_plans
            state["updated_at"] = now()
            write_json_atomic(state_path, state)
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        print(f"ERROR: {exc}")
        return 1

    print(f"PLANNED_STAGE={stage_id}")
    print(f"JOBS={','.join(expected_ids)}")
    print(f"PIPELINE_STATE={state_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
