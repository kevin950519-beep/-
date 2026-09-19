# Global brand-system framework

Use this framework after the source anatomy and grammar are complete. It turns source observations into portable brand operating guidance without creating a target design system.

## Required record structure

For every guidance item state:

1. role;
2. relationship to adjacent elements;
3. invariant that should survive tools, channels, and locales;
4. variable that may change with format, density, script, or accessibility needs;
5. scope and exception;
6. supporting evidence IDs.

For brand color and typography, also include compact `Observed reference values` blocks when exact first-party values are available. Record the value, its role, channel, market, observation date, and evidence IDs. Every color value must also name its color layer. If exact values are unavailable, state the gap instead of inventing them.

Keep `Observed` and `Inferred` boundaries. A repeated relationship requires two or more evidence items. Do not upgrade one webpage, campaign, collaborator, product line, or region into a global rule.

## 1. Brand color scheme

Classify color before interpreting it. Use these separate layers:

1. `Identity color field`: colors used by the masterbrand mark, wordmark, and persistent identity surfaces;
2. `Interaction and status color references`: link, action, focus, selection, success, warning, and error colors;
3. `Product and campaign color`: physical product CMF, collection, launch, seasonal, and campaign colors;
4. `Photographic color`: colors produced by location, lighting, wardrobe, grading, and post-production.

An interaction, action, link, or status color is not a brand identity color unless first-party identity guidance explicitly assigns it that role. A frequently repeated campaign or product color is not automatically the masterbrand color. State the core identity field first, then describe the other layers without merging them.

Describe each layer through roles and controlled relationships:

- canvas and surface roles;
- primary and secondary text roles;
- identity emphasis, action, and status roles as separate records;
- neutral versus chromatic balance;
- where saturated color may concentrate;
- text/background and image/text pairing logic;
- separation of UI color, campaign color, product CMF, and photographic palette;
- light, dark, accessibility, regional, and campaign variation;
- permanent, conditional, and prohibited color behavior.

Do not end with a universal hex palette. Exact colors may be shown in `Observed reference values` only as dated, channel-bound source observations. The table must include `Color layer`; never title a set of link or button values `Brand colors`.

## 2. Typography hierarchy

Describe information roles and relative hierarchy:

- display statement;
- page and section headings;
- body and long-form reading;
- labels, captions, metadata, actions, prices, specifications, and states;
- relative differences in scale, weight, line height, color, and density;
- line-length and paragraph rhythm;
- responsive hierarchy preservation;
- Latin, Korean, CJK, RTL, and other script substitution or expansion;
- what must remain stable when the typeface changes.

For an owned digital channel, verify more than the family name when the source exposes it. Record the first-party CSS family stack, webfont family, weight, style, file format, direct source URL, locale/script coverage, observation date, and fallback order. Set `documentation_only: true`. In the reader-facing Storybook document, render a typography-specimen matrix with large, directly comparable Display, H1, H2, H3, Body, Label, and Caption samples. Apply the linked font only inside each specimen; never mutate the starter-kit MUI theme, typography tokens, or global body styles. Exact observed values remain source claims. Missing levels may use the fixed reader's visibly labeled `documentation-preview` scale and must not be described as observed brand tokens. Do not present a list of font URLs as the typography output; keep links in compact provenance. If licensing or access prevents loading the font, show a `webfont gap` rather than silently falling back.

Do not prescribe one font file, fixed type scale, or universal pixel/rem values as the global system. Exact source fonts and sizes may be shown in `Observed reference values` with their channel and date. Do not copy a font into the project unless its license permits redistribution; a first-party remote URL may be used as a dated research reference when direct loading is permitted.

## 3. Spacing strategy

Describe spacing by purpose and relative separation:

- inline separation;
- separation within one information group;
- separation between content groups;
- section boundaries;
- page-edge breathing room;
- dense versus spacious regions;
- what compresses first on narrow or information-heavy surfaces;
- minimum distinctions that preserve grouping and hierarchy.

Do not impose a universal 4-point, 8-point, or named scale unless the source explicitly publishes it and the report clearly limits its scope.

## 4. Layout strategy

Describe how content is organized:

- primary alignment anchors;
- content width and surrounding whitespace;
- relationship among text, key visual, product, and action;
- central, asymmetric, split, editorial, or modular arrangements and their conditions;
- focal-item count and disclosure sequence;
- image prominence and crop behavior;
- repeated structure across home, product, campaign, editorial, support, retail, and other applicable page families;
- responsive collapse and reordering logic;
- regional and script-length accommodation;
- permitted exceptions.

Do not prescribe one grid library, column count, breakpoint set, or component framework as the global system.

## Relationship to other visual layers

The framework summarizes relationships; it does not replace detailed evidence layers.

- Key-visual analysis still defines the cross-surface visual premise and how typography, color, graphic form, layout, UI, content templates, imagery, and motion express it.
- Brand and commercial photography still define casting, setting, camera, light, color, and post-production.
- Product representation still defines physical photography, UI mockup, screenshot, screen-recording, and factual-versus-atmospheric roles.
- Product-native analysis still defines physical form or digital structure, hierarchy, controls, states, feedback, and family continuity.

The final framework may state how color, typography, spacing, and layout support those layers, but it must not merge photography with physical form, mockup styling with actual interface structure, or one campaign with the masterbrand.

## Reader-facing table

Use this compact structure in the final Storybook document:

| Area | Observed reference values | Role / color layer | Relationship | Keep stable | May vary | Evidence / limit |
|---|---|---|---|---|---|---|
| Brand color scheme | [dated channel values or explicit gap] | [identity / interaction-status / product-campaign / photography] | | | | |
| Typography hierarchy | [dated channel values or explicit gap] | | | | | |
| Spacing strategy | Not required | | | | | |
| Layout strategy | Not required | | | | | |

## Exclusions

Do not produce implementation token names, DTCG JSON, CSS variables, framework syntax, fixed scales, or a target-ready component library during source analysis. Those decisions require a later user-approved transfer direction.
