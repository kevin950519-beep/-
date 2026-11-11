import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import { PageContainer } from '../layout/PageContainer';
import FadeTransition from '../motion/FadeTransition';
import { copyCurrentLink } from '../../utils/copyCurrentLink';
import { exhibitionInfo } from '../../data/uyeonhan-majung/exhibitionInfo';
import { content } from '../../data/uyeonhan-majung/content';

const INFO_KEYS = ['period', 'place', 'address', 'hours', 'fee', 'contact'];

/**
 * VisitGuideSection (관람 안내)
 *
 * 얇은 고딕 제목 "관람 안내"와 기간, 장소 등 전시 정보를 보여 주고, 그 아래 가운데에 길찾기와 링크 공유 버튼을 둔다. 작가 소개는 ArtistSection이 맡는다.
 * 구분은 배경색이 아니라 얇은 선으로 한다 (03 2.1절).
 *
 * Props:
 * @param {string} id - 앵커 id [Optional, 기본값: 'visit-guide']
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <VisitGuideSection />
 */
export function VisitGuideSection({ id = 'visit-guide', sx }) {
  const [isCopied, setIsCopied] = useState(false);
  const { visitGuide } = content.landing;

  const handleShare = async () => {
    if (await copyCurrentLink()) setIsCopied(true);
  };

  return (
    <Box
      component="section"
      id={ id }
      sx={ {
        py: { xs: 8, md: 16 },
        backgroundColor: 'background.default',
        scrollMarginTop: '64px',
        ...sx,
      } }
    >
      <PageContainer maxWidth="lg">
        <FadeTransition isTriggerOnView duration={ 800 }>
          <Typography
            variant="h2"
            component="p"
            sx={ (theme) => ({
              textAlign: 'center',
              mb: { xs: 2, md: 3 },
              fontFamily: `'210 SanbitGothic', ${ theme.typography.fontFamily }`,
              fontWeight: 200,
            }) }
          >
            { visitGuide.infoTitle }
          </Typography>
          <Divider />
          <Box sx={ { pt: { xs: 4, md: 6 } } }>
            <Box>
                            <Box component="dl" sx={ { m: 0, mt: 1 } }>
                { INFO_KEYS.map((key) => (
                  <Box
                    key={ key }
                    sx={ {
                      display: 'flex',
                      gap: 2,
                      py: 1.5,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    } }
                  >
                    <Typography component="dt" variant="body2" color="text.secondary" sx={ { width: '4.5em', flexShrink: 0 } }>
                      { visitGuide.infoLabels[key] }
                    </Typography>
                    <Typography component="dd" variant="body1" sx={ { m: 0, whiteSpace: key === 'period' || key === 'hours' ? 'nowrap' : 'normal' } }>
                      { (key === 'period' ? exhibitionInfo.periodLabel : exhibitionInfo[key]) || visitGuide.pendingLabel }
                    </Typography>
                  </Box>
                )) }
              </Box>
              <Box sx={ { display: 'flex', justifyContent: 'center', gap: 1, mt: 4, flexWrap: 'wrap' } }>
                <Button
                  variant="contained"
                  href={ exhibitionInfo.mapUrl }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  { visitGuide.mapLabel }
                </Button>
                <Button variant="outlined" onClick={ handleShare }>{ visitGuide.shareLabel }</Button>
              </Box>
            </Box>
          </Box>
        </FadeTransition>
      </PageContainer>
      <Snackbar
        open={ isCopied }
        autoHideDuration={ 2400 }
        onClose={ () => setIsCopied(false) }
        message={ visitGuide.copiedMessage }
      />
    </Box>
  );
}

export default VisitGuideSection;
