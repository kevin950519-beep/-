import portraitSrc from '../../assets/엄마 사진2-web.jpg';

/**
 * 아티스트 (Artist). 02 3.1절 정의, 3.2절 식별자 `artist`.
 * 작가에게 받은 실제 약력이다. 화면 라벨은 "작가" 대신 "아티스트"를 쓴다.
 */
export const artist = {
  name: '임미라',
  portrait: { src: portraitSrc, alt: '작가 임미라 프로필 사진', width: 1084, height: 1451 },
  education: [
    /** "조소과"와 "동 대학원" 사이는 두 칸 띄운다. 화면에서 연속 공백이 한 칸으로 줄지 않게 둘째 칸은 줄바꿈 없는 공백(U+00A0)이다 */
    '성신여자대학교 조소과 \u00A0동 대학원 조소과 졸업',
  ],
  membership: '[현] 성신조각회, 한국여류조각가협회 회원',
  soloExhibitions: [
    '2026 4회 개인전 G&J갤러리',
    '2021 3회 개인전 아트스페이스 퀄리아',
    '2001 2회 개인전 토탈미술관',
    '1993 1회 개인전 갤러리 도올',
  ],
  groupExhibitions: [
    '2026 아시아미술협회전',
    '2026 한국여류작가회전',
    '2024 - 2022 NAH 국제아트페스티벌',
    '2024 - 1991 성신조각회전',
    '1998 - 1994 한국현대조형작가회전',
    '1991 - 2026 단체전 50회',
  ],
  instagram: { url: 'https://www.instagram.com/im.mira_works/', handle: '@im.mira_works' },
  isPlaceholder: false,
};
