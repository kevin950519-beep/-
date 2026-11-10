import { useState } from 'react';
import Button from '@mui/material/Button';
import WorkLightbox from './WorkLightbox';
import glowSrc from '../../assets/빛나는 화분.png';

export default {
  title: 'Custom Component/2. Overlay Feedback/WorkLightbox',
  component: WorkLightbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## WorkLightbox

작품을 흰 카드(WorkCard) 팝업으로 여는 화면입니다. 데스크톱에서는 카드 왼쪽에 사진, 오른쪽에 작품 정보(작품명, 재료, 크기, 연도)가 놓입니다.
정보가 비어 있으면 \`pendingLabel\`을 대신 보여 줍니다. \`Esc\` 키와 닫기 버튼으로 닫습니다.
\`onPrev\`, \`onNext\`를 주면 이전·다음 버튼과 좌우 방향키로 이웃 작품으로 넘길 수 있습니다.
        `,
      },
    },
  },
  argTypes: {
    isOpen: { control: 'boolean', description: '열림 여부' },
    onClose: { action: 'closed', description: '닫기 핸들러' },
    onPrev: { action: 'prev', description: '이전 작품 핸들러 (주면 이전 버튼과 왼쪽 방향키 활성)' },
    onNext: { action: 'next', description: '다음 작품 핸들러 (주면 다음 버튼과 오른쪽 방향키 활성)' },
    prevLabel: { control: 'text', description: '이전 버튼 접근성 레이블' },
    nextLabel: { control: 'text', description: '다음 버튼 접근성 레이블' },
    work: { control: 'object', description: '작품 { title, src, alt, material, size, year }' },
    closeLabel: { control: 'text', description: '닫기 버튼 접근성 레이블' },
  },
};

const sampleWork = {
  title: '샘플 작품',
  aspectRatio: '1501/1956',
  src: glowSrc,
  alt: '불빛이 켜진 유리 화분에서 가지가 뻗은 장면',
  material: '유리, 가지, LED',
  size: '',
  year: '0000',
};

export const Docs = {
  args: { work: sampleWork },
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button variant="outlined" onClick={ () => setIsOpen(true) }>작품 확대 열기</Button>
        <WorkLightbox { ...args } isOpen={ isOpen } onClose={ () => setIsOpen(false) } />
      </>
    );
  },
};
