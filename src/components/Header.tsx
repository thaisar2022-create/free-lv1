import React from 'react';
import {
  Volume2,
  BookOpen,
  MessageSquare,
  Layers,
  HelpCircle,
  Award,
  Shuffle,
  Headphones,
  Gauge,
} from 'lucide-react';
import { TabType } from '../types';
import { APP_LOGO_URL } from '../data/thaiData';
import { speakThai } from '../utils/audio';

interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  speechRate: number;
  onSpeechRateChange: (rate: number) => void;
}

const TABS: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'words', label: '၁. Words (ဝေါဟာရ)', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'sentences', label: '၂. Sentence (ဝါကျများ)', icon: <MessageSquare className="w-4 h-4" /> },
  { id: 'grammar', label: '၃. Grammar (သဒ္ဒါ)', icon: <Layers className="w-4 h-4" /> },
  { id: 'qa', label: '၄. Q&A (အမေးအဖြေ)', icon: <HelpCircle className="w-4 h-4" /> },
  { id: 'quiz', label: '၅. Quiz (ဉာဏ်စမ်း)', icon: <Award className="w-4 h-4" /> },
  { id: 'rewrite', label: '၆. Rewrite Sentence', icon: <Shuffle className="w-4 h-4" /> },
  { id: 'listening', label: '၇. Listening (နားထောင်လေ့ကျင့်)', icon: <Headphones className="w-4 h-4" /> },
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  speechRate,
  onSpeechRateChange,
}) => {
  const handleTestAudio = () => {
    speakThai('สวัสดีครับ ยินดีต้อนรับครับ', speechRate);
  };

  const toggleRate = () => {
    const nextRate = speechRate === 0.85 ? 0.65 : speechRate === 0.65 ? 1.0 : 0.85;
    onSpeechRateChange(nextRate);
  };

  return (
    <header className="bg-gradient-to-r from-[#4c0d5f] via-[#64137c] to-[#7d1c9a] text-white shadow-xl sticky top-0 z-50 border-b border-purple-400/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row justify-between items-center gap-3">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3.5">
          <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-lg border-2 border-[#ffd200]/70 bg-[#340842] shrink-0 flex items-center justify-center p-0.5">
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
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                လက်တွေ့အသုံးချ ထိုင်းစကားပြော
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ffd200] text-[#340842] uppercase tracking-wider shadow-sm">
                အခန်း (၁)
              </span>
            </div>
            <p id="header-subtitle" className="text-xs text-purple-200 font-light mt-0.5">
              မိတ်ဆက်ခြင်း
            </p>
          </div>
        </div>

        {/* Quick Audio Controls */}
        <div className="flex items-center gap-2.5">
          {/* Speed selector */}
          <button
            onClick={toggleRate}
            id="speed-control-btn"
            title="အသံထွက် အမြန်နှုန်း ပြောင်းရန်"
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 active:scale-95 transition flex items-center gap-1.5 border border-white/20 backdrop-blur-md text-purple-100 hover:text-white"
          >
            <Gauge className="w-3.5 h-3.5 text-[#ffd200]" />
            <span>
              {speechRate === 0.65 ? 'အသံ: နှေး (0.65x)' : speechRate === 1.0 ? 'အသံ: မြန် (1.0x)' : 'အသံ: ပုံမှန်'}
            </span>
          </button>

          {/* Test Audio Button */}
          <button
            onClick={handleTestAudio}
            id="test-audio-btn"
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 active:scale-95 transition flex items-center gap-2 border border-white/20 backdrop-blur-md text-purple-100 hover:text-white shadow-sm"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#ffd200] animate-pulse" />
            <span>အသံစမ်းသပ်ရန်</span>
          </button>
        </div>
      </div>

      {/* 7 Tabs Bar */}
      <div className="bg-[#340842]/80 backdrop-blur-md border-t border-white/10 overflow-x-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex space-x-1.5 py-2 min-w-max">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 border ${
                  isActive
                    ? 'bg-white text-[#64137c] shadow-md border-purple-200 font-bold scale-[1.02]'
                    : 'text-purple-100 hover:text-white hover:bg-white/10 border-transparent'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
