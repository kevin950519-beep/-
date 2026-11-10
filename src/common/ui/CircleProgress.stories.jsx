import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { CircleProgress } from './CircleProgress';

export default {
  title: 'Common/CircleProgress',
  component: CircleProgress,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '물결처럼 구불구불한 원 하나가 시계 방향으로 한 바퀴 그려지는 진행 표시(안은 채우지 않음). 02 이야기의 문(첫 화면)의 자동 진입 대기에 쓴다. 가운데 퍼센트가 올라가고, 동작 줄이기에서는 완성된 원만 정적으로 보여 준다.',
      },
    },
  },
  argTypes: {
    duration: { control: 'number', description: '전체 진행 시간(ms)' },
    size: { control: 'number', description: '원 지름(px)' },
    isRunning: { control: 'boolean', description: '시작 여부' },
    isFinishing: { control: 'boolean', description: '남은 부분을 0.3초에 닫음' },
  },
};

export const Default = { args: { duration: 5000, size: 56, isRunning: true, isFinishing: false } };

/** 다시 시작과 건너뛰기를 눌러 볼 수 있는 데모 */
export const RestartAndSkip = {
  render: function Render() {
    const [runKey, setRunKey] = useState(0);
    const [isFinishing, setIsFinishing] = useState(false);
    return (
      <Stack spacing={ 3 } alignItems="center" sx={ { p: 4 } }>
        <Box key={ runKey }>
          <CircleProgress duration={ 5000 } isFinishing={ isFinishing } />
        </Box>
        <Stack direction="row" spacing={ 1 }>
          <Button variant="outlined" size="small" onClick={ () => { setIsFinishing(false); setRunKey((key) => key + 1); } }>다시 시작</Button>
          <Button variant="outlined" size="small" onClick={ () => setIsFinishing(true) }>건너뛰기</Button>
        </Stack>
      </Stack>
    );
  },
};
