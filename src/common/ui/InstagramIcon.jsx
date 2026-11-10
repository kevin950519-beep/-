import SvgIcon from '@mui/material/SvgIcon';

/**
 * InstagramIcon 컴포넌트
 *
 * 선으로 그린 인스타그램 아이콘. MUI 기본 인스타 아이콘은 채워진 모양이라
 * 굵기를 줄일 수 없어서 선 굵기를 조절할 수 있게 따로 그렸다. 색은 현재 글자색을 따른다.
 *
 * Props:
 * @param {number} strokeWidth - 선 굵기(24 기준 viewBox 단위) [Optional, 기본값: 1]
 * @param {object} sx - 추가 스타일(크기는 fontSize로) [Optional]
 *
 * Example usage:
 * <InstagramIcon strokeWidth={ 1.5 } />
 */
export function InstagramIcon({ strokeWidth = 1, sx, ...rest }) {
  return (
    <SvgIcon viewBox="0 0 24 24" sx={ sx } { ...rest }>
      <g fill="none" stroke="currentColor" strokeWidth={ strokeWidth } strokeLinecap="round">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <path d="M17.2 6.8h.01" />
      </g>
    </SvgIcon>
  );
}

export default InstagramIcon;
