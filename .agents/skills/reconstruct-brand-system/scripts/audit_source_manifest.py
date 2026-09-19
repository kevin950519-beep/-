#!/usr/bin/env python3
"""Validate source provenance and report research coverage."""

from __future__ import annotations

import argparse
import csv
import re
from collections import Counter
from datetime import date
from pathlib import Path


REQUIRED_COLUMNS = {
    "evidence_id",
    "title",
    "source_url",
    "local_path",
    "source_tier",
    "content_type",
    "visual_category",
    "captured_at",
    "relevance",
    "reliability",
    "status",
}
SOURCE_TIERS = {"primary", "authoritative-secondary", "contextual"}
LEVELS = {"high", "medium", "low"}
STATUSES = {"included", "excluded", "candidate"}
ID_PATTERN = re.compile(r"^EV-[0-9]{3,}$")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("manifest", type=Path)
    parser.add_argument("--min-visual", type=int, default=24)
    parser.add_argument("--min-visual-categories", type=int, default=4)
    return parser.parse_args()


def valid_iso_date(value: str) -> bool:
    try:
        date.fromisoformat(value)
    except ValueError:
        return False
    return True


def split_categories(value: str) -> list[str]:
    return [item.strip() for item in value.split("|") if item.strip()]


def main() -> int:
    args = parse_args()
    manifest = args.manifest.expanduser().resolve()
    if not manifest.is_file():
        print(f"ERROR: manifest not found: {manifest}")
        return 1

    with manifest.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle)
        fieldnames = set(reader.fieldnames or [])
        missing_columns = sorted(REQUIRED_COLUMNS - fieldnames)
        if missing_columns:
            print("ERROR: missing columns: " + ", ".join(missing_columns))
            return 1
        rows = list(reader)

    errors: list[str] = []
    warnings: list[str] = []
    seen_ids: set[str] = set()
    tiers: Counter[str] = Counter()
    content_types: Counter[str] = Counter()
    categories: Counter[str] = Counter()
    included_count = 0
    visual_count = 0

    for line_number, row in enumerate(rows, start=2):
        evidence_id = row["evidence_id"].strip()
        label = evidence_id or f"line {line_number}"
        status = row["status"].strip()

        if not ID_PATTERN.fullmatch(evidence_id):
            errors.append(f"{label}: evidence_id must match EV-001 style")
        elif evidence_id in seen_ids:
            errors.append(f"{label}: duplicate evidence_id")
        seen_ids.add(evidence_id)

        if status not in STATUSES:
            errors.append(f"{label}: invalid status '{status}'")
        if status != "included":
            continue

        included_count += 1
        tier = row["source_tier"].strip()
        content_type = row["content_type"].strip()
        row_categories = split_categories(row["visual_category"])
        tiers[tier] += 1
        content_types[content_type or "(blank)"] += 1
        categories.update(row_categories)

        if not row["title"].strip():
            errors.append(f"{label}: title is required")
        if not row["source_url"].strip() and not row["local_path"].strip():
            errors.append(f"{label}: source_url or local_path is required")
        if tier not in SOURCE_TIERS:
            errors.append(f"{label}: invalid source_tier '{tier}'")
        if not content_type:
            errors.append(f"{label}: content_type is required")
        captured_at = row["captured_at"].strip()
        if not captured_at or not valid_iso_date(captured_at):
            errors.append(f"{label}: captured_at must be an ISO date")
        for field in ("relevance", "reliability"):
            value = row[field].strip()
            if value not in LEVELS:
                errors.append(f"{label}: {field} must be high, medium, or low")

        local_path = row["local_path"].strip()
        if local_path:
            candidate = Path(local_path).expanduser()
            if not candidate.is_absolute():
                candidate = manifest.parent / candidate
            if not candidate.exists():
                errors.append(f"{label}: local_path does not exist: {local_path}")

        if row_categories:
            visual_count += 1

    if included_count == 0:
        errors.append("no included evidence rows")
    if tiers["primary"] == 0:
        warnings.append("no included primary source")
    if visual_count < args.min_visual:
        warnings.append(
            f"visual corpus has {visual_count} rows; default target is {args.min_visual}"
        )
    if len(categories) < args.min_visual_categories:
        warnings.append(
            f"visual corpus covers {len(categories)} categories; default target is "
            f"{args.min_visual_categories}"
        )

    print(f"Manifest: {manifest}")
    print(f"Included rows: {included_count}")
    print("Source tiers: " + (", ".join(f"{k}={v}" for k, v in tiers.items()) or "none"))
    print(
        "Content types: "
        + (", ".join(f"{k}={v}" for k, v in content_types.items()) or "none")
    )
    print(
        "Visual categories: "
        + (", ".join(f"{k}={v}" for k, v in categories.items()) or "none")
    )
    for warning in warnings:
        print(f"WARNING: {warning}")
    for error in errors:
        print(f"ERROR: {error}")
    print(f"Result: {'FAIL' if errors else 'PASS'}")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
