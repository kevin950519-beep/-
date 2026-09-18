# 레퍼런스 캡처 요약: fixture.example

- 캡처 시각: 2026-09-19T01:40:00.000Z
- 캡처 파일: 3개 / 페이지 2개 / 뷰포트 1440x900, 390x844
- 감지된 라이브러리: gsap, lenis, next, react
- 이 요약은 측정값과 패턴만 담는다. 원본 카피 전문, 에셋 URL, 소스 코드는 담지 않는다.

## 1. 페이지 목록

| slug | 경로 | 제목 | 섹션 수 | 문서 높이 |
|---|---|---|---|---|
| home | / | Fixture: 측정한 구조로 다시 짓는 랜딩 | 11 | 4932px |
| pricing | /pricing | Fixture: 요금제 | 7 | 3372px |

## 2. 페이지: home (1440x900)

### 2.1 섹션 구조

| # | tag | roleGuess | 제목 | 높이 | layout | media | repeat | 배경 |
|---|---|---|---|---|---|---|---|---|
| 0 | header | global-nav |  | 72px | flex 3열 | 1 | 0 | #ffffff |
| 1 | section | hero | 측정한 구조로 다시 짓는 랜딩 | 760px | flex 2열 | 1 | 0 | #0b0d12 어두움 |
| 2 | section | logo-cloud |  | 160px | flex 6열 | 6 | 6 | #f4f5f8 |
| 3 | section | feature-grid | 세 가지 축으로 분해합니다 | 620px | grid 3열 | 3 | 3 | #ffffff |
| 4 | section | feature-detail | 토큰은 값이 아니라 구조를 승계합니다 | 540px | grid 2열 | 1 | 0 | #ffffff |
| 5 | section | stat-band |  | 220px | grid 4열 | 0 | 4 | #0b0d12 어두움 |
| 6 | section | testimonial | 먼저 쓴 팀의 말 | 480px | grid 3열 | 3 | 3 | #f4f5f8 |
| 7 | section | pricing | 요금제 | 720px | grid 3열 | 0 | 3 | #ffffff |
| 8 | section | faq | 자주 묻는 질문 | 560px | block 1열 | 0 | 0 | #ffffff |
| 9 | section | cta | 지금 구조부터 확인해 보세요 | 380px | block 1열 | 0 | 0 | #2f5bff 어두움 |
| 10 | footer | footer |  | 420px | flex 4열 | 1 | 0 | #111318 어두움 |

### 2.2 토큰 (색, 서체와 타입 스케일, 간격·모서리·그림자)

| 역할 | 가짓수 | 상위 값(빈도) |
|---|---|---|
| 글자 | 4 | #111318(412), #5b6270(188), #f7f8fb(96), #2f5bff(44) |
| 배경 | 4 | #ffffff(62), #f4f5f8(18), #0b0d12(9), #2f5bff(14) |
| 테두리 | 2 | #e3e6ee(46), #2f5bff(6) |
| 액센트 | 2 | #2f5bff(14), #111318(5) |

| 서체 | 쓰임 | 웨이트 | 빈도 |
|---|---|---|---|
| Pretendard Variable | heading/body/ui | 400/500/700 | 486 |
| IBM Plex Mono | ui | 400 | 24 |

| 크기 | 빈도 | 태그 | 행간 | 자간 | 다음 단계 비 |
|---|---|---|---|---|---|
| 64px | 2 | h1 | 1.08 | -0.03em | ×1.45 |
| 44px | 9 | h2 | 1.2 | -0.02em | ×1.38 |
| 32px | 14 | h3/p | 1.3 | -0.015em | ×1.33 |
| 24px | 28 | h3 | 1.35 | -0.01em | ×1.2 |
| 20px | 42 | p | 1.55 | normal | ×1.25 |
| 16px | 248 | p/li/a/span | 1.6 | normal | ×1.14 |
| 14px | 96 | span/li | 1.5 | 0.01em |  |

추정 타입 스케일 비: 중앙값 ×1.33 (범위 ×1.14 ~ ×1.45)

| 항목 | 관측값 |
|---|---|
| 섹션 paddingY | 16px, 48px, 64px, 96px, 120px |
| gap | 24px(18), 16px(12), 48px(6), 32px(5), 8px(4), 64px(2) |
| 컨테이너 maxWidth | 1200px(9), 720px(3) |
| 간격 기준 단위 | 8px (적중률 0.94) |
| radius | 12px(58), 999px(14), 4px(6) |
| shadow | 22회, 6회 / 대표: rgba(17, 19, 24, 0.08) 0px 1px 2px 0px |
| :root 변수 | 8개 |

### 2.3 내비와 CTA

헤더: 있음 / 링크 6개 / 상단 고정

| 헤더 링크 | 경로 | 외부 | CTA |
|---|---|---|---|
| Fixture | / |  |  |
| 기능 | /features |  |  |
| 요금 | /pricing |  |  |
| 문서 | /docs |  |  |
| 커뮤니티 | (외부) | community.example.org |  |
| 무료로 시작 | /signup |  | 예 |

| 푸터 그룹 | 링크 수 | 항목 |
|---|---|---|
| 제품 | 4 | 기능, 요금, 변경 기록, 상태 |
| 회사 | 3 | 소개, 블로그, 채용 |
| 정책 | 2 | 이용약관, 개인정보 |

| CTA | 유형 | 위치 섹션 | 우선순위 |
|---|---|---|---|
| 무료로 시작 | link | #0 global-nav | primary |
| 지금 시작하기 | link | #1 hero | primary |
| 데모 보기 | link | #1 hero | secondary |
| 팀으로 시작 | link | #7 pricing | primary |
| 문의하기 | link | #9 cta | secondary |

### 2.4 모션 힌트

| 항목 | 관측값 |
|---|---|
| duration | 240ms(48), 160ms(18), 600ms(6) |
| easing | cubic-bezier(0.4, 0, 0.2, 1), ease-out |
| transition 있는 섹션 | 4 / 11 |
| 섹션 힌트 | sticky×1, scroll-reveal-attr×2 |

### 2.5 미디어 인벤토리

| 역할 | 개수(비율) | 대표 종횡비 | 대표 크기 | 형식 |
|---|---|---|---|---|
| logo | 8개 (50%) | 3.75 | 120x32 | svg |
| icon | 3개 (19%) | 1 | 40x40 | (미상) |
| avatar | 3개 (19%) | 1 | 56x56 | jpg |
| hero | 1개 (6%) | 1.52 | 640x420 | webp |
| background | 1개 (6%) | 1.78 | 1200x675 | mp4 |

총 16개, alt 없음 4개, 지연 로딩 8개

### 2.6 뷰포트 비교

데스크탑 1440x900 대 모바일 390x844. 역할 순서로 짝지은 표다.

| # | 역할 | 열(데스크탑) | 열(모바일) | 비고 |
|---|---|---|---|---|
| #0 | global-nav | 3 | 2 | 열 수 변함 |
| #1 | hero | 2 | 1 | 열 수 변함 |
| #2 | logo-cloud | 6 | 2 | 열 수 변함 |
| #3 | feature-grid | 3 | 1 | 열 수 변함 |
| #4 | feature-detail | 2 | 1 | 열 수 변함 |
| #5 | stat-band | 4 | - | 모바일에 없음 |
| #6 | testimonial | 3 | 1 | 열 수 변함 |
| #7 | pricing | 3 | 1 | 열 수 변함 |
| #8 | faq | 1 | 1 |  |
| #9 | cta | 1 | 1 |  |
| #10 | footer | 4 | 1 | 열 수 변함 |

섹션 수 11 대 10 / 데스크탑에만 1개, 모바일에만 0개 / 최대 열 수 6 대 2

## 3. 페이지: pricing (1440x900)

### 3.1 섹션 구조

| # | tag | roleGuess | 제목 | 높이 | layout | media | repeat | 배경 |
|---|---|---|---|---|---|---|---|---|
| 0 | header | global-nav |  | 72px | flex 3열 | 1 | 0 | #ffffff |
| 1 | section | value-prop | 규모에 맞춰 고르세요 | 320px | block 1열 | 0 | 0 | #ffffff |
| 2 | section | pricing | 요금제 | 780px | grid 3열 | 0 | 3 | #ffffff |
| 3 | section | comparison | 기능 비교 | 900px | block 1열 | 0 | 0 | #f4f5f8 |
| 4 | section | faq | 요금 관련 질문 | 520px | block 1열 | 0 | 0 | #ffffff |
| 5 | section | cta | 먼저 무료로 확인해 보세요 | 360px | block 1열 | 0 | 0 | #2f5bff 어두움 |
| 6 | footer | footer |  | 420px | flex 4열 | 1 | 0 | #111318 어두움 |

### 3.2 토큰 (색, 서체와 타입 스케일, 간격·모서리·그림자)

| 역할 | 가짓수 | 상위 값(빈도) |
|---|---|---|
| 글자 | 4 | #111318(412), #5b6270(188), #f7f8fb(96), #2f5bff(44) |
| 배경 | 4 | #ffffff(62), #f4f5f8(18), #0b0d12(9), #2f5bff(14) |
| 테두리 | 2 | #e3e6ee(46), #2f5bff(6) |
| 액센트 | 2 | #2f5bff(14), #111318(5) |

| 서체 | 쓰임 | 웨이트 | 빈도 |
|---|---|---|---|
| Pretendard Variable | heading/body/ui | 400/500/700 | 486 |
| IBM Plex Mono | ui | 400 | 24 |

| 크기 | 빈도 | 태그 | 행간 | 자간 | 다음 단계 비 |
|---|---|---|---|---|---|
| 64px | 2 | h1 | 1.08 | -0.03em | ×1.45 |
| 44px | 9 | h2 | 1.2 | -0.02em | ×1.38 |
| 32px | 14 | h3/p | 1.3 | -0.015em | ×1.33 |
| 24px | 28 | h3 | 1.35 | -0.01em | ×1.2 |
| 20px | 42 | p | 1.55 | normal | ×1.25 |
| 16px | 248 | p/li/a/span | 1.6 | normal | ×1.14 |
| 14px | 96 | span/li | 1.5 | 0.01em |  |

추정 타입 스케일 비: 중앙값 ×1.33 (범위 ×1.14 ~ ×1.45)

| 항목 | 관측값 |
|---|---|
| 섹션 paddingY | 16px, 48px, 64px, 96px, 120px |
| gap | 24px(18), 16px(12), 48px(6), 32px(5), 8px(4), 64px(2) |
| 컨테이너 maxWidth | 1200px(9), 720px(3) |
| 간격 기준 단위 | 8px (적중률 0.94) |
| radius | 12px(58), 999px(14), 4px(6) |
| shadow | 22회, 6회 / 대표: rgba(17, 19, 24, 0.08) 0px 1px 2px 0px |
| :root 변수 | 8개 |

### 3.3 내비와 CTA

헤더: 있음 / 링크 6개 / 상단 고정

| 헤더 링크 | 경로 | 외부 | CTA |
|---|---|---|---|
| Fixture | / |  |  |
| 기능 | /features |  |  |
| 요금 | /pricing |  |  |
| 문서 | /docs |  |  |
| 커뮤니티 | (외부) | community.example.org |  |
| 무료로 시작 | /signup |  | 예 |

| 푸터 그룹 | 링크 수 | 항목 |
|---|---|---|
| 제품 | 4 | 기능, 요금, 변경 기록, 상태 |
| 회사 | 3 | 소개, 블로그, 채용 |
| 정책 | 2 | 이용약관, 개인정보 |

| CTA | 유형 | 위치 섹션 | 우선순위 |
|---|---|---|---|
| 무료로 시작 | link | #0 global-nav | primary |
| 팀으로 시작 | link | #2 pricing | primary |
| 문의하기 | link | #5 cta | secondary |

### 3.4 모션 힌트

| 항목 | 관측값 |
|---|---|
| duration | 240ms(48), 160ms(18), 600ms(6) |
| easing | cubic-bezier(0.4, 0, 0.2, 1), ease-out |
| transition 있는 섹션 | 1 / 7 |
| 섹션 힌트 | sticky×1 |

### 3.5 미디어 인벤토리

| 역할 | 개수(비율) | 대표 종횡비 | 대표 크기 | 형식 |
|---|---|---|---|---|
| logo | 2개 (50%) | 4.29 | 120x28 | (미상) |
| icon | 2개 (50%) | 1 | 24x24 | (미상) |

총 4개, alt 없음 2개, 지연 로딩 3개

## 4. 캡처 주의 사항

(없음)

