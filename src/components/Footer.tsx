import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-purple-100 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#4c0d5f] mb-1">
          <span className="w-2 h-2 rounded-full bg-[#ffd200]" />
          <span>လက်တွေ့အသုံးချ ထိုင်းစကားပြော • အခန်း (၁) သင်ခန်းစာ အပြည့်အစုံ</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Designed with modern clarity, high readability, and interactive audio pronunciation.
        </p>
      </div>
    </footer>
  );
};
