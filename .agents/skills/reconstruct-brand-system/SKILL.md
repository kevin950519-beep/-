---
name: reconstruct-brand-system
description: "Route one brand project through three reviewed JSON-and-Storybook stages: time-boxed source research, extended target-brand anatomy, and landing materials. Enforce fixed React reports, automatic registration, and no HTML reports."
---

# Three-Stage Brand Reconstruction Router

Read [the pipeline specification](../../../docs/brand-research-pipeline-spec.md), [the chaining contract](references/chaining-contract.md), [the parallel execution contract](references/parallel-execution-contract.md), and [the Storybook report contract](references/storybook-report-contract.md) before starting a full pipeline.

## Pipeline rules

- Use exactly one Stage at a time.
- Stage JSON is canonical; Storybook is the only report reader.
- Every Stage must pass `pnpm finalize-brand-report -- <package>` before delivery.
- The finalizer is the sole validation entrypoint. Do not run a Stage validator before or after it, and do not add a post-pass manual audit.
- Never create, validate, route, or preserve an HTML report.
- Validation success never substitutes for user approval.
- The root coordinator is the only canonical and pipeline-state writer in routed parallel mode. Workers write only their assigned `.work/<job-id>/` directory and never call router scripts.
- Never use Playwright, Chrome MCP, or browser automation unless the user explicitly requests it.

### Lean pipeline rules (pipeline spec §2.1)

- **≤4 core sources** for Stage 1. Do not extend the source count across Stages.
- **ego-browser preferred** for evidence collection. If unavailable, suggest install; if declined, fall back to web search.
- **No blank fields** across all Stages. Omit sections without evidence rather than leaving them empty.
- **No duplicate images** across all Stages. Check `asset-registry.json` and `visual-corpus.csv` before saving any image.
- **Insight-first Stage 2**. Before drafting sections, extract 3–5 core insights from Stage 1 and thread them through all subsequent work.

## Initialize

```bash
python3 scripts/init_pipeline.py <pipeline-directory> \
  [--stage-1-package <source-package>] \
  [--stage-2-package <extended-package>] \
  [--stage-3-package <landing-package>] \
  [--enable-image-parallelism]
```

Use the printed `CURRENT_SKILL`. For a standalone Stage, do not initialize the chain. External image calls remain serial while `IMAGE_PARALLELISM=pilot_pending`; enable the two-worker image path only after a provider pilot confirms concurrency, cost, and visual consistency.

After the active Stage's source, direction, or shot-plan lock, the root creates its fixed bounded jobs once:

```bash
python3 scripts/plan_stage_jobs.py <pipeline-directory-or-state> --stage <stage_1|stage_2|stage_3>
```

Give each worker its generated `job-spec.json`. A worker returns `result.json` in the assigned work directory. The root alone records `running`, `completed`, `failed`, or `skipped` with `update_job.py`, merges completed shards, and writes the canonical package once. Use `summarize_parallel_run.py` after the merge to capture measured wave and worker durations; it is read-only and is not another validation pass.

## Stage sequence

1. `$research-brand-anatomy`: ten-minute rapid source research, fixed 18-section Storybook report, canonical JSON, and review checkpoint.
2. `$build-brand-from-anatomy`: fixed eight-section target anatomy, explicit product family and lineup, two registered anchor images, canonical JSON, and review checkpoint.
3. `$build-landing-materials`: fixed six-section landing materials, lineup copy and registered renders, canonical JSON, and review checkpoint.

## Review and transition

At each checkpoint ask only what should change in the current Stage. Use `pending`, `revision_requested`, or `accepted`.

On a user decision run:

```bash
python3 scripts/advance_pipeline.py <pipeline-directory-or-state> \
  --decision accepted \
  --feedback "<user response>"
```

`advance_pipeline.py` does not rerun the Stage validator. It checks the existing registration receipt and Storybook drift, updates the review record, re-registers the accepted checkpoint with the locked report ID, and advances only when that lightweight registration succeeds. Do not summarize these internal checks as separate validation rounds. A revision remains in the current Stage and receives one fresh full finalization after its canonical data changes. Stage 3 acceptance prints `CHAIN_ACTION=COMPLETE` and stops before page design or coding.
