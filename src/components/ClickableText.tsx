import { useMemo } from "react";
import { fallbackEntry, lexicon, phraseKeys } from "../data/lexicon";
import type { LexicalEntry } from "../types";

type Props = {
  text: string;
  onWord: (entry: LexicalEntry, context: string) => void;
  className?: string;
};

type Part =
  | { kind: "text"; value: string }
  | { kind: "word"; value: string; entry: LexicalEntry };

function parse(text: string): Part[] {
  const phrasePattern = phraseKeys
    .map((value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  const pattern = new RegExp(
    `(?<![\\p{L}/])(${phrasePattern}|[\\p{L}]+(?:['’][\\p{L}]+)?)(?![\\p{L}/])`,
    "giu"
  );

  const parts: Part[] = [];
  let cursor = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > cursor) {
      parts.push({ kind: "text", value: text.slice(cursor, index) });
    }
    const value = match[0];
    const normalized = value.replace("’", "'").toLocaleLowerCase("en");
    parts.push({
      kind: "word",
      value,
      entry: lexicon.get(normalized) ?? fallbackEntry(value, text)
    });
    cursor = index + value.length;
  }
  if (cursor < text.length) {
    parts.push({ kind: "text", value: text.slice(cursor) });
  }
  return parts;
}

export function ClickableText({ text, onWord, className }: Props) {
  const parts = useMemo(() => parse(text), [text]);

  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.kind === "text" ? (
          <span key={`${part.value}-${index}`}>{part.value}</span>
        ) : (
          <button
            className="word-button"
            data-dictionary-status={part.entry.reviewed ? "reviewed" : "missing"}
            key={`${part.value}-${index}`}
            type="button"
            onClick={() => onWord(part.entry, text)}
          >
            {part.value}
          </button>
        )
      )}
    </span>
  );
}
