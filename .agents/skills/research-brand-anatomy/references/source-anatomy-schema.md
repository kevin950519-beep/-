# Source-brand anatomy schema

Every material statement uses `Observed` or `Inferred`, confidence, evidence IDs, scope, alternative explanation, and exception where relevant.

## 1. Strategic and cultural anatomy

Category frame, audience identity and situation, tension/enemy, functional/emotional/social promise, reasons to believe, competitive posture, cultural role, portfolio and endorsement logic, business/service model, and era/market strata.

## 2. Verbal anatomy

Lexicon, syntax, rhetoric, cadence, viewpoint, pronouns, certainty, emotional temperature, message order, naming, CTA, onboarding, transactional/support/error language, humor/metaphor/taboo, and channel modulation. End the section with one compact hierarchy synthesized from existing evidence: brand purpose, brand essence, positioning, promise, core values, brand message, voice principles, and activation/proof. Mark every level `observed`, `inferred`, or `gap` and retain evidence scope. Purpose and essence are internal strategic ideas; brand message is the repeatable audience-facing articulation. Do not promote a tagline, campaign headline, product USP, or CTA into the brand message without masterbrand evidence.

## 3. Identity and channel-token anatomy

Mark behavior, typography roles and traits, color roles and proportions, spacing rhythm, grid/container/anchors, shape/surface/depth, icon/illustration, motion states, responsive behavior, and channel-specific deviations. Do not claim exact fonts or values without corroboration. When a first-party site exposes webfonts, record its CSS stack and the actual font artifact by family, weight, style, format, source URL, locale/script coverage, date, and fallback behavior.

## 4. Key-visual system

Define the cross-surface visual operating grammar rather than a hero-photo style. Analyze the core visual premise, semantic focal actor, typography-message-image relation, identity/interaction/campaign/photographic color roles, shape and graphic device, layering/material logic, grid/scale/spacing/composition, UI and component translation, content/editorial template translation, imagery role, motion behavior, channel adaptation, authorship, lifespan, invariants, variables, and campaign-specific exceptions. Show how the same relationship changes across identity, UI, content, imagery, and motion. Keep key visual separate from brand mood, photography production, and product-image shot systems.

## 5. Brand mood and world

Cultural and emotional register, reality/fiction boundary, setting, material imagination, human role, environmental behavior, sensory register, temporal feeling, productive tensions, and causes that produce the mood.

## 6. Photography and film language

Subjects, casting, gaze/gesture/styling, location/set/props, framing, camera height/distance, perspective/lens character, depth, lighting logic, reflection/shadow, palette/temperature, texture/imperfection, post-production, typography integration, motion/cuts/transitions/loops/sound, and channel variants.

## 7. Product representation

Analyze physical-product photography, UI mockups, device frames, screen captures, screen recordings, family views, detail, use context, factual demonstrations, service, packaging, and failure/recovery representation. Record what the presentation clarifies, exaggerates, hides, or stages.

## 8. Product-native visual and cognitive language

Analyze the product as users perceive, understand, and operate it. Always cover the category archetype or mental model, hierarchy, structure, boundaries, controls, affordances, states, feedback, family resemblance, onboarding, use, error, and recovery.

- Physical branch: silhouette, massing, proportion, geometry, CMF, seams, ports, joints, movement, care, storage, and repair.
- Digital branch: information architecture, screen anatomy, navigation, component geometry, density, content framing, state model, motion, feedback, personalization, accessibility, localization, and cross-device continuity.
- Hybrid branch: the continuity between physical control, digital state, service, and feedback.

Explicitly separate product-native qualities from camera, light, styling, retouching, device mockups, campaign graphics, and staged screenshots.

## 9. Composition and cross-channel grammar

Grid, anchoring, grouping, density, whitespace, scale contrast, overlap, crop, repetition, interruption, responsive adaptation, and relationships across type/image/object/product.

Write rules as `when X, do Y because Z`.

## 10. Product, interface, and service behavior

Information architecture, disclosure rhythm, defaults, permissions, guidance, feedback, error recovery, personalization/consistency, product ceremony, onboarding, use, care, repair, support, and post-purchase behavior.

## 11. System synthesis

Produce five to eight causal grammar rules, three productive tensions, protected surface families, exceptions, confidence, and evidence. Reject adjective-only rules.

## 12. Global brand-system framework

Translate the approved source anatomy and grammar into design-system-independent operating guidance for:

- brand color scheme;
- typography hierarchy;
- spacing strategy;
- layout strategy.

For each area record its role, relationship to other elements, invariants, variables, channel and locale scope, exceptions, and evidence IDs. Color must be split into identity, interaction/status, product/campaign, and photographic layers. `brand_color_scheme.color_tokens` records renderable observed `value`, `color_layer`, `role`, scope, and evidence, or `color_value_gap` states why no value is available. Typography sets `documentation_only: true`; `documentation_webfonts` records family and an http(s) `source_url`, while `specimens` records observed role and family plus any verified size, weight, line height, letter spacing, script, and sample. If access or licensing blocks the font, use an explicit `webfont_gap`. The reader alone may fill missing hierarchy levels with `documentation-preview` values. Linked fonts are report-only provenance and never modify starter-kit theme tokens. Relate color and layout to key visuals, photography, product representation, and product-native language without merging those layers.

Do not prescribe implementation token names, JSON, CSS variables, framework syntax, fixed scales, or universal pixel, rem, breakpoint, and hex values. Exact observed color and typography values are permitted only as explicitly dated and scoped source references, never as the global rule. Do not call a link, button, action, focus, or status value a brand color unless direct first-party identity guidance assigns it to the masterbrand identity.

## 13. Gaps and falsification

List evidence gaps, contradictory cases, low-confidence readings, regional/era unknowns, authorship ambiguities, product versus photography uncertainty, and observations that would falsify each major rule.
