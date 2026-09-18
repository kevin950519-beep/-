# Analysis Blueprint (P2)

이 문서는 `docs/{project}/appendix-reference-analysis.md`를 쓰는 규칙과 템플릿이다. 절 번호·제목·섹션 역할 고정 어휘는 `design-spec.md` 5장 그대로다. 여기서 바꾸지 않는다.

문서 포맷은 `.claude/skills/project-planning/resources/doc-templates.md` 0.3절 부록 정책(헤더 3줄 + 결정 현황 블록)과 0.4절 가독성 규칙(표 열 5개 이하, 셀 45자 이내, H2 앞 `---`)을 따른다. 값 목록은 같은 문서 3장(03 2절)과 같다.

---

## 전체 템플릿

```markdown
# {프로젝트명}: Appendix Reference Analysis

> 이 문서가 결정하는 것: 레퍼런스 사이트의 구조·토큰·모듈을 관찰해 P3~P7이 쓸 재료로 정리한다
> 입력: P1 캡처 산출(`reference/summary.md`, `shots/`) · 출력 대상: 03-visual-direction, 02-ux-flow, component-work

## 결정 현황

| 섹션 | 상태 | 비고 |
|---|---|---|
| 1. 사이트 맵 | 잠정 | |
| 2. 섹션 인벤토리 | 잠정 | |
| 3. 관찰된 토큰 구조 | 잠정 | |
| 4. 원본의 추정 기획 | 잠정 | 분석 전용 |
| 5. 모듈 분해 | 잠정 | |
| 6. 치환 매핑 | 미정 | 변형 수준 미확정 (P3) |
| 7. 모듈 맵 | 미정 | 6절 확정 후 (P6) |

문서 상태: 작성 중
개정: {날짜} v1 · 변경: 최초 작성

---

## 1. 사이트 맵

| 페이지 | 경로 | 한 줄 역할 | 섹션 수 |
|---|---|---|---|
| 홈 | `/` | 브랜드 소개와 대표 목록 진입 | 6 |
| 목록 | `/works` | 대표 항목 전체 목록 | 3 |

전역 내비 구조:

| 위치 | 항목 | 유형 |
|---|---|---|
| 헤더 | 홈, 목록, 소개, 문의 | 링크 |
| 헤더 | 검색 | 버튼 |

---

## 2. 섹션 인벤토리

### 홈

| # | 역할 | 아키타입 id | 콘텐츠 신호 | 인터랙션 |
|---|---|---|---|---|
| 1 | hero | split-hero | short / dominant / single / flat | 스크롤 진입 페이드 |
| 2 | feature-grid | card-grid | short / balanced / many / two-tier | 호버 확대 |

콘텐츠 신호 표기 순서는 text / media / repeat / hierarchy다.

### {다음 페이지}

...

---

## 3. 관찰된 토큰 구조

색 역할 구조(관찰):

| 역할 | 램프 단계 수(관찰) | 면적 비중(관찰) |
|---|---|---|
| 중립 | 5 | 넓음 |
| 액센트 | 1 | 좁음 |

서체 역할과 타입 스케일(관찰):

| 역할 | 크기 관계(관찰) |
|---|---|
| 디스플레이/본문 비 | 약 1.6 (인접 크기 비의 중앙값) |

간격 리듬, radius·elevation, 모션 템포(관찰):

| 축 | 관찰값 |
|---|---|
| 간격 리듬 | 8px 배수, 섹션 간 96px |
| radius | 전부 각짐 |
| elevation | 얕은 그림자 1단 |
| 모션 템포 | 진입 페이드 0.4s 내외 |

미디어 인벤토리(관찰):

| 역할 | 비율 | 개수 |
|---|---|---|
| 히어로 이미지 | 16:9 | 6 |

---

## 4. 원본의 추정 기획

분석 전용. 01 문서에 옮기지 않는다.

| 추정 사용자 | 추정 대상 | 추정 과업 흐름 |
|---|---|---|
| 방문자 | 대표 항목 | 목록을 훑고 상세로 들어가 문의한다 |

---

## 5. 모듈 분해

| 관찰된 UI 단위 | 스타터키트 컴포넌트 | 판정 | 카테고리 |
|---|---|---|---|
| 카드형 목록 항목 | CustomCard | 재활용 | card |
| 통계 숫자 강조 | StretchedHeadline | 수정 | typography |
| 캐러셀 후기 | (신규 후보) | 신규 | media |

판정 값은 재활용 / 수정 / 신규다. "재활용"은 `component-work/resources/components.md`에 실재하는 이름이어야 한다.

템플릿 후보(아키타입 기준):

| 아키타입 id | 템플릿 후보 이름 | 쓰이는 섹션 |
|---|---|---|
| split-hero | SplitHeroTemplate | 홈 #1 |

---

## 6. 치환 매핑

작성 규칙은 `fidelity-levels.md`.

| 원본 섹션 슬롯 | 새 기획 대응물 | 처리 | 근거(01 과업 번호) |
|---|---|---|---|
| 홈 #1 히어로 | (미정, Q1) | (미정, Q1) | (미정, Q1) |

처리 값은 유지 / 변주 / 교체 / 삭제 / 신규다. L2는 이 표 아래 변경 예산 계산을 한 줄로 남긴다.

---

## 7. 모듈 맵

작성 규칙은 `module-layers.md`.

| 페이지 | 섹션 | 템플릿 | 컴포넌트 |
|---|---|---|---|
| 홈 | HeroSection | SplitHeroTemplate | CustomCard, Button |

빌드 순서는 표 아래 목록으로 적는다.
```

---

## 절별 작성 규칙

### 1. 사이트 맵

- 캡처한 페이지만 적는다(최대 8). `capture-guide.md`로 캡처하지 않은 페이지를 추정해 넣지 않는다.
- 섹션 수는 `summary.md`의 페이지별 섹션 표 행 수와 일치해야 한다.

### 2. 섹션 인벤토리

- 역할은 `design-spec.md` 5장의 고정 어휘에서만 고른다: `global-nav`, `hero`, `value-prop`, `feature-grid`, `feature-detail`, `showcase`, `gallery`, `story`, `stat-band`, `social-proof`, `logo-cloud`, `testimonial`, `pricing`, `comparison`, `faq`, `form`, `cta`, `content-feed`, `article-body`, `footer`, `other`.
- `other`를 쓰면 같은 셀 또는 바로 옆 칸에 한 줄 설명을 반드시 붙인다.
- 아키타입 id는 `src/data/layoutTaxonomyData.js`에 실재하는 id만 쓴다. 아래 후보 표에서 고르거나, 표에 없으면 같은 파일에서 grep으로 확인한 뒤 쓴다.
- 콘텐츠 신호 4축은 `doc-templates.md` 03 2절과 같은 값 목록이다.
  - text: `none` · `micro` · `short` · `long` · `mixed`
  - media: `none` · `accent` · `balanced` · `dominant`
  - repeat: `single` · `few` · `many`
  - hierarchy: `flat` · `two-tier` · `deep`
- 표기 순서는 항상 text / media / repeat / hierarchy다.
- 인터랙션 칸은 캡처 스크립트로 못 잡은 것을 `capture-guide.md` 6절 수동 관찰 메모에서 옮긴다. 없으면 `없음`.

### 3. 관찰된 토큰 구조

- 값은 전부 "관찰값"이다. 새 브랜드 값을 섞지 않는다. 열 이름에 `(관찰)`을 이미 표기했으므로 그 구조를 유지한다.
- 색은 역할 구조를 먼저 적는다: 중립 램프 단계 수, 액센트 수, 각 역할의 면적 비중(넓음/보통/좁음). 구체 hex 값은 옮기지 않는다.
- 타입 스케일 비는 인접 크기 비의 중앙값으로 추정한다(관찰된 크기들을 큰 순서로 나열하고 이웃 값끼리 나눈 비율의 중앙값 하나만 적는다).
- 간격 리듬, radius·elevation, 모션 템포는 `capture-guide.md` 5절(스크린샷 검증)과 6절(수동 관찰) 결과를 옮긴다.
- 미디어 인벤토리는 역할·비율·개수만 적는다. 원본 URL은 절대 적지 않는다.

### 4. 원본의 추정 기획

- 이 절은 분석 전용이다. 01-project-summary에 옮기지 않는다.
- 사용자·대상·과업 흐름은 관찰(내비 구조, 섹션 순서, CTA 문구의 역할)에서 역추정한 것임을 표 위에 한 줄로 밝힌다.

### 5. 모듈 분해

- 표 열은 관찰된 UI 단위, 스타터키트 컴포넌트, 판정(재활용/수정/신규), 카테고리다.
- "재활용"으로 적으려면 그 이름이 `.claude/skills/component-work/resources/components.md`에 실재해야 한다. 없으면 "수정" 또는 "신규"로 적는다.
- 카테고리는 `.claude/rules/directory-structure.md`의 폴더명을 쓴다.
- 템플릿 후보는 아키타입 id 기준으로 뽑는다. 이름 규칙은 `design-spec.md` 6장(`{아키타입 id PascalCase}Template`)을 그대로 쓴다.

### 6. 치환 매핑

- 작성 규칙과 처리 판정 기준은 `fidelity-levels.md`를 따른다. 여기서 내용을 복제하지 않는다.
- P3에서 변형 수준이 확정되기 전까지 이 절은 미정으로 둔다.

### 7. 모듈 맵

- 작성 규칙과 빌드 순서 산정 방식은 `module-layers.md`를 따른다. 여기서 내용을 복제하지 않는다.
- 6절이 확정된 뒤(P6)에만 채운다.

---

## 섹션 역할 → 아키타입 id 후보

id는 `src/data/layoutTaxonomyData.js`의 `LAYOUT_TAXONOMY`에 실재하는 것만 썼다(작성 전 grep으로 재확인했다). 후보는 출발점이고, 스크린샷 검증 결과가 다르면 표에 없는 실재 id로 바꿀 수 있다.

| 역할 | 아키타입 id 후보 |
|---|---|
| global-nav | `sidebar-nav-shell`, `priority-plus-navigation`, `experimental-nav` |
| hero | `split-hero`, `centered-hero`, `full-bleed-hero` |
| value-prop | `feature-grid`, `fifty-fifty-block`, `asymmetric-two-up` |
| feature-grid | `feature-grid`, `bento-grid`, `card-grid` |
| feature-detail | `fifty-fifty-block`, `split-screen`, `two-column-editorial` |
| showcase | `bento-grid`, `card-grid`, `masonry-gallery` |
| gallery | `masonry-gallery`, `justified-gallery`, `mosaic-tile` |
| story | `scrollytelling`, `sticky-scroll-reveal`, `pinned-section` |
| stat-band | `stat-band`, `uniform-card-grid`, `feature-grid` |
| social-proof | `testimonial-wall`, `logo-cloud`, `stat-band` |
| logo-cloud | `logo-cloud`, `marquee-ticker`, `uniform-card-grid` |
| testimonial | `testimonial-wall`, `card-grid`, `alternating-rows` |
| pricing | `pricing-page`, `comparison-table`, `uniform-card-grid` |
| comparison | `comparison-table`, `pricing-page` |
| faq | `sectioned-stack`, `article-longread` |
| form | `centered-form`, `split-screen-auth`, `sidebar-content` |
| cta | `cta-banner`, `centered-hero`, `full-bleed-hero` |
| content-feed | `single-column-feed`, `masonry-gallery`, `card-grid` |
| article-body | `article-longread`, `two-column-editorial`, `manuscript-grid` |
| footer | `sectioned-stack`, `column-grid`, `sidebar-nav-shell` |
| other | 후보 없음. 설명에 맞춰 위 목록에서 가까운 id를 고르거나 grep으로 새로 확인한다 |

---

## 저장 전 점검 목록

- 절 번호 1~7과 제목이 `design-spec.md` 5장 표와 글자 일치하는가
- 표 열이 5개 이하이고 셀이 45자 이내인가
- 모든 H2 앞에 `---` 한 줄이 있는가
- 다이어그램 코드 블록을 쓰지 않았는가(다이어그램 언어 표기 검색)
- em dash(U+2014, 긴 줄표)를 쓰지 않았는가
- 원본 카피 문장을 그대로 인용하지 않았는가(섹션 제목도 원문 문구 대신 역할 이름으로 바꿔 불렀는가)
- 에셋 URL(이미지·영상 원본 `src`)을 쓰지 않았는가
