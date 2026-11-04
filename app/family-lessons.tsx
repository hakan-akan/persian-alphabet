'use client';

import { useState } from 'react';
import { Check, ChevronRight, Headphones, Lightbulb, Shapes, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { alphabet } from './alphabet';
import { letterForms, wordExamples } from './examples';
import { persianLetterNames, speakPersian } from './persian-speech';

type LessonMode = 'shape' | 'sound';
type ShapeFamily = { title: string; letters: number[]; cue: string; dotCues: string[] };
type SoundFamily = { title: string; sound: string; letters: number[]; cue: string; defaultIndex: number | null; spellingCues: string[] };

const shapeFamilies: ShapeFamily[] = [
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

const soundFamilies: SoundFamily[] = [
  { title: 'The “s” sound', sound: 's', letters: [14, 16, 4], defaultIndex: 14, cue: 'س is the usual Persian spelling. ص and ث mostly survive in words borrowed from Arabic.', spellingCues: ['usual Persian s', 'often Arabic-origin', 'often Arabic-origin'] },
  { title: 'The “z” sound', sound: 'z', letters: [12, 10, 17, 19], defaultIndex: 12, cue: 'ز is the usual Persian spelling. ذ، ض and ظ must be remembered with the words that contain them.', spellingCues: ['usual Persian z', 'often Arabic-origin', 'often Arabic-origin', 'often Arabic-origin'] },
  { title: 'The “t” sound', sound: 't', letters: [3, 18], defaultIndex: 3, cue: 'ت is the ordinary spelling; ط appears mainly in historically Arabic spellings.', spellingCues: ['usual Persian t', 'often Arabic-origin'] },
  { title: 'The “h” sound', sound: 'h', letters: [30, 7], defaultIndex: 30, cue: 'ه is the ordinary h. ح is retained in many words of Arabic origin, although both sound like h in Persian.', spellingCues: ['usual Persian h', 'often Arabic-origin'] },
  { title: 'The “gh” sound', sound: 'gh', letters: [21, 23], defaultIndex: null, cue: 'غ and ق are commonly pronounced alike in standard Iranian Persian, but spelling—and pronunciation in some varieties—remains distinct.', spellingCues: ['learn with the word', 'learn with the word'] },
];

export function FamilyLessons({ onOpenLetter }: { onOpenLetter: (index: number) => void }) {
  const [mode, setMode] = useState<LessonMode>('shape');
  const [familyIndex, setFamilyIndex] = useState(0);
  const [question, setQuestion] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const shapeFamily = shapeFamilies[familyIndex % shapeFamilies.length];
  const soundFamily = soundFamilies[familyIndex % soundFamilies.length];
  const letters = mode === 'shape' ? shapeFamily.letters : soundFamily.letters;
  const targetIndex = letters[question % letters.length];
  const target = alphabet[targetIndex];
  const targetExample = wordExamples[targetIndex][question % wordExamples[targetIndex].length];
  const maskedWord = targetExample.word.split(target.letter).join('ـ');
  const familyCount = mode === 'shape' ? shapeFamilies.length : soundFamilies.length;

  const resetPractice = () => { setQuestion(0); setAnswer(null); setScore(0); };
  const chooseMode = (nextMode: LessonMode) => { setMode(nextMode); setFamilyIndex(0); resetPractice(); };
  const chooseFamily = (index: number) => { setFamilyIndex(index); resetPractice(); };
  const playLetter = (index: number) => { void speakPersian(persianLetterNames[index], index); };
  const chooseAnswer = (index: number) => { if (answer !== null) return; setAnswer(index); if (index === targetIndex) setScore((value) => value + 1); };
  const next = () => { setQuestion((value) => value + 1); setAnswer(null); };

  return (
    <article className="overflow-hidden rounded-[32px] border border-[#d8d5c9] bg-[#fffdf8] shadow-[0_18px_55px_rgba(42,61,51,.08)]">
      <div className="border-b border-[#e2ded3] bg-[#173e33] px-6 py-7 text-white sm:px-9">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-[#a9c8b9]">
          {mode === 'shape' ? <Shapes className="size-4" /> : <Headphones className="size-4" />}
          {mode === 'shape' ? 'Look-alike letters' : 'Same sound · different spelling'}
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-2xl font-bold">{mode === 'shape' ? 'Learn the family, then notice the difference' : 'Hear one sound, remember each spelling'}</h2>
          <span className="rounded-full bg-white/10 px-3 py-2 text-xs font-bold">Family {familyIndex + 1} of {familyCount}</span>
        </div>
      </div>

      <div className="p-6 sm:p-9">
        <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-[#edf3ef] p-1.5" aria-label="Family lesson type">
          <button onClick={() => chooseMode('shape')} aria-pressed={mode === 'shape'} className={`rounded-xl px-3 py-2.5 text-sm font-bold transition ${mode === 'shape' ? 'bg-white text-[#173e33] shadow-sm' : 'text-[#64756c] hover:text-[#173e33]'}`}><Shapes className="mr-1.5 inline size-4" /> Look-alike shapes</button>
          <button onClick={() => chooseMode('sound')} aria-pressed={mode === 'sound'} className={`rounded-xl px-3 py-2.5 text-sm font-bold transition ${mode === 'sound' ? 'bg-white text-[#173e33] shadow-sm' : 'text-[#64756c] hover:text-[#173e33]'}`}><Headphones className="mr-1.5 inline size-4" /> Same sounds</button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2" aria-label="Letter families">
          {(mode === 'shape' ? shapeFamilies : soundFamilies).map((item, index) => (
            <button key={item.title} onClick={() => chooseFamily(index)} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${index === familyIndex ? 'border-[#173e33] bg-[#173e33] text-white' : 'border-[#ddd9ce] bg-white text-[#69756d] hover:border-[#d49a50]'}`}>
              <span className="font-persian mr-2 text-base" dir="rtl">{item.letters.map((letter) => alphabet[letter].letter).join(' ')}</span>{item.title}
            </button>
          ))}
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-2xl bg-[#f7f2e8] p-4 text-sm leading-6 text-[#655947]">
          <Lightbulb className="mt-0.5 size-5 shrink-0 text-[#bd7929]" />
          <p><strong>{mode === 'shape' ? shapeFamily.title : soundFamily.title}:</strong> {mode === 'shape' ? shapeFamily.cue : soundFamily.cue}</p>
        </div>

        <div className={`mt-5 grid gap-3 ${letters.length === 2 ? 'sm:grid-cols-2' : letters.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-4'}`}>
          {letters.map((index, itemIndex) => {
            const item = alphabet[index];
            const forms = letterForms(item.letter, item.connectsLeft);
            const isDefault = mode === 'sound' && soundFamily.defaultIndex === index;
            return (
              <div key={item.letter} className={`rounded-3xl border bg-white p-4 text-center ${isDefault ? 'border-[#d4943f] ring-2 ring-[#f5ddb5]' : 'border-[#dedbd0]'}`}>
                {isDefault && <span className="mb-2 inline-block rounded-full bg-[#f7e4bd] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.1em] text-[#76501b]">Usual spelling</span>}
                <div className="font-persian text-7xl leading-none text-[#173e33]">{item.letter}</div>
                <p className="font-display mt-3 text-lg font-bold">{item.name}</p>
                <p className="mt-1 text-xs font-semibold text-[#a6631d]">{mode === 'shape' ? shapeFamily.dotCues[itemIndex] : soundFamily.spellingCues[itemIndex]}</p>
                <p className="mt-2 min-h-10 text-xs leading-5 text-[#748078]">{item.sound}</p>

                {mode === 'shape' ? (
                  <div className="mt-3 flex items-center justify-center gap-1 rounded-xl bg-[#f4f2eb] px-2 py-2" dir="ltr">
                    {forms.map((form) => <span key={form.label} className="font-persian text-xl text-[#40564b]" title={form.label}>{form.glyph}</span>)}
                  </div>
                ) : (
                  <div className="mt-3 space-y-1.5 rounded-xl bg-[#f4f2eb] p-2">
                    {wordExamples[index].slice(0, 3).map((example) => (
                      <button key={example.word} onClick={() => void speakPersian(example.word)} className="flex w-full items-center justify-between gap-2 rounded-lg bg-white px-2.5 py-1.5 text-left transition hover:bg-[#fff8eb]" aria-label={`Hear ${example.word}`}>
                        <span className="text-[10px] text-[#778079]">{example.meaning}</span>
                        <span className="font-persian text-lg font-bold text-[#29493d]" dir="rtl">{example.word}</span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex justify-center gap-2">
                  <Button variant="outline" size="icon" className="rounded-full" onClick={() => mode === 'shape' ? playLetter(index) : void speakPersian(wordExamples[index][0].word)} aria-label={`Hear ${mode === 'shape' ? item.name : wordExamples[index][0].word}`}><Volume2 className="size-4" /></Button>
                  <Button variant="ghost" className="rounded-full px-3 text-xs" onClick={() => onOpenLetter(index)}>Open lesson</Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-7 rounded-[28px] border border-[#dedbd0] bg-[#fbfaf6] p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.15em] text-[#a56c28]">{mode === 'shape' ? 'Family check' : 'Spelling check'}</p>
              <h3 className="font-display mt-1 text-xl font-bold">{mode === 'shape' ? `Which letter is ${target.name}?` : 'Which letter completes this word?'}</h3>
              {mode === 'shape' ? (
                <p className="mt-1 text-sm text-[#778079]">Listen if you need a hint, then compare the dots.</p>
              ) : (
                <div className="mt-3 flex items-center gap-3">
                  <span className="font-persian rounded-xl bg-white px-4 py-2 text-3xl font-bold text-[#173e33]" dir="rtl">{maskedWord}</span>
                  <span className="text-sm text-[#778079]">{targetExample.transliteration} · {targetExample.meaning} · sound “{soundFamily.sound}”</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="rounded-full" onClick={() => mode === 'shape' ? playLetter(targetIndex) : void speakPersian(targetExample.word)} aria-label={mode === 'shape' ? `Hear ${target.name}` : `Hear ${targetExample.word}`}><Headphones className="size-4" /></Button>
              <span className="rounded-full bg-[#edf3ef] px-3 py-2 text-xs font-bold text-[#496257]">Score {score} / {question + (answer !== null ? 1 : 0)}</span>
            </div>
          </div>

          <div className={`mt-5 grid gap-3 ${letters.length === 2 ? 'grid-cols-2' : letters.length === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
            {letters.map((index) => {
              const correct = index === targetIndex;
              const chosen = answer === index;
              return (
                <button key={alphabet[index].letter} onClick={() => chooseAnswer(index)} className={`font-persian relative min-h-24 rounded-2xl border-2 text-5xl transition ${answer !== null && correct ? 'border-[#3f8066] bg-[#e9f5ee] text-[#245c48]' : answer !== null && chosen ? 'border-[#c96a5e] bg-[#fff0ed] text-[#9e4037]' : 'border-[#dedbd0] bg-white text-[#31473d] hover:-translate-y-1 hover:border-[#d89a4b]'}`}>
                  {alphabet[index].letter}
                  {answer !== null && correct && <Check className="absolute right-2 top-2 size-4" />}
                </button>
              );
            })}
          </div>

          {answer !== null && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[#40564b]">
                {mode === 'shape'
                  ? answer === targetIndex ? `Correct — ${target.name} is ${target.letter}.` : `Look again at the dots: ${target.name} is ${target.letter}.`
                  : answer === targetIndex ? `Correct — ${targetExample.word} uses ${target.letter}.` : `${targetExample.word} uses ${target.letter}. The sound alone cannot tell you the spelling.`}
              </p>
              <Button onClick={next} className="rounded-full bg-[#173e33] text-white hover:bg-[#245849]">Next in family <ChevronRight /></Button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
