---
name: build-brand-from-anatomy
description: Build a target-brand Stage 2 anatomy from an accepted source JSON and registered Storybook report. Deliver canonical JSON, two registered anchor images, and the fixed Storybook reader; never create an HTML report.
---

# Stage 2 — Build Extended Brand Anatomy

Create one coherent target brand and product direction from an accepted Stage 1 package, finalize it in Storybook, and stop for adjustment.

## Normative contract

- Read [the pipeline specification](../../../docs/brand-research-pipeline-spec.md), [the input contract](references/transfer-input-contract.md), [the tuning framework](references/tuning-framework.md), [the direction contract](references/transfer-direction-contract.md), and [the Storybook contract](../reconstruct-brand-system/references/storybook-report-contract.md).
- Require accepted Stage 1 JSON, `stage-review.json`, and its current Storybook registration.
- The Stage 2 JSON is canonical. Storybook is the only human-readable report surface.
- Never create an `outputs/*.html` report or brand-specific report markup.
- Render color values as layered swatches and typography as a linked, document-only Display–Caption hierarchy. Never apply report fonts or directional values to starter-kit theme tokens.
- Render verbal direction as the fixed foundation-to-activation hierarchy. Keep purpose and essence distinct from the audience-facing brand message, and keep brand values above USP, headline, and CTA copy.
- Never use Playwright, Chrome MCP, or browser automation unless the user explicitly requests it.

### Lean transfer rules (pipeline spec §2.1)

- **Insight-first extraction**. Before drafting any section, extract 3–5 razor-sharp core insights from the accepted Stage 1 anatomy. Each insight is a one-sentence causal claim: "The brand does X because Y, which creates Z." Write these to `transfer-input.json` under `core_insights` before proceeding.
- **Natural connection flow**. Section drafts must weave the extracted insights into a coherent narrative — each section references and builds on insights from previous sections. Do not fill sections independently or mechanically.
- **No blank fields**. Omit any section or element that has no supporting evidence or direction. Do not produce placeholders.
- **No duplicate images**. Before generating or saving an asset, check `asset-registry.json` and Stage 1's `visual-corpus.csv`. Reuse existing registered paths when the same visual is needed; never re-download or duplicate.

## Initialize

```bash
python3 scripts/init_transfer.py <stage-2-directory>
```

Required package artifacts:

- `transfer-input.json`
- `extended-brand-anatomy.md`
- `outputs/extended-brand-anatomy.json`
- `asset-registry.json`
- `assets/brand-mood/`
- `assets/product-hero/`
- `prompts/`
- `stage-review.json`

## Procedure

1. Load the accepted source JSON and its registered Storybook reader. Preserve source grammar, protected boundaries, design-system relationships, product language, and unresolved gaps.
2. Capture only missing target decisions in one compact direction-lock prompt covering target, audience, lineup, source distance, shared invariants, visual priority, and landing goal. Ask one follow-up only when the answers conflict or would materially change the lineup. Write the lock to `transfer-input.json` before drafting.
3. For a routed pipeline, the root runs `plan_stage_jobs.py` after the direction lock, dispatches the three direction-draft specs, and merges their structured results before image work. Workers write only their assigned `.work/<job-id>/`; the root alone writes the canonical package and pipeline state. Write only sections that have supporting direction — omit sections without substance. Each included section needs one `key_insight` that connects to the extracted core insights. Every lineup product needs a distinct role, use case, form or interaction cues, allowed variation, landing message, and proof-image roles.
4. Keep verbal system, key visual, brand mood, product imagery, and product-native traits separate. Record every token direction as `keep`, `tune`, or `new` with source lineage.
5. Invoke `$commercial-photo-prompting`, then `$imagegen`, for exactly two anchor images: representative product hero and brand mood. In a routed pipeline, use their generated job specs. Run the two external image jobs concurrently only when `execution.image_parallelism.mode` is `enabled`; otherwise keep the calls serial while preserving separate work directories. Save both locally and register their prompt, lineage, invariants, allowed variation, and check status.
6. Generate the canonical JSON from the approved model and finalize from the starter-kit root:

```bash
pnpm finalize-brand-report -- <stage-2-directory>
```

This is the only validation entrypoint. Do not run `validate_transfer.py` or `validate_extended.py` separately before or after finalization, and do not add a post-pass manual audit. On failure, repair the reported canonical issue and rerun only after that change. Do not hand-edit `public/brand-reports` or generated stories.

## Delivery checkpoint

Report one compact finalization status line, then deliver the Storybook story, canonical JSON, and two registered images. Do not enumerate internal validator categories unless asked. Ask one adjustment question covering brand direction, product family, and anchor images. Record `pending`, `revision_requested`, or `accepted` in `stage-review.json`. Do not start Stage 3 before acceptance. A routed acceptance refreshes only the accepted registration before advancing.
