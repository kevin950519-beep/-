# Storybook brand-report contract

Brand reports are authored as canonical Stage JSON and read through one fixed React document system. This contract is subordinate to [the normative pipeline specification](../../../../docs/brand-research-pipeline-spec.md).

## Source of truth

- Stage 1: `outputs/source-brand-analysis.json` and `stage-review.json`.
- Stage 2: `outputs/extended-brand-anatomy.json`, `stage-review.json`, and `asset-registry.json`.
- Stage 3: `outputs/landing-materials.json`, `stage-review.json`, and `asset-registry.json`.
- HTML reports and brand-specific report markup are forbidden.
- Storybook adapters may organize canonical data but must not invent, omit, or reinterpret material decisions.

## Fixed reader

All reports use this path:

```text
canonical Stage JSON
  -> normalizeBrandReport
  -> exact Stage section contract
  -> BrandReportDocument
  -> Brand Reports/<brand>/<stage>
```

The exact ordered section IDs live in `src/utils/brand-reports/reportStructure.js`. Registration fails when an adapter emits a missing, extra, duplicated, reordered, or insight-free section. `Brand Reports/Templates` previews all three locked formats.

## Finalization and registration

From the starter-kit root run exactly:

```bash
pnpm finalize-brand-report -- <stage-package-directory>
```

Initial or revised finalization runs the current Stage validator once, fixed React structure check, atomic package registration, CSF generation, and drift check. It writes `registration-receipt.json` with the locked report ID and registered package SHA.

`finalize-brand-report` is the sole validation entrypoint. Do not invoke the Stage validator as a preflight or postflight command, and do not follow a passing finalization with a manual reread, recount, digest check, or independent audit. Successful subcommand chatter stays hidden; the finalizer emits one timing summary. Failure output remains visible so only the reported canonical issue is repaired before a fresh finalization.

Acceptance does not rerun the Stage validator. The router checks the receipt against the current registered package, updates the review, and uses the registration-only path to refresh the accepted checkpoint with the same report ID. Re-run full finalization only after canonical JSON, provenance, or image data changes.

Do not hand-edit:

- `public/brand-reports/<report-id>/`;
- `public/brand-reports/registry.json` entries;
- `src/stories/brand-reports/generated/*.stories.jsx`.

## Reader presentation rules

- Every section starts with one canonical `insight` sentence.
- Headings and prose wrap without clipping, ellipsis, line clamps, `nowrap`, or hidden overflow.
- Evidence images retain intrinsic aspect ratio.
- Preserve evidence IDs, source URL, credit, rights note, local provenance, source lineage, protected boundaries, and review checkpoint.
- Preserve complete URLs in `href`; use a concise source title, credit, or hostname as visible text.
- Missing optional content renders as an explicit gap or empty state, never invented copy.
- Stage 1 and Stage 2 color data uses the shared swatch guide with value, layer, role, and evidence or lineage.
- Their typography data uses the shared Display–Caption specimen guide. Linked fonts apply only to specimen text; `documentation-preview` scale values are reader affordances, not material brand decisions.
- Never write report colors or fonts into the MUI theme, global styles, CSS variables, or starter-kit product tokens.
- Stage 1 and Stage 2 use the shared verbal-brand hierarchy. Purpose and essence lead into positioning and promise; core values and brand message precede voice, USP, proof, headline, and CTA records.
- Validation and registration do not equal user approval.

Browser automation is not a registration or validation method. Use deterministic checks and lint unless the user explicitly requests browser inspection.
