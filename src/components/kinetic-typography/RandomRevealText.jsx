import { useEffect, useRef, useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';

/**
 * RandomRevealText 컴포넌트
 *
 * 텍스트의 각 글자를 랜덤 순서로 blur에서 선명하게 전환하며 노출하는 키네틱 타이포그래피.
 * Fisher-Yates 셔플로 랜덤 순서를 생성하고, stagger 간격으로 순차 reveal.
 *
 * 동작 흐름:
 * 1. 컴포넌트가 마운트되면 공백을 제외한 글자의 랜덤 순서를 생성한다
 * 2. delay 후 stagger 간격으로 각 글자가 순차적으로 나타난다
 * 3. 각 글자는 blur(12px) + opacity(0) → blur(0) + opacity(1) 전환
 * 4. 모든 글자가 reveal되면 애니메이션이 완료된다
 *
 * Props:
 * @param {string} text - 표시할 텍스트 [Required]
 * @param {number} delay - 애니메이션 시작 지연 시간 (ms) [Optional, 기본값: 300]
 * @param {number} stagger - 글자 간 reveal 간격 (ms) [Optional, 기본값: 80]
 * @param {string} variant - MUI Typography variant. 'inherit'이면 부모 타이포를 따른다 [Optional, 기본값: 'body1']
 * @param {boolean} isSequential - true면 랜덤이 아니라 왼쪽부터 순서대로 노출 [Optional, 기본값: false]
 * @param {number} duration - 글자 하나의 전환 시간 (ms) [Optional, 기본값: 1200]
 * @param {number} blur - 시작 블러 크기 (px) [Optional, 기본값: 12]
 * @param {boolean} isTriggerOnView - true면 화면에 보일 때 시작하고, delay는 그 뒤부터 센다 [Optional, 기본값: false]
 * @param {number} threshold - isTriggerOnView일 때 시작 기준 노출 비율 0~1 [Optional, 기본값: 0.35]
 * @param {object} sx - MUI sx 스타일 [Optional]
 *
 * Example usage:
 * <RandomRevealText text="Hello World" delay={500} stagger={60} />
 */
function RandomRevealText({
  text,
  delay = 300,
  stagger = 80,
  variant = 'body1',
  isSequential = false,
  duration = 1200,
  blur = 12,
  isTriggerOnView = false,
  threshold = 0.35,
  sx = {},
}) {
  const isReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const rootRef = useRef(null);
  const [isStarted, setIsStarted] = useState(!isTriggerOnView);
  const [revealedIndices, setRevealedIndices] = useState(new Set());

  /** 화면에 보이면 한 번만 시작한다 */
  useEffect(() => {
    if (!isTriggerOnView) return undefined;
    const el = rootRef.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsStarted(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isTriggerOnView, threshold]);

  /** 공백을 제외한 글자의 랜덤 순서 생성 (Fisher-Yates shuffle) */
  const randomOrder = useMemo(() => {
    const indices = text
      .split('')
      .map((char, i) => (char !== ' ' ? i : -1))
      .filter((i) => i !== -1);

    if (isSequential) return indices;

    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  }, [text, isSequential]);

  /** stagger 간격으로 순차적 reveal 타이머 설정 */
  useEffect(() => {
    if (isReducedMotion || !isStarted) return undefined;
    const timeouts = [];

    randomOrder.forEach((charIndex, orderIndex) => {
      const timeout = setTimeout(() => {
        setRevealedIndices((prev) => new Set([...prev, charIndex]));
      }, delay + orderIndex * stagger);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach((t) => clearTimeout(t));
  }, [randomOrder, delay, stagger, isReducedMotion, isStarted]);

  /** 단어 단위로 묶어 단어 중간에서 줄이 끊기지 않게 하고, 공백 포함 원문 기준 시작 위치를 미리 구한다 */
  const words = text.split(' ').map((word, wordIndex, all) => ({
    word,
    start: all.slice(0, wordIndex).reduce((sum, w) => sum + w.length + 1, 0),
  }));

  return (
    <Box
      ref={ rootRef }
      component="span"
      sx={ {
        ...(variant !== 'inherit' && { typography: variant }),
        ...sx,
      } }
    >
      <Box
        component="span"
        sx={ { position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap' } }
      >
        { text }
      </Box>
      <Box component="span" aria-hidden>
        { words.map(({ word, start }, wordIndex) => (
          <Box key={ wordIndex } component="span" sx={ { display: 'inline-block', whiteSpace: 'nowrap', mr: wordIndex < words.length - 1 ? '0.3em' : 0 } }>
            { word.split('').map((char, charOffset) => {
              const index = start + charOffset;
              const isRevealed = isReducedMotion || revealedIndices.has(index);
              return (
                <Box
                  component="span"
                  key={ index }
                  sx={ {
                    display: 'inline-block',
                    opacity: isRevealed ? 1 : 0,
                    filter: isRevealed ? 'blur(0px)' : `blur(${ blur }px)`,
                    transition: `opacity ${ duration }ms ease-out, filter ${ duration }ms ease-out`,
                  } }
                >
                  { char }
                </Box>
              );
            }) }
          </Box>
        )) }
      </Box>
    </Box>
  );
}

export default RandomRevealText;
