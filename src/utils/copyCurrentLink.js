/**
 * 현재 페이지 주소를 클립보드에 복사한다.
 * 권한이 없거나 실패하면 false를 돌려주고, 호출한 쪽이 안내를 건너뛴다.
 *
 * @returns {Promise<boolean>} 복사에 성공했는지
 *
 * Example usage:
 * const isCopied = await copyCurrentLink();
 */
export async function copyCurrentLink() {
  try {
    await navigator.clipboard.writeText(window.location.href);
    return true;
  } catch {
    return false;
  }
}

export default copyCurrentLink;
