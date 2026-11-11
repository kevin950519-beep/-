import { useCallback, useSyncExternalStore } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

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
 * 모바일(md 미만)에서는 항상 헤더에 붙은 상태로 고정되고 화면 옆으로 띄울 수 없다(isFixed). 웹은 그대로다.
 * 상태는 이 탭을 닫을 때까지 유지된다(sessionStorage). 상자(StatusFloatSection)와 헤더(HeaderSection)가 같은 값을 본다.
 *
 * @returns {{ isDocked: boolean, isFixed: boolean, dock: function, undock: function }}
 * isDocked: 헤더에 붙어 있으면 true, isFixed: 모바일이라 헤더에 고정(되돌릴 수 없음)이면 true, dock(): 헤더로 옮기기, undock(): 화면 옆으로 다시 띄우기
 *
 * Example usage:
 * const { isDocked, dock, undock } = useStatusDock();
 */
export function useStatusDock() {
  const theme = useTheme();
  const isFixed = !useMediaQuery(theme.breakpoints.up('md'));
  const storedDocked = useSyncExternalStore(subscribe, () => isDockedValue, () => false);
  const dock = useCallback(() => setDocked(true), []);
  const undock = useCallback(() => {
    if (!isFixed) setDocked(false);
  }, [isFixed]);
  return { isDocked: isFixed || storedDocked, isFixed, dock, undock };
}

export default useStatusDock;
