import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { ImageCarousel } from '../media/ImageCarousel';
import { exhibitionInfo } from '../../data/uyeonhan-majung/exhibitionInfo';
import { content } from '../../data/uyeonhan-majung/content';

/** 화면에는 보이지 않고 스크린리더만 읽는 스타일 */
const visuallyHidden = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  margin: '-1px',
  padding: 0,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

/**
 * HeroSection (02 2.2절 "히어로")
 *
 * 전시 포스터 3종(세로형, 제목·장소·기간이 이미지에 포함)을 원본 비율 그대로 가로 폭에 맞춰 보여 주는 구간.
 * 사용자가 화살표, 점, 스와이프로 넘기며, 페이드 전환이라 한 방향으로 계속 넘겨도 처음으로 부드럽게 이어진다.
 * 별도 글자를 얹지 않고, 전시 제목은 스크린리더용 숨김 제목(h1)으로 남긴다.
 * 이미지를 자르지 않고, 포스터 높이를 한 화면보다 조금 짧게(100svh - 96px) 제한해 다음 구간의 윗부분이 화면 아래에 걸쳐 보이게 한다.
 * 포스터 아래 흰 여백에 문구 없이 작은 화살표 하나를 두고, 누르면 다음 구간으로 부드럽게 내려간다(움직임 줄이기 설정이면 흔들림 없음).
 *
 * Props:
 * @param {string} id - 앵커 id [Optional, 기본값: 'hero']
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <HeroSection />
 */
export function HeroSection({ id = 'hero', sx }) {
  const { hero } = content.landing;

  /** 다음 구간(작가 노트)으로 이동 */
  const handleScrollDown = () => {
    const next = document.getElementById('artist-note');
    if (!next) return;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    next.scrollIntoView({ behavior: isReduced ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <Box
      component="section"
      id={ id }
      sx={ {
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'background.default',
        scrollMarginTop: '64px',
        ...sx,
      } }
    >
      <Box
        sx={ {
          position: 'relative',
          width: 'min(100%, calc((100svh - 96px) * 3508 / 4961))',
          mx: 'auto',
        } }
      >
        <ImageCarousel
          images={ hero.posters }
          aspectRatio="3508 / 4961"
          transition="fade"
          transitionDuration={ 500 }
          isLoop
          hasIndicator
          indicatorPosition="bottom"
          indicatorSize="sm"
          indicatorActiveColor="grey.900"
          indicatorInactiveColor="rgba(0,0,0,0.25)"
          sx={ { backgroundColor: 'background.default' } }
        />
      </Box>
      <ButtonBase
        onClick={ handleScrollDown }
        aria-label="아래로 스크롤"
        sx={ {
          display: 'flex',
          mx: 'auto',
          my: 1,
          p: 1,
          color: 'grey.900',
          borderRadius: '50%',
          '@keyframes heroArrowBounce': {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(6px)' },
          },
          '& svg': {
            animation: 'heroArrowBounce 1.8s ease-in-out infinite',
            '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
          },
        } }
      >
        <KeyboardArrowDownIcon />
      </ButtonBase>

      <Typography variant="h1" component="h1" sx={ visuallyHidden }>{ exhibitionInfo.title }</Typography>
    </Box>
  );
}

export default HeroSection;
