import React, { useState } from 'react';
import {
  Star,
  RotateCcw,
  CheckCircle,
  ArrowRight,
  X,
  Sparkles,
} from 'lucide-react';
import { rewriteData, wordPronounceMap } from '../data/thaiData';
import { speakThai } from '../utils/audio';

interface RewriteTabProps {
  speechRate: number;
}

export const RewriteTab: React.FC<RewriteTabProps> = ({ speechRate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentTask = rewriteData[currentIndex];

  const handleAddWord = (word: string) => {
    if (hasChecked && isCorrect) return;
    setSelectedWords((prev) => [...prev, word]);
    setHasChecked(false);
  };

  const handleRemoveWord = (indexToRemove: number) => {
    if (hasChecked && isCorrect) return;
    setSelectedWords((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setHasChecked(false);
  };

  const handleResetCurrent = () => {
    setSelectedWords([]);
    setHasChecked(false);
    setIsCorrect(false);
  };

  const handleCheck = () => {
    if (selectedWords.length === 0) return;

    const correctSeq = currentTask.correctSequence;
    const match =
      selectedWords.length === correctSeq.length &&
      selectedWords.every((w, idx) => w === correctSeq[idx]);

    setIsCorrect(match);
    setHasChecked(true);

    if (match) {
      setScore((prev) => prev + 1);
      speakThai(selectedWords.join(' '), speechRate);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < rewriteData.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedWords([]);
      setHasChecked(false);
      setIsCorrect(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedWords([]);
    setHasChecked(false);
    setIsCorrect(false);
    setIsFinished(false);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-purple-100">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-purple-100 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-purple-100 text-[#64137c] flex items-center justify-center font-bold text-sm shadow-xs">
              ၆
            </span>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
              <span>ဝါကျ စီစဉ်ခြင်း</span>
              <span className="font-thai text-[#64137c] font-medium text-lg ml-1">(เรียงประโยค)</span>
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            အောက်ပါ စကားလုံးများကို မှန်ကန်သော အစီအစဉ်အတိုင်း နှိပ်၍ ဝါကျဖွဲ့စည်းပါ
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-purple-50 border border-purple-200 text-[#4c0d5f] text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0">
          <Star className="w-4 h-4 text-[#ffd200]" />
          <span>
            ရမှတ်: <span className="text-[#64137c] text-base">{score}</span> / {rewriteData.length}
          </span>
        </div>
      </div>

      {!isFinished ? (
        <div>
          <div className="text-xs font-bold text-[#64137c] uppercase tracking-wider mb-2">
            ဝါကျ {currentIndex + 1} / {rewriteData.length}
          </div>

          {/* Meaning Card */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 border border-purple-100 rounded-2xl p-5 mb-5">
            <div className="text-xs text-[#8b1fa8] font-bold uppercase tracking-wider mb-1">
              မြန်မာအဓိပ္ပာယ်:
            </div>
            <div className="text-lg font-bold text-slate-900">
              "{currentTask.meaning}"
            </div>

            {/* Answer Selected Words Box */}
            <div className="mt-4">
              <div className="text-xs text-slate-500 font-semibold mb-1.5">
                သင်ရွေးချယ်ထားသော ဝါကျ:
              </div>
              <div className="min-h-[72px] p-3 bg-white rounded-2xl border-2 border-dashed border-purple-300 flex flex-wrap gap-2 items-center">
                {selectedWords.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">
                    အောက်မှ စကားလုံးများကို အစဉ်အတိုင်း နှိပ်ပါ...
                  </span>
                ) : (
                  selectedWords.map((word, idx) => {
                    const info = wordPronounceMap[word] || { mm: '', pho: '' };
                    return (
                      <button
                        key={idx}
                        onClick={() => handleRemoveWord(idx)}
                        className="flex flex-col items-center justify-center py-1.5 px-3.5 rounded-xl bg-[#64137c] text-white font-medium hover:bg-[#4c0d5f] transition shadow-sm group active:scale-95"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="font-thai text-base font-bold">{word}</span>
                          <X className="w-3 h-3 opacity-75 group-hover:opacity-100" />
                        </div>
                        <div className="text-[10px] text-purple-200 font-normal leading-tight mt-0.5">
                          {info.mm} <span className="opacity-80">{info.pho}</span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Word Pool */}
          <div className="mb-6">
            <div className="text-xs font-semibold text-slate-600 mb-2.5">
              ရွေးချယ်ရန် စကားလုံးများ (နှိပ်ပါ):
            </div>
            <div className="flex flex-wrap gap-2.5">
              {currentTask.jumbled.map((word, idx) => {
                const usedCount = selectedWords.filter((w) => w === word).length;
                const totalCount = currentTask.jumbled.filter((w) => w === word).length;
                if (usedCount >= totalCount) return null;

                const info = wordPronounceMap[word] || { mm: '', pho: '' };

                return (
                  <button
                    key={idx}
                    onClick={() => handleAddWord(word)}
                    className="flex flex-col items-center justify-center p-2.5 px-3.5 rounded-xl bg-white border border-purple-200 hover:border-[#8b1fa8] hover:bg-purple-50 text-slate-800 font-medium transition shadow-xs group active:scale-95"
                  >
                    <span className="font-thai text-lg font-bold text-slate-900 group-hover:text-[#64137c] transition leading-snug">
                      {word}
                    </span>
                    <span className="text-[11px] font-semibold text-[#8b1fa8] leading-tight">
                      {info.mm}
                    </span>
                    <span className="text-[10px] text-slate-400 group-hover:text-slate-500 leading-tight">
                      {info.pho}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback */}
          {hasChecked && (
            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm font-medium mb-5 border animate-fadeIn ${
                isCorrect
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border-rose-200'
              }`}
            >
              {isCorrect ? (
                <div>
                  <div className="flex items-center gap-2 font-bold mb-1">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span>မှန်ကန်ပါသည်! (+၁ မှတ်) 👏</span>
                  </div>
                  <div className="text-slate-700 mt-1">
                    <div>
                      ဝါကျ:{' '}
                      <span className="font-thai font-bold text-base text-[#64137c]">
                        {selectedWords.join(' ')}
                      </span>
                    </div>
                    <div className="text-[#8b1fa8] font-medium mt-0.5">
                      အသံထွက်:{' '}
                      {selectedWords
                        .map((w) => {
                          const info = wordPronounceMap[w] || { mm: '', pho: '' };
                          return `${info.mm} ${info.pho}`;
                        })
                        .join(' • ')}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <b>မမှန်သေးပါ!</b> ကတ္တား + ကိရိယာ + ကံ တည်ဆောက်ပုံအလိုက် ပြန်လည်စဉ်းစားကြည့်ပါ။
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleResetCurrent}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>ပြန်စမည်</span>
            </button>

            {!isCorrect ? (
              <button
                onClick={handleCheck}
                disabled={selectedWords.length === 0}
                className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 shadow-md flex items-center justify-center gap-1.5 ${
                  selectedWords.length > 0
                    ? 'bg-[#64137c] hover:bg-[#4c0d5f] text-white'
                    : 'bg-purple-200 text-purple-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>အဖြေစစ်မည်</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 shadow-md flex items-center justify-center gap-1.5"
              >
                <span>{currentIndex + 1 < rewriteData.length ? 'နောက်ဝါကျသို့' : 'ပြီးဆုံးပါပြီ'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Finished Screen */
        <div className="text-center py-10">
          <div className="w-20 h-20 bg-purple-100 text-[#64137c] rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-[#ffd200]" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            ဝါကျလေ့ကျင့်ခန်း အားလုံး ပြီးဆုံးပါပြီ!
          </h3>
          <p className="text-sm text-slate-600 mb-6">
            သင် ရရှိသော အမှတ်ပေါင်း:{' '}
            <span className="font-bold text-[#64137c] text-xl">
              {score} / {rewriteData.length}
            </span>
          </p>
          <button
            onClick={handleRestart}
            className="px-6 py-3.5 rounded-2xl bg-[#64137c] text-white font-semibold text-sm hover:bg-[#4c0d5f] transition active:scale-95 inline-flex items-center gap-2 shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>နောက်တစ်ခေါက် ထပ်လေ့ကျင့်မည်</span>
          </button>
        </div>
      )}
    </div>
  );
};
