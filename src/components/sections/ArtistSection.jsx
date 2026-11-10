import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { InstagramIcon } from '../../common/ui/InstagramIcon';
import { PageContainer } from '../layout/PageContainer';
import FadeTransition from '../motion/FadeTransition';
import { artist } from '../../data/uyeonhan-majung/artist';
import { content } from '../../data/uyeonhan-majung/content';

/** 프로필 사진 칸은 그대로 두고 사진만 확대하는 배율과 확대 기준점. 지금 사진(엄마 사진2)은 이미 인물이 칸을 가득 채우게 찍혀 있어 확대하지 않는다(1). 사진을 바꾸면 인물이 잘 보이게 이 값을 다시 맞춘다 */
const PORTRAIT_ZOOM = 1;
const PORTRAIT_ORIGIN = '50% 40%';

/**
 * ArtistSection (02 2.2절 "작가 소개")
 *
 * 얇은 고딕 제목 "작가 프로필" 아래에 아티스트 이름, 학력, 소속, 전시 이력, 인스타그램 링크(좌측 열)와 프로필 사진(우측 열)을 보여 주는 구간.
 * 모바일(md 미만)에서는 두 열 대신 위에서 아래로, 프로필 사진이 먼저 나오고 그 아래에 글이 이어진다. 사진과 글 묶음은 가운데에 놓고 글 자체는 왼쪽 정렬이며, 모바일은 사진(최대 17rem 폭, 웹은 280px)과 글 묶음(최대 21rem) 모두 가운데에 놓인다.
 * 관람 안내는 VisitGuideSection이 따로 맡는다.
 *
 * Props:
 * @param {string} id - 앵커 id [Optional, 기본값: 'artist']
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <ArtistSection />
 */
export function ArtistSection({ id = 'artist', sx }) {
  const { visitGuide } = content.landing;

  return (
    <Box
      component="section"
      id={ id }
      sx={ {
        py: { xs: 8, md: 16 },
        backgroundColor: '#202020',
        color: 'common.white',
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
              color: 'common.white',
            }) }
          >
            { visitGuide.phrase }
          </Typography>
          <Divider sx={ { borderColor: 'common.white', opacity: 0.4 } } />
          <Grid container spacing={ { xs: 4, md: 8 } } sx={ {
            pt: { xs: 4, md: 6 },
            width: { md: '92.5%' },
            ml: { md: 'auto' },
            /** 모바일: 폭 최대 21rem의 한 칸 가운데에 사진과 글 묶음을 함께 둔다. 글 묶음은 내용 폭만큼만 차지해 가운데에 놓이고 글 자체는 왼쪽 정렬이다 */
            display: { xs: 'grid', md: 'flex' },
            gridTemplateColumns: { xs: 'min(100%, 21rem)' },
            justifyContent: { xs: 'center' },
          } }>
            <Grid size={ { xs: 12, md: 6 } } sx={ { order: { xs: 1, md: 2 } } }>
              {/* 사진 칸의 크기와 규격은 그대로 두고, 안의 이미지만 확대해 가장자리를 잘라 낸다 */}
              <Box
                sx={ {
                  width: '100%',
                  maxWidth: { xs: '17rem', md: 280 },
                  aspectRatio: `${ artist.portrait.width } / ${ artist.portrait.height }`,
                  overflow: 'hidden',
                  mx: { xs: 'auto', md: 0 },
                  mr: { md: 'auto' },
                } }
              >
                <Box
                  component="img"
                  src={ artist.portrait.src }
                  alt={ artist.portrait.alt }
                  width={ artist.portrait.width }
                  height={ artist.portrait.height }
                  loading="lazy"
                  sx={ {
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: `scale(${ PORTRAIT_ZOOM })`,
                    transformOrigin: PORTRAIT_ORIGIN,
                  } }
                />
              </Box>
            </Grid>
            <Grid size={ { xs: 12, md: 6 } } sx={ { order: { xs: 2, md: 1 } } }>
              <Box sx={ { width: 'fit-content', maxWidth: '100%', mx: 'auto' } }>
                <Typography
                  variant="h2"
                  component="p"
                  sx={ (theme) => ({ lineHeight: 1.4, mb: 2, fontFamily: theme.typography.fontFamily, fontWeight: 500, color: 'common.white' }) }
                >
                  { artist.name }
                </Typography>
                <Box component="ul" sx={ { m: 0, mb: { xs: 6, md: 7 }, p: 0, listStyle: 'none' } }>
                  { artist.education.map((line) => (
                    <Typography key={ line } component="li" variant="body2" sx={ { fontWeight: 700, color: 'common.white' } }>{ line }</Typography>
                  )) }
                  <Typography component="li" variant="body2" sx={ { fontWeight: 700, color: 'common.white' } }>{ artist.membership }</Typography>
                </Box>
                { [
                  { title: visitGuide.soloTitle, lines: artist.soloExhibitions },
                  { title: visitGuide.groupTitle, lines: artist.groupExhibitions },
                ].map(({ title, lines }, index) => (
                  <Box key={ title } sx={ { mt: index === 0 ? 0 : 3 } }>
                    <Typography variant="overline" component="h3" sx={ { display: 'block', mb: 1.5, color: 'common.white' } }>{ title }</Typography>
                    <Box component="ul" sx={ { m: 0, p: 0, listStyle: 'none' } }>
                      { lines.map((line) => (
                        <Typography key={ line } component="li" variant="body2" sx={ { color: 'grey.300' } }>{ line }</Typography>
                      )) }
                    </Box>
                  </Box>
                )) }
                { artist.instagram && (
                  <Link
                    href={ artist.instagram.url }
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={ `${ artist.name } 인스타그램` }
                    underline="hover"
                    sx={ { display: 'inline-flex', alignItems: 'center', gap: 1.25, mt: 6, color: 'common.white' } }
                  >
                    <InstagramIcon sx={ { fontSize: 32 } } />
                    <Typography component="span" variant="body1" sx={ { fontSize: '1.125rem' } }>{ artist.instagram.handle }</Typography>
                  </Link>
                ) }
              </Box>
            </Grid>
          </Grid>
        </FadeTransition>
      </PageContainer>
    </Box>
  );
}

export default ArtistSection;
