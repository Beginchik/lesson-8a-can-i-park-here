export type LessonView =
  | "overview"
  | "watch"
  | "dialogues"
  | "grammar"
  | "numbers"
  | "pronunciation"
  | "days"
  | "practice"
  | "homework";

export type LexicalEntry = {
  headword: string;
  display: string;
  partOfSpeech: string;
  transcription: string;
  definition: string;
  translation: string;
  examples: string[];
  reviewed?: boolean;
};

export type VocabularyLearningStatus =
  | "new"
  | "learning"
  | "review"
  | "mastered";

export type VocabularyRecord = {
  headword: string;
  display: string;
  partOfSpeech: string;
  addedAt: string;
  lessonId: string;
  context: string;
  transcription: string;
  definition: string;
  translation: string;
  examples: string[];
  syncStatus: "local" | "syncing" | "synced";
  wordMasterId?: string;
  learningStatus?: VocabularyLearningStatus;
  pendingAction?: "relearn";
};

export type LessonProgress = {
  completedViews: LessonView[];
  answers: Record<string, string>;
  homeworkAnswers: Record<string, string>;
  updatedAt: string;
};
