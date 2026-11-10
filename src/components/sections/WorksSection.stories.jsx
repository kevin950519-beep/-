import { WorksSection } from './WorksSection';

export default {
  title: 'Section/Landing/Works',
  component: WorksSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '02 2.2절 "작품": 가운데 정렬 전시 작품 타이틀(굵은 고딕) 아래에 작품 사진을 여백 없이 3:2 칸에 꽉 채워 한 줄에 한 장씩 이어 붙이고, 사진을 누르면 잘리지 않은 전체와 작품 정보가 확대 화면에 열리는 구간. 콘텐츠는 `src/data/uyeonhan-majung/`에서 읽는다.',
      },
    },
  },
  argTypes: {
    id: { control: 'text', description: '앵커 id' },
  },
};

export const Docs = {};
