import React, { useState, useMemo, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { SentenceCategory } from '../types';
import { sentenceData } from '../data/thaiData';
import { speakThai, subscribeSpeakingState } from '../utils/audio';

interface SentencesTabProps {
  speechRate: number;
}

export const SentencesTab: React.FC<SentencesTabProps> = ({ speechRate }) => {
  const [filter, setFilter] = useState<SentenceCategory | 'all'>('all');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  useEffect(() => {
    return subscribeSpeakingState((text) => {
      setCurrentlyPlaying(text);
    });
  }, []);

  const totalCount = sentenceData.length;
  const greetingCount = useMemo(
    () => sentenceData.filter((s) => s.cat === 'greeting').length,
    []
  );
  const dailyCount = useMemo(
    () => sentenceData.filter((s) => s.cat === 'daily').length,
    []
  );

  const filteredList = useMemo(() => {
    if (filter === 'all') return sentenceData;
    return sentenceData.filter((s) => s.cat === filter);
  }, [filter]);

  const handlePlaySentence = (text: string) => {
    speakThai(text, speechRate);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-purple-100">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-purple-100 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-purple-100 text-[#64137c] flex items-center justify-center font-bold text-sm shadow-xs">
              ၂
            </span>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
              <span>လက်တွေ့သုံး ဝါကျများ</span>
              <span className="font-thai text-[#64137c] font-medium text-lg ml-1">(ประโยค)</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            မကြာခဏသုံးသော နှုတ်ဆက်စကားများနှင့် နေ့စဉ်သုံးဝါကျများ
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition shadow-xs ${
              filter === 'all'
                ? 'bg-[#64137c] text-white shadow-sm'
                : 'bg-purple-50 text-[#4c0d5f] hover:bg-purple-100 border border-purple-200/60'
            }`}
          >
            အားလုံး ({totalCount})
          </button>
          <button
            onClick={() => setFilter('greeting')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition ${
              filter === 'greeting'
                ? 'bg-[#64137c] text-white shadow-sm'
                : 'bg-purple-50 text-[#4c0d5f] hover:bg-purple-100 border border-purple-200/60'
            }`}
          >
            နှုတ်ဆက်စကား ({greetingCount})
          </button>
          <button
            onClick={() => setFilter('daily')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition ${
              filter === 'daily'
                ? 'bg-[#64137c] text-white shadow-sm'
                : 'bg-purple-50 text-[#4c0d5f] hover:bg-purple-100 border border-purple-200/60'
            }`}
          >
            နေ့စဉ်သုံးဝါကျ ({dailyCount})
          </button>
        </div>
      </div>

      {/* Sentences List */}
      <div className="space-y-3">
        {filteredList.map((item, idx) => {
          const speakTarget = item.speakThai || item.thai;
          const isPlaying = currentlyPlaying === speakTarget;
          const isGreeting = item.cat === 'greeting';

          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl bg-white border transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-3 group ${
                isPlaying
                  ? 'border-[#8b1fa8] ring-2 ring-purple-200 shadow-md bg-purple-50/20'
                  : 'border-purple-100/90 hover:border-purple-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-xl bg-purple-50 text-[#4c0d5f] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 group-hover:bg-[#64137c] group-hover:text-white transition">
                  {idx + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-thai text-lg sm:text-xl font-bold text-slate-900 tracking-wide">
                      {item.thai}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold ${
                        isGreeting
                          ? 'bg-pink-50 text-pink-700 border-pink-200'
                          : 'bg-purple-50 text-[#64137c] border-purple-200'
                      }`}
                    >
                      {isGreeting ? 'နှုတ်ဆက်စကား' : 'နေ့စဉ်သုံးဝါကျ'}
                    </span>
                  </div>
                  <div className="text-xs text-[#8b1fa8] font-medium mt-1">{item.read}</div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-0.5">{item.mm}</div>
                </div>
              </div>

              <button
                onClick={() => handlePlaySentence(speakTarget)}
                className={`self-end sm:self-center px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition active:scale-95 shrink-0 shadow-xs ${
                  isPlaying
                    ? 'bg-[#64137c] text-[#ffd200] animate-pulse'
                    : 'bg-purple-50 hover:bg-[#64137c] text-[#64137c] hover:text-white'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isPlaying ? 'ဖွင့်နေသည်...' : 'နားထောင်မည်'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
