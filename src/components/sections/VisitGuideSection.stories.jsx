import { VisitGuideSection } from './VisitGuideSection';

export default {
  title: 'Section/Landing/VisitGuide',
  component: VisitGuideSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '관람 안내: 얇은 고딕 제목 아래 전시 정보, 길찾기, 링크 공유 구간. 콘텐츠는 `src/data/uyeonhan-majung/`에서 읽는다.',
      },
    },
  },
  argTypes: {
    id: { control: 'text', description: '앵커 id' },
  },
};

export const Docs = {};
