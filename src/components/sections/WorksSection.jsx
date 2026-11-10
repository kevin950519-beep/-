import { useState } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useWorkRoute } from '../navigation/useWorkRoute';
import { WorkDetailView } from '../overlay-feedback/WorkDetailView';
import { WorkLightbox } from '../overlay-feedback/WorkLightbox';
import { works } from '../../data/uyeonhan-majung/work';
import { content } from '../../data/uyeonhan-majung/content';

/** 작품 구간에는 gallery 사진만 보여 준다 (02 2.3절) */
const galleryWorks = works.filter((work) => work.placement === 'gallery');

/**
 * WorksSection (02 2.2절 "작품")
 *
 * 위에 가운데 정렬 전시 작품 타이틀(얇은 고딕)을 두고, 그 아래 작품 사진을 한 줄에 한 장씩 3:2 칸에 여백 없이 꽉 채워 세로로 이어 붙이는 구간.
 * 칸은 cover라 세로·가로 사진은 가장자리가 잘리고, 보여 줄 부분은 작품마다 정한 focus로 고른다.
 * 사진을 누르면 잘리지 않은 전체와 작품 정보가 열리고, 이전·다음으로 넘긴다.
 * 데스크톱은 팝업(WorkLightbox)으로, 모바일은 작품 하나만 보는 단일 개별 페이지(WorkDetailView, 주소 `#/works/{id}`)로 열려 뒤로 가기로 돌아온다. 개별 페이지에서는 다른 작품으로 넘기지 않는다.
 *
 * Props:
 * @param {string} id - 앵커 id [Optional, 기본값: 'works']
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <WorksSection />
 */
export function WorksSection({ id = 'works', sx }) {
  const [openIndex, setOpenIndex] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { workId, openWork, closeWork } = useWorkRoute();
  const { lightbox, works: worksCopy } = content.landing;
  const isOpen = openIndex !== null && !isMobile;
  const { backLabel, ...lightboxLabels } = lightbox;

  const detailIndex = isMobile ? galleryWorks.findIndex((work) => work.id === workId) : -1;

  const handleMove = (step) => {
    setOpenIndex((current) => (current + step + galleryWorks.length) % galleryWorks.length);
  };

  return (
    <Box
      component="section"
      id={ id }
      sx={ { backgroundColor: 'background.default', scrollMarginTop: '64px', ...sx } }
    >
      <Typography
        variant="h2"
        component="h2"
        sx={ (theme) => ({
          pt: { xs: 5, md: 8 },
          pb: { xs: 2, md: 3 },
          fontFamily: `'210 SanbitGothic', ${ theme.typography.fontFamily }`,
          fontWeight: 200,
          textAlign: 'center',
        }) }
      >
        { worksCopy.title }
      </Typography>

      <Grid container spacing={ { xs: 0.5, md: 1 } } sx={ { px: { xs: 0.5, md: 1 } } }>
        { galleryWorks.map((work, index) => {
          return (
          <Grid
            key={ work.id }
            size={ 12 }
            sx={ { position: 'relative', aspectRatio: '3 / 2', overflow: 'hidden' } }
          >
            <ButtonBase
              onClick={ () => (isMobile ? openWork(work.id) : setOpenIndex(index)) }
              aria-label={ `${ work.title } ${ index + 1 } ${ lightbox.openLabel }` }
              sx={ { position: 'absolute', inset: 0, width: '100%', height: '100%' } }
            >
              <Box
                component="img"
                src={ work.src }
                alt={ work.alt }
                loading="lazy"
                sx={ { display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: work.focus } }
              />
            </ButtonBase>
          </Grid>
          );
        }) }
      </Grid>

      { detailIndex >= 0 && (
        <WorkDetailView
          work={ galleryWorks[detailIndex] }
          onClose={ closeWork }
          variant="cover"
          backLabel={ backLabel }
          { ...lightboxLabels }
        />
      ) }

      <WorkLightbox
        isOpen={ isOpen }
        onClose={ () => setOpenIndex(null) }
        onPrev={ () => handleMove(-1) }
        onNext={ () => handleMove(1) }
        work={ isOpen ? galleryWorks[openIndex] : undefined }
        { ...lightbox }
      />
    </Box>
  );
}

export default WorksSection;
