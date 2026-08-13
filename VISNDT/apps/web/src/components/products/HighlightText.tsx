'use client';

/**
 * Highlight keyword matches in text (frontend only, no backend modification).
 * Case-insensitive matching. Only renders when keyword is non-empty.
 */
interface HighlightTextProps {
  text: string;
  keyword: string;
  className?: string;
}

export default function HighlightText({ text, keyword, className }: HighlightTextProps) {
  if (!keyword || !text) {
    return <span className={className}>{text}</span>;
  }

  const lowerText = text.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  const parts: { text: string; highlight: boolean }[] = [];

  let lastIndex = 0;
  let matchIndex = lowerText.indexOf(lowerKeyword, lastIndex);

  while (matchIndex !== -1) {
    if (matchIndex > lastIndex) {
      parts.push({ text: text.slice(lastIndex, matchIndex), highlight: false });
    }
    parts.push({ text: text.slice(matchIndex, matchIndex + keyword.length), highlight: true });
    lastIndex = matchIndex + keyword.length;
    matchIndex = lowerText.indexOf(lowerKeyword, lastIndex);
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), highlight: false });
  }

  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.highlight ? (
          <mark
            key={i}
            className="bg-amber-200/70 text-foreground rounded-sm px-0.5"
          >
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </span>
  );
}
