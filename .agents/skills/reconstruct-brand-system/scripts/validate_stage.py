#!/usr/bin/env python3
"""Validate hard phase gates for a brand reconstruction case."""

from __future__ import annotations

import argparse
import csv
import re
import subprocess
import sys
from pathlib import Path


ANATOMY_HEADINGS = (
    "## 1. Strategic anatomy",
    "## 2. Verbal anatomy",
    "## 3. Visual primitives",
    "## 4. Composition grammar",
    "## 5. Image language",
    "## 6. Product and service behavior",
    "## 7. System synthesis",
    "## Evidence index",
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("case_directory", type=Path)
    parser.add_argument(
        "stage",
        choices=(
            "evidence",
            "visual",
            "source-anatomy",
            "grammar",
            "target-evidence",
            "mapping",
            "dossier",
            "audit",
        ),
    )
    parser.add_argument("--min-images", type=int, default=8)
    parser.add_argument("--min-visual-candidates", type=int, default=8)
    parser.add_argument("--min-categories", type=int, default=4)
    return parser.parse_args()


def read_csv(path: Path) -> list[dict[str, str]]:
    if not path.is_file():
        return []
    with path.open(newline="", encoding="utf-8-sig") as handle:
        return list(csv.DictReader(handle))


def split_values(value: str) -> set[str]:
    return {item.strip() for item in value.split("|") if item.strip()}


def is_visual_content(row: dict[str, str]) -> bool:
    content_type = row.get("content_type", "").strip().lower()
    return any(
        marker in content_type
        for marker in ("image", "photo", "video", "motion", "visual_asset")
    )


def require_fields(
    rows: list[dict[str, str]], fields: tuple[str, ...], errors: list[str], prefix: str
) -> None:
    for index, row in enumerate(rows, start=2):
        label = row.get("evidence_id", "").strip() or f"line {index}"
        for field in fields:
            if not row.get(field, "").strip():
                errors.append(f"{prefix} {label}: blank {field}")


def main() -> int:
    args = parse_args()
    case = args.case_directory.expanduser().resolve()
    errors: list[str] = []

    if not case.is_dir():
        print(f"ERROR: case directory not found: {case}")
        return 1

    if args.stage == "evidence":
        rows = read_csv(case / "source-manifest.csv")
        included = [row for row in rows if row.get("status", "").strip() == "included"]
        structural = [
            row
            for row in included
            if not is_visual_content(row)
        ]
        primary = [
            row
            for row in structural
            if row.get("source_tier", "").strip() == "primary"
        ]
        visual_candidates = [
            row
            for row in included
            if is_visual_content(row)
        ]
        visual_categories = set().union(
            *(split_values(row.get("visual_category", "")) for row in visual_candidates)
        ) if visual_candidates else set()
        ids = [row.get("evidence_id", "").strip() for row in included]
        if len(ids) != len(set(ids)):
            errors.append("included source manifest contains duplicate evidence IDs")
        require_fields(
            included,
            (
                "evidence_id",
                "title",
                "source_tier",
                "content_type",
                "captured_at",
                "relevance",
                "reliability",
            ),
            errors,
            "source",
        )
        for row in included:
            if not row.get("source_url", "").strip() and not row.get("local_path", "").strip():
                errors.append(f"source {row.get('evidence_id', '(unknown)')}: no URL or local path")
        if len(structural) < 4:
            errors.append(f"structural source count {len(structural)} < 4")
        if len(primary) < 3:
            errors.append(f"primary structural source count {len(primary)} < 3")
        if len(visual_candidates) < args.min_visual_candidates:
            errors.append(
                f"visual candidate count {len(visual_candidates)} < {args.min_visual_candidates}"
            )
        if len(visual_categories) < args.min_categories:
            errors.append(
                f"visual candidate category count {len(visual_categories)} < {args.min_categories}"
            )

    elif args.stage == "visual":
        rows = read_csv(case / "visual-corpus.csv")
        included = [row for row in rows if row.get("status", "").strip() == "included"]
        local = [row for row in included if row.get("local_path", "").strip()]
        categories = {
            category.strip()
            for row in local
            for category in row.get("visual_category", "").split("|")
            if category.strip()
        }
        ids = [row.get("evidence_id", "").strip() for row in included]
        hashes = [row.get("sha256", "").strip() for row in local]
        if len(ids) != len(set(ids)):
            errors.append("visual corpus contains duplicate evidence IDs")
        if hashes and len(hashes) != len(set(hashes)):
            errors.append("visual corpus contains exact duplicate SHA-256 values")
        require_fields(
            local,
            (
                "evidence_id",
                "local_path",
                "source_url",
                "title",
                "visual_category",
                "channel",
                "width",
                "height",
                "mime_type",
                "sha256",
                "source_tier",
                "credit",
                "rights_notes",
                "subject_role",
                "human_presence",
                "setting",
                "composition",
                "camera_lens",
                "lighting",
                "palette_temperature",
                "material_texture",
                "post_production",
                "motion_behavior",
                "channel_role",
                "exception_notes",
                "analysis_notes",
            ),
            errors,
            "visual",
        )
        for row in local:
            value = row.get("local_path", "").strip()
            path = Path(value).expanduser()
            if not path.is_absolute():
                path = case / path
            if not path.is_file():
                errors.append(f"visual {row.get('evidence_id', '(unknown)')}: missing {value}")
            if not row.get("published_at", "").strip() and not row.get("brand_era", "").strip():
                errors.append(
                    f"visual {row.get('evidence_id', '(unknown)')}: blank published_at and brand_era"
                )
        if len(set(hashes)) < args.min_images:
            errors.append(f"unique local image count {len(set(hashes))} < {args.min_images}")
        if len(categories) < args.min_categories:
            errors.append(
                f"visual category count {len(categories)} < {args.min_categories}"
            )
        if not (case / "contact-sheets" / "overview.jpg").is_file():
            errors.append("missing contact-sheets/overview.jpg")
        category_sheets = list((case / "contact-sheets" / "by-category").glob("*.jpg"))
        if len(category_sheets) < args.min_categories:
            errors.append(
                f"category contact-sheet count {len(category_sheets)} < {args.min_categories}"
            )

    elif args.stage == "source-anatomy":
        path = case / "source-brand-anatomy.md"
        text = path.read_text(encoding="utf-8") if path.is_file() else ""
        if not text:
            errors.append("missing source-brand-anatomy.md")
        for heading in ANATOMY_HEADINGS:
            if heading not in text:
                errors.append(f"missing heading: {heading}")
        if re.search(r"\bTransferred\b", text, re.IGNORECASE):
            errors.append("source anatomy contains forbidden Transferred claim")
        if not re.search(r"\bObserved\b", text):
            errors.append("source anatomy contains no Observed label")
        if not re.search(r"\bInferred\b", text):
            errors.append("source anatomy contains no Inferred label")
        evidence_ids = set(re.findall(r"EV-\d{3,}", text))
        if len(evidence_ids) < 8:
            errors.append(f"source anatomy unique evidence ID count {len(evidence_ids)} < 8")
        if "contact-sheets/" not in text:
            errors.append("source anatomy does not link an EV-labeled contact sheet")
        if not (case / "contact-sheets" / "overview.jpg").is_file():
            errors.append("source anatomy gate requires contact-sheets/overview.jpg")
        for signal in ("Confidence", "Alternative", "Exception"):
            if signal not in text:
                errors.append(f"source anatomy contains no {signal} field")
        claim_lines = [
            line for line in text.splitlines() if re.match(r"^\|\s*CL-\d{3,}\s*\|", line)
        ]
        claim_ids = {
            match.group(0)
            for line in claim_lines
            if (match := re.search(r"CL-\d{3,}", line))
        }
        if len(claim_ids) < 8:
            errors.append(f"completed core claim count {len(claim_ids)} < 8")
        for line in claim_lines:
            claim_id = re.search(r"CL-\d{3,}", line).group(0)
            supports = set(re.findall(r"EV-\d{3,}", line))
            if "Inferred" in line and len(supports) < 2:
                errors.append(f"{claim_id}: Inferred claim has fewer than two EV supports")
            if "Observed" not in line and "Inferred" not in line:
                errors.append(f"{claim_id}: missing Observed/Inferred label")
        grammar_lines = [
            line for line in text.splitlines() if re.match(r"^\|\s*GK-\d{2}\s*\|", line)
        ]
        grammar_candidates = {
            match.group(0)
            for line in grammar_lines
            if (match := re.search(r"GK-\d{2}", line))
        }
        if len(grammar_candidates) < 4 or len(grammar_candidates) > 6:
            errors.append(
                f"source anatomy grammar candidate count {len(grammar_candidates)} is outside 4–6"
            )
        for line in grammar_lines:
            rule_id = re.search(r"GK-\d{2}", line).group(0)
            if len(set(re.findall(r"EV-\d{3,}", line))) < 2:
                errors.append(f"{rule_id}: grammar candidate has fewer than two EV supports")
        metadata_patterns = (
            r"^- Reference brand and scope:[^\S\r\n]*\S+",
            r"^- Markets, channels, language, and era:[^\S\r\n]*\S+",
            r"^- Research and capture dates:[^\S\r\n]*\S+",
            r"^- Structural evidence threshold and result:[^\S\r\n]*\S+",
            r"^- Visual corpus threshold and result:[^\S\r\n]*\S+",
        )
        for pattern in metadata_patterns:
            if not re.search(pattern, text, re.MULTILINE):
                errors.append(f"source anatomy metadata is blank: {pattern.split(':')[0][2:]}")

    elif args.stage == "grammar":
        path = case / "grammar-kernel.md"
        text = path.read_text(encoding="utf-8") if path.is_file() else ""
        rule_ids = set(re.findall(r"GK-\d{2}", text))
        if len(rule_ids) < 4 or len(rule_ids) > 6:
            errors.append(f"grammar rule count {len(rule_ids)} is outside 4–6")
        if not re.search(r"EV-\d{3}", text):
            errors.append("grammar contains no evidence IDs")
        for signal in (
            "Input condition",
            "Transformation",
            "Intended effect",
            "Confidence",
            "Alternative explanation",
            "Exception",
            "Copy-risk boundary",
            "## Productive tensions",
            "## Protected surface signatures",
        ):
            if signal not in text:
                errors.append(f"grammar missing required signal: {signal}")

    elif args.stage == "target-evidence":
        rows = read_csv(case / "target-category-evidence.csv")
        included = [row for row in rows if row.get("status", "").strip() == "included"]
        require_fields(
            included,
            (
                "evidence_id",
                "title",
                "source_tier",
                "content_type",
                "category_dimension",
                "captured_at",
                "relevance",
                "reliability",
            ),
            errors,
            "target evidence",
        )
        if len(included) < 8:
            errors.append(f"target-category evidence count {len(included)} < 8")
        dimensions = {
            token.lower().replace("_", "-")
            for row in included
            for token in split_values(row.get("category_dimension", ""))
        }
        required_groups = {
            "safety": {"safety"},
            "usability/accessibility": {"usability", "accessibility"},
            "engineering": {"engineering", "manufacturing", "materials"},
            "service": {"service", "maintenance", "repair"},
            "regulation/rights": {"regulation", "rights", "legal"},
            "category convention": {"category-convention", "category convention"},
        }
        for label, aliases in required_groups.items():
            if not dimensions.intersection(aliases):
                errors.append(f"target-category evidence missing dimension: {label}")

    elif args.stage == "mapping":
        rows = read_csv(case / "mapping-matrix.csv")
        included = [row for row in rows if any(value.strip() for value in row.values())]
        real_rows = [row for row in included if row.get("source_signal", "").strip()]
        grammar_text = (case / "grammar-kernel.md").read_text(encoding="utf-8")
        rule_ids = set(re.findall(r"GK-\d{2}", grammar_text))
        require_fields(
            real_rows,
            (
                "mapping_id",
                "source_signal",
                "evidence_ids",
                "semantic_function",
                "grammar_rule",
                "target_constraint",
                "translated_expression",
                "copy_risk",
                "rejected_source_traits",
                "confidence",
                "validation_needed",
                "decision_status",
            ),
            errors,
            "mapping",
        )
        mapped_rules = {row.get("grammar_rule", "").strip() for row in real_rows}
        if len(real_rows) < 5:
            errors.append(f"mapping row count {len(real_rows)} < 5")
        missing_rules = sorted(rule_ids - mapped_rules)
        if missing_rules:
            errors.append("unmapped grammar rules: " + ", ".join(missing_rules))

    elif args.stage == "dossier":
        dossier = case / "brand-dossier.md"
        if not dossier.is_file():
            errors.append("missing brand-dossier.md")
        else:
            validator = Path(__file__).resolve().parent / "validate_dossier.py"
            result = subprocess.run(
                [sys.executable, str(validator), str(dossier)],
                capture_output=True,
                text=True,
                check=False,
            )
            if result.returncode:
                errors.append("validate_dossier.py failed")
                for line in result.stdout.splitlines():
                    if line.startswith("ERROR:"):
                        errors.append(line.removeprefix("ERROR: "))

    elif args.stage == "audit":
        candidates = sorted((case / "validation").glob("*fidelity*audit*.md"))
        if not candidates:
            errors.append("missing fidelity audit in validation/")
        else:
            text = candidates[-1].read_text(encoding="utf-8")
            score_matches = re.findall(r"(?<!\d)(\d{1,3})\s*/\s*100", text)
            score = max((int(value) for value in score_matches), default=-1)
            if score < 85:
                errors.append(f"fidelity audit score {score}/100 < 85/100")
            verdict = re.search(
                r"## Verdict\s*\n+\s*(?:\*\*)?\s*(pass(?:-with-revisions)?|fail)\b",
                text,
                re.IGNORECASE,
            )
            if not verdict:
                errors.append("fidelity audit contains no parseable Verdict section")
            elif verdict.group(1).lower() == "fail":
                errors.append("fidelity audit verdict is fail")
            critical = re.search(
                r"## Critical failures\s*\n(.*?)(?=\n## |\Z)",
                text,
                re.DOTALL | re.IGNORECASE,
            )
            if critical and re.search(r"^\s*-\s+(?!none\b|없음\b)", critical.group(1), re.MULTILINE | re.IGNORECASE):
                errors.append("fidelity audit contains a critical failure")

    print(f"Case: {case}")
    print(f"Stage: {args.stage}")
    for error in errors:
        print(f"ERROR: {error}")
    print(f"Result: {'FAIL' if errors else 'PASS'}")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
