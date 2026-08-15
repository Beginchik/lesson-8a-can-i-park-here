import { useEffect, useState } from "react";
import type { LexicalEntry } from "../types";

type Props = { entry: LexicalEntry; context: string; lessonId?: string; onClose: () => void };

function speak(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-GB";
  utterance.rate = 0.88;
  window.speechSynthesis.speak(utterance);
}

export function WordCard({ entry, onClose }: Props) {
  const [translationVisible, setTranslationVisible] = useState(false);

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onClose]);

  return (
    <div className="word-card-backdrop" onMouseDown={onClose}>
      <aside aria-label={`Dictionary entry for ${entry.display}`} aria-modal="true" className="word-card" onMouseDown={(event) => event.stopPropagation()} role="dialog">
        <button aria-label="Close word card" className="word-card-close" onClick={onClose} type="button">×</button>
        <div className="word-card-heading">
          <div><p className="word-card-kicker">WORD CARD</p><h2>{entry.display}</h2></div>
          <button aria-label={`Pronounce ${entry.display}`} className="audio-circle" onClick={() => speak(entry.headword)} type="button">▶</button>
        </div>
        <p className="word-meta">{entry.transcription} · {entry.partOfSpeech}</p>
        <p className="word-definition">{entry.definition}</p>
        <div className="word-examples">{entry.examples.slice(0, 3).map((example) => <button key={example} onClick={() => speak(example)} type="button"><span>▶</span>{example}</button>)}</div>
        <button className="translation-toggle" onClick={() => setTranslationVisible((visible) => !visible)} type="button">{translationVisible ? "Hide translation" : "Show translation"}</button>
        {translationVisible && <p aria-live="polite" className="translation">{entry.translation}</p>}
      </aside>
    </div>
  );
}
