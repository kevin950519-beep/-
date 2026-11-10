import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PageContainer } from '../layout/PageContainer';
import FadeTransition from '../motion/FadeTransition';
import { artistStatement } from '../../data/uyeonhan-majung/artistStatement';

/**
 * ArtistStatementSection (02 2.2절 "작가의 글")
 *
 * 작품 구간과 작가 소개 사이에서 작가가 전시에 붙인 글 전문을 읽는 구간. 가운데에 제목(210 Kkoccbaram),
 * 그 아래 본문 문단들을 읽기 편한 폭(웹 38rem, 약 한 줄 28자)에서 왼쪽 정렬로 놓는다.
 * 모바일에서는 제목(한 줄) 폭이 글 폭이 되어, 본문이 제목의 왼쪽 끝에 맞춰 왼쪽 정렬되고 좌우 여백이 같다. 맨 끝에 "- 작가노트 -" 서명이 웹과 모바일 모두 붙는다.
 * 구간이 보이면 제목, 본문, 서명이 차례로 부드럽게 나타난다(동작 줄이기 설정에서는 처음부터 보인다). 웹과 모바일의 배치가 같다.
 *
 * Props:
 * @param {string} id - 앵커 id [Optional, 기본값: 'artist-statement']
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <ArtistStatementSection />
 */
export function ArtistStatementSection({ id = 'artist-statement', sx }) {
  const bodySx = {
    fontSize: { xs: '0.9375rem', md: '1.0625rem' },
    lineHeight: 1.95,
    wordBreak: 'keep-all',
    textWrap: 'pretty',
    /** 모바일: 제목 폭이 글 폭을 정하도록 본문은 자기 폭을 요구하지 않고 제목 폭을 채운다 */
    width: { xs: 0, md: 'auto' },
    minWidth: { xs: '100%', md: 0 },
  };

  return (
    <Box
      component="section"
      id={ id }
      aria-labelledby={ `${ id }-title` }
      sx={ {
        py: { xs: 10, md: 16 },
        backgroundColor: 'background.default',
        scrollMarginTop: '64px',
        ...sx,
      } }
    >
      <PageContainer maxWidth="lg">
        <Box sx={ { width: { xs: 'fit-content', md: 'auto' }, maxWidth: { xs: '100%', md: '38rem' }, mx: 'auto' } }>
          <FadeTransition isTriggerOnView duration={ 800 }>
            <Typography
              id={ `${ id }-title` }
              variant="h3"
              component="h2"
              sx={ {
                mb: { xs: 5, md: 7 },
                fontFamily: '"210 Kkoccbaram", serif',
                fontWeight: 400,
                fontSize: 'clamp(1.375rem, 5.5vw, 2.25rem)',
                textAlign: 'center',
                lineHeight: 1.5,
                letterSpacing: '-0.01em',
                textWrap: 'balance',
                wordBreak: 'keep-all',
              } }
            >
              { artistStatement.title }
            </Typography>
          </FadeTransition>
          { artistStatement.paragraphs.map((paragraph, index) => (
            <FadeTransition key={ paragraph } isTriggerOnView duration={ 800 } delay={ 150 }>
              <Typography variant="body1" sx={ { ...bodySx, mt: index === 0 ? 0 : { xs: 3, md: 4 }, textAlign: 'left' } }>
                { paragraph }
              </Typography>
            </FadeTransition>
          )) }
          <FadeTransition isTriggerOnView duration={ 800 } delay={ 150 }>
            <Typography
              variant="body2"
              sx={ { mt: { xs: 6, md: 8 }, textAlign: 'center', color: 'text.secondary', letterSpacing: '0.04em' } }
            >
              { artistStatement.signature }
            </Typography>
          </FadeTransition>
        </Box>
      </PageContainer>
    </Box>
  );
}

export default ArtistStatementSection;
