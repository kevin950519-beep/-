import { useEffect, useMemo, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

/** 선 굵기(px) */
const STROKE = 2;
/** 물결 개수와 높낮이(px) */
const WAVE_COUNT = 10;
const WAVE_AMPLITUDE = 2.5;
/** 물결 선을 이루는 점 개수(많을수록 부드럽다) */
const WAVE_POINTS = 240;
/** 마무리를 앞당길 때 남은 부분을 닫는 시간(ms) */
const FINISH_DURATION = 300;

/**
 * CircleProgress 컴포넌트
 *
 * 물결처럼 구불구불한 원 하나가 12시 방향에서 시계 방향으로 한 바퀴 그려지는 진행 표시. 선 끝은 둥글고 안은 채우지 않는다.
 * 원 가운데에 퍼센트(0%에서 100%)가 선이 그려지는 속도와 같이 올라가고, 100%가 되면 글자 색이 completeColor(검은색)로 바뀐다. 탭이 가려지면 멈췄다가 돌아오면 이어간다.
 * 동작 줄이기 설정에서는 완성된 원만 정적으로 보여 주고 퍼센트는 보이지 않는다.
 *
 * Props:
 * @param {number} duration - 한 바퀴 그려지는 시간(ms) [Optional, 기본값: 5000]
 * @param {number} size - 원 지름(px) [Optional, 기본값: 88]
 * @param {string} completeColor - 100%가 되었을 때 퍼센트 글자 색 [Optional, 기본값: '#202020']
 * @param {boolean} isRunning - true가 되면 시작 [Optional, 기본값: true]
 * @param {boolean} isFinishing - true가 되면 남은 부분을 0.3초에 닫는다 [Optional, 기본값: false]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <CircleProgress duration={ 5000 } isRunning={ isReady } isFinishing={ isLeaving } />
 */
export function CircleProgress({
  duration = 5000,
  size = 88,
  completeColor = '#202020',
  isRunning = true,
  isFinishing = false,
  sx,
}) {
  const theme = useTheme();
  const isReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const animationRef = useRef(null);

  /** 물결 원 경로(12시 방향에서 시작해 시계 방향). 길이를 1로 맞춰(pathLength) 그리기 진행도를 0~1로 다룬다 */
  const wavePath = useMemo(() => {
    const center = size / 2;
    const baseRadius = (size - STROKE) / 2 - WAVE_AMPLITUDE;
    const points = Array.from({ length: WAVE_POINTS }, (_, index) => {
      const angle = -Math.PI / 2 + (index / WAVE_POINTS) * 2 * Math.PI;
      const radius = baseRadius + WAVE_AMPLITUDE * Math.sin(WAVE_COUNT * (angle + Math.PI / 2));
      return `${ (center + radius * Math.cos(angle)).toFixed(2) } ${ (center + radius * Math.sin(angle)).toFixed(2) }`;
    });
    return `M ${ points.join(' L ') } Z`;
  }, [size]);

  /** 시작: 선이 그려진다. 탭이 가려지면 멈춘다 */
  useEffect(() => {
    if (!isRunning || isReducedMotion || !ringRef.current) return undefined;
    const animation = ringRef.current.animate(
      [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }],
      { duration, easing: 'linear', fill: 'both' },
    );
    animationRef.current = animation;

    /** 퍼센트 글자는 선이 그려진 비율을 따라 올라간다. 리렌더 없이 글자만 바꾼다 */
    let frameId = 0;
    const updateLabel = () => {
      const progress = duration > 0 ? Math.min(1, (Number(animation.currentTime) || 0) / duration) : 1;
      if (labelRef.current) {
        labelRef.current.textContent = `${ Math.floor(progress * 100) }%`;
        labelRef.current.style.color = progress >= 1 ? completeColor : '';
      }
      if (progress < 1) frameId = requestAnimationFrame(updateLabel);
    };
    updateLabel();

    const handleVisibility = () => {
      if (document.hidden) {
        animation.pause();
      } else {
        animation.play();
        cancelAnimationFrame(frameId);
        updateLabel();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelAnimationFrame(frameId);
      document.removeEventListener('visibilitychange', handleVisibility);
      animation.cancel();
      animationRef.current = null;
    };
  }, [isRunning, isReducedMotion, duration, completeColor]);

  /** 마무리 앞당김: 남은 시간이 FINISH_DURATION 안에 끝나도록 재생 속도를 올린다 */
  useEffect(() => {
    const animation = animationRef.current;
    if (!isFinishing || !animation) return;
    const remaining = Math.max(1, duration - (Number(animation.currentTime) || 0));
    animation.playbackRate = Math.max(1, remaining / FINISH_DURATION);
  }, [isFinishing, duration]);

  return (
    <Box
      aria-hidden
      sx={ { position: 'relative', display: 'block', width: size, height: size, color: 'progress.main', ...sx } }
    >
      <svg width={ size } height={ size } viewBox={ `0 0 ${ size } ${ size }` } style={ { display: 'block' } }>
        <path
          d={ wavePath }
          fill="none"
          stroke={ theme.palette.progress.main }
          strokeWidth={ STROKE }
          strokeLinejoin="round"
          opacity={ 0.15 }
        />
        <path
          ref={ ringRef }
          d={ wavePath }
          fill="none"
          stroke={ theme.palette.progress.main }
          strokeWidth={ STROKE }
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={ 1 }
          strokeDasharray={ 1 }
          strokeDashoffset={ isReducedMotion ? 0 : 1 }
        />
      </svg>
      { !isReducedMotion && (
        <Typography
          ref={ labelRef }
          component="span"
          sx={ {
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.secondary',
            fontSize: size >= 88 ? '1rem' : '0.9375rem',
            transition: 'color 200ms ease',
            fontWeight: 500,
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1,
          } }
        >
          0%
        </Typography>
      ) }
    </Box>
  );
}

export default CircleProgress;
