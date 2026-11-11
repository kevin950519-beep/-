import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import {
  HeroSection,
  ArtistNoteSection,
  StoryGateSection,
  WorksSection,
  ArtistStatementSection,
  ArtistSection,
  VisitGuideSection,
  HeaderSection,
  StatusFloatSection,
  FooterSection,
} from '../components/sections';

/**
 * LandingPage (02 2.1절 "Landing", 경로 `/`)
 *
 * 작가 노트가 첫 화면이고, 터치하면 히어로가 열린 뒤 작가 노트, 작품 사진 그리드로 이어지고 관람 안내로 이어지는 한 페이지.
 * 섹션 순서와 페이지 셸(헤더, 푸터)만 조립한다. 헤더는 첫 화면이 열려 있는 동안 숨고, 전시 상태 상자는 왼쪽 가장자리에서 계속 따라다닌다.
 *
 * Example usage:
 * <Route index element={ <LandingPage /> } />
 */
export function LandingPage() {
  const [isIntroOpen, setIsIntroOpen] = useState(true);
  const handleIntroEnter = useCallback(() => setIsIntroOpen(false), []);

  return (
    <Box sx={ { minHeight: '100vh', backgroundColor: 'background.default', color: 'text.primary' } }>
      <HeaderSection isHidden={ isIntroOpen } />
      <StatusFloatSection />
      <StoryGateSection isOpen={ isIntroOpen } onEnter={ handleIntroEnter } />
      <main>
        {/* 히어로 sticky가 작가 노트까지만 붙어 있도록 둘을 한 상자로 묶는다 */}
        <Box sx={ { position: 'relative' } }>
          <HeroSection />
          <ArtistNoteSection />
        </Box>
        <WorksSection />
        <ArtistStatementSection />
        <ArtistSection />
        <VisitGuideSection />
      </main>
      <FooterSection />
    </Box>
  );
}

export default LandingPage;
