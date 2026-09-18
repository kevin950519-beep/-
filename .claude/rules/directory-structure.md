# Directory Structure (MUST)

파일/컴포넌트 생성 시 반드시 아래 구조를 따른다.

## 프로젝트 디렉토리

```
src/
├── components/          # UI 컴포넌트 (기능 카테고리별 폴더)
│   ├── card/            # 카드 계열
│   ├── container/       # 컨테이너 계열
│   ├── content-transition/ # 콘텐츠 전환
│   ├── data-display/    # 데이터 표시 (Table 등)
│   ├── dynamic-color/   # 동적 색상
│   ├── in-page-navigation/ # 페이지 내 네비게이션 (Tabs 등)
│   ├── input/           # 입력 (Button, TextField, Select 등)
│   ├── kinetic-typography/ # 키네틱 타이포그래피
│   ├── layout/          # 레이아웃 (Grid, Split, AppShell 등)
│   ├── media/           # 미디어 (이미지, 캐러셀 등)
│   ├── motion/          # 모션/전환 효과
│   ├── navigation/      # 내비게이션 (GNB, NavMenu 등)
│   ├── overlay-feedback/ # 오버레이 (Dialog 등)
│   ├── scroll/          # 스크롤 기반 인터랙션
│   ├── sections/        # 섹션 (템플릿 + 프로젝트 콘텐츠 바인딩)
│   ├── templates/       # 템플릿 (레이아웃 + 슬롯, 데이터·카피를 모름)
│   └── typography/      # 타이포그래피
├── pages/               # 페이지 (섹션 순서, 셸, 라우트)
├── common/ui/           # 공통 유틸리티 UI (Placeholder, Indicator 등)
├── stories/             # Storybook 전용 (style, overview, page, template)
├── styles/              # 테마, 글로벌 스타일
├── utils/               # 유틸리티 함수
└── data/                # 데이터 파일
```

## 파일 배치 규칙

### 컴포넌트

- **컴포넌트 파일**: `src/components/{카테고리}/{ComponentName}.jsx`
- **스토리 파일**: 같은 폴더에 `{ComponentName}.stories.jsx`
- **index.js**: 각 카테고리 폴더에 barrel export 파일 유지
- **커스텀 훅**: 해당 컴포넌트 폴더에 `use{HookName}.js`

### 조합 계층 (템플릿 · 섹션 · 페이지)

- **템플릿**: `src/components/templates/{Name}Template.jsx`. 레이아웃과 이름 있는 슬롯(props)만 안다. 프로젝트 데이터와 카피를 import하지 않는다.
- **섹션**: `src/components/sections/{Name}Section.jsx`. 템플릿 하나를 골라 `src/data/{project}/`의 콘텐츠를 묶는다. 이름은 02 2.2절 트리의 섹션 이름.
- **페이지**: `src/pages/{Name}Page.jsx`. 섹션 순서와 페이지 셸, 라우트를 안다. 이름은 02 2.1절 페이지 이름.
- 의존은 페이지 → 섹션 → 템플릿 → 컴포넌트 한 방향이다. 같은 계층끼리, 또는 아래에서 위로 import하지 않는다.
- 계층 계약의 기준은 `.claude/skills/site-remix/resources/module-layers.md`다.

### 새 카테고리 추가 시

- 기존 카테고리에 맞는 곳이 없을 때만 `src/components/` 하위에 새 폴더 생성
- 폴더명은 kebab-case 사용

### 공통 UI

- 여러 컴포넌트에서 재사용하는 소형 UI → `src/common/ui/`

### 스토리 전용

- 디자인 토큰 문서화 (색상, 타이포 등) → `src/stories/style/`
- 프로젝트 소개/가이드 → `src/stories/overview/`

### 기획 문서와 생성 재료

- 기획 문서 3종과 부록 → `docs/{project}/` (`01-project-summary.md`, `02-ux-flow.md`, `03-visual-direction.md`, `appendix-{주제}.md`)
- 이미지·영상·소리 생성 재료 → `docs/{project}/image-generation/` (프롬프트 원문, 공통 스타일, 대상별 슬롯, 실행 기록)
- 정적·클라이언트 데이터 파일 → `src/data/{project}/{식별자}.js` (파일명은 02 3.2절 코드 식별자)
- 배치 생성 스크립트 → `scripts/generate-{대상}-images.mjs`

슬롯과 형식의 기준은 `.claude/skills/project-planning/resources/doc-templates.md` 0.6절과 03 4.2절이다.
