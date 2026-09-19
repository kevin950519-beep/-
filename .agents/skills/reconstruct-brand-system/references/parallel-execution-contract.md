# Single-brand parallel execution contract

Use this contract only for a full routed pipeline. Standalone stage skills keep their normal execution behavior.

## Invariants

- Parallelize work inside the current accepted stage; never work ahead across a user-review gate.
- The root coordinator is the only writer for canonical JSON, Markdown, review, registry, handoff, and pipeline-state files.
- Workers own bounded shards or unique asset paths. They never edit the same file or another worker's output.
- Workers never call `plan_stage_jobs.py`, `update_job.py`, `advance_pipeline.py`, a validator, finalizer, or registrar. The root records worker state sequentially after receiving lifecycle events.
- Give workers the package path, one task, allowed output paths, required contracts, and acceptance conditions. Prefer `fork_turns: "none"`; do not fork the full conversation when package files contain the needed context.
- Reuse an existing worker for a related later-stage task when available. Do not preserve a worker merely to occupy a slot.
- When two or more independent jobs exist and worker slots are available, parallel execution is required. Use serial execution only when the runtime has no worker slots, the work has a true dependency, or parallel tool calls are unavailable. Record the stage-specific reason in `pipeline-state.json.execution.serial_fallback_reason`.

## Ownership and merge

After the Stage-specific lock, the root creates the fixed job specs:

```bash
python3 scripts/plan_stage_jobs.py <pipeline-directory-or-state> \
  --stage <stage_1|stage_2|stage_3>
```

Workers write only under `<stage>/.work/<job-id>/`. Every generated `job-spec.json` fixes the task, allowed directory, result path, and acceptance conditions. A worker returns `result.json` with:

- `artifact_type: brand_pipeline_job_result` and the matching Stage and job ID;
- `status: completed`;
- a structured shard rather than a second final report;
- `lineage`, `unresolved_gaps`, and `files` arrays;
- only files inside its assigned work directory.

The coordinator waits at the named barrier, resolves conflicts, writes the canonical model once, then runs the single finalizer. Do not merge prose by concatenation.

The root tracks a preplanned job with:

```bash
python3 scripts/update_job.py <pipeline-directory-or-state> \
  --stage stage_1 --job visual_corpus --parallel-group stage1_research \
  --status running --owner visual-worker
```

Mark jobs `completed`, `failed`, or `skipped` with an output path or concise note. Job tracking is operational metadata, not a new report artifact.

`update_job.py` locks and atomically replaces pipeline state as a defensive measure, but this does not authorize workers to write state. A completed job is rejected unless its expected `result.json` exists, matches the job identity, and keeps every declared file inside the worker directory.

The router will not accept a stage in `parallel_single_brand` mode until the fixed plan exists and every recorded job for that stage is `completed` or `skipped`. It rejects missing results, duplicate IDs or outputs, path escapes, a missing skip reason, and a stage that has neither jobs nor a serial fallback. For a real serial fallback, plan one skipped operational job and record the reason in one command:

```bash
python3 scripts/plan_stage_jobs.py <pipeline-directory-or-state> \
  --stage stage_2 \
  --serial-fallback-reason "worker slots unavailable"
```

After the barrier, inspect measured worker and wave durations without changing state:

```bash
python3 scripts/summarize_parallel_run.py <pipeline-directory-or-state> --stage stage_1
```

## Stage 1 waves

After scope lock, run the three fixed non-overlapping research jobs when slots allow:

1. `strategy_verbal_identity` — strategy, authorship, verbal, identity, and channel evidence;
2. `visual_corpus` — key visual, UI/content, photography, font, color, and direct visual corpus;
3. `product_native_language` — physical/digital/hybrid product-native language, behavior, state, and feedback.

All jobs share the ten-minute Stage deadline and stop new searches at minute 6. Barrier: merge and deduplicate evidence IDs, URLs, and local assets. After the barrier, the coordinator owns the final anatomy. Do not add another research wave during the Stage 1 pilot; final claims and boundaries remain coordinator decisions.

## Stage 2 waves

Collect missing decisions in one compact prompt and write one direction lock first: target, audience, lineup, source distance, shared product invariants, accent behavior, visual priority, and landing goal. Ask one follow-up only when answers conflict or materially change the lineup.

After that lock, verbal/narrative, product/lineup, and visual/token drafts may run in parallel as shards. The coordinator resolves them into one anatomy before image generation.

The fixed anchor jobs are `product_hero_anchor` and `brand_mood_anchor`. Run external image calls concurrently only when `pipeline-state.json.execution.image_parallelism.mode` is `enabled`; `pilot_pending` keeps them serial. Always serialize when the mood image must use the finished hero image as a direct geometry reference. While images run, the root may prepare the canonical model, prompt records, registry skeleton, and report shell.

## Stage 3 waves

Before fan-out, lock a shot plan containing each product, product USP, communication job, invariants, allowed variation, asset ID, and landing section.

Then run `landing_copy_map` independently from `product_render_lane_a` and `product_render_lane_b`. Assign every product to exactly one render lane. Use at most two external image workers only when image parallelism is `enabled`; `pilot_pending` executes the render lanes serially. While images run, the coordinator prepares the model and report shell. Register assets and render the report only after every required image job reaches the barrier.

## Do not parallelize

- the direction-lock prompt or its one necessary follow-up;
- source, direction, or shot-plan locks;
- user checkpoints and stage transitions;
- final brand-coherence decisions;
- canonical-model writes;
- fast scaffolding, digest, routing, or validator commands.

## Stall handling

During long image work, check progress at useful boundaries without blocking other workers. If all required images exist but a worker reports assembly work without updating its owned files across two checks, interrupt it and let the coordinator finish the deterministic merge/render. Never restart completed research or image generation merely because final assembly stalled.

## Pilot gate

- Keep external image parallelism `pilot_pending` until a controlled provider run confirms actual concurrent processing, no duplicate billing or rate-limit failures, and acceptable cross-worker visual consistency.
- Stage 1 is the first live pilot because it uses the fixed ten-minute deadline and does not require parallel image calls.
- Promote the workflow only when stage start to pending registration improves by at least 20%, no job is lost, and first-pass finalization or revision performance does not regress.
- Parallelism reduces critical-path latency, not total work. Treat a 10–25% increase in aggregate worker time or compute as an explicit tradeoff rather than a speed failure.
