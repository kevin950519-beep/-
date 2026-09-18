# Capture Guide (P1)

이 문서는 P1 캡처 단계의 실행 안내다. 스크립트 CLI와 산출 규칙은 `design-spec.md` 7장이 기준이고, 여기서 뒤집지 않는다.

먼저 ego-browser 스킬(Claude는 Skill 도구의 `ego-browser`, Codex는 설치된 `ego-browser` 스킬)을 읽는다. TaskSpace·Page·핸드오프 규칙은 그 스킬이 기준이고 여기서 복제하지 않는다.

---

## 1. 사전 점검

| 확인 | 명령 | 실패 시 |
|---|---|---|
| ego-browser 설치 | `command -v ego-browser` | 설치 안내(ego-browser 스킬의 `references/install.md`)를 알리고 멈춘다 |
| 프로젝트 폴더 | `docs/{project}/reference` 경로 확정 | P0에서 정한 project 이름(kebab-case) 재확인 |

설치가 없고 사용자가 원하면 축소 모드로 간다: `curl`로 정적 HTML만 받아 구조만 분석하고, 토큰·모션은 `(미정)`으로 둔다. 축소 모드에서는 아래 2절 이후의 ego-browser 실행 절차를 건너뛴다.

---

## 2. 범위 정하기

- 최대 8페이지. 헤더 내비 구조를 기준으로 대표 페이지를 고른다(홈, 대표 목록, 대표 상세, 소개 등).
- 헤더 내비에 없는 링크, 검색 결과, 로그인 후 페이지 등 범위 밖 링크는 따라가지 않는다.
- 선택한 페이지 경로를 P0의 분석 범위 답과 대조하고 다르면 사용자에게 확인한다.

---

## 3. 실행 명령

CLI는 `design-spec.md` 7장 그대로다. 옵션 이름을 바꾸지 않는다.

```
node .claude/skills/site-remix/scripts/capture-site.mjs \
  --url <URL> --out docs/{project}/reference \
  [--pages /,/about,/pricing] [--viewports 1440x900,390x844] \
  [--space <taskSpaceId>] [--keep-open] [--max-sections 40] [--dry-run]
```

- 기본 뷰포트는 `1440x900`(데스크탑)과 `390x844`(모바일)이다. `--viewports`를 안 주면 이 둘을 쓴다.
- `--pages`를 2절에서 고른 경로로 채운다. 루트는 `/`.
- 첫 실행은 `--space` 없이 시작한다. 스크립트가 출력하는 `spaceId`를 다음 라운드(4절 수동 관찰, 실패 재시도)에 재사용한다.
- `--dry-run`은 필요할 때만 쓴다(만든 ego 스크립트를 stdout에 출력만 하고 브라우저를 띄우지 않는다). 기본 실행에는 필요 없다.

```
node .claude/skills/site-remix/scripts/summarize-capture.mjs \
  --in docs/{project}/reference [--page <slug>] [--write]
```

- 캡처가 끝나면 바로 `--write`로 실행해 `reference/summary.md`를 만든다.

---

## 4. 산출 파일

| 파일 | 의미 |
|---|---|
| `capture-{slug}-{W}x{H}.json` | 페이지 하나, 뷰포트 하나의 추출 결과. 최상위 키 `meta`, `nav`, `sections`, `tokens`, `media` |
| `shots/` | `fullPage` 스크린샷(모든 뷰포트) + 섹션별 clip 스크린샷(데스크탑 뷰포트만) |
| `summary.md` | 페이지 목록, 섹션 표, 토큰 빈도 표, 내비·CTA, 모션 힌트, 미디어 인벤토리를 모은 마크다운 |

**캡처 JSON 원본을 통째로 컨텍스트에 올리지 않는다.** `summary.md`와 `shots/`의 스크린샷만 Read한다. JSON은 스크립트가 읽고 요약을 만드는 중간 산물이다.

---

## 5. 요약 검증 절차 (스크린샷을 눈으로 본다)

1. `summary.md`를 Read해서 페이지·섹션 목록을 파악한다.
2. 페이지마다 `shots/`의 섹션 clip 스크린샷을 Read 도구로 열어 본다.
3. `summary.md`의 섹션 표에 스크립트가 붙인 역할 추정값(roleGuess)이 있어도 그것은 추정일 뿐이다. **최종 역할 판정은 스크린샷을 본 에이전트가 한다.** 고정 어휘(`analysis-blueprint.md` 참조)에서 고르고, roleGuess와 다르면 그대로 바꾼다.
4. P2 청사진 2절에 적을 역할·아키타입·콘텐츠 신호는 이 눈 검증을 거친 값만 쓴다.

---

## 6. 스크립트가 못 잡는 것: 수동 관찰

호버 상태, 스크롤 연출(패럴랙스, 스크롤 트리거 리빌), 캐러셀 자동 재생, 모달·드롭다운 같은 인터랙션은 정적 추출로 안 잡힌다.

1. 캡처 때 출력된 `spaceId`로 같은 TaskSpace를 재개한다(`--space <spaceId>`, 또는 ego-browser 스킬의 taskSpace 재개 방법을 직접 쓴다).
2. 관찰이 필요한 섹션으로 이동해 호버·스크롤·클릭을 실행하고 스크린샷으로 확인한다.
3. 관찰 결과는 다음 형식으로 메모해 P2 청사진 3절(모션 템포)과 2절(인터랙션 칸)에 옮긴다.

| 페이지 | 섹션 # | 트리거 | 관찰된 변화 | 템포(느낌) |
|---|---|---|---|---|
| Landing | 3 | 스크롤 진입 | 카드가 아래에서 페이드업 | 느림 |

4. 관찰이 끝나면 캡처와 같은 TaskSpace를 `finish`했는지 확인한다(8절 종료 확인).

---

## 7. 로그인 벽·쿠키 배너·권한 프롬프트

| 상황 | 대응 |
|---|---|
| 로그인 벽으로 대상 페이지에 못 들어감 | 자격 증명을 입력하지 않는다. `handOff()`로 사용자에게 넘기고, 로그인 후 재개할지 물은 뒤 멈춘다 |
| 쿠키 배너 | 눈에 보이는 "동의" 버튼만 클릭해 가리고 캡처를 계속한다. 배너 뒤 설정 화면까지 들어가지 않는다 |
| 브라우저 권한 프롬프트(위치, 알림 등) | ego-browser가 처리하지 못하는 브라우저 소유 프롬프트다. `handOff()`로 사용자에게 넘긴다 |

---

## 8. 실패 대응

| 증상 | 원인 | 조치 |
|---|---|---|
| `command -v ego-browser` 실패 | 미설치 | 설치 안내 후 멈춤, 또는 축소 모드 확인 |
| 설치했는데 명령을 못 찾음 | PATH 밖 설치 | `SITE_REMIX_EGO_BIN=<경로>`를 앞에 붙여 실행 |
| 스크립트가 시작 직후 끊김 | stdin 입력이 막힌 환경 | `SITE_REMIX_EGO_INPUT=arg`로 재실행 (`-e` 전달) |
| 섹션 clip이 전부 페이지 상단 | clip 좌표계 차이 | 전체 스크린샷으로 판정, 사용자에게 알림 |
| 스크립트가 빈 `sections` 반환 | 지연 로딩, 스크롤 패스 부족 | `--space`로 재개해 수동 스크롤 후 재추출 |
| 특정 페이지만 캡처 실패 | 범위 밖 리다이렉트, 404 | 해당 페이지를 범위에서 빼고 나머지로 진행, 사용자에게 알림 |
| 스크린샷은 있는데 `summary.md`에 안 뜸 | `--write` 누락 | `summarize-capture.mjs`를 `--write`로 재실행 |
| 로그인 벽 반복 | 대상 페이지가 인증 필요 | 7절 대응, 자격 증명 입력 금지 |
| `[ego-browser:notice]` 출력 | ego-lite 업데이트 있음 | 현재 작업을 finish하고 사용자에게 알린 뒤, 승인 시에만 업그레이드 |

끝나면 TaskSpace를 `finish({ keep: [] })`했는지 확인한다. `--keep-open`을 쓴 경우에만 생략한다.

---

## 9. 가드레일

- 캡처는 ego-browser로만 한다. Playwright, Chrome MCP 등 다른 브라우저 자동화를 쓰지 않는다.
- 로컬 결과물의 렌더 확인을 위해 스스로 브라우저를 열지 않는다. 사용자가 요청하면 그때 연다.
- 최대 8페이지, 범위 밖 링크를 따라가지 않는다.
- 캡처 원본(`reference/`)은 분석 자료다. 배포물에 포함하지 않는다.
- 미디어의 원본 `src` URL은 저장하지 않는다(역할·크기·비율·형식만). 텍스트는 제목 전문 + 섹션당 `textSample` 240자 이내.
- 원본의 소스 코드, 에셋 파일·에셋 URL(핫링크 포함), 카피 문장, 트래킹 스크립트는 가져오지 않는다.
