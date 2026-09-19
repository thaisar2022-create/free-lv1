import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles } from 'lucide-react';
import { grammarRules, politeParticles } from '../data/thaiData';
import { speakThai, subscribeSpeakingState } from '../utils/audio';

interface GrammarTabProps {
  speechRate: number;
}

export const GrammarTab: React.FC<GrammarTabProps> = ({ speechRate }) => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  useEffect(() => {
    return subscribeSpeakingState((text) => {
      setCurrentlyPlaying(text);
    });
  }, []);

  const handlePlay = (text: string) => {
    speakThai(text, speechRate);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-purple-100">
      {/* Header */}
      <div className="border-b border-purple-100 pb-5 mb-6">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-purple-100 text-[#64137c] flex items-center justify-center font-bold text-sm shadow-xs">
            ၃
          </span>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span>အခြေခံသဒ္ဒါ နည်းစနစ်များ</span>
            <span className="font-thai text-[#64137c] font-medium text-lg ml-1">(ไวยากรณ์)</span>
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          အခြေခံဝါကျတည်ဆောက်ပုံ စည်းမျဉ်း ၄ မျိုးနှင့် ဥပမာစာကြောင်း (၇) ကြောင်းစီ
        </p>
      </div>

      {/* 4 Grammar Pattern Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {grammarRules.map((rule, idx) => (
          <div
            key={idx}
            className="p-5 sm:p-6 rounded-2xl bg-white border border-purple-100/90 shadow-xs flex flex-col justify-between hover:border-purple-300 transition"
          >
            <div>
              {/* Card Title Bar */}
              <div className="flex items-center justify-between gap-2 border-b border-purple-50 pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-[#64137c] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    {rule.num}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">{rule.title}</h3>
                    <p className="text-[11px] text-[#8b1fa8] font-medium">{rule.sub}</p>
                  </div>
                </div>
                <span className="text-xs font-bold bg-purple-100 text-[#4c0d5f] px-2.5 py-1 rounded-lg border border-purple-200">
                  {rule.tag}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 mb-3.5 leading-relaxed">{rule.desc}</p>

              {/* 7 Examples */}
              <div className="space-y-2">
                {rule.examples.map((ex, exIdx) => {
                  const isPlaying = currentlyPlaying === ex.th;

                  return (
                    <div
                      key={exIdx}
                      onClick={() => handlePlay(ex.th)}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition cursor-pointer group ${
                        isPlaying
                          ? 'bg-purple-50/80 border-[#8b1fa8] ring-1 ring-purple-300'
                          : 'bg-purple-50/30 border-purple-100/60 hover:border-purple-300 hover:bg-purple-50/60'
                      }`}
                    >
                      <div className="select-none">
                        <div className="font-thai font-bold text-slate-900 text-sm group-hover:text-[#64137c] transition">
                          {exIdx + 1}. {ex.th}
                        </div>
                        <div className="text-[11px] text-[#8b1fa8] font-medium mt-0.5">{ex.rd}</div>
                        <div className="text-xs font-semibold text-slate-700 mt-0.5">{ex.mm}</div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlay(ex.th);
                        }}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition shrink-0 shadow-xs ${
                          isPlaying
                            ? 'bg-[#64137c] text-[#ffd200]'
                            : 'bg-white text-[#64137c] hover:bg-[#64137c] hover:text-white'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Polite Ending Particles Banner */}
      <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-[#340842] via-[#4c0d5f] to-[#64137c] text-white shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-[#ffd200]" />
          <h3 className="font-bold text-sm sm:text-base text-white">
            မှတ်သားဖွယ်ရာ ယဉ်ကျေးသည့် အဆုံးသတ် စကားလုံးများ
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
          {politeParticles.map((part, idx) => {
            const isPlaying = currentlyPlaying === part.th;

            return (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 flex items-center justify-between"
              >
                <div>
                  <div className="text-purple-200 font-medium">{part.label}</div>
                  <div className={`font-thai text-2xl font-bold mt-1 ${part.color}`}>{part.th}</div>
                  <div className="text-white/80 text-[11px] mt-0.5">{part.pron}</div>
                </div>

                <button
                  onClick={() => handlePlay(part.th)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition active:scale-95 ${
                    isPlaying
                      ? 'bg-white text-[#64137c]'
                      : 'bg-white/15 hover:bg-white/30 text-white'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
