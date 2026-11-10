/**
 * 글자 크기 보정 유틸리티
 *
 * 인앱 브라우저(카카오톡 등)는 폰의 글자 크기 설정만큼 글자를 키워서 그리고,
 * 다른 브라우저(Threads, 크롬 등)는 키우지 않는다. 같은 CSS도 환경마다 다른 크기로 보인다.
 * 이 유틸은 현재 환경이 글자를 몇 배로 그리는지 재서, 최종 글자 크기가
 * TARGET_SCALE 배로 같아지도록 CSS 변수 --text-fit 을 설정한다.
 *
 * - html { font-size } 가 --text-fit 을 따르므로 rem 기반 글자는 자동으로 보정된다.
 * - vw 기반 글자는 calc(... * var(--text-fit, 1)) 로 직접 곱한다.
 * - 측정에 실패하면 보정하지 않는다(--text-fit: 1).
 * - 데스크톱 폭(md 이상)에서는 보정하지 않는다.
 *
 * TODO: 카카오톡 확대율을 바꾸면 TARGET_SCALE 만 고친다.
 */

/** 모든 환경에서 맞출 최종 글자 배율. 카카오톡 화면 실측값 */
const TARGET_SCALE = 1.37;

/** 이 폭(px) 이상이면 보정하지 않는다(MUI md 기준) */
const MAX_FIT_WIDTH = 900;

/** 측정값이 이 범위를 벗어나면 신뢰하지 않고 보정하지 않는다 */
const MIN_MEASURED = 0.8;
const MAX_MEASURED = 2.5;

/** 보정 배율의 상하한 */
const MIN_FIT = 0.7;
const MAX_FIT = 1.6;

const PROBE_TEXT = '가나다라마바사 Hamburgefonstiv 0123456789';

/**
 * 현재 환경이 rem 기준 글자를 몇 배로 그리는지 잰다.
 * DOM 글자(브라우저 글자 확대 적용)와 canvas 글자(적용 안 됨)의 가로 폭 비율이다.
 *
 * @returns {number|null} 배율. 측정할 수 없으면 null
 */
function measureTextScale() {
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return null;
    context.font = '100px sans-serif';
    const reference = context.measureText(PROBE_TEXT).width;
    if (!reference) return null;

    const probe = document.createElement('span');
    probe.textContent = PROBE_TEXT;
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = [
      'position:absolute',
      'left:-9999px',
      'top:0',
      'visibility:hidden',
      'white-space:nowrap',
      'font-family:sans-serif',
      'font-size:6.25rem',
      'line-height:1',
    ].join(';');
    document.body.appendChild(probe);
    const rendered = probe.getBoundingClientRect().width;
    document.body.removeChild(probe);
    if (!rendered) return null;

    /** 기본 html 글자 크기가 16px 이 아닌 경우도 함께 반영된다 */
    return rendered / reference;
  } catch {
    return null;
  }
}

/**
 * 글자 배율을 측정해 --text-fit 을 갱신한다.
 */
function applyFitTextScale() {
  const root = document.documentElement;
  /** 이전 보정을 지우고 측정해야 정확하다 */
  root.style.setProperty('--text-fit', '1');

  if (window.innerWidth >= MAX_FIT_WIDTH) return;

  const measured = measureTextScale();
  if (measured === null || measured < MIN_MEASURED || measured > MAX_MEASURED) return;

  const fit = Math.min(MAX_FIT, Math.max(MIN_FIT, TARGET_SCALE / measured));
  root.style.setProperty('--text-fit', fit.toFixed(3));
}

/**
 * 첫 측정을 하고, 화면 크기가 바뀔 때(회전 등) 다시 측정한다.
 *
 * Example usage:
 * initFitTextScale();
 */
export function initFitTextScale() {
  applyFitTextScale();

  let timerId = null;
  window.addEventListener('resize', () => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(applyFitTextScale, 150);
  });
  window.addEventListener('pageshow', applyFitTextScale);
}
