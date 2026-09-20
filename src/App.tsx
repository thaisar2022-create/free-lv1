import React, { useState, useEffect } from 'react';
import { TabType } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { WordsTab } from './components/WordsTab';
import { SentencesTab } from './components/SentencesTab';
import { GrammarTab } from './components/GrammarTab';
import { QATab } from './components/QATab';
import { QuizTab } from './components/QuizTab';
import { RewriteTab } from './components/RewriteTab';
import { ListeningTab } from './components/ListeningTab';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('words');
  const [speechRate, setSpeechRate] = useState<number>(0.85);

  // 1. DARK MODE STATE & INITIALIZATION
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    } catch {
      // Ignore in restricted iframe contexts
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // 2. TRILINGUAL LANGUAGE STATE
  const [language, setLanguage] = useState<'my' | 'th' | 'en'>(() => {
    try {
      return (
        (localStorage.getItem('app_lang') as 'my' | 'th' | 'en') ||
        (localStorage.getItem('language') as 'my' | 'th' | 'en') ||
        'my'
      );
    } catch {
      return 'my';
    }
  });

  const handleLanguageChange = (lang: 'my' | 'th' | 'en') => {
    setLanguage(lang);
    try {
      localStorage.setItem('app_lang', lang);
      localStorage.setItem('language', lang);
    } catch {
      // Ignore
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Preload speech synthesis voices on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDarkMode ? 'dark bg-[#110c1c] text-gray-100' : 'bg-[#fcfbfe] text-[#1e1b2e]'
      } transition-colors duration-200 antialiased selection:bg-purple-200 selection:text-purple-900`}
    >
      {/* Top Header with Brand, Trilingual Language Switcher, Day/Night Toggle & Audio Controls */}
      <Header
        activeTab={activeTab}
        onTabChange={handleTabChange}
        speechRate={speechRate}
        onSpeechRateChange={setSpeechRate}
        language={language}
        onLanguageChange={handleLanguageChange}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Content Area with bottom padding to prevent BottomNav overlap */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-3 sm:px-6 py-5 md:py-8 pb-32 sm:pb-36">
        {activeTab === 'words' && <WordsTab speechRate={speechRate} />}
        {activeTab === 'sentences' && <SentencesTab speechRate={speechRate} />}
        {activeTab === 'grammar' && <GrammarTab speechRate={speechRate} />}
        {activeTab === 'qa' && <QATab speechRate={speechRate} />}
        {activeTab === 'quiz' && <QuizTab speechRate={speechRate} />}
        {activeTab === 'rewrite' && <RewriteTab speechRate={speechRate} />}
        {activeTab === 'listening' && <ListeningTab speechRate={speechRate} />}

        {/* Footer inside scroll area above sticky bottom nav */}
        <Footer />
      </main>

      {/* Ergonomic Sticky Bottom Navigation Bar (WCAG 2.1 AA) */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        language={language}
      />
    </div>
  );
}
