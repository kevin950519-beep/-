#!/usr/bin/env python3
"""Inspect locally registered images for validity, size, and exact duplicates."""

from __future__ import annotations

import argparse
import csv
import hashlib
from collections import Counter, defaultdict
from pathlib import Path


IMAGE_SUFFIXES = {".avif", ".bmp", ".gif", ".heic", ".jpeg", ".jpg", ".png", ".tif", ".tiff", ".webp"}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("manifest", type=Path)
    parser.add_argument("--min-width", type=int, default=800)
    parser.add_argument("--min-height", type=int, default=600)
    parser.add_argument("--min-images", type=int, default=24)
    parser.add_argument("--min-categories", type=int, default=4)
    return parser.parse_args()


def resolve_local_path(manifest: Path, value: str) -> Path:
    path = Path(value).expanduser()
    return path if path.is_absolute() else manifest.parent / path


def file_hash(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main() -> int:
    args = parse_args()
    try:
        from PIL import Image
    except ImportError:
        print("ERROR: Pillow is required: python3 -m pip install Pillow")
        return 1

    manifest = args.manifest.expanduser().resolve()
    if not manifest.is_file():
        print(f"ERROR: manifest not found: {manifest}")
        return 1

    with manifest.open(newline="", encoding="utf-8-sig") as handle:
        rows = list(csv.DictReader(handle))

    errors: list[str] = []
    warnings: list[str] = []
    categories: Counter[str] = Counter()
    hashes: dict[str, list[str]] = defaultdict(list)
    inspected = 0

    for row in rows:
        if row.get("status", "").strip() != "included":
            continue
        local_value = row.get("local_path", "").strip()
        if not local_value:
            continue
        path = resolve_local_path(manifest, local_value)
        if path.suffix.lower() not in IMAGE_SUFFIXES:
            continue

        evidence_id = row.get("evidence_id", "(unknown)").strip()
        if not path.is_file():
            errors.append(f"{evidence_id}: image not found: {path}")
            continue

        try:
            with Image.open(path) as image:
                image.verify()
            with Image.open(path) as image:
                width, height = image.size
        except Exception as exc:  # Pillow raises format-specific exceptions
            errors.append(f"{evidence_id}: unreadable image {path}: {exc}")
            continue

        inspected += 1
        hashes[file_hash(path)].append(evidence_id)
        for category in row.get("visual_category", "").split("|"):
            if category.strip():
                categories[category.strip()] += 1
        if width < args.min_width or height < args.min_height:
            warnings.append(
                f"{evidence_id}: low resolution {width}x{height} (target at least "
                f"{args.min_width}x{args.min_height})"
            )

    for evidence_ids in hashes.values():
        if len(evidence_ids) > 1:
            warnings.append("exact duplicate image: " + ", ".join(evidence_ids))

    if inspected < args.min_images:
        errors.append(
            f"local image count {inspected} is below required minimum {args.min_images}"
        )
    if len(categories) < args.min_categories:
        errors.append(
            f"visual category count {len(categories)} is below required minimum "
            f"{args.min_categories}"
        )

    print(f"Manifest: {manifest}")
    print(f"Inspected images: {inspected}")
    print(
        "Visual categories: "
        + (", ".join(f"{key}={value}" for key, value in categories.items()) or "none")
    )
    for warning in warnings:
        print(f"WARNING: {warning}")
    for error in errors:
        print(f"ERROR: {error}")
    print(f"Result: {'FAIL' if errors else 'PASS'}")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
