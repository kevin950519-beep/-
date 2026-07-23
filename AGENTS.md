# AGENTS.md (Codex 진입점)

Codex CLI의 always-on 프로젝트 컨텍스트.

사용 가능한 스킬과 서브에이전트는 `/skills` 로 확인한다.

## 규칙 (SSOT: .claude/rules/)

Codex에는 룰 자동 로드가 없다. 아래가 이 프로젝트 규칙의 원본이므로 해당 작업을 시작할 때 직접 Read한다.

| 규칙 | 파일 | 언제 |
|------|------|------|
| MUI Grid import (CRITICAL) | `.claude/rules/mui-grid-usage.md` | Grid를 쓰는 모든 작업 |
| 디렉토리 구조 | `.claude/rules/directory-structure.md` | 파일·컴포넌트 생성 시 |
| 코드 컨벤션 | `.claude/rules/code-convention.md` | 모든 코드 작성 시 |
| 디자인 시스템 | `.claude/rules/design-system.md` | 스타일·토큰이 걸린 모든 작업 |
| em dash 금지 | `.claude/rules/no-em-dash.md` | 코드·주석·카피·문서 전부 |

룰을 수정하면 `pnpm generate-rules` 로 Storybook 시각화를 동기화한다.

## 명시 호출 전용 스킬

아래 3개는 자동 발동이 꺼져 있다. 해당 작업이면 `$mention` 으로 직접 호출한다.

| 작업 | 스킬 |
|------|------|
| 기획 문서 작성 (project-summary → ux-flow → visual-direction) | `$vdl-project-planning` |
| Supabase 백엔드·인증·RLS·엣지 함수 | `$vdl-supabase-integration` (supabase MCP 필요) |
| 룰 관계 그래프 재동기화 | `$vdl-rule-visualization` (보통은 `pnpm generate-rules`) |

## 금지

- 컴포넌트/스토리 파일을 스킬 없이 직접 수정하지 않는다. 먼저 `$vdl-component-work`.
- `.claude/` 폴더를 삭제하거나 이동하지 않는다. Codex 스킬이 이 경로의 원본을 읽어 동작한다.
