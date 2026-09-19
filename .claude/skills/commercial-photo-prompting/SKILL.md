---
name: commercial-photo-prompting
description: ALWAYS use this skill when Claude must plan, compile, diagnose, or refine realistic commercial or cinematic photography prompts, especially for web hero, PDP, feature, detail, grid, scale, gallery, or product-series imagery. It returns generation-ready prompt packs, negative constraints, continuity locks, and observable QA checklists only. It never calls an image model, image API, generation tool, or editing tool and never claims that an image was generated.
when_to_use: Use for commercial photo prompt requests, product render prompt packs, image-series continuity, copy-safe web composition, shot planning, anti-CGI prompt repair, or pending image-asset handoff. Do not use it to execute image generation.
user-invocable: true
---

# Commercial Photo Prompting

시각적 의도를 물리적으로 일관된 촬영 결정과 generation-ready prompt package로 바꾼다. 브랜드 전략을 새로 만들지 않고, 어떤 이미지 모델이나 생성 도구도 직접 실행하지 않는다.

## 절대 경계

- 이미지 모델, API, MCP, CLI, 생성·편집 도구를 호출하지 않는다.
- 로컬 이미지 파일을 생성하거나 결과물을 생성했다고 보고하지 않는다.
- 모델이나 API의 최신 파라미터를 추측하지 않는다.
- 산출물은 prompt/spec, negative constraints, continuity lock, QA checklist, pending asset handoff로 끝낸다.
- 이미지 실행을 요청받아도 Claude의 현재 역할에서는 prompt pack을 완성하고 실행 주체에게 넘긴다고 명시한다.

## 모드 선택

- **Plan**: shot direction, 역할, 촬영 접근, 시리즈 시스템과 tradeoff를 정리한다.
- **Compile**: 승인된 brief를 독립 실행 가능한 prompt pack으로 바꾼다.
- **Diagnose**: 기존 prompt나 사용자가 설명한 실패의 원인을 좁히고 다음 prompt를 작성한다.
- **Series**: master direction을 고정하고 여러 frame의 prompt와 continuity checklist를 만든다.

구체적인 prompt 요청이면 Compile, 탐색적 요청이면 Plan을 기본값으로 한다. 산출물이 materially 달라질 때만 가장 작은 blocking question을 묻는다.

## 입력에서 추출할 것

- asset purpose와 destination
- web UI role 또는 명시적인 non-web destination
- subject, action, environment
- aspect ratio나 output shape
- brand/product/identity/copy/geometry invariants
- reference image의 역할과 순서
- 요청 operation: new prompt, edit prompt, series prompt, diagnosis
- 관찰 가능한 success criteria

제품만 보고 브랜드 archetype, audience, campaign claim, cultural cue를 발명하지 않는다. 방향이 부족해도 안전하게 진행할 수 있으면 절제된 production default를 쓰고 default임을 표시한다.

## 점진적으로 읽을 리소스

1. Web 또는 destination이 생략된 작업은 `resources/web-editorial-composition.md`를 읽고 UI role을 먼저 정한다.
2. 촬영·광학·빛·재질·물리 일관성 결정이 필요할 때 `resources/commercial-photographic-taxonomy.md`의 제목을 먼저 검색하고 필요한 section만 읽는다.
3. 최종 출력 전에 `resources/prompt-output-contract.md`를 읽고 prompt pack 형식을 지킨다.

택소노미의 semantic bundle은 프롬프트 keyword가 아니라 결정 recipe다. bundle을 observable composition, light, material, contact, perspective 지시로 풀어 쓴다. `confirmed`를 우선하고 `probable`은 필요한 경우에만 사용한다. `pending`을 검증된 사실처럼 표현하지 않는다.

## 결정 순서

Web-first 작업은 다음 순서로 결정한다.

1. UI role: hero, PDP primary, feature explainer, detail proof, collection grid, scale in context, gallery/angle sequence
2. 전달할 정보
3. authoritative face 또는 feature
4. viewpoint
5. distance, occupancy, crop
6. copy-safe, responsive crop, grid/gallery constraint
7. optics, light, color, material, contact, physical QA

Non-web 작업은 목적과 scene에서 시작한다. 어느 경우든 mood가 아니라 정보 요구가 angle과 distance를 결정해야 한다.

## 물리 충돌 해결

- 원근, 거리, format cue, depth behavior를 함께 맞춘다.
- motion과 exposure cue가 충돌하지 않게 한다.
- 광원, 그림자, 반사, 배경광의 방향을 일치시킨다.
- 금속, 유리, 물, 피부, 섬유 등 재질별로 필요한 highlight와 texture behavior를 쓴다.
- realism이 필요하면 접촉, 두께, 자연스러운 비대칭, restrained variation을 positive evidence로 넣는다.
- 사용자 고정 조건 두 개가 동시에 불가능하면 tradeoff를 제시하고 우선순위만 묻는다.

## Prompt 작성

새 이미지 prompt는 다음 순서로 작성한다.

```text
Purpose / web UI role and information goal
Scene and background
Subject and action
Product identity and key physical details
Viewpoint, distance, occupancy, copy/crop behavior
Lighting, color, material and contact behavior
Constraints, invariants and avoid conditions
```

Edit prompt는 각 reference를 `Image 1`, `Image 2`처럼 순서와 역할로 선언한다. 바꿀 한 가지, 가져올 source, destination 관계, 보존 조건, perspective/scale/focus/light/shadow/color match를 쓴다. 매 revision에서 preserve list를 반복한다.

Series는 product identity, silhouette, construction, dimensions, materials, color placement, camera height, lens family, light, grade, retouching, baseline, occupancy, background, copy-safe behavior를 lock한다. frame마다 하나의 variation axis만 허용하고 critical lock을 각 prompt 안에 반복한다.

## Diagnose

다음 순서로 짧게 출력한다.

1. Cause
2. Conflict repair
3. Web role fit
4. Active decision package
5. Next prompt
6. Observable checks

`no CGI`만 추가하지 않는다. 실제 접촉 그림자, 비대칭 highlight gradient, 재질 두께, 자연스러운 표면 편차 같은 positive physical evidence를 넣고 uniform gloss, cloned symmetry, ray-traced reflection, 과도한 clarity/HDR 같은 원인을 제거한다.

## 출력

`resources/prompt-output-contract.md`의 형식을 사용한다. 사용자가 prompt-only를 요청했으면 필요한 판단은 내부적으로 수행하고 최종 prompt pack만 출력한다. 모든 경우 마지막 상태는 `ready_for_generation` 또는 `blocked`이며, `generated`를 사용하지 않는다.
