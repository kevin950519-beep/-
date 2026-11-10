import { useEffect } from 'react';

/** 눌러서 막을 키: 세로 스크롤을 일으키는 키 */
const SCROLL_KEYS = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ', 'Spacebar'];

/**
 * useScrollLockOnce 훅
 *
 * 요소가 화면에 처음 보이면 요소를 화면 가운데로 부드럽게 맞춘 뒤, 정해진 시간 동안 스크롤을 멈춘다.
 * 시간이 지나면 풀리고, 한 번만 동작한다(다시 올라와도 잠그지 않는다). 모션이 끝나기 전에 지나쳐 읽지 못하는 것을 막는 용도다.
 * 마우스 휠, 터치 스크롤, 스크롤 키를 막고, 관성으로 밀려도 잠근 위치로 되돌린다.
 *
 * @param {object} options
 * @param {object} options.targetRef - 잠글 때 화면 가운데에 맞출 요소 ref [Required]
 * @param {number} options.durationMs - 요소가 처음 보인 뒤 스크롤을 멈춰 둘 시간(ms) [Required]
 * @param {boolean} options.isEnabled - false면 아무것도 하지 않는다(동작 줄이기 설정 등) [Optional, 기본값: true]
 * @param {number} options.threshold - 처음 보인 것으로 보는 노출 비율 0~1 [Optional, 기본값: 0.35]
 *
 * Example usage:
 * useScrollLockOnce({ targetRef, durationMs: 5000, isEnabled: !isReducedMotion });
 */
export function useScrollLockOnce({ targetRef, durationMs, isEnabled = true, threshold = 0.35 }) {
  useEffect(() => {
    const element = targetRef.current;
    if (!isEnabled || !element) return undefined;

    let timer = null;
    let release = () => {};

    const lock = () => {
      const rect = element.getBoundingClientRect();
      const lockY = Math.max(0, window.scrollY + rect.top + rect.height / 2 - window.innerHeight / 2);
      let hasArrived = false;

      const blockEvent = (event) => event.preventDefault();
      const blockKey = (event) => {
        if (SCROLL_KEYS.includes(event.key)) event.preventDefault();
      };
      /** 맞춰 가는 동안은 그대로 두고, 도착한 뒤에는 관성으로 밀려도 잠근 위치로 되돌린다 */
      const handleScroll = () => {
        const distance = Math.abs(window.scrollY - lockY);
        if (distance < 2) hasArrived = true;
        if (hasArrived && distance > 1) window.scrollTo(0, lockY);
      };

      window.addEventListener('wheel', blockEvent, { passive: false });
      window.addEventListener('touchmove', blockEvent, { passive: false });
      window.addEventListener('keydown', blockKey);
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.scrollTo({ top: lockY, behavior: 'smooth' });

      release = () => {
        window.removeEventListener('wheel', blockEvent);
        window.removeEventListener('touchmove', blockEvent);
        window.removeEventListener('keydown', blockKey);
        window.removeEventListener('scroll', handleScroll);
        release = () => {};
      };
      timer = setTimeout(() => release(), durationMs);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        lock();
      },
      { threshold },
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
      release();
    };
  }, [targetRef, durationMs, isEnabled, threshold]);
}

export default useScrollLockOnce;
