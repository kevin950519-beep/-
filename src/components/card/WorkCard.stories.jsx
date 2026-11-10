import { WorkCard } from './WorkCard';
import glowSrc from '../../assets/빛나는 화분.png';

export default {
  title: 'Component/3. Card/WorkCard',
  component: WorkCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '작품 한 점을 카드에 담는다. 데스크톱과 모바일 모두 왼쪽 사진, 오른쪽 작품 정보이고(모바일은 정보 영역과 글자를 줄여서) 사진 둘레 여백은 10px이다. 사진은 자르지 않는다. 작품 팝업(WorkLightbox)의 내용으로 쓴다.',
      },
    },
  },
  argTypes: {
    work: { control: 'object', description: '작품 { title, src, alt, material, size, year }' },
    titleId: { control: 'text', description: '작품명 요소 id (팝업 aria-labelledby 연결용)' },
  },
};

const sampleWork = {
  title: '샘플 작품',
  aspectRatio: '1501/1956',
  src: glowSrc,
  alt: '불빛이 켜진 유리 화분에서 가지가 뻗은 장면',
  material: '유리, 가지, LED',
  size: '',
  year: '0000',
};

export const Default = { args: { work: sampleWork } };

export const Landscape = {
  args: { work: { ...sampleWork, aspectRatio: '2344/1575' } },
};
