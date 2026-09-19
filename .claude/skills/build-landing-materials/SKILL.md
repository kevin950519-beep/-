---
name: build-landing-materials
description: Build Stage 3 landing copy and product-image materials from accepted Stage 2 JSON and finalize the fixed six-section React Storybook report.
---

# Stage 3 — Build Landing Materials

Use [the normative pipeline specification](../../../docs/brand-research-pipeline-spec.md) and the complete platform-neutral workflow in [the Codex Stage 3 contract](../../../.agents/skills/build-landing-materials/SKILL.md).

Claude and Codex share the same canonical package, validators, finalizer, React report structure, and Storybook registry. Run the scripts under `.agents/skills/build-landing-materials/scripts/`.

Hard requirements:

- require accepted Stage 2 JSON and current Storybook registration;
- omit sections without supporting material — no blank fields or placeholders;
- no duplicate images — check `asset-registry.json` from Stages 1–2 before saving any render;
- landing copy must build on the core insights extracted in Stage 2 — maintain narrative continuity;
- canonical output is `outputs/landing-materials.json`, `asset-registry.json`, and `stage-review.json`;
- final delivery runs `pnpm finalize-brand-report -- <package>`;
- the finalizer is the only validation command; do not run a standalone validator or post-pass audit;
- in a routed pipeline, use the fixed copy/render worker specs and keep external render calls serial until image parallelism is enabled;
- no HTML report or coded landing page is created;
- stop for final user review.
