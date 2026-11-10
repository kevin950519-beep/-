import { HeroSection } from './HeroSection';

export default {
  title: 'Section/Landing/Hero',
  component: HeroSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '02 2.2절 "히어로": 전시 포스터 3종(제목·장소·기간 포함)을 원본 비율 그대로, 자르지 않고 가로 폭에 맞춰 보여 주는 구간. 화살표, 점, 스와이프로 넘기고 끝에서 처음으로 이어진다. 콘텐츠는 `src/data/uyeonhan-majung/`에서 읽는다.',
      },
    },
  },
  argTypes: {
    id: { control: 'text', description: '앵커 id' },
  },
};

export const Docs = {};
