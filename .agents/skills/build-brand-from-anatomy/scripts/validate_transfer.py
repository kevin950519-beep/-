#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any


SECTION_KEYS = (
    "source_grammar_application",
    "brand_positioning",
    "landing_product_concept",
    "verbal_branding_and_copy_hierarchy",
    "visual_branding_and_key_visual",
    "brand_mood_and_brand_imagery",
    "product_visual_traits_and_product_imagery",
    "design_token_direction",
)
MOODBOARD_KEYS = (
    "copywriting",
    "hierarchy",
    "brand_mood_images",
    "product_description",
    "product_image_generation",
)
TOKEN_RELATIONSHIPS = {"keep", "tune", "new"}
TOKEN_FIELDS = ("role", "relationship", "source_basis", "target_direction", "landing_use", "status")
TYPOGRAPHY_ROLES = {"display", "h1", "h2", "h3", "body", "label", "caption"}
TYPOGRAPHY_FIELDS = (
    "font_family", "font_source_id", "font_size", "font_weight", "line_height", "letter_spacing", "specimen",
)
DISALLOWED_KEYS = {
    "approval_questions",
    "component_system",
    "component_guidance",
    "css_architecture",
    "engineering_requirements",
    "full_user_journey",
    "methodology_and_evidence",
    "mvp_roadmap",
    "production_handoff",
    "service_model",
}


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8") if path.is_file() else ""


def json_object(path: Path) -> dict[str, Any]:
    if not path.is_file():
        return {}
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return {}
    return value if isinstance(value, dict) else {}


def nested(data: dict[str, Any], *keys: str) -> Any:
    value: Any = data
    for key in keys:
        if not isinstance(value, dict):
            return None
        value = value.get(key)
    return value


def nonempty(value: Any) -> bool:
    if value is None:
        return False
    if isinstance(value, str):
        return bool(value.strip())
    if isinstance(value, (list, dict, tuple, set)):
        return bool(value)
    return True


def is_v11(model: dict[str, Any]) -> bool:
    return str(model.get("schema_version", "")).startswith("1.1")


def all_keys(value: Any) -> set[str]:
    found: set[str] = set()
    if isinstance(value, dict):
        for key, child in value.items():
            found.add(str(key))
            found.update(all_keys(child))
    elif isinstance(value, list):
        for child in value:
            found.update(all_keys(child))
    return found


def source_errors(case: Path) -> list[str]:
    errors: list[str] = []
    transfer_input = json_object(case / "transfer-input.json")
    source = nested(transfer_input, "source_analysis")
    if not isinstance(source, dict):
        return ["transfer-input.json has no source_analysis record"]

    reference_brand = str(source.get("reference_brand", "")).strip()
    package_value = str(source.get("package_path", "")).strip()
    if not reference_brand:
        errors.append("transfer input has blank source reference_brand")
    if not package_value:
        errors.append("transfer input has blank source package_path")
        return errors

    package = Path(package_value).expanduser().resolve()
    if not package.is_dir():
        errors.append("source analysis package_path is not a directory")
        return errors

    json_path = str(source.get("json_path", "outputs/source-brand-analysis.json"))
    source_model = json_object(package / json_path)
    if not source_model:
        errors.append("source analysis JSON is missing or invalid")
        return errors
    if source_model.get("artifact_type") != "source_brand_analysis":
        errors.append("source JSON artifact_type is not source_brand_analysis")
    actual_brand = str(nested(source_model, "brand", "name") or "").strip()
    if reference_brand and actual_brand.casefold() != reference_brand.casefold():
        errors.append("source JSON brand name does not match transfer brief")
    for key in ("analysis_layers", "design_system", "grammar_rules", "handoff", "downstream_contract"):
        if not nonempty(source_model.get(key)):
            errors.append(f"source JSON lacks core {key}")
    if str(source_model.get("schema_version", "")).startswith("1.2") and not nonempty(source_model.get("verbal_branding")):
        errors.append("source JSON schema 1.2 lacks core verbal_branding")
    if nested(source_model, "handoff", "target_direction") is not None:
        errors.append("source JSON already contains a target direction")
    return errors


def input_errors(case: Path) -> list[str]:
    errors: list[str] = []
    model = json_object(case / "transfer-input.json")
    if not model:
        return ["transfer-input.json is missing or invalid"]
    if model.get("artifact_type") != "brand_transfer_input":
        errors.append("transfer input artifact_type is invalid")
    if model.get("status") != "ready":
        errors.append("transfer input status must be ready")

    source = model.get("source_analysis") if isinstance(model.get("source_analysis"), dict) else {}
    for key in ("reference_brand", "package_path", "json_path"):
        if not nonempty(source.get(key)):
            errors.append(f"transfer input source_analysis has blank {key}")

    product = model.get("product") if isinstance(model.get("product"), dict) else {}
    for key in ("category", "product_mode", "audience", "use_contexts", "desired_outcome", "priorities"):
        if not nonempty(product.get(key)):
            errors.append(f"transfer input product has blank {key}")
    mode = str(product.get("product_mode", "")).lower()
    if mode not in {"physical", "digital", "hybrid", "mixed"}:
        errors.append("transfer input product_mode is invalid")
    if not product.get("known_facts") and product.get("open_concept") is not True:
        errors.append("transfer input needs known product facts or open_concept true")

    relationship = model.get("source_relationship") if isinstance(model.get("source_relationship"), dict) else {}
    for key in ("qualities_to_apply", "traits_to_avoid"):
        if not nonempty(relationship.get(key)):
            errors.append(f"transfer input source_relationship has blank {key}")

    preferences = model.get("token_preferences") if isinstance(model.get("token_preferences"), dict) else {}
    for key in ("color", "typography", "spacing", "layout"):
        value = str(preferences.get(key, "")).lower()
        if value not in TOKEN_RELATIONSHIPS:
            errors.append(f"transfer input token preference {key} must be keep, tune, or new")
    if not nonempty(model.get("user_response_excerpts")):
        errors.append("transfer input has no user response excerpts")
    if is_v11(model):
        for key in ("understood_direction", "lineup_mode", "visual_priority", "landing_goal"):
            if not nonempty(model.get(key)):
                errors.append(f"transfer input has blank {key}")
        if str(model.get("lineup_mode", "")) not in {"single_product", "focused_family", "exploratory_family"}:
            errors.append("transfer input lineup_mode is invalid")
    return errors


def direction_errors(case: Path) -> list[str]:
    errors: list[str] = []
    markdown_path = case / "extended-brand-anatomy.md"
    if not markdown_path.is_file():
        markdown_path = case / "brand-transfer-direction.md"
    json_path = case / "outputs" / "extended-brand-anatomy.json"
    if not json_path.is_file():
        json_path = case / "outputs" / "brand-transfer-direction.json"
    markdown = read(markdown_path)
    model = json_object(json_path)

    if not markdown:
        errors.append("brand-transfer-direction.md is missing or empty")
    else:
        for number in range(1, 9):
            if not re.search(rf"(?m)^##\s+{number}\.\s+", markdown):
                errors.append(f"direction Markdown missing section {number}")
        if re.search(r"(?m)^##\s+(?:9|1[0-9])\.\s+", markdown):
            errors.append("direction Markdown contains a numbered section after section 8")
        if re.search(r"approval questions|production handoff", markdown, re.IGNORECASE):
            errors.append("direction Markdown contains approval questions or production handoff")

    if not model:
        return errors + ["brand-transfer-direction.json is missing or invalid"]
    if model.get("artifact_type") not in {"brand_transfer_direction", "extended_brand_anatomy"}:
        errors.append("direction JSON artifact_type must be extended_brand_anatomy")
    if not str(model.get("schema_version", "")).startswith("1."):
        errors.append("direction JSON requires a supported 1.x schema")
    for key in ("source_analysis", "target", "sections", "moodboard_inputs", "boundaries"):
        if not nonempty(model.get(key)):
            errors.append(f"direction JSON missing {key}")

    target = model.get("target") if isinstance(model.get("target"), dict) else {}
    for key in ("category", "product_mode", "audience", "use_contexts", "direction_status"):
        if not nonempty(target.get(key)):
            errors.append(f"direction JSON target has blank {key}")
    mode = str(target.get("product_mode", "")).lower()
    if mode not in {"physical", "digital", "hybrid", "mixed"}:
        errors.append("direction JSON target product_mode is invalid")

    sections = model.get("sections") if isinstance(model.get("sections"), dict) else {}
    if set(sections) != set(SECTION_KEYS):
        missing = sorted(set(SECTION_KEYS) - set(sections))
        extra = sorted(set(sections) - set(SECTION_KEYS))
        if missing:
            errors.append(f"direction JSON sections missing {missing}")
        if extra:
            errors.append(f"direction JSON sections contain extra records {extra}")

    grammar_application = sections.get("source_grammar_application") if isinstance(sections.get("source_grammar_application"), dict) else {}
    for key in ("summary", "decisions"):
        if not nonempty(grammar_application.get(key)):
            errors.append(f"source-grammar application has blank {key}")

    positioning = sections.get("brand_positioning") if isinstance(sections.get("brand_positioning"), dict) else {}
    for key in ("category_frame", "audience", "user_outcome", "positioning_statement", "promise", "proof"):
        if not nonempty(positioning.get(key)):
            errors.append(f"brand positioning has blank {key}")

    product = sections.get("landing_product_concept") if isinstance(sections.get("landing_product_concept"), dict) else {}
    for key in ("one_line_definition", "user_and_use_situation", "core_value", "landing_features", "product_family", "product_lineup", "hero_product", "form_cues", "proof_image_roles"):
        if not nonempty(product.get(key)):
            errors.append(f"landing product concept has blank {key}")
    features = product.get("landing_features") if isinstance(product.get("landing_features"), list) else []
    if not 1 <= len(features) <= 4:
        errors.append("landing product concept must contain one to four landing features")
    product_family = product.get("product_family") if isinstance(product.get("product_family"), dict) else {}
    for key in ("working_name", "promise", "shared_architecture", "differentiation_logic", "status"):
        if not nonempty(product_family.get(key)):
            errors.append(f"landing product family has blank {key}")
    lineup = product.get("product_lineup") if isinstance(product.get("product_lineup"), list) else []
    lineup_fields = (
        "product_name",
        "product_type",
        "lineup_role",
        "use_case",
        "differentiator",
        "form_cues",
        "landing_message",
        "image_roles",
    )
    for index, item in enumerate(lineup, start=1):
        if not isinstance(item, dict):
            errors.append(f"product lineup item {index} is not an object")
            continue
        for field in lineup_fields:
            if not nonempty(item.get(field)):
                errors.append(f"product lineup item {index} has blank {field}")
    variants = product.get("necessary_variants") if isinstance(product.get("necessary_variants"), list) else []
    if variants and len(lineup) < 1 + len(variants):
        errors.append("product lineup does not include the hero product and every necessary variant")
    if is_v11(model):
        for index, item in enumerate(lineup, start=1):
            if isinstance(item, dict):
                for field in ("product_usp", "allowed_variation"):
                    if not nonempty(item.get(field)):
                        errors.append(f"Stage 2 schema 1.1 product lineup item {index} has blank {field}")
        invariants = product_family.get("shared_invariants") if isinstance(product_family.get("shared_invariants"), list) else []
        if not 3 <= len(invariants) <= 5:
            errors.append("Stage 2 schema 1.1 product family needs three to five shared invariants")
        if not nonempty(product_family.get("cognitive_invariants")):
            errors.append("Stage 2 schema 1.1 product family has blank cognitive_invariants")
        lineup_mode = str(product.get("lineup_mode", ""))
        expected_counts = {
            "single_product": range(1, 2),
            "focused_family": range(2, 4),
            "exploratory_family": range(3, 7),
        }
        if lineup_mode not in expected_counts:
            errors.append("Stage 2 schema 1.1 landing product concept has invalid lineup_mode")
        elif len(lineup) not in expected_counts[lineup_mode]:
            errors.append(f"Stage 2 schema 1.1 lineup count does not match {lineup_mode}")
    if markdown and not re.search(r"product lineup|제품 라인업", markdown, re.IGNORECASE):
        errors.append("direction Markdown has no explicit product lineup")
    for item in lineup:
        if not isinstance(item, dict):
            continue
        product_name = str(item.get("product_name", "")).strip()
        if product_name and product_name not in markdown:
            errors.append(f"direction Markdown does not include product lineup item {product_name}")
    form_cues = product.get("form_cues") if isinstance(product.get("form_cues"), dict) else {}
    mode_key = mode if mode in {"physical", "digital", "hybrid"} else "shared"
    if not nonempty(form_cues.get("shared")) and not nonempty(form_cues.get(mode_key)):
        errors.append("landing product concept lacks form cues for its product mode")

    verbal = sections.get("verbal_branding_and_copy_hierarchy") if isinstance(sections.get("verbal_branding_and_copy_hierarchy"), dict) else {}
    for key in ("voice", "vocabulary", "message_hierarchy", "headline_direction", "supporting_copy_direction", "cta_direction"):
        if not nonempty(verbal.get(key)):
            errors.append(f"verbal branding has blank {key}")
    if is_v11(model):
        for key in ("brand_purpose", "brand_essence", "brand_message", "brand_values", "family_usp", "product_usps", "selected_narrative_route", "message_visual_map"):
            if not nonempty(verbal.get(key)):
                errors.append(f"Stage 2 schema 1.1 verbal branding has blank {key}")
        values = verbal.get("brand_values") if isinstance(verbal.get("brand_values"), list) else []
        if not 2 <= len(values) <= 3:
            errors.append("Stage 2 schema 1.1 requires two or three brand values")
        product_usps = verbal.get("product_usps") if isinstance(verbal.get("product_usps"), list) else []
        usp_names = {str(item.get("product_name", "")).strip() for item in product_usps if isinstance(item, dict) and nonempty(item.get("usp"))}
        lineup_names = {str(item.get("product_name", "")).strip() for item in lineup if isinstance(item, dict)}
        if usp_names != lineup_names:
            errors.append("Stage 2 schema 1.1 product USPs do not match the product lineup")
        routes = verbal.get("narrative_routes") if isinstance(verbal.get("narrative_routes"), list) else []
        if routes and not 2 <= len(routes) <= 3:
            errors.append("Stage 2 schema 1.1 narrative_routes must contain two or three distinct routes")
        selected = str(verbal.get("selected_narrative_route", "")).strip()
        route_ids = {str(item.get("route_id", "")).strip() for item in routes if isinstance(item, dict)}
        if route_ids and selected not in route_ids:
            errors.append("Stage 2 selected narrative route is not present in narrative_routes")
        visual_map = verbal.get("message_visual_map") if isinstance(verbal.get("message_visual_map"), dict) else {}
        for key in ("brand_message_to_key_visual", "brand_values_to_brand_mood", "family_and_product_usp_to_product_imagery"):
            if not nonempty(visual_map.get(key)):
                errors.append(f"Stage 2 schema 1.1 message_visual_map has blank {key}")

    visual = sections.get("visual_branding_and_key_visual") if isinstance(sections.get("visual_branding_and_key_visual"), dict) else {}
    for key in ("identity_behavior", "premise", "focal_actor", "type_message_image_product_ui_relationship", "repeatable_variables"):
        if not nonempty(visual.get(key)):
            errors.append(f"visual branding and key visual has blank {key}")
    if is_v11(model):
        for key in ("communication_job", "series_rule"):
            if not nonempty(visual.get(key)):
                errors.append(f"Stage 2 schema 1.1 key visual has blank {key}")

    brand_mood = sections.get("brand_mood_and_brand_imagery") if isinstance(sections.get("brand_mood_and_brand_imagery"), dict) else {}
    for key in ("emotional_and_cultural_register", "world_setting_people", "materials_and_sensory_cues", "camera_light_color", "image_series_roles"):
        if not nonempty(brand_mood.get(key)):
            errors.append(f"brand mood and imagery has blank {key}")
    if is_v11(model) and not nonempty(brand_mood.get("communication_job")):
        errors.append("Stage 2 schema 1.1 brand mood has blank communication_job")

    product_visual = sections.get("product_visual_traits_and_product_imagery") if isinstance(sections.get("product_visual_traits_and_product_imagery"), dict) else {}
    if is_v11(model) and not nonempty(product_visual.get("communication_job")):
        errors.append("Stage 2 schema 1.1 product imagery has blank communication_job")
    visual_traits = product_visual.get("product_visual_traits") if isinstance(product_visual.get("product_visual_traits"), dict) else {}
    trait_fields = (
        "silhouette_or_screen_anatomy",
        "proportion_hierarchy_density",
        "material_surface_or_component_character",
        "controls_states_feedback_visible_in_imagery",
    )
    if sum(1 for key in trait_fields if nonempty(visual_traits.get(key))) < 3:
        errors.append("product visual traits need at least three detailed form or perception cue groups")
    product_images = product_visual.get("product_image_direction") if isinstance(product_visual.get("product_image_direction"), dict) else {}
    image_fields = (
        "hero_form",
        "feature_detail",
        "use_interaction",
        "state_proof",
        "camera_light_background_crop_retouching",
    )
    if sum(1 for key in image_fields if nonempty(product_images.get(key))) < 4:
        errors.append("product-image direction needs at least four usable image-role or production groups")

    token_model = sections.get("design_token_direction") if isinstance(sections.get("design_token_direction"), dict) else {}
    if token_model.get("documentation_only") is not True:
        errors.append("design-token direction must set documentation_only true")
    for area in ("color", "typography", "spacing", "layout"):
        records = token_model.get(area) if isinstance(token_model.get(area), list) else []
        if not records:
            errors.append(f"design-token direction has no {area} record")
            continue
        for index, record in enumerate(records, start=1):
            if not isinstance(record, dict):
                errors.append(f"design-token {area} record {index} is not an object")
                continue
            for field in TOKEN_FIELDS:
                if not nonempty(record.get(field)):
                    errors.append(f"design-token {area} record {index} has blank {field}")
            if str(record.get("relationship", "")).lower() not in TOKEN_RELATIONSHIPS:
                errors.append(f"design-token {area} record {index} has invalid relationship")

    color_records = token_model.get("color") if isinstance(token_model.get("color"), list) else []
    for index, record in enumerate(color_records, start=1):
        if not isinstance(record, dict):
            continue
        if not nonempty(record.get("color_layer")):
            errors.append(f"design-token color record {index} has blank color_layer")
        value = str(record.get("value", "")).strip()
        if not re.match(r"^(?:#[0-9a-f]{3,8}|rgba?\(|hsla?\(|(?:ok)?lch\(|lab\(|color\()", value, re.IGNORECASE):
            errors.append(f"design-token color record {index} has no renderable value")

    typography_sources = token_model.get("typography_sources") if isinstance(token_model.get("typography_sources"), list) else []
    if not typography_sources and not nonempty(token_model.get("webfont_gap")):
        errors.append("design-token typography needs typography_sources or an explicit webfont_gap")
    source_ids: set[str] = set()
    for index, source in enumerate(typography_sources, start=1):
        if not isinstance(source, dict):
            errors.append(f"typography source {index} is not an object")
            continue
        source_id = str(source.get("id") or source.get("source_id") or "").strip()
        if not source_id or not nonempty(source.get("family")):
            errors.append(f"typography source {index} needs id and family")
        else:
            source_ids.add(source_id)
        source_url = str(source.get("url") or source.get("source_url") or "").strip()
        if not re.match(r"^https?://", source_url, re.IGNORECASE):
            errors.append(f"typography source {index} has no http(s) URL")

    typography_records = token_model.get("typography") if isinstance(token_model.get("typography"), list) else []
    found_roles: set[str] = set()
    for index, record in enumerate(typography_records, start=1):
        if not isinstance(record, dict):
            continue
        role = str(record.get("role", "")).strip().lower()
        if role in TYPOGRAPHY_ROLES:
            found_roles.add(role)
        for field in TYPOGRAPHY_FIELDS:
            if not nonempty(record.get(field)):
                errors.append(f"design-token typography record {index} has blank {field}")
        font_source_id = str(record.get("font_source_id", "")).strip()
        if source_ids and font_source_id not in source_ids:
            errors.append(f"design-token typography record {index} references unknown font_source_id")
    missing_roles = sorted(TYPOGRAPHY_ROLES - found_roles)
    if missing_roles:
        errors.append(f"design-token typography hierarchy is missing roles {missing_roles}")

    moodboard = model.get("moodboard_inputs") if isinstance(model.get("moodboard_inputs"), dict) else {}
    for key in MOODBOARD_KEYS:
        if not nonempty(moodboard.get(key)):
            errors.append(f"direction JSON moodboard_inputs has blank {key}")

    disallowed = sorted(all_keys(model) & DISALLOWED_KEYS)
    if disallowed:
        errors.append(f"direction JSON contains out-of-scope records {disallowed}")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate a concise brand-transfer direction case.")
    parser.add_argument("transfer_directory")
    parser.add_argument("stage", choices=("source", "input", "direction", "all"))
    args = parser.parse_args()

    case = Path(args.transfer_directory).expanduser().resolve()
    stages = ("source", "input", "direction") if args.stage == "all" else (args.stage,)
    errors: list[str] = []
    for stage in stages:
        if stage == "source":
            errors.extend(source_errors(case))
        elif stage == "input":
            errors.extend(input_errors(case))
        else:
            errors.extend(direction_errors(case))

    print(f"Transfer direction: {case}")
    print(f"Stage: {args.stage}")
    for error in errors:
        print(f"ERROR: {error}")
    print(f"Result: {'FAIL' if errors else 'PASS'}")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
