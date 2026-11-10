import Box from '@mui/material/Box';
import BranchSilhouette from './BranchSilhouette';
import branch from '../../assets/silhouette/branch-only.png';

export default {
  title: 'Component/4. Media/BranchSilhouette',
  component: BranchSilhouette,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '작품(여인상과 가지 등)의 윤곽을 단색으로 보여 주는 실루엣. 색은 theme 토큰, 모양은 알파 채널 PNG다. 블러와 낮은 투명도로 안개 속에 어렴풋이 보이게 쓴다. 처음에는 안개에서 떠오르듯 선명해지고, isSwaying을 켜면 한 번 일렁이며, isFading을 켜면 늦게 옅어진다. 동작 줄이기 설정에서는 정지한다.',
      },
    },
  },
  argTypes: {
    src: { control: false, description: '윤곽이 담긴 알파 채널 이미지 주소' },
    aspectRatio: { control: { type: 'number', step: 0.01 }, description: '이미지 가로/세로 비율' },
    color: { control: 'text', description: '실루엣 색 (theme 색 토큰 경로)' },
    opacity: { control: { type: 'range', min: 0.1, max: 1, step: 0.05 }, description: '실루엣 투명도' },
    blur: { control: { type: 'range', min: 0, max: 30, step: 1 }, description: '가장자리 흐림 (px), 클수록 멀리 있는 안개처럼 보임' },
    isRevealed: { control: 'boolean', description: '안개에서 떠오르듯 나타나는 동작 사용' },
    revealDelay: { control: { type: 'number', step: 100 }, description: '드러남 시작 지연 (ms)' },
    revealDuration: { control: { type: 'number', step: 100 }, description: '드러남 시간 (ms)' },
    isSwaying: { control: 'boolean', description: '켜면 한 번 일렁인다' },
    swayAngle: { control: { type: 'range', min: 0, max: 8, step: 0.5 }, description: '일렁임 각도 (deg)' },
    swayOrigin: { control: 'text', description: '일렁임 회전 중심 (CSS transform-origin)' },
    swayDuration: { control: { type: 'number', step: 100 }, description: '일렁임 시간 (ms)' },
    isFading: { control: 'boolean', description: '켜면 옅어진다' },
    fadeDelay: { control: { type: 'number', step: 100 }, description: '옅어짐 시작 지연 (ms)' },
    fadeDuration: { control: { type: 'number', step: 100 }, description: '옅어짐 시간 (ms)' },
    label: { control: 'text', description: '스크린리더용 설명 (비우면 장식으로 숨김)' },
    sx: { control: false, description: '추가 스타일 (높이를 정하면 폭은 비율로 따라옴)' },
  },
};

export const Docs = {
  args: {
    src: branch,
    aspectRatio: 518 / 475,
    color: 'text.primary',
    opacity: 0.3,
    blur: 6,
    isRevealed: true,
    revealDelay: 0,
    revealDuration: 2400,
    isSwaying: false,
    swayAngle: 2.5,
    swayOrigin: '65% 95%',
    swayDuration: 500,
    isFading: false,
    fadeDelay: 0,
    fadeDuration: 600,
  },
  render: (args) => (
    <Box sx={ { display: 'flex', justifyContent: 'center', height: '100vh', py: 4, backgroundColor: 'background.default' } }>
      <BranchSilhouette { ...args } sx={ { height: '100%' } } />
    </Box>
  ),
};
