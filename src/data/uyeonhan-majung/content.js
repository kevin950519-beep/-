import posterSrc from '../../assets/poster-main-web.jpg';
import posterAltOneSrc from '../../assets/poster-01-web.jpg';
import posterAltTwoSrc from '../../assets/poster-02-web.jpg';

const posterAlt = '우연한 마중, 임미라 개인전 포스터. 흰 바닥 위 파스텔빛 사과 열 점에서 색칠한 가지가 뻗어 오른 사진 위에 전시 제목과 장소, 기간이 놓여 있다';

/**
 * 화면 카피. 페이지 > 섹션 키 구조 (module-layers.md 2절).
 * 구간 문구는 임시다 (appendix-placeholder-content.md 4.2절).
 */
export const content = {
  landing: {
    nav: {
      items: [
        { id: 'works', label: '작품', sectionIds: ['works', 'artist-statement', 'artist'] },
        { id: 'visit-guide', label: '관람 안내', sectionIds: ['visit-guide'] },
      ],
    },
    shell: {
      shareLabel: '링크 공유',
      mapLabel: '길찾기',
      instagramLabel: '작가 인스타그램',
      copiedMessage: '링크를 복사했습니다.',
      drawerContactLabel: '문의',
      /** 왼쪽 가장자리 전시 상태 상자의 윗줄(title)과 아랫줄(caption). {d}는 개막까지 남은 날 수, {n}은 개막부터 몇 일째인지 */
      status: {
        before: { title: 'D-{d}', caption: '전시 준비 중' },
        during: { title: '{n}일째', caption: '전시 중' },
        last: { title: '마지막 날', caption: '전시 중' },
        after: { title: '종료', caption: '전시가 끝났습니다' },
      },
      statusGoLabel: '관람 안내로 이동',
      statusHideHint: '위아래로 밀거나 위, 아래 방향키를 누르면 위치를 옮길 수 있고, 꾹 누른 뒤 아래에 나타나는 X로 끌어다 놓거나 Delete 키를 누르면 상단 왼쪽으로 옮길 수 있습니다.',
      statusUndockLabel: '화면 옆으로 다시 띄우기',
      statusTargetId: 'visit-guide',
    },
    footer: {
      notice: '이 사이트의 작품 이미지와 글은 작가의 저작물이며, 무단 사용과 복제를 금합니다.',
    },
    works: {
      title: '전시 작품',
    },
    hero: {
      posterSrc,
      posters: [
        { src: posterSrc, alt: posterAlt },
        { src: posterAltOneSrc, alt: '우연한 마중, 임미라 개인전 포스터 시안 1' },
        { src: posterAltTwoSrc, alt: '우연한 마중, 임미라 개인전 포스터 시안 2' },
      ],
      posterAlt,
    },
    storyGate: {
      title: '우연한 마중',
      subtitle: '임미라 개인전',
      enterLabel: '잠시 후 전시로 들어갑니다',
      enterAriaLabel: '시작 화면을 닫고 전시 소개로 들어가기',
    },
    visitGuide: {
      phrase: '작가 프로필',
      soloTitle: 'Solo exhibition',
      groupTitle: 'Group exhibition',
      infoTitle: '관람 안내',
      mapLabel: '길찾기',
      shareLabel: '링크 공유',
      copiedMessage: '링크를 복사했습니다.',
      pendingLabel: '곧 알려드립니다',
      infoLabels: {
        period: '기간',
        place: '장소',
        address: '주소',
        hours: '운영 시간',
        fee: '관람료',
        contact: '문의',
      },
    },
    lightbox: {
      openLabel: '작품 확대',
      backLabel: '작품 목록으로',
      closeLabel: '닫기',
      prevLabel: '이전 작품',
      nextLabel: '다음 작품',
    },
  },
};
