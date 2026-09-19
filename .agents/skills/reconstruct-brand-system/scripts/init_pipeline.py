#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path


STAGE_DEFAULTS = {
    "stage_1": "01-source-brand",
    "stage_2": "02-extended-brand",
    "stage_3": "03-landing-materials",
}


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, value: dict) -> None:
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def set_review_link(package: Path, state_path: Path) -> None:
    review_path = package / "stage-review.json"
    if not review_path.is_file():
        return
    review = load_json(review_path)
    review["pipeline_state_path"] = str(state_path)
    write_json(review_path, review)


def scaffold_packages(package_paths: dict[str, Path]) -> bool:
    skills_root = Path(__file__).resolve().parent.parent.parent
    commands = {
        "stage_1": [sys.executable, str(skills_root / "research-brand-anatomy/scripts/init_analysis.py"), str(package_paths["stage_1"])],
        "stage_2": [sys.executable, str(skills_root / "build-brand-from-anatomy/scripts/init_transfer.py"), str(package_paths["stage_2"])],
        "stage_3": [sys.executable, str(skills_root / "build-landing-materials/scripts/init_landing.py"), str(package_paths["stage_3"])],
    }
    for stage_id, command in commands.items():
        result = subprocess.run(command, text=True, capture_output=True, check=False)
        if result.stdout:
            print(result.stdout.rstrip())
        if result.stderr:
            print(result.stderr.rstrip(), file=sys.stderr)
        if result.returncode != 0:
            print(f"ERROR: could not scaffold {stage_id}")
            return False
    return True


def main() -> int:
    parser = argparse.ArgumentParser(description="Initialize the reviewed three-stage brand pipeline.")
    parser.add_argument("pipeline_directory")
    parser.add_argument("--stage-1-package")
    parser.add_argument("--stage-2-package")
    parser.add_argument("--stage-3-package")
    parser.add_argument("--no-auto-chain", action="store_true")
    parser.add_argument(
        "--enable-image-parallelism",
        action="store_true",
        help="Allow at most two concurrent external image workers after a provider pilot passes.",
    )
    args = parser.parse_args()

    pipeline = Path(args.pipeline_directory).expanduser().resolve()
    pipeline.mkdir(parents=True, exist_ok=True)
    state_path = pipeline / "pipeline-state.json"
    if state_path.exists():
        print(f"ERROR: pipeline state already exists: {state_path}")
        return 1

    provided = {
        "stage_1": args.stage_1_package,
        "stage_2": args.stage_2_package,
        "stage_3": args.stage_3_package,
    }
    package_paths: dict[str, Path] = {}
    for stage_id, default_name in STAGE_DEFAULTS.items():
        raw = provided[stage_id]
        package = Path(raw).expanduser().resolve() if raw else pipeline / default_name
        package.mkdir(parents=True, exist_ok=True)
        package_paths[stage_id] = package

    if not scaffold_packages(package_paths):
        return 1

    template = Path(__file__).resolve().parent.parent / "assets" / "pipeline-state.json"
    state = load_json(template)
    timestamp = now()
    state["auto_chain"] = not args.no_auto_chain
    state["created_at"] = timestamp
    state["updated_at"] = timestamp
    image_parallelism = state["execution"].get("image_parallelism")
    if isinstance(image_parallelism, dict) and args.enable_image_parallelism:
        image_parallelism["mode"] = "enabled"
    state["stages"]["stage_1"]["started_at"] = timestamp
    for stage_id, package in package_paths.items():
        state["stages"][stage_id]["package_path"] = str(package)
    write_json(state_path, state)

    for package in package_paths.values():
        set_review_link(package, state_path)

    print(f"PIPELINE_STATE={state_path}")
    print(f"CURRENT_STAGE={state['current_stage']}")
    print(f"CURRENT_SKILL={state['stages'][state['current_stage']]['skill']}")
    print(f"CURRENT_PACKAGE={state['stages'][state['current_stage']]['package_path']}")
    print(f"IMAGE_PARALLELISM={state['execution']['image_parallelism']['mode']}")
    print("CHAIN_ACTION=CALL_SKILL")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
