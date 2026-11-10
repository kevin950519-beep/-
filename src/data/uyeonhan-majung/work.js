import clusterSrc from '../../assets/사과들-web.jpg';
import womanBackSrc from '../../assets/여인_뒤-web.jpg';
import mirrorSrc from '../../assets/거울사과-web.jpg';
import glowSrc from '../../assets/빛나는 화분-web.jpg';
import stackSrc from '../../assets/사과셋나무하나-web.jpg';

/**
 * 작품 (Work). 02 3.1절 정의, 3.2절 식별자 `work`.
 * 작품명, 재료, 크기, 연도는 모든 작품을 같은 값으로 통일했다(임시. 사과들은 크기 30x30x90(cm)로, 사과셋나무하나는 재료 resin, wood, 크기 30x30x90(cm)로, 거울사과와 빛나는 화분은 재료 wood, plaster, acrylic, 크기 60x60x80(cm)로 다르다. 화면에는 제목 "우연한 마중" 옆에 "2026 wood, plaster 70x70x140(cm)"가 한 줄로 나온다).
 * 실제 정보를 받으면 값을 바꾸고 isPlaceholder를 false로 한다.
 * placement: 'gallery'는 작품 구간에 한 장씩 쓴다. 히어로는 포스터를 쓰므로 content.landing.hero가 따로 가진다 (02 2.3절).
 * focus: 작품 구간은 3:2 칸을 cover로 채우므로 잘리는 사진에서 보여 줄 부분 (CSS object-position).
 * tone: 'dark'는 검은 배경 사진. 확대 카드도 검게 한다 (없으면 흰 카드).
 * aspectRatio: 원본 사진의 가로/세로 픽셀 비율. 확대 화면에서 전체를 보여 줄 때 쓴다.
 */
export const works = [
  {
    id: 'branches',
    placement: 'gallery',
    focus: '50% 90%',
    title: '우연한 마중',
    src: clusterSrc,
    alt: '흰 배경 위, 파스텔빛 사과 열 점에서 가지가 사방으로 뻗어 오른 설치 작품',
    aspectRatio: '2344/1575',
    material: 'wood, plaster',
    size: '30x30x90(cm)',
    year: '2026',
    isPlaceholder: true,
  },
  {
    id: 'woman-back',
    placement: 'gallery',
    focus: '50% 49%',
    title: '우연한 마중',
    src: womanBackSrc,
    alt: '흰 사과를 머리에 얹고 초록 가지가 뻗은 나무 여인 조각의 뒷모습',
    aspectRatio: '1534/2297',
    material: 'wood, plaster',
    size: '70x70x140(cm)',
    year: '2026',
    isPlaceholder: true,
  },
  {
    id: 'mirror',
    placement: 'gallery',
    focus: '50% 78%',
    tone: 'dark',
    title: '우연한 마중',
    src: mirrorSrc,
    alt: '어두운 바닥의 둥근 거울 세 장 위에 흰 사과와 색 입힌 가지가 놓이고 반사되는 모습',
    aspectRatio: '1571/2363',
    material: 'wood, plaster, acrylic',
    size: '60x60x80(cm)',
    year: '2026',
    isPlaceholder: true,
  },
  {
    id: 'glow',
    placement: 'gallery',
    focus: '50% 88%',
    tone: 'dark',
    title: '우연한 마중',
    src: glowSrc,
    alt: '초록, 주황, 파랑 불빛이 켜진 유리 화분 세 개에서 가지가 뻗은 어두운 장면',
    aspectRatio: '1501/1956',
    material: 'wood, plaster, acrylic',
    size: '60x60x80(cm)',
    year: '2026',
    isPlaceholder: true,
  },
  {
    id: 'stack',
    placement: 'gallery',
    focus: '50% 78%',
    title: '우연한 마중',
    src: stackSrc,
    alt: '초록, 흰, 진초록 사과 세 개가 겹겹이 쌓인 나무 토막 위에서 초록 가지 하나가 길게 뻗은 작품',
    aspectRatio: '1470/2054',
    material: 'resin, wood',
    size: '30x30x90(cm)',
    year: '2026',
    isPlaceholder: true,
  },
];

export const workById = Object.fromEntries(works.map((work) => [work.id, work]));
