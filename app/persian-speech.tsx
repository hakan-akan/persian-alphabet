'use client';

import { useEffect, useState } from 'react';
import { Gauge, Mic2 } from 'lucide-react';

const voiceKey = 'dabestan-persian-voice';
const rateKey = 'dabestan-speech-rate';

export const persianLetterNames = [
  'الف', 'بِ', 'پِ', 'تِ', 'ثِ', 'جیم', 'چِ', 'حِ', 'خِ', 'دال', 'ذال', 'رِ', 'زِ', 'ژِ',
  'سین', 'شین', 'صاد', 'ضاد', 'طا', 'ظا', 'عین', 'غین', 'فِ', 'قاف', 'کاف', 'گاف',
  'لام', 'میم', 'نون', 'واو', 'هِ', 'یِ',
];

const voiceScore = (voice: SpeechSynthesisVoice) => {
  const name = voice.name.toLowerCase();
  let score = voice.lang.toLowerCase() === 'fa-ir' ? 20 : 10;
  if (/natural|neural|premium|enhanced|google|microsoft|apple|siri/.test(name)) score += 10;
  if (!voice.localService) score += 4;
  return score;
};

export const getPersianVoices = () => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  return window.speechSynthesis.getVoices()
    .filter((voice) => voice.lang.toLowerCase().startsWith('fa') || /persian|farsi/.test(voice.name.toLowerCase()))
    .sort((a, b) => voiceScore(b) - voiceScore(a));
};

const waitForPersianVoices = async () => {
  const existing = getPersianVoices();
  if (existing.length) return existing;
  if (!('speechSynthesis' in window)) return [];

  return new Promise<SpeechSynthesisVoice[]>((resolve) => {
    const done = () => resolve(getPersianVoices());
    window.speechSynthesis.addEventListener('voiceschanged', done, { once: true });
    window.setTimeout(done, 500);
  });
};

export const speakPersian = async (text: string, fallbackIndex?: number) => {
  const voices = await waitForPersianVoices();
  if (voices.length) {
    const preferred = localStorage.getItem(voiceKey);
    const voice = voices.find((item) => item.voiceURI === preferred) || voices[0];
    const rate = Number(localStorage.getItem(rateKey) || '0.88');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = voice.lang || 'fa-IR';
    utterance.rate = Number.isFinite(rate) ? rate : 0.88;
    utterance.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    return;
  }

  if (fallbackIndex !== undefined) {
    const number = String(fallbackIndex + 1).padStart(2, '0');
    const audio = new Audio(`/audio/${number}.wav`);
    audio.preload = 'auto';
    await audio.play();
  }
};

export function SpeechPreferences() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voice, setVoice] = useState('');
  const [rate, setRate] = useState('0.88');

  useEffect(() => {
    const refresh = () => {
      const available = getPersianVoices();
      setVoices(available);
      const saved = localStorage.getItem(voiceKey);
      setVoice(saved && available.some((item) => item.voiceURI === saved) ? saved : available[0]?.voiceURI || '');
      setRate(localStorage.getItem(rateKey) || '0.88');
    };
    refresh();
    window.speechSynthesis?.addEventListener('voiceschanged', refresh);
    return () => window.speechSynthesis?.removeEventListener('voiceschanged', refresh);
  }, []);

  const changeVoice = (value: string) => {
    setVoice(value);
    localStorage.setItem(voiceKey, value);
  };

  const changeRate = (value: string) => {
    setRate(value);
    localStorage.setItem(rateKey, value);
  };

  return (
    <div className="mt-3 flex flex-wrap items-center gap-3 rounded-2xl border border-[#e3ded2] bg-white px-4 py-3 text-xs">
      <span className="flex items-center gap-2 font-bold text-[#526159]"><Mic2 className="size-4 text-[#a6631d]" /> Persian voice</span>
      {voices.length ? (
        <select value={voice} onChange={(event) => changeVoice(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-[#ddd9ce] bg-[#fbfaf6] px-3 py-2 text-[#405048]" aria-label="Persian voice">
          {voices.map((item) => <option key={item.voiceURI} value={item.voiceURI}>{item.name}</option>)}
        </select>
      ) : (
        <span className="flex-1 text-[#7d857f]">Offline fallback voice</span>
      )}
      <label className="flex items-center gap-2 font-semibold text-[#68756d]"><Gauge className="size-4" />
        <select value={rate} onChange={(event) => changeRate(event.target.value)} className="rounded-lg border border-[#ddd9ce] bg-[#fbfaf6] px-2 py-2" aria-label="Speech speed">
          <option value="0.72">Slow</option>
          <option value="0.88">Natural</option>
          <option value="1">Fast</option>
        </select>
      </label>
    </div>
  );
}
