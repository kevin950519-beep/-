import { FooterSection } from './FooterSection';

export default {
  title: 'Section/Landing/Footer',
  component: FooterSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '02 2.2절 "푸터". 작가 표기, 작품 이미지 무단 사용 금지 안내를 얇은 선 아래 캡션 크기로 둔다. 콘텐츠는 `src/data/uyeonhan-majung/`에서 읽는다.',
      },
    },
  },
  argTypes: {
    id: { control: 'text', description: '앵커 id' },
  },
};

export const Docs = {};
