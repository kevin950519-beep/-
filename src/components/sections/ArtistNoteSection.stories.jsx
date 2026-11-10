import { ArtistNoteSection } from './ArtistNoteSection';

export default {
  title: 'Section/Landing/ArtistNote',
  component: ArtistNoteSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '히어로와 작품 사이의 작가 노트 구간. 세 줄을 얇은 고딕체(ExtraLight)로 크게 보여 준다. 콘텐츠는 `src/data/uyeonhan-majung/artistNote.js`에서 읽는다.',
      },
    },
  },
  argTypes: {
    id: { control: 'text', description: '앵커 id' },
  },
};

export const Docs = {};
