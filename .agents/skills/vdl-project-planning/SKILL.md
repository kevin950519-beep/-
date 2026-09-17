---
name: vdl-project-planning
description: EXPLICIT INVOCATION ONLY ($vdl-project-planning or /skills); never auto-activate. Authors planning docs under docs/{project-name}/ (01-project-summary, 02-ux-flow, 03-visual-direction) with a shared skeleton, a per-section status block (확정/잠정/미정), and hard gates that allow provisional approval so the next document can start before every section is final. Korean triggers: 기획 문서 작성해줘, 프로젝트 계획, 새 기능 기획, ux-flow 만들어줘, 다음 단계 진행해줘.
---

# VDL Project Planning

Use this skill to write the three planning documents (01-project-summary, 02-ux-flow, 03-visual-direction) under `docs/{project-name}/`. The canonical source is `.claude/skills/project-planning`; do not duplicate its templates, workflow, or the cross-referenced component-work resources.

## Activation

This skill is EXPLICIT-INVOCATION-ONLY. It activates only when the user explicitly invokes it (`$vdl-project-planning` or `/skills`). Do not auto-activate and do not select it implicitly from task matching, even when a request sounds planning related. Wait for direct user invocation.

## Required Reads

Read these from the canonical Claude source when the workflow reaches each point. Paths are the SSOT; do not copy their content into this skill.

- Read `.claude/skills/project-planning/SKILL.md` first for the start procedure, entry modes, and guardrails.
- Read `.claude/skills/project-planning/resources/doc-templates.md` for section 0 (common rules) plus the template of the document being written. It is the single source of the format: fixed section numbers, the status block, the hard gates, and the consistency checks.
- Read `.claude/skills/component-work/resources/components.md` and `taxonomy-index.md` for 02 (reuse check, category mapping).
- Read `.claude/skills/component-work/resources/mui-theme.md` for 03 (current design tokens).
- Read `src/data/layoutTaxonomyData.js` for 03 section 2 layout archetype ids.
- Read `.claude/skills/project-planning/resources/sql-reserved-words.md` when filling 02 section 3.2 table names.

If the Claude source folder is missing, stop and tell the user this Codex skill depends on that local source path.

## Workflow

Follow the source SKILL.md. Summary:

1. Start: inspect `docs/{project-name}/`. If documents exist, read each document's status block and report in three lines where things stand (document states, count of 미정 items, next step). Pick an entry mode: new, continue, single document, or backflow. If the project has `.storybook/`, check `src/stories/overview/` for the doc MDX wrappers; create them from template section 0.6 (raw import rendered by `EditorialDocument`) and replace any inline copies. Never leave a copied body in MDX.
2. 01 project-summary: ask at most four questions (draft first, then ask confirmation points). Write with the template. Self-check the forbidden list (screen names, component names, color values, layout patterns, motion, implementation status). Present the hard-gate checklist and ask for approval.
3. 02 ux-flow: read 01 section 4 (users, handled things) and section 5 (tasks), citing only 확정 or 잠정 items. Write one scenario per task with the same number. Reuse names from 01 letter for letter. Check section 3.2 table names against sql-reserved-words. Run the consistency checks. Present the gate.
4. 03 visual-direction: read 01 section 3, 02 section 2.1 and section 4, and mui-theme. Layout archetypes only from layoutTaxonomyData ids. Image direction as FORMAT / LOOK / SUBJECT with one or two LOOK keywords, or "해당 없음" with a reason. References only from the user. Present the gate.

Single document requests: check the upstream hard gate first. If it is not met, show the missing items in a table and stop.

## Guardrails (from the source)

- Every document opens with a decision-status block (`## 결정 현황`) marking each section 확정 / 잠정 / 미정. Drafts contain only 잠정 and 미정; 확정 comes only from the user's approval answer.
- Two kinds of approval: full (all sections 확정) and provisional (hard gate met). Provisional approval is enough to start the next document.
- Never cite an upstream 미정 item downstream. Leave the cell 미정 and raise one upstream question instead.
- Backflow: when downstream work needs an upstream change, edit upstream, downgrade that section to 잠정, update its revision line, and mark affected downstream sections 잠정.
- Question budget: at most four per document. Unanswered questions become 미정 and are not asked again.
- No diagrams (no Mermaid). Flows are step tables; hierarchy is a code-block tree.
- Recommended length caps (01 120, 02 250, 03 200 lines, separators and note lists included): propose an appendix split, never truncate.
- Prefer tables over prose; check existing components for reuse before proposing new ones; never invent reference image URLs.
- Readability (template 0.4): tables have at most 5 columns and cells of at most 45 characters, every H2 is preceded by `---`, status is marked in the cell (`(잠정)`) rather than in a status column.
- Storybook (template 0.6): docs live only in `docs/{project-name}/`; Storybook pages import the file raw and render it with `EditorialDocument` (brand-themed editorial layout). MDX does not parse GFM tables and copies go stale.

## Output Format

Use the user's language unless they ask otherwise. Follow `doc-templates.md` exactly; section numbers and titles are fixed. Each document ends by presenting the hard-gate checklist and the document for the user to revise or approve.

## Fallback

If `.claude/skills/project-planning/` (or a required cross-referenced `.claude/skills/component-work/resources/*.md`) is missing, stop and tell the user this Codex skill is a thin adapter that depends on those local Claude source paths.

Do not use the em dash character U+2014 in generated files or user-facing copy.
