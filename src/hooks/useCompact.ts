import { useEffect, useState } from 'react';

/** True on phones and tablets (up to 1024px), kept in sync with resizes. */
export function useCompact(query = '(max-width: 1024px)') {
  const [compact, setCompact] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setCompact(mq.matches);
    mq.addEventListener('change', onChange);
    setCompact(mq.matches);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return compact;
}
