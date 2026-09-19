import React, { useState, useEffect } from 'react';
import { TabType } from './types';
import { Header } from './components/Header';
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
    <div className="min-h-screen flex flex-col bg-[#fcfbfe] text-[#1e1b2e] antialiased selection:bg-purple-200 selection:text-purple-900">
      {/* Sticky Header with Logo & Tabs */}
      <Header
        activeTab={activeTab}
        onTabChange={handleTabChange}
        speechRate={speechRate}
        onSpeechRateChange={setSpeechRate}
      />

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8">
        {activeTab === 'words' && <WordsTab speechRate={speechRate} />}
        {activeTab === 'sentences' && <SentencesTab speechRate={speechRate} />}
        {activeTab === 'grammar' && <GrammarTab speechRate={speechRate} />}
        {activeTab === 'qa' && <QATab speechRate={speechRate} />}
        {activeTab === 'quiz' && <QuizTab speechRate={speechRate} />}
        {activeTab === 'rewrite' && <RewriteTab speechRate={speechRate} />}
        {activeTab === 'listening' && <ListeningTab speechRate={speechRate} />}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
