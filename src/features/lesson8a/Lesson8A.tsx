import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from "react";
import { ClickableText } from "../../components/ClickableText";
import { type CourseLessonId } from "../../components/LessonPicker";
import { WordCard } from "../../components/WordCard";
import type { LexicalEntry } from "../../types";
import "./Lesson8A.css";

type ViewId = "overview" | "warmup" | "reading" | "country-game" | "story" | "grammar" | "practice" | "pronunciation" | "vocabulary" | "speaking" | "review" | "homework";
type Progress = { completed: ViewId[]; answers: Record<string, string> };
type ActiveWord = { entry: LexicalEntry; context: string } | null;
type ReferenceKind = "grammar" | "vocabulary" | null;
type TextComponent = ComponentType<{ children: string; className?: string }>;
type ExerciseProps = { answers: Record<string, string>; onAnswer: (id: string, value: string) => void; Text: TextComponent };

const progressKey = "beginner-course:lesson-8a:progress:v1";
const emptyProgress: Progress = { completed: [], answers: {} };
const media = (file: string) => "./media/lesson-8a/" + file;

const sections: { id: ViewId; number: string; label: string }[] = [
  { id: "overview", number: "01", label: "Start here" },
  { id: "warmup", number: "02", label: "Warm-up" },
  { id: "reading", number: "03", label: "Driving round the world" },
  { id: "country-game", number: "04", label: "Which country?" },
  { id: "story", number: "05", label: "Anna learns to drive" },
  { id: "grammar", number: "06", label: "Can · Can't" },
  { id: "practice", number: "07", label: "Grammar practice" },
  { id: "pronunciation", number: "08", label: "Pronunciation & listening" },
  { id: "vocabulary", number: "09", label: "Signs & verb phrases" },
  { id: "speaking", number: "10", label: "Tourist in town" },
  { id: "review", number: "11", label: "Review" },
  { id: "homework", number: "HW", label: "Homework" }
];

const answerPrefixes: Record<ViewId, string[]> = {
  overview: ["8a-overview-"],
  warmup: ["8a-warmup-"],
  reading: ["8a-reading-"],
  "country-game": ["8a-country-game-"],
  story: ["8a-story-"],
  grammar: ["8a-grammar-"],
  practice: ["8a-practice-"],
  pronunciation: ["8a-pronunciation-"],
  vocabulary: ["8a-vocabulary-"],
  speaking: ["8a-speaking-"],
  review: ["8a-review-"],
  homework: ["8a-homework-"]
};

function loadProgress(): Progress {
  try {
    return { ...emptyProgress, ...JSON.parse(localStorage.getItem(progressKey) ?? "{}") };
  } catch {
    return emptyProgress;
  }
}

function normalize(value: string) {
  return value.toLocaleLowerCase("en").replace(/[’]/g, "'").replace(/[.,!?]/g, "").replace(/\s+/g, " ").trim();
}

export function Lesson8A({ onLessonChange: _onLessonChange }: { onLessonChange: (lesson: CourseLessonId) => void }) {
  const [view, setView] = useState<ViewId>("overview");
  const [navOpen, setNavOpen] = useState(false);
  const [progress, setProgress] = useState<Progress>(loadProgress);
  const [activeWord, setActiveWord] = useState<ActiveWord>(null);
  const [reference, setReference] = useState<ReferenceKind>(null);
  const currentIndex = sections.findIndex((section) => section.id === view);
  const percent = Math.round((progress.completed.filter((item) => item !== "homework").length / (sections.length - 1)) * 100);

  useEffect(() => localStorage.setItem(progressKey, JSON.stringify(progress)), [progress]);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    return () => window.cancelAnimationFrame(frame);
  }, [view]);
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNavOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const Text = ({ children, className }: { children: string; className?: string }) => (
    <ClickableText className={className} onWord={(entry, context) => setActiveWord({ entry, context })} text={children} />
  );
  const answer = (id: string, value: string) => setProgress((current) => ({ ...current, answers: { ...current.answers, [id]: value } }));
  const finish = () => {
    setProgress((current) => current.completed.includes(view) ? current : { ...current, completed: [...current.completed, view] });
    const next = sections[currentIndex + 1];
    if (next && view !== "homework") window.setTimeout(() => setView(next.id), 180);
  };
  const resetSection = () => {
    if (view === "overview" || !window.confirm("Reset answers in this section?")) return;
    const prefixes = answerPrefixes[view];
    setProgress((current) => ({
      completed: current.completed.filter((item) => item !== view),
      answers: Object.fromEntries(Object.entries(current.answers).filter(([id]) => !prefixes.some((prefix) => id.startsWith(prefix))))
    }));
  };
  const common = { answers: progress.answers, onAnswer: answer, Text };
  let content: ReactNode;
  if (view === "overview") content = <Overview onReference={setReference} {...common} />;
  else if (view === "warmup") content = <Warmup {...common} />;
  else if (view === "reading") content = <Reading {...common} />;
  else if (view === "country-game") content = <CountryGame {...common} />;
  else if (view === "story") content = <Story {...common} />;
  else if (view === "grammar") content = <Grammar {...common} />;
  else if (view === "practice") content = <Practice {...common} />;
  else if (view === "pronunciation") content = <Pronunciation {...common} />;
  else if (view === "vocabulary") content = <Vocabulary {...common} />;
  else if (view === "speaking") content = <Speaking {...common} />;
  else if (view === "review") content = <Review {...common} />;
  else content = <Homework {...common} />;

  return <div className="course-shell lesson-8a-theme">
    <header className="topbar">
      <div className="brand"><img alt="To Be English" className="brand-logo" src="./media/brand/to-be-english-logo.png" /><div><strong>BEGINNER ENGLISH</strong><small>Lesson 8A · Online class and homework</small></div></div>
      <div className="lesson-8a-standalone-label">ONLINE LESSON 8A</div>
      <div className="lesson-1b-reference-links"><button onClick={() => setReference("grammar")} type="button">Grammar</button><button onClick={() => setReference("vocabulary")} type="button">Vocabulary</button></div>
      <div className="topbar-tools"><button className="reset-trigger" disabled={view === "overview"} onClick={resetSection} type="button"><span>↻</span><span>Section</span></button><button className="reset-trigger" onClick={() => { if (window.confirm("Reset all answers in lesson 8A?")) setProgress(emptyProgress); }} type="button"><span>↻</span><span>Lesson</span></button><div className="progress-summary"><span>{percent}%</span><div><b style={{ width: percent + "%" }} /></div><small>Lesson progress</small></div></div>
    </header>
    <button aria-label="Close slide navigation" className={"lesson-nav-scrim " + (navOpen ? "is-visible" : "")} onClick={() => setNavOpen(false)} type="button" />
    <div className={"lesson-nav-drawer " + (navOpen ? "is-open" : "")} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setNavOpen(false); }} onFocus={() => setNavOpen(true)} onMouseEnter={() => setNavOpen(true)} onMouseLeave={() => setNavOpen(false)}>
      <button aria-controls="lesson-8a-navigation" aria-expanded={navOpen} aria-label={navOpen ? "Hide slide navigation" : "Show slide navigation"} className="lesson-nav-toggle" onClick={() => setNavOpen((open) => !open)} type="button"><span aria-hidden="true">{navOpen ? "‹" : "☰"}</span><small>Slides</small></button>
      <nav aria-label="Lesson sections" className="lesson-nav" id="lesson-8a-navigation"><p>LESSON 8A</p>{sections.map((section) => <button className={(section.id === view ? "active " : "") + (progress.completed.includes(section.id) ? "complete " : "") + (section.id === "homework" ? "homework-link" : "")} key={section.id} onClick={() => { setView(section.id); setNavOpen(false); }} type="button"><span>{section.number}</span>{section.label}{progress.completed.includes(section.id) && <i>✓</i>}</button>)}</nav>
    </div>
    <div className="course-layout">
      <main>{content}<div className="lesson-actions"><button className="secondary-action" disabled={currentIndex === 0} onClick={() => setView(sections[Math.max(0, currentIndex - 1)].id)} type="button">← Previous</button><button className="primary-action" onClick={finish} type="button">{progress.completed.includes(view) ? "Completed ✓" : view === "homework" ? "Mark homework ready" : "Complete & continue"}</button></div></main>
    </div>
    {activeWord && <WordCard context={activeWord.context} entry={activeWord.entry} lessonId="8a-can-i-park-here" onClose={() => setActiveWord(null)} />}
    {reference && <ReferencePanel kind={reference} onClose={() => setReference(null)} Text={Text} />}
  </div>;
}

function Heading({ eyebrow, title, Text, mode }: { eyebrow: string; title: string; Text: TextComponent; mode?: "IF THERE IS TIME" }) {
  return <div className="lesson-1b-heading lesson-8a-section-heading"><div><p>{eyebrow}</p>{mode === "IF THERE IS TIME" && <span className="extra">OPTIONAL</span>}</div><h2><Text>{title}</Text></h2></div>;
}

function Track({ file, label }: { file: string; label: string }) {
  return <div className="lesson-1b-track lesson-8a-track"><span>{label}</span><audio controls preload="metadata" src={media(file)} /></div>;
}

function Feedback({ correct, hint, success = "Correct." }: { correct: boolean; hint: string; success?: string }) {
  return <span aria-live="polite" className={"lesson-1b-feedback " + (correct ? "correct" : "incorrect")}><b>{correct ? "✓" : "×"}</b> {correct ? success : hint}</span>;
}

function Choice({ id, prompt, options, correct, answers, onAnswer, Text, hint = "Read or listen again and try once more." }: ExerciseProps & { id: string; prompt: string; options: readonly string[]; correct: string; hint?: string }) {
  const value = answers[id] ?? "";
  return <article className="lesson-8a-choice"><p><Text>{prompt}</Text></p><div>{options.map((option) => <button aria-pressed={value === option} className={value === option ? (option === correct ? "is-correct" : "is-incorrect") : ""} key={option} onClick={() => onAnswer(id, option)} type="button">{option}</button>)}</div>{value && <Feedback correct={value === correct} hint={hint} />}</article>;
}

function AnswerInput({ id, prompt, correct, answers, onAnswer, Text, placeholder = "Type your answer", hint = "Check can or can't, the verb, and the word order." }: ExerciseProps & { id: string; prompt: string; correct: string | readonly string[]; placeholder?: string; hint?: string }) {
  const [checked, setChecked] = useState(false);
  const value = answers[id] ?? "";
  const accepted = Array.isArray(correct) ? correct : [correct];
  const ok = accepted.some((item) => normalize(value) === normalize(item));
  return <div className="lesson-8a-input-row"><label><span><Text>{prompt}</Text></span><input aria-label={prompt} className={checked ? (ok ? "is-correct" : "is-incorrect") : ""} onChange={(event) => { onAnswer(id, event.target.value); setChecked(false); }} placeholder={placeholder} spellCheck="false" value={value} /></label><button className="lesson-8a-check-button" disabled={!value.trim()} onClick={() => setChecked(true)} type="button">Check</button>{checked && <Feedback correct={ok} hint={hint} />}</div>;
}

function MissingWordInput({ id, sentence, correct, answers, onAnswer, Text }: ExerciseProps & { id: string; sentence: string; correct: string }) {
  const [checked, setChecked] = useState(false);
  const value = answers[id] ?? "";
  const [before, after] = sentence.split("___");
  const ok = normalize(value) === normalize(correct);
  return <div className="lesson-8a-missing-word"><span><Text>{before}</Text></span><input aria-label={sentence} className={checked ? (ok ? "is-correct" : "is-incorrect") : ""} onChange={(event) => { onAnswer(id, event.target.value); setChecked(false); }} spellCheck="false" value={value} /><span><Text>{after}</Text></span><button className="lesson-8a-check-button" disabled={!value.trim()} onClick={() => setChecked(true)} type="button">Check</button>{checked && <Feedback correct={ok} hint="The same word completes every sentence. Look at theory and practical." />}</div>;
}

function SelfChoice({ id, prompt, options, answers, onAnswer, Text }: ExerciseProps & { id: string; prompt: string; options: readonly string[] }) {
  const selected = answers[id] ?? "";
  return <article className="lesson-8a-choice lesson-8a-self-choice">
    <p><Text>{prompt}</Text></p>
    <div>{options.map((option) => <button className={selected === option ? "is-selected" : ""} aria-pressed={selected === option} key={option} type="button" onClick={() => onAnswer(id, option)}>{option}</button>)}</div>
  </article>;
}

function Overview({ answers, onAnswer, Text, onReference }: ExerciseProps & { onReference: (kind: ReferenceKind) => void }) {
  const [parkDemo, setParkDemo] = useState(false);
  return <section className="lesson-panel lesson-8a-overview lesson-8a-original-overview">
    <div className="lesson-8a-original-hero">
      <div>
        <div className="lesson-8a-original-title"><span>8A</span><strong><Text>Can I park here?</Text></strong></div>
        <h2><Text>Welcome! Today you will learn to...</Text></h2>
        <div className="lesson-8a-original-goals">
          <p><i>G</i><Text>ask and answer with can / can't</Text></p>
          <p><i>V</i><Text>understand signs and more verb phrases</Text></p>
          <p><i>P</i><Text>say can / can't: /ə/, /æ/, /ɑː/ and copy the rhythm</Text></p>
        </div>
        <div className="lesson-8a-reference-buttons original">
          <button onClick={() => onReference("grammar")} type="button">Grammar</button>
          <button onClick={() => onReference("vocabulary")} type="button">Vocabulary</button>
        </div>
        <div className="lesson-8a-original-bubbles">
          <p><Text>Can you come on Monday at 8.30?</Text></p>
          <p><Text>No, I can't, but I can come at 10.00.</Text></p>
        </div>
      </div>
      <div className="lesson-8a-original-visual">
        <img alt="Colourful cars driving around the world" src={media("driving-round-the-world.jpg")} />
        <div className="lesson-8a-road"><span className={parkDemo ? "moved" : ""}>🚗</span>{parkDemo && <b>No, you can't!</b>}</div>
        <button className="lesson-8a-park-demo" onClick={() => setParkDemo((current) => !current)} type="button">🅿️ Can I park here?</button>
      </div>
    </div>
  </section>;
}

function Warmup({ answers, onAnswer, Text }: ExerciseProps) {
  const selected = (answers["8a-warmup-see"] ?? "").split("|").filter(Boolean);
  const items = [["🌍", "a globe"], ["🚗", "many cars"], ["🎨", "lots of colours"]] as const;
  const toggle = (item: string) => onAnswer("8a-warmup-see", selected.includes(item) ? selected.filter((value) => value !== item).join("|") : [...selected, item].join("|"));
  return <section className="lesson-panel lesson-8a-original-warmup">
    <div className="lesson-8a-original-section-tag"><span>🌍</span><strong>WARM-UP</strong><em>driving round the world</em></div>
    <div className="lesson-8a-original-warm-grid">
      <div>
        <h3><Text>Look at the picture. Tap what you can see.</Text></h3>
        <div className="lesson-8a-see-chips">{items.map(([icon, item]) => <button aria-pressed={selected.includes(item)} className={selected.includes(item) ? "is-selected" : ""} key={item} onClick={() => toggle(item)} type="button">{icon} {item}</button>)}</div>
        <p className="lesson-8a-see-sentence"><Text>{selected.length ? "I can see " + selected.join(", ") + "." : "I can see..."}</Text></p>
        <button className="lesson-8a-small-reset" disabled={!selected.length} onClick={() => onAnswer("8a-warmup-see", "")} type="button">↻ Reset</button>
      </div>
      <div>
        <SelfChoice id="8a-warmup-drive" prompt="And you? Can you drive?" options={["Yes, I can.", "No, I can't."]} {...{ answers, onAnswer, Text }} />
        <p className="lesson-8a-anna-intro"><Text>Today we meet Anna. She wants to learn to drive.</Text></p>
      </div>
    </div>
  </section>;
}
const drivingTestSentences = [
  "In Qatar, you can take the driving ___ when you are 14.",
  "In some states in Mexico, you only need to take a theory ___, not a practical ___.",
  "In Vietnam, it's very difficult to pass the theory ___. It has 450 questions!",
  "In Croatia, you need 85 hours of driving lessons before you take the practical ___.",
  "In Ukraine, if you do two things wrong in your practical ___, you fail.",
  "In Brazil, after your driving ___, you need to pass a psychological ___ to get your driving licence."
] as const;

const countryClues = [
  ["In ___, you can take the driving test when you are 14.", "Qatar"],
  ["In some states in ___, you only need a theory test, not a practical test.", "Mexico"],
  ["In ___, the theory test has 450 questions.", "Vietnam"],
  ["In ___, you need 85 hours of lessons before the practical test.", "Croatia"],
  ["In ___, two mistakes in the practical test mean you fail.", "Ukraine"],
  ["In ___, you need a psychological test after the driving test.", "Brazil"]
] as const;

const countryFlags: Record<string, string> = {
  Qatar: "🇶🇦",
  Mexico: "🇲🇽",
  Vietnam: "🇻🇳",
  Croatia: "🇭🇷",
  Ukraine: "🇺🇦",
  Brazil: "🇧🇷"
};

function Reading(props: ExerciseProps) {
  const { answers, onAnswer, Text } = props;
  const options = ["licence", "test", "lessons"] as const;
  const selected = answers["8a-reading-missing-word"] ?? "";
  const correct = selected === "test";
  return <section className="lesson-panel"><Heading eyebrow="READING & SPEAKING" title="Driving round the world" Text={Text} />
    <div className="lesson-1b-task lesson-8a-reading-intro"><img alt="Small colourful cars around a globe" src={media("driving-round-the-world.jpg")} /><div><h3><Text>Read the text. What is the missing word?</Text></h3><p><Text>Choose one word. The same word completes every gap.</Text></p><div className="lesson-8a-missing-options">{options.map((option) => <button aria-pressed={selected === option} className={selected === option ? (option === "test" ? "is-correct" : "is-incorrect") : ""} key={option} onClick={() => onAnswer("8a-reading-missing-word", option)} type="button">{option}</button>)}</div>{selected && <Feedback correct={correct} hint="Look at theory, practical, and psychological. Which noun works with all three?" success="Yes. The missing word is test." />}</div></div>
    <div className="lesson-1b-task lesson-8a-reading-text">{drivingTestSentences.map((sentence, index) => { const parts = sentence.split("___"); return <p key={sentence}><span>🚗</span><span>{parts.map((part, partIndex) => <span key={partIndex}><Text>{part}</Text>{partIndex < parts.length - 1 && <b className={selected ? (correct ? "is-correct" : "is-incorrect") : ""}>{selected || "_____"}</b>}</span>)}</span></p>; })}</div>
    <Track file="sb-8a-reading-check.mp3" label="Listen and check" />
  </section>;
}

function CountryGame({ answers, onAnswer, Text }: ExerciseProps) {
  const countries = useMemo(() => ["Brazil", "Croatia", "Mexico", "Qatar", "Ukraine", "Vietnam"].sort(() => Math.random() - 0.5), []);
  const currentIndex = countryClues.findIndex(([, correct], index) => answers["8a-country-game-" + (index + 1)] !== correct);
  const [showHint, setShowHint] = useState(false);
  useEffect(() => setShowHint(false), [currentIndex]);
  const complete = currentIndex === -1;
  const active = complete ? null : countryClues[currentIndex];
  const activeId = "8a-country-game-" + (currentIndex + 1);
  const selected = active ? answers[activeId] ?? "" : "";
  return <section className="lesson-panel"><Heading eyebrow="READING GAME" title="Which country?" Text={Text} />
    <div className="lesson-1b-task lesson-8a-country-game">
      <div className="lesson-8a-game-progress"><span>{complete ? countryClues.length : currentIndex} / {countryClues.length}</span><div><b style={{ width: ((complete ? countryClues.length : currentIndex) / countryClues.length * 100) + "%" }} /></div></div>
      {complete ? <div className="lesson-8a-game-complete"><strong>✓</strong><h3><Text>Excellent. You matched all six countries.</Text></h3></div> : active && <>
        <p className="lesson-8a-country-sentence">{active[0].split("___").map((part, index) => <span key={index}><Text>{part}</Text>{index === 0 && <b>________</b>}</span>)}</p>
        <div className="lesson-8a-country-options">{countries.map((country) => <button aria-pressed={selected === country} className={selected === country ? (country === active[1] ? "is-correct" : "is-incorrect") : ""} key={country} onClick={() => onAnswer(activeId, country)} type="button">{country}</button>)}</div>
        <button className="lesson-8a-hint-button" onClick={() => setShowHint((value) => !value)} type="button">{showHint ? "Hide hint" : "Need a hint?"}</button>
        {showHint && <p className="lesson-8a-flag-hint" aria-live="polite"><span>{countryFlags[active[1]]}</span><Text>Look at the flag. Which country is it?</Text></p>}
        {selected && selected !== active[1] && <Feedback correct={false} hint="Not this country. Read the fact again or open the flag hint." />}
      </>}
    </div>
    <div className="lesson-1b-task"><h3><Text>In your country...</Text></h3><p><Text>Write short notes. Then answer your teacher in complete sentences.</Text></p>{["At what age can you get a driving licence?", "Do you need to take a theory test?", "Is the practical test difficult?", "Do people usually need a lot of driving lessons?", "Do many people fail the first time?"].map((prompt, index) => <label className="lesson-8a-writing-row" key={prompt}><span>{index + 1}</span><Text>{prompt}</Text><textarea onChange={(event) => onAnswer("8a-country-game-note-" + (index + 1), event.target.value)} placeholder={index === 0 ? "In my country you can get a driving licence when you are..." : "Write a short answer"} value={answers["8a-country-game-note-" + (index + 1)] ?? ""} /></label>)}</div>
  </section>;
}
const annaPosts = [
  ["A", "I need some practical lessons with a good driving instructor. Friends, can you help?"],
  ["B", "The theory test is very difficult. I can practise online, but I can't answer the questions. “Can you park on a yellow line?” I don't know!"],
  ["C", "A pass in the theory — fantastic! My first lesson with Dad — total disaster! Now Dad says I can't practise in his car."]
] as const;

const dialogueRows = [
  ["Instructor", "Hello, can I ", "help", " you?"],
  ["Anna", "Yes, can I ", "book", " some driving lessons, please?"],
  ["Instructor", "Yes, of course.", null, ""],
  ["Anna", "When can I ", "start", "?"],
  ["Instructor", "I'm free on Monday. We can ", "meet", " at your house."],
  ["Anna", "Can you ", "come", " at 8.30?"],
  ["Instructor", "No, sorry, I can't. I have a lesson at 8.00.", null, ""],
  ["Anna", "OK. Can you ", "come", " at ten o'clock?"],
  ["Instructor", "Yes, I can. The lessons are one hour, so 10.00 to 11.00, OK?", null, ""],
  ["Anna", "Great!", null, ""],
  ["Instructor", "What's your name and address?", null, ""],
  ["Anna", "It's Anna Jones...", null, ""]
] as const;

function Story(props: ExerciseProps) {
  const { answers, onAnswer, Text } = props;
  const [selectedPost, setSelectedPost] = useState("");
  const [matchMessage, setMatchMessage] = useState("");
  const [selectedVerb, setSelectedVerb] = useState("");
  const photoMatches = [["1", "anna-photo-1.png", "B"], ["2", "anna-photo-2.png", "C"], ["3", "anna-photo-3.png", "A"]] as const;
  const matchedPosts = photoMatches.map(([number]) => answers["8a-story-post-" + number]).filter(Boolean);
  const matchPhoto = (number: string, correct: string) => {
    if (!selectedPost) {
      setMatchMessage("Choose a post first. Then click its photo.");
      return;
    }
    if (selectedPost === correct) {
      onAnswer("8a-story-post-" + number, selectedPost);
      setMatchMessage("Correct. Now match the next post.");
      setSelectedPost("");
    } else {
      setMatchMessage("Not this photo. Read the post again and try another one.");
    }
  };
  return <section className="lesson-panel"><Heading eyebrow="GRAMMAR IN CONTEXT" title="Anna learns to drive" Text={Text} />
    <div className="lesson-1b-task">
      <h3><Text>Match Anna's posts to photos 1-3.</Text></h3>
      <p><Text>Click a post. Then click the photo that shows the same moment.</Text></p>
      <div className="lesson-8a-post-match-board">
        <div className="lesson-8a-post-list">{annaPosts.map(([letter, post]) => { const matched = matchedPosts.includes(letter); return <button aria-pressed={selectedPost === letter} className={(selectedPost === letter ? "is-selected " : "") + (matched ? "is-matched" : "")} disabled={matched} key={letter} onClick={() => { setSelectedPost(letter); setMatchMessage("Now click the matching photo."); }} type="button"><span>POST</span><p><Text>{post}</Text></p></button>; })}</div>
        <div className="lesson-8a-photo-list">{photoMatches.map(([number, file, correct]) => { const matched = answers["8a-story-post-" + number] === correct; return <button className={matched ? "is-matched" : ""} disabled={matched} key={number} onClick={() => matchPhoto(number, correct)} type="button"><span>{number}</span><img alt={"Driving story photo " + number} src={media(file)} />{matched && <b>✓</b>}</button>; })}</div>
      </div>
      {matchMessage && <p aria-live="polite" className="lesson-8a-match-message">{matchMessage}</p>}
      <Track file="sb-8a-posts-check.mp3" label="Listen and check" />
    </div>
    <div className="lesson-1b-task">
      <h3><Text>Anna phones a driving instructor. Complete the conversation with the verbs.</Text></h3>
      <p><Text>Click a word. Then click a gap in the conversation.</Text></p>
      <div className="lesson-8a-word-bank interactive">{["book", "come", "help", "meet", "start"].map((word) => <button aria-pressed={selectedVerb === word} className={selectedVerb === word ? "is-selected" : ""} key={word} onClick={() => setSelectedVerb(word)} type="button">{word}{word === "come" && <small>×2</small>}</button>)}</div>
      <img alt="Anna speaking to a driving instructor by phone" className="lesson-8a-call-image" src={media("anna-phone-call.png")} />
      <div className="lesson-8a-dialogue full-width">{dialogueRows.map(([speaker, before, correct, after], index) => {
        const id = "8a-story-dialogue-" + (index + 1);
        const speakerClass = speaker === "Anna" ? "speaker-b" : "speaker-a";
        if (!correct) return <div className={speakerClass} key={id}><b>{speaker}</b><span><Text>{before}</Text></span></div>;
        const value = answers[id] ?? "";
        return <div className={speakerClass} key={id}><b>{speaker}</b><span><Text>{before}</Text><button aria-label={"Gap: " + before + " " + after} className={"lesson-8a-word-gap " + (value ? (value === correct ? "is-correct" : "is-incorrect") : "")} onClick={() => selectedVerb && onAnswer(id, selectedVerb)} type="button">{value || "______"}</button><Text>{after}</Text></span>{value && <Feedback correct={value === correct} hint="Choose another verb from the word bank." />}</div>;
      })}</div>
      <Track file="sb-8a-driving-instructor.mp3" label="Listen and check" />
      <div className="lesson-8a-practise-call"><strong>PAIR WORK</strong><Text>Practise the conversation. Then change the day and the lesson time.</Text></div>
    </div>
    <div className="lesson-1b-task lesson-8a-test-result"><div><h3><Text>After three months, Anna takes her driving test.</Text></h3><Track file="sb-8a-driving-test.mp3" label="Listen. Does she pass?" /><Choice id="8a-story-test-result" prompt="Does Anna pass her driving test?" options={["Yes, she does.", "No, she doesn't."]} correct="No, she doesn't." {...props} /></div><img alt="Anna taking her driving test" src={media("anna-driving-test.png")} /></div>
  </section>;
}
function CanText({ text, Text }: { text: string; Text: TextComponent }) {
  return <>{text.split(/(\bcan(?:'t)?\b)/gi).filter(Boolean).map((part, index) => /^can(?:'t)?$/i.test(part) ? <strong className="lesson-8a-can-form" key={index}>{part}</strong> : <Text key={index}>{part}</Text>)}</>;
}

function Grammar(props: ExerciseProps) {
  const rows = [["+", "I ___ practise online.", "can"], ["−", "I ___ answer the questions.", "can't"], ["?", "___ you come at 8.30?", "Can"], ["✓", "Yes, I ___.", "can"], ["×", "No, I ___.", "can't"]] as const;
  const positive = ["I can park here.", "You can sit here.", "He can help us.", "We can have lunch outside.", "They can come tonight."];
  const negative = ["I can't park there.", "You can't sit there.", "He can't help us.", "We can't have lunch outside.", "They can't come tonight."];
  const questions = [["Can I park here?", "Yes, you can.", "No, you can't."], ["Can he help us?", "Yes, he can.", "No, he can't."], ["Can they come tonight?", "Yes, they can.", "No, they can't."]];
  return <section className="lesson-panel"><Heading eyebrow="GRAMMAR DISCOVERY" title="Can or can't?" Text={props.Text} />
    <div className="lesson-1b-task"><h3><props.Text>Complete the chart. Use can, can't, or Can.</props.Text></h3><div className="lesson-8a-grammar-discovery">{rows.map(([mark, sentence, correct], index) => { const parts = sentence.split("___"); const id = "8a-grammar-chart-" + (index + 1); const value = props.answers[id] ?? ""; return <label key={mark}><b>{mark}</b><span><props.Text>{parts[0]}</props.Text><select aria-label={sentence} className={value ? (value === correct ? "is-correct" : "is-incorrect") : ""} onChange={(event) => props.onAnswer(id, event.target.value)} value={value}><option value="">Choose</option><option>can</option><option>can't</option><option>Can</option></select><props.Text>{parts[1]}</props.Text></span>{value && <Feedback correct={value === correct} hint="Look at the symbol at the start of the row." />}</label>; })}</div></div>
    <Track file="sb-8a-grammar-examples.mp3" label="Listen and repeat the examples. Then read the rules." />
    <div className="lesson-8a-grammar-tables">
      <article><header><span>+</span><b>AFFIRMATIVE</b></header>{positive.map((sentence) => <p key={sentence}><CanText text={sentence} Text={props.Text} /></p>)}</article>
      <article><header><span>−</span><b>NEGATIVE</b></header>{negative.map((sentence) => <p key={sentence}><CanText text={sentence} Text={props.Text} /></p>)}</article>
    </div>
    <div className="lesson-8a-question-table">
      <div className="header"><b>?</b><span>QUESTION</span></div><div className="header"><b>✓</b><span>YES</span></div><div className="header"><b>×</b><span>NO</span></div>
      {questions.flatMap((row, rowIndex) => row.map((sentence, columnIndex) => <div className={"cell column-" + columnIndex} key={rowIndex + "-" + columnIndex}><CanText text={sentence} Text={props.Text} /></div>))}
    </div>
    <div className="rule-summary lesson-8a-rule"><span><CanText text="Can / can't is the same for all persons." Text={props.Text} /></span><span><CanText text="Put Can first in a question: Can I sit here? Do not use Do I can...?" Text={props.Text} /></span><span><CanText text="Use the base verb after can: You can park, not You can to park." Text={props.Text} /></span><span><CanText text="We also use can for things we know how to do: Can you drive?" Text={props.Text} /></span></div>
  </section>;
}

const sentencePractice = [
  ["?", "we / sit here", "Can we sit here?"],
  ["−", "I / drink this", "I can't drink this."],
  ["+", "James / help us tomorrow", "James can help us tomorrow."],
  ["?", "you / come to lunch on Sunday", "Can you come to lunch on Sunday?"],
  ["+", "You / finish work early today", "You can finish work early today."],
  ["−", "We / park here", "We can't park here."],
  ["?", "we / watch TV after dinner", "Can we watch TV after dinner?"],
  ["−", "He / go to school today", "He can't go to school today."]
] as const;

function ValidatedSentenceRow({ id, mark, cue, correct, answers, onAnswer, Text, example = false }: ExerciseProps & { id: string; mark: string; cue: string; correct: string; example?: boolean }) {
  const [checked, setChecked] = useState(example);
  const value = example ? correct : answers[id] ?? "";
  const ok = normalize(value) === normalize(correct);
  return <article className={"lesson-8a-sentence-builder " + (example ? "example-row" : "")}><b>{mark}</b><div><span><Text>{cue}</Text></span><input aria-label={cue} className={checked ? (ok ? "is-correct" : "is-incorrect") : ""} onBlur={() => value.trim() && setChecked(true)} onChange={(event) => { onAnswer(id, event.target.value); setChecked(false); }} onKeyDown={(event) => event.key === "Enter" && value.trim() && setChecked(true)} placeholder="Write the complete sentence" readOnly={example} spellCheck="false" value={value} /></div>{checked && !example && <Feedback correct={ok} hint="Check the symbol, can or can't, and the word order." />}</article>;
}

type TwoGapItem = {
  mark?: string;
  speaker?: string;
  before: string;
  between: string;
  after: string;
  modal: string;
  verb: string;
  reply?: { speaker: string; text: string };
};

const completePractice: readonly TwoGapItem[] = [
  { before: "I ", between: " ", after: " to work tomorrow. My sister needs the car.", modal: "can't", verb: "drive" },
  { speaker: "A", before: "", between: " I ", after: " with you?", modal: "Can", verb: "stay", reply: { speaker: "B", text: "No, I'm sorry. We only have one bedroom." } },
  { speaker: "A", before: "", between: " we ", after: " here?", modal: "Can", verb: "swim", reply: { speaker: "B", text: "No, the water's very cold and dirty." } },
  { before: "The restaurant's very near. We ", between: " ", after: " there.", modal: "can", verb: "walk" },
  { before: "Where ", between: " we ", after: " for lunch? I'm hungry.", modal: "can", verb: "go" },
  { before: "You ", between: " ", after: " TV when you finish your homework.", modal: "can", verb: "watch" },
  { speaker: "A", before: "", between: " you ", after: " to dinner at my house on Saturday?", modal: "Can", verb: "come", reply: { speaker: "B", text: "I'm sorry, I can't. It's my mother's birthday." } },
  { speaker: "A", before: "Excuse me. You ", between: " ", after: " to music in the museum.", modal: "can't", verb: "listen", reply: { speaker: "B", text: "Sorry!" } }
];

function TwoGapExercise({ id, item, answers, onAnswer, Text }: ExerciseProps & { id: string; item: TwoGapItem }) {
  const [checked, setChecked] = useState(false);
  const modalId = id + "-modal";
  const verbId = id + "-verb";
  const modalValue = answers[modalId] ?? "";
  const verbValue = answers[verbId] ?? "";
  const ready = Boolean(modalValue.trim() && verbValue.trim());
  const ok = normalize(modalValue) === normalize(item.modal) && normalize(verbValue) === normalize(item.verb);
  const validate = () => ready && setChecked(true);
  return <article className="lesson-8a-inline-gap-exercise">
    <div className={item.speaker === "A" ? "speaker-a" : ""}>{item.speaker && <b>{item.speaker}</b>}<p><Text>{item.before}</Text><input aria-label="can or can't" className={checked ? (normalize(modalValue) === normalize(item.modal) ? "is-correct" : "is-incorrect") : ""} onBlur={validate} onChange={(event) => { onAnswer(modalId, event.target.value); setChecked(false); }} value={modalValue} /><Text>{item.between}</Text><input aria-label="verb" className={checked ? (normalize(verbValue) === normalize(item.verb) ? "is-correct" : "is-incorrect") : ""} onBlur={validate} onChange={(event) => { onAnswer(verbId, event.target.value); setChecked(false); }} value={verbValue} /><Text>{item.after}</Text></p></div>
    {item.reply && <div className="speaker-b"><b>{item.reply.speaker}</b><p><CanText text={item.reply.text} Text={Text} /></p></div>}
    {checked && <Feedback correct={ok} hint="Check both gaps: can or can't, then the base verb." />}
  </article>;
}

function Practice(props: ExerciseProps) {
  return <section className="lesson-panel"><Heading eyebrow="CONTROLLED PRACTICE" title="Build sentences with can" Text={props.Text} />
    <div className="lesson-1b-task"><h3><props.Text>Write sentences or questions with can or can't.</props.Text></h3><div className="lesson-8a-input-list"><ValidatedSentenceRow id="8a-practice-example" mark="−" cue="You / play football here" correct="You can't play football here." example {...props} />{sentencePractice.map(([mark, cue, correct], index) => <ValidatedSentenceRow id={"8a-practice-sentence-" + (index + 1)} key={cue} mark={mark} cue={(index + 1) + ". " + cue} correct={correct} {...props} />)}</div></div>
    <div className="lesson-1b-task"><h3><props.Text>Complete with can or can't and a verb.</props.Text></h3><p><props.Text>Type in the two gaps. Your answer is checked when you leave the line.</props.Text></p><div className="lesson-8a-word-bank">{["come", "drive", "go", "listen", "stay", "swim", "walk", "watch"].map((word) => <span key={word}>{word}</span>)}</div><div className="lesson-8a-complete-practice">{completePractice.map((item, index) => <TwoGapExercise id={"8a-practice-complete-" + (index + 1)} item={item} key={index} {...props} />)}</div></div>
  </section>;
}
const soundSentences = [
  ["ə", "computer", "sound-computer.svg", ["Where can I park?", "You can park here."]],
  ["æ", "cat", "sound-cat.svg", ["Can I park here?", "Yes, you can."]],
  ["ɑː", "car", "sound-car.svg", ["No, you can't.", "You can't park here."]]
] as const;
const canCantPairs = [
  ["We can park here.", "We can't park here."],
  ["I can help you.", "I can't help you."],
  ["You can sit here.", "You can't sit here."],
  ["Max can go with me.", "Max can't go with me."]
] as const;

function Pronunciation(props: ExerciseProps) {
  return <section className="lesson-panel"><Heading eyebrow="PRONUNCIATION & LISTENING" title="Can, can't, and sentence rhythm" Text={props.Text} />
    <Track file="sb-8a-pronunciation-model.mp3" label="Listen and repeat the sounds and sentences. Copy the rhythm." />
    <div className="lesson-8a-sounds">{soundSentences.map(([sound, anchor, image, sentences]) => <article key={sound}><div><img alt={anchor} src={media(image)} /><span>/{sound}/</span><b>{anchor}</b></div><div>{sentences.map((sentence) => <p key={sentence}><CanText text={sentence} Text={props.Text} /></p>)}</div></article>)}</div>
    <div className="lesson-8a-pronunciation-note"><p><CanText text="can in a normal sentence is usually weak: /kən/." Text={props.Text} /></p><p><CanText text="can't is strong and long in British English: /kɑːnt/." Text={props.Text} /></p></div>
    <div className="lesson-1b-task"><h3><props.Text>Listen to the difference between can and can't.</props.Text></h3><Track file="sb-8a-can-cant-difference.mp3" label="Listen to a and b" /><div className="lesson-8a-pairs">{canCantPairs.map(([a, b], index) => <p key={a}><b>{index + 1}</b><span>a · <CanText text={a} Text={props.Text} /></span><span>b · <CanText text={b} Text={props.Text} /></span></p>)}</div><Track file="sb-8a-circle-a-b.mp3" label="Listen and choose a or b" /><div className="lesson-8a-ab-grid">{["a", "b", "b", "a"].map((correct, index) => <Choice id={"8a-pronunciation-ab-" + (index + 1)} key={index} prompt={"Item " + (index + 1)} options={["a", "b"]} correct={correct} {...props} />)}</div></div>
    <div className="lesson-1b-task"><h3><props.Text>Listen to four conversations. Where are the people?</props.Text></h3><p><props.Text>First listen for the general situation. Then listen again and choose the exact place.</props.Text></p><Track file="sb-8a-four-conversations.mp3" label="Listen twice and choose the place" /><Choice id="8a-pronunciation-place-1" prompt="1. They are on a..." options={["bus", "street", "train"]} correct="train" {...props} /><Choice id="8a-pronunciation-place-2" prompt="2. They are in a..." options={["café", "shop", "hotel"]} correct="shop" {...props} /><Choice id="8a-pronunciation-place-3" prompt="3. They are in a..." options={["café", "restaurant", "taxi"]} correct="restaurant" {...props} /><Choice id="8a-pronunciation-place-4" prompt="4. They are in the..." options={["cinema", "street", "hotel"]} correct="street" {...props} /></div>
  </section>;
}
const signs = [
  ["🚫🏊", "can't", "swim", "You can't swim here."],
  ["🅿️", "can", "park", "You can park here."],
  ["☕", "can", "have", "You can have a coffee here."],
  ["💳", "can't", "pay", "You can't pay cash here."],
  ["🚫📱", "can't", "use", "You can't use your phone here."],
  ["📶", "can", "use", "You can use the internet here."],
  ["🚫📷", "can't", "take", "You can't take photos here."],
  ["🚫⚽", "can't", "play", "You can't play football here."],
  ["💱", "can", "change", "You can change money here."],
  ["20", "can't", "drive", "You can't drive fast here."]
] as const;

function Vocabulary(props: ExerciseProps) {
  const { answers, onAnswer, Text } = props;
  return <section className="lesson-panel"><Heading eyebrow="VOCABULARY" title="What do the signs mean?" Text={Text} />
    <div className="lesson-1b-task"><h3><Text>Complete each sentence with can or can't and a verb.</Text></h3><div className="lesson-8a-sign-grid">{signs.map(([icon, modal, verb, sentence], index) => { const modalId = "8a-vocabulary-modal-" + (index + 1); const verbId = "8a-vocabulary-verb-" + (index + 1); const modalValue = answers[modalId] ?? ""; const verbValue = answers[verbId] ?? ""; return <article key={sentence}><span>{index + 1}</span><i>{icon}</i><div><Text>You</Text><select aria-label={"Can or can't for sign " + (index + 1)} className={modalValue ? (modalValue === modal ? "is-correct" : "is-incorrect") : ""} onChange={(event) => onAnswer(modalId, event.target.value)} value={modalValue}><option value="">can / can't</option><option>can</option><option>can't</option></select><select aria-label={"Verb for sign " + (index + 1)} className={verbValue ? (verbValue === verb ? "is-correct" : "is-incorrect") : ""} onChange={(event) => onAnswer(verbId, event.target.value)} value={verbValue}><option value="">verb</option>{["change", "drive", "have", "park", "pay", "play", "swim", "take", "use"].map((word) => <option key={word}>{word}</option>)}</select><Text>{sentence.replace(/^You (can|can't) \w+/, "")}</Text></div>{modalValue && verbValue && <Feedback correct={modalValue === modal && verbValue === verb} hint="Look carefully at the red line or the service symbol." />}</article>; })}</div><Track file="sb-8a-signs-check.mp3" label="Listen and check. Then cover the sentences and say what the signs mean." /></div>
    <div className="lesson-1b-task"><h3><Text>More verb phrases</Text></h3><div className="lesson-8a-phrase-cards">{[["📸", "take photos"], ["☕", "have a coffee"], ["💳", "pay by card"], ["💱", "change money"], ["🏊", "swim"], ["🚗", "drive"], ["⚽", "play football"], ["📱", "use your phone"], ["🅿️", "park"]].map(([icon, phrase]) => <article key={phrase}><span>{icon}</span><Text>{phrase}</Text></article>)}</div></div>
  </section>;
}

function Speaking({ answers, onAnswer, Text }: ExerciseProps) {
  const questions = ["Where can I have a good, cheap meal?", "Where can I see films in English?", "Where can I go with small children?", "Where can I go in the evening?", "Can I go shopping in the evening?", "Can I park in the town centre?"];
  return <section className="lesson-panel"><Heading eyebrow="SPEAKING & WRITING" title="I'm a tourist. Where can I...?" Text={Text} />
    <div className="lesson-8a-town-images"><img alt="A café terrace in town" src={media("town-cafe.png")} /><img alt="A shopping street" src={media("town-shopping.png")} /><img alt="A park and lake" src={media("town-park.png")} /></div>
    <div className="lesson-8a-role-grid"><article><span>🧳</span><h3><Text>Student A · Tourist</Text></h3><p><Text>Ask the questions. Add one question of your own.</Text></p>{questions.map((question) => <p key={question}><Text>{question}</Text></p>)}</article><article><span>🏠</span><h3><Text>Student B · Local person</Text></h3><p><Text>Answer with can or can't. Give one useful detail.</Text></p><p><Text>You can have a good, cheap meal at the market.</Text></p><p><Text>You can't park in the town centre, but you can park near the station.</Text></p></article></div>
    <div className="lesson-1b-task"><h3><Text>Write four useful sentences for tourists about your town.</Text></h3><div className="practice-example"><span>EXAMPLE</span><p><Text>You can buy fantastic fruit in the market.</Text></p></div>{Array.from({ length: 4 }, (_, index) => <label className="lesson-8a-writing-row" key={index}><span>{index + 1}</span><textarea onChange={(event) => onAnswer("8a-speaking-town-" + (index + 1), event.target.value)} placeholder="You can... / You can't..." value={answers["8a-speaking-town-" + (index + 1)] ?? ""} /></label>)}</div>
  </section>;
}

const reviewQuestions = [
  ["___ I park here?", ["Do", "Can", "Am"], "Can"],
  ["She ___ help us. (negative)", ["can't", "doesn't can", "not can"], "can't"],
  ["Can they come tonight? — Yes, ___.", ["can they", "they can", "do they"], "they can"],
  ["Which question is correct?", ["Can I sit here?", "Do I can sit here?"], "Can I sit here?"],
  ["Can he come at ten? — No, he ___.", ["isn't", "can't", "doesn't"], "can't"],
  ["Which sentence has weak /ə/?", ["I can park here.", "I CAN come at ten!"], "I can park here."],
  ["You can't pay cash here. You can pay by ___.", ["card", "phone", "friend"], "card"],
  ["A football sign with a red line means...", ["You can play here.", "You can't play here."], "You can't play here."]
] as const;

function Review(props: ExerciseProps) {
  const score = reviewQuestions.filter(([, , correct], index) => props.answers["8a-review-" + (index + 1)] === correct).length;
  return <section className="lesson-panel"><Heading eyebrow="LESSON REVIEW" title="Your grammar race" Text={props.Text} mode="IF THERE IS TIME" /><div className="review-score"><span>{score} / {reviewQuestions.length}</span><div><b style={{ width: Math.round(score / reviewQuestions.length * 100) + "%" }} /></div><p><props.Text>Answer all questions. You can change an answer and try again.</props.Text></p></div><div className="review-exit-grid">{reviewQuestions.map(([prompt, options, correct], index) => <Choice id={"8a-review-" + (index + 1)} key={prompt} prompt={(index + 1) + ". " + prompt} options={options} correct={correct} {...props} />)}</div><div className="lesson-8a-can-do"><strong>NOW I CAN</strong><props.Text>ask for permission, understand simple signs, and say what people can or can't do.</props.Text></div></section>;
}

const homeworkSigns = [
  ["🚫🅿️", "You can't park here."],
  ["🚫🏊", "You can't swim here."],
  ["💱", "You can change money here."],
  ["☕", "You can drink coffee here."],
  ["🍽️", "You can eat food here."],
  ["🚫🎵", "You can't listen to music here."]
] as const;
const homeworkQuestions = [
  ["___? The water is very cold today. (we / swim)", "Can we swim"],
  ["___ TV? Finish your homework first. (we / watch)", "Can we watch"],
  ["Excuse me. ___ here? (I / sit)", "Can I sit"],
  ["___ golf on Saturday? (you / play)", "Can you play"],
  ["It's an email from Amina. ___ it? (I / read)", "Can I read"]
] as const;
const homeworkSounds = [
  ["Can I help you?", "/ə/"],
  ["Where can I sit down?", "/ə/"],
  ["Sorry, I can't.", "/ɑː/"],
  ["Yes, you can.", "/æ/"],
  ["You can learn to drive here.", "/ə/"],
  ["I can't speak Polish.", "/ɑː/"]
] as const;

function Homework(props: ExerciseProps) {
  const { answers, onAnswer, Text } = props;
  return <section className="lesson-panel lesson-8a-homework"><Heading eyebrow="HOMEWORK · WORKBOOK 8A" title="Can I park here?" Text={Text} />
    <div className="lesson-8a-homework-welcome"><img alt="Homework notebook" src={media("homework-notebook.png")} /><p className="lesson-8a-homework-intro"><Text>Complete the activities independently. Your answers stay available for your next class.</Text></p></div>
    <div className="lesson-8a-homework-plan"><div><strong>6</strong><span><b>activities</b><small>grammar, vocabulary, pronunciation, and writing</small></span></div><div><strong>34+</strong><span><b>answers</b><small>with automatic checking where possible</small></span></div><div><strong>30–40</strong><span><b>minutes</b><small>you can take a short break after activity 3</small></span></div></div>

    <details className="homework-extra" open><summary><span>1</span><b><Text>Signs: choose the meaning.</Text></b><small>CORE · 6 items</small></summary><div>
      <div className="practice-example lesson-8a-homework-example"><span>EXAMPLE</span><p><i>🚫📷</i><Text>You can't take photos here.</Text></p></div>
      <div className="lesson-8a-hw-signs">{homeworkSigns.map(([icon, correct], index) => <div className="lesson-8a-hw-sign" key={correct}><i>{icon}</i><Choice id={"8a-homework-sign-" + (index + 1)} prompt={"Sign " + (index + 1)} options={index % 2 === 0 ? [correct.includes("can't") ? correct.replace("can't", "can") : correct.replace("can", "can't"), correct] : [correct, correct.includes("can't") ? correct.replace("can't", "can") : correct.replace("can", "can't")]} correct={correct} {...props} /></div>)}</div>
    </div></details>

    <details className="homework-extra" open><summary><span>2</span><b><Text>Build the questions.</Text></b><small>CORE · 5 items</small></summary><div className="lesson-8a-input-list"><div className="practice-example"><span>EXAMPLE</span><p><Text>Can I have an espresso, please?</Text></p></div>{homeworkQuestions.map(([prompt, correct], index) => <AnswerInput id={"8a-homework-question-" + (index + 1)} key={prompt} prompt={(index + 1) + ". " + prompt} correct={correct} {...props} />)}</div></details>

    <details className="homework-extra"><summary><span>3</span><b><Text>Pronunciation: choose the sound of can or can't.</Text></b><small>CORE · 6 items</small></summary><div>
      <div className="practice-example lesson-8a-homework-example"><span>EXAMPLE</span><p><CanText text="I can park here. → can /ə/" Text={Text} /></p></div>
      <div className="lesson-8a-ab-grid">{homeworkSounds.map(([sentence, correct], index) => <Choice id={"8a-homework-sound-" + (index + 1)} key={sentence} prompt={(index + 1) + ". " + sentence} options={["/ə/", "/æ/", "/ɑː/"]} correct={correct} {...props} />)}</div>
    </div></details>

    <details className="homework-extra"><summary><span>4</span><b><Text>Complete the verb phrases.</Text></b><small>CORE · 9 items</small></summary><div>
      <div className="practice-example lesson-8a-homework-example"><span>EXAMPLE</span><p><Text>🚗 dr_____ → drive</Text></p></div>
      <div className="lesson-8a-input-list">{[["📸 t_____ a ph_____", "take a photo"], ["☕ h_____ a c_____", ["have a coffee", "have coffee"]], ["💳 p_____ by c_____", "pay by card"], ["💱 ch_____ m_____", "change money"], ["🏊 sw_____", "swim"], ["🚗 dr_____", "drive"], ["⚽ pl_____ f_____", "play football"], ["📱 u_____ your ph_____", "use your phone"], ["🅿️ p_____", "park"]].map(([prompt, correct], index) => <AnswerInput id={"8a-homework-phrase-" + (index + 1)} key={String(prompt)} prompt={(index + 1) + ". " + prompt} correct={correct as string | readonly string[]} {...props} />)}</div>
    </div></details>

    <details className="homework-extra"><summary><span>5</span><b><Text>Write rules for places in your country.</Text></b><small>CORE · at least 3 sentences</small></summary><div>
      <div className="practice-example lesson-8a-homework-example"><span>EXAMPLE</span><p><Text>In a museum, you can't take photos.</Text></p></div>
      <p><Text>Choose at least three places and write one sentence about each. The other places are optional.</Text></p>{["in a school", "at the beach", "in a museum", "in a supermarket", "in a coffee shop", "in a gym"].map((place, index) => <label className={"lesson-8a-writing-row " + (index > 2 ? "optional" : "")} key={place}><span>{index + 1}</span><Text>{place}</Text>{index > 2 && <small>OPTIONAL</small>}<textarea onChange={(event) => onAnswer("8a-homework-writing-" + (index + 1), event.target.value)} placeholder={index > 2 ? "Optional" : "You can... / You can't..."} value={answers["8a-homework-writing-" + (index + 1)] ?? ""} /></label>)}
    </div></details>

    <details className="homework-extra"><summary><span>6</span><b><Text>Complete the conversations.</Text></b><small>CORE · 5 gaps</small></summary><div>
      <div className="practice-example lesson-8a-homework-example"><span>EXAMPLE</span><p><Text>Can I help you? — Yes, of course.</Text></p></div>
      <div className="lesson-8a-word-bank">{["a theory test", "I'm free", "learn to drive", "start the car", "Yes, of course"].map((phrase) => <span key={phrase}>{phrase}</span>)}</div>{[["When can we see the film? — ___ on Friday night.", "I'm free"], ["Can I have another drink? — ___. Here you are.", "Yes, of course"], ["I want to ___. Do you know an instructor?", "learn to drive"], ["Do you need to take ___?", "a theory test"], ["Your practical test begins now. Please ___.", "start the car"]].map(([prompt, correct], index) => { const parts = prompt.split("___"); const id = "8a-homework-conversation-" + (index + 1); const value = answers[id] ?? ""; return <label className="lesson-8a-select-row" key={prompt}><span>{index + 1}</span><Text>{parts[0]}</Text><select aria-label={"Conversation " + (index + 1) + " missing phrase"} className={value ? (value === correct ? "is-correct" : "is-incorrect") : ""} onChange={(event) => onAnswer(id, event.target.value)} value={value}><option value="">Choose a phrase</option>{["a theory test", "I'm free", "learn to drive", "start the car", "Yes, of course"].map((phrase) => <option key={phrase}>{phrase}</option>)}</select><Text>{parts[1]}</Text>{value && <Feedback correct={value === correct} hint="Read the whole conversation and choose the natural phrase." />}</label>; })}
    </div></details>
  </section>;
}

function ReferencePanel({ kind, onClose, Text }: { kind: Exclude<ReferenceKind, null>; onClose: () => void; Text: TextComponent }) {
  const vocabulary = [["drive", "control and move a car"], ["driving licence", "the document that permits you to drive"], ["driving instructor", "a person who teaches you to drive"], ["driving lesson", "a class in which you learn to drive"], ["learn to drive", "study and practise driving"], ["book a lesson", "arrange a lesson for a time"], ["practise online", "do practice activities on the internet"], ["theory test", "a written test about driving rules"], ["practical test", "a test in which you show that you can drive"], ["psychological test", "a test of how a person thinks or reacts"], ["take a test", "do a test or examination"], ["pass", "be successful in a test"], ["fail", "be unsuccessful in a test"], ["park", "leave a car in a place"], ["yellow line", "a road marking that shows a parking rule"], ["road sign", "a sign that gives road information or rules"], ["take photos", "make pictures with a camera"], ["pay by card", "use a bank card to pay"], ["pay cash", "pay using notes or coins"], ["change money", "exchange one currency for another"], ["use the internet", "go online"], ["use your phone", "make calls or use apps"], ["play football", "play the sport"], ["swim", "move through water"], ["have a coffee", "drink a coffee"], ["start the car", "turn on the car engine"], ["I'm free", "I am available at that time"], ["town centre", "the central part of a town"], ["sentence rhythm", "the pattern of strong and weak words"]] as const;
  return <div className="reference-backdrop" onMouseDown={onClose}><aside aria-modal="true" className={"reference-panel lesson-1b-reference-panel " + kind} onMouseDown={(event) => event.stopPropagation()} role="dialog">
    <header className="reference-panel-header"><div><p>{kind === "grammar" ? "GRAMMAR 8A" : "VOCABULARY 8A"}</p><h2><Text>{kind === "grammar" ? "Can / can't" : "More verb phrases"}</Text></h2></div><button aria-label="Close" onClick={onClose} type="button">×</button></header>
    <div className="reference-panel-body lesson-8a-reference-body">{kind === "grammar" ? <>
      <div className="lesson-8a-reference-grammar"><article><b>+</b><CanText text="I can drive." Text={Text} /></article><article><b>−</b><CanText text="I can't swim." Text={Text} /></article><article><b>?</b><CanText text="Can I park here?" Text={Text} /></article></div>
      <p><CanText text="Use can for permission, possibility, and things you know how to do." Text={Text} /></p>
      <p><CanText text="Can is the same with I, you, he, she, we, and they. Use the base verb after can." Text={Text} /></p>
    </> : <div className="lesson-8a-reference-list">{vocabulary.map(([phrase, meaning]) => <article key={phrase}><h3><Text>{phrase}</Text></h3><p><Text>{meaning}</Text></p></article>)}</div>}</div>
  </aside></div>;
}
