#!/usr/bin/env python3
from __future__ import annotations

import argparse
import shutil
from pathlib import Path


ASSETS = (
    "research-brief.yaml",
    "source-manifest.csv",
    "visual-corpus.csv",
    "source-brand-anatomy.md",
    "grammar-kernel.md",
    "analysis-handoff.yaml",
    "analysis-status.yaml",
    "research-run.json",
    "stage-review.json",
)


def main() -> int:
    parser = argparse.ArgumentParser(description="Initialize a source-only brand analysis case.")
    parser.add_argument("analysis_directory")
    args = parser.parse_args()

    destination = Path(args.analysis_directory).expanduser().resolve()
    assets = Path(__file__).resolve().parent.parent / "assets"
    destination.mkdir(parents=True, exist_ok=True)
    for relative in ("evidence/images", "evidence/motion-frames", "contact-sheets", "validation", "outputs"):
        (destination / relative).mkdir(parents=True, exist_ok=True)

    for name in ASSETS:
        target = destination / name
        if target.exists():
            print(f"SKIP existing {target}")
            continue
        shutil.copy2(assets / name, target)
        print(f"CREATED {target}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
