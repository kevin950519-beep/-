import { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { keyframes, useTheme } from '@mui/material/styles';
import FlowingColorField from '../dynamic-color/FlowingColorField';
import BranchSilhouette from '../media/BranchSilhouette';
import FadeTransition from '../motion/FadeTransition';
import { CircleProgress } from '../../common/ui/CircleProgress';
import { PageContainer } from '../layout/PageContainer';
import { useFontLoaded } from './useFontLoaded';
import { content } from '../../data/uyeonhan-majung/content';
import { exhibitionInfo } from '../../data/uyeonhan-majung/exhibitionInfo';
import branchSilhouette from '../../assets/silhouette/branch-only.png';

/** 글자 묶음이 투명도로 나타나기 시작하는 시각(ms) */
const TEXT_DELAY = 300;
/** 글자 묶음(제목, 부제, 전시 기간, 장소)이 안개처럼 천천히 드러나는 시간(ms) */
const TEXT_DURATION = 2000;
/** 진행 표시(원)는 글자 묶음이 거의 다 드러날 무렵 나타나 로딩을 시작한다 */
const CIRCLE_DELAY = TEXT_DELAY + TEXT_DURATION - 300;

/**
 * 안개 속에 비치는 거대한 나뭇가지 실루엣 하나(여인상은 쓰지 않는다). 줄기는 화면 오른쪽 아래 밖에 두고 가지가 화면을 가로질러 왼쪽 위로 뻗는다.
 * 가우시안 블러로 크게 뭉개고 아주 연하게 해서 안개와 자연스럽게 섞이게 둔다. 글은 이 위에 올라간다.
 */
const BRANCH = {
  color: 'secondary.dark',
  blur: 16,
  opacity: 0.14,
  /** 모바일은 화면이 작아 가지가 더 보이도록 덜 뭉개고 조금 진하게 둔다 */
  mobileBlur: 12,
  mobileOpacity: 0.22,
  sx: {
    right: { xs: '-94vw', md: '-14vw' },
    bottom: { xs: '-20svh', md: '-48svh' },
    height: { xs: '130svh', md: '150svh' },
  },
};
const AUTO_ENTER_DELAY = 2000;
/** 원이 100%가 된 뒤 걷힘이 시작되기 전에 멈춰 있는 시간(ms) */
const COMPLETE_HOLD = 300;
/** 동작 줄이기에서는 가지가 처음부터 보이므로 읽을 시간을 조금 더 준다 */
const AUTO_ENTER_DELAY_REDUCED = 3000;

/** 로딩 중 안내 문구가 부드럽게 깜빡이는 주기(ms). 투명도 1과 0.3 사이를 오간다 */
const BLINK_DURATION = 1600;
const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
`;

/** 닫힘 연출(ms): 글자 옅어짐, 안개 걷힘, 가지 옅어짐. 전체 길이는 LEAVE_TOTAL */
const TEXT_FADE_DURATION = 330;
const PARTING_DELAY = 170;
const PARTING_DURATION = 610;
const PARTING_STAGGER = 35;
const SILHOUETTE_FADE_DELAY = 670;
const SILHOUETTE_FADE_DURATION = 330;
const LEAVE_TOTAL = 1000;

/**
 * StoryGateSection (02 2.2절 "이야기의 문")
 *
 * 첫 화면. 전시 제목(우연한 마중), 부제(임미라 개인전), 전시 기간과 장소가 위쪽에 가운데 정렬로 한 덩어리로 놓이고(웹과 모바일 공통), 아래쪽에는 진행 표시(CircleProgress)와 안내 문구가 놓인다. 화면을 가로지르는 거대한 나뭇가지가 안개 속 실루엣처럼 비친다.
 * 제목, 부제, 날짜와 장소가 한 묶음으로 안개처럼 천천히 드러난 뒤 하단의 원이 나타나 로딩을 시작하고, 2초 뒤(이 동안 안내 문구가 깜빡인다) 원이 100%가 되고, 글자가 검은색으로 바뀐 채 0.3초 멈췄다가 저절로 닫힌다. 원이 한 바퀴 그려지며 가운데 퍼센트가 100까지 올라가고, 한 바퀴가 닫히는 것이 기다림의 진행 표시이며. 가지 실루엣은 움직이지 않고 처음부터 보인다. 탭이 가려진 동안은 시간이 멈춘다.
 * 기다리기 싫으면 화면을 터치(클릭, Enter, Space)해 바로 건너뛴다. 닫힘이 시작되면 흰 안개가 사방으로 걷히며 뒤의 히어로가 드러난다(약 1초). 걷힘이 끝나면 onEnter를 부른다.
 * 배경에는 흰 안개가 구름처럼 겹쳐 천천히 머물듯 흐르고, 아주 옅은 푸른 흐름이 가로로 길게 이어진다 (03 3.3 첫 화면 배경, 작품 실루엣, 닫힘).
 * 열려 있는 동안(걷히는 중 포함) 뒤 화면의 스크롤을 막는다. 모바일 터치 강조색은 쓰지 않는다. 동작 줄이기 설정에서는 이동 없이 짧게 투명도만 바뀐다.
 *
 * Props:
 * @param {boolean} isOpen - 열림 여부 [Optional, 기본값: true]
 * @param {number} autoEnterDelay - 원이 시작된 뒤 저절로 닫히기까지의 시간(ms). 0이면 자동으로 닫지 않는다 [Optional, 기본값: 2000(동작 줄이기 3000)]
 * @param {function} onEnter - 걷힘 연출이 끝났을 때 호출 () => void [Required]
 * @param {string} id - 앵커 id [Optional, 기본값: 'story-gate']
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <StoryGateSection isOpen={ isOpen } onEnter={ () => setIsOpen(false) } />
 */
export function StoryGateSection({ isOpen = true, autoEnterDelay, onEnter, id = 'story-gate', sx }) {
  const theme = useTheme();
  const isReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isTitleFontReady = useFontLoaded('210 Fullmoon', content.landing.storyGate.title);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { storyGate } = content.landing;
  const [isLeaving, setIsLeaving] = useState(false);
  const [isCircleRunning, setIsCircleRunning] = useState(false);
  const leaveTimerRef = useRef(null);

  useEffect(() => () => clearTimeout(leaveTimerRef.current), []);

  /** 제목 서체가 준비되고 글자가 모두 나타난 뒤에 원이 시작한다 */
  useEffect(() => {
    if (!isOpen || !isTitleFontReady) return undefined;
    const timer = setTimeout(() => setIsCircleRunning(true), CIRCLE_DELAY);
    return () => {
      clearTimeout(timer);
      setIsCircleRunning(false);
    };
  }, [isOpen, isTitleFontReady]);

  /** 닫힘이 시작되면 글자(제목, 부제, 날짜, 장소)가 먼저 옅어진다 */
  const textLayerSx = {
    opacity: isLeaving ? 0 : 1,
    transition: isReducedMotion ? 'opacity 200ms ease' : `opacity ${ TEXT_FADE_DURATION }ms ease`,
  };

  /** 연출을 시작하고 끝나면 onEnter를 부른다. 이미 시작했으면 무시한다 */
  const handleEnter = useCallback(() => {
    if (isLeaving) return;
    setIsLeaving(true);
    leaveTimerRef.current = setTimeout(() => {
      onEnter?.();
      /** 부모가 닫지 않는 경우(스토리 등)에도 다시 눌러 볼 수 있게 되돌린다 */
      setIsLeaving(false);
    }, isReducedMotion ? 200 : LEAVE_TOTAL);
  }, [isLeaving, isReducedMotion, onEnter]);

  /** 자동 진입: 원이 시작된 뒤 정해진 시간이 지나면 닫는다. 탭이 가려진 동안은 남은 시간을 멈춰 두었다가 돌아오면 이어간다 */
  const autoDelay = autoEnterDelay ?? (isReducedMotion ? AUTO_ENTER_DELAY_REDUCED : AUTO_ENTER_DELAY);
  useEffect(() => {
    if (!isOpen || !isCircleRunning || isLeaving || autoDelay <= 0) return undefined;
    let remaining = autoDelay + COMPLETE_HOLD;
    let startedAt = Date.now();
    let timer = setTimeout(handleEnter, remaining);

    const handleVisibility = () => {
      if (document.hidden) {
        clearTimeout(timer);
        remaining = Math.max(0, remaining - (Date.now() - startedAt));
      } else {
        startedAt = Date.now();
        timer = setTimeout(handleEnter, remaining);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isOpen, isCircleRunning, isLeaving, autoDelay, handleEnter]);

  /** 열려 있는 동안 뒤 화면 스크롤을 막고, 어디서든 Enter, Space로 열 수 있게 한다 */
  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleEnter();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleEnter]);

  if (!isOpen) return null;

  return (
    <Box
      component="section"
      id={ id }
      role="button"
      tabIndex={ 0 }
      aria-label={ storyGate.enterAriaLabel }
      onClick={ handleEnter }
      sx={ {
        position: 'fixed',
        inset: 0,
        zIndex: theme.zIndex.modal,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: isLeaving ? 'transparent' : 'background.default',
        transition: isLeaving && !isReducedMotion ? `background-color ${ PARTING_DURATION }ms ease ${ PARTING_DELAY + 170 }ms` : 'none',
        cursor: isLeaving ? 'default' : 'pointer',
        pointerEvents: isLeaving ? 'none' : 'auto',
        WebkitTapHighlightColor: 'transparent',
        outline: 'none',
        '&:focus-visible': { outline: '2px solid', outlineColor: 'secondary.main', outlineOffset: -8 },
        ...sx,
      } }
    >
      <FlowingColorField
        baseColor={ theme.palette.mist.base }
        cloudColor={ theme.palette.background.default }
        cloudOpacity={ 1 }
        tintColors={ [theme.palette.mist.sky] }
        tintOpacity={ 0.15 }
        blur={ 28 }
        isParting={ isLeaving }
        partingDuration={ PARTING_DURATION }
        partingDelay={ PARTING_DELAY }
        partingStagger={ PARTING_STAGGER }
      />
      <Box aria-hidden sx={ { position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' } }>
        <Box sx={ { position: 'absolute', ...BRANCH.sx } }>
          <BranchSilhouette
            src={ branchSilhouette }
            sx={ { height: '100%' } }
            color={ BRANCH.color }
            blur={ isMobile ? BRANCH.mobileBlur : BRANCH.blur }
            opacity={ isMobile ? BRANCH.mobileOpacity : BRANCH.opacity }
            isRevealed={ false }
            isFading={ isLeaving }
            fadeDelay={ SILHOUETTE_FADE_DELAY }
            fadeDuration={ SILHOUETTE_FADE_DURATION }
          />
        </Box>
      </Box>
      <PageContainer
        maxWidth="md"
        sx={ { position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', py: { xs: 4, md: 6 } } }
      >
        <Box sx={ { display: 'flex', justifyContent: 'center', pt: { xs: 1, md: 0 } } }>
          <Box sx={ { textAlign: 'center', ...textLayerSx } }>
            {/* 제목, 부제, 전시 기간, 장소는 하나의 덩어리로 안개처럼 천천히, 같은 순간에 나타난다 */}
            <FadeTransition isIn={ isTitleFontReady } delay={ TEXT_DELAY } duration={ TEXT_DURATION }>
              <Typography
                variant="h1"
                component="h1"
                sx={ { fontFamily: '"210 Fullmoon", serif', fontWeight: 400, textWrap: 'balance', color: '#202020', fontSize: 'clamp(1.9375rem, calc((9vw - 5px) * var(--text-fit, 1)), 4.6875rem)' } }
              >
                { storyGate.title }
              </Typography>
              <Typography
                variant="h5"
                component="p"
                sx={ (t) => ({ mt: 0.5, fontFamily: t.typography.fontFamily, fontWeight: 600, color: '#202020', fontSize: 'clamp(0.9375rem, calc((3.6vw - 5px) * var(--text-fit, 1)), 1.6875rem)' }) }
              >
                { storyGate.subtitle }
              </Typography>
              <Box sx={ { mt: { xs: 4, md: 5.5 }, color: '#202020' } }>
                <Typography component="p" sx={ { fontSize: { xs: '1.05rem', md: '1.375rem' }, fontWeight: 600, letterSpacing: '0.04em', lineHeight: 1.3 } }>
                  { exhibitionInfo.period }
                </Typography>
                <Typography component="p" sx={ { mt: 0, fontSize: { xs: '0.75rem', md: '0.875rem' }, fontWeight: 500, lineHeight: 1.3 } }>
                  { exhibitionInfo.place }
                </Typography>
              </Box>
            </FadeTransition>
          </Box>
        </Box>
        <Box sx={ { flex: 1 } } />
        <Box sx={ { mb: { xs: 9, md: 11 }, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, ...textLayerSx } }>
          { autoDelay > 0 && (
            <FadeTransition isIn={ isTitleFontReady } delay={ CIRCLE_DELAY } duration={ 800 }>
              <CircleProgress
                duration={ autoDelay }
                size={ isMobile ? 72 : 88 }
                isRunning={ isCircleRunning }
                isFinishing={ isLeaving }
              />
            </FadeTransition>
          ) }
          <FadeTransition isIn={ isTitleFontReady } delay={ CIRCLE_DELAY } duration={ 800 }>
            <Typography
              variant="caption"
              component="p"
              sx={ {
                textAlign: 'center',
                color: 'text.secondary',
                animation: isCircleRunning && !isLeaving && !isReducedMotion ? `${ blink } ${ BLINK_DURATION }ms ease-in-out infinite` : 'none',
              } }
            >
              { storyGate.enterLabel }
            </Typography>
          </FadeTransition>
        </Box>
      </PageContainer>
    </Box>
  );
}

export default StoryGateSection;
