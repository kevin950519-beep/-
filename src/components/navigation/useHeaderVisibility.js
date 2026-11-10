import { useEffect, useState } from 'react';

/** 이 거리(px)보다 작은 스크롤 움직임은 방향 판단에서 무시한다 */
const MOVE_THRESHOLD = 6;

/** 이 높이(px) 안쪽은 맨 위로 보고 항상 보인다 */
const TOP_ZONE = 8;

/**
 * useHeaderVisibility
 *
 * 헤더를 보일지 정한다. 페이지 맨 위에서는 항상 보이고, 내리면 숨고 올리면 다시 나타난다.
 *
 * @returns {boolean} 헤더를 보일지
 *
 * Example usage:
 * const isVisible = useHeaderVisibility();
 */
export function useHeaderVisibility() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY;

      if (y <= TOP_ZONE) {
        setIsVisible(true);
      } else if (delta > MOVE_THRESHOLD) {
        setIsVisible(false);
      } else if (delta < -MOVE_THRESHOLD) {
        setIsVisible(true);
      }

      if (Math.abs(delta) > MOVE_THRESHOLD) lastY = y;
    };

    const handleScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return isVisible;
}

export default useHeaderVisibility;
