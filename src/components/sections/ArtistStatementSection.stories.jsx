import { ArtistStatementSection } from './ArtistStatementSection';

export default {
  title: 'Section/Landing/ArtistStatement',
  component: ArtistStatementSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '02 2.2절 "작가의 글": 작품 구간과 작가 소개 사이에서 작가가 전시에 붙인 글 전문을 읽는 구간. 가운데에 제목, 그 아래 본문을 읽기 편한 폭에서 왼쪽 정렬로 놓고, 문단 사이 간격은 모두 같다. 모바일에서는 제목 폭에 본문을 맞추고, 웹과 모바일 모두 끝에 "- 작가노트 -"가 붙는다. 콘텐츠는 `src/data/uyeonhan-majung/`에서 읽는다.',
      },
    },
  },
  argTypes: {
    id: { control: 'text', description: '앵커 id' },
  },
};

export const Docs = {};
