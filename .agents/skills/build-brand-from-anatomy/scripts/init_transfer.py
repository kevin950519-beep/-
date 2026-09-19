#!/usr/bin/env python3
from __future__ import annotations

import argparse
import shutil
from pathlib import Path


ASSET_TARGETS = {
    "transfer-input.json": "transfer-input.json",
    "extended-brand-anatomy.md": "extended-brand-anatomy.md",
    "brand-transfer-direction.json": "outputs/extended-brand-anatomy.json",
    "asset-registry.json": "asset-registry.json",
    "stage-review.json": "stage-review.json",
}


def main() -> int:
    parser = argparse.ArgumentParser(description="Initialize a concise brand-transfer direction case.")
    parser.add_argument("transfer_directory")
    args = parser.parse_args()

    destination = Path(args.transfer_directory).expanduser().resolve()
    assets = Path(__file__).resolve().parent.parent / "assets"
    (destination / "outputs").mkdir(parents=True, exist_ok=True)
    (destination / "validation").mkdir(parents=True, exist_ok=True)
    (destination / "assets" / "brand-mood").mkdir(parents=True, exist_ok=True)
    (destination / "assets" / "product-hero").mkdir(parents=True, exist_ok=True)
    (destination / "prompts").mkdir(parents=True, exist_ok=True)

    for source_name, target_name in ASSET_TARGETS.items():
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
