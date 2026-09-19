#!/usr/bin/env python3
from __future__ import annotations

import argparse
import copy
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path


EXPECTED_REVIEW_STAGE = {
    "stage_1": "source_brand_analysis",
    "stage_2": "extended_brand_anatomy",
    "stage_3": "landing_materials",
}
PARALLEL_JOB_PLAN = Path(__file__).resolve().parent.parent / "assets" / "parallel-job-plan.json"


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def load_json(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read JSON {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"JSON root must be an object: {path}")
    return value


def write_json(path: Path, value: dict) -> None:
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def state_path_from(value: str) -> Path:
    candidate = Path(value).expanduser().resolve()
    return candidate if candidate.name == "pipeline-state.json" else candidate / "pipeline-state.json"


def sync_registration(package: Path, project_root: Path, *, check: bool) -> bool:
    command = [
        "node",
        str(project_root / "scripts/brand-reports/finalize-brand-report.mjs"),
        str(package),
        "--registration-only",
    ]
    if check:
        command.append("--check")
    result = subprocess.run(command, text=True, capture_output=True, check=False, cwd=project_root)
    if result.stdout:
        print(result.stdout.rstrip())
    if result.stderr:
        print(result.stderr.rstrip(), file=sys.stderr)
    if result.returncode != 0:
        print("CHAIN_ACTION=STAY")
        print(
            "CHAIN_REASON=STORYBOOK_REGISTRATION_STALE"
            if check
            else "CHAIN_REASON=STORYBOOK_REGISTRATION_FAILED"
        )
        return False
    return True


def append_feedback(review: dict, decision: str, feedback: str) -> None:
    entries = review.get("user_feedback")
    if not isinstance(entries, list):
        entries = []
    entries.append({
        "decision": decision,
        "message": feedback.strip() or ("사용자 승인" if decision == "accepted" else "사용자 수정 요청"),
        "recorded_at": now(),
    })
    review["user_feedback"] = entries


def path_within(path: Path, root: Path) -> bool:
    try:
        path.relative_to(root)
        return True
    except ValueError:
        return False


def parallel_barrier_errors(state: dict, stage_id: str, package: Path) -> list[str]:
    execution = state.get("execution")
    if not isinstance(execution, dict) or execution.get("mode") != "parallel_single_brand":
        return []
    if execution.get("job_plan_version") != "1.0.0":
        return [f"{stage_id} has no fixed parallel job plan"]
    jobs = execution.get("jobs") if isinstance(execution.get("jobs"), list) else []
    stage_jobs = [item for item in jobs if isinstance(item, dict) and item.get("stage") == stage_id]
    reasons = execution.get("serial_fallback_reason")
    fallback = str(reasons.get(stage_id, "")).strip() if isinstance(reasons, dict) else ""
    if not stage_jobs and not fallback:
        return [f"{stage_id} has no parallel job record or serial fallback reason"]
    errors = []
    job_ids = [str(item.get("job_id", "")).strip() for item in stage_jobs]
    if not all(job_ids) or len(job_ids) != len(set(job_ids)):
        errors.append(f"{stage_id} parallel job ids are missing or duplicated")
    if fallback:
        if job_ids != ["serial_fallback"]:
            errors.append(f"{stage_id} serial fallback does not use the fixed fallback job")
    else:
        try:
            job_plan = load_json(PARALLEL_JOB_PLAN)
            expected_ids = [
                str(job.get("job_id", ""))
                for wave in job_plan.get("stages", {}).get(stage_id, {}).get("waves", [])
                for job in wave.get("jobs", [])
            ]
            if job_ids != expected_ids:
                errors.append(f"{stage_id} jobs do not match the fixed parallel manifest")
        except ValueError:
            errors.append("fixed parallel job manifest is unreadable")
    unfinished = [
        str(item.get("job_id", "?"))
        for item in stage_jobs
        if item.get("status") not in {"completed", "skipped"}
    ]
    if unfinished:
        errors.append(f"{stage_id} parallel jobs are not at the merge barrier: {', '.join(unfinished)}")
    if stage_jobs and all(item.get("status") == "skipped" for item in stage_jobs) and not fallback:
        errors.append(f"{stage_id} skipped every parallel job without a serial fallback reason")

    seen_outputs = set()
    for item in stage_jobs:
        job_id = str(item.get("job_id", "")).strip()
        if item.get("status") == "skipped":
            if not str(item.get("note", "")).strip():
                errors.append(f"{stage_id}/{job_id} skipped without a reason")
            continue
        if item.get("status") != "completed":
            continue
        work_root = (package / ".work" / job_id).resolve()
        expected_raw = str(item.get("expected_output", "")).strip()
        expected = Path(expected_raw).expanduser().resolve() if expected_raw else None
        if expected is None or not path_within(expected, work_root) or not expected.is_file():
            errors.append(f"{stage_id}/{job_id} required result is missing or outside its work directory")
            continue
        expected_key = str(expected)
        if expected_key in seen_outputs:
            errors.append(f"{stage_id} parallel jobs share an output: {expected}")
        seen_outputs.add(expected_key)
        try:
            result = load_json(expected)
        except ValueError:
            errors.append(f"{stage_id}/{job_id} result is not valid JSON")
            continue
        if (
            result.get("artifact_type") != "brand_pipeline_job_result"
            or result.get("stage") != stage_id
            or result.get("job_id") != job_id
            or result.get("status") != "completed"
        ):
            errors.append(f"{stage_id}/{job_id} result identity is invalid")
            continue
        for field in ("lineage", "unresolved_gaps", "files"):
            if not isinstance(result.get(field), list):
                errors.append(f"{stage_id}/{job_id} result {field} is not an array")
        recorded_outputs = item.get("outputs") if isinstance(item.get("outputs"), list) else []
        recorded_resolved = {
            str(Path(raw).expanduser().resolve())
            for raw in recorded_outputs
            if isinstance(raw, str) and raw.strip()
        }
        if expected_key not in recorded_resolved:
            errors.append(f"{stage_id}/{job_id} expected result was not recorded by the root")
        declared_files = result.get("files") if isinstance(result.get("files"), list) else []
        for raw in declared_files:
            if not isinstance(raw, str) or not raw.strip():
                errors.append(f"{stage_id}/{job_id} declares an invalid worker file")
                continue
            candidate = Path(raw).expanduser()
            created = (candidate if candidate.is_absolute() else work_root / candidate).resolve()
            if not path_within(created, work_root) or not created.is_file():
                errors.append(f"{stage_id}/{job_id} worker file is missing or outside its work directory")
    return errors


def wire_next_input(stage_id: str, source_package: Path, next_package: Path) -> None:
    if stage_id == "stage_1":
        input_path = next_package / "transfer-input.json"
        value = load_json(input_path)
        source = value.get("source_analysis")
        if not isinstance(source, dict):
            source = {}
        source.update({
            "package_path": str(source_package),
            "json_path": "outputs/source-brand-analysis.json",
            "review_path": "stage-review.json",
            "review_status": "accepted",
        })
        value["source_analysis"] = source
        write_json(input_path, value)
    elif stage_id == "stage_2":
        input_path = next_package / "landing-input.json"
        value = load_json(input_path)
        source = value.get("extended_brand_source")
        if not isinstance(source, dict):
            source = {}
        source.update({
            "package_path": str(source_package),
            "json_path": "outputs/extended-brand-anatomy.json",
            "asset_registry_path": "asset-registry.json",
            "review_path": "stage-review.json",
        })
        value["extended_brand_source"] = source
        write_json(input_path, value)


def main() -> int:
    parser = argparse.ArgumentParser(description="Record a user checkpoint decision and route the next brand skill.")
    parser.add_argument("pipeline_directory_or_state")
    parser.add_argument("--decision", choices=("accepted", "revision_requested"))
    parser.add_argument("--feedback", default="")
    args = parser.parse_args()

    state_path = state_path_from(args.pipeline_directory_or_state)
    try:
        state = load_json(state_path)
    except ValueError as exc:
        print(f"ERROR: {exc}")
        return 1
    if state.get("artifact_type") != "brand_pipeline_state":
        print("ERROR: invalid pipeline state identity")
        return 1
    if state.get("status") == "complete":
        print("CHAIN_ACTION=COMPLETE")
        print("CHAIN_REASON=PIPELINE_ALREADY_COMPLETE")
        return 0

    stage_id = str(state.get("current_stage", ""))
    stages = state.get("stages")
    stage = stages.get(stage_id) if isinstance(stages, dict) else None
    if not isinstance(stage, dict):
        print("ERROR: current stage is missing from pipeline state")
        return 1
    package = Path(str(stage.get("package_path", ""))).expanduser().resolve()
    review_path = package / str(stage.get("review_file", "stage-review.json"))
    try:
        review = load_json(review_path)
    except ValueError as exc:
        print(f"ERROR: {exc}")
        return 1
    original_review = copy.deepcopy(review)
    if review.get("artifact_type") != "stage_review" or review.get("stage") != EXPECTED_REVIEW_STAGE.get(stage_id):
        print(f"ERROR: invalid review identity for {stage_id}")
        return 1

    decision = args.decision or str(review.get("status", "pending"))
    if decision == "pending":
        print("CHAIN_ACTION=WAIT_FOR_USER")
        print(f"CURRENT_STAGE={stage_id}")
        print(f"CURRENT_SKILL={stage.get('skill', '')}")
        return 0
    if decision == "revision_requested":
        if args.decision:
            append_feedback(review, decision, args.feedback)
        review["status"] = "revision_requested"
        review["updated_at"] = now()
        review["pipeline_state_path"] = str(state_path)
        write_json(review_path, review)
        stage["status"] = "revision_required"
        state["status"] = "waiting_for_revision"
        state["pending_user_action"] = f"revise_{stage_id}"
        state["updated_at"] = now()
        write_json(state_path, state)
        print("CHAIN_ACTION=STAY")
        print("CHAIN_REASON=REVISION_REQUESTED")
        print(f"CURRENT_STAGE={stage_id}")
        print(f"CURRENT_SKILL={stage.get('skill', '')}")
        print(f"CURRENT_PACKAGE={package}")
        return 0
    if decision != "accepted":
        print(f"ERROR: unsupported review status: {decision}")
        return 1

    barrier_errors = parallel_barrier_errors(state, stage_id, package)
    if barrier_errors:
        for error in barrier_errors:
            print(f"ERROR: {error}")
        print("CHAIN_ACTION=STAY")
        print("CHAIN_REASON=PARALLEL_MERGE_BARRIER_INCOMPLETE")
        return 1

    skills_root = Path(__file__).resolve().parent.parent.parent
    project_root = skills_root.parent.parent
    if not sync_registration(package, project_root, check=True):
        return 1

    if args.decision:
        append_feedback(review, decision, args.feedback)
    review["status"] = "accepted"
    review["updated_at"] = now()
    review["pipeline_state_path"] = str(state_path)
    write_json(review_path, review)
    if not sync_registration(package, project_root, check=False):
        write_json(review_path, original_review)
        return 1
    stage["status"] = "accepted"
    stage["completed_at"] = now()

    next_stage_id = stage.get("next_stage")
    transition = {"from": stage_id, "to": next_stage_id, "decision": "accepted", "at": now()}
    log = state.get("transition_log")
    if not isinstance(log, list):
        log = []
    log.append(transition)
    state["transition_log"] = log
    state["updated_at"] = now()

    if not next_stage_id:
        state["status"] = "complete"
        state["pending_user_action"] = "none"
        write_json(state_path, state)
        print("CHAIN_ACTION=COMPLETE")
        print("COMPLETED_STAGE=stage_3")
        return 0

    next_stage = stages.get(next_stage_id)
    if not isinstance(next_stage, dict):
        print(f"ERROR: next stage is missing: {next_stage_id}")
        return 1
    next_stage["status"] = "active"
    next_stage["started_at"] = now()
    next_package = Path(str(next_stage.get("package_path", ""))).expanduser().resolve()
    try:
        wire_next_input(stage_id, package, next_package)
    except ValueError as exc:
        print(f"ERROR: could not wire next-stage input: {exc}")
        return 1
    next_review_path = next_package / str(next_stage.get("review_file", "stage-review.json"))
    if next_review_path.is_file():
        next_review = load_json(next_review_path)
        next_review["pipeline_state_path"] = str(state_path)
        write_json(next_review_path, next_review)
    state["current_stage"] = next_stage_id
    state["status"] = "active"
    state["pending_user_action"] = f"complete_{next_stage_id}"
    write_json(state_path, state)

    print("CHAIN_ACTION=CALL_SKILL" if state.get("auto_chain", True) else "CHAIN_ACTION=READY")
    print(f"COMPLETED_STAGE={stage_id}")
    print(f"NEXT_STAGE={next_stage_id}")
    print(f"NEXT_SKILL={next_stage.get('skill', '')}")
    print(f"INPUT_PACKAGE={package}")
    print(f"NEXT_PACKAGE={next_package}")
    print(f"PIPELINE_STATE={state_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
