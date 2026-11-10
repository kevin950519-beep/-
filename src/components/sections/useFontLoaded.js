import { useEffect, useState } from 'react';

/**
 * useFontLoaded 훅
 *
 * 웹폰트가 불러와졌는지 알려 준다. 불러오기 전에 기본 서체로 글자가 먼저 보였다 바뀌는 현상을 막는 데 쓴다.
 * 오래 걸리거나 실패해도 timeoutMs 뒤에는 준비된 것으로 본다(화면이 영영 비지 않게).
 * 폰트 API가 없는 환경에서는 처음부터 준비된 것으로 본다.
 *
 * @param {string} fontFamily - 확인할 font-family 이름 [Required]
 * @param {string} sampleText - 서체 확인에 쓸 글자 [Optional, 기본값: '가']
 * @param {number} timeoutMs - 이 시간(ms)이 지나면 준비된 것으로 본다 [Optional, 기본값: 2000]
 * @returns {boolean} 서체가 준비되었는지
 *
 * Example usage:
 * const isFontReady = useFontLoaded('210 Fullmoon', '우연한 마중');
 */
export function useFontLoaded(fontFamily, sampleText = '가', timeoutMs = 2000) {
  const [isLoaded, setIsLoaded] = useState(() => typeof document === 'undefined' || !document.fonts?.load);

  useEffect(() => {
    if (!document.fonts?.load) return undefined;
    let isActive = true;
    const markLoaded = () => {
      if (isActive) setIsLoaded(true);
    };
    const timer = setTimeout(markLoaded, timeoutMs);
    document.fonts.load(`1em "${ fontFamily }"`, sampleText).then(markLoaded, markLoaded);
    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, [fontFamily, sampleText, timeoutMs]);

  return isLoaded;
}

export default useFontLoaded;
