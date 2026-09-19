---
name: build-brand-from-anatomy
description: Build a target-brand Stage 2 anatomy from accepted source JSON and its registered Storybook report, then finalize the fixed eight-section React report.
---

# Stage 2 — Build Extended Brand Anatomy

Use [the normative pipeline specification](../../../docs/brand-research-pipeline-spec.md) and the complete platform-neutral workflow in [the Codex Stage 2 contract](../../../.agents/skills/build-brand-from-anatomy/SKILL.md).

Claude and Codex share the same canonical package, validators, finalizer, React report structure, and Storybook registry. Run the scripts under `.agents/skills/build-brand-from-anatomy/scripts/`.

Hard requirements:

- require accepted Stage 1 JSON and current Storybook registration;
- before drafting sections, extract 3–5 razor-sharp core insights from Stage 1 anatomy; each insight is a one-sentence causal claim ("The brand does X because Y, which creates Z");
- sections must weave insights into a coherent narrative — no independent/mechanical filling;
- omit sections without supporting direction — no blank fields or placeholders;
- no duplicate images — check `asset-registry.json` and Stage 1 `visual-corpus.csv` before saving;
- canonical output is `outputs/extended-brand-anatomy.json`, `asset-registry.json`, and `stage-review.json`;
- final delivery runs `pnpm finalize-brand-report -- <package>`;
- the finalizer is the only validation command; do not run standalone validators or a post-pass audit;
- no HTML report or brand-specific report markup is created;
- color swatches and linked typography hierarchy are documentation-only and never alter starter-kit theme tokens;
- verbal direction follows the fixed purpose/essence-to-message/value-to-activation hierarchy;
- collect missing direction decisions in one compact prompt and ask one follow-up only for material conflicts;
- in a routed pipeline, use the fixed worker specs and keep external anchor calls serial until image parallelism is enabled;
- stop for user review before Stage 3.
