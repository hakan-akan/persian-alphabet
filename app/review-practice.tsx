'use client';

import { useEffect, useMemo, useState } from 'react';
import { BrainCircuit, Check, Headphones, RotateCcw, Shapes, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { alphabet } from './alphabet';
import { letterForms } from './examples';
import { persianLetterNames, speakPersian } from './persian-speech';

type ReviewMode = 'mixed' | 'form' | 'sound';
type Rating = 'hard' | 'unsure' | 'easy';
type ScheduleItem = { due: number; intervalDays: number };
type Schedule = Record<string, ScheduleItem>;

const scheduleKey = 'dabestan-review-schedule';
const day = 24 * 60 * 60 * 1000;

const readSchedule = (): Schedule => {
  try {
    return JSON.parse(localStorage.getItem(scheduleKey) || '{}') as Schedule;
  } catch {
    return {};
  }
};

export function ReviewPractice() {
  const [reviewMode, setReviewMode] = useState<ReviewMode>('mixed');
  const [queue, setQueue] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7]);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [dueCount, setDueCount] = useState(0);

  useEffect(() => {
    const schedule = readSchedule();
    const now = Date.now();
    const learned = JSON.parse(localStorage.getItem('dabestan-learned') || '[]') as string[];
    const learnedIndexes = learned
      .map((letter) => alphabet.findIndex((item) => item.letter === letter))
      .filter((index) => index >= 0);
    const studyPool = learnedIndexes.length >= 4 ? learnedIndexes : alphabet.slice(0, 8).map((_, index) => index);
    const due = studyPool.filter((index) => !schedule[alphabet[index].letter] || schedule[alphabet[index].letter].due <= now);
    setDueCount(due.length);
    setQueue(due.length ? due : studyPool);
  }, []);

  const targetIndex = queue[questionNumber % queue.length] ?? 0;
  const target = alphabet[targetIndex];
  const kind: Exclude<ReviewMode, 'mixed'> = reviewMode === 'mixed'
    ? questionNumber % 2 === 0 ? 'form' : 'sound'
    : reviewMode;
  const positionIndex = (questionNumber % 3) + 1;
  const forms = letterForms(target.letter, target.connectsLeft);
  const shownForm = forms[positionIndex];

  const options = useMemo(() => {
    const offsets = [0, 5, 13, 21];
    return offsets
      .map((offset) => (targetIndex + offset) % alphabet.length)
      .sort((a, b) => ((a * 7 + questionNumber * 3) % 19) - ((b * 7 + questionNumber * 3) % 19));
  }, [targetIndex, questionNumber]);

  const playSound = () => {
    void speakPersian(persianLetterNames[targetIndex], targetIndex);
  };

  const choose = (index: number) => {
    if (answer !== null) return;
    setAnswer(index);
    if (index === targetIndex) setScore((value) => value + 1);
  };

  const rateAndContinue = (rating: Rating) => {
    const schedule = readSchedule();
    const previous = schedule[target.letter]?.intervalDays || 1;
    const intervalDays = rating === 'hard' ? 0.25 : rating === 'unsure' ? 1 : Math.max(2, previous * 2.5);
    schedule[target.letter] = { due: Date.now() + intervalDays * day, intervalDays };
    localStorage.setItem(scheduleKey, JSON.stringify(schedule));
    setDueCount((value) => Math.max(0, value - 1));
    setQuestionNumber((value) => value + 1);
    setAnswer(null);
  };

  const reset = () => {
    setQuestionNumber(0);
    setAnswer(null);
    setScore(0);
  };

  return (
    <article className="overflow-hidden rounded-[32px] border border-[#d8d5c9] bg-[#fffdf8] shadow-[0_18px_55px_rgba(42,61,51,.08)]">
      <div className="border-b border-[#e2ded3] bg-[#173e33] px-6 py-7 text-white sm:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-[#a9c8b9]"><BrainCircuit className="size-4" /> Smart review</p>
            <h2 className="font-display mt-2 text-2xl font-bold">Remember it for the long term</h2>
          </div>
          <div className="flex gap-2 text-xs font-bold">
            <span className="rounded-full bg-white/10 px-3 py-2">{dueCount} due</span>
            <span className="rounded-full bg-[#f0b45e] px-3 py-2 text-[#3e2a10]">Score {score} / {questionNumber + (answer !== null ? 1 : 0)}</span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-10">
        <div className="mb-7 flex flex-wrap gap-2" aria-label="Review type">
          <ReviewModeButton active={reviewMode === 'mixed'} label="Mixed review" icon={<BrainCircuit />} onClick={() => { setReviewMode('mixed'); reset(); }} />
          <ReviewModeButton active={reviewMode === 'form'} label="Letter forms" icon={<Shapes />} onClick={() => { setReviewMode('form'); reset(); }} />
          <ReviewModeButton active={reviewMode === 'sound'} label="Sound first" icon={<Headphones />} onClick={() => { setReviewMode('sound'); reset(); }} />
        </div>

        <div className="rounded-[28px] border border-[#e0ddd2] bg-[#fbfaf6] p-6 text-center sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#a56c28]">Question {questionNumber + 1} · {kind === 'form' ? `${shownForm.label} form` : 'Listening'}</p>
          {kind === 'form' ? (
            <>
              <div className="font-persian my-5 text-[120px] leading-none text-[#173e33]" dir="rtl">{shownForm.glyph}</div>
              <h3 className="font-display text-xl font-bold">Which letter is this?</h3>
              <p className="mt-1 text-sm text-[#7a857e]">Recognize it even when its joined shape changes.</p>
            </>
          ) : (
            <>
              <button onClick={playSound} className="mx-auto my-6 grid size-28 place-items-center rounded-full bg-[#e89c3e] text-[#3d2a10] shadow-[0_12px_30px_rgba(192,117,32,.25)] transition hover:scale-105" aria-label="Play the letter sound">
                <Volume2 className="size-10" />
              </button>
              <h3 className="font-display text-xl font-bold">Which letter makes this sound?</h3>
              <p className="mt-1 text-sm text-[#7a857e]">Listen first, then choose without seeing the answer.</p>
            </>
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {options.map((index) => {
            const correct = index === targetIndex;
            const chosen = answer === index;
            const showCorrect = answer !== null && correct;
            const showWrong = answer !== null && chosen && !correct;
            return (
              <button
                key={alphabet[index].letter}
                onClick={() => choose(index)}
                className={`relative min-h-28 rounded-2xl border-2 transition ${showCorrect ? 'border-[#3f8066] bg-[#e9f5ee]' : showWrong ? 'border-[#c96a5e] bg-[#fff0ed]' : 'border-[#dedbd0] bg-white hover:-translate-y-1 hover:border-[#d89a4b] hover:shadow-md'}`}
              >
                <span className="font-persian block text-5xl text-[#173e33]">{alphabet[index].letter}</span>
                <span className="mt-2 block text-xs font-bold text-[#657169]">{alphabet[index].name}</span>
                {showCorrect && <Check className="absolute right-2 top-2 size-4 text-[#327057]" />}
              </button>
            );
          })}
        </div>

        {answer !== null && (
          <div className={`mt-5 rounded-2xl p-5 ${answer === targetIndex ? 'bg-[#e9f5ee]' : 'bg-[#fff1e4]'}`}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-bold text-[#29493d]">{answer === targetIndex ? 'Correct — nice recall.' : `This is ${target.name} (${target.letter}).`}</p>
                <p className="mt-1 text-sm text-[#6d7971]">How well did you remember it? Your choice schedules the next review.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => rateAndContinue('hard')} className="rounded-full border-[#d58c81] text-[#8d453d]">Hard · 6h</Button>
                <Button variant="outline" onClick={() => rateAndContinue('unsure')} className="rounded-full border-[#d5a75d] text-[#865b1e]">Unsure · 1d</Button>
                <Button onClick={() => rateAndContinue('easy')} className="rounded-full bg-[#173e33] text-white hover:bg-[#245849]">Easy · later</Button>
              </div>
            </div>
          </div>
        )}

        {questionNumber > 0 && <button onClick={reset} className="mt-5 flex items-center gap-2 text-xs font-bold text-[#7b857e] hover:text-[#34463c]"><RotateCcw className="size-3.5" /> Restart review</button>}
      </div>
    </article>
  );
}

function ReviewModeButton({ active, label, icon, onClick }: { active: boolean; label: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition ${active ? 'border-[#173e33] bg-[#173e33] text-white' : 'border-[#ddd9ce] bg-white text-[#68746c] hover:border-[#d49a50]'}`}>
      <span className="[&_svg]:size-4">{icon}</span>{label}
    </button>
  );
}
