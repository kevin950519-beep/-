/**
 * 전시정보 (ExhibitionInfo). 02 3.1절 정의, 3.2절 식별자 `exhibitionInfo`.
 * 기간, 장소, 주소, 운영 시간, 문의는 받은 실제 정보다. 관람료만 임시 값이다 (appendix-placeholder-content.md 2.2절).
 */
export const exhibitionInfo = {
  title: '우연한 마중',
  tagline: '작가의 문장을 지나, 가지 끝에서 만나는 이야기.',
  /** 전시 상태 계산에 쓰는 기계가 읽는 기간. 'YYYY.MM.DD - YYYY.MM.DD' 형식을 지킨다 (getExhibitionStatus). 첫 화면에도 이 값이 보인다 */
  period: '2026.11.18 - 2026.11.23',
  /** 관람 안내 구간에 보이는 기간(요일 포함) */
  periodLabel: '2026.11.18(수) - 2026.11.23(월)',
  place: '인사아트갤러리 3층 G&J갤러리',
  address: '서울 종로구 인사동길 41-1',
  hours: '10:00 - 19:00',
  fee: '무료',
  contact: '010.4750.2886',
  mapUrl: 'https://map.naver.com/p/search/%EC%9D%B8%EC%82%AC%EC%95%84%ED%8A%B8%EA%B0%A4%EB%9F%AC%EB%A6%AC%20%EC%84%9C%EC%9A%B8%20%EC%A2%85%EB%A1%9C%EA%B5%AC%20%EC%9D%B8%EC%82%AC%EB%8F%99%EA%B8%B8%2041-1',
  isPlaceholder: true,
};
