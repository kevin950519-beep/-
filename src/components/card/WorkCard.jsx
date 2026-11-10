import { useLayoutEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

/** 데스크톱에서 작품 정보 영역의 고정 폭(px) */
const INFO_WIDTH = 460;

/** 좁은 화면에서 작품 정보 영역의 고정 폭(px). 배치는 데스크톱과 같게 사진 왼쪽, 정보 오른쪽이다 */
const INFO_WIDTH_XS = 150;

/**
 * WorkCard 컴포넌트
 *
 * 작품 한 점을 카드에 담아 보여 주는 카드. 데스크톱은 왼쪽에 사진,
 * 오른쪽에 작품 정보를 한 줄로 둔다(큰 제목 "작품명" 옆에 작은 글자로 "연도 재료 크기", 예: 우연한 마중 2026 wood, plaster 70x70x140(cm)). 줄바꿈 없이 한 줄이며 넘치면 연도 재료 크기를 조금 줄여 한 줄을 지킨다. 좁은 화면에서도 같은 배치를 줄여서 쓴다. 사진은 자르지 않고, 카드 폭이 사진 폭을 따라가서 가로형·세로형 모두 사진 둘레 여백이 10px로 같다. layout이 'stack'이면 모바일 개별 페이지용으로 사진을 위에 가로 폭 가득, 정보를 아래에 둔다.
 * work.tone이 'dark'(검은 배경 사진)이면 카드도 검은색으로, 글자는 흰색으로 바꾼다.
 * 비어 있는 정보는 줄에서 빠진다.
 *
 * Props:
 * @param {object} work - 작품 { tone('dark'면 검은 카드), title, src, alt, aspectRatio('w/h'), material, size, year } [Required]
 * @param {string} layout - 'side'(사진 왼쪽, 정보 오른쪽) 또는 'stack'(사진 위, 정보 아래). stack은 모바일 개별 페이지용 [Optional, 기본값: 'side']
 * @param {boolean} isPhotoHidden - true면 사진을 그리지 않고 정보만 보인다. 사진 위에 정보를 얹을 때 쓴다 [Optional, 기본값: false]
 * @param {number} outerInset - 카드 바깥 좌우 여백 합(px). 좁은 화면에서 사진 폭 계산에 쓴다 [Optional, 기본값: 32]
 * @param {number} bottomInset - stack 배치에서 정보 아래 여백(spacing 단위, 8px). 사진 위에 정보를 얹는 화면 하단 고정 배치에서는 값을 줄이면 글이 더 아래로 내려간다 [Optional, 기본값: 4]
 * @param {string} titleId - 작품명 요소 id. 팝업의 aria-labelledby에 연결한다 [Optional]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <WorkCard work={ work } />
 */
export function WorkCard({
  work,
  titleId,
  layout = 'side',
  isPhotoHidden = false,
  outerInset = 32,
  bottomInset = 4,
  sx,
}) {
  const rowRef = useRef(null);
  const detailRef = useRef(null);

  /**
   * 제목과 연도 재료 크기가 한 줄에 들어가도록, 넘치면 아래 줄로 내리지 않고 작은 글자(연도 재료 크기)만 조금씩 줄인다.
   * 휴대폰의 글꼴 크기 설정이 커서 글자가 키워져도 한 줄을 지킨다. 줄일 수 있는 한계는 70%다.
   */
  useLayoutEffect(() => {
    const row = rowRef.current;
    const detail = detailRef.current;
    if (!row || !detail) return undefined;
    const fit = () => {
      let scale = 1;
      detail.style.setProperty('--fit', '1');
      while (row.scrollWidth > row.clientWidth + 1 && scale > 0.7) {
        scale = Math.round((scale - 0.04) * 100) / 100;
        detail.style.setProperty('--fit', String(scale));
      }
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(row);
    return () => observer.disconnect();
  }, [work?.id, work?.year, work?.material, work?.size, layout]);

  if (!work) return null;

  /** 연도, 재료, 크기를 공백으로 이어 한 줄로 만든다 (예: 2026 wood, plaster 70x70x140(cm)) */
  const detailLine = [work.year, work.material, work.size].filter(Boolean).join(' ');

  const isDark = work.tone === 'dark';
  const isStack = layout === 'stack';

  /** 'w/h' 형태의 원본 비율을 숫자로 바꾼다. 없으면 정사각형으로 본다 */
  const [ratioW, ratioH] = String(work.aspectRatio || '1/1').split('/').map(Number);
  const ratio = ratioW / (ratioH || 1);

  /**
   * 사진 크기: 높이 기준 크기(데스크톱 76svh, 좁은 화면 48svh)로 폭을 정하되,
   * 화면 폭을 넘지 않게 자른다. 카드가 사진 폭을 따라가므로 가로형·세로형 모두 사진 둘레 여백이 같다.
   */
  const photoWidth = isStack
    /** stack: 사진은 가로 폭을 여백 없이 가득 채우고, 세로가 긴 사진은 아래로 스크롤해서 본다 */
    ? '100%'
    : {
      xs: `min(calc(60svh * ${ ratio }), calc(100vw - ${ outerInset + 20 }px - ${ INFO_WIDTH_XS }px))`,
      md: `min(calc(76svh * ${ ratio }), calc(100vw - 84px - ${ INFO_WIDTH }px))`,
    };

  return (
    <Box
      sx={ (theme) => ({
        display: 'flex',
        flexDirection: isStack ? 'column' : 'row',
        alignItems: isStack ? 'stretch' : 'flex-end',
        width: isStack ? '100%' : 'fit-content',
        maxWidth: '100%',
        p: isStack ? 0 : '10px',
        backgroundColor: isDark ? '#202020' : 'background.default',
        color: isDark ? 'common.white' : 'text.primary',
        fontFamily: theme.typography.fontFamily,
        ...sx,
      }) }
    >
      { !isPhotoHidden && (
      <Box
        component="img"
        src={ work.src }
        alt={ work.alt || work.title }
        sx={ {
          display: 'block',
          flexShrink: 0,
          alignSelf: isStack ? 'center' : undefined,
          width: photoWidth,
          aspectRatio: `${ ratio }`,
          height: 'auto',
          objectFit: 'contain',
        } }
      />
      ) }

      <Box
        sx={ {
          ...(isStack
            ? { width: '100%', px: 2.5, pt: 6, pb: bottomInset }
            : { width: { xs: INFO_WIDTH_XS, md: INFO_WIDTH }, flexShrink: 0, minWidth: 0, px: { xs: 1.25, md: 2.5 }, pt: 0, pb: 0 }),
          textAlign: 'left',
        } }
      >
        {/* 제목(큰 글자)과 연도, 재료, 크기(작은 글자)를 줄바꿈 없이 한 줄에 나란히 둔다. 넘치면 작은 글자를 줄여 한 줄을 지킨다 */}
        <Box
          ref={ rowRef }
          sx={ {
            display: 'flex',
            flexWrap: 'nowrap',
            alignItems: 'baseline',
            columnGap: 1.25,
          } }
        >
          <Typography
            id={ titleId }
            variant="h3"
            component="h2"
            sx={ (theme) => ({
              fontFamily: theme.typography.fontFamily,
              /** 모바일 개별 페이지(stack)는 웹 팝업(600)보다 한 단계 얇게(500) */
              fontWeight: isStack ? 500 : 600,
              fontSize: isStack ? '1.125rem' : { xs: '0.875rem', md: '1.125rem' },
              lineHeight: 1.4,
              whiteSpace: 'nowrap',
            }) }
          >
            { work.title }
          </Typography>
          { detailLine && (
            <Typography
              ref={ detailRef }
              variant="body2"
              component="p"
              sx={ (theme) => ({
                m: 0,
                /** 회색: 흰 카드는 보조 글자색, 검은 카드(어두운 사진)는 옅은 흰색 */
                color: isDark ? alpha(theme.palette.common.white, 0.7) : 'text.secondary',
                fontFamily: theme.typography.fontFamily,
                fontSize: isStack ? 'calc(0.6875rem * var(--fit, 1))' : { xs: 'calc(0.5625rem * var(--fit, 1))', md: 'calc(0.6875rem * var(--fit, 1))' },
                whiteSpace: 'nowrap',
              }) }
            >
              { detailLine }
            </Typography>
          ) }
        </Box>
      </Box>
    </Box>
  );
}

export default WorkCard;
