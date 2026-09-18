# Vibe Design Starter Kit v1.0

바이브 코딩으로 **예측 가능하고 퀄리티 높은 UI**를 만들기 위한 스타터킷.
디자인을 잘 모르는 개발자, 코딩이 처음인 디자이너 모두를 위해 설계되었습니다.

## 구성 요소

```
├── MUI 7 + React 19          UI 프레임워크 + 커스텀 테마
├── Storybook 10               컴포넌트 문서화 + 시각적 탐색
├── UI 택소노미 (207항목)       컴포넌트 분류 체계
├── Claude Code 설정            Rules + Skills + Settings
└── 50+ 컴포넌트               레이아웃, 카드, 모션, 타이포 등
```

### Storybook

컴포넌트를 시각적으로 탐색하고 Props를 조작하는 도구입니다.

```bash
pnpm storybook
```

- **Overview**: 프로젝트 소개, 기획 문서, 룰 관계 시각화
- **Style**: 색상, 타이포, 간격, 아이콘 등 디자인 토큰
- **Component / Interactive**: UI 컴포넌트 + 인터랙티브 패턴
- **Template**: 여러 컴포넌트를 조합한 페이지 템플릿

### Claude Code 설정

Claude Code가 이 프로젝트의 규칙을 자동으로 따르도록 설정되어 있습니다.

**Rules** (`.claude/rules/`, 5파일): 매 세션 자동 로드됩니다.

| 파일 | 역할 |
|------|------|
| `code-convention.md` | JavaScript + React 코드 컨벤션, props 주석 규칙 |
| `design-system.md` | 기존 컴포넌트 재활용, 디자인 토큰 우선 사용 |
| `directory-structure.md` | 컴포넌트·스토리·데이터 파일의 위치 |
| `mui-grid-usage.md` | MUI v7 Grid import 규칙 (CRITICAL) |
| `no-em-dash.md` | 모든 산출물에서 em dash 금지 |

**Skills** (`.claude/skills/`, 9개): 의도에 맞을 때 활성화됩니다.

| 스킬 | 역할 |
|------|------|
| `project-planning` | 기획 문서 3종(01~03) 작성. 명시 호출 전용 |
| `component-work` | 컴포넌트 생성/수정/삭제 + 스토리 작성 |
| `visual-asset-prompt` | 이미지·에셋 생성 프롬프트 설계 (FORMAT/LOOK/SUBJECT) |
| `stable-layout` | 페이지·섹션 레이아웃 골격 설계, 넘침·CLS 차단 |
| `convert-external` | 외부 코드(TS, Tailwind 등)를 프로젝트 규칙에 맞게 변환 |
| `supabase-integration` | Supabase 백엔드·인증·RLS·엣지 함수. 명시 호출 전용 |
| `rule-visualization` | 룰 관계 그래프 재동기화. 보통은 `pnpm generate-rules` |
| `skill-creator` | 새 스킬 작성·평가 도구 |
| `sub-agent-generator` | 서브에이전트 정의 생성 |

**Settings** (`.claude/settings.json`): 권한 설정 (Read/Write/pnpm/git 허용, .env 차단)

### 커스텀 테마

`src/styles/themes/default.js`에 정의된 디자인 토큰:

- **Primary**: Pure Blue (`#0000FF`) / **Secondary**: Blue-Grey (`#263238`)
- **Typography**: Outfit (영문) + Pretendard (한글)
- **Shape**: borderRadius 0 (플랫 디자인)
- **Elevation**: 저투명도 블러 그림자

## 시작하기

```bash
# 설치
pnpm install

# Storybook 실행
pnpm storybook

# 개발 서버
pnpm dev
```

## 새 프로젝트 만들기

이 키트로 자기 프로젝트를 제로베이스에서 만들 때의 순서입니다. `{project}`는 프로젝트 폴더 이름(kebab-case)입니다.

| 단계 | 하는 일 | 산출 경로 | 쓰는 스킬·명령 |
|------|---------|----------|---------------|
| 1. 기획 | 목적, 사용자, 다루는 대상, 핵심 과업을 정한다 | `docs/{project}/01-project-summary.md` | `/project-planning` |
| 2. UX | 시나리오, 페이지 리스트, 데이터 모델, 컴포넌트 리스트 | `docs/{project}/02-ux-flow.md` | `/project-planning` |
| 3. 비주얼 디렉션 | 무드, 레이아웃 전략, 토큰 방향, 이미지·에셋 방향 | `docs/{project}/03-visual-direction.md` | `/project-planning` |
| 3-2. 토큰 적용 | 03 5절 표대로 theme 파일의 값을 바꾼다 | `src/styles/themes/default.js` | `/component-work` |
| 4. 생성 재료 준비 | 이미지·영상·소리 생성 프롬프트와 데이터 파일 | `docs/{project}/image-generation/`, `src/data/{project}/` | `/visual-asset-prompt` |
| 5. 컴포넌트 | 02 5절의 재활용·수정·신규 항목을 구현 | `src/components/{카테고리}/` | `/component-work` |
| 6. 스토리북 Overview | 기획 문서, 구조·데이터·에셋, 결정 흐름 도식을 페이지로 | `src/stories/overview/` | `pnpm generate-structure`, `pnpm generate-assets` |
| 7. 배포 | 사이트와 스토리북을 함께 빌드해 올린다 | `dist/`, `dist/storybook/` | `pnpm build` |

**순서의 이유**

- 1~3은 앞 문서가 승인돼야 다음이 시작됩니다. 이름은 01에서 한 번만 짓고 02·03이 글자 그대로 씁니다.
- 3의 3절·5절이 3-2단계 theme 파일의 입력입니다. 5절 표의 근거 칸을 비우지 않아야 어떤 결정이 어떤 토큰이 됐는지 나중에 되짚을 수 있습니다.
- 3의 4절·4.2절(이미지·에셋 방향과 생성 재료)이 4단계 프롬프트의 입력입니다. 방향 없이 생성부터 하지 않습니다.
- 5는 02 5절 컴포넌트 리스트를 그대로 따라갑니다. 신규를 만들기 전에 재활용을 먼저 확인합니다.
- 포맷의 단일 기준은 `.claude/skills/project-planning/resources/doc-templates.md`입니다. 스토리북 Overview 페이지의 파일명·제목 규약도 이 문서의 0.6절에 있습니다.
- 결정은 세 자리에 근거를 남깁니다. 03 3절·5절의 근거 칸, 03 4절 에셋 블록의 근거 줄, 4.2절 프롬프트 원문의 슬롯 표입니다. 이 세 자리가 채워져 있으면 6단계의 Concept & Flow 페이지가 기획에서 결과물까지의 흐름을 도식으로 그릴 수 있습니다.

## 내 프로젝트에 최적화하기

이 스타터킷을 실제 프로젝트에 맞게 커스터마이즈하는 방향입니다.

### 1. 테마 교체

`src/styles/themes/default.js`에서 색상, 타이포, 간격을 프로젝트 브랜드에 맞게 수정합니다. 입력은 `docs/{project}/03-visual-direction.md` 5절의 변경 토큰 요약 표이고, 상수 이름은 3.1절 이름 열을 그대로 씁니다(위 3-2단계). `.claude/rules/design-system.md`의 토큰 예시도 함께 업데이트하면 Claude가 새 토큰을 사용합니다.

### 2. 불필요한 컴포넌트 정리

50+ 컴포넌트 중 프로젝트에 필요한 것만 남기고 나머지를 삭제합니다. 삭제 후 `pnpm generate-rules`를 실행하면 Storybook 시각화가 자동 갱신됩니다.

### 3. Rules 조정

`.claude/rules/` 파일을 프로젝트 컨벤션에 맞게 수정합니다.

- 다른 아이콘 라이브러리 사용 → `design-system.md` 수정
- TypeScript 도입 → `code-convention.md`에 TS 규칙 추가
- 폴더 구조 변경 → `directory-structure.md` 수정

### 4. Skills 확장

프로젝트 고유 워크플로우가 있다면 `.claude/skills/`에 새 스킬을 추가합니다. 추가 후 `pnpm generate-rules`로 시각화를 갱신합니다.

### 5. Hooks 도입 (선택)

코드 포매팅 자동화가 필요하다면 Prettier PostToolUse hook을 추가할 수 있습니다.

```bash
pnpm add -D prettier
```

`.claude/settings.json`에 hook 설정 추가:

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{
        "type": "command",
        "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write"
      }]
    }]
  }
}
```

### 6. Overview 스토리 정리

`Overview/Introduction`과 `Overview/For Designers`는 스타터킷 자체를 소개하는 페이지입니다. 팀에 합류하는 사람에게 환경 설명이 계속 필요하면 남기고, 프로젝트 문서만 보여줄 자리라면 내 프로젝트의 01~03 페이지로 교체합니다. `Overview/Rule Relationships`는 `.claude/` 구조를 그리므로 룰을 수정한 뒤 `pnpm generate-rules`로 갱신하며 그대로 씁니다.

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | Vite 개발 서버 |
| `pnpm storybook` | Storybook 실행 (포트 6006) |
| `pnpm build` | 사이트와 Storybook을 함께 빌드 (`dist/` + `dist/storybook/`) |
| `pnpm build-storybook` | Storybook만 정적 빌드 |
| `pnpm lint` | ESLint 실행 |
| `pnpm smoke` | happy-dom 렌더 스모크. 전 스토리 error 0 확인 |
| `pnpm generate-rules` | `.claude/` 구조를 스캔하여 룰 시각화 데이터 재생성 |
| `pnpm generate-structure` | `src/data/projectStructure.js` 생성 (Overview 04 원천) |
| `pnpm generate-assets` | `src/data/assetInventory.js` 생성 (Overview 07 원천) |

`pnpm build`의 결과물은 사이트가 `dist/`, Storybook이 `dist/storybook/`에 들어갑니다. 배포하면 Storybook의 공개 경로는 `/storybook/`입니다.
