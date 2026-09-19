/**
 * Storybook의 현재 iframe 위치를 기준으로 public 정적 파일 URL을 계산한다.
 * 로컬 루트와 GitHub Pages 프로젝트 하위 경로를 모두 지원한다.
 *
 * @param {string} relativePath - public 디렉토리 기준 상대 경로 [Required]
 * @returns {string} 현재 Storybook 배포 위치에 맞춘 절대 URL
 */
export function storybookPublicUrl(relativePath) {
  const normalizedPath = String(relativePath).replace(/^\/+/, '');
  return new URL(`./${ normalizedPath }`, window.location.href).toString();
}
