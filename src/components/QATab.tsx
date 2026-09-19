import React, { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { qaData } from '../data/thaiData';
import { speakThai, subscribeSpeakingState } from '../utils/audio';

interface QATabProps {
  speechRate: number;
}

export const QATab: React.FC<QATabProps> = ({ speechRate }) => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  useEffect(() => {
    return subscribeSpeakingState((text) => {
      setCurrentlyPlaying(text);
    });
  }, []);

  const handlePlay = (text: string) => {
    // Extract primary text before slash if any, or clean up punctuation
    const clean = text.split('/')[0].replace(/[?]/g, '').trim();
    speakThai(clean, speechRate);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-purple-100">
      {/* Header */}
      <div className="border-b border-purple-100 pb-5 mb-6">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-purple-100 text-[#64137c] flex items-center justify-center font-bold text-sm shadow-xs">
            ၄
          </span>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span>အမေးအဖြေ လေ့ကျင့်ခန်း</span>
            <span className="font-thai text-[#64137c] font-medium text-lg ml-1">(ถาม - ตอบ)</span>
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          နေ့စဉ်သုံး အမေးနှင့်အဖြေအတွဲများကို အသံထွက်နားထောင်ပြီး အလွတ်ပြောဆိုလေ့ကျင့်ပါ
        </p>
      </div>

      {/* Q&A Cards */}
      <div className="space-y-4">
        {qaData.map((item, idx) => {
          const isPlayingQ = currentlyPlaying === item.q.split('/')[0].replace(/[?]/g, '').trim();
          const isPlayingA = currentlyPlaying === item.a.split('/')[0].replace(/[?]/g, '').trim();

          return (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-purple-100/90 bg-white hover:border-purple-300 transition shadow-xs space-y-3"
            >
              {/* Question Row */}
              <div className="flex justify-between items-start gap-2 border-b border-purple-50 pb-3">
                <div className="flex gap-3">
                  <span className="w-7 h-7 rounded-xl bg-[#ffd200] text-[#340842] flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                    Q
                  </span>
                  <div>
                    <div className="font-thai text-base sm:text-lg font-bold text-slate-900">
                      {item.q}
                    </div>
                    <div className="text-xs text-[#8b1fa8] font-medium mt-0.5">{item.q_read}</div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-600 mt-0.5">
                      {item.q_mm}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handlePlay(item.q)}
                  title="အမေးကို နားထောင်မည်"
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition shrink-0 ${
                    isPlayingQ
                      ? 'bg-[#64137c] text-[#ffd200] animate-pulse'
                      : 'bg-purple-50 text-[#64137c] hover:bg-[#64137c] hover:text-white'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Answer Row */}
              <div className="flex justify-between items-start gap-2 pt-1">
                <div className="flex gap-3">
                  <span className="w-7 h-7 rounded-xl bg-[#64137c] text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                    A
                  </span>
                  <div>
                    <div className="font-thai text-base sm:text-lg font-bold text-[#64137c]">
                      {item.a}
                    </div>
                    <div className="text-xs text-purple-600 font-medium mt-0.5">{item.a_read}</div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-600 mt-0.5">
                      {item.a_mm}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handlePlay(item.a)}
                  title="အဖြေကို နားထောင်မည်"
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition shrink-0 ${
                    isPlayingA
                      ? 'bg-[#64137c] text-[#ffd200] animate-pulse'
                      : 'bg-purple-50 text-[#64137c] hover:bg-[#64137c] hover:text-white'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
