/**
 * 전시 상태 계산
 *
 * 기간 문자열('2026.11.18 - 2026.11.23')과 오늘 날짜로 전시 전, 중, 마지막 날, 종료를 가른다.
 * 날짜는 시각을 버리고 날(일) 단위로만 비교한다.
 *
 * @param {string} period - 'YYYY.MM.DD - YYYY.MM.DD' 형식의 기간 [Required]
 * @param {Date} now - 기준 시각 [Optional, 기본값: 지금]
 * @returns {{ phase: 'before' | 'during' | 'last' | 'after', daysUntil: number, dayCount: number }}
 *   daysUntil은 개막까지 남은 날 수(전시 전에만 0보다 큼), dayCount는 개막일을 1일째로 센 오늘의 순번(기간 중과 마지막 날에만 0보다 큼)
 *
 * Example usage:
 * getExhibitionStatus('2026.11.18 - 2026.11.23', new Date(2026, 10, 8));
 */
const DAY_MS = 24 * 60 * 60 * 1000;

const toDay = (text) => {
  const [year, month, day] = text.trim().split('.').map(Number);
  return new Date(year, month - 1, day);
};

export function getExhibitionStatus(period, now = new Date()) {
  const [startText, endText] = period.split('-');
  const start = toDay(startText);
  const end = toDay(endText);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (today < start) {
    return { phase: 'before', daysUntil: Math.round((start - today) / DAY_MS), dayCount: 0 };
  }
  if (today > end) return { phase: 'after', daysUntil: 0, dayCount: 0 };
  const dayCount = Math.round((today - start) / DAY_MS) + 1;
  if (today.getTime() === end.getTime()) return { phase: 'last', daysUntil: 0, dayCount };
  return { phase: 'during', daysUntil: 0, dayCount };
}

export default getExhibitionStatus;
