# Prompt output contract

## Purpose

Claude의 commercial-photo-prompting 산출물을 이미지 실행 주체가 바로 사용할 수 있는 self-contained handoff로 만든다. 이 계약은 이미지 생성이나 편집 실행을 허용하지 않는다.

## 단일 프롬프트 패키지

다음 구조를 사용한다.

```markdown
# [Asset ID] — [role]

## Intent
- Destination:
- Web UI role:
- Information goal:
- Aspect / responsive crop:
- Reference inputs:

## Decision package
- Authoritative face or feature:
- Viewpoint:
- Distance and occupancy:
- Copy / crop / grid constraints:
- Light and color:
- Material and contact behavior:
- Allowed variation:

## Generation prompt
[독립 실행 가능한 전체 prompt]

## Negative constraints
- [금지할 구조, 텍스트, claim, 합성 오류]
- [CGI-like causal cue]
- [제품·브랜드 invariant 위반]

## Continuity lock
- [다른 frame에서도 유지할 identity, geometry, capture, light, grade, baseline]

## QA checklist
- [ ] authoritative face와 feature가 맞다
- [ ] silhouette, construction, proportions, materials, color placement가 유지된다
- [ ] perspective, scale, contact, shadows, reflections가 물리적으로 일관된다
- [ ] copy-safe/crop/occupancy 규칙을 만족한다
- [ ] 생성된 텍스트나 검증되지 않은 claim이 없다

## Handoff status
- Status: `ready_for_generation`
- Expected output path:
- Asset registry status: `pending_generation`
```

## Series package

Master direction 뒤에 global continuity lock을 한 번 요약하고, 각 frame에 위 단일 패키지를 반복한다. 각 prompt는 대화 기억 없이도 실행 가능해야 하므로 핵심 lock을 prompt 본문에도 반복한다.

제품 angle sequence는 기본적으로 front, three-quarter, strict side-profile, rear를 별도 asset으로 작성한다. contact sheet는 사용자가 명시적으로 요청했을 때만 별도 concept asset으로 둔다.

## Negative constraints의 이중 표현

Target system이 negative prompt field를 지원하는지 확실하지 않으므로:

- 핵심 avoid 조건은 generation prompt의 `Constraints`에도 자연어로 포함한다.
- 검수와 API mapping을 위해 같은 내용을 `Negative constraints` 목록으로도 분리한다.
- 지원 여부를 모르는 모델 전용 parameter나 syntax를 만들지 않는다.

## Pending asset handoff JSON

Stage 3 registry에 연결할 때 다음 의미를 보존한다.

```json
{
  "asset_id": "product-hero-01",
  "product_name": "Approved product name",
  "role": "hero",
  "file_path": "",
  "prompt_path": "prompts/product-hero-01.md",
  "prompt_provenance": "claude_prompt_only",
  "generation_provenance": "not_generated_by_claude",
  "communication_job": "",
  "reference_lineage": [],
  "allowed_variation": "viewpoint only",
  "invariants": [],
  "invariant_check": "pending_asset_qa",
  "status": "pending_generation"
}
```

`file_path`가 비어 있는 것은 정상이다. 실제 실행 주체가 이미지를 생성하고 QA를 통과한 뒤에만 파일 경로, generation provenance, `invariant_check: pass`, `status: registered`로 갱신한다.

## 금지 상태

Claude prompt-only 단계에서는 다음을 사용하지 않는다.

- `generated`
- `generation_complete`
- `invariant_check: pass`
- 존재하지 않는 image file path
- 호출하지 않은 모델, API, 도구의 provenance
