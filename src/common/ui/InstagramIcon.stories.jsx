import Stack from '@mui/material/Stack';
import { InstagramIcon } from './InstagramIcon';

export default {
  title: 'Common/InstagramIcon',
  component: InstagramIcon,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '선으로 그린 인스타그램 아이콘. 선 굵기를 strokeWidth로 조절하고, 색은 현재 글자색을 따른다.',
      },
    },
  },
  argTypes: {
    strokeWidth: { control: { type: 'number', min: 0.5, max: 3, step: 0.25 }, description: '선 굵기(24 기준 viewBox 단위)' },
  },
};

export const Default = {
  args: { strokeWidth: 1, sx: { fontSize: 32 } },
};

export const Strokes = {
  render: () => (
    <Stack direction="row" spacing={ 3 } sx={ { p: 2 } }>
      { [0.75, 1, 1.5, 2].map((width) => (
        <InstagramIcon key={ width } strokeWidth={ width } sx={ { fontSize: 40 } } />
      )) }
    </Stack>
  ),
};
