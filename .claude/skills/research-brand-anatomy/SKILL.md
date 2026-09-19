---
name: research-brand-anatomy
description: Research one existing brand as a ten-minute source-only Stage 1 package with canonical JSON and a fixed automatically registered Storybook report.
---

# Stage 1 — Research Brand Anatomy

Use [the normative pipeline specification](../../../docs/brand-research-pipeline-spec.md) and the complete platform-neutral workflow in [the Codex Stage 1 contract](../../../.agents/skills/research-brand-anatomy/SKILL.md).

Claude and Codex share the same canonical package, timer, validators, finalizer, React report structure, and Storybook registry. Run the scripts under `.agents/skills/research-brand-anatomy/scripts/`; do not use legacy platform-specific renderers.

Hard requirements:

- rapid mode uses ≤4 core sources, omits sections without evidence, and stops within ten minutes;
- use ego-browser as primary collection tool; if not installed, suggest installing the ego lite app (https://lite.ego.app/) and completing onboarding to register the ego-browser command, then fall back to web search if declined;
- no blank fields — omit sections, claims, or token slots that lack supporting evidence;
- no duplicate images — check `visual-corpus.csv` before saving;
- canonical output is `outputs/source-brand-analysis.json` plus `stage-review.json` and local evidence;
- final delivery runs `pnpm finalize-brand-report -- <package>` from the starter-kit root;
- the finalizer is the only validation command; do not run a standalone validator or post-pass audit;
- no HTML report or brand-specific report markup is created;
- color swatches and linked typography specimens are documentation-only and never alter starter-kit theme tokens;
- purpose, essence, positioning, promise, core values, brand message, voice, and activation/proof use the fixed evidence-scoped verbal hierarchy;
- in a routed pipeline, dispatch the three fixed research specs under the same ten-minute deadline and keep pipeline-state writes root-only;
- stop for user review before any target-brand work.
