import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FlowingColorField from './FlowingColorField';


export default {
  title: 'Interactive/15. DynamicColor/FlowingColorField',
  component: FlowingColorField,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '부모를 가득 채우는 몽환적인 흰 안개 배경. 옅은 바탕 위에 큰 흰 덩어리가 블러로 겹쳐 구름처럼 천천히 떠다니고, 가로로 길게 이어진 색 띠(flow)가 안개 위에 아주 옅게 얹힌다. 동작 줄이기 설정에서는 정지한다. isParting을 켜면 덩어리가 중심에서 바깥으로 밀려 나가며 안개가 걷힌다.',
      },
    },
  },
  argTypes: {
    baseColor: { control: 'color', description: '바탕색' },
    cloudColor: { control: 'color', description: '안개 덩어리 색' },
    tintColors: { control: 'object', description: '가장자리에 스치는 색 빛 목록 (hex)' },
    cloudOpacity: { control: { type: 'range', min: 0.3, max: 1, step: 0.01 }, description: '안개 덩어리 투명도' },
    tintOpacity: { control: { type: 'range', min: 0, max: 0.3, step: 0.01 }, description: '색 빛 투명도' },
    blur: { control: { type: 'range', min: 20, max: 160, step: 5 }, description: '블러 크기 (px)' },
    duration: { control: { type: 'range', min: 10, max: 120, step: 2 }, description: '한 방향 이동 시간 (초)' },
    isParting: { control: 'boolean', description: '켜면 안개가 걷힌다 (덩어리가 바깥으로 밀려 나가며 옅어짐)' },
    partingDuration: { control: { type: 'range', min: 400, max: 3000, step: 100 }, description: '덩어리 하나가 걷히는 시간 (ms)' },
    partingDelay: { control: { type: 'range', min: 0, max: 1500, step: 50 }, description: '걷힘 시작 지연 (ms)' },
    partingStagger: { control: { type: 'range', min: 0, max: 300, step: 10 }, description: '덩어리 사이 시작 시차 (ms)' },
    sx: { control: false, description: '추가 스타일' },
  },
};

export const Docs = {
  args: {
    baseColor: '#FFFFFF',
    cloudColor: '#FFFFFF',
    tintColors: ['#9CD3EE'],
    cloudOpacity: 1,
    tintOpacity: 0.15,
    blur: 28,
    duration: 42,
    isParting: false,
    partingDuration: 1100,
    partingDelay: 300,
    partingStagger: 60,
  },
  render: (args) => (
    <Box sx={ { position: 'relative', height: '100vh', backgroundColor: 'background.default' } }>
      <FlowingColorField { ...args } />
      <Box sx={ { position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' } }>
        <Typography variant="h2">Flowing Color Field</Typography>
      </Box>
    </Box>
  ),
};
