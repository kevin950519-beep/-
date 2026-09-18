/**
 * StoryLink 컴포넌트
 *
 * 스토리북 문서 안에서 다른 스토리로 가는 링크.
 * 상위 프레임을 바꿔야(target="_top") 스토리북 iframe 안에서도 라우팅이 동작한다.
 *
 * Props:
 * @param {string} id - 스토리 id (index.json 의 id) [Required]
 * @param {ReactNode} children - 링크 텍스트 [Required]
 *
 * Example usage:
 * <StoryLink id="overview-introduction--docs">Introduction</StoryLink>
 */
export function StoryLink({ id, children }) {
  return (
    <a href={ `?path=/story/${ id }` } target="_top" style={ { color: 'inherit' } }>
      { children }
    </a>
  );
}
