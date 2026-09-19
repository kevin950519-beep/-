#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path

from validate_transfer import direction_errors, input_errors, nonempty, source_errors


def object_at(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}
    return value if isinstance(value, dict) else {}


def extended_errors(case: Path) -> list[str]:
    errors: list[str] = []
    model_path = case / "outputs" / "extended-brand-anatomy.json"
    for path in (case / "extended-brand-anatomy.md", model_path):
        if not path.is_file() or not path.stat().st_size:
            errors.append(f"missing canonical Stage 2 artifact {path.name}")

    model = object_at(model_path)
    if model.get("artifact_type") != "extended_brand_anatomy":
        errors.append("Stage 2 JSON artifact_type must be extended_brand_anatomy")

    registry = object_at(case / "asset-registry.json")
    registry_v11 = str(registry.get("schema_version", "")).startswith("1.1")
    assets = registry.get("assets") if isinstance(registry.get("assets"), list) else []
    expected_roles = {"representative_product_hero", "brand_mood"}
    roles = {str(item.get("role", "")) for item in assets if isinstance(item, dict)}
    if roles != expected_roles:
        errors.append("Stage 2 registry must contain exactly product-hero and brand-mood roles")
    registered_ids: list[str] = []
    for item in assets:
        if not isinstance(item, dict):
            errors.append("Stage 2 asset registry contains a non-object item")
            continue
        for field in ("asset_id", "role", "file_path", "prompt_path", "subject", "aspect_ratio", "generation_provenance", "invariants", "status"):
            if not nonempty(item.get(field)):
                errors.append(f"Stage 2 asset {item.get('asset_id', '?')} has blank {field}")
        if registry_v11:
            for field in ("communication_job", "reference_lineage", "allowed_variation", "invariant_check"):
                if not nonempty(item.get(field)):
                    errors.append(f"Stage 2 schema 1.1 asset {item.get('asset_id', '?')} has blank {field}")
            if item.get("invariant_check") != "pass":
                errors.append(f"Stage 2 schema 1.1 asset {item.get('asset_id', '?')} invariant_check must be pass")
        if item.get("status") != "registered":
            errors.append(f"Stage 2 asset {item.get('asset_id', '?')} is not registered")
        for field in ("file_path", "prompt_path"):
            value = str(item.get(field, "")).strip()
            if value and not (case / value).is_file():
                errors.append(f"Stage 2 asset {item.get('asset_id', '?')} has missing {field}")
        if nonempty(item.get("asset_id")):
            registered_ids.append(str(item["asset_id"]))

    if set(model.get("registered_anchor_assets", [])) != set(registered_ids):
        errors.append("Stage 2 JSON registered_anchor_assets does not match asset registry")
    review = object_at(case / "stage-review.json")
    if review.get("artifact_type") != "stage_review" or review.get("stage") != "extended_brand_anatomy":
        errors.append("Stage 2 stage-review.json has invalid identity")
    if review.get("status") not in {"pending", "accepted", "revision_requested"}:
        errors.append("Stage 2 stage-review.json has invalid status")
    if not nonempty(review.get("review_targets")) or not nonempty(review.get("adjustment_prompts")):
        errors.append("Stage 2 review lacks targets or adjustment prompts")
    return errors


def source_review_errors(case: Path) -> list[str]:
    transfer_input = object_at(case / "transfer-input.json")
    source = transfer_input.get("source_analysis") if isinstance(transfer_input.get("source_analysis"), dict) else {}
    package_value = str(source.get("package_path", "")).strip()
    package = Path(package_value).expanduser().resolve() if package_value else Path()
    review_path = str(source.get("review_path", "stage-review.json")).strip()
    review = object_at(package / review_path) if package_value else {}
    if review:
        if review.get("status") != "accepted":
            return ["Stage 1 source review must be accepted before Stage 2"]
        return []
    if str(source.get("review_status", "")).strip().lower() != "accepted":
        return ["legacy source package needs explicit accepted review_status"]
    return []


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate Stage 2 extended brand anatomy.")
    parser.add_argument("stage_2_directory")
    parser.add_argument("stage", choices=("source", "input", "direction", "assets", "current", "all"))
    args = parser.parse_args()
    case = Path(args.stage_2_directory).expanduser().resolve()
    errors: list[str] = []
    if args.stage in {"source", "all"}:
        errors.extend(source_errors(case))
        errors.extend(source_review_errors(case))
    if args.stage in {"input", "current", "all"}:
        errors.extend(input_errors(case))
    if args.stage in {"direction", "current", "all"}:
        errors.extend(direction_errors(case))
    if args.stage in {"assets", "current", "all"}:
        errors.extend(extended_errors(case))
    print(f"Extended brand anatomy: {case}")
    print(f"Stage: {args.stage}")
    for error in errors:
        print(f"ERROR: {error}")
    print(f"Result: {'FAIL' if errors else 'PASS'}")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
