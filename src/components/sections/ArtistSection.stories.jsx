import { ArtistSection } from './ArtistSection';

export default {
  title: 'Section/Landing/Artist',
  component: ArtistSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '02 2.2절 "작가 소개": 얇은 고딕 제목 아래 아티스트 이름, 학력, 소속, 전시 이력 구간. 콘텐츠는 `src/data/uyeonhan-majung/`에서 읽는다.',
      },
    },
  },
  argTypes: {
    id: { control: 'text', description: '앵커 id' },
  },
};

export const Docs = {};
