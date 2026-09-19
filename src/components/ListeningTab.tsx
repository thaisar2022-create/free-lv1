import React, { useState, useEffect } from 'react';
import { Volume2, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { listenData, wordPronounceMap } from '../data/thaiData';
import { speakThai } from '../utils/audio';

interface ListeningTabProps {
  speechRate: number;
}

export const ListeningTab: React.FC<ListeningTabProps> = ({ speechRate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentTask = listenData[currentIndex];

  useEffect(() => {
    // Automatically play audio when task loads
    const timer = setTimeout(() => {
      speakThai(currentTask.fullSentence, speechRate);
    }, 400);
    return () => clearTimeout(timer);
  }, [currentIndex, speechRate, currentTask.fullSentence]);

  const handlePlayAudio = () => {
    speakThai(currentTask.fullSentence, speechRate);
  };

  const handleSelectOption = (word: string) => {
    if (isAnswered) return;
    setSelectedWord(word);
    setIsAnswered(true);

    if (word === currentTask.missingWord) {
      setScore((prev) => prev + 1);
      speakThai(currentTask.fullSentence, speechRate);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < listenData.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedWord(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedWord(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  const answerInfo = wordPronounceMap[currentTask.missingWord] || { mm: '', pho: '' };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-purple-100">
      {/* Header */}
      <div className="border-b border-purple-100 pb-5 mb-6">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-purple-100 text-[#64137c] flex items-center justify-center font-bold text-sm shadow-xs">
            ၇
          </span>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span>အသံနားထောင်ပြီး ကွက်လပ်ဖြည့်</span>
            <span className="font-thai text-[#64137c] font-medium text-lg ml-1">(ฟังแล้วเติมคำ)</span>
          </h2>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          အသံခလုတ်ကို နှိပ်နားထောင်ပြီး လိုအပ်နေသော စကားလုံးအမှန်ကို ရွေးချယ်ပါ
        </p>
      </div>

      {!isFinished ? (
        <div>
          {/* Audio Player Big Hero */}
          <div className="text-center py-8 px-4 bg-gradient-to-b from-purple-50/80 to-white rounded-3xl border border-purple-100 mb-6">
            <button
              onClick={handlePlayAudio}
              className="w-20 h-20 bg-[#64137c] hover:bg-[#4c0d5f] text-white rounded-full flex items-center justify-center text-3xl shadow-xl shadow-purple-900/20 transition active:scale-90 mx-auto mb-3.5 group cursor-pointer"
              title="အသံဖွင့်ရန် နှိပ်ပါ"
            >
              <Volume2 className="w-8 h-8 group-hover:scale-110 transition-transform text-[#ffd200]" />
            </button>
            <div className="text-xs font-bold text-[#4c0d5f] tracking-wide uppercase">
              အသံဖွင့်ရန် နှိပ်ပါ (ထပ်ခါတလဲလဲ နားထောင်နိုင်ပါသည်)
            </div>
          </div>

          {/* Sentence Display with Blank */}
          <div className="bg-purple-50/40 border border-purple-100 p-6 rounded-2xl mb-6 text-center">
            <div className="font-thai text-2xl sm:text-3xl font-bold text-slate-900 tracking-wide mb-2">
              {currentTask.blankSentence}
            </div>
            <div className="text-sm font-semibold text-[#8b1fa8]">
              {currentTask.hint}
            </div>
          </div>

          {/* Options Grid (2x2) */}
          <div className="grid grid-cols-2 gap-3.5 mb-6">
            {currentTask.options.map((opt, idx) => {
              const info = wordPronounceMap[opt] || { mm: '', pho: '' };
              const isCorrect = opt === currentTask.missingWord;
              const isSelected = opt === selectedWord;

              let btnStyle =
                'bg-purple-50/70 hover:bg-purple-100/70 border-purple-100 text-slate-900';

              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-200';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-600 text-white border-rose-700';
                } else {
                  btnStyle = 'bg-slate-100 border-slate-200 text-slate-400 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  disabled={isAnswered}
                  className={`py-4 px-4 rounded-2xl border font-semibold transition active:scale-95 flex flex-col items-center justify-center cursor-pointer ${btnStyle}`}
                >
                  <span className="font-thai text-2xl font-bold leading-tight">{opt}</span>
                  <span
                    className={`text-xs font-semibold mt-1 ${
                      isAnswered && (isCorrect || isSelected)
                        ? 'text-white/90'
                        : 'text-[#64137c]'
                    }`}
                  >
                    {info.mm}
                  </span>
                  <span
                    className={`text-[11px] font-normal ${
                      isAnswered && (isCorrect || isSelected)
                        ? 'text-white/80'
                        : 'text-slate-400'
                    }`}
                  >
                    {info.pho}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {isAnswered && (
            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm font-medium mb-5 text-center border animate-fadeIn ${
                selectedWord === currentTask.missingWord
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border-rose-200'
              }`}
            >
              {selectedWord === currentTask.missingWord ? (
                <div>
                  <b className="text-emerald-700">မှန်ကန်ပါတယ်! 🎯</b>
                  <div className="mt-1">
                    ဝါကျအပြည့်အစုံမှာ{' '}
                    <span className="font-thai font-bold text-base text-[#64137c]">
                      {currentTask.fullSentence}
                    </span>{' '}
                    ဖြစ်ပြီး၊ အဖြေမှာ{' '}
                    <b className="font-thai font-bold text-[#64137c]">
                      {currentTask.missingWord}
                    </b>{' '}
                    ({answerInfo.mm} {answerInfo.pho}) ဖြစ်ပါသည်။
                  </div>
                </div>
              ) : (
                <div>
                  <b>မမှန်သေးပါ!</b> အဖြေမှန်မှာ{' '}
                  <span className="font-thai font-bold text-base text-emerald-700">
                    {currentTask.missingWord}
                  </span>{' '}
                  ({answerInfo.mm} {answerInfo.pho}) ဖြစ်ပါသည်။
                </div>
              )}
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <button
              onClick={handleNext}
              className="w-full bg-[#64137c] hover:bg-[#4c0d5f] text-white font-bold py-3.5 rounded-2xl transition shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <span>{currentIndex + 1 < listenData.length ? 'နောက်တစ်ပုဒ်သို့ သွားမည်' : 'လေ့ကျင့်ခန်း ပြီးမြောက်ပါပြီ'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        /* Finished */
        <div className="text-center py-10">
          <div className="w-20 h-20 bg-purple-100 text-[#64137c] rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            နားထောင်လေ့ကျင့်ခန်း အားလုံး ပြီးဆုံးပါပြီ!
          </h3>
          <p className="text-sm text-slate-600 mb-6">
            သင် ရရှိသော အမှတ်ပေါင်း:{' '}
            <span className="font-bold text-[#64137c] text-xl">
              {score} / {listenData.length}
            </span>
          </p>
          <button
            onClick={handleRestart}
            className="px-6 py-3.5 rounded-2xl bg-[#64137c] text-white font-semibold text-sm hover:bg-[#4c0d5f] transition active:scale-95 inline-flex items-center gap-2 shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>နောက်တစ်ခေါက် ထပ်မံလေ့ကျင့်မည်</span>
          </button>
        </div>
      )}
    </div>
  );
};
