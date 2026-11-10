import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { HeaderSection } from './HeaderSection';

export default {
  title: 'Section/Landing/Header',
  component: HeaderSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '02 2.4절 "페이지 셸" 헤더. 구간 메뉴(읽는 위치 강조), 길찾기·공유 아이콘, 읽는 진행선을 묶는다. 모바일은 메뉴 없이 아이콘만 두고 헤더를 낮춘다. 맨 위에서는 항상 보이고, 내리면 숨고 올리면 다시 나타난다. 아래 스토리를 스크롤해 확인한다.',
      },
    },
  },
  argTypes: {
    isHidden: { control: 'boolean', description: 'true면 항상 숨김 (첫 화면이 열려 있는 동안)' },
  },
};

const FILLER = [
  { id: 'hero', label: '히어로', height: '120vh' },
  { id: 'artist-note', label: '작가 노트', height: '80vh' },
  { id: 'works', label: '작품', height: '120vh' },
  { id: 'artist', label: '작가 소개 (작품으로 센다)', height: '80vh' },
  { id: 'visit-guide', label: '관람 안내', height: '100vh' },
];

export const Docs = {
  render: (args) => (
    <Box>
      <HeaderSection { ...args } />
      { FILLER.map(({ id, label, height }) => (
        <Box
          key={ id }
          id={ id }
          component="section"
          sx={ { height, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid', borderColor: 'divider' } }
        >
          <Typography variant="caption" color="text.secondary">{ label }</Typography>
        </Box>
      )) }
    </Box>
  ),
};
