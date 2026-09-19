export type TabType = 'words' | 'sentences' | 'grammar' | 'qa' | 'quiz' | 'rewrite' | 'listening';

export type WordCategory = 'pronoun' | 'verb' | 'noun';

export interface WordItem {
  id?: string;
  thai: string;
  mm: string;
  read: string;
  cat: WordCategory;
}

export type SentenceCategory = 'greeting' | 'daily';

export interface SentenceItem {
  id?: string;
  thai: string;
  read: string;
  mm: string;
  cat: SentenceCategory;
  speakThai?: string;
}

export interface GrammarExample {
  th: string;
  rd: string;
  mm: string;
}

export interface GrammarRule {
  num: string;
  title: string;
  sub: string;
  tag: string;
  desc: string;
  examples: GrammarExample[];
}

export interface QAItem {
  q: string;
  q_read: string;
  q_mm: string;
  a: string;
  a_read: string;
  a_mm: string;
}

export interface QuizOption {
  th: string;
  read: string;
  pho: string;
  mm: string;
}

export interface QuizItem {
  question: string;
  options: QuizOption[];
  correct: number;
  explain: string;
}

export interface WordPronounceInfo {
  mm: string;
  pho: string;
}

export interface RewriteTask {
  meaning: string;
  correctSequence: string[];
  jumbled: string[];
}

export interface ListenTask {
  fullSentence: string;
  blankSentence: string;
  missingWord: string;
  hint: string;
  options: string[];
}
