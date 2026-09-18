---
name: vdl-site-remix
description: EXPLICIT INVOCATION ONLY ($vdl-site-remix or /skills); never auto-activate. Analyzes a user-provided reference website with the installed ego-browser skill, then rebuilds it on this starter kit with only the planning and brand replaced. Asks how far to depart from the original (L1 mirror, L2 slight variation, L3 structural transformation), writes project-planning-format docs (01-03 plus a reference-analysis appendix) in docs/{project}/, and modularizes the build into tokens, components, templates, sections, and pages. Korean triggers: 레퍼런스 사이트 분석해서 브랜드만 바꿔줘, 이 사이트 구조로 내 프로젝트 만들어줘, 사이트 리믹스.
---

# VDL Site Remix

Use this skill to turn a reference website into a new project on this starter kit: same structural rhythm at the chosen fidelity level, entirely new planning and brand. The canonical source is `.claude/skills/site-remix`; do not duplicate its templates, tables, or thresholds.

## Activation

This skill is EXPLICIT-INVOCATION-ONLY. It activates only when the user explicitly invokes it (`$vdl-site-remix` or `/skills`) with a reference URL. Do not auto-activate and do not select it implicitly from task matching. Wait for direct user invocation; invoking it with a URL is the explicit consent to capture that URL with ego-browser.

## Required Reads

Read these from the canonical Claude source when the workflow reaches each point. Paths are the SSOT; do not copy their content into this skill.

- Read `.claude/skills/site-remix/SKILL.md` first for the full stage table, guardrails, and resource map.
- Read `.claude/skills/site-remix/resources/capture-guide.md` before P1 (capture execution, manual fallback, failure handling).
- Read `.claude/skills/site-remix/resources/analysis-blueprint.md` before P2 (blueprint template, role vocabulary, archetype candidates).
- Read `.claude/skills/site-remix/resources/fidelity-levels.md` before P3-P5 (per-level allowances, mapping rules, planning-doc wiring).
- Read `.claude/skills/site-remix/resources/module-layers.md` before P6-P7 (layer contracts, file skeletons, module map, build order).
- Read `.claude/skills/project-planning/SKILL.md` and `.claude/skills/project-planning/resources/doc-templates.md` directly (not via `$vdl-project-planning`) before P5; follow their procedure, templates, hard gates, and question budget as-is.
- Read `.claude/skills/component-work/resources/components.md` for reuse candidates (P2, P5, P7) and `src/data/layoutTaxonomyData.js` for layout archetype ids (P2, P5).
- Before P7 implementation, read the relevant files under `.claude/rules/*.md` directly (mui-grid-usage, directory-structure, no-em-dash, code-convention, design-system); this environment does not auto-load them.
- Read the installed `ego-browser` skill before P1. It runs one TaskSpace and must be finished with `finish` when capture is done.

If the Claude source folder is missing, stop and tell the user this Codex skill depends on that local source path.

## Workflow

Follow the source SKILL.md stages P0-P8. Summary:

1. **P0 Intake**: ask, batched in one numbered list (max 4, skip any already answered): project name (kebab-case), the new brand/planning brief (who, what, tone), analysis scope (input page only, or up to 8 pages from the header nav), and whether the fidelity level is already decided. Answers here are deducted from 01's own question budget.
2. **P1 Capture**: read the ego-browser skill, then run the capture script and summarizer from a shell (same commands as Claude):
   `node .claude/skills/site-remix/scripts/capture-site.mjs --url <URL> --out docs/{project}/reference`
   `node .claude/skills/site-remix/scripts/summarize-capture.mjs --in docs/{project}/reference --write`
   Read only `reference/summary.md` and the screenshots, never the raw capture JSON. Treat the script's `roleGuess` as a guess; judge section roles from the screenshots yourself.
3. **P2 Blueprint**: write `docs/{project}/appendix-reference-analysis.md` sections 1-5 with `analysis-blueprint.md`'s template. Roles from the fixed vocabulary, archetype ids only from `layoutTaxonomyData.js`, reuse candidates only from `components.md`. Record token structure (role count, scale ratio, rhythm) before any observed value.
4. **P3 Fidelity-level question (mandatory, never skip)**: show the blueprint summary (page count, sections per page, notable interactions) first, then ask the user to pick a level. If the user already stated a level, confirm it in one line instead of re-asking.
   - **L1 mirror (100%)**: keep structure, rhythm, and interaction grammar as-is; swap only planning and brand.
   - **L2 slight variation**: keep the skeleton; adjust some sections and their internal layout to fit the new brief (budget: at most 25% of original section count changed).
   - **L3 structural transformation**: treat the original as pattern vocabulary only; let the new brief drive IA and section composition.
5. **P4 Substitution mapping**: in blueprint section 6, map each original section slot to its new counterpart, a treatment (keep/vary/replace/remove/new), and a rationale (01 section 5 task number). Unfilled L1 slots stay as `(미정, Qn)`, never deleted. P4 and 01 section 5 reference each other; backflow to 01 if a mapping needs a task that is not yet listed.
6. **P5 Planning docs**: write 01 to 03 exactly per `.claude/skills/project-planning/SKILL.md` and `doc-templates.md` (section numbers, status blocks, hard gates, question budget unchanged). 01 draws only from the new brief, never from the original's copy or inferred planning. 02 draws from blueprint sections 1, 5, 6 plus 01. 03's structure comes from blueprint sections 2 to 3; its values come from the new brand, never from observed values.
7. **P6 Module plan**: from 02 section 5 and blueprint section 5, fix the blueprint section 7 module map (page to section to template to component) and build order, and show it to the user before implementing.
8. **P7 Implementation**: order is token, then component (new/modified) via `$vdl-component-work`, then template, then content data, then section, then page, then route. Composition-level skeletons follow `$vdl-stable-layout`. Copy lives in `src/data/{project}/content.js`, never inline in JSX. Images go through `$vdl-visual-asset-prompt` fed by 03 section 4, with `Placeholder` standing in until ready; never reuse original images.
9. **P8 Closeout**: run the consistency checks from `doc-templates.md` section 5 plus the checklists in `fidelity-levels.md` and `module-layers.md`. Search 01-03 and `src/` for leaked original copy, asset URLs, or brand names. Build Storybook overview MDX wrappers per `doc-templates.md` section 0.6 if `.storybook/` exists. Run `pnpm lint`, then ask (never auto-invoke) whether to run audit agents.

## Guardrails (from the source)

- Capture only with ego-browser; never Playwright, Chrome MCP, or any other browser automation.
- Scope is the given URL plus at most 8 agreed pages; do not follow out-of-scope links. On a login wall or permission prompt, hand off to the user instead of entering credentials.
- Never open a browser yourself to check local render output; ask first if that is needed.
- If `ego-browser` is missing, report the install instructions and stop, or if the user prefers, continue in a reduced mode (static HTML structure only, tokens and motion left 미정).
- Three-way classification, always: **always replace** (brand name, logo, copy, images/video/custom icons, color values, fonts, meta), **never import** (source code, asset files or URLs including hotlinks, copy sentences, tracking scripts), **carry over** (section roles and order, archetypes, column counts and ratios, type-scale ratio, spacing rhythm, density, separator language, interaction grammar). Copy is written fresh; do not translate or paraphrase the original's sentences.
- 01 project-summary comes only from the new brief; the original's inferred planning lives only in the blueprint appendix.
- Tokens carry over structure, not values; an observed value is never a citation basis in 03.
- `.claude/skills/project-planning`'s format is the single source of truth; do not duplicate its templates or renumber its sections.
- Module layers depend one way only: Page to Section to Template to Component to Token.
- Copy and content live in `src/data/{project}/content.js`.
- No em dash, no Mermaid diagrams, tables at most 5 columns and 45 characters per cell.

## Output Format

Use the user's language unless they ask otherwise. Follow the source stage table and `doc-templates.md` exactly for the three planning documents. Each planning document ends by presenting its hard-gate checklist for the user to revise or approve. Report current stage (P0-P8), fidelity level, and next step in three lines at the start of any continuation.

## Fallback

If `.claude/skills/site-remix/` or `.claude/skills/project-planning/` is missing, stop and tell the user this Codex skill is a thin adapter that depends on those local Claude source paths. If the `ego-browser` command is unavailable, report install guidance and stop, unless the user asks to continue in the reduced static-analysis mode described above.

Do not use the em dash character U+2014 in generated files or user-facing copy.
