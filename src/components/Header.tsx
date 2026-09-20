import React from 'react';
import { Volume2, Gauge } from 'lucide-react';
import { TabType } from '../types';
import { APP_LOGO_URL } from '../data/thaiData';
import { speakThai } from '../utils/audio';

export type Language = 'my' | 'th' | 'en';

export interface HeaderProps {
  speechRate: number;
  onSpeechRateChange: (rate: number) => void;
  language: 'my' | 'th' | 'en';
  onLanguageChange: (lang: 'my' | 'th' | 'en') => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  activeTab?: TabType;
  onTabChange?: (tab: TabType) => void;
}

export const Header: React.FC<HeaderProps> = ({
  speechRate,
  onSpeechRateChange,
  language,
  onLanguageChange,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const handleTestAudio = () => {
    speakThai('สวัสดีครับ ยินดีต้อนรับครับ', speechRate);
  };

  const toggleRate = () => {
    const nextRate = speechRate === 0.85 ? 0.65 : speechRate === 0.65 ? 1.0 : 0.85;
    onSpeechRateChange(nextRate);
  };

  return (
    <header className="bg-gradient-to-r from-[#4c0d5f] via-[#64137c] to-[#7d1c9a] dark:from-[#21062b] dark:via-[#350945] dark:to-[#470d5c] text-white shadow-xl sticky top-0 z-40 border-b border-purple-400/20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-3">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden shadow-lg border-2 border-[#ffd200]/70 bg-[#340842] shrink-0 flex items-center justify-center p-0.5">
              <img
                id="header-brand-logo"
                src={APP_LOGO_URL}
                alt="Logo"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  {language === 'my'
                    ? 'လက်တွေ့အသုံးချ ထိုင်းစကားပြော'
                    : language === 'th'
                    ? 'ภาษาไทยใช้จริงในชีวิตประจำวัน'
                    : 'Practical Conversational Thai'}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-[#ffd200] text-[#340842] uppercase tracking-wider shadow-sm">
                  {language === 'my' ? 'အခန်း (၁)' : language === 'th' ? 'บทที่ 1' : 'Lesson 1'}
                </span>
              </div>
              <p id="header-subtitle" className="text-xs text-purple-200 font-light mt-0.5">
                {language === 'my'
                  ? 'မိတ်ဆက်ခြင်း'
                  : language === 'th'
                  ? 'การแนะนำตัว'
                  : 'Introduction & Greetings'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-center sm:justify-end w-full sm:w-auto">
          {/* TRILINGUAL LANGUAGE SELECTOR */}
          <div
            id="language-switcher"
            className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-semibold shrink-0"
          >
            {(['my', 'th', 'en'] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => onLanguageChange(lang)}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  language === lang
                    ? "bg-purple-600 text-white shadow-xs font-bold"
                    : "text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                }`}
                aria-label={`Switch language to ${lang === 'my' ? 'Myanmar' : lang === 'th' ? 'Thai' : 'English'}`}
              >
                {lang === 'my' ? '🇲🇲 မြန်မာ' : lang === 'th' ? '🇹🇭 ไทย' : '🇬🇧 EN'}
              </button>
            ))}
          </div>

          {/* DAY / NIGHT MODE (THEME TOGGLE BUTTON) */}
          <button
            type="button"
            id="theme-toggle-btn"
            onClick={onToggleDarkMode}
            aria-label={isDarkMode ? "Switch to Day Mode (Light)" : "Switch to Night Mode (Dark)"}
            className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-amber-400 flex items-center justify-center transition-all focus-visible:ring-2 focus-visible:ring-purple-400 shrink-0"
          >
            {isDarkMode ? (
              /* Sun Icon for Light Mode */
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              /* Moon Icon for Night Mode */
              <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Speed Selector */}
          <button
            onClick={toggleRate}
            id="speed-control-btn"
            title="အသံထွက် အမြန်နှုန်း ပြောင်းရန်"
            className="px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 active:scale-95 transition flex items-center gap-1.5 border border-white/20 backdrop-blur-md text-purple-100 hover:text-white shrink-0"
          >
            <Gauge className="w-3.5 h-3.5 text-[#ffd200]" />
            <span>
              {speechRate === 0.65
                ? (language === 'th' ? 'ช้า (0.65x)' : language === 'en' ? 'Slow (0.65x)' : 'အသံ: နှေး (0.65x)')
                : speechRate === 1.0
                ? (language === 'th' ? 'เร็ว (1.0x)' : language === 'en' ? 'Fast (1.0x)' : 'အသံ: မြန် (1.0x)')
                : (language === 'th' ? 'ปกติ' : language === 'en' ? 'Normal' : 'အသံ: ပုံမှန်')}
            </span>
          </button>

          {/* Test Audio Button */}
          <button
            onClick={handleTestAudio}
            id="test-audio-btn"
            className="px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 active:scale-95 transition flex items-center gap-1.5 sm:gap-2 border border-white/20 backdrop-blur-md text-purple-100 hover:text-white shadow-sm shrink-0"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#ffd200] animate-pulse" />
            <span className="hidden xs:inline sm:inline">
              {language === 'th' ? 'ทดสอบเสียง' : language === 'en' ? 'Test Audio' : 'အသံစမ်းသပ်ရန်'}
            </span>
            <span className="inline xs:hidden sm:hidden">
              {language === 'th' ? 'ทดสอบ' : language === 'en' ? 'Audio' : 'စမ်းသပ်'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
