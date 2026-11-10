import { useEffect, useState } from 'react';

/**
 * useScrollSpy
 *
 * 지금 읽고 있는 구간의 id를 돌려준다. 화면 위에서 기준선(viewportRatio)을 지났거나 걸친
 * 구간 가운데 문서에서 가장 아래에 있는 구간이다. 어느 구간도 기준선을 지나지 않았으면 null이다.
 *
 * @param {string[]} sectionIds - 문서 위에서 아래 순서의 구간 id 목록 [Required]
 * @param {number} viewportRatio - 화면 위에서부터의 기준선 비율 [Optional, 기본값: 0.4]
 * @returns {string|null} 읽는 구간 id
 *
 * Example usage:
 * const activeId = useScrollSpy(['hero', 'works', 'visit-guide']);
 */
export function useScrollSpy(sectionIds, viewportRatio = 0.4) {
  const [activeId, setActiveId] = useState(null);
  const idsKey = sectionIds.join('|');

  useEffect(() => {
    const ids = idsKey.split('|');
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * viewportRatio;
      let current = null;
      ids.forEach((id) => {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= line) current = id;
      });
      setActiveId(current);
    };

    const handleScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [idsKey, viewportRatio]);

  return activeId;
}

export default useScrollSpy;
