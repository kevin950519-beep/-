#!/usr/bin/env python3
"""Initialize a brand reconstruction case from the bundled templates."""

from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path


TEMPLATES = (
    "case-brief.yaml",
    "source-manifest.csv",
    "visual-corpus.csv",
    "source-brand-anatomy.md",
    "grammar-kernel.md",
    "target-category-evidence.csv",
    "mapping-matrix.csv",
    "brand-dossier.md",
    "stage-status.yaml",
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Create a case directory without overwriting existing templates."
    )
    parser.add_argument("case_directory", type=Path)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    case_dir = args.case_directory.expanduser().resolve()
    assets_dir = Path(__file__).resolve().parents[1] / "assets"

    case_dir.mkdir(parents=True, exist_ok=True)
    for relative in (
        "evidence/images",
        "evidence/motion-frames",
        "evidence/text",
        "contact-sheets/by-category",
        "validation",
        "outputs",
    ):
        (case_dir / relative).mkdir(parents=True, exist_ok=True)

    created: list[Path] = []
    skipped: list[Path] = []
    for template_name in TEMPLATES:
        source = assets_dir / template_name
        target = case_dir / template_name
        if target.exists():
            skipped.append(target)
            continue
        shutil.copy2(source, target)
        created.append(target)

    print(f"Case directory: {case_dir}")
    for path in created:
        print(f"created  {path.relative_to(case_dir)}")
    for path in skipped:
        print(f"skipped  {path.relative_to(case_dir)} (already exists)")

    if not created and skipped:
        print("No templates were overwritten.", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
