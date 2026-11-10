import { useCallback, useEffect, useState } from 'react';

const PREFIX = '#/works/';

/** 앱 안에서 작품 주소를 새로 쌓았는지. 쌓았으면 뒤로 가기로 닫고, 주소로 바로 들어왔으면 주소만 지운다 */
let hasPushedWorkEntry = false;

const readWorkId = () => {
  if (typeof window === 'undefined') return null;
  const { hash } = window.location;
  return hash.startsWith(PREFIX) ? decodeURIComponent(hash.slice(PREFIX.length)) : null;
};

/**
 * useWorkRoute 훅
 *
 * 작품 개별 페이지의 주소(`#/works/{id}`)를 읽고 바꾼다. 라우터 없이 주소의 해시만 쓰므로
 * 스토리북과 실제 사이트에서 똑같이 동작하고, 브라우저(휴대폰) 뒤로 가기로 돌아올 수 있다.
 *
 * @returns {{ workId: string|null, openWork: function, replaceWork: function, closeWork: function }}
 * workId: 지금 열린 작품 id(없으면 null), openWork(id): 개별 페이지로 이동(기록을 쌓는다),
 * replaceWork(id): 기록을 쌓지 않고 다른 작품으로 바꾼다, closeWork(): 개별 페이지를 닫고 목록으로 돌아간다
 *
 * Example usage:
 * const { workId, openWork, closeWork } = useWorkRoute();
 */
export function useWorkRoute() {
  const [workId, setWorkId] = useState(readWorkId);

  useEffect(() => {
    const sync = () => setWorkId(readWorkId());
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => {
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('popstate', sync);
    };
  }, []);

  const openWork = useCallback((id) => {
    hasPushedWorkEntry = true;
    window.location.hash = `${ PREFIX }${ encodeURIComponent(id) }`;
  }, []);

  const replaceWork = useCallback((id) => {
    window.history.replaceState(window.history.state, '', `${ PREFIX }${ encodeURIComponent(id) }`);
    setWorkId(id);
  }, []);

  const closeWork = useCallback(() => {
    if (hasPushedWorkEntry) {
      hasPushedWorkEntry = false;
      window.history.back();
      return;
    }
    window.history.replaceState(window.history.state, '', `${ window.location.pathname }${ window.location.search }`);
    setWorkId(null);
  }, []);

  return { workId, openWork, replaceWork, closeWork };
}

export default useWorkRoute;
