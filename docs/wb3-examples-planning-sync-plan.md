# 3차 웨비나 예제 기획 문서·스킬 동기화 계획 (v1)

작성: 2026-09-17 · 상태: 결정 확정, 실행 중

> 3차 웨비나 Part C 예제 중 Vibe Design Lab을 뺀 나머지에 새 `/project-planning` 스킬을 넣고, 기획 문서 3종을 새 포맷으로 다시 쓰고, 스토리북 Overview에 lumenstate와 같은 04~07 페이지를 붙인다.

예제 목록의 출처는 VDL 사이트 저장소의 웨비나 03 데이터(`src/data/presentations/webinar03/cases.js`, `src/data/thinking/*.js`)다. lumenstate는 어제 완료됐고, 그 작업 원장(`s2-lumenstate/vdl-online-2nd-completed/.orchestra/runs/20260916-lumenstate-apply/ledger.md`)이 이번 계획의 절차 원형이다.

---

## 1. 대상과 현황

| 예제 | 저장소 | 문서 위치 | 상태 |
|---|---|---|---|
| lumenstate | `vdl/examples/s2-lumenstate/vdl-online-2nd-completed` | `docs/lumenstate/` | 완료 (기준 예제) |
| muse | `vdl/examples/s3s4-muse/starter-kit-3rd/vibe-design-starterkit-v1.0` | `docs/muse/` | 대상 |
| heptapod-b | `interactive/heptapod-B` | `docs/heptapod-b-encoder/` | 대상 |
| hirst-fame-argorithm | `interactive/hirst-fame-argorithm` | `docs/hirst/` | 대상 |
| oneir | `interactive/oneir` | `docs/oneir-landing/` | 대상, 미커밋 변경 3개 |
| buzz-khalifa | `interactive/buzz-khalifa` | `PRD.md`, `REMODELING_PLAN.md` | 결정 필요 |
| vdl | (VDL 사이트) | | 제외 (사용자 지시) |
| bellite | 없음 (liveUrl null, 예비) | | 제외 권장 |

경로는 전부 `~/Desktop/` 아래다.

### 1.1 스타터킷 계열 4개의 공통 상태

- Vite + Storybook 10.1 + addon-docs. `.storybook/main.js`가 `.mdx`를 포함한다.
- `.claude/skills/project-planning/`이 있으나 옛 버전(템플릿 189~198줄, 결정 현황 블록·가독성 규칙·스토리북 노출 규칙 없음).
- `src/components/storybookDocumentation/`에 DocumentTitle · PageContainer · SectionTitle · TreeNode만 있고 EditorialDocument는 없다.
- `src/data/projectStructure.js`와 `scripts/generate-project-structure.js`가 없다 (lumenstate에만 있음).
- `component-work/resources/project-summary.md`가 남아 있다 (문서 01과 이름 충돌, 개명 대상).
- Codex 어댑터(`.agents/skills/vdl-project-planning`)는 없다. heptapod와 oneir에 `vdl-visual-asset-prompt` 어댑터만 있다.

### 1.2 예제별 특이점

- **muse**: 문서가 01~03 + `04-data-bridge.md` + supabase 부록 6종. 스토리북에 `Overview/MUSE Planning/*` MDX 래퍼 10개가 이미 있다 (`?raw` + `Markdown` 블록, 사본 없음). `src/data/muse/`에 더미·fixture 데이터. 02에 `데이터 모델 활용`·`페이지 리스트` 섹션이 이미 있다.
- **heptapod-b**: 문서 01~08 (04 오디오·모션, 05 히어로 프롬프트, 06 스토리라인, 07 스크럽·사운드, 08 키네틱). 02에 Mermaid 2개. 03이 레퍼런스 분석 중심으로 새 템플릿과 구조가 가장 다르다. `public/` 938MB (히어로 씬·영상).
- **hirst**: 문서 01~03 + 부록 2종 + 계획 2종. 스토리북에 `Overview/Hirst Planning/*` 래퍼 4개와 `Overview/Asset Pipelines` 스토리(assetManifest 기반)가 이미 있다. `scripts/generate-rules.js`가 없다. `src/assets` 112MB.
- **oneir**: 문서 01~09 (04 프롬프트 조립 표준, 05 몰입 시나리오, 06 모션, 07·08 이미지 프롬프트, 09 반응형 점검) + `docs/ONEIR_Brand_System_Update_v2.md`. 02에 Mermaid 1개. `src/data/layoutTaxonomyData.js`가 이미 있고 스타터킷과 동일. `public/` 1.3GB (오디오·영상). 미커밋 변경: `ScrubHeroTitle.jsx`, `useScrubSoundEngine.js`, `OneirLanding.jsx`.
- **buzz-khalifa**: Vite + TypeScript + react-three-fiber. 스토리북·MUI·스킬·docs 폴더가 없다. 문서는 PRD 38줄 + 리모델링 계획 236줄. 1.1의 공통 절차가 하나도 맞지 않는다.

---

## 2. 목표 상태 (예제당)

아래가 스타터킷 계열 4개 각각에 생기거나 바뀐다. lumenstate 완료본과 같은 모양이다.

- **스킬**: `.claude/skills/project-planning/{SKILL.md, resources/doc-templates.md, resources/sql-reserved-words.md}`가 스타터킷과 바이트 동일.
- **렌더러**: `src/components/storybookDocumentation/{EditorialDocument.jsx, documentTheme.js, EditorialDocument.stories.jsx}` 동일 복사. `components.md`에 등록.
- **택소노미**: `src/data/layoutTaxonomyData.js` (없으면 복사, oneir는 이미 동일).
- **문서 3종**: `docs/{project}/01~03`이 새 포맷. 결정 현황 블록, 이름 계약(01 대상 → 02 이름 사전 → 03), 가독성 규칙(열 5 · 셀 45자 · 상태 열 금지 · H2 앞 구분선), Mermaid 0, em dash 0, "n절" 표기.
- **스토리북 01~03**: `src/stories/overview/{Project}{ProjectSummary,UxFlow,VisualDirection}.mdx` 7줄 래퍼 (`?raw` + `<EditorialDocument source={doc} />`). 기존 `*-planning/` 폴더 래퍼는 삭제.
- **스토리북 04~07**: `{Project}ProjectStructure · {Project}{Data} · {Project}Content · {Project}Assets` 스토리 4개 (3절).
- **부록 노출**: 새 포맷 밖의 문서(heptapod 04~08, oneir 04~09, muse 04 + 부록 6, hirst 부록·계획)는 내용 무수정으로 `Overview/{Project}/Appendix/{제목}`에 래퍼로 노출.
- **구조 스크립트**: `scripts/generate-project-structure.js` 복사 + `package.json`에 `generate-structure` + 실행 결과 `src/data/projectStructure.js`.
- **개명**: `component-work/resources/project-summary.md` → `starterkit-overview.md` + SKILL.md 표 1행.
- **룰 재생성**: `pnpm generate-rules` (hirst는 스크립트가 없어 생략).

스토리북 제목 체계는 lumenstate와 같게 통일한다: `Overview/{Project}/01 Project Summary` … `07 Assets`, 부록은 `Overview/{Project}/Appendix/…`. muse의 `Overview/MUSE Planning/`, hirst의 `Overview/Hirst Planning/`은 이 체계로 옮긴다.

---

## 3. 04~07 페이지 규격

lumenstate의 4개를 일반화한다. 04는 스크립트 산출물이고 05~07은 그 프로젝트의 실제 데이터·에셋 파일을 import해 표와 갤러리로 보여 주는 코드 페이지다. 마크다운으로 못 그리는 내용(펼치는 트리, 이미지 격자, enum 표)이라 lumenstate와 같이 `.stories.jsx`로 만든다.

| 번호 | 제목 | 내용 | 원천 |
|---|---|---|---|
| 04 | Project Structure | 페이지 진입점을 루트로 한 컴포넌트 포함 트리. Hook·Context·Data는 설명 리프 | `projectStructure.js` + 설명 사전 |
| 05 | {주제} Data | 02의 데이터 모델 대상이 실제로 담긴 파일. enum·옵션·표본 표 | `src/data/**` |
| 06 | Content Data | 카피·서사·타임라인·캡션. 화면에 찍히는 문자열 | `src/data/**`, 템플릿 상수 |
| 07 | Assets | 이미지·영상·오디오·폰트를 사용 중/미사용으로 구분. 사용 위치 명시 | `src/assets`, `public/` |

05·06의 이름은 02 이름 사전의 이름을 그대로 쓴다 (01→02→03 이름 계약을 스토리북까지 잇는다).

예제별 05~07 원천 (워커가 실제 파일로 확정, 초안):

| 예제 | 05 Data | 06 Content | 07 Assets |
|---|---|---|---|
| muse | `src/data/muse/*` (레퍼런스·태그·프로젝트 fixture) | 랜딩·위자드 카피 | `src/assets/{example, reference, video}` |
| heptapod-b | `heptapodScrubTimeline.js`, `utils/heptapod/MODEL.md` 파라미터 | `heptapodHeroStory.js` 캡션·씬 | `public/heptapod-b-encoder/**`, `src/assets/video` |
| hirst | `src/data/hirst/*`, `data/hirst-trend-data.json` | `templates/bridgeNarrative.js` | `assetManifest.json`, `public/images`, `src/assets/video` (기존 Asset Pipelines 스토리 흡수) |
| oneir | `scrubTimeline.js`, `docs/.../motion-manifest.json` | `landingContent.js` 비트·카피 | `public/{audio, images, videos, fonts}` |

에셋 규칙: 5MB 넘는 파일은 번들 import 금지. 영상·오디오는 `?url` import 또는 `public/` 경로 문자열로 참조하고 인라인하지 않는다. 사용 여부는 `src/`에서 경로를 grep해 판정한다.

---

## 4. 작업 단계

### A. 공통 준비 (Fable 직접, 위임 없음)

- A1 스타터킷 공유 파일 목록 확정: 스킬 3 + 렌더러 3 + 택소노미 1 + `generate-project-structure.js` 1. lumenstate 스크립트가 프로젝트 고유값을 갖지 않는지 확인(주석 6~7행의 훅 이름만 lumenstate 흔적, 코드는 범용).
- A2 예제별 브리프 원형 1개 작성 (lumenstate T2·T2f·T2g 브리프 재사용). 예제별로 경로·문서 목록·특이점만 바꾼다.
- A3 가독성 체커 스크립트를 스크래치에서 각 저장소로 돌릴 수 있게 경로 인자화.

### B. 예제별 파이프라인 (4개 병렬, 예제 안에서는 순차)

| 단계 | 내용 | 워커 | 완료 조건 |
|---|---|---|---|
| B1 | 스킬·렌더러·택소노미·구조 스크립트 복사, 개명, `generate-structure`·`generate-rules` 실행, components.md 등록 | Fable 직접 (복사 8개, 5분) | `diff -q` 전부 동일, 스크립트 정상 종료 |
| B2 | 문서 3종 새 포맷 재구성. 원문 + theme 실제값 + `src/components` 전수 diff(재활용/수정/신규) + 부록 문서 참조 | tier-expert (opus) | 하드 게이트·정합성 스크립트 전 항목 통과, 가독성 체커 0건, Mermaid 0, em dash 0 |
| B3 | 새 문서 ↔ 원문(git HEAD)·theme·components·부록 대조. 지어낸 값 0, 사실 보존 | tier-verifier (opus) | 차단 0. 결함 목록 |
| B4 | B3 결함 수정 + 04~07 스토리 4개 + MDX 래퍼(01~03 + 부록) + 옛 래퍼 폴더 삭제 | tier-expert (B2 워커 이어서, SendMessage) | ESLint 0, 스토리북 index.json에 7 + 부록 등록, Vite 컴파일 200 |
| B5 | 기계 검증: 공유 파일 diff, 체커, ESLint, 스토리북 모듈 curl, `git status` 목록 | Fable 직접 | 원장 기록 |

B4를 B2 워커에게 잇는 이유: 문서를 쓰며 이미 `src/data`·컴포넌트·에셋을 읽었으므로 05~07 원천 판단에 재조사가 없다. 새 워커를 띄우면 그 읽기를 반복한다.

### C. buzz-khalifa (Q1 결정 후)

Q1에서 (b)를 고르면: `docs/buzz-khalifa/01~03`을 PRD·리모델링 계획·`components/*.tsx`에서 새 포맷으로 작성 (tier-expert 1회, 검증 1회). 스킬 폴더는 `.claude/skills/project-planning/`만 추가. 스토리북·04~07은 없음.

### D. 마무리 (Fable 직접)

- 원장 갱신, 저장소별 변경 파일 목록 보고. 커밋은 사용자 지시 시.
- lumenstate는 손대지 않는다.

---

## 5. 워커 배정과 규모

| 워커 | 호출 | 근거 |
|---|---|---|
| tier-expert (opus) | 4 (B2) + 4 (B4 이어서) | 구→신 매핑에 판단이 섞이고 세 문서가 이름을 공유해 분할 불가. lumenstate에서 검증됨 |
| tier-verifier (opus) | 4 (B3) | 사실 보존·지어낸 값 검출은 새 컨텍스트가 유리. lumenstate V1이 실제 결함 3건을 잡았음 |
| tier-builder / scout | 0 | 복사·실행은 Fable이 직접 하는 편이 브리프 비용보다 싸다 |
| Fable 직접 | A, B1, B5, D | 순차 체인이고 판단 재료가 컨텍스트에 있음 |

버즈 칼리파 포함 시 expert 1 + verifier 1 추가. 승격 예상 0회 (lumenstate에서 같은 배정으로 0회).

병렬: B1을 4개 저장소에 먼저 끝낸 뒤 B2 4개를 한 메시지에서 동시에 띄운다. 저장소가 서로 달라 쓰기 충돌이 없다. VDL 사이트 CLAUDE.md의 `run_in_background` 금지 규칙은 그 저장소 안 작업에만 해당하므로, 이번 작업 디렉터리(스타터킷)에서는 백그라운드 병렬을 쓴다.

---

## 6. 검증 기준

- 공유 파일 8개가 스타터킷과 `diff -q` 동일 (저장소 4개 × 8).
- 문서 3종: 템플릿 4장 하드 게이트, 5장 정합성 점검, 가독성 체커 0건, Mermaid 0, em dash 0, 옛 절 기호 0, 분량 120/250/200 초과 시 비고 기록.
- 이름 계약: 01 대상 이름 = 02 이름 사전 = 03 참조 = 05 Data 페이지 라벨.
- 02 5절 구분(재활용/수정/신규)은 스타터킷 `src/components` 대비 파일 diff 결과에만 근거.
- 스토리북: `index.json`에 `overview-{project}-01…07` + 부록 등록, MDX 래퍼 사본 0줄, ESLint 통과, 개발 서버 모듈 응답 200. 화면 캡처는 사용자가 요청할 때만.
- 저장소 위생: oneir의 미커밋 변경 3개 파일을 건드리지 않음 (`git diff --stat`으로 확인). `public/` 대용량 파일 이동·복사 0.

---

## 7. 결정 (2026-09-17 사용자 지시로 확정)

사용자 지시: 이 작업은 코드가 아니라 스킬과 문서 포맷을 바꾸는 일이다. 대체되는 옛 문서·래퍼는 지운다. 질문 없이 진행한다.

- **제외와 이유**
  - vdl: 사용자 지시. VDL 사이트 자체(Next.js 플랫폼)라 예제가 아니다.
  - bellite: 저장소가 없다. `cases.js`에 `reserve: true`(예비, 기본 순서 밖)로만 있고 liveUrl이 null이며 사고 지도 7개에도 없다. 고칠 파일이 존재하지 않는다.
  - buzz-khalifa 스토리북 04~07: 스토리북·MUI·스타터킷 구조가 없는 Vite + TypeScript + react-three-fiber 저장소다. 04~07은 스토리북 코드 페이지라 스토리북 도입(코드 작업) 없이는 만들 수 없다. 문서 3종과 스킬 폴더는 만든다.
- **buzz-khalifa**: `docs/buzz-khalifa/01~03` 새 포맷 작성 + `.claude/skills/project-planning/` 추가. 원천은 PRD.md, REMODELING_PLAN.md, `components/*.tsx`.
- **04~07 스타일**: lumenstate 그대로.
- **부록 문서**(heptapod 04~08, oneir 04~09, muse 04 + 부록 6, hirst 부록·계획): 대체 대상이 아니므로 파일 유지, `Overview/{Project}/Appendix/`에 노출.
- **대체되는 것은 삭제**: muse `overview/muse-planning/`, hirst `overview/hirst-planning/`, hirst `AssetPipelines.stories.jsx`(07 Assets에 흡수).
- **oneir 미커밋 변경**: 커밋 완료 후 진행.
- **다른 스킬**: project-planning만.
- **문서 상태 전제**: 완성 프로젝트의 교육 예제. 코드 근거 있는 항목만 확정, 제안값은 잠정·미정.

## 8. 리스크

- **heptapod 03 구조 차이**: 레퍼런스 분석 2장(로고그램 정량표, 질감표)이 새 템플릿 1절 무드·3절 토큰에 다 들어가지 않는다. 정량표는 부록(05 프롬프트 템플릿과 함께)으로 남기고 03에서는 참조만 한다. B2 브리프에 명시.
- **오디오·모션 문서(heptapod 04, oneir 06)**: 새 03에 모션 방향(3.3 형태·표면·모션)이 있으므로 요약만 넣고 원문은 부록.
- **대용량 public**: 07 Assets에서 파일 목록을 스캔할 때 `public/`을 통째로 import하지 않는다. 경로 목록과 썸네일만.
- **hirst Asset Pipelines 스토리**: 07 Assets에 흡수하면 기존 제목이 사라진다. 흡수하되 파이프라인 표는 07 안 절로 유지.
- **스토리북 포트**: 4개 저장소 모두 6006이라 동시 기동 불가. B5 검증은 저장소별 순차로 잠깐 띄우고 내린다.
- **API 끊김**: 어제 7개 병렬 위임 중 6개가 끊긴 전례. 워커 브리프에 "산출물을 단계마다 파일로 저장"을 넣어 재위임 시 이어 쓰게 한다.

---

## 9. 산출물과 원장

- 이 계획서: `docs/wb3-examples-planning-sync-plan.md` (스타터킷)
- 원장: `.orchestra/runs/20260917-wb3-examples-sync/ledger.md` (스타터킷). 예제별 워커 보고는 같은 폴더 `B2-{project}.md`, `B3-{project}.md`, `B4-{project}.md`.
- 실행 시작: 2026-09-17 (결정 확정 후).
