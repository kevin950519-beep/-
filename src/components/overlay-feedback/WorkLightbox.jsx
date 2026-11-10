import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import { alpha } from '@mui/material/styles';
import { WorkCard } from '../card/WorkCard';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';

/**
 * WorkLightbox 컴포넌트
 *
 * 작품을 카드(WorkCard) 팝업으로(기본 흰색, 검은 배경 사진은 검은색) 여는 화면. 카드는 화면 가운데에 뜨고 뒤는 어둡게 깔린다.
 * 카드 안은 데스크톱에서 왼쪽 사진, 오른쪽 작품 정보다. onPrev, onNext를 주면
 * 화면 양옆 이전·다음 버튼과 좌우 방향키로 이웃 작품으로 넘길 수 있다.
 *
 * Props:
 * @param {boolean} isOpen - 열림 여부 [Required]
 * @param {function} onClose - 닫기 핸들러 () => void [Required]
 * @param {function} onPrev - 이전 작품 핸들러 () => void [Optional]
 * @param {function} onNext - 다음 작품 핸들러 () => void [Optional]
 * @param {object} work - 작품 { tone, title, src, alt, material, size, year } [Optional]
 * @param {string} closeLabel - 닫기 버튼 접근성 레이블 [Optional, 기본값: '닫기']
 * @param {string} prevLabel - 이전 버튼 접근성 레이블 [Optional, 기본값: '이전 작품']
 * @param {string} nextLabel - 다음 버튼 접근성 레이블 [Optional, 기본값: '다음 작품']
 *
 * Example usage:
 * <WorkLightbox isOpen={ isOpen } onClose={ handleClose } work={ work } />
 */
function WorkLightbox({
  isOpen,
  onClose,
  onPrev,
  onNext,
  work,
  closeLabel = '닫기',
  prevLabel = '이전 작품',
  nextLabel = '다음 작품',
}) {
  /** 검은 배경 사진(tone: 'dark')이면 팝업도 검게 한다 */
  const isDark = work?.tone === 'dark';

  /** 좌우 방향키로 이웃 작품 이동 */
  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft' && onPrev) onPrev();
    if (event.key === 'ArrowRight' && onNext) onNext();
  };

  /** 어두운 뒤 배경 위에서도, 흰 카드 위에서도 보이도록 반투명 어두운 원 위에 흰 아이콘 */
  const arrowSx = (theme) => ({
    position: 'fixed',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'common.white',
    backgroundColor: alpha(theme.palette.common.black, 0.5),
    zIndex: theme.zIndex.modal + 1,
    '&:hover': { backgroundColor: alpha(theme.palette.common.black, 0.7) },
  });

  return (
    <Dialog
      open={ isOpen }
      onClose={ onClose }
      onKeyDown={ handleKeyDown }
      maxWidth={ false }
      aria-labelledby="work-lightbox-title"
      slotProps={ {
        paper: {
          sx: {
            position: 'relative',
            m: { xs: 2, md: 4 },
            width: 'fit-content',
            maxWidth: { xs: 'calc(100% - 32px)', md: 'calc(100% - 64px)' },
            maxHeight: { xs: 'calc(100% - 32px)', md: 'calc(100% - 64px)' },
            backgroundColor: isDark ? '#202020' : 'background.default',
            color: isDark ? 'common.white' : 'text.primary',
            borderRadius: 0,
          },
        },
      } }
    >
      <IconButton
        onClick={ onClose }
        aria-label={ closeLabel }
        sx={ { position: 'absolute', top: 8, right: 8, color: isDark ? 'common.white' : 'text.primary', zIndex: 1 } }
      >
        <CloseIcon />
      </IconButton>
      { onPrev && (
        <IconButton
          onClick={ onPrev }
          aria-label={ prevLabel }
          sx={ (theme) => ({ ...arrowSx(theme), left: { xs: 4, md: 16 } }) }
        >
          <ChevronLeftIcon />
        </IconButton>
      ) }
      { onNext && (
        <IconButton
          onClick={ onNext }
          aria-label={ nextLabel }
          sx={ (theme) => ({ ...arrowSx(theme), right: { xs: 4, md: 16 } }) }
        >
          <ChevronRightIcon />
        </IconButton>
      ) }
      <WorkCard
        work={ work }
        titleId="work-lightbox-title"
      />
    </Dialog>
  );
}

export { WorkLightbox };
export default WorkLightbox;
