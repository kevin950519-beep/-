import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { keyframes } from '@mui/material/styles';

/** 안개 속에서 떠오르듯, 아주 흐린 상태에서 제 흐림과 투명도로 선명해진다 (CSS 변수로 목표값 전달) */
const mistIn = keyframes`
  from { opacity: 0; filter: blur(calc(var(--mist-blur) + 24px)); }
  to { opacity: var(--mist-opacity); filter: blur(var(--mist-blur)); }
`;

/** 가지 끝이 한 번 좌우로 기울었다 돌아온다. 회전 중심은 사과 쪽이라 사과는 거의 움직이지 않는다 */
const sway = keyframes`
  0% { transform: rotate(0deg); }
  30% { transform: rotate(var(--sway-angle)); }
  65% { transform: rotate(calc(var(--sway-angle) * -0.7)); }
  100% { transform: rotate(0deg); }
`;

/**
 * BranchSilhouette 컴포넌트
 *
 * 작품(여인상과 가지 등)의 윤곽을 단색 마스크로 보여 준다. 색은 theme 토큰이고, 모양은 알파 채널 PNG에서 온다.
 * 블러와 낮은 투명도로 안개 속에 어렴풋이 보이는 실루엣으로 쓴다. 처음에는 안개에서 떠오르듯 선명해지고(isRevealed),
 * 한 번 일렁인(isSwaying) 뒤 늦게 옅어질(isFading) 수 있다. 동작 줄이기 설정에서는 드러남과 일렁임 없이 정지한 채 투명도만 바뀐다.
 *
 * Props:
 * @param {string} src - 윤곽이 담긴 알파 채널 이미지 주소 [Required]
 * @param {number} aspectRatio - 이미지 가로/세로 비율 [Optional, 기본값: 518 / 475]
 * @param {string} color - 실루엣 색 (theme 색 토큰 경로) [Optional, 기본값: 'text.primary']
 * @param {number} opacity - 실루엣 투명도 0~1 [Optional, 기본값: 0.3]
 * @param {number} blur - 가장자리 흐림 (px). 클수록 멀리 있는 안개처럼 보인다 [Optional, 기본값: 6]
 * @param {boolean} isRevealed - 안개에서 떠오르듯 나타나는 동작 사용 [Optional, 기본값: true]
 * @param {number} revealDelay - 드러남 시작 지연 (ms) [Optional, 기본값: 0]
 * @param {number} revealDuration - 드러남 시간 (ms) [Optional, 기본값: 2400]
 * @param {boolean} isSwaying - true가 되면 한 번 일렁인다 [Optional, 기본값: false]
 * @param {number} swayAngle - 일렁임 각도 (deg) [Optional, 기본값: 2.5]
 * @param {string} swayOrigin - 일렁임 회전 중심 (CSS transform-origin) [Optional, 기본값: '65% 95%']
 * @param {number} swayDuration - 일렁임 시간 (ms) [Optional, 기본값: 500]
 * @param {boolean} isFading - true가 되면 옅어진다 [Optional, 기본값: false]
 * @param {number} fadeDelay - 옅어짐 시작 지연 (ms) [Optional, 기본값: 0]
 * @param {number} fadeDuration - 옅어짐 시간 (ms) [Optional, 기본값: 600]
 * @param {string} label - 스크린리더용 설명. 비우면 장식으로 숨긴다 [Optional]
 * @param {object} sx - 추가 스타일 (높이를 정해 주면 폭은 비율로 따라온다) [Optional]
 *
 * Example usage:
 * <BranchSilhouette src={ branch } sx={ { height: 480 } } isSwaying={ isLeaving } isFading={ isLeaving } fadeDelay={ 1200 } />
 */
export function BranchSilhouette({
  src,
  aspectRatio = 518 / 475,
  color = 'text.primary',
  opacity = 0.3,
  blur = 6,
  isRevealed = true,
  revealDelay = 0,
  revealDuration = 2400,
  isSwaying = false,
  swayAngle = 2.5,
  swayOrigin = '65% 95%',
  swayDuration = 500,
  isFading = false,
  fadeDelay = 0,
  fadeDuration = 600,
  label,
  sx,
}) {
  const isReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isMotion = !isReducedMotion;

  return (
    <Box
      role={ label ? 'img' : undefined }
      aria-label={ label }
      aria-hidden={ label ? undefined : true }
      sx={ {
        aspectRatio: `${ aspectRatio }`,
        /** 일렁임의 중심: 사과가 있는 아래쪽 */
        transformOrigin: swayOrigin,
        '--sway-angle': `${ swayAngle }deg`,
        /** 옅어짐은 바깥에서 건다(안쪽의 떠오름 애니메이션이 투명도를 붙잡고 있어서) */
        opacity: isFading ? 0 : 1,
        transition: isMotion ? `opacity ${ isFading ? fadeDuration : 0 }ms ease ${ isFading ? fadeDelay : 0 }ms` : 'opacity 200ms ease',
        animation: isMotion && isSwaying ? `${ sway } ${ swayDuration }ms ease-in-out both` : 'none',
        ...sx,
      } }
    >
      {/* 블러와 투명도는 마스크 바깥 층에서 건다(filter는 mask보다 먼저 적용되어 안쪽에 두면 번지지 않는다) */}
      <Box
        sx={ {
          width: '100%',
          height: '100%',
          '--mist-blur': `${ blur }px`,
          '--mist-opacity': opacity,
          opacity,
          filter: `blur(${ blur }px)`,
          animation: isMotion && isRevealed ? `${ mistIn } ${ revealDuration }ms ease-out ${ revealDelay }ms both` : 'none',
        } }
      >
        <Box
          sx={ {
            width: '100%',
            height: '100%',
            backgroundColor: color,
            maskImage: `url(${ src })`,
            WebkitMaskImage: `url(${ src })`,
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
          } }
        />
      </Box>
    </Box>
  );
}

export default BranchSilhouette;
