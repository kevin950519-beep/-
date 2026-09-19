#!/usr/bin/env python3
"""Check a brand reconstruction dossier for required structure and traceability signals."""

from __future__ import annotations

import argparse
import re
from pathlib import Path


REQUIRED_HEADINGS = (
    "## 1. Executive synthesis",
    "## 2. Evidence and scope",
    "## 3. Source brand anatomy",
    "## 4. Positioning for the fictional product",
    "## 5. Verbal branding guidelines",
    "## 6. Visual branding guidelines",
    "## 7. Foundational design-token direction",
    "## 8. Brand and product image direction",
    "## 9. Source-to-target mapping",
    "## 10. Application examples",
    "## 11. Do / Don't",
    "## 12. Confidence, gaps, and validation plan",
    "## 13. Evidence index",
)
METADATA_LABELS = (
    "Reference brand and scope",
    "Fictional target product",
    "Transfer intensity",
    "Evidence coverage",
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("dossier", type=Path)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    dossier = args.dossier.expanduser().resolve()
    if not dossier.is_file():
        print(f"ERROR: dossier not found: {dossier}")
        return 1

    text = dossier.read_text(encoding="utf-8")
    errors: list[str] = []
    warnings: list[str] = []

    positions: list[int] = []
    present_headings = 0
    for heading in REQUIRED_HEADINGS:
        position = text.find(heading)
        if position < 0:
            errors.append(f"missing required heading: {heading}")
        else:
            present_headings += 1
            positions.append(position)
    if len(positions) == len(REQUIRED_HEADINGS) and positions != sorted(positions):
        errors.append("required headings are out of order")

    for label in METADATA_LABELS:
        pattern = re.compile(rf"^- {re.escape(label)}:\s*(.+)$", re.MULTILINE)
        if not pattern.search(text):
            errors.append(f"metadata is blank or missing: {label}")

    evidence_ids = sorted(set(re.findall(r"\bEV-[0-9]{3,}\b", text)))
    if not evidence_ids:
        errors.append("no evidence IDs found")

    label_count = {
        label: len(re.findall(rf"\b{label}\b", text, flags=re.IGNORECASE))
        for label in ("Observed", "Inferred", "Transferred")
    }
    for label, count in label_count.items():
        if count == 0:
            errors.append(f"no {label} label found")

    if not re.search(r"\b(high|medium|low)\b", text, flags=re.IGNORECASE):
        errors.append("no confidence level found")
    if not re.search(r"\b(directional|tested|validated)\b", text, flags=re.IGNORECASE):
        errors.append("no design-token validation status found")

    print(f"Dossier: {dossier}")
    print(f"Required headings: {present_headings}/{len(REQUIRED_HEADINGS)} present")
    print(f"Unique evidence IDs: {len(evidence_ids)}")
    print(
        "Evidence labels: "
        + ", ".join(f"{label}={count}" for label, count in label_count.items())
    )
    for warning in warnings:
        print(f"WARNING: {warning}")
    for error in errors:
        print(f"ERROR: {error}")
    print(f"Result: {'FAIL' if errors else 'PASS'}")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
