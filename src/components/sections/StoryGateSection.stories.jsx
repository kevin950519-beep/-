import { StoryGateSection } from './StoryGateSection';

export default {
  title: 'Section/Landing/StoryGate',
  component: StoryGateSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '전시 제목, 부제 아래에 전시 기간과 장소도 보여 준다. 02 2.2절 "이야기의 문": 제목과 부제는 위, 거대한 나뭇가지 실루엣이 안개 속에 비치고, 기간과 장소는 아래에 가운데 정렬로 놓이는 첫 화면. 글자가 나타난 뒤 약 2초가 지나면 저절로, 터치(클릭, Enter, Space)하면 바로 안개가 걷히며(약 1초) 닫힌다. 하단의 원이 한 바퀴 그려지는 것이 진행 표시다. 걷힘이 끝나면 onEnter를 부른다. 콘텐츠는 `src/data/uyeonhan-majung/`에서 읽는다.',
      },
    },
  },
  argTypes: {
    isOpen: { control: 'boolean', description: '열림 여부' },
    onEnter: { action: 'entered', description: '걷힘 연출이 끝났을 때 호출' },
    autoEnterDelay: { control: 'number', description: '글자가 나타난 뒤 자동으로 닫히기까지(ms). 0이면 끔' },
    id: { control: 'text', description: '앵커 id' },
  },
};

export const Docs = { args: { isOpen: true } };
