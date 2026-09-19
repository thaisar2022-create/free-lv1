import React, { useState, useMemo, useEffect } from 'react';
import { Search, Volume2, Users, Flame, Package, X } from 'lucide-react';
import { WordCategory } from '../types';
import { wordsData } from '../data/thaiData';
import { speakThai, subscribeSpeakingState } from '../utils/audio';

interface WordsTabProps {
  speechRate: number;
}

const CATEGORY_META = {
  pronoun: {
    titleMy: 'နာမ်စားစကားလုံးများ',
    titleTh: 'คำสรรพนาม',
    phonetic: 'ခမ်(မ်) စန်ဖနားမ်',
    desc: 'လူ၊ ပုဂ္ဂိုလ်၊ ဆွေမျိုးနှင့် အပြန်အလှန်သုံး နာမ်စားများ',
    icon: <Users className="w-4 h-4 text-white" />,
    badgeBg: 'bg-purple-100 text-[#64137c] border-purple-200',
  },
  verb: {
    titleMy: 'ကြိယာစကားလုံးများ',
    titleTh: 'คำกริยา',
    phonetic: 'ခမ်(မ်) ကရိယာ',
    desc: 'လှုပ်ရှားမှု၊ လုပ်ဆောင်ချက်နှင့် စိတ်ခံစားမှုဖော်ပြသော ကြိယာများ',
    icon: <Flame className="w-4 h-4 text-white" />,
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  noun: {
    titleMy: 'နာမ်စကားလုံးများ',
    titleTh: 'คำนาม',
    phonetic: 'ခမ်(မ်) နာမ်(မ်)',
    desc: 'အရာဝတ္ထု၊ အစားအစာ၊ အဝတ်အထည်နှင့် နေရာဒေသ နာမ်များ',
    icon: <Package className="w-4 h-4 text-white" />,
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
  },
};

export const WordsTab: React.FC<WordsTabProps> = ({ speechRate }) => {
  const [selectedCat, setSelectedCat] = useState<WordCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  useEffect(() => {
    return subscribeSpeakingState((text) => {
      setCurrentlyPlaying(text);
    });
  }, []);

  const totalCount = wordsData.length;
  const pronounCount = useMemo(() => wordsData.filter((w) => w.cat === 'pronoun').length, []);
  const verbCount = useMemo(() => wordsData.filter((w) => w.cat === 'verb').length, []);
  const nounCount = useMemo(() => wordsData.filter((w) => w.cat === 'noun').length, []);

  const filteredWords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return wordsData.filter((item) => {
      const matchCat = selectedCat === 'all' || item.cat === selectedCat;
      const matchQuery =
        !q ||
        item.thai.toLowerCase().includes(q) ||
        item.read.toLowerCase().includes(q) ||
        item.mm.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [selectedCat, searchQuery]);

  const categoriesToShow: WordCategory[] =
    selectedCat === 'all' ? ['pronoun', 'verb', 'noun'] : [selectedCat];

  const handlePlayWord = (thaiWord: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    speakThai(thaiWord, speechRate);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-purple-100">
      {/* Top Header & Search/Filter Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-purple-100 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-purple-100 text-[#64137c] flex items-center justify-center font-bold text-sm shadow-xs">
              ၁
            </span>
            <h2 className="text-xl font-bold text-slate-900 flex items-center flex-wrap gap-1.5">
              <span>အခန်း (၁) ဝေါဟာရများ</span>
              <span className="font-thai text-[#64137c] font-medium text-lg ml-1">(คำศัพท์)</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            နာမ်စားများ၊ ကြိယာများနှင့် နာမ်စကားလုံးများကို အသံထွက်၊ ဖိုနက်တစ်နှင့်တကွ လေ့လာပါ
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Search box */}
          <div className="relative flex-1 sm:w-60 min-w-[180px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ရှာဖွေရန် (ထိုင်း / မြန်မာ)..."
              className="w-full pl-9 pr-7 py-2 text-xs rounded-xl border border-purple-100 focus:outline-none focus:border-[#8b1fa8] focus:ring-2 focus:ring-purple-100 bg-purple-50/40 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setSelectedCat('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition shadow-xs ${
                selectedCat === 'all'
                  ? 'bg-[#64137c] text-white shadow-sm'
                  : 'bg-purple-50 text-[#4c0d5f] hover:bg-purple-100 border border-purple-200/60'
              }`}
            >
              အားလုံး ({totalCount})
            </button>
            <button
              onClick={() => setSelectedCat('pronoun')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                selectedCat === 'pronoun'
                  ? 'bg-[#64137c] text-white shadow-sm'
                  : 'bg-purple-50 text-[#4c0d5f] hover:bg-purple-100 border border-purple-200/60'
              }`}
            >
              နာမ်စား ({pronounCount})
            </button>
            <button
              onClick={() => setSelectedCat('verb')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                selectedCat === 'verb'
                  ? 'bg-[#64137c] text-white shadow-sm'
                  : 'bg-purple-50 text-[#4c0d5f] hover:bg-purple-100 border border-purple-200/60'
              }`}
            >
              ကြိယာ ({verbCount})
            </button>
            <button
              onClick={() => setSelectedCat('noun')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                selectedCat === 'noun'
                  ? 'bg-[#64137c] text-white shadow-sm'
                  : 'bg-purple-50 text-[#4c0d5f] hover:bg-purple-100 border border-purple-200/60'
              }`}
            >
              နာမ် ({nounCount})
            </button>
          </div>
        </div>
      </div>

      {/* Categorized Word Lists */}
      {filteredWords.length === 0 ? (
        <div className="text-center py-16 bg-purple-50/40 rounded-3xl border border-purple-100">
          <Search className="w-8 h-8 text-purple-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">ကိုက်ညီသော စကားလုံး မတွေ့ရှိပါ</p>
          <p className="text-xs text-slate-400 mt-1">အခြား အသံထွက် သို့မဟုတ် စကားလုံးဖြင့် ရှာဖွေကြည့်ပါ</p>
        </div>
      ) : (
        <div className="space-y-8">
          {categoriesToShow.map((catKey) => {
            const catWords = filteredWords.filter((w) => w.cat === catKey);
            if (catWords.length === 0) return null;

            const meta = CATEGORY_META[catKey];

            return (
              <section key={catKey} className="space-y-4">
                {/* Category Section Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-purple-50/70 border border-purple-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#64137c] text-white flex items-center justify-center text-base shadow-sm shrink-0">
                      {meta.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900">{meta.titleMy}</h3>
                        <span className="font-thai text-xs font-semibold text-[#64137c] bg-white px-2 py-0.5 rounded border border-purple-200">
                          {meta.titleTh}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {meta.phonetic} • {meta.desc}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-white border border-purple-200 text-[#4c0d5f] self-start sm:self-center shadow-xs">
                    {catWords.length} လုံး
                  </span>
                </div>

                {/* Grid of Word Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {catWords.map((word, idx) => {
                    const isPlaying = currentlyPlaying === word.thai;

                    return (
                      <div
                        key={idx}
                        onClick={() => handlePlayWord(word.thai)}
                        className={`p-4 rounded-2xl bg-white border transition-all cursor-pointer group flex justify-between items-center ${
                          isPlaying
                            ? 'border-[#8b1fa8] ring-2 ring-purple-200 shadow-md bg-purple-50/30'
                            : 'border-purple-100/90 hover:border-purple-300 hover:shadow-md'
                        }`}
                      >
                        <div className="space-y-0.5 select-none">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-thai text-2xl font-bold tracking-tight transition ${
                                isPlaying ? 'text-[#64137c] scale-105' : 'text-slate-900 group-hover:text-[#64137c]'
                              }`}
                            >
                              {word.thai}
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-[#8b1fa8]">{word.read}</div>
                          <div className="text-xs sm:text-sm font-semibold text-slate-700">{word.mm}</div>
                        </div>

                        <button
                          onClick={(e) => handlePlayWord(word.thai, e)}
                          title="အသံထွက် နားထောင်မည်"
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95 shrink-0 ml-2 shadow-xs ${
                            isPlaying
                              ? 'bg-[#64137c] text-[#ffd200] scale-105 animate-pulse'
                              : 'bg-purple-50 group-hover:bg-[#64137c] text-[#64137c] group-hover:text-white'
                          }`}
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};
