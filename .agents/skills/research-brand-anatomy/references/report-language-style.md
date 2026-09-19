# Source-report language and editorial style

Use this reference only when turning the approved source anatomy into the reader-facing Storybook document. Do not rewrite the evidence register, Core Claim rows, or grammar source fields merely to make them sound simpler.

## 1. Meaning comes before brevity

Easy language does not mean the shortest possible sentence. Preserve every meaningful component of the source claim:

- cause and effect;
- sequence;
- parallel or paired operations;
- contrast;
- intended outcome;
- scope, exception, and uncertainty.

Before shortening a sentence, list its semantic units. The edited sentence must retain them all.

```text
Source units
A: one image receives one explanatory role
B: several images form a sequence
C: the sequence completes the product story

Rejected
사진 한 장에는 한 가지 설명 역할을 부여한다.

Accepted
사진 한 장에는 한 가지 설명 역할을 부여하고,
이미지 시리즈로 제품의 전체 이야기를 완성한다.
```

## 2. Choose words by precision and familiarity

Do not replace a useful word merely because it is borrowed from English. Keep a term when it is familiar to the intended reader and more precise than a forced paraphrase.

Keep without explanation when the context is clear:

- 시리즈
- 그리드
- 인터페이스
- 레이아웃
- 디자인 토큰
- 캠페인
- 브랜드 무드

Explain at first use, then use the abbreviation normally:

- 색·소재·마감(CMF)
- 여러 사진이나 영상에 일정한 색감을 적용하는 색보정 기준표(LUT)
- Apple 화면 설계 지침(HIG, Human Interface Guidelines)
- 공식 스트리밍 영상 형식(HLS)
- 웹페이지 스타일 코드(CSS)

Preserve official product names, feature names, standards, evidence IDs, filenames, measurements, and quotations exactly.

## 3. Replace avoidable translated jargon

Use the right-hand wording in the reader-facing report unless the left-hand term is itself the object of analysis.

| Avoid in reader copy | Prefer |
|---|---|
| hero | 대표 이미지 |
| proof | 근거, 확인 자료 |
| shot job | 사진의 설명 역할 |
| figure-ground | 배경과 대상의 분리 |
| intrinsic product | 제품 고유 시각·인지 문법 |
| productive tension | 함께 유지하는 대비 요소 |
| protected surface | 그대로 복제하면 안 되는 요소 |
| authorship layer | 자료를 만든 주체와 목적 |
| saturation budget | 선명한 색을 집중하는 범위 |
| mechanism | 작동 원리 |

Avoid translated abstractions such as `~로 읽는다`, `약속을 닫는다`, `전면화한다`, `증명 사다리`, `지배적 주인공`, or `감각적 약속` when a literal action can be named.

```text
Avoid
근거의 양보다 층위와 저자성을 분리한다.

Prefer
자료를 만든 주체와 목적을 구분해 분석한다.

Avoid
토큰은 값의 목록이 아니라 역할과 범위로 읽어야 한다.

Prefer
글자 크기와 색상값은 어디에서 무엇을 위해 쓰였는지 함께 기록한다.

Avoid
hero는 한 물체 또는 한 가족을 지배적 주인공으로 만든다.

Prefer
대표 이미지에서는 한 제품이나 같은 제품군만 크게 보여 주어
시선이 분산되지 않게 한다.
```

## 4. Use a three-part explanation

For each major report block, write:

1. a clear claim;
2. the concrete mechanism or sequence;
3. the scope, exception, or evidence limit.

Prefer subjects and actions over stacked abstract nouns. A heading may be short, but the heading and its lead together must preserve the complete claim.

## 5. Keep technical source artifacts separate

The source files remain the authority:

- `source-brand-anatomy.md` preserves analytical terminology, complete claim fields, and evidence links;
- `grammar-kernel.md` preserves the full causal rule, alternatives, exceptions, tests, and falsifiers;
- the Storybook source-brand document translates those findings for a reader without creating, deleting, or upgrading claims.

The report may rename a grammar rule for readability only when the rule ID remains visible and the full source rule is linked.

## 6. Use source images as the report evidence

- Show direct EV source images in the main report.
- Do not use a screenshot of an existing report as research evidence.
- Do not present a derived contact sheet as though it were an original source image.
- Put contact sheets only inside a section explicitly marked `evidence-appendix`, `visual-corpus-appendix`, or `evidence-index`.
- Keep EV ID, local path, analytical role, era, source, credit, and rights note attached to every displayed image.
- Use extracted motion frames only when they come from a registered official video, and label them as extracted frames rather than still-image originals.

## 7. Final editorial checklist

- Does the edited headline preserve every important source-clause component?
- Can a Korean reader understand the sentence without translating it back into English?
- Did the edit preserve a useful word such as `시리즈` instead of over-explaining it?
- Is every unfamiliar abbreviation explained at first use?
- Are metaphors replaced with concrete actions when the metaphor adds ambiguity?
- Are product representation and the physical, digital, or hybrid product's own visual and cognitive language still separated?
- Are source limits and unknowns still visible?
- Are main-report images direct EV assets rather than derived report graphics?
- Does key visual have its own cross-surface operating model and direct identity/UI/content/imagery/motion examples rather than being reduced to campaign photography, product-photo traits, mood, or camera technique?

## 8. Present a portable global brand system

End the reader-facing analysis with four operating layers: brand color scheme, typography hierarchy, spacing strategy, and layout strategy. Describe what each layer does, how its parts relate, what must remain stable, what can vary by channel or locale, and which evidence supports it.

Do not turn this section into a vendor- or framework-specific token sheet. When exact first-party typography or color values exist, show them in a compact `관찰 참고값` block with channel, market, date, and evidence IDs. State directly that they are source examples rather than the global rule. Avoid prescribed token names, JSON, CSS variables, fixed spacing scales, universal breakpoints, and invented values.

## 9. Use a compact report rail and real type specimens

- On wide screens, reserve roughly one sixth of the main grid for section numbers and labels. Give the remaining width to the report body.
- Start every section body on the same vertical grid line. Nested tables, images, and subgrids must stay inside that body column rather than crossing into the label rail.
- On narrow screens, stack the label above the body instead of preserving an unusably narrow side column.
- When the brand's first-party site exposes webfonts, show a token-like type matrix with actual rendered specimens for display, title, lead, body, label, caption, and materially different localized scripts.
- Each row must visibly apply the verified font and label role, family, size, weight, line height, and script. The sample text is the main content; source URLs belong in compact provenance or the evidence index.
- Do not bundle restricted font files. Reference the first-party remote artifact when permitted and disclose that the specimen needs a network connection. If access or licensing blocks it, show `웹폰트 확인 공백` and use no look-alike substitute.

## 10. Make the key-visual system visible

- Give key visual its own report section before brand mood and photography.
- Define the core visual idea, then show how typography, color roles, graphic form, layout, UI, content templates, imagery, and motion express that idea.
- Begin with an operating model covering premise, focal actor, type-message-image relation, color layers, graphic form, layout, UI translation, content translation, imagery role, motion, channel adaptation, invariants, variables, exceptions, and evidence IDs.
- Show at least six direct EV examples across at least three surface roles such as identity, UI, content/campaign, imagery, and motion. Label the role of every example.
- A sequence can explain editorial deployment, but it comes after the cross-surface model. Do not substitute a product-photo sequence, mood board, contact sheet, adjectives, or camera settings for key-visual analysis.

## 11. Start with verified brand identity

- Use one current official masterbrand logo or wordmark as the hero's visual center.
- Place it on a color field verified as an identity color. Do not use an interaction, status, product, campaign, or photographic color as the report background simply because it is prominent.
- Keep the report title, scope, and short synthesis smaller than the logo and aligned to the shared body grid.
- Use a local evidence file and attach EV ID, source URL, era, credit, and rights note. Do not redraw, trace, typeset, or approximate a missing logo.
- Export the chosen background, foreground, color-layer classification, identity scope, logo evidence, variant, and any permitted monochrome rendering treatment under `report_identity` in the paired JSON.
