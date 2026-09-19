#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path


def object_at(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}
    return value if isinstance(value, dict) else {}


def nonempty(value) -> bool:
    if isinstance(value, str):
        return bool(value.strip())
    if isinstance(value, (list, dict)):
        return bool(value)
    return value is not None


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate Stage 3 landing materials.")
    parser.add_argument("stage_3_directory")
    args = parser.parse_args()
    case = Path(args.stage_3_directory).expanduser().resolve()
    errors: list[str] = []
    landing_input = object_at(case / "landing-input.json")
    input_v11 = str(landing_input.get("schema_version", "")).startswith("1.1")
    source = landing_input.get("extended_brand_source") if isinstance(landing_input.get("extended_brand_source"), dict) else {}
    package_value = str(source.get("package_path", "")).strip()
    package = Path(package_value).expanduser().resolve() if package_value else Path()
    stage2 = object_at(package / str(source.get("json_path", "outputs/extended-brand-anatomy.json"))) if package_value else {}
    review = object_at(package / str(source.get("review_path", "stage-review.json"))) if package_value else {}
    if stage2.get("artifact_type") != "extended_brand_anatomy":
        errors.append("accepted extended-brand anatomy is missing")
    if review.get("status") != "accepted":
        errors.append("Stage 2 review must be accepted")
    if input_v11:
        for key in ("landing_goal", "goal_source", "selected_narrative_route"):
            if not nonempty(landing_input.get(key)):
                errors.append(f"Stage 3 schema 1.1 input has blank {key}")

    model_path = case / "outputs" / "landing-materials.json"
    model = object_at(model_path)
    if not (case / "landing-materials.md").is_file() or not model:
        errors.append("canonical landing material outputs are incomplete")
    if model.get("artifact_type") != "landing_materials":
        errors.append("landing JSON artifact_type must be landing_materials")
    model_v11 = str(model.get("schema_version", "")).startswith("1.1")
    for key in ("extended_brand_source", "landing_narrative", "brand_value", "brand_story", "product_introduction", "product_lineup_copy", "section_map", "registered_product_assets", "boundaries"):
        if not nonempty(model.get(key)):
            errors.append(f"landing JSON has blank {key}")
    if model_v11:
        for key in ("selected_narrative_route", "message_visual_map"):
            if not nonempty(model.get(key)):
                errors.append(f"Stage 3 schema 1.1 landing JSON has blank {key}")
        if model.get("selected_narrative_route") != landing_input.get("selected_narrative_route"):
            errors.append("Stage 3 selected narrative route does not match landing input")
        narrative = model.get("landing_narrative") if isinstance(model.get("landing_narrative"), dict) else {}
        brand_value = model.get("brand_value") if isinstance(model.get("brand_value"), dict) else {}
        product_intro = model.get("product_introduction") if isinstance(model.get("product_introduction"), dict) else {}
        if not nonempty(narrative.get("brand_message")):
            errors.append("Stage 3 schema 1.1 landing narrative has blank brand_message")
        if not nonempty(brand_value.get("values")):
            errors.append("Stage 3 schema 1.1 brand value has blank values")
        if not nonempty(product_intro.get("family_usp")):
            errors.append("Stage 3 schema 1.1 product introduction has blank family_usp")

    stage2_lineup = stage2.get("sections", {}).get("landing_product_concept", {}).get("product_lineup", []) if stage2 else []
    stage2_names = {str(item.get("product_name", "")).strip() for item in stage2_lineup if isinstance(item, dict)}
    lineup_copy = model.get("product_lineup_copy") if isinstance(model.get("product_lineup_copy"), list) else []
    copy_names = {str(item.get("product_name", "")).strip() for item in lineup_copy if isinstance(item, dict)}
    extension = landing_input.get("lineup_extension") if isinstance(landing_input.get("lineup_extension"), dict) else {}
    extension_authorized = extension.get("authorized") is True
    if extension_authorized:
        if extension.get("preserve_stage_2_products") is not True:
            errors.append("authorized Stage 3 lineup extension must preserve Stage 2 products")
        if not stage2_names.issubset(copy_names):
            errors.append("authorized Stage 3 lineup extension is missing a Stage 2 product")
        try:
            target_lineup_count = int(extension.get("target_lineup_count", 0))
        except (TypeError, ValueError):
            target_lineup_count = 0
        if target_lineup_count < len(stage2_names) or len(copy_names) != target_lineup_count:
            errors.append("authorized Stage 3 lineup extension does not match target_lineup_count")
    elif stage2_names != copy_names:
        errors.append("landing product-lineup copy does not match Stage 2 lineup")
    for item in lineup_copy:
        if not isinstance(item, dict):
            errors.append("landing product-lineup copy contains a non-object")
            continue
        for field in ("product_name", "eyebrow", "headline", "description", "feature_copy", "proof_copy", "cta"):
            if not nonempty(item.get(field)):
                errors.append(f"landing lineup item {item.get('product_name', '?')} has blank {field}")
        if model_v11 and not nonempty(item.get("product_usp")):
            errors.append(f"Stage 3 schema 1.1 lineup item {item.get('product_name', '?')} has blank product_usp")
        if extension_authorized:
            product_name = str(item.get("product_name", "")).strip()
            expected_group = "individual_product" if product_name in stage2_names else "workspace_template_module"
            if item.get("lineup_group") != expected_group:
                errors.append(f"authorized Stage 3 lineup item {product_name or '?'} must use lineup_group {expected_group}")

    registry = object_at(case / "asset-registry.json")
    registry_v11 = str(registry.get("schema_version", "")).startswith("1.1")
    assets = registry.get("assets") if isinstance(registry.get("assets"), list) else []
    if len(assets) < len(copy_names):
        errors.append("landing product renders must cover every lineup product")
    registered_ids: set[str] = set()
    rendered_product_names: set[str] = set()
    for item in assets:
        if not isinstance(item, dict):
            errors.append("landing asset registry contains a non-object")
            continue
        for field in ("asset_id", "product_name", "role", "file_path", "prompt_path", "generation_provenance", "invariants", "status"):
            if not nonempty(item.get(field)):
                errors.append(f"landing asset {item.get('asset_id', '?')} has blank {field}")
        if registry_v11:
            for field in ("communication_job", "reference_lineage", "allowed_variation", "invariant_check"):
                if not nonempty(item.get(field)):
                    errors.append(f"Stage 3 schema 1.1 asset {item.get('asset_id', '?')} has blank {field}")
            if item.get("invariant_check") != "pass":
                errors.append(f"Stage 3 schema 1.1 asset {item.get('asset_id', '?')} invariant_check must be pass")
        if item.get("status") != "registered":
            errors.append(f"landing asset {item.get('asset_id', '?')} is not registered")
        for field in ("file_path", "prompt_path"):
            value = str(item.get(field, "")).strip()
            if value and not (case / value).is_file():
                errors.append(f"landing asset {item.get('asset_id', '?')} has missing {field}")
        asset_id = str(item.get("asset_id", "")).strip()
        if asset_id:
            registered_ids.add(asset_id)
        product_name = str(item.get("product_name", "")).strip()
        if product_name:
            rendered_product_names.add(product_name)
    if not copy_names.issubset(rendered_product_names):
        errors.append("landing product renders do not cover every landing lineup entry")
    if set(model.get("registered_product_assets", [])) != registered_ids:
        errors.append("landing JSON registered_product_assets does not match registry")
    mapped_ids: set[str] = set()
    for section in model.get("section_map", []) if isinstance(model.get("section_map"), list) else []:
        if not isinstance(section, dict):
            errors.append("landing section map contains a non-object")
            continue
        asset_id = str(section.get("asset_id", "")).strip()
        if asset_id not in registered_ids:
            errors.append("landing section map references an unregistered asset")
        elif asset_id:
            mapped_ids.add(asset_id)
        if model_v11:
            for field in ("section", "communication_job", "copy", "proof_of", "asset_id", "cta"):
                if not nonempty(section.get(field)):
                    errors.append(f"Stage 3 schema 1.1 section map has blank {field}")
    if model_v11 and mapped_ids != registered_ids:
        errors.append("Stage 3 schema 1.1 must map every registered asset to a landing section")
    final_review = object_at(case / "stage-review.json")
    if final_review.get("artifact_type") != "stage_review" or final_review.get("stage") != "landing_materials":
        errors.append("landing stage-review.json has invalid identity")
    if final_review.get("status") not in {"pending", "accepted", "revision_requested"}:
        errors.append("landing stage-review.json has invalid status")
    for error in errors:
        print(f"ERROR: {error}")
    print(f"Result: {'FAIL' if errors else 'PASS'}")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
