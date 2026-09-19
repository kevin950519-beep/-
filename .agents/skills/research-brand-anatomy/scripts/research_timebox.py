#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from datetime import datetime, timedelta, timezone
from pathlib import Path


def now() -> datetime:
    return datetime.now(timezone.utc)


def read_run(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read research run {path}: {exc}") from exc
    if not isinstance(value, dict) or value.get("artifact_type") != "brand_research_run":
        raise ValueError(f"invalid research run identity: {path}")
    return value


def write_run(path: Path, value: dict) -> None:
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def parse_time(value: object) -> datetime:
    if not isinstance(value, str) or not value:
        raise ValueError("research run has no started_at timestamp")
    return datetime.fromisoformat(value)


def main() -> int:
    parser = argparse.ArgumentParser(description="Track the Stage 1 research timebox.")
    parser.add_argument("action", choices=("start", "check", "complete"))
    parser.add_argument("analysis_directory")
    parser.add_argument("--mode", choices=("rapid", "expanded"), default="rapid")
    parser.add_argument("--minutes", type=int, default=10)
    parser.add_argument("--reason", default="coverage_complete")
    args = parser.parse_args()

    case = Path(args.analysis_directory).expanduser().resolve()
    path = case / "research-run.json"
    run = read_run(path)
    current = now()

    if args.action == "start":
        if args.minutes <= 0:
            raise ValueError("--minutes must be positive")
        if run.get("status") == "running":
            raise ValueError("research timer is already running")
        run.update({
            "mode": args.mode,
            "timebox_minutes": args.minutes,
            "started_at": current.isoformat(),
            "deadline_at": (current + timedelta(minutes=args.minutes)).isoformat(),
            "completed_at": None,
            "elapsed_seconds": None,
            "status": "running",
            "stop_reason": None,
        })
        write_run(path, run)
        print(f"STARTED mode={args.mode} deadline={run['deadline_at']}")
        return 0

    started = parse_time(run.get("started_at"))
    limit_seconds = int(run.get("timebox_minutes", 10)) * 60
    elapsed_seconds = max(0, round((current - started).total_seconds()))
    remaining_seconds = max(0, limit_seconds - elapsed_seconds)

    if args.action == "check":
        print(f"STATUS={run.get('status')} ELAPSED_SECONDS={elapsed_seconds} REMAINING_SECONDS={remaining_seconds}")
        return 2 if run.get("mode") == "rapid" and elapsed_seconds >= limit_seconds else 0

    exceeded = run.get("mode") == "rapid" and elapsed_seconds > limit_seconds
    run.update({
        "completed_at": current.isoformat(),
        "elapsed_seconds": elapsed_seconds,
        "status": "exceeded" if exceeded else "completed",
        "stop_reason": args.reason,
    })
    write_run(path, run)
    print(f"COMPLETED status={run['status']} elapsed_seconds={elapsed_seconds}")
    return 1 if exceeded else 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except ValueError as exc:
        print(f"ERROR: {exc}")
        raise SystemExit(1)
