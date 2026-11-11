import { useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import RandomRevealText from '../kinetic-typography/RandomRevealText';
import { PageContainer } from '../layout/PageContainer';
import { useScrollLockOnce } from '../scroll/useScrollLockOnce';
import { artistNote } from '../../data/uyeonhan-majung/artistNote';

/** 글자가 써지는 간격(ms)과 줄 사이 쉼(ms) */
const WRITE_STAGGER = 42;
const LINE_PAUSE = 190;

/** 앞 줄들이 다 써진 뒤 이 줄이 시작하도록, 앞 줄 글자 수와 쉼을 합친 지연 */
const getLineOffset = (index) => artistNote.lines
  .slice(0, index)
  .reduce((sum, line) => sum + line.replace(/ /g, '').length * WRITE_STAGGER + LINE_PAUSE, 0);

/** 글자가 모두 써지기까지의 시간(ms): 첫 줄 시작 지연 + 모든 줄의 글자와 쉼 + 마지막 글자 페이드 + 여유 */
const WRITE_TOTAL = 300 + getLineOffset(artistNote.lines.length) + 140 + 300;

/** 화면 가운데로 맞추는 데 쓰는 시간(ms) */
const SETTLE_TIME = 700;

/**
 * ArtistNoteSection (히어로와 작품 사이의 작가 노트)
 *
 * 작가 노트 세 줄을 얇은 고딕체(본문 산세, ExtraLight)로 가운데 정렬로 크게 보여 주는 구간.
 * 구간이 처음 보이면 화면 가운데로 맞춘 뒤, 글이 모두 써질 때까지 스크롤을 멈추고 다 쓰이면 풀린다(웹과 모바일 공통, 한 번만).
 * 마지막 줄은 앞 두 줄보다 조금 더 띄워 놓는다. 구간에 들어오면 세 줄이 위에서 아래로 한 글자씩 써지듯 한 번만 나타난다 (03 3.3 작가 노트). 줄 단위로 끊어 읽히게 하고, 글자 외에 장식은 두지 않는다. 동작 줄이기 설정에서는 처음부터 모두 보인다.
 *
 * Props:
 * @param {string} id - 앵커 id [Optional, 기본값: 'artist-note']
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <ArtistNoteSection />
 */
export function ArtistNoteSection({ id = 'artist-note', sx }) {
  const sectionRef = useRef(null);
  const isReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useScrollLockOnce({ targetRef: sectionRef, durationMs: SETTLE_TIME + WRITE_TOTAL, isEnabled: !isReducedMotion });

  return (
    <Box
      ref={ sectionRef }
      component="section"
      id={ id }
      aria-label={ artistNote.title }
      sx={ {
        display: 'flex',
        alignItems: 'center',
        /** 작품 구간과의 아래 간격만 위쪽의 절반으로 줄인다: 아래 여백을 줄이고 같은 만큼 최소 높이도 줄여 글 위치는 그대로 둔다 */
        minHeight: { xs: 'calc(100svh - 104px)', md: 'calc(100svh - 128px)' },
        pt: { xs: 10, md: 16 },
        pb: { xs: 5, md: 8 },
        /** 히어로 위로 올라와 덮는 구간: 위쪽 모서리를 둥글게 하고 위쪽에만 얇은 그림자로 경계를 만든다(아래 작품 구간 쪽으로는 번지지 않게 한다) */
        position: 'relative',
        zIndex: 1,
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        boxShadow: '0 -12px 16px -12px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'grey.200',
        scrollMarginTop: '64px',
        ...sx,
      } }
    >
      <PageContainer maxWidth="lg">
        <Typography
          variant="h3"
          component="p"
          sx={ {
            fontFamily: '"210 Kkoccbaram", serif',
            fontWeight: 400,
            /** 모바일: 가장 긴 둘째 줄이 한 줄에 들어가 세 줄로 보이도록 화면 폭에 맞춘다 */
            fontSize: { xs: 'calc((100vw - 48px) / 17 * var(--text-fit, 1))', md: 'clamp(1.75rem, 6vw, 3.4375rem)' },
            textAlign: 'center',
            lineHeight: 1.4,
            letterSpacing: '-0.01em',
            textWrap: 'balance',
          } }
        >
          { artistNote.lines.map((line, index) => (
            <Box
              key={ line }
              component="span"
              /** 맨 마지막 줄만 앞 줄과 조금 더 띄운다 */
              sx={ { display: 'block', mt: index === artistNote.lines.length - 1 ? '0.4em' : 0 } }
            >
              <RandomRevealText
                text={ line }
                variant="inherit"
                isSequential
                isTriggerOnView
                delay={ 300 + getLineOffset(index) }
                stagger={ WRITE_STAGGER }
                duration={ 140 }
                blur={ 0 }
              />
            </Box>
          )) }
        </Typography>
      </PageContainer>
    </Box>
  );
}

export default ArtistNoteSection;
