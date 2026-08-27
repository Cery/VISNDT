/**
 * Shared search utility functions.
 *
 * Used by ProductResultCard, KnowledgeResultCard, and SolutionResultCard
 * for consistent keyword highlighting and date formatting.
 */

/**
 * Highlight occurrences of a keyword in text.
 * Case-insensitive, first-match only.
 * Returns a ReactNode with <mark> elements for matched text.
 */
export function highlightText(text: string, keyword: string): React.ReactNode {
  if (!keyword || !text) return text;
  const lowerText = text.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  const idx = lowerText.indexOf(lowerKeyword);
  if (idx === -1) return text;

  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-100 text-foreground rounded-sm px-0.5">
        {text.slice(idx, idx + keyword.length)}
      </mark>
      {text.slice(idx + keyword.length)}
    </>
  );
}

/**
 * Format a date string to Chinese locale format.
 * Example: "2026年8月13日"
 */
export function formatDate(value?: string | null): string {
  if (!value) return '';
  return new Date(value).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}