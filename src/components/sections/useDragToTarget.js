import { useCallback, useEffect, useRef, useState } from 'react';

/** 꾹 누르는 동안 이 거리(px) 넘게 움직이면 꾹 누르기로 보지 않는다 */
const MOVE_TOLERANCE = 10;

/**
 * useDragToTarget 훅
 *
 * 요소를 꾹 누르면 끌 수 있는 상태가 되고, 목표 지점(X 표시)에 가져다 놓으면 onDrop을 부르는 동작을 만든다.
 * 목표에 닿지 못하고 놓으면 제자리로 돌아간다. 끈 직후에는 눌림(링크 이동)이 일어나지 않게 막는다.
 * 꾹 누르기 전에 위나 아래로 먼저 밀면(스와이프) 꾹 누르기는 취소되고, 요소가 그 방향으로만 따라 움직이는 이동 상태가 된다.
 * 놓으면 onMoveEnd(옮긴 거리 dy, 놓는 순간의 속도 velocity px/ms)를 부른다. 속도는 관성(미끄러짐)을 계산하는 데 쓴다. 위치를 어디에 둘지는 부르는 쪽이 정한다.
 * 터치와 마우스 모두 포인터 이벤트로 처리한다.
 *
 * @param {object} options
 * @param {object} options.targetRef - 목표 요소 ref (X 표시) [Required]
 * @param {function} options.onDrop - 목표에 놓았을 때 부를 함수 () => void [Required]
 * @param {function} options.onMoveEnd - 위아래로 밀어 옮기고 놓았을 때 부를 함수 (dy: number, velocity: number) => void [Optional]
 * @param {number} options.holdMs - 꾹 누르기로 인정하는 시간(ms) [Optional, 기본값: 450]
 * @param {number} options.snapRadius - 목표 중심에서 이 거리(px) 안이면 닿은 것으로 본다 [Optional, 기본값: 56]
 * @returns {{ dragProps: object, offset: {x:number,y:number}, isDragging: boolean, isOverTarget: boolean, moveY: number, isMoving: boolean }}
 * dragProps는 끌 요소에 그대로 펼쳐 준다. offset은 꾹 눌러 끄는 동안 옮긴 거리, moveY는 위아래로 미는 동안 옮긴 거리다.
 *
 * Example usage:
 * const { dragProps, offset, isDragging, isOverTarget } = useDragToTarget({ targetRef, onDrop });
 */
export function useDragToTarget({ targetRef, onDrop, onMoveEnd, holdMs = 450, snapRadius = 56 }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isOverTarget, setIsOverTarget] = useState(false);
  const [moveY, setMoveY] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const stateRef = useRef({ timer: null, startX: 0, startY: 0, isDragging: false, isOver: false, isMoving: false, moveY: 0, samples: [], pointerId: null, element: null, justDragged: false });

  useEffect(() => () => clearTimeout(stateRef.current.timer), []);

  const checkOver = useCallback((x, y) => {
    const rect = targetRef.current?.getBoundingClientRect();
    if (!rect) return false;
    return Math.hypot(x - (rect.left + rect.width / 2), y - (rect.top + rect.height / 2)) < snapRadius;
  }, [targetRef, snapRadius]);

  const handlePointerDown = (event) => {
    if (event.button) return;
    const state = stateRef.current;
    const element = event.currentTarget;
    const { pointerId } = event;
    state.pointerId = pointerId;
    state.element = element;
    state.startX = event.clientX;
    state.startY = event.clientY;
    clearTimeout(state.timer);
    state.timer = setTimeout(() => {
      state.isDragging = true;
      setIsDragging(true);
      element.setPointerCapture?.(pointerId);
      navigator.vibrate?.(15);
    }, holdMs);
  };

  const handlePointerMove = (event) => {
    const state = stateRef.current;
    const dx = event.clientX - state.startX;
    const dy = event.clientY - state.startY;
    if (state.isMoving) {
      state.moveY = dy;
      state.samples.push({ time: performance.now(), y: dy });
      if (state.samples.length > 8) state.samples.shift();
      setMoveY(dy);
      return;
    }
    if (!state.isDragging) {
      if (Math.hypot(dx, dy) > MOVE_TOLERANCE) {
        clearTimeout(state.timer);
        /** 꾹 누르기 전에 세로로 먼저 밀면 위아래 이동 상태가 된다 */
        if (onMoveEnd && Math.abs(dy) > Math.abs(dx)) {
          state.isMoving = true;
          state.moveY = dy;
          state.samples = [{ time: performance.now(), y: dy }];
          setIsMoving(true);
          setMoveY(dy);
          state.element?.setPointerCapture?.(state.pointerId);
        }
      }
      return;
    }
    const isOver = checkOver(event.clientX, event.clientY);
    state.isOver = isOver;
    setIsOverTarget(isOver);
    setOffset({ x: dx, y: dy });
  };

  const handlePointerEnd = () => {
    const state = stateRef.current;
    clearTimeout(state.timer);
    if (state.isMoving) {
      const finalY = state.moveY;
      /** 놓기 직전 0.1초 안의 움직임으로 속도(px/ms)를 구한다. 멈춰 있다 놓으면 0 */
      const now = performance.now();
      const recent = state.samples.filter((sample) => now - sample.time < 100);
      const velocity = recent.length > 1
        ? (recent[recent.length - 1].y - recent[0].y) / Math.max(1, recent[recent.length - 1].time - recent[0].time)
        : 0;
      state.samples = [];
      state.isMoving = false;
      state.moveY = 0;
      state.justDragged = true;
      setTimeout(() => { state.justDragged = false; }, 80);
      setIsMoving(false);
      setMoveY(0);
      onMoveEnd?.(finalY, velocity);
      return;
    }
    if (!state.isDragging) return;
    const shouldDrop = state.isOver;
    state.isDragging = false;
    state.isOver = false;
    state.justDragged = true;
    setTimeout(() => { state.justDragged = false; }, 80);
    setIsDragging(false);
    setIsOverTarget(false);
    setOffset({ x: 0, y: 0 });
    if (shouldDrop) onDrop();
  };

  /** 끈 직후 따라오는 눌림은 링크 이동으로 이어지지 않게 막는다 */
  const handleClickCapture = (event) => {
    if (!stateRef.current.justDragged) return;
    event.preventDefault();
    event.stopPropagation();
  };

  return {
    dragProps: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerEnd,
      onPointerCancel: handlePointerEnd,
      onClickCapture: handleClickCapture,
      onContextMenu: (event) => event.preventDefault(),
      draggable: false,
    },
    offset,
    isDragging,
    isOverTarget,
    moveY,
    isMoving,
  };
}

export default useDragToTarget;
