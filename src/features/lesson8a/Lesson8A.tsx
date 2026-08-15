import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import { ClickableText } from "../../components/ClickableText";
import { type CourseLessonId } from "../../components/LessonPicker";
import { WordCard } from "../../components/WordCard";
import type { LexicalEntry } from "../../types";
import "./Lesson8A.css";

type ViewId = "overview" | "reading" | "story" | "grammar" | "practice" | "pronunciation" | "vocabulary" | "speaking" | "review" | "homework";
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
  { id: "reading", number: "02", label: "Driving round the world" },
  { id: "story", number: "03", label: "Anna learns to drive" },
  { id: "grammar", number: "04", label: "Can · Can't" },
  { id: "practice", number: "05", label: "Grammar practice" },
  { id: "pronunciation", number: "06", label: "Pronunciation & listening" },
  { id: "vocabulary", number: "07", label: "Signs & verb phrases" },
  { id: "speaking", number: "08", label: "Tourist in town" },
  { id: "review", number: "09", label: "Review" },
  { id: "homework", number: "HW", label: "Homework" }
];

const answerPrefixes: Record<ViewId, string[]> = {
  overview: ["8a-overview-"],
  reading: ["8a-reading-"],
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
  else if (view === "reading") content = <Reading {...common} />;
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
    <div className="course-layout">
      <nav aria-label="Lesson sections" className="lesson-nav"><p>LESSON 8A</p>{sections.map((section) => <button className={(section.id === view ? "active " : "") + (progress.completed.includes(section.id) ? "complete " : "") + (section.id === "homework" ? "homework-link" : "")} key={section.id} onClick={() => setView(section.id)} type="button"><span>{section.number}</span>{section.label}{progress.completed.includes(section.id) && <i>✓</i>}</button>)}</nav>
      <main>{content}<div className="lesson-actions"><button className="secondary-action" disabled={currentIndex === 0} onClick={() => setView(sections[Math.max(0, currentIndex - 1)].id)} type="button">← Previous</button><button className="primary-action" onClick={finish} type="button">{progress.completed.includes(view) ? "Completed ✓" : view === "homework" ? "Mark homework ready" : "Complete & continue"}</button></div></main>
    </div>
    {activeWord && <WordCard context={activeWord.context} entry={activeWord.entry} lessonId="8a-can-i-park-here" onClose={() => setActiveWord(null)} />}
    {reference && <ReferencePanel kind={reference} onClose={() => setReference(null)} Text={Text} />}
  </div>;
}

function Heading({ eyebrow, title, Text, mode = "CORE" }: { eyebrow: string; title: string; Text: TextComponent; mode?: "CORE" | "IF THERE IS TIME" }) {
  return <div className="lesson-1b-heading lesson-8a-section-heading"><div><p>{eyebrow}</p><span className={mode === "CORE" ? "core" : "extra"}>{mode}</span></div><h2><Text>{title}</Text></h2></div>;
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
  return <section className="lesson-panel lesson-8a-overview">
    <div className="lesson-8a-hero"><div><p className="lesson-kicker">8A · PERMISSION & POSSIBILITY</p><h1><Text>Can I park here?</Text></h1><p><Text>Ask for permission, understand signs, and talk about things you can or can't do.</Text></p><div className="lesson-8a-goals"><span>G <Text>can / can't</Text></span><span>V <Text>more verb phrases</Text></span><span>P <Text>/ə/, /æ/, /ɑː/ and rhythm</Text></span></div><div className="lesson-8a-reference-buttons"><button onClick={() => onReference("grammar")} type="button">Grammar</button><button onClick={() => onReference("vocabulary")} type="button">Vocabulary</button></div></div><img alt="Colourful cars driving around a globe" src={media("driving-round-the-world.jpg")} /></div>
    <div className="lesson-8a-model-dialogue"><p><b>A</b><Text>Can you come on Monday at 8.30?</Text></p><p><b>B</b><Text>No, I can't, but I can come at 10.00.</Text></p></div>
    <SelfChoice id="8a-overview-drive" prompt="And you? Can you drive?" options={["Yes, I can.", "No, I can't."]} {...{ answers, onAnswer, Text }} />
  </section>;
}

const drivingTestSentences = [
  "In Qatar, you can take the driving ___ when you are 14.",
  "In some states in Mexico, you only need a theory ___, not a practical one.",
  "In Vietnam, the theory ___ has 450 questions.",
  "In Croatia, you need 85 hours of lessons before the practical ___.",
  "In Ukraine, two mistakes in the practical ___ mean you fail.",
  "In Brazil, after your driving ___, you need a psychological test."
] as const;

const countryClues = [
  ["You can take the driving test when you are 14.", "Qatar"],
  ["In some states, a theory test is enough.", "Mexico"],
  ["The theory test has 450 questions.", "Vietnam"],
  ["You need 85 hours of lessons before the practical test.", "Croatia"],
  ["Two mistakes in the practical test mean you fail.", "Ukraine"],
  ["You need a psychological test after the driving test.", "Brazil"]
] as const;

function Reading(props: ExerciseProps) {
  const { answers, onAnswer, Text } = props;
  const countries = ["Brazil", "Croatia", "Mexico", "Qatar", "Ukraine", "Vietnam"];
  return <section className="lesson-panel"><Heading eyebrow="READING & SPEAKING" title="Driving round the world" Text={Text} />
    <div className="lesson-1b-task lesson-8a-reading-intro"><img alt="Small colourful cars around a globe" src={media("driving-round-the-world.jpg")} /><div><h3><Text>Read the text. What is the missing word?</Text></h3><p><Text>The same word completes all the gaps.</Text></p></div></div>
    <div className="lesson-1b-task"><div className="lesson-8a-core-label">CORE</div><div className="lesson-8a-missing-list">{drivingTestSentences.map((sentence, index) => <MissingWordInput id={"8a-reading-test-" + (index + 1)} key={sentence} sentence={(index + 1) + ". " + sentence} correct="test" {...props} />)}</div><Track file="sb-8a-reading-check.mp3" label="Listen and check · 8.1" /></div>
    <div className="lesson-1b-task lesson-8a-extra-task"><div className="lesson-8a-core-label extra">IF THERE IS TIME</div><h3><Text>Which country? Match each fact to a country.</Text></h3><div className="lesson-8a-fact-grid">{countryClues.map(([fact, correct], index) => <Choice id={"8a-reading-country-" + (index + 1)} key={fact} prompt={(index + 1) + ". " + fact} options={countries} correct={correct} {...props} />)}</div><p className="lesson-8a-speaking-prompt"><Text>Which fact is the most surprising? Tell your teacher.</Text></p></div>
    <div className="lesson-1b-task"><h3><Text>In your country...</Text></h3><p><Text>Answer the questions. Short notes are OK. Use complete sentences when you speak.</Text></p>{["At what age can you get a driving licence?", "Do you need to take a theory test?", "Is the practical test difficult?", "Do people usually need a lot of driving lessons?", "Do many people fail the first time?"].map((prompt, index) => <label className="lesson-8a-writing-row" key={prompt}><span>{index + 1}</span><Text>{prompt}</Text><textarea onChange={(event) => onAnswer("8a-reading-country-note-" + (index + 1), event.target.value)} placeholder={index === 0 ? "Example: In my country you can get a driving licence when you are..." : "Write a short answer"} value={answers["8a-reading-country-note-" + (index + 1)] ?? ""} /></label>)}</div>
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
  return <section className="lesson-panel"><Heading eyebrow="GRAMMAR IN CONTEXT" title="Anna learns to drive" Text={Text} />
    <div className="lesson-1b-task"><h3><Text>Match Anna's posts A-C to photos 1-3.</Text></h3><div className="lesson-8a-posts">{annaPosts.map(([letter, post]) => <article key={letter}><b>{letter}</b><p><Text>{post}</Text></p></article>)}</div><div className="lesson-8a-photo-match">{[["1", "anna-photo-1.png", "B"], ["2", "anna-photo-2.png", "C"], ["3", "anna-photo-3.png", "A"]].map(([number, file, correct]) => { const id = "8a-story-post-" + number; const value = answers[id] ?? ""; return <label key={number}><span>{number}</span><img alt={"Driving story photo " + number} src={media(file)} /><select aria-label={"Post for picture " + number} className={value ? (value === correct ? "is-correct" : "is-incorrect") : ""} onChange={(event) => onAnswer(id, event.target.value)} value={value}><option value="">Choose a post</option><option>A</option><option>B</option><option>C</option></select>{value && <Feedback correct={value === correct} hint="Read the event in each post again." />}</label>; })}</div><Track file="sb-8a-posts-check.mp3" label="Listen and check · 8.2" /></div>
    <div className="lesson-1b-task"><h3><Text>Anna phones a driving instructor. Complete the conversation with the verbs.</Text></h3><div className="lesson-8a-word-bank">{["book", "come", "come", "help", "meet", "start"].map((word, index) => <span key={word + index}>{word}</span>)}</div><div className="lesson-8a-dialogue-wrap"><div className="lesson-8a-dialogue">{dialogueRows.map(([speaker, before, correct, after], index) => { const id = "8a-story-dialogue-" + (index + 1); if (!correct) return <div className={speaker === "Anna" ? "speaker-b" : "speaker-a"} key={id}><b>{speaker}</b><span><Text>{before}</Text></span></div>; const value = answers[id] ?? ""; return <label className={speaker === "Anna" ? "speaker-b" : "speaker-a"} key={id}><b>{speaker}</b><span><Text>{before}</Text><select aria-label={before + " gap " + after} className={value ? (value === correct ? "is-correct" : "is-incorrect") : ""} onChange={(event) => onAnswer(id, event.target.value)} value={value}><option value="">verb</option>{["book", "come", "help", "meet", "start"].map((word) => <option key={word}>{word}</option>)}</select><Text>{after}</Text></span>{value && <Feedback correct={value === correct} hint="Use the meaning of the whole sentence." />}</label>; })}</div><img alt="Anna speaking to a driving instructor by phone" src={media("anna-phone-call.png")} /></div><Track file="sb-8a-driving-instructor.mp3" label="Listen and check · 8.3" /><div className="lesson-8a-practise-call"><strong>PAIR WORK</strong><Text>Practise the conversation. Then change the day and the lesson time.</Text></div></div>
    <div className="lesson-1b-task lesson-8a-test-result"><div><h3><Text>After three months, Anna takes her driving test.</Text></h3><Track file="sb-8a-driving-test.mp3" label="Listen. Does she pass? · 8.4" /><Choice id="8a-story-test-result" prompt="Does Anna pass her driving test?" options={["Yes, she does.", "No, she doesn't."]} correct="No, she doesn't." {...props} /></div><img alt="Anna taking her driving test" src={media("anna-driving-test.png")} /></div>
  </section>;
}

function Grammar(props: ExerciseProps) {
  const rows = [["+", "I ___ practise online.", "can"], ["−", "I ___ answer the questions.", "can't"], ["?", "___ you come at 8.30?", "Can"], ["✓", "Yes, I ___.", "can"], ["×", "No, I ___.", "can't"]] as const;
  return <section className="lesson-panel"><Heading eyebrow="GRAMMAR DISCOVERY" title="Can or can't?" Text={props.Text} />
    <div className="lesson-1b-task"><h3><props.Text>Complete the chart. Use can, can't, or Can.</props.Text></h3><div className="lesson-8a-grammar-discovery">{rows.map(([mark, sentence, correct], index) => { const parts = sentence.split("___"); const id = "8a-grammar-chart-" + (index + 1); const value = props.answers[id] ?? ""; return <label key={mark}><b>{mark}</b><span><props.Text>{parts[0]}</props.Text><select aria-label={sentence} className={value ? (value === correct ? "is-correct" : "is-incorrect") : ""} onChange={(event) => props.onAnswer(id, event.target.value)} value={value}><option value="">Choose</option><option>can</option><option>can't</option><option>Can</option></select><props.Text>{parts[1]}</props.Text></span>{value && <Feedback correct={value === correct} hint="Look at the symbol at the start of the row." />}</label>; })}</div></div>
    <Track file="sb-8a-grammar-examples.mp3" label="Listen and repeat the examples. Then read the rules. · 8.5" />
    <div className="lesson-8a-grammar-tables"><article><h3>+</h3><p><strong>I can</strong> park here.</p><p><strong>You can</strong> sit here.</p><p><strong>He can</strong> help us.</p><p><strong>We can</strong> have lunch outside.</p><p><strong>They can</strong> come tonight.</p></article><article><h3>−</h3><p><strong>I can't</strong> park there.</p><p><strong>You can't</strong> sit there.</p><p><strong>He can't</strong> help us.</p><p><strong>We can't</strong> have lunch outside.</p><p><strong>They can't</strong> come tonight.</p></article></div>
    <div className="lesson-8a-question-table"><div><b>?</b><span>Can I park here?</span><span>Can he help us?</span><span>Can they come tonight?</span></div><div><b>✓</b><span>Yes, you can.</span><span>Yes, he can.</span><span>Yes, they can.</span></div><div><b>×</b><span>No, you can't.</span><span>No, he can't.</span><span>No, they can't.</span></div></div>
    <div className="rule-summary lesson-8a-rule"><span><strong>Can / can't</strong> is the same for all persons. Put <strong>Can</strong> first in a question: <strong>Can I sit here?</strong> Do not use <s>Do I can...?</s></span><span>We also use <strong>can</strong> for things we know how to do: <strong>Can you drive?</strong></span><span>Use the base verb after <strong>can</strong>: <strong>You can park</strong>, not <s>You can to park</s>.</span></div>
  </section>;
}

const sentencePractice = [
  ["? we / sit here", "Can we sit here?"],
  ["− I / drink this", "I can't drink this."],
  ["+ James / help us tomorrow", "James can help us tomorrow."],
  ["? you / come to lunch on Sunday", "Can you come to lunch on Sunday?"],
  ["+ You / finish work early today", "You can finish work early today."],
  ["− We / park here", "We can't park here."],
  ["? we / watch TV after dinner", "Can we watch TV after dinner?"],
  ["− He / go to school today", "He can't go to school today."]
] as const;
const completePractice = [
  ["I ___ to work tomorrow. My sister needs the car.", "can't drive"],
  ["___ I ___ with you?", "Can stay"],
  ["___ we ___ here?", "Can swim"],
  ["The restaurant is near. We ___ there.", "can walk"],
  ["Where ___ we ___ for lunch?", "can go"],
  ["You ___ TV when you finish your homework.", "can watch"],
  ["___ you ___ to dinner on Saturday?", "Can come"],
  ["You ___ to music in the museum.", "can't listen"]
] as const;

function Practice(props: ExerciseProps) {
  return <section className="lesson-panel"><Heading eyebrow="CONTROLLED PRACTICE" title="Build sentences with can" Text={props.Text} />
    <div className="lesson-1b-task"><h3><props.Text>Write sentences or questions with can or can't.</props.Text></h3><div className="practice-example"><span>EXAMPLE</span><p><props.Text>− You / play football here → You can't play football here.</props.Text></p></div><div className="lesson-8a-input-list">{sentencePractice.map(([prompt, correct], index) => <AnswerInput id={"8a-practice-sentence-" + (index + 1)} key={prompt} prompt={(index + 1) + ". " + prompt} correct={correct} {...props} />)}</div></div>
    <div className="lesson-1b-task"><h3><props.Text>Complete with can or can't and a verb.</props.Text></h3><div className="practice-example"><span>EXAMPLE</span><p><props.Text>You can't use phones in class.</props.Text></p></div><div className="lesson-8a-word-bank">{["come", "drive", "go", "listen", "stay", "swim", "walk", "watch"].map((word) => <span key={word}>{word}</span>)}</div><div className="lesson-8a-input-list">{completePractice.map(([prompt, correct], index) => <AnswerInput id={"8a-practice-complete-" + (index + 1)} key={prompt} prompt={(index + 1) + ". " + prompt} correct={correct} placeholder="can / can't + verb" {...props} />)}</div></div>
  </section>;
}

const soundSentences = [
  ["ə", "computer", "Where can I park? You can park here."],
  ["æ", "cat", "Can I park here? Yes, you can."],
  ["ɑː", "car", "No, you can't. You can't park here."]
] as const;
const canCantPairs = [
  ["We can park here.", "We can't park here."],
  ["I can help you.", "I can't help you."],
  ["You can sit here.", "You can't sit here."],
  ["Max can go with me.", "Max can't go with me."]
] as const;

function Pronunciation(props: ExerciseProps) {
  return <section className="lesson-panel"><Heading eyebrow="PRONUNCIATION & LISTENING" title="Can, can't, and sentence rhythm" Text={props.Text} />
    <Track file="sb-8a-pronunciation-model.mp3" label="Listen and repeat the sounds and sentences. Copy the rhythm. · 8.6" /><div className="lesson-8a-sounds">{soundSentences.map(([sound, anchor, sentence]) => <article key={sound}><span>/{sound}/</span><b>{anchor}</b><props.Text>{sentence}</props.Text></article>)}</div>
    <div className="lesson-8a-pronunciation-note"><p><strong>can</strong> in a normal sentence is usually weak: /kən/.</p><p><strong>can't</strong> is strong and long in British English: /kɑːnt/.</p></div>
    <div className="lesson-1b-task"><h3><props.Text>Listen to the difference between can and can't.</props.Text></h3><Track file="sb-8a-can-cant-difference.mp3" label="Listen to a and b · 8.7" /><div className="lesson-8a-pairs">{canCantPairs.map(([a, b], index) => <p key={a}><b>{index + 1}</b><span>a · <props.Text>{a}</props.Text></span><span>b · <props.Text>{b}</props.Text></span></p>)}</div><Track file="sb-8a-circle-a-b.mp3" label="Listen and choose a or b · 8.8" /><div className="lesson-8a-ab-grid">{["a", "b", "b", "a"].map((correct, index) => <Choice id={"8a-pronunciation-ab-" + (index + 1)} key={index} prompt={"Item " + (index + 1)} options={["a", "b"]} correct={correct} {...props} />)}</div></div>
    <div className="lesson-1b-task"><h3><props.Text>Listen to four conversations. Where are the people?</props.Text></h3><p><props.Text>First listen for the general situation. Then listen again and choose the exact place.</props.Text></p><Track file="sb-8a-four-conversations.mp3" label="Listen twice and choose the place · 8.9" /><Choice id="8a-pronunciation-place-1" prompt="1. They are on a..." options={["bus", "street", "train"]} correct="train" {...props} /><Choice id="8a-pronunciation-place-2" prompt="2. They are in a..." options={["café", "shop", "hotel"]} correct="shop" {...props} /><Choice id="8a-pronunciation-place-3" prompt="3. They are in a..." options={["café", "restaurant", "taxi"]} correct="restaurant" {...props} /><Choice id="8a-pronunciation-place-4" prompt="4. They are in the..." options={["cinema", "street", "hotel"]} correct="street" {...props} /></div>
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
    <div className="lesson-1b-task"><h3><Text>Complete each sentence with can or can't and a verb.</Text></h3><div className="lesson-8a-sign-grid">{signs.map(([icon, modal, verb, sentence], index) => { const modalId = "8a-vocabulary-modal-" + (index + 1); const verbId = "8a-vocabulary-verb-" + (index + 1); const modalValue = answers[modalId] ?? ""; const verbValue = answers[verbId] ?? ""; return <article key={sentence}><span>{index + 1}</span><i>{icon}</i><div><Text>You</Text><select aria-label={"Can or can't for sign " + (index + 1)} className={modalValue ? (modalValue === modal ? "is-correct" : "is-incorrect") : ""} onChange={(event) => onAnswer(modalId, event.target.value)} value={modalValue}><option value="">can / can't</option><option>can</option><option>can't</option></select><select aria-label={"Verb for sign " + (index + 1)} className={verbValue ? (verbValue === verb ? "is-correct" : "is-incorrect") : ""} onChange={(event) => onAnswer(verbId, event.target.value)} value={verbValue}><option value="">verb</option>{["change", "drive", "have", "park", "pay", "play", "swim", "take", "use"].map((word) => <option key={word}>{word}</option>)}</select><Text>{sentence.replace(/^You (can|can't) \w+/, "")}</Text></div>{modalValue && verbValue && <Feedback correct={modalValue === modal && verbValue === verb} hint="Look carefully at the red line or the service symbol." />}</article>; })}</div><Track file="sb-8a-signs-check.mp3" label="Listen and check. Then cover the sentences and say what the signs mean. · 8.10" /></div>
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
  ["🤫", "You can't listen to music here."]
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
  return <section className="lesson-panel"><Heading eyebrow="HOMEWORK · WORKBOOK 8A" title="Can I park here?" Text={Text} /><div className="lesson-8a-homework-welcome"><img alt="Homework notebook" src={media("homework-notebook.png")} /><p className="lesson-8a-homework-intro"><Text>Complete the activities independently. Your answers stay available for your next class.</Text></p></div>
    <details className="homework-extra" open><summary><span>1</span><b><Text>Signs: choose the meaning.</Text></b><small>6 items</small></summary><div className="lesson-8a-hw-signs">{homeworkSigns.map(([icon, correct], index) => <article key={correct}><i>{icon}</i><Choice id={"8a-homework-sign-" + (index + 1)} prompt={"Sign " + (index + 1)} options={index % 2 === 0 ? [correct.includes("can't") ? correct.replace("can't", "can") : correct.replace("can", "can't"), correct] : [correct, correct.includes("can't") ? correct.replace("can't", "can") : correct.replace("can", "can't")]} correct={correct} {...props} /></article>)}</div></details>
    <details className="homework-extra" open><summary><span>2</span><b><Text>Build the questions.</Text></b><small>5 items</small></summary><div className="lesson-8a-input-list"><div className="practice-example"><span>EXAMPLE</span><p><Text>Can I have an espresso, please?</Text></p></div>{homeworkQuestions.map(([prompt, correct], index) => <AnswerInput id={"8a-homework-question-" + (index + 1)} key={prompt} prompt={(index + 1) + ". " + prompt} correct={correct} {...props} />)}</div></details>
    <details className="homework-extra"><summary><span>3</span><b><Text>Pronunciation: choose the sound of can or can't.</Text></b><small>6 items</small></summary><div className="lesson-8a-ab-grid">{homeworkSounds.map(([sentence, correct], index) => <Choice id={"8a-homework-sound-" + (index + 1)} key={sentence} prompt={(index + 1) + ". " + sentence} options={["/ə/", "/æ/", "/ɑː/"]} correct={correct} {...props} />)}</div></details>
    <details className="homework-extra"><summary><span>4</span><b><Text>Complete the verb phrases.</Text></b><small>9 items</small></summary><div className="lesson-8a-input-list">{[["📸 t_____ a ph_____", ["take a photo", "take photos"]], ["☕ h_____ a c_____", ["have a coffee", "have coffee"]], ["💳 p_____ by c_____", "pay by card"], ["💱 ch_____ m_____", "change money"], ["🏊 sw_____", "swim"], ["🚗 dr_____", "drive"], ["⚽ pl_____ f_____", "play football"], ["📱 u_____ your ph_____", ["use your phone", "use my phone"]], ["🅿️ p_____", "park"]].map(([prompt, correct], index) => <AnswerInput id={"8a-homework-phrase-" + (index + 1)} key={String(prompt)} prompt={(index + 1) + ". " + prompt} correct={correct as string | readonly string[]} {...props} />)}</div></details>
    <details className="homework-extra"><summary><span>5</span><b><Text>Write about your country.</Text></b><small>at least 3 sentences</small></summary><div><p><Text>Choose at least three places and write one sentence about each. The other places are optional.</Text></p>{["in a school", "at the beach", "in a museum", "in a supermarket", "in a coffee shop", "in a gym"].map((place, index) => <label className={"lesson-8a-writing-row " + (index > 2 ? "optional" : "")} key={place}><span>{index + 1}</span><Text>{place}</Text>{index > 2 && <small>OPTIONAL</small>}<textarea onChange={(event) => onAnswer("8a-homework-writing-" + (index + 1), event.target.value)} placeholder={index > 2 ? "Optional" : "You can... / You can't..."} value={answers["8a-homework-writing-" + (index + 1)] ?? ""} /></label>)}</div></details>
    <details className="homework-extra"><summary><span>6</span><b><Text>Complete the conversations.</Text></b><small>5 gaps</small></summary><div><div className="lesson-8a-word-bank">{["a theory test", "I'm free", "learn to drive", "start the car", "Yes, of course"].map((phrase) => <span key={phrase}>{phrase}</span>)}</div>{[["When can we see the film? — ___ on Friday night.", "I'm free"], ["Can I have another drink? — ___. Here you are.", "Yes, of course"], ["I want to ___. Do you know an instructor?", "learn to drive"], ["Do you need to take ___?", "a theory test"], ["Your practical test begins now. Please ___.", "start the car"]].map(([prompt, correct], index) => { const parts = prompt.split("___"); const id = "8a-homework-conversation-" + (index + 1); const value = answers[id] ?? ""; return <label className="lesson-8a-select-row" key={prompt}><span>{index + 1}</span><Text>{parts[0]}</Text><select className={value ? (value === correct ? "is-correct" : "is-incorrect") : ""} onChange={(event) => onAnswer(id, event.target.value)} value={value}><option value="">Choose a phrase</option>{["a theory test", "I'm free", "learn to drive", "start the car", "Yes, of course"].map((phrase) => <option key={phrase}>{phrase}</option>)}</select><Text>{parts[1]}</Text>{value && <Feedback correct={value === correct} hint="Read the whole conversation and choose the natural phrase." />}</label>; })}</div></details>
  </section>;
}

function ReferencePanel({ kind, onClose, Text }: { kind: Exclude<ReferenceKind, null>; onClose: () => void; Text: TextComponent }) {
  return <div className="reference-backdrop" onMouseDown={onClose}><aside aria-modal="true" className="reference-panel lesson-8a-reference" onMouseDown={(event) => event.stopPropagation()} role="dialog"><button aria-label="Close" onClick={onClose} type="button">×</button><p>{kind === "grammar" ? "GRAMMAR 8A" : "VOCABULARY 8A"}</p><h2><Text>{kind === "grammar" ? "Can / can't" : "More verb phrases"}</Text></h2>{kind === "grammar" ? <div><p><Text>Use can for permission, possibility, and things you know how to do.</Text></p><p><Text>I can drive. I can't swim. Can I park here?</Text></p><p><Text>Can is the same with I, you, he, she, we, and they.</Text></p></div> : <div className="lesson-8a-reference-list">{["drive", "park", "swim", "take photos", "pay by card", "change money", "use the internet", "use your phone", "play football", "have a coffee"].map((phrase) => <p key={phrase}><Text>{phrase}</Text></p>)}</div>}</aside></div>;
}
