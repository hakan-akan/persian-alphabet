'use client';

import { useState } from 'react';
import { Check, ChevronRight, Headphones, Lightbulb, Shapes, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { alphabet } from './alphabet';
import { letterForms } from './examples';

type Family = {
  title: string;
  letters: number[];
  cue: string;
  dotCues: string[];
};

const families: Family[] = [
  { title: 'The bowl family', letters: [1, 2, 3, 4], cue: 'The body stays almost the same. Read the dots before the shape.', dotCues: ['one dot below', 'three dots below', 'two dots above', 'three dots above'] },
  { title: 'The curved family', letters: [5, 6, 7, 8], cue: 'All four share a curved bowl and tail; the dots identify the sound.', dotCues: ['one dot below', 'three dots below', 'no dots', 'one dot above'] },
  { title: 'The dâl family', letters: [9, 10], cue: 'These letters never connect to the following letter.', dotCues: ['no dots', 'one dot above'] },
  { title: 'The re family', letters: [11, 12, 13], cue: 'A short descending stroke changes through its dots.', dotCues: ['no dots', 'one dot above', 'three dots above'] },
  { title: 'The wave family', letters: [14, 15], cue: 'Notice the three small teeth; Shin adds three dots above.', dotCues: ['no dots', 'three dots above'] },
  { title: 'The sâd family', letters: [16, 17], cue: 'A wide bowl distinguishes these from Sin and Shin.', dotCues: ['no dots', 'one dot above'] },
  { title: 'The tâ family', letters: [18, 19], cue: 'Both have a tall upright stroke; Zâ adds one dot.', dotCues: ['no dots', 'one dot above'] },
  { title: 'The eyn family', letters: [20, 21], cue: 'Their shapes change noticeably when joined in the middle.', dotCues: ['no dots', 'one dot above'] },
  { title: 'The fe family', letters: [22, 23], cue: 'Watch both the dots and the final bowl shape.', dotCues: ['one dot above', 'two dots above'] },
  { title: 'The kâf family', letters: [24, 25], cue: 'Gâf is built from Kâf by adding an extra bar.', dotCues: ['one upper mark', 'two upper marks'] },
];

export function FamilyLessons({ onOpenLetter }: { onOpenLetter: (index: number) => void }) {
  const [familyIndex, setFamilyIndex] = useState(0);
  const [question, setQuestion] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const family = families[familyIndex];
  const targetIndex = family.letters[question % family.letters.length];
  const target = alphabet[targetIndex];

  const chooseFamily = (index: number) => {
    setFamilyIndex(index);
    setQuestion(0);
    setAnswer(null);
    setScore(0);
  };

  const play = (index: number) => {
    const number = String(index + 1).padStart(2, '0');
    const audio = new Audio(`/audio/${number}.wav`);
    audio.preload = 'auto';
    void audio.play();
  };

  const chooseAnswer = (index: number) => {
    if (answer !== null) return;
    setAnswer(index);
    if (index === targetIndex) setScore((value) => value + 1);
  };

  const next = () => {
    setQuestion((value) => value + 1);
    setAnswer(null);
  };

  return (
    <article className="overflow-hidden rounded-[32px] border border-[#d8d5c9] bg-[#fffdf8] shadow-[0_18px_55px_rgba(42,61,51,.08)]">
      <div className="border-b border-[#e2ded3] bg-[#173e33] px-6 py-7 text-white sm:px-9">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-[#a9c8b9]"><Shapes className="size-4" /> Look-alike letters</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-2xl font-bold">Learn the family, then notice the difference</h2>
          <span className="rounded-full bg-white/10 px-3 py-2 text-xs font-bold">Family {familyIndex + 1} of {families.length}</span>
        </div>
      </div>

      <div className="p-6 sm:p-9">
        <div className="flex gap-2 overflow-x-auto pb-2" aria-label="Letter families">
          {families.map((item, index) => (
            <button
              key={item.title}
              onClick={() => chooseFamily(index)}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${index === familyIndex ? 'border-[#173e33] bg-[#173e33] text-white' : 'border-[#ddd9ce] bg-white text-[#69756d] hover:border-[#d49a50]'}`}
            >
              <span className="font-persian mr-2 text-base" dir="rtl">{item.letters.map((letter) => alphabet[letter].letter).join(' ')}</span>{item.title}
            </button>
          ))}
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-2xl bg-[#f7f2e8] p-4 text-sm leading-6 text-[#655947]">
          <Lightbulb className="mt-0.5 size-5 shrink-0 text-[#bd7929]" />
          <p><strong>{family.title}:</strong> {family.cue}</p>
        </div>

        <div className={`mt-5 grid gap-3 ${family.letters.length === 2 ? 'sm:grid-cols-2' : family.letters.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-4'}`}>
          {family.letters.map((index, itemIndex) => {
            const item = alphabet[index];
            const forms = letterForms(item.letter, item.connectsLeft);
            return (
              <div key={item.letter} className="rounded-3xl border border-[#dedbd0] bg-white p-4 text-center">
                <div className="font-persian text-7xl leading-none text-[#173e33]">{item.letter}</div>
                <p className="font-display mt-3 text-lg font-bold">{item.name}</p>
                <p className="mt-1 text-xs font-semibold text-[#a6631d]">{family.dotCues[itemIndex]}</p>
                <p className="mt-2 min-h-10 text-xs leading-5 text-[#748078]">{item.sound}</p>
                <div className="mt-3 flex items-center justify-center gap-1 rounded-xl bg-[#f4f2eb] px-2 py-2" dir="ltr">
                  {forms.map((form) => <span key={form.label} className="font-persian text-xl text-[#40564b]" title={form.label}>{form.glyph}</span>)}
                </div>
                <div className="mt-3 flex justify-center gap-2">
                  <Button variant="outline" size="icon" className="rounded-full" onClick={() => play(index)} aria-label={`Hear ${item.name}`}><Volume2 className="size-4" /></Button>
                  <Button variant="ghost" className="rounded-full px-3 text-xs" onClick={() => onOpenLetter(index)}>Open lesson</Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-7 rounded-[28px] border border-[#dedbd0] bg-[#fbfaf6] p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.15em] text-[#a56c28]">Family check</p>
              <h3 className="font-display mt-1 text-xl font-bold">Which letter is {target.name}?</h3>
              <p className="mt-1 text-sm text-[#778079]">Listen if you need a hint, then compare the dots.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="rounded-full" onClick={() => play(targetIndex)} aria-label={`Hear ${target.name}`}><Headphones className="size-4" /></Button>
              <span className="rounded-full bg-[#edf3ef] px-3 py-2 text-xs font-bold text-[#496257]">Score {score} / {question + (answer !== null ? 1 : 0)}</span>
            </div>
          </div>

          <div className={`mt-5 grid gap-3 ${family.letters.length === 2 ? 'grid-cols-2' : family.letters.length === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
            {family.letters.map((index) => {
              const correct = index === targetIndex;
              const chosen = answer === index;
              return (
                <button
                  key={alphabet[index].letter}
                  onClick={() => chooseAnswer(index)}
                  className={`font-persian relative min-h-24 rounded-2xl border-2 text-5xl transition ${answer !== null && correct ? 'border-[#3f8066] bg-[#e9f5ee] text-[#245c48]' : answer !== null && chosen ? 'border-[#c96a5e] bg-[#fff0ed] text-[#9e4037]' : 'border-[#dedbd0] bg-white text-[#31473d] hover:-translate-y-1 hover:border-[#d89a4b]'}`}
                >
                  {alphabet[index].letter}
                  {answer !== null && correct && <Check className="absolute right-2 top-2 size-4" />}
                </button>
              );
            })}
          </div>

          {answer !== null && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[#40564b]">{answer === targetIndex ? `Correct — ${target.name} is ${target.letter}.` : `Look again at the dots: ${target.name} is ${target.letter}.`}</p>
              <Button onClick={next} className="rounded-full bg-[#173e33] text-white hover:bg-[#245849]">Next in family <ChevronRight /></Button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
