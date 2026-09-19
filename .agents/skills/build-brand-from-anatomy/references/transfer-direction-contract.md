# Eight-section transfer-direction contract

Deliver the registered Storybook document and `outputs/extended-brand-anatomy.json` as a pair. Storybook is the readable Stage 2 anatomy and must show the two registered anchor images. The JSON is the explicit input for Stage 3 landing copy and product-image production.

## Report body

The numbered body contains exactly eight sections:

1. Source-grammar application direction
2. New-brand positioning
3. Landing-focused product concept
4. Verbal branding and copy hierarchy
5. Visual branding and key visual
6. Brand mood and brand-image direction
7. Product visual traits and product-image direction
8. Design-token direction

A hero and short metadata block may appear before section 1. Evidence references and assumptions belong inside the relevant section or JSON metadata. Do not append approval questions, a ninth section, production handoff, full PRD, component system, or methodology appendix.

Use the exact eight ordered React section IDs in the normative pipeline specification. Inside section 3, render the product lineup explicitly. Every lineup product name in JSON must be visible in Storybook.

## Product-concept limit

The product section answers only what a landing page and image brief need:

- one-line product definition;
- user and representative use situation;
- core value;
- up to three or four landing-page features;
- a directional product-family name and shared promise;
- an explicit product lineup containing every product in scope;
- three to five shared product-family invariants and relevant cognitive invariants;
- for each lineup product: working product name, product type, lineup role, use case, differentiator, detailed form cues, one allowed variation, landing-page message, and proof-image roles;
- physical, digital, or hybrid form cues;
- image roles that show the form, use, detail, state, or proof.

Do not force service operations, lifecycle, a full user journey, exhaustive errors, MVP roadmap, engineering requirements, or manufacturing specifications into the report.

## JSON

Use the current template schema and `artifact_type: extended_brand_anatomy`.

Required top-level records:

- `source_analysis`;
- `target`;
- `sections` containing the eight section records below;
- `moodboard_inputs`;
- `boundaries`.
- `registered_anchor_assets` containing the product-hero and brand-mood asset IDs.

Required `sections` keys:

- `source_grammar_application`;
- `brand_positioning`;
- `landing_product_concept`;
- `verbal_branding_and_copy_hierarchy`;
- `visual_branding_and_key_visual`;
- `brand_mood_and_brand_imagery`;
- `product_visual_traits_and_product_imagery`;
- `design_token_direction`.

`landing_product_concept` records the compact product fields above. It must include `lineup_mode`, `product_family`, and `product_lineup`. `product_family` records `working_name`, `promise`, `shared_architecture`, `shared_invariants`, `cognitive_invariants`, `differentiation_logic`, and `status`. Every `product_lineup` item records `product_name`, `product_type`, `lineup_role`, `use_case`, `differentiator`, `form_cues`, `allowed_variation`, `product_usp`, `landing_message`, and `image_roles`. Working names are directional unless the user has separately approved final naming.

`verbal_branding_and_copy_hierarchy` records `brand_purpose`, `brand_essence`, `brand_message`, two or three `brand_values`, `family_usp`, a product-level USP for every lineup item, two or three genuinely distinct `narrative_routes` when useful, one `selected_narrative_route`, and `message_visual_map`. The fixed verbal hierarchy combines these with section 2 positioning and promise, then shows five tiers in order: foundation, strategic definition, core verbal platform, expression system, and activation/proof. Brand purpose and essence are internal strategic decisions; brand message is the repeatable audience-facing articulation. The map connects message to key visual, values to brand mood, and family/product USP to product imagery. The key-visual, brand-mood, and product-image records each state one `communication_job`; the key visual also states its repeatable `series_rule`.

`design_token_direction` contains `documentation_only: true`, `color`, `typography_sources`, `typography`, `spacing`, `layout`, and optional `shape` and `motion`. Each token entry records `role`, `relationship` (`keep`, `tune`, or `new`), `source_basis`, `target_direction`, `landing_use`, and `status`. Every color entry additionally records a renderable `value` and `color_layer`. A source identity accent is eligible only when Stage 1 explicitly verifies its masterbrand role; status, interaction, campaign, product, and photographic colors are not substitutes.

`typography_sources` records a family and http(s) stylesheet or font-file URL plus source type and licensing boundary, or the section records an explicit `webfont_gap`. `typography` contains visibly distinct Display, H1, H2, H3, Body, Label, and Caption direction records with `font_family`, `font_source_id`, `font_size`, `font_weight`, `line_height`, `letter_spacing`, and a specimen string. These are document specimens and directional evidence, not implementation tokens. The fixed React reader may load the linked font only for specimen content; never modify the starter-kit MUI theme, global body typography, or product design tokens.

Required `moodboard_inputs`:

- `copywriting`;
- `hierarchy`;
- `brand_mood_images`;
- `product_description`;
- `product_image_generation`.

These are concise downstream inputs, not a ninth report section. After section 8, render an unnumbered review checkpoint from `stage-review.json`. Do not add component-system, CSS architecture, or full UX-state records.
