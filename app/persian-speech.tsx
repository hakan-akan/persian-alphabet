'use client';

import { useEffect, useState } from 'react';
import { Gauge, Mic2 } from 'lucide-react';

const rateKey = 'dabestan-speech-rate';
const supportedRates = ['0.82', '1', '1.15'];
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
let activeAudio: HTMLAudioElement | null = null;

export const persianLetterNames = [
  'الف', 'بِ', 'پِ', 'تِ', 'ثِ', 'جیم', 'چِ', 'حِ', 'خِ', 'دال', 'ذال', 'رِ', 'زِ', 'ژِ',
  'سین', 'شین', 'صاد', 'ضاد', 'طا', 'ظا', 'عین', 'غین', 'فِ', 'قاف', 'کاف', 'گاف',
  'لام', 'میم', 'نون', 'واو', 'هِ', 'یِ',
];

const getPersianVoices = () => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  return window.speechSynthesis.getVoices()
    .filter((voice) => voice.lang.toLowerCase().startsWith('fa') || /persian|farsi/.test(voice.name.toLowerCase()));
};

const speechRate = () => {
  const saved = localStorage.getItem(rateKey) || '1';
  return supportedRates.includes(saved) ? saved : '1';
};

const bundledAudioPath = (text: string) => {
  const bytes = new TextEncoder().encode(text);
  const name = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${basePath}/audio/tts/${name}.mp3`;
};

export const speakPersian = async (text: string, fallbackIndex?: number) => {
  try {
    activeAudio?.pause();
    window.speechSynthesis?.cancel();
    const audio = new Audio(bundledAudioPath(text));
    audio.preload = 'auto';
    audio.playbackRate = Number(speechRate());
    activeAudio = audio;
    await audio.play();
    return;
  } catch {
    const voice = getPersianVoices()[0];
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      if (voice) utterance.voice = voice;
      utterance.lang = voice?.lang || 'fa-IR';
      utterance.rate = Number(speechRate());
      utterance.pitch = 1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      return;
    }
  }

  if (fallbackIndex !== undefined) {
    const number = String(fallbackIndex + 1).padStart(2, '0');
    const audio = new Audio(`${basePath}/audio/${number}.wav`);
    audio.preload = 'auto';
    await audio.play();
  }
};

export function SpeechPreferences() {
  const [rate, setRate] = useState('1');

  useEffect(() => {
    setRate(speechRate());
  }, []);

  const changeRate = (value: string) => {
    setRate(value);
    localStorage.setItem(rateKey, value);
  };

  return (
    <div className="mt-3 flex flex-wrap items-center gap-3 rounded-2xl border border-[#e3ded2] bg-white px-4 py-3 text-xs">
      <span className="flex items-center gap-2 font-bold text-[#526159]"><Mic2 className="size-4 text-[#a6631d]" /> Persian voice</span>
      <span className="flex-1 text-[#5f6e65]">Dilara · natural Persian recording</span>
      <label className="flex items-center gap-2 font-semibold text-[#68756d]"><Gauge className="size-4" />
        <select value={rate} onChange={(event) => changeRate(event.target.value)} className="rounded-lg border border-[#ddd9ce] bg-[#fbfaf6] px-2 py-2" aria-label="Speech speed">
          <option value="0.82">Slow</option>
          <option value="1">Natural</option>
          <option value="1.15">Fast</option>
        </select>
      </label>
    </div>
  );
}
