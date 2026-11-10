import { useCallback, useSyncExternalStore } from 'react';

const DOCK_KEY = 'uyeonhan-status-docked';
const listeners = new Set();

const read = () => {
  try {
    return window.sessionStorage.getItem(DOCK_KEY) === '1';
  } catch {
    return false;
  }
};

let isDockedValue = typeof window === 'undefined' ? false : read();

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const setDocked = (next) => {
  isDockedValue = next;
  try {
    if (next) window.sessionStorage.setItem(DOCK_KEY, '1');
    else window.sessionStorage.removeItem(DOCK_KEY);
  } catch {
    /* 저장이 막힌 환경에서는 이번 방문 동안만 유지한다 */
  }
  listeners.forEach((listener) => listener());
};

/**
 * useStatusDock 훅
 *
 * 전시 상태 상자가 화면 옆에 떠 있는지(floating), 헤더 왼쪽 위에 붙었는지(docked)를 여러 구간이 함께 읽고 바꾸게 한다.
 * 상태는 이 탭을 닫을 때까지 유지된다(sessionStorage). 상자(StatusFloatSection)와 헤더(HeaderSection)가 같은 값을 본다.
 *
 * @returns {{ isDocked: boolean, dock: function, undock: function }}
 * isDocked: 헤더에 붙어 있으면 true, dock(): 헤더로 옮기기, undock(): 화면 옆으로 다시 띄우기
 *
 * Example usage:
 * const { isDocked, dock, undock } = useStatusDock();
 */
export function useStatusDock() {
  const isDocked = useSyncExternalStore(subscribe, () => isDockedValue, () => false);
  const dock = useCallback(() => setDocked(true), []);
  const undock = useCallback(() => setDocked(false), []);
  return { isDocked, dock, undock };
}

export default useStatusDock;
