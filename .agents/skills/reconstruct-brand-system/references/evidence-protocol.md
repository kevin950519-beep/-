# Evidence protocol

Use this protocol to build a representative, provenance-rich corpus before interpreting a brand.

## 1. Set the research boundary

Record the exact brand entity, product line, geography, language, channels, and time period. Treat different eras or regional systems as separate strata when they materially differ.

Define the target product separately. Do not let target-product preferences bias source collection.

## 2. Prioritize sources

Classify each source:

- `primary`: official site, product, packaging, app, press kit, annual report, campaign, store, social account, or first-party interview.
- `authoritative-secondary`: credited agency case study, named designer interview, reputable business or design publication, or archived reporting.
- `contextual`: retailer, community, review, resale, or user-generated evidence useful for reception and real-world use.

Use primary sources to establish expression. Use authoritative secondary sources to explain intent or evolution. Use contextual sources to understand reception, usage, and gaps. Never let contextual repetition convert speculation into fact.

## 3. Cover evidence dimensions

Collect all applicable dimensions:

| Dimension | Typical evidence |
|---|---|
| Positioning and business | About, product architecture, pricing, investor material, launch statements |
| Verbal behavior | Headlines, product names, UI copy, packaging copy, social captions, support language |
| Identity and owned digital | Marks, type, color, website, app shell, navigation, templates |
| Product and interface | Physical products, packaging, screens, interaction states, onboarding |
| Campaign and editorial | Launches, advertising, collaborations, editorial photography |
| Use and culture | Product in context, customers, creators, communities, reviews |
| Space and environment | Stores, events, signage, displays, installation, wayfinding |
| Motion and sequence | Film frames, transitions, kinetic type, product behavior, sound notes |

An inapplicable dimension is acceptable when the reason is recorded. An empty applicable dimension is a research gap.

## 4. Build a visual corpus

Use coverage before volume. As a default target, collect at least 24 distinct images spanning four or more applicable visual dimensions; use 40–60 for a mature or highly varied brand. Do not let one campaign, collaborator, season, or channel exceed roughly one quarter of the corpus unless the scope explicitly targets it.

Prefer original-resolution assets. Preserve the source URL, capture date, creator or agency credit when known, usage context, era, and rights note. Register video as representative frames with timecodes plus the source URL.

Remove exact duplicates. Treat crops, recolors, and retouched variants as related rather than independent proof. Use `scripts/audit_image_corpus.py` to inspect files and `scripts/make_contact_sheet.py` to create a review surface when Pillow is available.

## 5. Register evidence

Use `assets/source-manifest.csv`. Assign stable IDs such as `EV-001`. Never recycle an ID after deletion; mark a row excluded and explain why.

Required fields:

- `evidence_id`
- `title`
- at least one of `source_url` or `local_path`
- `source_tier`
- `content_type`
- `visual_category`
- `captured_at`
- `relevance`
- `reliability`

Use ISO dates. Separate multiple categories with `|`.

## 6. Apply sufficiency gates

Treat the following as defaults that may be narrowed with an explicit rationale:

- At least two independent evidence items support every core inferred rule.
- At least one item is primary for every claim about current official expression.
- Both verbal and visual evidence exist before making a cross-channel grammar claim.
- At least four visual dimensions are represented when image direction is required.
- Historical claims include dated material.
- Product behavior claims include actual product or interface evidence.

Do not start broad synthesis when two or more applicable critical dimensions are empty. Continue research or narrow the declared scope.

## 7. Research without browser automation

Use available web search and scraping tools, official downloads, feeds, APIs, archives, and direct HTTP requests. Inspect static HTML or downloaded files locally. Do not start Playwright, Chrome MCP, or interactive browser automation without the user's explicit request.

## 8. Report gaps honestly

Record inaccessible pages, low-resolution images, suspected regional differences, missing dates, uncertain credits, and likely survivorship bias. A well-bounded low-confidence conclusion is better than a comprehensive-looking unsupported one.
