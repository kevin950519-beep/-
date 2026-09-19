# Chaining contract

The pipeline uses one shared `pipeline-state.json`. Each stage keeps its own existing `stage-review.json`; no second approval format is introduced.

For a full single-brand chain, the router also uses the shared [parallel execution contract](parallel-execution-contract.md). Parallel jobs never cross a review gate and never replace explicit user approval.

## Transition rule

1. Finishing files or passing validation never advances a stage by itself.
2. Present the current stage and its short adjustment checkpoint to the user.
3. Interpret a clear response such as `승인`, `조절 없음`, or `그대로 진행` as `accepted`. Interpret requested changes as `revision_requested`.
4. Record that decision with `advance_pipeline.py`. The script checks the current registration receipt and drift before accepting; it does not rerun the Stage validator.
5. On `CHAIN_ACTION=CALL_SKILL`, immediately read and execute the named next skill in the same conversation. Reuse the printed package paths; do not repeat intake already stored in the pipeline.
6. On `CHAIN_ACTION=STAY`, revise the current stage and present the checkpoint again.
7. Stage 3 acceptance produces `CHAIN_ACTION=COMPLETE`. It does not start page design or coding.

Inside the active stage, the coordinator may complete several bounded jobs concurrently. Only the coordinator plans jobs, updates pipeline state, writes canonical package files, and calls `advance_pipeline.py`. A worker writes its assigned work directory and reports completion to the coordinator; it never calls router scripts or advances the stage.

## Commands

Create a pipeline and its three package directories:

```bash
python3 scripts/init_pipeline.py <pipeline-directory> \
  [--stage-1-package <source-package>] \
  [--stage-2-package <extended-package>] \
  [--stage-3-package <landing-package>]
```

Record explicit user feedback and advance or stay:

```bash
python3 scripts/advance_pipeline.py <pipeline-directory> \
  --decision accepted \
  --feedback "사용자 승인 원문 또는 짧은 요약"
```

```bash
python3 scripts/advance_pipeline.py <pipeline-directory> \
  --decision revision_requested \
  --feedback "수정 요청 원문 또는 짧은 요약"
```

Without `--decision`, the script reports or follows the decision already stored in the current stage review file.

After the current Stage lock, create its fixed material jobs without adding another report artifact:

```bash
python3 scripts/plan_stage_jobs.py <pipeline-directory> --stage stage_2
```

The root then tracks a generated job:

```bash
python3 scripts/update_job.py <pipeline-directory> \
  --stage stage_2 --job product_anchor --parallel-group stage2_anchors \
  --status running --owner image-worker
```

Every completed worker writes the generated `result.json` contract first. The root records completion, waits for the barrier, merges into the canonical model once, and may inspect read-only timing with `summarize_parallel_run.py`.

## Standalone use

If a user asks for only one stage, do not create pipeline state. That stage ends normally at its review checkpoint. Chaining is active only when the router was invoked or a `pipeline_state_path` is registered.
