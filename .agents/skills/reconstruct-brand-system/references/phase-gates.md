# Phase gates

Use these gates as a state machine. Never skip, merge, rename, or retroactively waive a gate because a comparative or time-boxed artifact already exists.

## G0 — BRIEF_LOCKED

Required:

- `case-brief.yaml` contains reference brand, scope, markets, channels, era, target product, transfer intensity, language, and depth.
- The original user request is summarized without changing the priority of source anatomy versus target mapping.
- Any excluded brand, channel, market, or era is explicit.

Forbidden before pass: source collection outside the declared scope.

## G1 — EVIDENCE_COLLECTED

Required:

- `source-manifest.csv` passes provenance audit.
- Normal case: at least 12 structural sources with at least 8 primary sources.
- Mature or visually varied brand: at least 40 visual candidates; normal case: at least 24.
- Positioning, verbal, identity, product, campaign/editorial, use/culture, environment, and motion are covered or marked inapplicable with a reason.

Forbidden before pass: grammar claims presented as settled.

## G2 — VISUAL_CORPUS_VALIDATED

Required:

- Every included visual item has a local file, EV ID, source URL, category, era/date, credit/rights note, and status.
- `audit_image_corpus.py --min-images <threshold> --min-categories 4` passes.
- Exact duplicates are removed or marked related.
- Overview and category contact sheets exist and every tile displays EV ID and category.
- Motion evidence has timecodes and representative frames, or the gap is explicit.

Forbidden before pass: source image-language conclusions presented as final.

## G3 — SOURCE_ANATOMY_COMPLETE

Required:

- `source-brand-anatomy.md` uses the bundled template and covers strategy, verbal behavior, visual primitives, composition, image language, product behavior, and system synthesis.
- Only `Observed` and `Inferred` labels appear. `Transferred` is forbidden.
- Every core inference has confidence, at least two supporting items, an alternative explanation, and a scope exception.
- At least 24 completed `CL-###` core claims cover the applicable anatomy domains.
- The anatomy embeds or links EV-labeled contact sheets.
- `validate_stage.py <case> source-anatomy` passes.
- A source-anatomy auditor reports no blocker.

Forbidden before pass: target positioning, target tokens, target visual direction, or source-to-target mapping.

## G4 — GRAMMAR_APPROVED

Required:

- `grammar-kernel.md` contains five to eight executable rules.
- Every rule states input condition, transformation, intended effect, evidence, confidence, exception, and copy-risk boundary.
- Three productive tensions and at least three protected surface signatures are explicit.

Forbidden before pass: treating a surface signature as a transferable rule.

## G5 — TARGET_CATEGORY_RESEARCHED

Required:

- `target-category-evidence.csv` records safety, usability, accessibility, engineering, service, rights, and category-convention sources applicable to the fictional product.
- Product truths and unvalidated hypotheses are separated.
- `validate_stage.py <case> target-evidence` passes.

Forbidden before pass: target capability or performance claims.

## G6 — MAPPING_COMPLETE

Required:

- `mapping-matrix.csv` has at least one row per approved grammar rule.
- Every row follows `source signal → semantic function → grammar → target constraint → original expression`.
- Copy risk, rejected source traits, confidence, and validation requirements are recorded.

## G7 — DOSSIER_VALIDATED

Required:

- `brand-dossier.md` uses all 13 required sections.
- Positioning, verbal, visual, token, brand-image, and product-image systems agree with the approved grammar.
- Literal token values are labeled `directional`, `tested`, or `validated`.
- `validate_dossier.py` passes.

## G8 — FIDELITY_AUDITED

Required:

- The auditor receives the original brief, source manifest, contact sheets, source anatomy, grammar kernel, target evidence, mapping matrix, dossier, and validation logs.
- Score is at least 85/100, every category is at least half, and no critical failure exists.
- Missing source anatomy, missing labeled contact sheets, a failing validator, or image-free final output is a critical failure.

## G9 — HTML_DELIVERED

Required:

- HTML follows source anatomy before target mapping.
- Locally stored reference images are visible with EV ID, source, era, category, credit, and alt text.
- Internal links and image paths validate.
- Responsive and print styles exist.
- The HTML contains at least one actual image per applicable visual category.
- Every `<img>` uses a local `src`, non-empty `alt`, `data-evidence-id="EV-..."`, and `data-category`.
- `validate_stage.py <case> html --min-categories <declared-threshold>` passes.

## Gate reporting

Update the project status after each pass. A manifest `PASS` is never a substitute for anatomy, dossier, audit, or HTML completion.
