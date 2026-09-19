#!/usr/bin/env python3
from __future__ import annotations

import argparse
import shutil
from pathlib import Path


TARGETS = {
    "landing-input.json": "landing-input.json",
    "landing-materials.md": "landing-materials.md",
    "landing-materials.json": "outputs/landing-materials.json",
    "asset-registry.json": "asset-registry.json",
    "stage-review.json": "stage-review.json",
}


def main() -> int:
    parser = argparse.ArgumentParser(description="Initialize Stage 3 landing materials.")
    parser.add_argument("stage_3_directory")
    args = parser.parse_args()
    destination = Path(args.stage_3_directory).expanduser().resolve()
    assets = Path(__file__).resolve().parent.parent / "assets"
    for relative in ("outputs", "assets/product-renders", "prompts", "validation"):
        (destination / relative).mkdir(parents=True, exist_ok=True)
    for source_name, target_name in TARGETS.items():
        target = destination / target_name
        target.parent.mkdir(parents=True, exist_ok=True)
        if target.exists():
            print(f"SKIP existing {target}")
            continue
        shutil.copy2(assets / source_name, target)
        print(f"CREATED {target}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
