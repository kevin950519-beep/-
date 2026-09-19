#!/usr/bin/env python3
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

import yaml


EV_RE = re.compile(r"EV-\d{3,}")
CL_RE = re.compile(r"CL-\d{3,}")
GK_RE = re.compile(r"(?m)^##\s+(GK-\d{2,})\b")


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8") if path.is_file() else ""


def json_object(path: Path) -> dict[str, object]:
    if not path.is_file():
        return {}
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return {}
    return value if isinstance(value, dict) else {}


def nonempty(value: object) -> bool:
    if value is None:
        return False
    if isinstance(value, str):
        return bool(value.strip())
    if isinstance(value, (list, tuple, set, dict)):
        return bool(value)
    return True


def rows(path: Path) -> list[dict[str, str]]:
    if not path.is_file():
        return []
    with path.open(encoding="utf-8-sig", newline="") as handle:
        return list(csv.DictReader(handle))


def yaml_data(text: str) -> object:
    try:
        return yaml.safe_load(text) if text.strip() else {}
    except yaml.YAMLError:
        return {}


def find_yaml_value(value: object, key: str) -> object | None:
    if isinstance(value, dict):
        if key in value:
            return value[key]
        for child in value.values():
            found = find_yaml_value(child, key)
            if found is not None:
                return found
    elif isinstance(value, list):
        for child in value:
            found = find_yaml_value(child, key)
            if found is not None:
                return found
    return None


def scalar(text: str, key: str, default: int) -> int:
    value = find_yaml_value(yaml_data(text), key)
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def yaml_value(text: str, key: str) -> str:
    value = find_yaml_value(yaml_data(text), key)
    if value is None:
        return ""
    if isinstance(value, bool):
        return "true" if value else "false"
    return str(value).strip()


def yaml_list_values(text: str, key: str) -> list[str]:
    value = find_yaml_value(yaml_data(text), key)
    if not isinstance(value, list):
        return []
    return [str(item).strip() for item in value if str(item).strip()]


def yaml_list_has_item(text: str, key: str) -> bool:
    return bool(yaml_list_values(text, key))


def completed_claim_rows(anatomy: str) -> list[tuple[str, list[str]]]:
    completed: list[tuple[str, list[str]]] = []
    for line in anatomy.splitlines():
        if not re.match(r"^\|\s*CL-\d{3,}\s*\|", line):
            continue
        cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
        if len(cells) >= 9 and all(cells[:9]):
            completed.append((cells[0], cells))
    return completed


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate source-only brand analysis gates.")
    parser.add_argument("analysis_directory")
    parser.add_argument("stage", choices=("brief", "evidence", "visual", "anatomy", "grammar", "delivery", "all"))
    args = parser.parse_args()

    case = Path(args.analysis_directory).expanduser().resolve()
    if args.stage == "all":
        stages = ("brief", "evidence", "visual", "anatomy", "grammar", "delivery")
        failed = False
        for stage in stages:
            command = [sys.executable, str(Path(__file__).resolve()), str(case), stage]
            result = subprocess.run(
                command,
                check=False,
                capture_output=True,
                text=True,
            )
            print(result.stdout, end="")
            if result.stderr:
                print(result.stderr, file=sys.stderr, end="")
            failed = failed or result.returncode != 0
        return 1 if failed else 0

    errors: list[str] = []
    brief = read(case / "research-brief.yaml")
    forbidden_keys = ("target_product:", "target_category:", "fictional_brand:", "transfer_intensity:")

    if args.stage == "brief":
        required = (
            "reference_brand:", "entity_scope:", "markets:", "languages:", "channels:",
            "era_start:", "era_end:", "research_priorities:", "exclusions:", "original_user_priority:",
        )
        if not brief:
            errors.append("missing research-brief.yaml")
        for token in required:
            if token not in brief:
                errors.append(f"research brief missing {token}")
        for token in forbidden_keys:
            if token in brief:
                errors.append(f"source brief contains forbidden paired-workflow key {token}")
        for key in ("name", "entity_scope", "product_mode", "era_start", "era_end", "original_user_priority"):
            if not yaml_value(brief, key):
                errors.append(f"research brief has blank {key}")
        for key in (
            "hero_background_color", "hero_foreground_color", "hero_color_layer", "hero_logo_evidence_id",
            "hero_logo_local_path", "hero_logo_source_url", "hero_logo_credit", "hero_logo_rights_note",
            "hero_logo_variant", "hero_logo_render_treatment", "hero_identity_scope",
        ):
            if not yaml_value(brief, key):
                errors.append(f"research brief has blank {key}")
        for key in ("hero_background_color", "hero_foreground_color"):
            if not re.fullmatch(r"#[0-9A-Fa-f]{6}", yaml_value(brief, key)):
                errors.append(f"research brief {key} must be a six-digit hex value")
        if yaml_value(brief, "hero_color_layer").strip().lower() != "identity":
            errors.append("report hero color must be explicitly classified as identity")
        if yaml_value(brief, "hero_logo_render_treatment") not in {"none", "invert(1)", "brightness(0)"}:
            errors.append("unsupported hero_logo_render_treatment")
        hero_logo = case / yaml_value(brief, "hero_logo_local_path")
        if not hero_logo.is_file():
            errors.append("research brief hero logo local file is missing")
        product_mode = yaml_value(brief, "product_mode").lower()
        if product_mode and product_mode not in {"physical", "digital", "hybrid", "mixed"}:
            errors.append("product_mode must be physical, digital, hybrid, or mixed")
        for key in ("markets", "languages", "channels", "research_priorities"):
            if not yaml_list_has_item(brief, key):
                errors.append(f"research brief has no item in {key}")
        exceptions = yaml_list_values(brief, "inapplicable_visual_layers")
        if exceptions and not yaml_value(brief, "inapplicable_visual_layer_rationale"):
            errors.append("inapplicable visual layers require a rationale")
        depth = yaml_value(brief, "research_depth").lower()
        if depth and depth not in {"rapid", "expanded"}:
            errors.append("research_depth must be rapid or expanded")
        if depth == "expanded" and not yaml_value(brief, "expanded_depth_rationale"):
            errors.append("expanded research requires expanded_depth_rationale")

    elif args.stage == "evidence":
        manifest = rows(case / "source-manifest.csv")
        if not manifest:
            errors.append("missing or empty source-manifest.csv")
        included = [row for row in manifest if row.get("status", "").strip().lower() == "included"]
        structural = [row for row in included if row.get("content_type", "").strip().lower() not in {"image_candidate", "visual_candidate", "motion_frame"}]
        primary = [row for row in structural if row.get("source_tier", "").strip().lower() == "primary"]
        visual = [row for row in included if row.get("visual_category", "").strip()]
        min_structural = scalar(brief, "structural_sources", 4)
        min_primary = scalar(brief, "primary_structural_sources", 3)
        min_visual = scalar(brief, "visual_candidates", 8)
        if len(structural) < min_structural:
            errors.append(f"structural sources {len(structural)} < {min_structural}")
        if len(primary) < min_primary:
            errors.append(f"primary structural sources {len(primary)} < {min_primary}")
        if len(visual) < min_visual:
            errors.append(f"visual candidates {len(visual)} < {min_visual}")
        required = ("evidence_id", "title", "source_tier", "content_type", "evidence_layer", "captured_at", "relevance", "reliability", "status")
        for index, row in enumerate(included, start=2):
            for field in required:
                if not row.get(field, "").strip():
                    errors.append(f"source-manifest.csv row {index}: blank {field}")
            if not (row.get("source_url", "").strip() or row.get("local_path", "").strip()):
                errors.append(f"source-manifest.csv row {index}: source_url and local_path both blank")
            if not EV_RE.fullmatch(row.get("evidence_id", "").strip()):
                errors.append(f"source-manifest.csv row {index}: invalid evidence_id")
        hero_id = yaml_value(brief, "hero_logo_evidence_id")
        hero_rows = [row for row in included if row.get("evidence_id", "").strip() == hero_id]
        if len(hero_rows) != 1:
            errors.append("hero logo evidence ID must resolve to exactly one included manifest row")
        elif hero_rows[0].get("local_path", "").strip() != yaml_value(brief, "hero_logo_local_path"):
            errors.append("hero logo local path must match its manifest row")

    elif args.stage == "visual":
        corpus = rows(case / "visual-corpus.csv")
        included = [row for row in corpus if row.get("status", "").strip().lower() == "included"]
        minimum = scalar(brief, "unique_local_visuals", 8)
        if len(included) < minimum:
            errors.append(f"included local visuals {len(included)} < {minimum}")
        layers: set[str] = set()
        hashes: dict[str, str] = {}
        required = (
            "evidence_id", "local_path", "source_url", "evidence_layer", "visual_category", "era_or_date",
            "credit", "rights_note", "subject_role", "human_casting", "setting", "composition",
            "camera_and_perspective", "lighting", "palette", "material_and_surface", "postproduction",
            "motion_or_sequence", "analysis_notes",
        )
        for index, row in enumerate(included, start=2):
            for field in required:
                if not row.get(field, "").strip():
                    errors.append(f"visual-corpus.csv row {index}: blank {field}")
            if not (row.get("product_representation_job", "").strip() or row.get("product_image_job", "").strip()):
                errors.append(f"visual-corpus.csv row {index}: blank product representation job")
            if not (row.get("product_native_signals", "").strip() or row.get("intrinsic_product_signals", "").strip()):
                errors.append(f"visual-corpus.csv row {index}: blank product-native signals")
            evidence_id = row.get("evidence_id", "").strip()
            if not EV_RE.fullmatch(evidence_id):
                errors.append(f"visual-corpus.csv row {index}: invalid evidence_id")
            local = (case / row.get("local_path", "")).resolve()
            if not local.is_file():
                errors.append(f"visual-corpus.csv row {index}: missing local file {row.get('local_path', '')}")
            else:
                digest = hashlib.sha256(local.read_bytes()).hexdigest()
                previous = hashes.get(digest)
                if previous:
                    errors.append(f"exact duplicate local files: {previous} and {evidence_id}")
                hashes[digest] = evidence_id
            layers.update(part.strip().lower().replace("_", " ").replace("-", " ") for part in row.get("evidence_layer", "").split("|") if part.strip())
        min_layers = scalar(brief, "visual_layers", 5)
        if len(layers) < min_layers:
            errors.append(f"represented visual layers {len(layers)} < {min_layers}")
        required_layer_groups = {
            "identity/channel tokens": ("identity", "channel token", "owned digital"),
            "key visual": ("key visual", "campaign"),
            "photography/film": ("photography", "film", "brand image"),
            "product representation": ("product representation", "product image", "product photography", "pdp", "ui mockup", "screen capture"),
            "product-native visual and cognitive language": ("product native", "intrinsic product", "product object", "industrial design", "digital product", "interface structure", "cmf"),
        }
        inapplicable = {
            item.lower().replace("_", " ").replace("-", " ")
            for item in yaml_list_values(brief, "inapplicable_visual_layers")
        }
        for label, aliases in required_layer_groups.items():
            normalized_label = label.lower().replace("_", " ").replace("-", " ")
            if normalized_label in inapplicable:
                continue
            if not any(any(alias in layer for alias in aliases) for layer in layers):
                errors.append(f"visual corpus missing distinct {label} layer")
        if not (case / "contact-sheets" / "overview.jpg").is_file():
            errors.append("missing contact-sheets/overview.jpg")
        sheets = list((case / "contact-sheets").glob("*.jpg")) if (case / "contact-sheets").is_dir() else []
        if len(sheets) < 4:
            errors.append(f"contact sheets {len(sheets)} < 4 (overview plus layer sheets required)")

    elif args.stage == "anatomy":
        anatomy = read(case / "source-brand-anatomy.md")
        required_headings = (
            "## 3. Strategic and cultural anatomy", "## 4. Verbal anatomy",
            "## 5. Identity and channel-token anatomy", "## 6. Key-visual system",
            "## 7. Brand mood and world", "## 8. Photography and film language",
            "## 12. Product, interface, and service behavior", "## 13. System synthesis",
            "## 14. Global brand-system framework", "## 15. Core claim register",
        )
        if not anatomy:
            errors.append("missing source-brand-anatomy.md")
        for heading in required_headings:
            if heading not in anatomy:
                errors.append(f"missing anatomy heading: {heading}")
        if not any(heading in anatomy for heading in ("## 9. Product representation", "## 9. Product-image production")):
            errors.append("missing anatomy heading: product representation")
        if not any(heading in anatomy for heading in ("## 10. Product-native visual and cognitive language", "## 10. Intrinsic product visual language")):
            errors.append("missing anatomy heading: product-native visual and cognitive language")
        completed_claims = completed_claim_rows(anatomy)
        claims = {claim_id for claim_id, _ in completed_claims}
        min_claims = scalar(brief, "core_claims", 8)
        if len(claims) < min_claims:
            errors.append(f"completed unique core claim rows {len(claims)} < {min_claims}")
        for claim_id, cells in completed_claims:
            claim_text, evidence_text, confidence = cells[2], cells[4], cells[5].lower()
            if not re.search(r"\b(?:Observed|Inferred)\b", claim_text):
                errors.append(f"{claim_id}: claim text lacks Observed/Inferred label")
            evidence_count = len(set(EV_RE.findall(evidence_text)))
            if evidence_count < 1:
                errors.append(f"{claim_id}: cites no evidence ID")
            if "inferred" in claim_text.lower() and evidence_count < 2:
                errors.append(f"{claim_id}: Inferred claim cites fewer than two evidence IDs")
            if confidence not in {"high", "medium", "low"}:
                errors.append(f"{claim_id}: invalid confidence {cells[5]}")
        for pattern, label in (
            (r"(?im)^\s*(?:[-*]|\|).*\bTransferred\b", "Transferred claim"),
            (r"(?i)fictional target product|source-to-target mapping|target positioning", "target contamination"),
            (r"\bMAP-\d{3,}\b", "mapping ID"),
        ):
            if re.search(pattern, anatomy):
                errors.append(f"source anatomy contains forbidden {label}")
        for label in ("Observed", "Inferred"):
            if label not in anatomy:
                errors.append(f"source anatomy contains no {label} labels")
        global_section = re.search(
            r"## 14\. Global brand-system framework(.*?)(?=\n## 15\.|\Z)", anatomy, re.DOTALL
        )
        if not global_section:
            errors.append("source anatomy missing global brand-system framework")
        else:
            framework = global_section.group(1).lower()
            for required in ("brand color scheme", "typography hierarchy", "spacing strategy", "layout strategy"):
                if required not in framework:
                    errors.append(f"global brand-system framework missing {required}")
            for required in (
                "identity color field",
                "interaction and status color references",
                "product, campaign, and photographic color boundaries",
            ):
                if required not in framework:
                    errors.append(f"global brand-system framework missing color layer: {required}")
            if framework.count("observed reference values") < 1:
                errors.append("global brand-system framework requires a typography observed-reference block")

    elif args.stage == "grammar":
        grammar = read(case / "grammar-kernel.md")
        rules = GK_RE.findall(grammar)
        min_rules = scalar(brief, "grammar_rules", 4)
        max_rules = 6 if yaml_value(brief, "research_depth").lower() == "rapid" else 8
        if not min_rules <= len(rules) <= max_rules:
            errors.append(f"grammar rule count {len(rules)} outside {min_rules}–{max_rules}")
        for field in ("Input condition:", "Transformation:", "Intended effect:", "Evidence IDs:", "Confidence:", "Alternative explanation:", "Exception and scope:", "Protected source expression:", "Acceptance test:", "Rejection test:"):
            if grammar.count(field) < len(rules):
                errors.append(f"grammar rules missing field {field}")
        if re.search(r"(?i)fictional target|target positioning|translated expression|\bTransferred\b", grammar):
            errors.append("grammar kernel contains target or transfer content")
        blocks = re.split(r"(?m)(?=^##\s+GK-\d{2,}\b)", grammar)
        rule_blocks = [block for block in blocks if re.match(r"^##\s+GK-\d{2,}\b", block)]
        for block in rule_blocks:
            rule_id = GK_RE.search(block).group(1) if GK_RE.search(block) else "unknown rule"
            evidence_line = re.search(r"(?m)^- Evidence IDs:\s*(.+)$", block)
            if not evidence_line or len(set(EV_RE.findall(evidence_line.group(1)))) < 2:
                errors.append(f"{rule_id}: requires at least two evidence IDs")

    elif args.stage == "delivery":
        json_path = case / "outputs" / "source-brand-analysis.json"
        model: dict[str, object] = {}
        if not json_path.is_file():
            errors.append("missing outputs/source-brand-analysis.json")
        else:
            try:
                model = json.loads(json_path.read_text(encoding="utf-8"))
            except (json.JSONDecodeError, OSError) as exc:
                errors.append(f"invalid source-brand-analysis.json: {exc}")
        if model:
            if model.get("artifact_type") != "source_brand_analysis":
                errors.append("source JSON artifact_type must be source_brand_analysis")
            schema_version = str(model.get("schema_version", ""))
            if not schema_version:
                errors.append("source JSON has no schema_version")
            elif not schema_version.startswith("1."):
                errors.append(f"unsupported source JSON schema_version {schema_version}")
            brand_model = model.get("brand") if isinstance(model.get("brand"), dict) else {}
            if not brand_model.get("name") or not brand_model.get("product_mode"):
                errors.append("source JSON brand must include name and product_mode")
            report_identity = model.get("report_identity") if isinstance(model.get("report_identity"), dict) else {}
            logo_model = report_identity.get("logo") if isinstance(report_identity.get("logo"), dict) else {}
            for key in ("background_color", "foreground_color", "color_layer", "identity_scope"):
                if not report_identity.get(key):
                    errors.append(f"source JSON report_identity missing {key}")
            for key in ("evidence_id", "local_path", "source_url", "credit", "rights_note", "variant", "render_treatment"):
                if not logo_model.get(key):
                    errors.append(f"source JSON report_identity.logo missing {key}")
            if str(report_identity.get("color_layer", "")).lower() != "identity":
                errors.append("source JSON report identity color is not classified as identity")
            model_handoff = model.get("handoff") if isinstance(model.get("handoff"), dict) else {}
            if model_handoff.get("target_direction", "missing") is not None:
                errors.append("source JSON target_direction must remain null")
            layers = model.get("analysis_layers") if isinstance(model.get("analysis_layers"), dict) else {}
            for key in (
                "strategy", "verbal_system", "identity_and_channel_tokens", "key_visual_system",
                "brand_mood_and_world", "photography_and_film", "product_representation",
                "product_native_visual_and_cognitive_language", "product_interface_and_service_behavior",
            ):
                if key not in layers:
                    errors.append(f"source JSON missing analysis layer {key}")
            if schema_version.startswith("1.2"):
                verbal_model = model.get("verbal_branding") if isinstance(model.get("verbal_branding"), dict) else {}
                verbal_fields = (
                    "brand_purpose", "brand_essence", "positioning", "brand_promise",
                    "brand_message", "voice_principles", "activation_principles",
                )
                allowed_statuses = {"observed", "inferred", "gap"}
                for key in verbal_fields:
                    record = verbal_model.get(key) if isinstance(verbal_model.get(key), dict) else {}
                    if not record:
                        errors.append(f"source JSON verbal_branding missing {key}")
                        continue
                    if not nonempty(record.get("statement")) or not nonempty(record.get("evidence_and_scope")):
                        errors.append(f"source JSON verbal_branding {key} needs statement and evidence_and_scope")
                    status = str(record.get("epistemic_status", "")).lower()
                    if status not in allowed_statuses:
                        errors.append(f"source JSON verbal_branding {key} has invalid epistemic_status")
                    if status != "gap" and not EV_RE.search(str(record.get("evidence_and_scope", ""))):
                        errors.append(f"source JSON verbal_branding {key} needs an evidence ID")
                core_values = verbal_model.get("core_values") if isinstance(verbal_model.get("core_values"), list) else []
                if not core_values:
                    errors.append("source JSON verbal_branding needs core_values or one explicit gap record")
                for index, record in enumerate(core_values, start=1):
                    if not isinstance(record, dict):
                        errors.append(f"source JSON core value {index} is not an object")
                        continue
                    status = str(record.get("epistemic_status", "")).lower()
                    if not nonempty(record.get("statement")) or not nonempty(record.get("evidence_and_scope")):
                        errors.append(f"source JSON core value {index} needs statement and evidence_and_scope")
                    if status not in allowed_statuses:
                        errors.append(f"source JSON core value {index} has invalid epistemic_status")
                    if status != "gap" and not nonempty(record.get("name")):
                        errors.append(f"source JSON core value {index} needs a name")
                    if status != "gap" and not EV_RE.search(str(record.get("evidence_and_scope", ""))):
                        errors.append(f"source JSON core value {index} needs an evidence ID")
            system = model.get("design_system") if isinstance(model.get("design_system"), dict) else {}
            for key in ("brand_color_scheme", "typography_hierarchy", "spacing_strategy", "layout_strategy"):
                if key not in system:
                    errors.append(f"source JSON missing design-system area {key}")
                elif schema_version.startswith("1.2"):
                    area = system.get(key) if isinstance(system.get(key), dict) else {}
                    for field in (
                        "roles", "relationships", "invariants", "variables_and_exceptions",
                        "observed_references", "evidence_ids", "limits",
                    ):
                        if field not in area:
                            errors.append(f"source JSON design-system area {key} missing {field}")
            if schema_version.startswith("1.2"):
                color_model = system.get("brand_color_scheme") if isinstance(system.get("brand_color_scheme"), dict) else {}
                color_tokens = color_model.get("color_tokens") if isinstance(color_model.get("color_tokens"), list) else []
                if not color_tokens and not nonempty(color_model.get("color_value_gap")):
                    errors.append("source JSON color guide needs observed color_tokens or an explicit color_value_gap")
                for index, token in enumerate(color_tokens, start=1):
                    if not isinstance(token, dict):
                        errors.append(f"source JSON color token {index} is not an object")
                        continue
                    if not nonempty(token.get("color_layer")) or not nonempty(token.get("role")):
                        errors.append(f"source JSON color token {index} needs color_layer and role")
                    value = str(token.get("value", "")).strip()
                    if not re.match(r"^(?:#[0-9a-f]{3,8}|rgba?\(|hsla?\(|(?:ok)?lch\(|lab\(|color\()", value, re.IGNORECASE):
                        errors.append(f"source JSON color token {index} has no renderable color value")

                type_model = system.get("typography_hierarchy") if isinstance(system.get("typography_hierarchy"), dict) else {}
                if type_model.get("documentation_only") is not True:
                    errors.append("source JSON typography hierarchy must set documentation_only true")
                webfonts = type_model.get("documentation_webfonts") if isinstance(type_model.get("documentation_webfonts"), list) else []
                if not webfonts and not nonempty(type_model.get("webfont_gap")):
                    errors.append("source JSON typography hierarchy needs documentation_webfonts or an explicit webfont_gap")
                for index, font in enumerate(webfonts, start=1):
                    if not isinstance(font, dict):
                        errors.append(f"source JSON webfont {index} is not an object")
                        continue
                    if not nonempty(font.get("family")):
                        errors.append(f"source JSON webfont {index} has blank family")
                    source_url = str(font.get("source_url", "")).strip()
                    if not re.match(r"^https?://", source_url, re.IGNORECASE):
                        errors.append(f"source JSON webfont {index} has no http(s) source_url")
                specimens = type_model.get("specimens") if isinstance(type_model.get("specimens"), list) else []
                if webfonts and not specimens:
                    errors.append("source JSON verified webfonts need at least one observed typography specimen")
                for index, specimen in enumerate(specimens, start=1):
                    if not isinstance(specimen, dict) or not nonempty(specimen.get("role")) or not nonempty(specimen.get("family")):
                        errors.append(f"source JSON typography specimen {index} needs role and family")
            min_rules = scalar(brief, "grammar_rules", 4)
            if len(model.get("grammar_rules", [])) < min_rules:
                errors.append(f"source JSON contains fewer than {min_rules} grammar rules")
            if len(model.get("decision_index", {})) < 4:
                errors.append("source JSON decision_index is not materially structured")
            downstream = model.get("downstream_contract") if isinstance(model.get("downstream_contract"), dict) else {}
            for key in ("transfer_plan_requires", "second_brand_model_must_add", "product_photo_brief_requires_from_second_brand", "landing_page_brief_requires_from_second_brand"):
                if not downstream.get(key):
                    errors.append(f"source JSON downstream_contract missing {key}")
        handoff = read(case / "analysis-handoff.yaml")
        status = read(case / "analysis-status.yaml")
        run = json_object(case / "research-run.json")
        if run.get("artifact_type") != "brand_research_run":
            errors.append("source analysis has no valid research-run.json")
        elif run.get("mode") == "rapid":
            if run.get("status") != "completed":
                errors.append("rapid research run is not completed")
            limit_seconds = int(run.get("timebox_minutes", 10)) * 60
            elapsed_seconds = run.get("elapsed_seconds")
            if not isinstance(elapsed_seconds, int) or elapsed_seconds > limit_seconds:
                errors.append("rapid research run exceeded its timebox")
        if not re.search(r"(?m)^\s*target_direction:\s*null\s*$", handoff):
            errors.append("analysis handoff must keep target_direction null")
        if not any(marker in status for marker in ("current_stage: SOURCE_REVIEW_REQUIRED", "current_stage: USER_DIRECTION_REQUIRED")):
            errors.append("analysis status must end at SOURCE_REVIEW_REQUIRED")
        review = json_object(case / "stage-review.json") if (case / "stage-review.json").is_file() else {}
        if not review and "current_stage: SOURCE_REVIEW_REQUIRED" in status:
            errors.append("source analysis has no stage-review.json")
        elif review:
            if review.get("artifact_type") != "stage_review" or review.get("stage") != "source_brand_analysis":
                errors.append("source analysis stage-review.json has invalid identity")
            if review.get("status") not in {"pending", "accepted", "revision_requested"}:
                errors.append("source analysis stage-review.json has invalid status")
            if not nonempty(review.get("review_targets")) or not nonempty(review.get("adjustment_prompts")):
                errors.append("source analysis stage-review.json lacks review targets or prompts")
        new_gates = (
            "A0_SOURCE_BRIEF_LOCKED", "A1_SOURCE_EVIDENCE_PACKAGE_COMPLETE",
            "A2_SOURCE_ANATOMY_COMPLETE", "A3_SOURCE_GRAMMAR_AND_SYSTEM_COMPLETE",
            "A4_SOURCE_ANALYSIS_DELIVERED",
        )
        legacy_gates = (
            "A0_SOURCE_BRIEF_LOCKED", "A1_SOURCE_EVIDENCE_COLLECTED", "A2_SOURCE_VISUAL_CORPUS_VALIDATED",
            "A3_SOURCE_ANATOMY_COMPLETE", "A4_SOURCE_GRAMMAR_APPROVED", "A5_SOURCE_ANALYSIS_AUDITED",
            "A6_SOURCE_ANALYSIS_DELIVERED",
        )
        gate_set = new_gates if "A1_SOURCE_EVIDENCE_PACKAGE_COMPLETE" in status else legacy_gates
        for gate in gate_set:
            if not re.search(rf"{gate}:\s*pass", status):
                errors.append(f"analysis status gate {gate} is not pass")
        for key in ("package_path", "version", "delivered_at"):
            if yaml_value(handoff, key) in {"", "null", "pending"}:
                errors.append(f"analysis handoff has blank {key}")
        validation_status = yaml_value(handoff, "validation_status").lower()
        legacy_verdict = yaml_value(handoff, "audit_verdict").lower()
        if validation_status != "pass" and legacy_verdict not in {"pass", "pass-with-revisions"}:
            errors.append("analysis handoff validation_status is not pass")
        for key in ("approved_grammar_ids", "protected_surface_families"):
            if not yaml_list_has_item(handoff, key):
                errors.append(f"analysis handoff has no items in {key}")
        if model:
            model_handoff = model.get("handoff") if isinstance(model.get("handoff"), dict) else {}
            if model_handoff.get("package_version") != yaml_value(handoff, "version"):
                errors.append("source JSON package_version does not match analysis handoff")
            grammar_ids = set(GK_RE.findall(read(case / "grammar-kernel.md")))
            if set(model_handoff.get("approved_grammar_ids", [])) != grammar_ids:
                errors.append("source JSON approved_grammar_ids do not match grammar kernel")
            if set(model_handoff.get("protected_surface_families", [])) != set(yaml_list_values(handoff, "protected_surface_families")):
                errors.append("source JSON protected surfaces do not match analysis handoff")
            if set(model_handoff.get("unresolved_gaps", [])) != set(yaml_list_values(handoff, "unresolved_source_gaps")):
                errors.append("source JSON unresolved gaps do not match analysis handoff")
        source_schema = str(model.get("schema_version", "")) if model else ""
        if source_schema.startswith("1.2"):
            if yaml_value(handoff, "source_json_schema_version") != source_schema:
                errors.append("analysis handoff source_json_schema_version does not match source JSON")
            digest_targets = {
                "anatomy_sha256": case / "source-brand-anatomy.md",
                "grammar_sha256": case / "grammar-kernel.md",
                "source_json_sha256": case / "outputs" / "source-brand-analysis.json",
            }
            for key, path in digest_targets.items():
                expected = yaml_value(handoff, key).lower()
                if not re.fullmatch(r"[0-9a-f]{64}", expected):
                    errors.append(f"analysis handoff has invalid {key}")
                    continue
                if path.is_file() and hashlib.sha256(path.read_bytes()).hexdigest() != expected:
                    errors.append(f"analysis handoff {key} does not match current file")

    print(f"Analysis: {case}")
    print(f"Stage: {args.stage}")
    for error in errors:
        print(f"ERROR: {error}")
    print(f"Result: {'NEEDS COMPLETION' if errors else 'PASS'}")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
