'use client';

import { useState, useEffect } from 'react';

/**
 * Responsive breakpoint hooks.
 * Mobile-first: matches Tailwind default breakpoints.
 */

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Returns true when the viewport is >= the given breakpoint width.
 * Mobile-first: `useMediaQuery('md')` is true on tablet+.
 */
export function useMediaQuery(breakpoint: Breakpoint): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const query = `(min-width: ${BREAKPOINTS[breakpoint]}px)`;
    const mql = window.matchMedia(query);

    setMatches(mql.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [breakpoint]);

  return matches;
}

/**
 * Returns true when the viewport is <= the given breakpoint width.
 * `useMediaQueryDown('md')` is true on mobile (below md).
 */
export function useMediaQueryDown(breakpoint: Breakpoint): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const query = `(max-width: ${BREAKPOINTS[breakpoint]}px)`;
    const mql = window.matchMedia(query);

    setMatches(mql.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [breakpoint]);

  return matches;
}

/**
 * Common responsive shortcuts.
 */
export function useIsMobile(): boolean {
  return useMediaQueryDown('md');
}

export function useIsTablet(): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const query = '(min-width: 768px) and (max-width: 1023px)';
    const mql = window.matchMedia(query);

    setMatches(mql.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return matches;
}

export function useIsDesktop(): boolean {
  return useMediaQuery('lg');
}