import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, ArrowRight, RotateCcw } from 'lucide-react';
import { speakThai } from '../utils/audio';
import { QUIZ_QUESTIONS, QuizQuestion } from '../data/quiz';

export type CleanQuizQuestion = QuizQuestion;
export const ACTIVE_RECALL_QUIZ_QUESTIONS = QUIZ_QUESTIONS;

export interface QuizViewProps {
  speechRate?: number;
}

export const QuizView: React.FC<QuizViewProps> = ({ speechRate = 0.85 }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [srFeedback, setSrFeedback] = useState<string>('');

  const questions = QUIZ_QUESTIONS;
  const currentQuestion = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  const playAudio = useCallback(
    (textToSpeak: string) => {
      speakThai(textToSpeak, speechRate);
    },
    [speechRate]
  );

  const handleSelectOption = useCallback(
    (idx: number) => {
      if (selectedAnswer !== null) return;
      setSelectedAnswer(idx);

      const isCorrect = idx === currentQuestion.correctAnswerIndex;
      if (isCorrect) {
        setScore((prev) => prev + 1);
        setSrFeedback(`အဖြေ မှန်ကန်ပါသည်! ${currentQuestion.options[idx]}`);
      } else {
        const correctChoice = currentQuestion.options[currentQuestion.correctAnswerIndex];
        setSrFeedback(`အဖြေ မှားယွင်းပါသည်။ မှန်ကန်သောအဖြေမှာ ${correctChoice} ဖြစ်ပါသည်။`);
      }
    },
    [selectedAnswer, currentQuestion]
  );

  const handleNext = useCallback(() => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setSrFeedback(`မေးခွန်း ${currentIndex + 2} သို့ ရောက်ရှိပါပြီ။`);
    } else {
      setIsFinished(true);
      setSrFeedback(`ဉာဏ်စမ်း စာမေးပွဲ ပြီးဆုံးပါပြီ။ သင်ရရှိသော အမှတ်မှာ ${score} / ${questions.length} ဖြစ်ပါသည်။`);
    }
  }, [currentIndex, questions.length, score]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsFinished(false);
    setSrFeedback('ဉာဏ်စမ်း စာမေးပွဲ ပြန်လည်စတင်ပါပြီ။');
  }, []);

  // Keyboard Shortcuts (WCAG 2.1 AA)
  // 1, 2, 3, 4 or a, b, c, d to pick choices; Space or Enter to proceed to next question
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (isFinished) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleRestart();
        }
        return;
      }

      if (selectedAnswer === null) {
        if (e.key === '1' || e.key.toLowerCase() === 'a') {
          e.preventDefault();
          handleSelectOption(0);
        } else if (e.key === '2' || e.key.toLowerCase() === 'b') {
          e.preventDefault();
          handleSelectOption(1);
        } else if (e.key === '3' || e.key.toLowerCase() === 'c') {
          e.preventDefault();
          handleSelectOption(2);
        } else if (e.key === '4' || e.key.toLowerCase() === 'd') {
          e.preventDefault();
          handleSelectOption(3);
        }
      } else {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedAnswer, isFinished, handleSelectOption, handleNext, handleRestart]);

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-3xl p-5 sm:p-8 shadow-sm border border-purple-100 dark:border-gray-800 transition-colors">
      {/* Screen reader live announcement */}
      <div className="sr-only" aria-live="assertive">
        {srFeedback}
      </div>

      {/* Header */}
      <div className="flex justify-between items-center border-b border-purple-100 dark:border-gray-800 pb-5 mb-6 gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-[#64137c] dark:text-purple-300 flex items-center justify-center font-bold text-sm shadow-xs">
              ၅
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap">
              <span>ဉာဏ်စမ်း စာမေးပွဲ</span>
              <span className="font-thai text-[#64137c] dark:text-purple-400 font-medium text-lg ml-1">
                (แบบทดสอบ)
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            ဖတ်စာအုပ်ပါ အသံထွက်၊ အသတ်သံများနှင့် အဓိပ္ပာယ်ကို လေ့ကျင့်ဖြေဆိုပါ
          </p>
        </div>

        <div className="px-3.5 sm:px-4 py-2 rounded-2xl bg-purple-50 dark:bg-gray-800 border border-purple-200 dark:border-gray-700 text-[#4c0d5f] dark:text-purple-300 text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 shadow-xs">
          <Trophy className="w-4 h-4 text-[#ffd200]" />
          <span>
            ရမှတ်: <span className="text-[#64137c] dark:text-purple-300 text-base">{score}</span> / {questions.length}
          </span>
        </div>
      </div>

      {!isFinished ? (
        <div>
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs font-semibold text-[#64137c] dark:text-purple-300 mb-2">
              <span>
                မေးခွန်း {currentIndex + 1} / {questions.length}
              </span>
              <span className="text-slate-400 dark:text-gray-500">တိုးတက်မှု {progressPercent}%</span>
            </div>
            <div className="w-full bg-purple-100/60 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-[#64137c] dark:bg-purple-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* 1. QUESTION CARD: THAI WORD + PHONETIC + MYANMAR READING */}
          <div className="text-center py-6 px-4 bg-purple-50/50 dark:bg-purple-950/20 rounded-3xl border border-purple-100 dark:border-purple-900/40 mb-6">
            <span
              className="text-xs uppercase tracking-wider font-semibold text-purple-600 dark:text-purple-400 mb-2 block"
              lang="my"
            >
              အောက်ပါ ထိုင်းစကားလုံး၏ မှန်ကန်သော မြန်မာအဓိပ္ပာယ်ကို ရွေးချယ်ပါ
            </span>

            {/* Prominent Thai Word */}
            <h2
              className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-wide mb-3 font-sans"
              lang="th"
            >
              {currentQuestion.thaiWord}
            </h2>

            {/* Book-standard Phonetic & Myanmar Reading Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-purple-200/80 dark:border-purple-800/60 shadow-xs">
              <span
                className="font-mono text-sm sm:text-base font-bold text-purple-700 dark:text-purple-300"
                lang="en"
              >
                {currentQuestion.phonetic}
              </span>
              <span
                className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium"
                lang="my"
              >
                ({currentQuestion.myanmarReading})
              </span>
              {/* Audio pronounce button */}
              <button
                type="button"
                onClick={() => playAudio(currentQuestion.audioTarget || currentQuestion.thaiWord)}
                aria-label={`Listen to ${currentQuestion.thaiWord}`}
                className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/60 hover:bg-purple-200 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xs transition-transform active:scale-95 ml-1"
              >
                🔊
              </button>
            </div>

            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-3 font-mono">
              [ကီးဘုတ်ဖြတ်လမ်း: 1, 2, 3, 4 သို့မဟုတ် A, B, C, D ဖြင့် ရွေးချယ်နိုင်ပါသည်]
            </p>
          </div>

          {/* 2. CLEAN OPTIONS & HIGH-CONTRAST AMBER/YELLOW THEME */}
          <div
            role="radiogroup"
            aria-label="ရွေးချယ်စရာ အဖြေများ"
            className="grid grid-cols-1 sm:grid-cols-2 gap-3.5"
          >
            {currentQuestion.options.map((optText, idx) => {
              const isSelected = selectedAnswer === idx;

              let btnStyle =
                'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 hover:border-amber-400 hover:bg-amber-50/40 dark:hover:bg-gray-700/60';

              if (isSelected) {
                btnStyle =
                  'bg-amber-400 dark:bg-amber-500 text-gray-950 border-amber-500 dark:border-amber-400 font-bold shadow-md ring-2 ring-amber-400/50 scale-[1.01]';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-2xl border-2 text-left text-base sm:text-lg font-medium transition-all duration-200 flex items-center justify-between min-h-[62px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${
                        isSelected
                          ? 'bg-black/15 text-gray-950 font-extrabold'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {['က', 'ခ', 'ဂ', 'ဃ'][idx]}
                    </span>
                    <span lang="my">{optText}</span>
                  </div>

                  {isSelected && (
                    <span className="w-6 h-6 rounded-full bg-gray-950 text-amber-400 flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 3. POST-ANSWER EXPLANATION PANEL */}
          {selectedAnswer !== null && (
            <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 animate-fadeIn space-y-3 shadow-xs">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/80 dark:bg-purple-900/40 border border-purple-200 dark:border-purple-800 text-sm">
                  <span className="font-mono font-bold text-purple-700 dark:text-purple-300" lang="en">
                    {currentQuestion.phonetic}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 font-medium" lang="my">
                    ({currentQuestion.myanmarReading})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full ${
                      selectedAnswer === currentQuestion.correctAnswerIndex
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {selectedAnswer === currentQuestion.correctAnswerIndex
                      ? '✓ အဖြေမှန်ပါသည်'
                      : `မှန်ကန်သောအဖြေ: ${currentQuestion.options[currentQuestion.correctAnswerIndex]}`}
                  </span>
                </div>
              </div>

              {currentQuestion.explanation && (
                <p
                  className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed pt-2 border-t border-purple-200/50 dark:border-purple-800/30"
                  lang="my"
                >
                  💡 <span className="font-bold">ရှင်းလင်းချက်:</span> {currentQuestion.explanation}
                </p>
              )}
            </div>
          )}

          {/* Next Button */}
          {selectedAnswer !== null && (
            <div className="mt-6">
              <button
                type="button"
                onClick={handleNext}
                className="w-full bg-[#64137c] hover:bg-[#4c0d5f] text-white font-bold py-3.5 px-4 rounded-2xl transition-all shadow-md hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 text-sm"
              >
                <span>
                  {currentIndex + 1 < questions.length
                    ? 'နောက်တစ်ပုဒ်သို့ ဆက်သွားမည် (Space / Enter)'
                    : 'ရလဒ် ကြည့်ရှုမည် (Space / Enter)'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Result Screen */
        <div className="text-center py-10">
          <div className="w-20 h-20 bg-purple-100 dark:bg-purple-950/60 text-[#64137c] dark:text-purple-300 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-inner">
            <Trophy className="w-10 h-10 text-[#ffd200]" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            ဂုဏ်ယူပါတယ်! စာမေးပွဲပြီးမြောက်ပါပြီ
          </h3>
          <p className="text-sm text-slate-600 dark:text-gray-300 mb-2">
            သင် အမှတ်ပေါင်း{' '}
            <span className="font-bold text-[#64137c] dark:text-purple-400 text-xl">
              {score} / {questions.length}
            </span>{' '}
            ရရှိခဲ့ပါသည်။
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            {score >= 18
              ? 'ထူးချွန်စွာ ဖြေဆိုနိုင်ခဲ့ပါသည်! အခန်း (၁) သင်ခန်းစာများကို ကောင်းစွာ နားလည်တတ်မြောက်ပါပြီ။'
              : score >= 12
              ? 'အတော်အတန် တတ်မြောက်ပါသည်! မှားယွင်းခဲ့သော မေးခွန်းများကို ပြန်လည်လေ့ကျင့်ကြည့်ပါ။'
              : 'ထပ်မံလေ့လာဖို့ လိုအပ်ပါသေးသည်။ စာမျက်နှာများကို ပြန်လည်ဖတ်ရှုပြီး ထပ်မံဖြေဆိုကြည့်ပါ။'}
          </p>

          <button
            type="button"
            onClick={handleRestart}
            className="px-6 py-3.5 rounded-2xl bg-[#64137c] hover:bg-[#4c0d5f] text-white font-semibold text-sm transition active:scale-95 shadow-md inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>စာမေးပွဲ ပြန်လည်ဖြေဆိုမည် (Space / Enter)</span>
          </button>
        </div>
      )}
    </div>
  );
};
