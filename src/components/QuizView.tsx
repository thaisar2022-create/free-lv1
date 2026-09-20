import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, ArrowRight, RotateCcw } from 'lucide-react';
import { speakThai } from '../utils/audio';

export interface CleanQuizQuestion {
  id: number;
  promptLabel: string;
  thaiWord: string;
  audioTarget: string;
  options: string[];
  correctAnswerIndex: number;
  phonetic: string;
  myanmarReading: string;
  explanation: string;
}

export const ACTIVE_RECALL_QUIZ_QUESTIONS: CleanQuizQuestion[] = [
  {
    id: 1,
    promptLabel: 'အောက်ပါ ထိုင်းစကားလုံး၏ မြန်မာအဓိပ္ပာယ်ကို ရွေးချယ်ပါ',
    thaiWord: 'กิน',
    audioTarget: 'กิน',
    options: ['သောက်သည်', 'စားသည်', 'သွားသည်', 'ဝယ်သည်'],
    correctAnswerIndex: 1,
    phonetic: '/kin/',
    myanmarReading: 'ကင်(န်)',
    explanation: "'กิน' (ကင် /kin/) ဆိုသည်မှာ 'စားသည်' ဖြစ်ပြီး 'သောက်သည်' မှာ 'ดื่ม' (ဒိုမ် /dʉ̀ʉm/) ဖြစ်ပါသည်။",
  },
  {
    id: 2,
    promptLabel: 'အောက်ပါ မြန်မာဝါကျအတွက် မှန်ကန်သော ထိုင်းဝါကျကို ရွေးချယ်ပါ',
    thaiWord: 'သူ စာအုပ် မဖတ်ဘူး',
    audioTarget: 'เขาไม่อ่านหนังสือ',
    options: ['เขา กิน ข้าว', 'เขา ไม่ อ่าน หนังสือ', 'เขา ไป ตลาด', 'เขา มี หนังสือ'],
    correctAnswerIndex: 1,
    phonetic: '/kháo mây ʔàan nǎŋ-sʉ̌ʉ/',
    myanmarReading: 'ခေါဝ် မိုက် အာန် နန်းစို',
    explanation: 'เขา (သူ) + ไม่ (မ...ဘူး) + อ่าน (ဖတ်) + หนังสือ (စာအုပ်) ဖြစ်ပါသည်။',
  },
  {
    id: 3,
    promptLabel: 'အမျိုးသားများ ယဉ်ကျေးစွာ ပြောဆိုရာတွင် အဆုံးသတ်၌ သုံးရသော စကားလုံးမှာ?',
    thaiWord: 'ယဉ်ကျေးစကား (အမျိုးသား)',
    audioTarget: 'ครับ',
    options: ['ค่ะ', 'ครับ', 'คะ', 'นะ'],
    correctAnswerIndex: 1,
    phonetic: '/khráp/',
    myanmarReading: 'ခရတ်(ပ်)',
    explanation: "အမျိုးသားများအတွက် 'ครับ' (ခရတ် /khráp/) ကို သုံးပြီး၊ အမျိုးသမီးများမှာ 'ค่ะ / คะ' ကို သုံးပါသည်။",
  },
  {
    id: 4,
    promptLabel: "'ဈေး' ကို ထိုင်းဘာသာဖြင့် မည်သို့ခေါ်သနည်း?",
    thaiWord: 'ဈေး (Market)',
    audioTarget: 'ตลาด',
    options: ['ทะเล', 'ตลาด', 'เสื้อ', 'ข้าว'],
    correctAnswerIndex: 1,
    phonetic: '/ta-làat/',
    myanmarReading: 'တလတ်(တ်)',
    explanation: "ဈေး ကို 'ตลาด' (တလတ် /ta-làat/) ဟု ခေါ်ပြီး၊ ทะเล မှာ ပင်လယ် ဖြစ်ပါသည်။",
  },
  {
    id: 5,
    promptLabel: "'နားလည်ပါသလား' ဟု မေးလိုလျှင် မည်သို့ပြောရမည်နည်း?",
    thaiWord: 'နားလည်ပါသလား?',
    audioTarget: 'เข้าใจไหม',
    options: ['เข้าใจไหม', 'สบายดีไหม', 'ไปไหน', 'กินข้าวไหม'],
    correctAnswerIndex: 0,
    phonetic: '/khâw-jay máy/',
    myanmarReading: 'ခေါဝ်ကျိုင် မိုင်း',
    explanation: 'เข้าใจ (နားလည်) + ไหม (လား) = เข้าใจไหม (နားလည်လား) ဖြစ်ပါသည်။',
  },
  {
    id: 6,
    promptLabel: 'အောက်ပါ ထိုင်းနှုတ်ဆက်စကား၏ မြန်မာအဓိပ္ပာယ်မှာ အဘယ်နည်း?',
    thaiWord: 'ยินดีที่ได้รู้จัก',
    audioTarget: 'ยินดีที่ได้รู้จัก',
    options: ['သွားခွင့်ပြုပါဦး', 'သိကျွမ်းရတာ ဝမ်းသာပါတယ်', 'ကိစ္စမရှိပါဘူး', 'နေကောင်းလား'],
    correctAnswerIndex: 1,
    phonetic: '/yin-dii thîi dâay rúu-jàk/',
    myanmarReading: 'ယင်းဒီး ထီး ဒိုက် ရူးကျက်',
    explanation: "'ยินดีที่ได้รู้จัก' သည် တစ်ဦးနှင့်တစ်ဦး စတင်သိကျွမ်းရာတွင် သုံးသော 'သိကျွမ်းရတာ ဝမ်းသာပါတယ်' ဖြစ်ပါသည်။",
  },
  {
    id: 7,
    promptLabel: "တစ်ဖက်လူက ဝမ်းသာကြောင်းပြောလာပါက 'အတူတူပါပဲ' (Likewise) ဟု မည်သို့ပြန်ပြောမည်နည်း?",
    thaiWord: 'အတူတူပါပဲ (Likewise)',
    audioTarget: 'เช่นกัน',
    options: ['ไม่เป็นไร', 'เช่นกัน', 'ขอโทษ', 'ขอบคุณ'],
    correctAnswerIndex: 1,
    phonetic: '/chêen-kan/',
    myanmarReading: 'ချိန်းကန်',
    explanation: "'เช่นกัน' (ချိန်းကန် /chêen-kan/) သည် 'အတူတူပါပဲ' ဟု အဓိပ္ပာယ်ရပါသည်။",
  },
  {
    id: 8,
    promptLabel: 'အမျိုးသမီးများ မေးခွန်းမေးရာတွင် အဆုံးသတ်၌ သုံးရသော ယဉ်ကျေးစကားလုံးမှာ?',
    thaiWord: 'မေးခွန်း အဆုံးသတ် (အမျိုးသမီး)',
    audioTarget: 'คะ',
    options: ['คะ', 'ค่ะ', 'ครับ', 'จ๊ะ'],
    correctAnswerIndex: 0,
    phonetic: '/khá/',
    myanmarReading: 'ခ',
    explanation: "အမျိုးသမီးများ မေးခွန်းမေးရာတွင် 'คะ' (ခ /khá/) ကို သုံးပြီး၊ ဖြေကြားရာတွင် 'ค่ะ' (ခါ့ /khâ/) ကို သုံးပါသည်။",
  },
  {
    id: 9,
    promptLabel: 'အငြင်းဝါကျ (မ...ဘူး) ဖွဲ့စည်းရာတွင် ကိရိယာရှေ့၌ မည်သည့်စကားလုံး ထည့်ရသနည်း?',
    thaiWord: 'မ...ဘူး (အငြင်းစကားလုံး)',
    audioTarget: 'ไม่',
    options: ['ไหม', 'อะไร', 'ไม่', 'ได้'],
    correctAnswerIndex: 2,
    phonetic: '/mây/',
    myanmarReading: 'မိုက်',
    explanation: "ကိရိယာရှေ့တွင် 'ไม่' (မိုက် /mây/ = မ...ဘူး) ထည့်သွင်း၍ အငြင်းဝါကျ ဖွဲ့စည်းပါသည်။",
  },
  {
    id: 10,
    promptLabel: "'ဘာလဲ' (What) ဟု မေးခွန်းမေးရာတွင် ထည့်သွင်းရသော စကားလုံးမှာ?",
    thaiWord: 'ဘာလဲ (What)',
    audioTarget: 'อะไร',
    options: ['อะไร', 'ไหม', 'ใคร', 'ไหน'],
    correctAnswerIndex: 0,
    phonetic: '/ʔa-ray/',
    myanmarReading: 'အာရိုင်',
    explanation: "'อะไร' (အာရိုင် /ʔa-ray/) ဆိုသည်မှာ 'ဘာလဲ / What' ဖြစ်ပါသည်။",
  },
  {
    id: 11,
    promptLabel: "'ကျွန်တော် ဗီဇာ မရဘူး' ဟူသော စကားကို ထိုင်းလို မည်သို့ပြောမည်နည်း?",
    thaiWord: 'ကျွန်တော် ဗီဇာ မရဘူး',
    audioTarget: 'ผมไม่ได้วีซ่า',
    options: ['ผมได้วีซ่า', 'ผมไม่ได้วีซ่า', 'ผมเอาวีซ่า', 'ผมมีวีซ่า'],
    correctAnswerIndex: 1,
    phonetic: '/phǒm mây dâay wii-sâa/',
    myanmarReading: 'ဖုန် မိုက်ဒိုက် ဝီဆာ',
    explanation: 'ผม (ကျွန်တော်) + ไม่ได้ (မရဘူး) + วีซ่า (ဗီဇာ) = ผมไม่ได้วีซ่า ဖြစ်ပါသည်။',
  },
  {
    id: 12,
    promptLabel: 'အောက်ပါ ထိုင်းအစားအစာ၏ မြန်မာအမည်မှာ အဘယ်နည်း?',
    thaiWord: 'ส้มตำ',
    audioTarget: 'ส้มตำ',
    options: ['ခေါက်ဆွဲကြော်', 'သင်္ဘောသီးထောင်း', 'ကြက်ကြော်', 'ထမင်းကြော်'],
    correctAnswerIndex: 1,
    phonetic: '/sôm-tam/',
    myanmarReading: 'စုံ(မ်)တမ်(မ်)',
    explanation: "'ส้มตำ' (စုံတမ် /sôm-tam/) ဆိုသည်မှာ ထိုင်းနာမည်ကြီး 'သင်္ဘောသီးထောင်း' ဖြစ်ပါသည်။",
  },
  {
    id: 13,
    promptLabel: "'ขอบคุณ' နှင့် 'ขอโทษ' တို့၏ မြန်မာအဓိပ္ပာယ် အစဉ်လိုက်မှာ?",
    thaiWord: 'ขอบคุณ - ขอโทษ',
    audioTarget: 'ขอบคุณ ขอโทษ',
    options: [
      'တောင်းပန်ပါတယ် နှင့် ကျေးဇူးတင်ပါတယ်',
      'ကျေးဇူးတင်ပါတယ် နှင့် တောင်းပန်ပါတယ်',
      'မင်္ဂလာပါ နှင့် နှုတ်ဆက်ပါတယ်',
      'ဟုတ်ကဲ့ နှင့် မဟုတ်ပါ',
    ],
    correctAnswerIndex: 1,
    phonetic: '/khɔ̀ɔp-khun - khɔ̌ɔ-thôot/',
    myanmarReading: 'ခော့(ပ်)ခွန် - ခေါ်ထိုးတ်',
    explanation: 'ขอบคุณ = ကျေးဇူးတင်ပါတယ်၊ ขอโทษ = တောင်းပန်ပါတယ် ဖြစ်ပါသည်။',
  },
  {
    id: 14,
    promptLabel: "'သူ ဒီဟာကို ကြိုက်တယ်' ဟူသော စာကြောင်း၏ ထိုင်းဝါကျမှာ အဘယ်နည်း?",
    thaiWord: 'သူ ဒီဟာကို ကြိုက်တယ်',
    audioTarget: 'เขาชอบอันนี้',
    options: ['เขาไม่ชอบอันนี้', 'เขาชอบอันนี้', 'เขาเอาอันนี้', 'เขามีอันนี้'],
    correctAnswerIndex: 1,
    phonetic: '/kháo chɔ̂ɔp ʔan-níi/',
    myanmarReading: 'ခေါဝ် ချော့ပ် အန်နီး',
    explanation: 'เขา (သူ) + ชอบ (ကြိုက်သည်) + อันนี้ (ဒီတစ်ခု/ဒီဟာ) ဖြစ်ပါသည်။',
  },
  {
    id: 15,
    promptLabel: "'สบายดีไหม' ဟု မေးလာပါက 'နေကောင်းပါတယ်' ဟု မည်သို့ပြန်ဖြေမည်နည်း?",
    thaiWord: 'နေကောင်းပါတယ် (ဖြေကြားချက်)',
    audioTarget: 'สบายดีครับ',
    options: ['สบายดีครับ / ค่ะ', 'ไม่สบายครับ / ค่ะ', 'ขอบคุณครับ / ค่ะ', 'ไม่เป็นไรครับ / ค่ะ'],
    correctAnswerIndex: 0,
    phonetic: '/sà-baay-dii khráp / khâ/',
    myanmarReading: 'စဘိုင်းဒီး ခရတ် / ခါ့',
    explanation: 'สบายดี (နေကောင်းသည်) + ครับ/ค่ะ (ခင်ဗျာ/ရှင်) ဖြစ်ပါသည်။',
  },
  {
    id: 16,
    promptLabel: 'အောက်ပါ နာမ်စား၏ မြန်မာအဓိပ္ပာယ်မှာ အဘယ်နည်း?',
    thaiWord: 'เรา',
    audioTarget: 'เรา',
    options: ['သူ / သူမ', 'ကျွန်ုပ်တို့ / ငါတို့ / တို့', 'သင် / မင်း', '၎င်းတို့ / သူတို့'],
    correctAnswerIndex: 1,
    phonetic: '/raw/',
    myanmarReading: 'ရောဝ်(ဝ်)',
    explanation: "'เรา' (ရောဝ် /raw/) သည် 'ကျွန်ုပ်တို့ / ငါတို့ / တို့ (We)' ဖြစ်ပါသည်။",
  },
  {
    id: 17,
    promptLabel: "'အင်္ကျီ' ကို ထိုင်းဘာသာဖြင့် မည်သို့ခေါ်သနည်း?",
    thaiWord: 'အင်္ကျီ (Shirt)',
    audioTarget: 'เสื้อ',
    options: ['กางเกง', 'เสื้อ', 'นาฬิกา', 'น้ำ'],
    correctAnswerIndex: 1,
    phonetic: '/sʉ̂a/',
    myanmarReading: 'စွတ်အာ',
    explanation: "အင်္ကျီ ကို 'เสื้อ' (စွတ်အာ /sʉ̂a/) ဟု ခေါ်ပြီး၊ 'กางเกง' မှာ ဘောင်းဘီ ဖြစ်ပါသည်။",
  },
  {
    id: 18,
    promptLabel: "'သွားလိုက်ပါဦးမယ်နော်' ဟု ယဉ်ကျေးစွာ နှုတ်ဆက်လိုလျှင် မည်သို့ပြောရမည်နည်း?",
    thaiWord: 'သွားလိုက်ပါဦးမယ်နော်',
    audioTarget: 'ไปก่อนนะครับ',
    options: ['ไปก่อนนะครับ / นะคะ', 'ไม่ไปครับ / ค่ะ', 'ไปไหนครับ / คะ', 'เจอกันครับ / ค่ะ'],
    correctAnswerIndex: 0,
    phonetic: '/pay kɔ̀ɔn ná khráp / ná khâ/',
    myanmarReading: 'ပိုင်ဂွန်း န ခရတ် / န ခါ့',
    explanation: "'ไปก่อนนะครับ / นะคะ' (ပိုင်ဂွန်း န ခရတ်/ခါ့) ဆိုသည်မှာ 'သွားလိုက်ပါဦးမယ်နော်' ဖြစ်ပါသည်။",
  },
  {
    id: 19,
    promptLabel: "'မင်းပြောတာ အရမ်းမြန်တယ်' ဟူသော ဝါကျမှာ အဘယ်နည်း?",
    thaiWord: 'မင်းပြောတာ အရမ်းမြန်တယ်',
    audioTarget: 'คุณพูดเร็วมาก',
    options: ['คุณพูดช้ามาก', 'คุณพูดเร็วมาก', 'คุณฟังไม่ทัน', 'คุณไม่เข้าใจ'],
    correctAnswerIndex: 1,
    phonetic: '/khun phûut rew mâak/',
    myanmarReading: 'ခွန် ဖူးတ် ရေဝ် မာ့က်',
    explanation: 'คุณ (မင်း/သင်) + พูด (ပြောသည်) + เร็วมาก (အရမ်းမြန်တယ်) ဖြစ်ပါသည်။',
  },
  {
    id: 20,
    promptLabel: "ဝါကျအဆုံးတွင် ဟုတ်/မဟုတ် မေးလိုပါက '...လား' အဓိပ္ပာယ်ဖြင့် မည်သည့်စကားလုံး ထည့်ရသနည်း?",
    thaiWord: '...လား? (မေးခွန်းစကားလုံး)',
    audioTarget: 'ไหม',
    options: ['อะไร', 'ไหม', 'หรือ', 'นะ'],
    correctAnswerIndex: 1,
    phonetic: '/máy/',
    myanmarReading: 'မိုင်း',
    explanation: "ဝါကျအဆုံးတွင် 'ไหม' (မိုင်း /máy/) ကို ထည့်သွင်း၍ '...လား' မေးခွန်း ဖွဲ့စည်းပါသည်။",
  },
];

export interface QuizViewProps {
  speechRate?: number;
}

export const QuizView: React.FC<QuizViewProps> = ({ speechRate = 0.85 }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [srFeedback, setSrFeedback] = useState<string>('');

  const questions = ACTIVE_RECALL_QUIZ_QUESTIONS;
  const currentQuestion = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  const playAudio = useCallback(
    (textToSpeak: string) => {
      speakThai(textToSpeak, speechRate);
    },
    [speechRate]
  );

  const handleSelectOption = useCallback(
    (idx: number) => {
      if (selectedAnswer !== null) return;
      setSelectedAnswer(idx);

      const isCorrect = idx === currentQuestion.correctAnswerIndex;
      if (isCorrect) {
        setScore((prev) => prev + 1);
        setSrFeedback(`အဖြေ မှန်ကန်ပါသည်! ${currentQuestion.options[idx]}`);
      } else {
        const correctChoice = currentQuestion.options[currentQuestion.correctAnswerIndex];
        setSrFeedback(`အဖြေ မှားယွင်းပါသည်။ မှန်ကန်သောအဖြေမှာ ${correctChoice} ဖြစ်ပါသည်။`);
      }
    },
    [selectedAnswer, currentQuestion]
  );

  const handleNext = useCallback(() => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setSrFeedback(`မေးခွန်း ${currentIndex + 2} သို့ ရောက်ရှိပါပြီ။`);
    } else {
      setIsFinished(true);
      setSrFeedback(`ဉာဏ်စမ်း စာမေးပွဲ ပြီးဆုံးပါပြီ။ သင်ရရှိသော အမှတ်မှာ ${score} / ${questions.length} ဖြစ်ပါသည်။`);
    }
  }, [currentIndex, questions.length, score]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsFinished(false);
    setSrFeedback('ဉာဏ်စမ်း စာမေးပွဲ ပြန်လည်စတင်ပါပြီ။');
  }, []);

  // Keyboard Shortcuts (WCAG 2.1 AA)
  // 1, 2, 3, 4 or a, b, c, d to pick choices; Space or Enter to proceed to next question
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside input / textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (isFinished) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleRestart();
        }
        return;
      }

      if (selectedAnswer === null) {
        if (e.key === '1' || e.key.toLowerCase() === 'a') {
          e.preventDefault();
          handleSelectOption(0);
        } else if (e.key === '2' || e.key.toLowerCase() === 'b') {
          e.preventDefault();
          handleSelectOption(1);
        } else if (e.key === '3' || e.key.toLowerCase() === 'c') {
          e.preventDefault();
          handleSelectOption(2);
        } else if (e.key === '4' || e.key.toLowerCase() === 'd') {
          e.preventDefault();
          handleSelectOption(3);
        }
      } else {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedAnswer, isFinished, handleSelectOption, handleNext, handleRestart]);

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-3xl p-5 sm:p-8 shadow-sm border border-purple-100 dark:border-gray-800 transition-colors">
      {/* Screen reader live announcement */}
      <div className="sr-only" aria-live="assertive">
        {srFeedback}
      </div>

      {/* Header */}
      <div className="flex justify-between items-center border-b border-purple-100 dark:border-gray-800 pb-5 mb-6 gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-[#64137c] dark:text-purple-300 flex items-center justify-center font-bold text-sm shadow-xs">
              ၅
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap">
              <span>ဉာဏ်စမ်း စာမေးပွဲ</span>
              <span className="font-thai text-[#64137c] dark:text-purple-400 font-medium text-lg ml-1">
                (แบบทดสอบ)
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Active Recall နည်းလမ်းဖြင့် အသံထွက်နှင့် အဓိပ္ပာယ်ကို စစ်ဆေးလေ့ကျင့်ပါ
          </p>
        </div>

        <div className="px-3.5 sm:px-4 py-2 rounded-2xl bg-purple-50 dark:bg-gray-800 border border-purple-200 dark:border-gray-700 text-[#4c0d5f] dark:text-purple-300 text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 shadow-xs">
          <Trophy className="w-4 h-4 text-[#ffd200]" />
          <span>
            ရမှတ်: <span className="text-[#64137c] dark:text-purple-300 text-base">{score}</span> / {questions.length}
          </span>
        </div>
      </div>

      {!isFinished ? (
        <div>
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs font-semibold text-[#64137c] dark:text-purple-300 mb-2">
              <span>
                မေးခွန်း {currentIndex + 1} / {questions.length}
              </span>
              <span className="text-slate-400 dark:text-gray-500">တိုးတက်မှု {progressPercent}%</span>
            </div>
            <div className="w-full bg-purple-100/60 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-[#64137c] dark:bg-purple-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* 1. REMOVE PREMATURE SPOILERS IN UNANSWERED STATE:
              Only prominent Thai word as question prompt, no phonetics/reading/audio before answer */}
          <div className="text-center py-6">
            <span className="text-xs uppercase tracking-wider text-purple-600 dark:text-purple-400 font-semibold mb-2 block">
              {currentQuestion.promptLabel}
            </span>
            <h2
              className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-wide font-sans"
              lang="th"
            >
              {currentQuestion.thaiWord}
            </h2>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2 font-mono">
              [ကီးဘုတ်ဖြတ်လမ်း: 1, 2, 3, 4 သို့မဟုတ် A, B, C, D ဖြင့် ရွေးချယ်နိုင်ပါသည်]
            </p>
          </div>

          {/* 2. CLEAN, MINIMAL OPTIONS (NO SPOILERS IN CHOICES) */}
          <div
            role="radiogroup"
            aria-label="ရွေးချယ်စရာ အဖြေများ"
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {currentQuestion.options.map((optText, idx) => {
              const isSelected = selectedAnswer === idx;
              const isRevealed = selectedAnswer !== null;

              // Base unselected state
              let btnStyle =
                'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 hover:border-amber-400 hover:bg-amber-50/50 dark:hover:bg-gray-700/60';

              // Selected state: Warm Yellow (Amber) with dark text for perfect contrast
              if (isSelected) {
                btnStyle =
                  'bg-amber-400 dark:bg-amber-500 text-gray-950 border-amber-500 dark:border-amber-400 font-bold shadow-md ring-2 ring-amber-400/50 scale-[1.01]';
              } else if (isRevealed) {
                // Muted unselected options after an answer is chosen
                btnStyle =
                  'bg-gray-50 dark:bg-gray-900/60 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-800 opacity-60';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={isRevealed}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-2xl border-2 text-left text-base sm:text-lg font-medium transition-all duration-200 flex items-center justify-between min-h-[60px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${
                        isSelected
                          ? 'bg-black/15 text-gray-950 font-extrabold'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {['က', 'ခ', 'ဂ', 'ဃ'][idx]}
                    </span>
                    <span lang="my">{optText}</span>
                  </div>

                  {/* Selected check indicator in yellow theme */}
                  {isSelected && (
                    <span className="w-6 h-6 rounded-full bg-gray-950 text-amber-400 flex items-center justify-center text-xs font-bold shadow-xs">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 3. POST-ANSWER REVELATION (EDUCATIONAL FEEDBACK PANEL) */}
          {selectedAnswer !== null && (
            <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 animate-fadeIn space-y-3 shadow-xs">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
                    အသံထွက်
                  </span>
                  <span className="font-mono text-sm text-purple-900 dark:text-purple-200 font-bold">
                    {currentQuestion.phonetic}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400" lang="my">
                    ({currentQuestion.myanmarReading})
                  </span>
                </div>

                {/* Authentic Audio Button only appears AFTER answer is chosen */}
                <button
                  type="button"
                  onClick={() => playAudio(currentQuestion.audioTarget || currentQuestion.thaiWord)}
                  aria-label={`Listen to ${currentQuestion.thaiWord}`}
                  className="px-3 py-1.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm"
                >
                  <span>🔊</span>
                  <span>အသံထွက် နားထောင်မည်</span>
                </button>
              </div>

              {currentQuestion.explanation && (
                <p
                  className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed pt-2 border-t border-purple-200/50 dark:border-purple-800/30"
                  lang="my"
                >
                  💡 <span className="font-bold">ရှင်းလင်းချက်:</span> {currentQuestion.explanation}
                </p>
              )}
            </div>
          )}

          {/* Next Button */}
          {selectedAnswer !== null && (
            <div className="mt-6">
              <button
                type="button"
                onClick={handleNext}
                className="w-full bg-[#64137c] hover:bg-[#4c0d5f] text-white font-bold py-3.5 px-4 rounded-2xl transition-all shadow-md hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 text-sm"
              >
                <span>
                  {currentIndex + 1 < questions.length
                    ? 'နောက်တစ်ပုဒ်သို့ ဆက်သွားမည် (Space / Enter)'
                    : 'ရလဒ် ကြည့်ရှုမည် (Space / Enter)'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Result Screen */
        <div className="text-center py-10">
          <div className="w-20 h-20 bg-purple-100 dark:bg-purple-950/60 text-[#64137c] dark:text-purple-300 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-inner">
            <Trophy className="w-10 h-10 text-[#ffd200]" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            ဂုဏ်ယူပါတယ်! စာမေးပွဲပြီးမြောက်ပါပြီ
          </h3>
          <p className="text-sm text-slate-600 dark:text-gray-300 mb-2">
            သင် အမှတ်ပေါင်း{' '}
            <span className="font-bold text-[#64137c] dark:text-purple-400 text-xl">
              {score} / {questions.length}
            </span>{' '}
            ရရှိခဲ့ပါသည်။
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            {score >= 18
              ? 'ထူးချွန်စွာ ဖြေဆိုနိုင်ခဲ့ပါသည်! အခန်း (၁) သင်ခန်းစာများကို ကောင်းစွာ နားလည်တတ်မြောက်ပါပြီ။'
              : score >= 12
              ? 'အတော်အတန် တတ်မြောက်ပါသည်! မှားယွင်းခဲ့သော မေးခွန်းများကို ပြန်လည်လေ့ကျင့်ကြည့်ပါ။'
              : 'ထပ်မံလေ့လာဖို့ လိုအပ်ပါသေးသည်။ စာမျက်နှာများကို ပြန်လည်ဖတ်ရှုပြီး ထပ်မံဖြေဆိုကြည့်ပါ။'}
          </p>

          <button
            type="button"
            onClick={handleRestart}
            className="px-6 py-3.5 rounded-2xl bg-[#64137c] hover:bg-[#4c0d5f] text-white font-semibold text-sm transition active:scale-95 shadow-md inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>စာမေးပွဲ ပြန်လည်ဖြေဆိုမည် (Space / Enter)</span>
          </button>
        </div>
      )}
    </div>
  );
};
