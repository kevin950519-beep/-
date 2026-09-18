---
name: site-remix
description: Analyzes a user-provided reference website with ego-browser (ego lite), then rebuilds it on this starter kit with only the planning and brand replaced. Asks how far to depart from the original (L1 mirror 100%, L2 slight variation, L3 structural transformation), writes project-planning-format docs (01~03 plus a reference-analysis appendix) in docs/{project}/, and modularizes the build into tokens, components, templates, sections, and pages.
when_to_use: When user explicitly invokes /site-remix with a reference URL. Do not auto-activate. Wait for direct user invocation. Korean triggers after invocation include 레퍼런스 사이트 분석해서 브랜드만 바꿔줘, 이 사이트 구조로 내 프로젝트 만들어줘, 사이트 리믹스.
argument-hint: <reference-url> [project-name] [L1|L2|L3]
user-invocable: true
disable-model-invocation: true
---

# Site Remix Skill

> 레퍼런스 웹사이트를 ego-browser로 분석해 구조는 고른 수준만큼 물려받고, **기획과 브랜드만 새것으로 교체**한 프로젝트를 이 스타터키트 위에 세운다.
> 이 파일은 절차와 가드레일만 다룬다. 세부 기준은 `resources/`에, 기획 문서 포맷은 `project-planning` 스킬에 있다.

## 활성화 조건

| 의도 | 트리거 예시 |
|------|-----------|
| 새 리믹스 | `/site-remix https://example.com`, "이 사이트 구조로 내 브랜드 사이트 만들어줘" |
| 이어서 | "리믹스 이어서", "청사진 다음 단계" |
| 수준 변경 | "L2로 바꿔줘", "섹션 구성을 더 바꾸고 싶어" |

이 스킬에 URL을 넣어 호출한 것이 그 URL을 ego-browser로 캡처해도 된다는 명시 요청이다. 그 밖의 브라우저 사용은 아래 가드레일을 따른다.

---

## 산출물

| 덩어리 | 경로 | 기준 |
|---|---|---|
| 캡처 원본 | `docs/{project}/reference/` | `resources/capture-guide.md` |
| 청사진 | `docs/{project}/appendix-reference-analysis.md` | `resources/analysis-blueprint.md` |
| 기획 문서 3종 | `docs/{project}/01~03` | `project-planning` 스킬 (SSOT) |
| 구현 | 토큰 → 컴포넌트 → 템플릿 → 섹션 → 페이지 | `resources/module-layers.md` |

---

## 시작 절차 (모든 호출 공통)

1. `docs/{project}/`를 확인한다. `reference/`, 청사진, 01~03이 있으면 각 문서의 결정 현황 블록을 읽는다.
2. 현재 위치를 3줄로 보고한다: 어느 단계(P0~P8)까지 왔는지, 변형 수준, 다음에 할 일.
3. 끝난 단계는 다시 하지 않는다. 캡처가 있으면 P2부터, 청사진에 수준이 적혀 있으면 P4부터 잇는다.

---

## 단계

| 단계 | 이름 | 하는 일 | Read |
|---|---|---|---|
| P0 | 인테이크 | URL, 프로젝트 이름, 새 브랜드·기획 브리프, 분석 범위 | |
| P1 | 캡처 | ego-browser로 구조·토큰·스크린샷 수집 | `capture-guide.md`, ego-browser 스킬 |
| P2 | 청사진 | 섹션 역할·아키타입·토큰 구조·모듈 분해를 표로 | `analysis-blueprint.md` |
| P3 | 변형 수준 질문 | 청사진 요약을 보여주고 L1·L2·L3를 고르게 한다 | `fidelity-levels.md` |
| P4 | 치환 매핑 | 원본 슬롯마다 새 기획의 대응물과 처리를 정한다 | `fidelity-levels.md` |
| P5 | 기획 문서 | 01 → 02 → 03, 게이트마다 승인 | `project-planning` 스킬과 템플릿 |
| P6 | 모듈 계획 | 계층별 빌드 목록과 순서를 모듈 맵으로 확정 | `module-layers.md` |
| P7 | 구현 | `component-work` 스킬 경유로 계층 순서대로 | `module-layers.md` |
| P8 | 마감 점검 | 정합성·권리 점검, Overview 래퍼, 점검 에이전트 제안 | |

### P0 인테이크

한 번에 묶어 묻는다(최대 4개). 호출 인자나 앞 대화에 이미 있는 답은 묻지 않는다.

| 질문 | 빠지면 |
|---|---|
| 프로젝트 이름 (kebab-case 폴더명) | 브랜드 이름에서 제안하고 확인 |
| 새 브랜드·기획 브리프 (누구를 위한 무엇인가, 브랜드 이름, 태도) | P1·P2를 먼저 진행하고 P3에서 다시 묻는다 |
| 분석 범위 (입력 페이지만 / 헤더 내비 기준 주요 페이지, 최대 8) | 입력 페이지 1장 |
| 변형 수준을 이미 정했는가 | P3에서 묻는다 |

여기서 받은 답은 01의 질문 예산(최대 4개)에서 차감한다. 같은 것을 두 번 묻지 않는다.

### P1 캡처

1. ego-browser 스킬을 먼저 읽는다. TaskSpace는 하나만 쓰고, 끝나면 `finish` 한다.
2. `capture-guide.md`대로 실행한다.

```bash
node .claude/skills/site-remix/scripts/capture-site.mjs --url <URL> --out docs/{project}/reference
node .claude/skills/site-remix/scripts/summarize-capture.mjs --in docs/{project}/reference --write
```

3. 캡처 JSON 원본을 통째로 읽지 않는다. `reference/summary.md`와 스크린샷만 읽는다.
4. 스크립트의 `roleGuess`는 추정이다. 섹션 역할은 스크린샷을 보고 에이전트가 판정한다.

### P2 청사진

`analysis-blueprint.md`의 템플릿으로 `appendix-reference-analysis.md` 1~5절을 쓴다. 역할은 고정 어휘에서, 아키타입 id는 `src/data/layoutTaxonomyData.js`에 있는 것만, 재활용 후보는 `component-work/resources/components.md`의 이름만 쓴다. 토큰은 값이 아니라 **구조**(역할 수, 스케일 비, 리듬)를 먼저 적고 값은 관찰값으로만 표기한다.

### P3 변형 수준 질문 (필수)

청사진 요약(페이지 수, 페이지별 섹션 수, 눈에 띄는 인터랙션)을 먼저 보여주고 묻는다. 이 질문은 건너뛰지 않는다. 사용자가 이미 수준을 말했을 때만 확인 한 줄로 대신한다.

| 수준 | 이름 | 한 줄 정의 |
|---|---|---|
| L1 | 미러 (100%) | 구조·리듬·인터랙션 문법을 그대로 두고 기획과 브랜드만 갈아 끼운다 |
| L2 | 변주 (약간의 변주) | 뼈대는 같고 섹션 일부와 섹션 내부 배치를 새 기획에 맞게 조정한다 |
| L3 | 변형 (구조 변형 응용) | 원본은 패턴 어휘로만 쓰고 IA와 섹션 구성을 새 기획이 주도해 다시 짠다 |

선택지마다 "이 사이트라면 무엇이 남고 무엇이 바뀌는지"를 한 줄씩 붙인다. 레이어별 허용 범위와 L2 변경 예산(원본 섹션 수의 25% 이하)은 `fidelity-levels.md`에 있다. 고른 수준은 청사진 결정 현황에 적는다.

### P4 치환 매핑

청사진 6절에 원본 섹션 슬롯 → 새 기획 대응물 → 처리(유지·변주·교체·삭제·신규) → 근거(01 과업 번호)를 적는다. 슬롯의 역할과 분량 신호는 물려받고 내용은 브리프에서 새로 쓴다. L1에서 채울 것이 없는 슬롯은 지우지 않고 `(미정, Qn)`으로 남긴다.

P4와 P5의 01은 서로를 참조한다. 01 5절 과업 초안을 먼저 세운 뒤 매핑표의 근거 칸을 채우고, 매핑에서 과업이 모자라면 01 5절에 먼저 추가한다(역류 절차).

### P5 기획 문서

`.claude/skills/project-planning/SKILL.md`와 `resources/doc-templates.md`를 Read해서 절차, 템플릿, 하드 게이트, 질문 예산, 이름 계약을 **그대로** 따른다. 이 스킬은 템플릿을 복제하지 않고 재료의 출처만 정한다.

| 문서 | 재료 출처 | 주의 |
|---|---|---|
| 01 project-summary | 새 브리프만 | 원본의 카피·추정 기획을 옮기지 않는다. 금지 목록 그대로 |
| 02 ux-flow | 청사진 1절·6절·5절 + 01 | 2.2절 섹션 이름은 새 역할 이름. 5절에 템플릿·섹션도 행으로 |
| 03 visual-direction | 구조는 청사진 2절·3절, 값은 새 브랜드 | 근거 칸에 관찰값 금지. 4.1절 REF-01이 사용자 URL |

- 초안은 잠정·미정만. 확정은 사용자 승인에서만. 잠정 승인으로 다음 문서를 시작할 수 있다.
- 문서마다 하드 게이트 체크리스트를 보여주고 승인을 받는다. 미정 의존 금지, 역류 절차 동일.
- 절별 상세 규칙은 `fidelity-levels.md`의 "수준별 기획 문서 연결".
- 03이 승인되면 `design-system.md` 3절 순서대로 03 5절 표에서 theme 파일로 간다.

### P6 모듈 계획

02 5절과 청사진 5절로 청사진 7절 모듈 맵(페이지 → 섹션 → 템플릿 → 컴포넌트)과 빌드 순서를 확정하고 사용자에게 보여준 뒤 구현에 들어간다.

| 계층 | 위치 | 아는 것 |
|---|---|---|
| Token | `src/styles/themes/default.js` | 브랜드 값 |
| Component | `src/components/{category}/` | props만 |
| Template | `src/components/templates/` | 레이아웃과 슬롯. 데이터·카피를 모른다 |
| Section | `src/components/sections/` | 템플릿 하나 + `src/data/{project}/` 콘텐츠 |
| Page | `src/pages/` | 섹션 순서, 셸, 라우트 |

의존은 Page → Section → Template → Component → Token 한 방향이다. 이름 규칙, 파일 골격, 스토리 규칙은 `module-layers.md`.

### P7 구현

- `src/components/` 아래 파일은 직접 고치지 않고 `/component-work` 스킬을 경유한다. 조합 단위의 골격은 `stable-layout` 절차를 따른다.
- 순서: 토큰 → 컴포넌트(신규·수정) → 템플릿 → 콘텐츠 데이터 → 섹션 → 페이지 → 라우트.
- 카피와 콘텐츠는 `src/data/{project}/content.js`에 둔다. JSX 안에 카피 문자열을 직접 쓰지 않는다.
- 이미지가 필요하면 03 4절을 입력으로 `/visual-asset-prompt`에 넘긴다. 준비 전에는 `Placeholder`로 자리를 잡는다. 원본 이미지를 쓰지 않는다.

### P8 마감 점검

1. `doc-templates.md` 5장 정합성 점검과 `fidelity-levels.md`, `module-layers.md`의 점검 목록을 돈다.
2. 권리 점검: 원본의 카피 문장, 에셋 URL, 원본 브랜드 이름이 01~03과 `src/`에 없는지 검색한다.
3. `.storybook/`이 있으면 `doc-templates.md` 0.6절대로 Overview MDX 래퍼를 만든다. 청사진은 `Overview/{Project}/Appendix/Reference Analysis`.
4. `pnpm lint`를 돌린다. 조합 단위가 끝났으면 점검 에이전트(`stable-layout-auditor`, `typography-auditor`, `ai-slop-fixer`) 실행 여부를 사용자에게 묻는다. 자동 호출하지 않는다.

---

## 가드레일

### 브라우저

- 캡처는 ego-browser로만 한다. Playwright, Chrome MCP 등 다른 브라우저 자동화를 쓰지 않는다.
- 범위는 사용자가 준 URL과 합의한 페이지(최대 8)뿐이다. 범위 밖 링크를 따라가지 않는다.
- 로그인 벽, 권한 프롬프트를 만나면 `handOff`로 사용자에게 넘긴다. 자격 증명을 입력하지 않는다.
- 로컬 결과물의 렌더 확인을 위해 브라우저를 스스로 열지 않는다. 필요하면 먼저 묻는다.
- ego-browser가 없으면 설치 안내를 알리고 멈춘다. 사용자가 원하면 축소 모드(정적 HTML 구조 분석, 토큰·모션은 미정)로 간다.

### 가져오는 것과 가져오지 않는 것

| 구분 | 항목 |
|---|---|
| 항상 교체 | 브랜드 이름, 로고, 카피 문장, 이미지·영상·커스텀 아이콘, 색 값, 서체, 메타 정보 |
| 절대 가져오지 않음 | 소스 코드, 에셋 파일·URL(핫링크 포함), 카피 문장, 트래킹 스크립트 |
| 가져오는 것 | 섹션 역할과 순서, 아키타입, 열 수·비율, 타입 스케일 비, 간격 리듬, 밀도, 구분 언어, 인터랙션 문법 |

- 카피는 새로 쓴다. 원본 문장의 번역·의역·문장 구조 모방도 하지 않는다.
- 원본 브랜드 이름은 청사진 부록과 03 4.1절 레퍼런스 행에만 쓴다.
- `reference/`의 캡처 원본은 분석 자료다. 배포물과 스토리북에 넣지 않는다.

### 문서와 코드

- 01~03의 섹션 번호·제목을 바꾸지 않는다. 리믹스 고유 정보는 청사진 부록에 둔다.
- em dash 금지, Mermaid 금지, 표는 열 5개 이하·셀 45자 이내.
- `.claude/rules/` 전부를 따른다(MUI Grid import, 디렉토리 구조, 디자인 토큰, 코드 컨벤션).
- 판단이 필요한 빈칸은 임의로 채우지 않고 미정 + 질문으로 남긴다.

---

## Resources

| 파일 | 용도 | 언제 Read |
|------|------|----------|
| `resources/capture-guide.md` | 캡처 실행, 수동 관찰, 실패 대응 | P1 |
| `resources/analysis-blueprint.md` | 청사진 템플릿, 역할 어휘, 역할별 아키타입 후보 | P2 |
| `resources/fidelity-levels.md` | 수준별 허용 범위, 치환 매핑, 기획 문서 연결 | P3, P4, P5 |
| `resources/module-layers.md` | 계층 계약, 파일 골격, 모듈 맵, 빌드 순서 | P6, P7 |
| `scripts/capture-site.mjs` | ego-browser 캡처 실행기 | P1 |
| `scripts/summarize-capture.mjs` | 캡처 JSON을 짧은 마크다운으로 요약 | P1 |

### 참조하는 외부 리소스 (복제하지 않음)

| 파일 | 위치 | 언제 Read |
|------|------|----------|
| ego-browser 스킬 | 설치된 `ego-browser` 스킬 | P1 |
| `SKILL.md`, `doc-templates.md` | `.claude/skills/project-planning/` | P5 |
| `components.md`, `taxonomy-index.md`, `mui-theme.md` | `.claude/skills/component-work/resources/` | P2, P5, P7 |
| `layoutTaxonomyData.js` | `src/data/` | P2, P5 |

### 이어지는 스킬

| 스킬 | 넘기는 것 |
|---|---|
| `/component-work` | 02 5절, 청사진 7절 모듈 맵, 03 3절·5절 |
| `/visual-asset-prompt` | 03 4절·4.2절 (원본 이미지는 레퍼런스로 쓰지 않는다) |
| `/layout-composer`, `stable-layout` | 03 2절 아키타입·콘텐츠 신호 |

---

## 핵심 원칙

- **교체하는 것은 기획과 브랜드, 물려받는 것은 구조와 리듬.** 수준은 물려받는 폭만 바꾼다.
- **수준은 사용자가 정한다.** P3 질문을 건너뛰지 않는다.
- **01은 새 브리프에서만 나온다.** 원본의 추정 기획은 청사진 4절에만 산다.
- **토큰은 구조를 승계하고 값을 교체한다.** 관찰값은 03의 근거가 될 수 없다.
- **포맷은 project-planning이 기준.** 템플릿을 복제하거나 섹션을 바꾸지 않는다.
- **계층은 한 방향으로만 의존한다.** 템플릿은 데이터를 모르고, 섹션은 다른 섹션을 모른다.
- **측정은 가져오고 표현은 가져오지 않는다.** 코드, 에셋, 카피는 원본에서 오지 않는다.
