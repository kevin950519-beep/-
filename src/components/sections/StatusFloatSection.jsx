import { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import CloseIcon from '@mui/icons-material/Close';
import { alpha } from '@mui/material/styles';
import { useStatusDock } from '../navigation/useStatusDock';
import { useDragToTarget } from './useDragToTarget';
import { getStatusText } from '../../utils/getStatusText';
import { exhibitionInfo } from '../../data/uyeonhan-majung/exhibitionInfo';
import { content } from '../../data/uyeonhan-majung/content';

/** 위아래로 옮긴 위치를 탭을 닫을 때까지 기억하는 키, 위쪽 한계(헤더 높이 여유), 아래쪽 여백, 방향키 한 번에 옮기는 거리(px) */
const SHIFT_KEY = 'status-float-shift-y';
const TOP_LIMIT = 72;
const BOTTOM_MARGIN = 16;
const KEY_STEP = 24;
/** 빙판처럼 미끄러지는 느낌: 놓은 뒤 속도(px/ms)에 곱해 더 나아갈 거리를 정하는 시간(ms), 멈추기까지 걸리는 시간(ms), 미는 동안 따라오는 지연(ms) */
const GLIDE_REACH = 420;
const GLIDE_DURATION = 1300;
const FOLLOW_LAG = 180;

/** 저장된 위아래 이동 거리를 읽는다. 저장소를 못 쓰면 0 */
function readShift() {
  try {
    return Number(sessionStorage.getItem(SHIFT_KEY)) || 0;
  } catch {
    return 0;
  }
}

/**
 * StatusFloatSection (02 2.4절 "전시 상태")
 *
 * 화면 왼쪽 가장자리의 유리 느낌(글래스모피즘) 상자. 윗줄은 큰 글자(D-10, 3일째 등),
 * 아랫줄은 작은 안내(전시 준비 중, 전시 중 등)다. 스크롤 내내 따라다니고 사라지지 않는다.
 * 첫 화면과 작품 확대 팝업은 이보다 위 층이라 열려 있는 동안 가린다. 가볍게 누르는 것에는 반응하지 않는다(이동 없음).
 * 손가락이나 마우스로 위나 아래로 밀면(스와이프) 그 방향으로 약간 늦게 따라 움직이고, 놓으면 미는 속도만큼 빙판처럼 미끄러지다 서서히 멈춘다(헤더 아래부터 화면 아래 여백 사이로 제한, 탭을 닫을 때까지 유지). 위, 아래 방향키로도 옮길 수 있다.
 * 옮기고 싶으면 꾹 눌러 화면 아래 가운데에 나타나는 X로 끌어다 놓는다(놓지 못하면 제자리로 돌아온다). 그러면 헤더 왼쪽 위로 붙고(HeaderSection의 상태 칩),
 * 그 칩을 누르면 다시 화면 옆으로 떠오른다. Delete 키로도 헤더로 옮긴다. 이 위치는 탭을 닫을 때까지 유지된다(sessionStorage).
 *
 * Props:
 * @param {Date} now - 전시 상태 계산 기준 시각 (스토리 확인용) [Optional, 기본값: 지금]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <StatusFloatSection />
 */
export function StatusFloatSection({ now, sx }) {
  const { shell } = content.landing;
  const targetRef = useRef(null);
  const { isDocked, dock } = useStatusDock();
  const isReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const boxRef = useRef(null);
  const [shiftY, setShiftY] = useState(readShift);
  /** 위아래 이동 범위를 구하는 데 쓰는 상자 높이와 화면 높이(px). 렌더 밖에서 재서 상태로 둔다 */
  const [size, setSize] = useState({ box: 64, viewport: typeof window === 'undefined' ? 800 : window.innerHeight });

  /** 화면 가운데(top 50%)에서 위아래로 옮길 수 있는 범위로 제한한다: 위는 헤더 아래, 아래는 화면 끝 여백 */
  const clampShift = useCallback((value) => {
    const room = size.viewport / 2 - size.box / 2;
    return Math.min(room - BOTTOM_MARGIN, Math.max(-(room - TOP_LIMIT), value));
  }, [size]);

  const commitShift = useCallback((value) => {
    const next = clampShift(value);
    setShiftY(next);
    try {
      sessionStorage.setItem(SHIFT_KEY, String(next));
    } catch {
      /** 저장소를 못 써도 이번 화면에서는 위치가 유지된다 */
    }
  }, [clampShift]);

  /** 상자와 화면 크기를 재고, 화면 크기가 바뀌면 다시 잰다 */
  useEffect(() => {
    const measure = () => setSize({ box: boxRef.current?.offsetHeight ?? 64, viewport: window.innerHeight });
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [isDocked]);

  const { dragProps, offset, isDragging, isOverTarget, moveY, isMoving } = useDragToTarget({
    targetRef,
    onDrop: dock,
    onMoveEnd: (dy, velocity) => commitShift(shiftY + dy + (isReducedMotion ? 0 : velocity * GLIDE_REACH)),
  });
  const liveShift = clampShift(shiftY + moveY);
  const { title, caption } = getStatusText(shell.status, exhibitionInfo.period, now);

  if (isDocked) return null;

  return (
    <>
    <Box
      ref={ targetRef }
      aria-hidden
      sx={ (theme) => ({
        position: 'fixed',
        left: '50%',
        bottom: 'max(32px, env(safe-area-inset-bottom))',
        zIndex: theme.zIndex.appBar,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 56,
        height: 56,
        borderRadius: '50%',
        color: 'common.white',
        backgroundColor: isOverTarget ? 'error.main' : alpha(theme.palette.common.black, 0.6),
        opacity: isDragging ? 1 : 0,
        transform: `translateX(-50%) scale(${ isOverTarget ? 1.25 : 1 })`,
        transition: isReducedMotion ? 'none' : 'opacity 200ms ease, transform 150ms ease, background-color 150ms ease',
        pointerEvents: 'none',
      }) }
    >
      <CloseIcon />
    </Box>
    <Link
      ref={ boxRef }
      { ...dragProps }
      onKeyDown={ (event) => {
        if (event.key === 'Delete' || event.key === 'Backspace') {
          event.preventDefault();
          dock();
        } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
          event.preventDefault();
          commitShift(shiftY + (event.key === 'ArrowUp' ? -KEY_STEP : KEY_STEP));
        }
      } }
      aria-describedby="status-hide-hint"
      onClick={ (event) => event.preventDefault() }
      tabIndex={ 0 }
      underline="none"
      aria-label={ `${ title }, ${ caption }` }
      sx={ (theme) => ({
        position: 'fixed',
        left: { xs: 8, md: 16 },
        top: '50%',
        transform: `translate(${ offset.x }px, calc(-50% + ${ liveShift + offset.y }px)) scale(${ isDragging ? (isOverTarget ? 0.7 : 1.06) : 1 })`,
        transition: isDragging ? 'none' : isReducedMotion ? 'none' : isMoving ? `transform ${ FOLLOW_LAG }ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 200ms ease` : `transform ${ GLIDE_DURATION }ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease`,
        opacity: isOverTarget ? 0.7 : 1,
        touchAction: 'none',
        userSelect: 'none',
        WebkitTouchCallout: 'none',
        cursor: isDragging || isMoving ? 'grabbing' : 'default',
        boxShadow: isDragging ? `0 12px 28px ${ alpha(theme.palette.common.black, 0.25) }` : undefined,
        zIndex: theme.zIndex.appBar,
        display: 'block',
        px: { xs: 1.25, md: 2 },
        py: { xs: 1, md: 1.5 },
        borderRadius: '12px',
        color: 'text.primary',
        textAlign: 'left',
        backgroundColor: alpha(theme.palette.common.white, 0.5),
        backdropFilter: 'blur(12px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(12px) saturate(1.4)',
        border: `1px solid ${ alpha(theme.palette.common.white, 0.7) }`,
        ...(!isDragging && { boxShadow: `0 4px 16px ${ alpha(theme.palette.common.black, 0.08) }` }),
        ...sx,
      }) }
    >
      <Box component="span" sx={ { display: 'block' } }>
        <Typography
          component="span"
          sx={ { display: 'block', fontSize: { xs: '1.25rem', md: '1.5rem' }, fontWeight: 500, lineHeight: 1.2 } }
        >
          { title }
        </Typography>
        <Typography
          component="span"
          sx={ { display: 'block', mt: 0.25, fontSize: { xs: '0.6875rem', md: '0.75rem' }, color: 'text.secondary', lineHeight: 1.4 } }
        >
          { caption }
        </Typography>
      </Box>
    </Link>
    <Box id="status-hide-hint" sx={ { position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clipPath: 'inset(50%)' } }>
      { shell.statusHideHint }
    </Box>
    </>
  );
}

export default StatusFloatSection;
