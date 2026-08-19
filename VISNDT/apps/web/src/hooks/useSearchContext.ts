'use client';

import { useState, useEffect, useRef } from 'react';
import { getSearchContext } from '@/lib/api/search';
import type { SearchContextResponse } from '@/lib/api/search';

/**
 * M24.1.4 — Search Context Hook
 *
 * Fetches query-level search context from GET /search/context?q={keyword}.
 * Context is pagination-independent and only re-fetches when the query changes.
 */
export function useSearchContext(query: string) {
  const [context, setContext] = useState<SearchContextResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const lastQuery = useRef<string>('');

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setContext(null);
      setLoading(false);
      setError(false);
      return;
    }

    // Only re-fetch when query actually changes
    if (trimmed === lastQuery.current) return;
    lastQuery.current = trimmed;

    let cancelled = false;
    setLoading(true);
    setError(false);

    getSearchContext(trimmed)
      .then((data) => {
        if (!cancelled) {
          setContext(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [query]);

  return { context, loading, error };
}