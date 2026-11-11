import { useState } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import { InstagramIcon } from '../../common/ui/InstagramIcon';
import { GNB } from '../navigation/GNB';
import { NavMenu } from '../navigation/NavMenu';
import { useScrollSpy } from '../navigation/useScrollSpy';
import { useScrollProgress } from '../navigation/useScrollProgress';
import { useHeaderVisibility } from '../navigation/useHeaderVisibility';
import { useStatusDock } from '../navigation/useStatusDock';
import { getStatusText } from '../../utils/getStatusText';
import { copyCurrentLink } from '../../utils/copyCurrentLink';
import { artist } from '../../data/uyeonhan-majung/artist';
import { exhibitionInfo } from '../../data/uyeonhan-majung/exhibitionInfo';
import { content } from '../../data/uyeonhan-majung/content';

/** 모바일은 헤더를 낮춰 위쪽 여백을 줄인다 */
const HEADER_HEIGHT = { xs: 48, md: 64 };

/**
 * HeaderSection (02 2.4절 "페이지 셸" 헤더)
 *
 * GNB에 구간 메뉴(읽는 위치 강조), 길찾기·인스타그램·공유 아이콘, 읽는 진행선을 묶은 헤더.
 * 모바일에서는 메뉴(햄버거와 드로어)를 두지 않고 아이콘만 두며, 헤더 높이도 낮춘다.
 * 모바일에서는 전시 상태 칩이 처음부터 왼쪽 위에 고정되어 있다(옆에 띄우는 상자 없음).
 * 웹에서 왼쪽 위(로고 자리)는 비어 있다가, 전시 상태 상자를 X로 끌어다 놓으면 상태 칩(D-10 등)이 붙고, 칩을 누르면 다시 화면 옆으로 떠오른다.
 * 페이지 맨 위에서는 항상 보이고, 내리면 숨고 올리면 다시 나타난다. 맨 위에서는 흐름 안에 있어 히어로를 가리지 않는다.
 * 동작 줄이기 설정에서는 전환 없이 바로 바뀐다.
 *
 * Props:
 * @param {boolean} isHidden - true면 항상 숨긴다. 첫 화면이 열려 있는 동안 쓴다 [Optional, 기본값: false]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <HeaderSection isHidden={ isIntroOpen } />
 */
export function HeaderSection({ isHidden = false, sx }) {
  const [isCopied, setIsCopied] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const { nav, shell } = content.landing;

  const sectionIds = nav.items.flatMap((item) => item.sectionIds);
  const readingId = useScrollSpy(sectionIds);
  const activeId = nav.items.find((item) => item.sectionIds.includes(readingId))?.id;
  const { isDocked, isFixed, undock } = useStatusDock();
  const status = getStatusText(shell.status, exhibitionInfo.period);
  const progress = useScrollProgress();
  const isVisibleByScroll = useHeaderVisibility();
  const isVisible = isVisibleByScroll && !isHidden;

  const menuItems = nav.items.map(({ id, label }) => ({ id, label, href: `#${ id }` }));

  const handleShare = async () => {
    if (await copyCurrentLink()) setIsCopied(true);
  };

  /** 숨길 때는 전환이 끝난 뒤에 visibility를 꺼서 키보드가 닿지 않게 한다 */
  const visibilityTransition = `visibility 0s linear ${ isVisible ? '0s' : '300ms' }`;
  const headerTransition = isReducedMotion
    ? 'none'
    : `transform 300ms ease, opacity 300ms ease, ${ visibilityTransition }`;
  const lineTransition = isReducedMotion ? 'none' : `opacity 300ms ease, ${ visibilityTransition }`;
  const visibilityStyle = {
    opacity: isVisible ? 1 : 0,
    visibility: isVisible ? 'visible' : 'hidden',
  };

  return (
    <>
      <GNB
        isSticky
        height={ HEADER_HEIGHT }
        logo={ isDocked ? (
          <ButtonBase
            component={ isFixed ? 'div' : 'button' }
            onClick={ undock }
            disableRipple={ isFixed }
            aria-label={ isFixed ? `${ status.title }, ${ status.caption }` : `${ status.title }, ${ status.caption }, ${ shell.statusUndockLabel }` }
            sx={ { display: 'flex', alignItems: 'center', gap: 1, py: 0.5, borderRadius: 1, textAlign: 'left', cursor: isFixed ? 'default' : 'pointer' } }
          >
            <Typography component="span" sx={ { fontSize: '1.25rem', fontWeight: 500, lineHeight: 1.2 } }>{ status.title }</Typography>
            <Typography component="span" sx={ { fontSize: '1rem', fontWeight: 300, lineHeight: 1.2, color: 'text.secondary', position: 'relative', top: '0.5px' } }>{ status.caption }</Typography>
          </ButtonBase>
        ) : <Box aria-hidden /> }
        persistent={ (
          <Box sx={ { display: 'flex', alignItems: 'center' } }>
            <IconButton
              component="a"
              href={ exhibitionInfo.mapUrl }
              target="_blank"
              rel="noopener noreferrer"
              aria-label={ shell.mapLabel }
              size="small"
            >
              <PlaceOutlinedIcon />
            </IconButton>
            <IconButton
              component="a"
              href={ artist.instagram.url }
              target="_blank"
              rel="noopener noreferrer"
              aria-label={ shell.instagramLabel }
              size="small"
            >
              <InstagramIcon strokeWidth={ 1.5 } />
            </IconButton>
            <IconButton onClick={ handleShare } aria-label={ shell.shareLabel } size="small">
              <ShareOutlinedIcon />
            </IconButton>
          </Box>
        ) }
        navContent={ isDesktop ? <NavMenu items={ menuItems } activeId={ activeId } variant="underline" size="sm" /> : undefined }
        sx={ {
          backgroundColor: 'background.default',
          transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
          transition: headerTransition,
          ...visibilityStyle,
          ...sx,
        } }
      />
      <Box
        aria-hidden
        sx={ {
          position: 'fixed',
          top: HEADER_HEIGHT,
          left: 0,
          right: 0,
          height: 2,
          zIndex: (theme) => theme.zIndex.appBar,
          backgroundColor: 'primary.main',
          pointerEvents: 'none',
          transform: `scaleX(${ progress })`,
          transformOrigin: 'left',
          transition: lineTransition,
          ...visibilityStyle,
        } }
      />
      <Snackbar
        open={ isCopied }
        autoHideDuration={ 2400 }
        onClose={ () => setIsCopied(false) }
        message={ shell.copiedMessage }
      />
    </>
  );
}

export default HeaderSection;
