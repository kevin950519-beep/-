import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { WorkCard } from '../card/WorkCard';

/**
 * WorkDetailView 컴포넌트
 *
 * 작품 한 점을 화면 전체를 쓰는 개별 페이지로 보여 준다. 좁은 화면(모바일)에서 팝업 대신 쓴다.
 * 위에서 아래로만 읽도록 맨 위에 사진(가로 폭을 여백 없이 가득 채움, 자르지 않음), 그 아래에 작품 정보(WorkCard의 stack 배치)를 둔다.
 * 위쪽 고정 막대에 뒤로 가기 버튼 하나만 둔다. 작품 하나만 보는 단일 페이지라 기본은 다른 작품으로 넘기지 않는다.
 * onPrev, onNext를 줄 때만 정보 아래 이전·다음 버튼과 좌우 쓸어 넘기기가 생긴다.
 * 열려 있는 동안 뒤의 페이지는 스크롤되지 않는다. 검은 배경 사진(work.tone: dark)이면 페이지도 검게 한다.
 *
 * Props:
 * @param {object} work - 작품 { tone, title, src, alt, aspectRatio, material, size, year } [Required]
 * @param {function} onClose - 돌아가기 핸들러 () => void [Required]
 * @param {function} onPrev - 이전 작품 핸들러 () => void [Optional]
 * @param {function} onNext - 다음 작품 핸들러 () => void [Optional]
 * @param {string} variant - 'stack'(위 사진, 아래 정보) 또는 'cover'(사진이 화면 가득, 정보를 사진 위에 얹음. 사진을 누르면 검은 배경 가운데에 잘리지 않은 전체가 보임) [Optional, 기본값: 'stack']
 * @param {string} backLabel - 돌아가기 버튼 접근성 레이블 [Optional, 기본값: '작품 목록으로']
 * @param {string} prevLabel - 이전 버튼 접근성 레이블 [Optional, 기본값: '이전 작품']
 * @param {string} nextLabel - 다음 버튼 접근성 레이블 [Optional, 기본값: '다음 작품']
 *
 * Example usage:
 * <WorkDetailView work={ work } onClose={ handleClose } onPrev={ handlePrev } onNext={ handleNext } />
 */
export function WorkDetailView({
  work,
  onClose,
  onPrev,
  onNext,
  variant = 'stack',
  backLabel = '작품 목록으로',
  prevLabel = '이전 작품',
  nextLabel = '다음 작품',
}) {
  const isDark = work?.tone === 'dark';
  const workId = work?.id;
  const touchStartRef = useRef(null);
  const [isFull, setIsFull] = useState(false);

  /** 좌우로 크게 쓸면 이웃 작품으로 넘긴다. 세로 스크롤과 구분하려고 가로 이동이 세로의 두 배 넘을 때만 */
  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };
  const handleTouchEnd = (event) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 2) return;
    if (dx < 0 && onNext) onNext();
    if (dx > 0 && onPrev) onPrev();
  };

  /** 열려 있는 동안 뒤 페이지 스크롤을 막고, 작품이 바뀌면 맨 위로 올린다 */
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft' && onPrev) onPrev();
      if (event.key === 'ArrowRight' && onNext) onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext]);

  if (!work) return null;

  const pageColor = isDark ? 'common.white' : 'text.primary';

  if (variant === 'cover') {
    const photoBackground = isDark ? '#202020' : '#FFFFFF';
    return (
      <Box
        key={ workId }
        role="region"
        aria-labelledby="work-detail-title"
        onClick={ () => setIsFull((prev) => !prev) }
        sx={ (theme) => ({
          position: 'fixed',
          inset: 0,
          zIndex: theme.zIndex.modal,
          overflow: 'hidden',
          backgroundColor: isFull ? '#000000' : photoBackground,
          transition: 'background-color 250ms ease',
        }) }
      >
        <Box
          component="img"
          src={ work.src }
          alt={ work.alt || work.title }
          sx={ {
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: isFull ? 'contain' : 'cover',
            objectPosition: isFull ? 'center' : (work.focus || 'center'),
          } }
        />
        <Box
          aria-hidden
          sx={ {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '55%',
            pointerEvents: 'none',
            background: 'linear-gradient(to top, rgba(0,0,0,0.78), rgba(0,0,0,0))',
            opacity: isFull ? 0 : 1,
            transition: 'opacity 250ms ease',
          } }
        />
        <IconButton
          onClick={ (event) => { event.stopPropagation(); onClose(); } }
          aria-label={ backLabel }
          sx={ {
            position: 'absolute',
            top: 'max(8px, env(safe-area-inset-top))',
            left: 8,
            color: 'common.white',
            /** 박스 없이 화살표만 두므로, 사진 위에서도 보이도록 옅은 그림자를 준다 */
            filter: 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.55))',
          } }
        >
          <ArrowBackIcon />
        </IconButton>
        <Box
          sx={ {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            pb: 'env(safe-area-inset-bottom)',
            pointerEvents: 'none',
            opacity: isFull ? 0 : 1,
            transition: 'opacity 250ms ease',
          } }
        >
          <WorkCard
            work={ { ...work, tone: 'dark' } }
            titleId="work-detail-title"
            layout="stack"
            isPhotoHidden
            bottomInset={ 1 }
            sx={ { backgroundColor: 'transparent' } }
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      key={ workId }
      onTouchStart={ handleTouchStart }
      onTouchEnd={ handleTouchEnd }
      role="region"
      aria-labelledby="work-detail-title"
      sx={ (theme) => ({
        position: 'fixed',
        inset: 0,
        zIndex: theme.zIndex.modal,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        overscrollBehavior: 'contain',
        backgroundColor: isDark ? '#202020' : 'background.default',
        color: pageColor,
      }) }
    >
      <Box
        sx={ {
          position: 'sticky',
          top: 0,
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          height: 48,
          px: 1,
          flexShrink: 0,
          backgroundColor: isDark ? '#202020' : 'background.default',
        } }
      >
        <IconButton onClick={ onClose } aria-label={ backLabel } sx={ { color: pageColor } }>
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <WorkCard
        work={ work }
        titleId="work-detail-title"
        layout="stack"
        outerInset={ 0 }
      />

      { (onPrev || onNext) && (
      <Box sx={ { display: 'flex', justifyContent: 'space-between', px: 1, pb: 'max(16px, env(safe-area-inset-bottom))', mt: 'auto', flexShrink: 0 } }>
        <IconButton onClick={ onPrev } disabled={ !onPrev } aria-label={ prevLabel } sx={ { color: pageColor } }>
          <ChevronLeftIcon />
        </IconButton>
        <IconButton onClick={ onNext } disabled={ !onNext } aria-label={ nextLabel } sx={ { color: pageColor } }>
          <ChevronRightIcon />
        </IconButton>
      </Box>
      ) }
    </Box>
  );
}

export default WorkDetailView;
