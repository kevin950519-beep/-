import WorkDetailView from './WorkDetailView';
import glowSrc from '../../assets/빛나는 화분.png';
import womanSrc from '../../assets/여인_뒤.png';

export default {
  title: 'Custom Component/2. Overlay Feedback/WorkDetailView',
  component: WorkDetailView,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '작품 한 점을 화면 전체를 쓰는 개별 페이지로 보여 준다. 모바일에서 팝업 대신 쓰며, 위에서 아래로만 읽는 배치로, 맨 위 사진(가로 폭 가득), 그 아래 작품 정보(WorkCard의 stack 배치)다. 위쪽 고정 막대에 뒤로 가기 버튼 하나만 있다. 단일 페이지라 기본은 넘기지 않고, onPrev·onNext를 줄 때만 이전·다음 버튼이 생긴다. 검은 배경 사진(tone: dark)이면 페이지도 검게 한다.',
      },
    },
  },
  argTypes: {
    work: { control: 'object', description: '작품 { tone, title, src, alt, aspectRatio, material, size, year }' },
    onClose: { action: 'closed', description: '돌아가기 핸들러' },
    onPrev: { action: 'prev', description: '이전 작품 핸들러 (주면 이전 버튼 활성)' },
    onNext: { action: 'next', description: '다음 작품 핸들러 (주면 다음 버튼 활성)' },
    backLabel: { control: 'text', description: '돌아가기 버튼 접근성 레이블' },
  },
};

export const Dark = {
  args: {
    work: {
      id: 'glow',
      tone: 'dark',
      title: '샘플 작품',
      aspectRatio: '1501/1956',
      src: glowSrc,
      alt: '불빛이 켜진 유리 화분에서 가지가 뻗은 장면',
      material: '유리, 가지, LED',
      size: '가변 설치',
      year: '0000',
    },
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export const Light = {
  args: {
    work: {
      id: 'woman-back',
      title: '샘플 작품',
      aspectRatio: '1534/2297',
      src: womanSrc,
      alt: '나무 여인 조각의 뒷모습',
      material: '나무, 도자, 가지',
      size: '00 x 00 x 00 cm',
      year: '0000',
    },
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
