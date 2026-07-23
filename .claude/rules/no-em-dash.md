# No Em Dash (MUST)

em dash 문자(U+2014, `—`)를 어떤 산출물에도 쓰지 않는다.

## 적용 범위

- 생성·수정하는 모든 코드 파일과 주석
- 사용자에게 보이는 카피(제목, 본문, 버튼 레이블, placeholder)
- Storybook 스토리의 텍스트와 설명
- 기획 문서, 프롬프트, 커밋 메시지

## 대체 방법

쉼표, 마침표, 콜론, 괄호로 푼다.

```jsx
// 틀림
<Typography>디자인 시스템 — 토큰 우선</Typography>

// 맞음
<Typography>디자인 시스템: 토큰 우선</Typography>
<Typography>디자인 시스템(토큰 우선)</Typography>
```

**이유**: em dash 연발은 AI가 쓴 글의 대표적 신호다.

en dash(`–`)와 하이픈(`-`)은 제한이 없다.
