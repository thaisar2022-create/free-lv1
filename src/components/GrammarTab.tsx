import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Volume2, Sparkles, Search, X, ChevronsDown, ChevronsUp } from 'lucide-react';
import { grammarRules, politeParticles } from '../data/thaiData';
import { speakThai, subscribeSpeakingState } from '../utils/audio';

interface GrammarTabProps {
  speechRate: number;
}

interface EnrichedRule {
  id: string | number;
  num: string;
  title: string;
  titleMyanmar: string;
  titleThai: string;
  structure: string;
  pattern: string;
  explanation: string;
  tag: string;
  sub: string;
  examples: {
    thai: string;
    th: string;
    reading: string;
    rd: string;
    myanmarReading: string;
    phonetic: string;
    meaning: string;
    mm: string;
  }[];
}

export const GrammarTab: React.FC<GrammarTabProps> = ({ speechRate }) => {
  const [expandedId, setExpandedId] = useState<string | number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  const headerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    return subscribeSpeakingState((text) => {
      setCurrentlyPlaying(text);
    });
  }, []);

  const playAudio = (text: string) => {
    speakThai(text, speechRate);
  };

  const handlePlayPolite = (text: string) => {
    speakThai(text, speechRate);
  };

  // Format and enrich grammar rules for maximum accessibility & clean presentation
  const formattedRules: EnrichedRule[] = useMemo(() => {
    return grammarRules.map((rule, idx) => {
      let titleMyanmar = rule.title;
      let titleThai = '';
      const match = rule.title.match(/^(.*?)\s*\((.*?)\)$/);
      if (match) {
        titleMyanmar = match[1].trim();
        titleThai = match[2].trim();
      } else {
        titleThai = rule.sub.split('/')[0]?.trim() || '';
      }

      return {
        id: rule.num || `${idx + 1}`,
        num: rule.num || `${idx + 1}`,
        title: rule.title,
        titleMyanmar,
        titleThai,
        structure: rule.tag,
        pattern: rule.tag,
        explanation: rule.desc,
        tag: rule.tag,
        sub: rule.sub,
        examples: rule.examples.map((ex) => {
          const parts = ex.rd.split('/');
          const myanmarReading = parts[0]?.trim() || ex.rd;
          const phonetic = parts[1] ? `/${parts[1].trim()}/` : '';

          return {
            thai: ex.th,
            th: ex.th,
            reading: ex.rd,
            rd: ex.rd,
            myanmarReading,
            phonetic,
            meaning: ex.mm,
            mm: ex.mm,
          };
        }),
      };
    });
  }, []);

  // Filter topics by title, structure or explanation
  const filteredRules = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return formattedRules;
    return formattedRules.filter(
      (rule) =>
        rule.titleMyanmar.toLowerCase().includes(q) ||
        rule.titleThai.toLowerCase().includes(q) ||
        rule.title.toLowerCase().includes(q) ||
        rule.structure.toLowerCase().includes(q) ||
        rule.explanation.toLowerCase().includes(q) ||
        rule.examples.some(
          (ex) =>
            ex.thai.toLowerCase().includes(q) ||
            ex.meaning.toLowerCase().includes(q) ||
            ex.myanmarReading.toLowerCase().includes(q)
        )
    );
  }, [formattedRules, searchQuery]);

  const isAllExpanded = expandedId === 'all';

  const toggleExpandAll = () => {
    if (isAllExpanded) {
      setExpandedId(null);
    } else {
      setExpandedId('all');
    }
  };

  // Keyboard navigation: Up/Down arrows move focus between topic headers
  const handleHeaderKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = (index + 1) % filteredRules.length;
      headerRefs.current[nextIdx]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIdx = (index - 1 + filteredRules.length) % filteredRules.length;
      headerRefs.current[prevIdx]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      headerRefs.current[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      headerRefs.current[filteredRules.length - 1]?.focus();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 sm:p-8 shadow-sm border border-purple-100 dark:border-gray-800 transition-colors">
      {/* Tab Header */}
      <div className="border-b border-purple-100 dark:border-gray-800 pb-5 mb-6">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-[#64137c] dark:text-purple-300 flex items-center justify-center font-bold text-sm shadow-xs">
            ၃
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap">
            <span>အခြေခံသဒ္ဒါ နည်းစနစ်များ</span>
            <span className="font-thai text-[#64137c] dark:text-purple-400 font-medium text-lg ml-1">
              (ไวยากรณ์)
            </span>
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1">
          ခေါင်းစဉ်များကို နှိပ်၍ သဒ္ဒါစည်းမျဉ်းများနှင့် ဥပမာဝါကျများကို အလွယ်တကူ လေ့လာနိုင်ပါသည်
        </p>
      </div>

      {/* Top Toolbar: Search, Expand/Collapse All & Topic Counter Badge */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 p-4 rounded-2xl bg-purple-50/50 dark:bg-gray-800/60 border border-purple-100 dark:border-gray-700/60 mb-6">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="သဒ္ဒါခေါင်းစဉ် သို့မဟုတ် ဝေါဟာရ ရှာဖွေရန်..."
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-purple-200 dark:border-gray-700 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap justify-between md:justify-end">
          {/* Expand / Collapse All Toggle Button */}
          <button
            type="button"
            onClick={toggleExpandAll}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-gray-800 hover:bg-purple-100/70 dark:hover:bg-gray-700 border border-purple-200 dark:border-gray-700 text-purple-800 dark:text-purple-300 transition-all flex items-center gap-1.5 active:scale-95 shadow-xs"
          >
            {isAllExpanded ? (
              <>
                <ChevronsUp className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>အားလုံးပိတ်မည် (Collapse All)</span>
              </>
            ) : (
              <>
                <ChevronsDown className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>အားလုံးဖွင့်မည် (Expand All)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Accordion List */}
      {filteredRules.length === 0 ? (
        <div className="text-center py-16 bg-purple-50/40 dark:bg-gray-800/40 rounded-3xl border border-purple-100 dark:border-gray-800">
          <Search className="w-8 h-8 text-purple-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">ကိုက်ညီသော သဒ္ဒါခေါင်းစဉ် မတွေ့ရှိပါ</p>
          <p className="text-xs text-slate-400 mt-1">အခြား အသံထွက် သို့မဟုတ် စကားလုံးဖြင့် ရှာဖွေကြည့်ပါ</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRules.map((rule, idx) => {
            const isExpanded = expandedId === rule.id || expandedId === 'all';

            return (
              <div key={rule.id} className="transition-all duration-200">
                {/* Accessible Interactive Header Button */}
                <button
                  ref={(el) => {
                    headerRefs.current[idx] = el;
                  }}
                  type="button"
                  id={`grammar-header-${rule.id}`}
                  aria-expanded={isExpanded}
                  aria-controls={`grammar-panel-${rule.id}`}
                  onKeyDown={(e) => handleHeaderKeyDown(e, idx)}
                  onClick={() =>
                    setExpandedId(expandedId === rule.id ? null : rule.id)
                  }
                  className={`w-full flex items-center justify-between p-4 rounded-2xl text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 min-h-[48px] ${
                    isExpanded
                      ? 'bg-purple-600 text-white shadow-lg scale-[1.01]'
                      : 'bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-gray-700/60 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700/60 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        isExpanded
                          ? 'bg-white/20 text-white'
                          : 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <h3
                        className="font-bold text-base sm:text-lg leading-snug"
                        lang="my"
                      >
                        {rule.titleMyanmar || rule.title}
                      </h3>
                      <p
                        className={`text-xs mt-0.5 ${
                          isExpanded
                            ? 'text-purple-100'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                        lang="th"
                      >
                        {rule.titleThai} •{' '}
                        <span className="font-mono">
                          {rule.structure || rule.pattern}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span
                      className={`hidden sm:inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                        isExpanded
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {rule.examples?.length || 0} ဝါကျ
                    </span>
                    <svg
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isExpanded ? 'rotate-180 text-white' : 'text-gray-400'
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {/* Smooth Content Expansion (CSS Grid Transition - Zero CLS) */}
                <div
                  id={`grammar-panel-${rule.id}`}
                  role="region"
                  aria-labelledby={`grammar-header-${rule.id}`}
                  className={`grid transition-all duration-300 ease-in-out ${
                    isExpanded
                      ? 'grid-rows-[1fr] opacity-100 mt-3'
                      : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="p-4 sm:p-5 bg-purple-50/50 dark:bg-gray-900/50 rounded-2xl border border-purple-100 dark:border-purple-950/40 space-y-4">
                      {/* Rule explanation & Formula note */}
                      {rule.explanation && (
                        <div className="p-3.5 bg-white dark:bg-gray-800 rounded-xl border border-purple-100 dark:border-gray-700 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                          <span className="font-bold text-purple-700 dark:text-purple-300 block mb-1">
                            📌 သဒ္ဒါစည်းမျဉ်း ရှင်းလင်းချက်-
                          </span>
                          {rule.explanation}
                        </div>
                      )}

                      {/* Example Sentences Cards */}
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300">
                          📝 လေ့ကျင့်ရန် နမူနာဝါကျများ ({rule.examples?.length || 0} ခု)
                        </h4>
                        {rule.examples?.map((ex, exIdx) => {
                          const isPlaying = currentlyPlaying === ex.thai;

                          return (
                            <div
                              key={exIdx}
                              className={`p-3.5 bg-white dark:bg-gray-800 rounded-xl border flex items-center justify-between gap-3 shadow-xs transition-colors ${
                                isPlaying
                                  ? 'border-purple-500 ring-2 ring-purple-200 dark:ring-purple-900'
                                  : 'border-gray-100 dark:border-gray-700 hover:border-purple-200'
                              }`}
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                                    #{exIdx + 1}
                                  </span>
                                  <p
                                    className="font-bold text-base text-gray-900 dark:text-white font-thai"
                                    lang="th"
                                  >
                                    {ex.thai}
                                  </p>
                                </div>
                                <p className="text-xs text-purple-700 dark:text-purple-300 font-mono">
                                  {ex.phonetic}{' '}
                                  <span
                                    className="text-gray-500 dark:text-gray-400 font-sans"
                                    lang="my"
                                  >
                                    ({ex.myanmarReading || ex.reading})
                                  </span>
                                </p>
                                <p
                                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                  lang="my"
                                >
                                  {ex.meaning}
                                </p>
                              </div>
                              <button
                                onClick={() => playAudio(ex.thai)}
                                aria-label={`Listen to ${ex.thai}`}
                                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors min-w-[40px] min-h-[40px] ${
                                  isPlaying
                                    ? 'bg-purple-600 text-white animate-pulse'
                                    : 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 hover:bg-purple-600 hover:text-white'
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
                </div>
              </div>
            );
          })}
        </div>
      )}

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
                  <div
                    className={`font-thai text-2xl font-bold mt-1 ${part.color}`}
                    lang="th"
                  >
                    {part.th}
                  </div>
                  <div className="text-white/80 text-[11px] mt-0.5">{part.pron}</div>
                </div>

                <button
                  onClick={() => handlePlayPolite(part.th)}
                  aria-label={`Listen to ${part.th}`}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition active:scale-95 min-w-[40px] min-h-[40px] ${
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

