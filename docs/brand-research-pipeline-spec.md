# Brand Research Pipeline Specification

Status: normative
Version: 2.1.0
Applies to: `research-brand-anatomy`, `build-brand-from-anatomy`, `build-landing-materials`, and `reconstruct-brand-system`

## 1. Design objective

The pipeline produces one canonical JSON package per Stage and one fixed React reader in Storybook. It must not produce, validate, reference, or hand off an HTML report.

```text
Stage package JSON + review + local assets
  -> deterministic Stage validator
  -> fixed normalized report contract
  -> atomic Storybook registration
  -> registration drift check
  -> user review checkpoint
```

The package JSON owns content. React owns presentation. Generated Storybook stories own registration. No brand-specific report markup is allowed.

## 2. Normative invariants

1. `outputs/*.json` is the only canonical report payload.
2. `stage-review.json` is required for every Stage.
3. `asset-registry.json` is required for Stage 2 and Stage 3.
4. `outputs/*.html`, brand-specific HTML/CSS, HTML renderer scripts, and HTML validation are forbidden.
5. Every report is normalized through `src/utils/brand-reports` and rendered only by `BrandReportDocument`.
6. Every Stage has an exact ordered section-ID contract. Sections without collected data are omitted entirely rather than left blank; `insight` is required only for included sections. Extra, duplicated, or reordered sections fail registration.
7. Every included section exposes one non-empty `insight` and a `blocks` array.
8. Registration is not an optional delivery step. A Stage is deliverable only after `finalize-brand-report` validates, registers, and checks the package.
9. Generated files under `src/stories/brand-reports/generated/` and copied packages under `public/brand-reports/` are CLI-owned.
10. Pipeline advancement checks the finalized registration receipt and re-registers the accepted review record with the same report ID before changing Stage state. It does not rerun the Stage validator.
11. Stage 1 and Stage 2 token sections use the shared color-swatch and typography-hierarchy blocks. Linked research fonts are document-only and never modify the starter-kit theme, global styles, or product tokens.
12. Stage 1 and Stage 2 verbal sections use one shared five-tier hierarchy: foundation, strategic definition, core verbal platform, expression, and activation/proof. Core values and the audience-facing brand message must appear above USP, headline, and CTA copy.
13. A routed parallel Stage uses the versioned fixed job plan. The root coordinator alone writes pipeline state and canonical files; workers write only their assigned `.work/<job-id>/` directory and return the fixed result contract.

### 2.1 Lean research rules

14. **Source cap**: Stage 1 uses at most 4 core sources (e.g. official site, brand guidelines PDF, key product page, social presence). Do not chase additional sources once 4 are collected; record gaps instead.
15. **Collection tool priority**: Use `ego-browser` as the primary evidence-collection tool. If ego-browser is not installed, suggest installation (`npm i -g @anthropic-ai/ego-browser`) and proceed only after the user accepts. If the user declines, fall back to web search and direct URL fetching.
16. **No blank fields**: When a brand element (section, claim, token, or asset slot) has no supporting evidence, omit it entirely from the canonical JSON and report. Never produce placeholder text, `TBD`, `N/A`, or empty arrays for unsupported elements.
17. **No duplicate images**: Each local evidence image and generated asset must be unique across all Stages. Before saving a new image, check `asset-registry.json` and existing `visual-corpus.csv` entries. Reuse the registered path when the same visual is needed in a later Stage; do not copy or re-download it.
18. **Insight-first brand transfer**: Stage 2 must extract 3–5 razor-sharp core insights from the accepted Stage 1 anatomy before any section drafting. Each insight is a one-sentence causal claim ("The brand does X because Y, which creates Z"). The section drafts then weave these insights into a coherent narrative rather than filling sections independently.

## 3. Stage report structures

The React structures preserve the final legacy HTML information architecture while removing HTML as an artifact. The review checkpoint is rendered after the numbered sections by `BrandReportDocument`.

### Stage 1 — Source Brand Analysis

1. `terminology`
2. `source-brand-anatomy`
3. `evidence`
4. `strategy`
5. `verbal`
6. `identity-channel-tokens`
7. `key-visual`
8. `brand-mood`
9. `photography-film`
10. `product-representation`
11. `product-native-visual-language`
12. `composition`
13. `product-interface-service`
14. `grammar`
15. `global-brand-system-framework`
16. `core-claims`
17. `evidence-index`
18. `structured-data-handoff`

### Stage 2 — Extended Brand Anatomy

1. `source-grammar-application`
2. `brand-positioning`
3. `landing-product-concept`
4. `verbal-branding-and-copy-hierarchy`
5. `visual-branding-and-key-visual`
6. `brand-mood-and-brand-imagery`
7. `product-visual-traits-and-product-imagery`
8. `design-token-direction`

### Stage 3 — Landing Materials

1. `landing-narrative`
2. `brand-value`
3. `brand-story`
4. `product-family`
5. `product-lineup`
6. `product-assets-and-map`

Stage 3 boundaries remain canonical data and render inside `product-assets-and-map`; they do not create an unapproved seventh section.

### Stage 1–2 token-guide contract

- Color records render as swatches with a literal value, color layer, role, scope or source lineage, and observed/directional status. A missing exact Stage 1 value remains an explicit gap; it is never invented.
- Typography records render in one fixed Display, H1, H2, H3, Body, Label, Caption comparison. Exact source values remain labeled `observed`; fixed reader scale used only to reveal hierarchy remains labeled `documentation-preview`.
- A verified http(s) stylesheet or font-file URL remains visible as provenance and may be loaded only for the specimen text. Access or licensing failure renders `webfont_gap`.
- Both canonical token sections set `documentation_only: true`. Adapters and components must not write these values into MUI theme configuration, global `body` styles, CSS variables, or starter-kit design tokens.

### Stage 1–2 verbal hierarchy contract

- Tier 1 `Brand foundation`: brand purpose and brand essence.
- Tier 2 `Strategic definition`: positioning and brand promise.
- Tier 3 `Core verbal platform`: named core brand values and one audience-facing brand message. This message is visually emphasized and must not be silently replaced by a campaign line, product USP, or CTA.
- Tier 4 `Expression system`: voice, vocabulary, and sentence behavior.
- Tier 5 `Activation and proof`: message architecture, narrative route, reasons to believe, family/product USP, headline/support direction, and CTA.
- Stage 1 synthesizes these levels only from evidence already collected and allows explicit `gap` records; it does not extend the ten-minute research window. Stage 2 records target purpose and essence directly and reuses positioning and promise from its positioning section.

## 4. Ten-minute Stage 1 contract

The default research mode is `rapid`. It uses at most 4 core sources and omits sections without evidence.

| Budget | Limit |
| --- | ---: |
| Scope lock and timer start | 1 minute |
| Evidence collection (ego-browser preferred) | 5 minutes |
| Anatomy and grammar synthesis | 2 minutes |
| Export, finalize, and registration check | 2 minutes |
| Hard elapsed limit | 10 minutes |

Rapid targets (not minimums — skip what the sources don't provide):

- ≤4 core sources total (official site, brand PDF, key product page, social);
- representative local visuals from collected sources only — no quantity floor;
- material claims backed by collected evidence — no quantity floor;
- 3–5 causal grammar rules distilled from what was found.

Coverage gaps do not extend the timer or source count. Record them under `unresolved_gaps` and continue to finalization. Repeated or duplicate images do not count as new coverage and must not be saved.

An expanded study is permitted only when the user explicitly requests deeper research. It must record that request and does not claim compliance with the ten-minute rapid SLA.

`research-run.json` records start, deadline, completion, elapsed time, mode, and stop reason. A rapid package cannot pass delivery validation when the run record is missing, incomplete, or over ten minutes.

## 5. Finalization contract

From the starter-kit root, every Stage uses exactly one delivery command:

```bash
pnpm finalize-brand-report -- <stage-package-directory>
```

The command must:

1. identify exactly one canonical Stage JSON;
2. run that Stage's deterministic validator;
3. normalize the report and enforce the exact section contract;
4. atomically copy JSON, review, registry, and referenced local assets;
5. generate the fixed CSF story using `RegisteredBrandReport`;
6. run registration `--check` and fail on any drift.

The command is idempotent for identical canonical inputs. It validates the current Stage once and writes only one operational source-package file, `registration-receipt.json`, containing the locked report ID, registered package SHA, review status, and finalization time.

The finalizer is the sole validation entrypoint for delivery. Agents must not run a Stage validator separately as a preflight, repeat it after finalization, or follow a pass with manual rereading, evidence recounting, digest comparison, or an independent audit. Successful internal command output is collapsed into one `FINALIZED` line containing Stage, report ID, validation time, registration time, drift-check time, total time, and package path. On failure, the relevant command output is exposed; only a canonical data or provenance change authorizes another full finalization.

User acceptance uses the internal registration-only path. It checks the existing receipt and registered package, updates the review checkpoint, and re-registers that review with the locked ID without invoking a Stage validator again. Full finalization runs again only after canonical JSON, provenance, or image data changes.

Generated registration can be removed without hand-editing registry or story files:

```bash
pnpm unregister-brand-report -- <report-id> --dry-run
pnpm unregister-brand-report -- <report-id>
pnpm unregister-brand-report -- <report-id> --check
```

Unregister is limited to the derived `public/brand-reports/<report-id>` package, its generated story, and its registry entry. It never removes the canonical source Stage package, so the report can be restored with `finalize-brand-report`.

## 6. State transitions

```text
active
  -> finalized_pending_review
  -> revision_required -> finalized_pending_review
  -> accepted -> next Stage
```

- Deterministic validation does not equal user acceptance.
- A revision updates canonical package data and runs one fresh full finalization.
- Acceptance first checks the existing registration receipt and drift, then updates `stage-review.json` and refreshes only the registered checkpoint before advancing.
- Acceptance never reruns the current or upstream Stage validators.
- Registration failure leaves the current Stage active and prevents transition.

## 7. Routed parallel execution

`parallel_single_brand` is a bounded Stage-internal workflow, not permission to cross a review gate. After the source, direction, or shot-plan lock, the root creates the fixed Stage jobs with `plan_stage_jobs.py`, dispatches independent specs, records lifecycle events with `update_job.py`, waits at the barrier, and writes the canonical model once.

Every completed job must provide `.work/<job-id>/result.json` with matching Stage and job identity, `status: completed`, and `lineage`, `unresolved_gaps`, and `files` arrays. Declared files must exist inside that job directory. Missing plans, missing or shared outputs, path escapes, invalid status transitions, and all-skipped plans without an explicit serial fallback block acceptance.

Pipeline-state writes use a lock and atomic replacement as defense in depth. Operationally, workers still never write state or call routing, validation, finalization, or registration commands; the root processes their events sequentially.

The fixed waves are:

- Stage 1: three research jobs for strategy/verbal/identity, visual corpus, and product-native language under the same ten-minute deadline;
- Stage 2: three direction shards, then product-hero and brand-mood anchor jobs;
- Stage 3: landing copy/map plus at most two disjoint product-render lanes.

External image concurrency defaults to `pilot_pending`. Text and research jobs may run concurrently, but Stage 2 and Stage 3 external image calls remain serial until a controlled provider pilot confirms real concurrency, acceptable cost and rate-limit behavior, and visual consistency. Enabled image concurrency remains capped at two workers.

The Stage 1 live pilot is promoted only when stage start to pending registration improves by at least 20%, no job result or state update is lost, and first-pass finalization and revision performance do not regress. `summarize_parallel_run.py` reports job and wave timings without mutating the package or adding a validation pass.

## 8. Acceptance tests

A pipeline implementation conforms only when all of the following pass:

- no brand skill or router references an HTML report;
- the three normalized Stage models match the exact ordered section contracts;
- registration rejects missing reviews and missing Stage 2/3 asset registries;
- registration is idempotent and `--check` detects drift;
- the router cannot accept a Stage whose Storybook registration is missing or stale, and restores the original review when finalization fails;
- acceptance succeeds even when the Stage validator is unavailable after a valid pending finalization, proving that the router does not revalidate;
- finalization emits one compact timing summary and suppresses successful validator and registrar chatter while preserving failure diagnostics;
- the full fixture route proves pending registration, accepted re-registration, Stage 1-to-2 and Stage 2-to-3 input wiring, and Stage 3 completion;
- a rapid Stage 1 package records an elapsed duration of ten minutes or less;
- lint and the non-browser contract checks pass;
- the Storybook template story exposes all three fixed Stage formats.
- Stage 1 and Stage 2 normalize both token-guide blocks, preserve webfont provenance, and expose the complete seven-role typography hierarchy without changing theme tokens.
- Stage 1 and Stage 2 normalize the same five-tier verbal hierarchy and visibly preserve core values and brand message above activation copy.
- the fixture route uses `parallel_single_brand`, creates the fixed Stage jobs, rejects missing and incomplete results, preserves concurrent state updates, and reaches each merge barrier;
- delayed fake workers prove an independent wave completes faster in parallel than the same workers run serially, without calling an external image API;

The required non-browser CI baseline is:

```bash
pnpm check-brand-report-contracts
pnpm test-brand-report-pipeline
pnpm lint
```

`pnpm test-brand-report-pipeline` must execute only against an isolated temporary project assembled from the committed Stage 1–3 fixtures. It must not register fixture reports into the working repository.

Browser automation is not part of this contract. Visual browser inspection requires separate explicit user authorization.
