import React from 'react';
import {
  BookOpen,
  MessageSquare,
  Layers,
  HelpCircle,
  Award,
  Shuffle,
  Headphones,
  LucideIcon,
} from 'lucide-react';
import { TabType } from '../types';

export interface BottomNavProps {
  activeTab: string;
  onTabChange: (tabId: TabType) => void;
  language: 'my' | 'th' | 'en';
}

interface TabDef {
  id: TabType;
  icon: LucideIcon;
  label: {
    my: string;
    th: string;
    en: string;
  };
}

const TABS: TabDef[] = [
  {
    id: 'words',
    icon: BookOpen,
    label: { my: 'ဝေါဟာရ', th: 'คำศัพท์', en: 'Words' },
  },
  {
    id: 'sentences',
    icon: MessageSquare,
    label: { my: 'ဝါကျများ', th: 'ประโยค', en: 'Sentences' },
  },
  {
    id: 'grammar',
    icon: Layers,
    label: { my: 'သဒ္ဒါ', th: 'ไวยากรณ์', en: 'Grammar' },
  },
  {
    id: 'qa',
    icon: HelpCircle,
    label: { my: 'အမေးအဖြေ', th: 'ถาม-ตอบ', en: 'Q&A' },
  },
  {
    id: 'quiz',
    icon: Award,
    label: { my: 'ဉာဏ်စမ်း', th: 'แบบทดสอบ', en: 'Quiz' },
  },
  {
    id: 'rewrite',
    icon: Shuffle,
    label: { my: 'ဝါကျပြင်', th: 'เรียบเรียง', en: 'Rewrite' },
  },
  {
    id: 'listening',
    icon: Headphones,
    label: { my: 'နားထောင်', th: 'การฟัง', en: 'Audio' },
  },
];

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  language,
}) => {
  return (
    <nav
      role="navigation"
      aria-label="အောက်ခြေ လမ်းညွှန်မီနူး"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 shadow-xl px-1 sm:px-3 pb-[env(safe-area-inset-bottom)] transition-colors duration-200"
    >
      <div className="max-w-2xl mx-auto flex items-center justify-around py-1 sm:py-1.5 overflow-x-auto custom-scrollbar">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              id={`bottom-nav-${tab.id}`}
              type="button"
              onClick={() => onTabChange(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={tab.label[language]}
              className={`flex flex-col items-center justify-center min-w-[48px] sm:min-w-[56px] py-1 px-1 sm:px-2 rounded-xl transition-all ${
                isActive
                  ? 'text-purple-600 dark:text-purple-400 font-bold scale-105'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400`}
            >
              <Icon className={`w-5 h-5 mb-0.5 sm:mb-1 transition-transform ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] sm:text-[11px] leading-tight font-medium tracking-tight whitespace-nowrap">
                {tab.label[language]}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
