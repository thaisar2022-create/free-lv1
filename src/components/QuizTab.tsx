import React, { useState } from 'react';
import { Trophy, ArrowRight, RotateCcw, CheckCircle2, XCircle, Volume2 } from 'lucide-react';
import { quizData } from '../data/thaiData';
import { speakThai } from '../utils/audio';

interface QuizTabProps {
  speechRate: number;
}

const OPTION_LETTERS = ['က', 'ခ', 'ဂ', 'ဃ'];

export const QuizTab: React.FC<QuizTabProps> = ({ speechRate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = quizData[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / quizData.length) * 100);

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < quizData.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsFinished(false);
  };

  const handlePlayOption = (thText: string, e: React.MouseEvent) => {
    e.stopPropagation();
    speakThai(thText, speechRate);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-purple-100">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-purple-100 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-purple-100 text-[#64137c] flex items-center justify-center font-bold text-sm shadow-xs">
              ၅
            </span>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
              <span>ဉာဏ်စမ်း စာမေးပွဲ</span>
              <span className="font-thai text-[#64137c] font-medium text-lg ml-1">(แบบทดสอบ)</span>
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            အခန်း (၁) သင်ခန်းစာများအပေါ် သင်ယူတတ်မြောက်မှုကို စစ်ဆေးပါ
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-purple-50 border border-purple-200 text-[#4c0d5f] text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0">
          <Trophy className="w-4 h-4 text-[#ffd200]" />
          <span>
            ရမှတ်: <span className="text-[#64137c] text-base">{score}</span> / {quizData.length}
          </span>
        </div>
      </div>

      {!isFinished ? (
        <div>
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs font-semibold text-[#64137c] mb-2">
              <span>
                မေးခွန်း {currentIndex + 1} / {quizData.length}
              </span>
              <span className="text-slate-400">တိုးတက်မှု {progressPercent}%</span>
            </div>
            <div className="w-full bg-purple-100/60 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-[#64137c] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Question title box */}
          <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100 mb-6">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* Options list */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((opt, idx) => {
              let btnStyle = 'bg-white border-purple-100 hover:border-purple-300 hover:bg-purple-50/40 text-slate-800';

              if (isAnswered) {
                if (idx === currentQ.correct) {
                  btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-200';
                } else if (idx === selectedOption) {
                  btnStyle = 'bg-rose-50 border-rose-500 text-rose-950 ring-2 ring-rose-200';
                } else {
                  btnStyle = 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <div
                  key={idx}
                  role="button"
                  tabIndex={isAnswered ? -1 : 0}
                  aria-disabled={isAnswered}
                  onClick={() => !isAnswered && handleSelectOption(idx)}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && !isAnswered) {
                      e.preventDefault();
                      handleSelectOption(idx);
                    }
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition font-medium text-sm flex items-start justify-between gap-3 select-none ${
                    !isAnswered ? 'cursor-pointer active:scale-[0.99]' : ''
                  } ${btnStyle}`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isAnswered && idx === currentQ.correct
                          ? 'bg-emerald-200 text-emerald-900'
                          : isAnswered && idx === selectedOption
                          ? 'bg-rose-200 text-rose-900'
                          : 'bg-purple-100 text-[#4c0d5f]'
                      }`}
                    >
                      {OPTION_LETTERS[idx]}
                    </span>

                    <div className="flex-1">
                      <div className="font-thai text-lg font-bold text-slate-900 leading-snug">
                        {opt.th}
                      </div>
                      <div className="text-xs text-[#8b1fa8] font-medium mt-0.5">
                        {opt.read} <span className="text-slate-400 font-normal">{opt.pho}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 font-medium mt-0.5">{opt.mm}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handlePlayOption(opt.th, e)}
                    title="အသံထွက် နားထောင်မည်"
                    aria-label={`အသံထွက် နားထောင်မည်: ${opt.th}`}
                    className="w-8 h-8 rounded-lg bg-purple-50 hover:bg-[#64137c] text-[#64137c] hover:text-white flex items-center justify-center transition shrink-0 self-center cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Feedback & Explanation */}
          {isAnswered && (
            <div
              className={`p-4 rounded-2xl mb-5 text-sm font-medium border animate-fadeIn ${
                selectedOption === currentQ.correct
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-1">
                {selectedOption === currentQ.correct ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>မှန်ကန်ပါသည်! 🎉</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>မှားယွင်းနေပါသည်။</span>
                  </>
                )}
              </div>
              <div className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
                {currentQ.explain}
              </div>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <button
              onClick={handleNext}
              className="w-full bg-[#64137c] hover:bg-[#4c0d5f] text-white font-bold py-3.5 rounded-2xl transition-all shadow-md hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 text-sm"
            >
              <span>{currentIndex + 1 < quizData.length ? 'နောက်တစ်ပုဒ်သို့ ဆက်သွားမည်' : 'ရလဒ် ကြည့်ရှုမည်'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        /* Result Screen */
        <div className="text-center py-10">
          <div className="w-20 h-20 bg-purple-100 text-[#64137c] rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-inner">
            <Trophy className="w-10 h-10 text-[#ffd200]" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            ဂုဏ်ယူပါတယ်! စာမေးပွဲပြီးမြောက်ပါပြီ
          </h3>
          <p className="text-sm text-slate-600 mb-2">
            သင် အမှတ်ပေါင်း{' '}
            <span className="font-bold text-[#64137c] text-xl">
              {score} / {quizData.length}
            </span>{' '}
            ရရှိခဲ့ပါသည်။
          </p>
          <p className="text-xs text-slate-500 mb-6">
            {score >= 18
              ? 'ထူးချွန်စွာ ဖြေဆိုနိုင်ခဲ့ပါသည်! အခန်း (၁) သင်ခန်းစာများကို ကောင်းစွာ နားလည်တတ်မြောက်ပါပြီ။'
              : score >= 12
              ? 'အတော်အတန် တတ်မြောက်ပါသည်! မှားယွင်းခဲ့သော မေးခွန်းများကို ပြန်လည်လေ့ကျင့်ကြည့်ပါ။'
              : 'ထပ်မံလေ့လာဖို့ လိုအပ်ပါသေးသည်။ စာမျက်နှာများကို ပြန်လည်ဖတ်ရှုပြီး ထပ်မံဖြေဆိုကြည့်ပါ။'}
          </p>

          <button
            onClick={handleRestart}
            className="px-6 py-3.5 rounded-2xl bg-[#64137c] text-white font-semibold text-sm hover:bg-[#4c0d5f] transition active:scale-95 shadow-md inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>စာမေးပွဲ ပြန်လည်ဖြေဆိုမည်</span>
          </button>
        </div>
      )}
    </div>
  );
};
