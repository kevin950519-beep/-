/**
 * prompt-template.md 원문에서 헤딩 아래 첫 코드 블록의 줄들을 꺼낸다. 문서를 복사하지 않고 raw import 를 자른다.
 *
 * @param {string} raw - prompt-template.md 원문
 * @param {string} heading - 찾을 헤딩 (예: '## Sample Template')
 * @returns {string[]} 코드 블록의 비어 있지 않은 줄
 */
export function extractBlock(raw, heading) {
  const start = raw.indexOf(heading);
  if (start < 0) return [];
  const open = raw.indexOf('```', start);
  const close = raw.indexOf('```', open + 3);
  if (open < 0 || close < 0) return [];
  return raw.slice(open + 3, close).split('\n').map((line) => line.trim()).filter(Boolean);
}

/**
 * 원문 줄에 블록 규칙을 맞춘다. 규칙이 없는 줄은 원문 앞 40자를 라벨로 쓴다.
 *
 * @param {string[]} lines - extractBlock 이 꺼낸 코드 블록 줄
 * @param {object[]} rules - { test: RegExp, label, slot?, from, tokenLabel? } 목록
 * @returns {object[]} TemplateStack 의 blocks prop
 */
export function toBlocks(lines, rules) {
  return lines.map((line) => {
    const rule = rules.find((r) => r.test.test(line));
    return rule ? { ...rule, line } : { label: line.slice(0, 40), from: '', line };
  });
}
