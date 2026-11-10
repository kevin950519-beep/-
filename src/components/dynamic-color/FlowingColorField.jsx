import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { keyframes } from '@mui/material/styles';

/** 덩어리가 제자리 근처에서 아주 천천히 오가며 크기가 변한다 (CSS 변수로 방향과 크기 전달) */
const drift = keyframes`
  from { transform: translate3d(0, 0, 0) rotate(var(--r)) scale(1); }
  to { transform: translate3d(var(--dx), var(--dy), 0) rotate(var(--r)) scale(var(--s)); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

/** 흰 안개 덩어리. 구름 모양이 보이도록 화면 폭의 3분의 1 안팎으로 여덟 덩어리를 고르게 흩어 두고, 덩어리 사이로 바탕이 보이게 한다. 이동 거리는 짧게 둔다 */
const CLOUDS = [
  { top: '-6%', left: '-8%', size: '38%', dx: '9vw', dy: '6vh', s: 1.12, speed: 1 },
  { top: '-10%', left: '38%', size: '34%', dx: '-8vw', dy: '8vh', s: 0.92, speed: 1.15 },
  { top: '2%', left: '70%', size: '36%', dx: '-7vw', dy: '7vh', s: 1.1, speed: 0.95 },
  { top: '30%', left: '10%', size: '32%', dx: '8vw', dy: '-6vh', s: 1.08, speed: 1.2 },
  { top: '34%', left: '55%', size: '38%', dx: '-9vw', dy: '-6vh', s: 0.95, speed: 1.05 },
  { top: '62%', left: '-6%', size: '36%', dx: '10vw', dy: '-5vh', s: 1.1, speed: 0.9 },
  { top: '66%', left: '34%', size: '32%', dx: '-6vw', dy: '-7vh', s: 1.12, speed: 1.1 },
  { top: '58%', left: '72%', size: '38%', dx: '-9vw', dy: '-5vh', s: 0.9, speed: 1.25 },
];

/**
 * 안개 위에 얹는 색 띠. 동그란 덩어리로 보이지 않도록 가로로 길고 비스듬한 타원 셋을 서로 겹쳐 하나의 흐름(flow)처럼 이어 둔다.
 * ratio는 가로세로비, rotate는 기울기, blur는 이 띠만의 블러(px)다. 모두 같은 색을 쓰고, 이동은 가로로 길게 한다.
 */
const TINTS = [
  { top: '6%', left: '-18%', size: '100%', ratio: '3 / 1', rotate: '-14deg', blur: 70, dx: '18vw', dy: '4vh', s: 1.08, speed: 1.1 },
  { top: '36%', left: '8%', size: '110%', ratio: '3.4 / 1', rotate: '-10deg', blur: 70, dx: '-16vw', dy: '-4vh', s: 1.05, speed: 1.3 },
  { top: '62%', left: '-12%', size: '104%', ratio: '3 / 1', rotate: '-16deg', blur: 70, dx: '14vw', dy: '-5vh', s: 1.1, speed: 1 },
];

/**
 * FlowingColorField 컴포넌트
 *
 * 부모(position: relative 또는 fixed)를 가득 채우는 몽환적인 흰 안개 배경.
 * 옅은 바탕색 위에 큰 흰 덩어리를 블러로 겹쳐 구름처럼 만들고, 그 위에 가로로 길게 이어진 색 띠(flow)를 아주 옅게 얹는다.
 * 클릭을 막지 않고 스크린리더에서 숨긴다. 동작 줄이기 설정에서는 움직임 없이 정지한다.
 * isParting이 true가 되면 덩어리들이 화면 중심에서 바깥으로 밀려 나가며 옅어지고(안개가 걷힘), 마지막에 바탕색도 옅어져 뒤 화면이 드러난다.
 * 동작 줄이기 설정에서는 이동 없이 짧게 투명도만 바뀐다.
 *
 * Props:
 * @param {string} baseColor - 바탕색 (옅은 회청색 권장) [Required]
 * @param {string} cloudColor - 안개 덩어리 색 [Optional, 기본값: '#FFFFFF']
 * @param {string[]} tintColors - 안개 위에 옅게 얹는 색 띠 색 목록 (앞에서부터 배정, 모자라면 반복, 띠는 3개) [Optional, 기본값: []]
 * @param {number} cloudOpacity - 안개 덩어리 투명도 0~1 [Optional, 기본값: 0.95]
 * @param {number} tintOpacity - 색 빛 투명도 0~1 [Optional, 기본값: 0.18]
 * @param {number} blur - 블러 크기 (px) [Optional, 기본값: 36]
 * @param {number} duration - 한 방향 이동 시간 (초). 덩어리마다 배율이 곱해진다 [Optional, 기본값: 42]
 * @param {boolean} isParting - true가 되면 안개가 걷힌다 [Optional, 기본값: false]
 * @param {number} partingDuration - 덩어리 하나가 걷히는 시간 (ms) [Optional, 기본값: 1300]
 * @param {number} partingDelay - 걷힘 시작 지연 (ms) [Optional, 기본값: 0]
 * @param {number} partingStagger - 덩어리 사이 시작 시차 (ms) [Optional, 기본값: 80]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <FlowingColorField baseColor="#ECEBE9" />
 */
function FlowingColorField({
  baseColor,
  cloudColor = '#FFFFFF',
  tintColors = [],
  cloudOpacity = 0.95,
  tintOpacity = 0.18,
  blur = 36,
  duration = 42,
  isParting = false,
  partingDuration = 1300,
  partingDelay = 0,
  partingStagger = 80,
  sx = {},
}) {
  const isReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  /** 덩어리 중심이 화면 중심에서 멀수록 바깥으로 더 멀리 밀려 나간다 */
  const getPartingOffset = (blob) => {
    const centerX = parseFloat(blob.left) + parseFloat(blob.size) / 2;
    const centerY = parseFloat(blob.top) + parseFloat(blob.size) / 2;
    return { x: (centerX - 50) * 1.1, y: (centerY - 50) * 1.1 };
  };

  const renderBlob = (blob, key, color, opacity, order) => {
    const offset = getPartingOffset(blob);
    const blobDelay = partingDelay + order * partingStagger;
    return (
      <Box
        key={ key }
        sx={ {
          position: 'absolute',
          inset: 0,
          opacity: isParting ? 0 : 1,
          transform: isParting && !isReducedMotion ? `translate3d(${ offset.x }vw, ${ offset.y }vh, 0)` : 'none',
          transition: isReducedMotion
            ? `opacity 200ms ease`
            : `transform ${ partingDuration }ms ease-in ${ blobDelay }ms, opacity ${ partingDuration }ms ease-in ${ blobDelay }ms`,
        } }
      >
        <Box
          sx={ {
            position: 'absolute',
            top: blob.top,
            left: blob.left,
            width: blob.size,
            aspectRatio: blob.ratio || '1 / 1',
            borderRadius: '50%',
            backgroundColor: color,
            opacity,
            filter: `blur(${ blob.blur || blur }px)`,
            '--dx': blob.dx,
            '--dy': blob.dy,
            '--s': blob.s,
            '--r': blob.rotate || '0deg',
            animation: `${ drift } ${ duration * blob.speed }s ease-in-out infinite alternate`,
            willChange: 'transform',
            '@media (prefers-reduced-motion: reduce)': { animation: 'none', transform: 'rotate(var(--r))' },
          } }
        />
      </Box>
    );
  };

  /** 마지막 덩어리가 걷힌 뒤 바탕색이 옅어지도록 시작을 늦춘다 */
  const baseFadeDelay = isReducedMotion ? 0 : partingDelay + Math.round(partingDuration * 0.4);
  const baseFadeDuration = isReducedMotion ? 200 : Math.round(partingDuration * 0.9);

  return (
    <Box
      aria-hidden
      sx={ {
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        animation: `${ fadeIn } 3s ease-out both`,
        '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
        ...sx,
      } }
    >
      <Box
        sx={ {
          position: 'absolute',
          inset: 0,
          backgroundColor: baseColor,
          opacity: isParting ? 0 : 1,
          transition: `opacity ${ baseFadeDuration }ms ease ${ baseFadeDelay }ms`,
        } }
      />
      { CLOUDS.map((blob, index) => renderBlob(blob, `cloud-${ index }`, cloudColor, cloudOpacity, index)) }
      { tintColors.length > 0 && TINTS.map((blob, index) => renderBlob(blob, `tint-${ index }`, tintColors[index % tintColors.length], tintOpacity, index + CLOUDS.length)) }
    </Box>
  );
}

export default FlowingColorField;
