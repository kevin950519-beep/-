import Box from '@mui/material/Box';
import { StatusFloatSection } from './StatusFloatSection';

const STATUS_DATES = {
  '전시 전 (2026.11.08)': new Date(2026, 10, 8),
  '기간 중 (2026.11.20)': new Date(2026, 10, 20),
  '마지막 날 (2026.11.23)': new Date(2026, 10, 23),
  '종료 후 (2026.11.30)': new Date(2026, 10, 30),
};

export default {
  title: 'Section/Landing/StatusFloat',
  component: StatusFloatSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '꾹 눌러 아래 X로 끌어다 놓으면 헤더 왼쪽 위(상태 칩)로 옮겨 붙는다(Delete 키도 가능). 칩을 누르면 다시 옆으로 떠오른다. 02 2.4절 "전시 상태". 화면 왼쪽 가장자리에 유리 느낌(글래스모피즘) 상자로 스크롤 내내 따라다니는 전시 상태. 윗줄 큰 글자와 아랫줄 안내 문구가 있고 사라지지 않는다. 가볍게 눌러도 반응하지 않는다.',
      },
    },
  },
  argTypes: {
    now: {
      control: 'select',
      options: Object.keys(STATUS_DATES),
      mapping: STATUS_DATES,
      description: '전시 상태 계산 기준 날짜',
    },
  },
};

export const Docs = {
  args: { now: STATUS_DATES['전시 전 (2026.11.08)'] },
  render: (args) => (
    <Box>
      <StatusFloatSection { ...args } />
      <Box sx={ { height: '100vh', backgroundColor: 'background.default' } } />
      <Box sx={ { height: '100vh', backgroundColor: 'grey.700' } } />
      <Box id="visit-guide" sx={ { height: '100vh', backgroundColor: 'background.default' } } />
    </Box>
  ),
};
