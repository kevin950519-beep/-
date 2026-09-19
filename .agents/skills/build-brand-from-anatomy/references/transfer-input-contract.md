# Transfer input contract

The intake exists only to obtain enough information to write a useful direction report. It is not a workshop or a second report.

## Narrow sequentially

Start by restating the known direction in plain language: product and lineup, user and situation, source quality to learn from, source expression to avoid, visual priority, and the default token relationship. Do not turn this restatement into a confirmation gate when it contains no material ambiguity.

Ask only when an answer would change positioning, lineup, product form or cognitive structure, imagery, token relationships, or the landing goal. Skip every answered item. Ask one question, wait for the answer, update the working direction, and only then decide whether a second question is necessary. Use at most three questions and one contradiction follow-up. Never show the whole questionnaire at once.

Use this CLI format when a structured question tool is unavailable:

```text
[1/3 · 제품군]
현재 이해: 작업용 테이블 램프와 플로어 램프를 하나의 제품군으로 구성합니다.

질문: 대표 제품은 테이블 램프로 잡아도 될까요?
1. 테이블 램프 (권장)
2. 플로어 램프
3. 직접 입력

답변: 번호 또는 짧은 문장
```

- Show one question only and stop for the answer.
- Put the recommended default first and explain its practical effect in one sentence when useful.
- Always accept a short free-form answer.
- Do not expose `keep`, `tune`, or `new` as required jargon. Ask whether to retain the source impression, retain only its operating principle, or make the expression new, then translate that answer internally.
- If the user's request already supplies a safe answer, record it without asking.

Useful question order, only when missing:

1. **Product and lineup:** what is being made, which product leads, and whether the concept is a single product, a focused 2–3 product family, or an exploratory 3–6 product family?
2. **User and situation:** who uses it, where, and for what immediate outcome?
3. **Source distance:** what source quality should remain, and what recognizable expression should not transfer?
4. **Visual priority:** should the first impression explain form, use, state, or atmosphere?
5. **Token or landing exception:** state the proposed default and ask only which area must differ.

After the last needed answer, write one compact normalized summary and proceed. Ask a follow-up only for a contradiction that materially changes the result; do not request a second confirmation of clear answers.

## Record

Save the answers and any harmless assumptions in `transfer-input.json`. Use `ready` when the information is sufficient. Do not require a second confirmation when the user's answers are clear.

Required input areas:

- source brand and source-analysis folder;
- target category and physical/digital/hybrid mode;
- intended product lineup when one or more products are named;
- lineup mode: `single_product`, `focused_family`, or `exploratory_family`;
- audience and representative use situation;
- desired outcome or benefit;
- source qualities to apply;
- source traits to avoid;
- known product facts or a clearly labeled open concept;
- design-token preference;
- visual priority and landing goal when they materially affect the output;
- narrative preference when the user or persona has one;
- original user wording.

The report must not end with intake questions. If a materially different direction is requested later, update the input and regenerate the report.
