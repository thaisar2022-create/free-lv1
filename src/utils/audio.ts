/**
 * Audio Speech Synthesis and Sound Feedback Utility for Thai Language Learning
 */

let currentSpeakingText: string | null = null;
let speakingListeners: ((text: string | null) => void)[] = [];

export function subscribeSpeakingState(listener: (text: string | null) => void) {
  speakingListeners.push(listener);
  return () => {
    speakingListeners = speakingListeners.filter((l) => l !== listener);
  };
}

function notifySpeaking(text: string | null) {
  currentSpeakingText = text;
  speakingListeners.forEach((l) => l(text));
}

export function getCurrentSpeakingText(): string | null {
  return currentSpeakingText;
}

export function speakThai(text: string, rate = 0.85): void {
  if (typeof window === 'undefined') return;

  try {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'th-TH';
      utterance.rate = rate;

      // Find Thai voice if available
      const voices = window.speechSynthesis.getVoices();
      const thaiVoice = voices.find(
        (v) => v.lang.toLowerCase().includes('th') || v.name.toLowerCase().includes('thai')
      );
      if (thaiVoice) {
        utterance.voice = thaiVoice;
      }

      utterance.onstart = () => {
        notifySpeaking(text);
      };

      utterance.onend = () => {
        notifySpeaking(null);
      };

      utterance.onerror = () => {
        notifySpeaking(null);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      playToneFallback();
    }
  } catch (err) {
    console.warn('SpeechSynthesis error:', err);
    notifySpeaking(null);
    playToneFallback();
  }
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    notifySpeaking(null);
  }
}

/**
 * Fallback gentle tone generator using Web Audio API if TTS is blocked
 */
export function playToneFallback(frequency = 520, duration = 0.15) {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Ignore audio context autoplay restrictions
  }
}
