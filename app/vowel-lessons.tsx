'use client';

import { useState } from 'react';
import { Check, ChevronRight, Eye, EyeOff, Headphones, Lightbulb, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { speakPersian } from './persian-speech';

type VowelExample = {
  plain: string;
  marked: string;
  transliteration: string;
  meaning: string;
  picture: string;
  answer: 'a' | 'e' | 'o';
};

const shortVowels = [
  { latin: 'a', mark: 'َ', anchored: 'بَ', position: 'above the letter', name: 'zabar / fathe', example: 'مَن', transliteration: 'man', cue: 'like a in “cat”' },
  { latin: 'e', mark: 'ِ', anchored: 'بِ', position: 'below the letter', name: 'zir / kasre', example: 'پِدَر', transliteration: 'pedar', cue: 'like e in “bed”' },
  { latin: 'o', mark: 'ُ', anchored: 'بُ', position: 'above the letter', name: 'pish / zamme', example: 'گُل', transliteration: 'gol', cue: 'like o in “more,” but shorter' },
] as const;

const longVowels = [
  { latin: 'â', letter: 'ا / آ', example: 'آب', transliteration: 'âb', meaning: 'water' },
  { latin: 'i', letter: 'ی', example: 'سیب', transliteration: 'sib', meaning: 'apple' },
  { latin: 'u', letter: 'و', example: 'روز', transliteration: 'ruz', meaning: 'day' },
] as const;

const examples: VowelExample[] = [
  { plain: 'من', marked: 'مَن', transliteration: 'man', meaning: 'I / me', picture: '🙋', answer: 'a' },
  { plain: 'پدر', marked: 'پِدَر', transliteration: 'pedar', meaning: 'father', picture: '👨', answer: 'e' },
  { plain: 'گل', marked: 'گُل', transliteration: 'gol', meaning: 'flower', picture: '🌷', answer: 'o' },
  { plain: 'کتاب', marked: 'کِتاب', transliteration: 'ketâb', meaning: 'book', picture: '📚', answer: 'e' },
  { plain: 'درخت', marked: 'دِرَخت', transliteration: 'derakht', meaning: 'tree', picture: '🌳', answer: 'e' },
  { plain: 'لباس', marked: 'لِباس', transliteration: 'lebâs', meaning: 'clothes', picture: '👕', answer: 'e' },
];

const vowelChoices = [
  { value: 'a', mark: 'بَ', label: 'a · above' },
  { value: 'e', mark: 'بِ', label: 'e · below' },
  { value: 'o', mark: 'بُ', label: 'o · above' },
] as const;

function ColoredTransliteration({ text }: { text: string }) {
  return (
    <span aria-label={text}>
      {Array.from(text).map((character, index) => (
        <span key={`${character}-${index}`} className={/[aeiouâ]/i.test(character) ? 'font-black text-[#c46d20]' : 'text-[#315044]'}>{character}</span>
      ))}
    </span>
  );
}

export function VowelLessons() {
  const [showMarks, setShowMarks] = useState(false);
  const [question, setQuestion] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const current = examples[question % examples.length];

  const chooseAnswer = (value: string) => {
    if (answer !== null) return;
    setAnswer(value);
    if (value === current.answer) setScore((previous) => previous + 1);
  };

  const next = () => {
    setQuestion((previous) => previous + 1);
    setAnswer(null);
  };

  return (
    <article className="overflow-hidden rounded-[32px] border border-[#d8d5c9] bg-[#fffdf8] shadow-[0_18px_55px_rgba(42,61,51,.08)]">
      <div className="border-b border-[#e2ded3] bg-[#173e33] px-6 py-7 text-white sm:px-9">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-[#a9c8b9]"><Eye className="size-4" /> Written and hidden vowels</p>
        <h2 className="font-display mt-2 text-2xl font-bold">Learn what Persian leaves out</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#c7d8d0]">Persian has six main vowel sounds. The three long vowels are normally visible; the three short vowels are usually understood from the word and its context.</p>
      </div>

      <div className="space-y-7 p-6 sm:p-9">
        <section>
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.15em] text-[#a56c28]">Usually hidden</p>
              <h3 className="font-display mt-1 text-xl font-bold">The three short vowels</h3>
            </div>
            <span className="rounded-full bg-[#f7e4bd] px-3 py-2 text-xs font-bold text-[#76501b]">a · e · o</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {shortVowels.map((vowel) => (
              <button key={vowel.latin} onClick={() => void speakPersian(vowel.example)} className="rounded-3xl border border-[#dfdbcf] bg-white p-5 text-left transition hover:-translate-y-1 hover:border-[#d69a4e] hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div className="font-persian text-5xl font-bold text-[#173e33]" dir="rtl">{vowel.anchored}</div>
                  <Volume2 className="size-4 text-[#9a6424]" />
                </div>
                <p className="mt-3 text-sm font-bold text-[#29493d]">{vowel.latin} · {vowel.name}</p>
                <p className="mt-1 text-xs font-semibold text-[#a6631d]">The mark sits {vowel.position}</p>
                <p className="mt-1 text-xs text-[#7b857e]">{vowel.cue}</p>
                <div className="mt-4 rounded-xl bg-[#f7f2e8] px-3 py-2 text-center">
                  <span className="font-persian text-2xl font-bold text-[#173e33]" dir="rtl">{vowel.example}</span>
                  <span className="ml-3 text-xs font-bold text-[#a6631d]">{vowel.transliteration}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[.15em] text-[#4c7462]">Normally visible</p>
            <h3 className="font-display mt-1 text-xl font-bold">The three long vowels</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {longVowels.map((vowel) => (
              <button key={vowel.latin} onClick={() => void speakPersian(vowel.example)} className="flex items-center gap-4 rounded-2xl border border-[#dce3de] bg-[#edf3ef] p-4 text-left transition hover:bg-[#e2eee7]">
                <span className="font-persian grid size-14 shrink-0 place-items-center rounded-xl bg-white text-3xl font-bold text-[#173e33]" dir="rtl">{vowel.letter}</span>
                <span>
                  <span className="block text-sm font-bold text-[#29493d]">{vowel.latin} · {vowel.transliteration}</span>
                  <span className="font-persian mt-1 block text-xl font-bold text-[#173e33]" dir="rtl">{vowel.example}</span>
                  <span className="block text-xs text-[#748078]">{vowel.meaning}</span>
                </span>
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs leading-5 text-[#737d76]">و and ی can also be the consonants <strong>v</strong> and <strong>y</strong>. Listening and recognizing the whole word will tell you which job they are doing.</p>
        </section>

        <section className="rounded-[28px] border border-[#dedbd0] bg-[#fbfaf6] p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.15em] text-[#a56c28]">Reveal the hidden vowels</p>
              <h3 className="font-display mt-1 text-xl font-bold">Compare everyday writing with learner writing</h3>
            </div>
            <Button variant="outline" className="rounded-full" onClick={() => setShowMarks((value) => !value)}>
              {showMarks ? <EyeOff /> : <Eye />} {showMarks ? 'Hide vowel marks' : 'Show vowel marks'}
            </Button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {examples.map((example) => (
              <button key={example.plain} onClick={() => void speakPersian(example.marked)} className="rounded-2xl border border-[#e2ded3] bg-white p-4 text-center transition hover:border-[#d69a4e]">
                <span className="text-4xl" role="img" aria-label={example.meaning}>{example.picture}</span>
                <p className="font-persian mt-2 text-3xl font-bold text-[#173e33]" dir="rtl">{showMarks ? example.marked : example.plain}</p>
                <p className="mt-2 text-sm font-bold"><ColoredTransliteration text={example.transliteration} /></p>
                <p className="mt-1 text-xs text-[#7b857e]">{example.meaning}</p>
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-start gap-3 rounded-2xl bg-[#f7f2e8] p-4 text-sm leading-6 text-[#655947]">
            <Lightbulb className="mt-0.5 size-5 shrink-0 text-[#bd7929]" />
            <p>The orange letters in the Latin pronunciation are vowel sounds. When the Persian marks disappear, the pronunciation stays the same—you remember it as part of the word.</p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-[#e0d8ca] bg-[#fff7e8] p-5">
            <p className="text-xs font-bold uppercase tracking-[.15em] text-[#a56c28]">Same letters, different vowels</p>
            <div className="mt-4 flex items-center justify-center gap-5">
              <button onClick={() => void speakPersian('گُل')} className="text-center"><span className="font-persian block text-4xl font-bold text-[#173e33]">گُل</span><span className="text-xs font-bold text-[#a6631d]">gol · flower</span></button>
              <span className="text-[#b9ad9b]">/</span>
              <button onClick={() => void speakPersian('گِل')} className="text-center"><span className="font-persian block text-4xl font-bold text-[#173e33]">گِل</span><span className="text-xs font-bold text-[#a6631d]">gel · mud</span></button>
            </div>
            <p className="mt-4 text-xs leading-5 text-[#756a5c]">Both normally appear as گل. The surrounding sentence tells you which word is meant.</p>
          </div>
          <div className="rounded-3xl border border-[#d9e3dc] bg-[#eef5f0] p-5">
            <p className="text-xs font-bold uppercase tracking-[.15em] text-[#4c7462]">The hidden ezafe</p>
            <div className="mt-4 text-center">
              <button onClick={() => void speakPersian('کتابِ من')} className="font-persian text-4xl font-bold text-[#173e33]" dir="rtl">کتابِ من</button>
              <p className="mt-2 text-sm font-bold"><ColoredTransliteration text="ketâb-e man" /></p>
              <p className="mt-1 text-xs text-[#748078]">my book</p>
            </div>
            <p className="mt-4 text-xs leading-5 text-[#68766e]">The connecting <strong>-e</strong> is heard between words but is usually not written in ordinary text.</p>
          </div>
        </section>

        <section className="rounded-[28px] border border-[#dedbd0] bg-[#fbfaf6] p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.15em] text-[#a56c28]">Vowel check</p>
              <h3 className="font-display mt-1 text-xl font-bold">Which short vowel completes this word?</h3>
              <div className="mt-3 flex items-center gap-3">
                <span className="font-persian rounded-xl bg-white px-4 py-2 text-3xl font-bold text-[#173e33]" dir="rtl">{current.plain}</span>
                <span className="text-sm text-[#778079]">{current.picture} {current.meaning}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="rounded-full" onClick={() => void speakPersian(current.marked)} aria-label={`Hear ${current.marked}`}><Headphones /></Button>
              <span className="rounded-full bg-[#edf3ef] px-3 py-2 text-xs font-bold text-[#496257]">Score {score} / {question + (answer !== null ? 1 : 0)}</span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {vowelChoices.map((choice) => {
              const correct = choice.value === current.answer;
              const chosen = answer === choice.value;
              return (
                <button key={choice.value} onClick={() => chooseAnswer(choice.value)} className={`relative min-h-24 rounded-2xl border-2 transition ${answer !== null && correct ? 'border-[#3f8066] bg-[#e9f5ee] text-[#245c48]' : answer !== null && chosen ? 'border-[#c96a5e] bg-[#fff0ed] text-[#9e4037]' : 'border-[#dedbd0] bg-white text-[#31473d] hover:-translate-y-1 hover:border-[#d89a4b]'}`}>
                  <span className="font-persian block text-4xl font-bold">{choice.mark}</span>
                  <span className="mt-1 block text-xs font-bold uppercase">{choice.label}</span>
                  {answer !== null && correct && <Check className="absolute right-2 top-2 size-4" />}
                </button>
              );
            })}
          </div>

          {answer !== null && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[#40564b]">{answer === current.answer ? `Correct — ${current.marked} is ${current.transliteration}.` : `${current.marked} is ${current.transliteration}. Learn the vowel as part of the whole word.`}</p>
              <Button onClick={next} className="rounded-full bg-[#173e33] text-white hover:bg-[#245849]">Next word <ChevronRight /></Button>
            </div>
          )}
        </section>
      </div>
    </article>
  );
}
