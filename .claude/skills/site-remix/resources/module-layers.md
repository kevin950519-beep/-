# 모듈 계층 (Module Layers)

> `site-remix` P6(모듈 계획) · P7(구현)에서 쓰는 단일 기준.
> 계층 표·경로·이름 규칙·의존 방향은 `design-spec.md` 6장을 그대로 옮긴 것이다. 결정을 바꾸지 않는다.

## 1. 계층 표

| 계층 | 위치 | 이름 규칙 | 무엇을 아는가 | 스토리 title |
|---|---|---|---|---|
| Token | `src/styles/themes/default.js` | 03 3.1절 이름 열 그대로 | 브랜드 값 | `Style/` (기존) |
| Component | `src/components/{category}/` | PascalCase, 용도 이름 | props만. 페이지 맥락·프로젝트 데이터·카피를 모른다 | `Custom Component/{n. 그룹}/{Name}` |
| Template | `src/components/templates/` | `{아키타입 id PascalCase}Template` (예: `split-hero` → `SplitHeroTemplate`) | 레이아웃과 이름 있는 슬롯(props). 데이터·카피를 모른다 | `Template/{Name}` |
| Section | `src/components/sections/` | `{02 2.2절 트리의 섹션 이름}Section` | 템플릿 하나를 골라 `src/data/{project}/`의 콘텐츠를 묶는다 | `Section/{Page}/{Name}` |
| Page | `src/pages/` | `{02 2.1절 페이지 이름}Page` | 섹션 순서, 페이지 셸(GNB·푸터), 라우트 | `Page/{Name}` |

의존 방향은 한쪽이다: Page → Section → Template → Component → Token. 역방향, 같은 계층 간 import를 금지한다(섹션이 섹션을, 템플릿이 데이터를, 컴포넌트가 템플릿을 import하지 않는다).

## 2. 계층별 "아는 것과 모르는 것"

| 계층 | 아는 것 | 모르는 것 |
|---|---|---|
| Component | 자기 props, theme 토큰 | 어느 페이지·섹션에 쓰이는지, 프로젝트 데이터, 카피 |
| Template | 슬롯 이름(props), 변형 축 | 슬롯에 무엇이 채워지는지, `content.js`의 존재 |
| Section | 템플릿 하나, `content.js`의 자기 키 | 다른 섹션의 존재, 페이지 순서, 라우트 |
| Page | 섹션 목록과 순서, 라우트 경로, 페이지 셸 | 섹션 내부 구현, 템플릿 슬롯 이름 |

이 분리 때문에 카피·콘텐츠는 `src/data/{project}/content.js`에 페이지 → 섹션 키로 둔다. 다루는 대상 데이터는 02 3.2절 식별자 파일(`src/data/{project}/{식별자}.js`)에 별도로 둔다. JSX 안에 카피 문자열을 직접 쓰지 않는다(섹션 계층 포함).

---

## 3. 템플릿을 만들지 말지 판단

- 같은 아키타입의 섹션 두 개는 템플릿 하나를 공유한다.
- 템플릿은 2곳 이상에서 쓰이거나 슬롯이 3개 이상일 때 만든다.
- 그 조건에 못 미치면 섹션이 컴포넌트를 직접 조합한다(템플릿 계층을 만들지 않는다).

### 3.1 이름 짓기

템플릿 이름은 `layoutTaxonomyData.js`의 아키타입 id를 PascalCase로 바꾸고 `Template`을 붙인다.

| 아키타입 id | 템플릿 이름 |
|---|---|
| `split-hero` | `SplitHeroTemplate` |
| `feature-grid` | `FeatureGridTemplate` |
| `card-grid` | `CardGridTemplate` |
| `bento-grid` | `BentoGridTemplate` |

섹션 이름은 02 2.2절 트리의 섹션 이름과 글자가 같아야 한다(뒤에 `Section`만 붙인다). 페이지 이름은 02 2.1절 페이지 이름과 같아야 한다(뒤에 `Page`만 붙인다). 이는 `doc-templates.md` 0.5절 이름 계약의 확장이다.

### 3.2 템플릿 props 구성

슬롯 이름(`media`, `eyebrow`, `title`, `body`, `actions`, `items`)과 변형 축(`ratio`, `isReversed`, `columns`, `density`)으로 나눈다. boolean은 `is`/`has`, 함수형은 `on` 접두를 쓴다(`.claude/rules/code-convention.md` 3절).

---

## 4. 계층별 파일 골격 예시

### 4.1 Template: `SplitHeroTemplate`

`src/components/templates/SplitHeroTemplate.jsx`. 슬롯 props만 받고 theme 토큰과 `sx`만 쓴다. 카피·데이터를 모른다.

```jsx
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

/**
 * SplitHeroTemplate
 *
 * 좌우 분할(split-hero 아키타입) 히어로 템플릿. 텍스트 슬롯과 미디어 슬롯을
 * 좌우로 배치하고, 방향을 뒤집을 수 있다.
 *
 * Props:
 * @param {node} eyebrow - 상단 보조 라벨 슬롯 [Optional]
 * @param {node} title - 제목 슬롯 [Required]
 * @param {node} body - 본문 슬롯 [Optional]
 * @param {node} actions - CTA 버튼 그룹 슬롯 [Optional]
 * @param {node} media - 이미지·영상 슬롯 [Required]
 * @param {boolean} isReversed - 미디어를 좌측에 둘지 여부 [Optional, 기본값: false]
 *
 * Example usage:
 * <SplitHeroTemplate title={ <Title /> } media={ <AspectMedia /> } />
 */
export function SplitHeroTemplate({
  eyebrow,
  title,
  body,
  actions,
  media,
  isReversed = false,
}) {
  return (
    <Grid container spacing={ 4 } direction={ isReversed ? 'row-reverse' : 'row' }>
      <Grid size={ { xs: 12, md: 6 } }>
        <Box sx={ { display: 'flex', flexDirection: 'column', gap: 2 } }>
          { eyebrow }
          { title }
          { body }
          { actions }
        </Box>
      </Grid>
      <Grid size={ { xs: 12, md: 6 } }>
        { media }
      </Grid>
    </Grid>
  );
}
```

템플릿 스토리(`SplitHeroTemplate.stories.jsx`)는 `src/common/ui/Placeholder.jsx`의 FPO 서브컴포넌트로만 채운다.

```jsx
import Placeholder from '../../common/ui/Placeholder';
import { SplitHeroTemplate } from './SplitHeroTemplate';

export default {
  title: 'Template/SplitHeroTemplate',
  component: SplitHeroTemplate,
};

export const Docs = {
  args: {
    eyebrow: <Placeholder.Text variant="caption" />,
    title: <Placeholder.Text variant="heading" />,
    body: <Placeholder.Paragraph lines={ 2 } />,
    media: <Placeholder.Image ratio="4/3" />,
  },
};
```

### 4.2 Section: `{Role}Section`

`src/components/sections/HeroSection.jsx` (02 2.2절 트리의 섹션 이름이 "Hero"인 경우). 템플릿 하나를 고르고 `content.js`에서 자기 키만 읽는다.

```jsx
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AspectMedia from '../media/AspectMedia';
import { SplitHeroTemplate } from '../templates/SplitHeroTemplate';
import { content } from '../../data/{project}/content';

/**
 * HeroSection
 *
 * 랜딩 첫 화면. SplitHeroTemplate에 콘텐츠 데이터를 묶어 넣는다.
 *
 * Props:
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <HeroSection />
 */
export function HeroSection({ sx }) {
  const { hero } = content.landing;

  return (
    <SplitHeroTemplate
      eyebrow={ <Typography variant="overline">{ hero.eyebrow }</Typography> }
      title={ <Typography variant="h1">{ hero.title }</Typography> }
      body={ <Typography variant="body1">{ hero.body }</Typography> }
      actions={ <Button variant="contained">{ hero.ctaLabel }</Button> }
      media={ <AspectMedia ratio="4/3" src={ hero.mediaSrc } /> }
    />
  );
}
```

섹션 스토리는 `Placeholder`가 아니라 실제 프로젝트 데이터(`content.js`)를 그대로 렌더한다.

### 4.3 Page: `{Name}Page`

`src/pages/LandingPage.jsx` (02 2.1절 페이지 이름이 "Landing"인 경우). 섹션을 순서대로 나열하고 페이지 셸을 두른다. 섹션 내부를 모른다.

```jsx
import Header from '../components/navigation/Header';
import Footer from '../components/navigation/Footer';
import { HeroSection } from '../components/sections/HeroSection';
import { FeatureGridSection } from '../components/sections/FeatureGridSection';

/**
 * LandingPage
 *
 * 브랜드 서사와 제품 쇼케이스를 담는 최상위 페이지. 섹션 순서와
 * 페이지 셸(GNB, 푸터)만 조립한다.
 *
 * Example usage:
 * <Route path="/" element={ <LandingPage /> } />
 */
export function LandingPage() {
  return (
    <>
      <Header />
      <HeroSection />
      <FeatureGridSection />
      <Footer />
    </>
  );
}
```

페이지 스토리는 `parameters: { layout: 'fullscreen' }`을 쓴다.

### 4.4 `content.js` 키 구조

`src/data/{project}/content.js`는 페이지 → 섹션 키로 카피를 둔다. 섹션 이름은 02 2.2절 트리, 페이지 이름은 02 2.1절과 글자가 같다.

```js
export const content = {
  landing: {
    hero: {
      eyebrow: '새 브랜드 이름',
      title: '한 문장 헤드라인',
      body: '두세 문장 서브카피',
      ctaLabel: '시작하기',
      mediaSrc: '/assets/landing/hero.jpg',
    },
    featureGrid: {
      items: [
        { title: '기능 1', body: '설명' },
      ],
    },
  },
};
```

---

## 5. 스토리 규칙

| 계층 | title 접두사 | 콘텐츠 | 그 외 |
|---|---|---|---|
| Template | `Template/{Name}` | `Placeholder` FPO만 | 첫 스토리 이름 규칙은 `component-work/resources/storybook-writing.md`를 따른다 |
| Section | `Section/{Page}/{Name}` | 실제 프로젝트 데이터(`content.js`) | 같은 파일 |
| Page | `Page/{Name}` | 섹션 실제 렌더 | `parameters: { layout: 'fullscreen' }` |

첫 스토리의 export 이름은 `Docs`(autodocs 제외)로 둔다. Props 테이블, argTypes 등 나머지 세부 규칙은 `storybook-writing.md`를 그대로 따른다(이 문서에 복제하지 않는다).

---

## 6. 모듈 맵 (청사진 7절)

표 형식: `페이지 / 섹션 / 템플릿 / 주요 컴포넌트 / 구분`. 구분 값은 재활용·수정·신규.

| 페이지 | 섹션 | 템플릿 | 주요 컴포넌트 | 구분 |
|---|---|---|---|---|
| Landing | Hero | SplitHeroTemplate | Title, AspectMedia, Button | 재활용 |
| Landing | FeatureGrid | FeatureGridTemplate | CustomCard | 신규 |

모듈 맵과 02 5절 컴포넌트 리스트의 관계: 02 5절이 기준 표다(무엇을 재활용·수정·신규로 만들지 확정하는 곳). 모듈 맵은 그 결정이 페이지 → 섹션 → 템플릿 → 컴포넌트로 어떻게 포함되는지 추적하는 용도이며, 02 5절과 다른 결정을 담지 않는다.

---

## 7. 빌드 순서

1. 토큰: 03 5절 변경 토큰 요약 표대로 `src/styles/themes/default.js`를 고친다(`.claude/rules/design-system.md` 3절 순서 준수).
2. 컴포넌트(신규·수정): 02 5절에서 신규·수정으로 표시된 것부터.
3. 템플릿.
4. 콘텐츠 데이터: `src/data/{project}/content.js`, 대상 식별자 파일.
5. 섹션.
6. 페이지.
7. 라우트 연결: `react-router-dom` v7, `src/App.jsx`.

각 단계의 구현은 반드시 component-work 스킬을 경유한다(Claude `/component-work`, Codex `$vdl-component-work`). 조합(레이아웃 골격) 단위를 짤 때는 `stable-layout` 스킬 절차(공간 모델 → 아키타입 → 영역 정책 → 포화 → reflow → 안정성)를 따른다.

`component-work/resources/components.md`에 아직 없으면 `## Templates`, `## Sections`, `## Pages` 제목을 만들고 새 항목을 등록한다. 각 폴더(`templates/`, `sections/`, `pages/`)는 barrel export용 `index.js`를 유지한다.

---

## 8. 생성 후 점검 핸드오프

조합 단위(섹션·페이지)를 만든 뒤에는 component-work의 "생성 후 점검 핸드오프" 절차를 그대로 따른다. 자동으로 점검 에이전트를 부르지 않고, 사용자에게 먼저 묻는다. 사용자가 동의하면 산출물 성격에 맞는 에이전트(`stable-layout-auditor`, `typography-auditor`, `ai-slop-fixer`)를 후보로 제시하고 호출한다.

## 9. 계층 점검표

- 의존 방향 위반이 없는가.

```
grep -rn "from '../sections" src/components/templates
grep -rn "from '../templates" src/components/{category}
grep -rn "from '../../data" src/components/templates
```

세 명령 모두 결과가 0줄이어야 한다(템플릿이 섹션·데이터를 모르고, 컴포넌트가 템플릿을 모른다).

- JSX 안에 카피 문자열이 하드코딩되지 않았는가.

```
grep -rnE ">[가-힣]{2,}" src/components/sections src/pages
```

결과가 있으면 그 문자열을 `content.js`로 옮긴다.

- 토큰이 하드코딩되지 않았는가.

```
grep -rnE "#[0-9a-fA-F]{3,6}|[0-9]+px" src/components/templates src/components/sections
```

결과가 있으면 theme 토큰(`sx={ { color: 'primary.main' } }` 등)으로 바꾼다.

- Grid import가 규칙을 따르는가(`.claude/rules/mui-grid-usage.md` 참조). `@mui/material/Grid`에서만 import했는지 `src/components/templates`, `src/components/sections`, `src/pages`를 열어 직접 확인한다. `size={ { xs: 12, md: 6 } }` 형태만 쓴다.
