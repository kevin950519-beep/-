#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from datetime import datetime
from pathlib import Path


def state_path_from(value: str) -> Path:
    candidate = Path(value).expanduser().resolve()
    return candidate if candidate.name == "pipeline-state.json" else candidate / "pipeline-state.json"


def parse_timestamp(value: object) -> datetime | None:
    text = str(value or "").strip()
    if not text:
        return None
    try:
        return datetime.fromisoformat(text.replace("Z", "+00:00"))
    except ValueError:
        return None


def duration_seconds(started: object, finished: object) -> float | None:
    start = parse_timestamp(started)
    finish = parse_timestamp(finished)
    if start is None or finish is None or finish < start:
        return None
    return round((finish - start).total_seconds(), 3)


def main() -> int:
    parser = argparse.ArgumentParser(description="Summarize measured parallel job and wave durations without changing pipeline state.")
    parser.add_argument("pipeline_directory_or_state")
    parser.add_argument("--stage", choices=("stage_1", "stage_2", "stage_3"))
    args = parser.parse_args()

    state_path = state_path_from(args.pipeline_directory_or_state)
    try:
        state = json.loads(state_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(f"ERROR: cannot read pipeline state: {exc}")
        return 1
    if not isinstance(state, dict) or state.get("artifact_type") != "brand_pipeline_state":
        print("ERROR: invalid brand pipeline state")
        return 1

    execution = state.get("execution") if isinstance(state.get("execution"), dict) else {}
    jobs = execution.get("jobs") if isinstance(execution.get("jobs"), list) else []
    selected = [
        item for item in jobs
        if isinstance(item, dict) and (args.stage is None or item.get("stage") == args.stage)
    ]
    job_metrics = []
    for item in selected:
        job_metrics.append({
            "stage": item.get("stage"),
            "wave": item.get("wave") or item.get("parallel_group"),
            "job_id": item.get("job_id"),
            "status": item.get("status"),
            "attempts": item.get("attempts", 0),
            "duration_seconds": duration_seconds(item.get("started_at"), item.get("finished_at")),
        })

    wave_metrics = []
    wave_keys = list(dict.fromkeys(
        (item["stage"], item["wave"])
        for item in job_metrics
        if item["wave"]
    ))
    for stage_id, wave_id in wave_keys:
        source_jobs = [
            item for item in selected
            if item.get("stage") == stage_id
            and (item.get("wave") or item.get("parallel_group")) == wave_id
        ]
        starts = [parse_timestamp(item.get("started_at")) for item in source_jobs]
        finishes = [parse_timestamp(item.get("finished_at")) for item in source_jobs]
        valid_starts = [item for item in starts if item is not None]
        valid_finishes = [item for item in finishes if item is not None]
        wall_seconds = None
        if valid_starts and valid_finishes:
            wall_seconds = round((max(valid_finishes) - min(valid_starts)).total_seconds(), 3)
        worker_seconds = sum(
            value for value in (
                duration_seconds(item.get("started_at"), item.get("finished_at"))
                for item in source_jobs
            )
            if value is not None
        )
        wave_metrics.append({
            "stage": stage_id,
            "wave": wave_id,
            "job_count": len(source_jobs),
            "wall_seconds": wall_seconds,
            "worker_seconds": round(worker_seconds, 3),
        })

    summary = {
        "schema_version": "1.0.0",
        "artifact_type": "brand_parallel_run_summary",
        "pipeline_state": str(state_path),
        "stage_filter": args.stage or "all",
        "job_count": len(job_metrics),
        "jobs": job_metrics,
        "waves": wave_metrics,
    }
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
