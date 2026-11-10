import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { PageContainer } from '../layout/PageContainer';
import { artist } from '../../data/uyeonhan-majung/artist';
import { exhibitionInfo } from '../../data/uyeonhan-majung/exhibitionInfo';
import { content } from '../../data/uyeonhan-majung/content';

/**
 * FooterSection (02 2.2절 "푸터")
 *
 * 페이지 맨 아래. 작가 표기, 작품 이미지 무단 사용 금지 안내를 캡션 크기로만 둔다.
 * 구분은 배경색이 아니라 얇은 선으로 한다 (03 2.1절).
 *
 * Props:
 * @param {string} id - 앵커 id [Optional, 기본값: 'footer']
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <FooterSection />
 */
export function FooterSection({ id = 'footer', sx }) {
  const { footer } = content.landing;
  const year = exhibitionInfo.period.slice(0, 4);

  return (
    <Box
      component="footer"
      id={ id }
      sx={ { pt: { xs: 4, md: 6 }, pb: { xs: 6, md: 8 }, backgroundColor: 'background.default', ...sx } }
    >
      <PageContainer maxWidth="lg">
        <Divider sx={ { mb: { xs: 3, md: 4 } } } />
        <Typography variant="caption" component="p" color="text.secondary" sx={ { m: 0 } }>
          { exhibitionInfo.title }, { artist.name } 개인전. © { year } { artist.name }
        </Typography>
        <Typography variant="caption" component="p" color="text.secondary" sx={ { mt: 0.5 } }>
          { footer.notice }
        </Typography>
      </PageContainer>
    </Box>
  );
}

export default FooterSection;
