---
name: build-landing-materials
description: Build Stage 3 landing copy and product-image materials from an accepted Stage 2 JSON and registered Storybook report. Deliver canonical JSON and the fixed Storybook reader; never create an HTML report or coded landing page.
---

# Stage 3 — Build Landing Materials

Create production-ready copy and registered product renders for a later landing-page task, finalize them in Storybook, and stop for adjustment.

## Normative contract

- Read [the pipeline specification](../../../docs/brand-research-pipeline-spec.md), [the landing-materials contract](references/landing-materials-contract.md), and [the Storybook contract](../reconstruct-brand-system/references/storybook-report-contract.md).
- Require accepted Stage 2 JSON, `asset-registry.json`, `stage-review.json`, and current Storybook registration.
- Preserve approved positioning, lineup, product form, key visual, brand mood, and token direction.
- The Stage 3 JSON is canonical. Storybook is the only human-readable report surface.
- Never create an `outputs/*.html` report, coded page, or component system.
- Never use Playwright, Chrome MCP, or browser automation unless the user explicitly requests it.

### Lean landing rules (pipeline spec §2.1)

- **No blank fields**. Omit any section or element that has no supporting material. Do not produce placeholders.
- **No duplicate images**. Before generating or saving a render, check `asset-registry.json` from Stages 1–2. Reuse existing registered paths when the same visual is needed; never re-download or duplicate.
- **Insight continuity**. Landing copy must build on the core insights extracted in Stage 2. Each section's narrative connects back to those insights rather than introducing disconnected claims.

## Initialize

```bash
python3 scripts/init_landing.py <stage-3-directory>
```

Required package artifacts:

- `landing-input.json`
- `landing-materials.md`
- `outputs/landing-materials.json`
- `asset-registry.json`
- `assets/product-renders/`
- `prompts/`
- `stage-review.json`

## Procedure

1. Confirm the accepted Stage 2 lineup and two anchor assets. Lock a compact shot plan before copy or image work. For a routed pipeline, the root then runs `plan_stage_jobs.py`, assigns every product to exactly one render lane, and gives workers only their generated job specs.
2. Write the approved message hierarchy: brand message, values, family USP, and product USP. Use the selected narrative route; do not merge rejected routes or invent performance claims.
3. Produce exactly the six fixed report sections defined by the pipeline specification. Boundaries render inside `product-assets-and-map`, not as a seventh section. Every section needs one `key_insight`.
4. Invoke `$commercial-photo-prompting` in Series mode, then `$imagegen`. Keep copy mapping independent from render work. Use at most two external image workers only when `execution.image_parallelism.mode` is `enabled`; otherwise execute the two render lanes serially. Generate at least one registered render per lineup product and only additional shots mapped to a landing section. Preserve Stage 2 invariants and provenance. Workers write only assigned `.work/<job-id>/` files; the root merges and registers the final assets.
5. Map each landing section to communication job, copy, proof, registered asset, and CTA.
6. Finalize from the starter-kit root:

```bash
pnpm finalize-brand-report -- <stage-3-directory>
```

This is the only validation entrypoint. Do not run `validate_landing.py` separately before or after finalization, and do not add a post-pass manual audit. On failure, repair the reported canonical issue and rerun only after that change. Do not hand-edit `public/brand-reports` or generated stories.

## Delivery checkpoint

Report one compact finalization status line, then deliver the Storybook story, canonical JSON, and registered renders. Do not enumerate internal validator categories unless asked. Ask one adjustment question covering copy hierarchy, story, lineup clarity, and image consistency. Record `pending`, `revision_requested`, or `accepted`. A routed acceptance refreshes only the accepted registration before completing the pipeline.
