import { getExhibitionStatus } from './getExhibitionStatus';

/**
 * 전시 상태 문구 만들기
 *
 * 전시 상태(전시 전, 기간 중, 마지막 날, 종료)에 맞는 윗줄·아랫줄 문구를 만든다.
 * 문구 틀의 {d}는 개막까지 남은 날 수, {n}은 개막부터 몇 일째인지로 바꾼다.
 * 왼쪽 상태 상자와 헤더의 상태 칩이 같은 문구를 쓰도록 한곳에서 만든다.
 *
 * @param {object} statusCopy - 단계별 문구 틀 { before, during, last, after } 각 { title, caption } [Required]
 * @param {string} period - 'YYYY.MM.DD - YYYY.MM.DD' 형식의 기간 [Required]
 * @param {Date} now - 기준 시각 [Optional, 기본값: 지금]
 * @returns {{ title: string, caption: string }}
 *
 * Example usage:
 * const { title, caption } = getStatusText(shell.status, exhibitionInfo.period);
 */
export function getStatusText(statusCopy, period, now) {
  const { phase, daysUntil, dayCount } = getExhibitionStatus(period, now);
  const fill = (template) => template.replace('{d}', daysUntil).replace('{n}', dayCount);
  return { title: fill(statusCopy[phase].title), caption: fill(statusCopy[phase].caption) };
}

export default getStatusText;
