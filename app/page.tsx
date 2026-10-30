'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Flame,
  GraduationCap,
  Headphones,
  Lightbulb,
  PenLine,
  RotateCcw,
  Sparkles,
  Trophy,
  Volume2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { alphabet } from './alphabet';
import { examplesForPosition, letterForms, type LetterPosition } from './examples';
import { TracingPad } from './tracing-pad';
import { ReviewPractice } from './review-practice';

type Mode = 'learn' | 'trace' | 'review' | 'quiz';
type ToolInput = Record<string, unknown>;
type ModelTool = {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
  execute: (input: ToolInput) => unknown;
};
type ModelContext = {
  registerTool: (tool: ModelTool, options?: { signal?: AbortSignal }) => void | Promise<void>;
};

const dateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const calculateStreak = (dates: string[]) => {
  const practiced = new Set(dates);
  const cursor = new Date();
  if (!practiced.has(dateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (practiced.has(dateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};

const saveLearned = (letters: string[]) => {
  localStorage.setItem('dabestan-learned', JSON.stringify(letters));
};

export default function Home() {
  const [mode, setMode] = useState<Mode>('learn');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activePosition, setActivePosition] = useState<LetterPosition>('initial');
  const [learned, setLearned] = useState<string[]>([]);
  const [streak, setStreak] = useState(1);
  const [notice, setNotice] = useState<string | null>(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);

  const current = alphabet[selectedIndex];
  const currentExamples = examplesForPosition(current.letter, activePosition);
  const currentForms = letterForms(current.letter, current.connectsLeft);
  const progress = Math.round((learned.length / alphabet.length) * 100);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('dabestan-learned') || '[]') as string[];
    const valid = stored.filter((letter) => alphabet.some((item) => item.letter === letter));
    setLearned([...new Set(valid)]);

    const days = JSON.parse(localStorage.getItem('dabestan-practice-days') || '[]') as string[];
    const nextDays = [...new Set([...days, dateKey()])].slice(-120);
    localStorage.setItem('dabestan-practice-days', JSON.stringify(nextDays));
    setStreak(Math.max(1, calculateStreak(nextDays)));
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 2800);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    const modelContext = (document as Document & { modelContext?: ModelContext }).modelContext;
    if (!modelContext?.registerTool) return;
    const lifecycle = new AbortController();

    const register = async () => {
      await modelContext.registerTool({
        name: 'open_persian_letter',
        title: 'Open Persian letter',
        description: 'Open the lesson for one Persian letter by entering the character itself.',
        inputSchema: {
          type: 'object',
          properties: { letter: { type: 'string', description: 'One of the 32 Persian letters.' } },
          required: ['letter'],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: true, untrustedContentHint: false },
        execute(input) {
          const letter = typeof input.letter === 'string' ? input.letter.trim() : '';
          const index = alphabet.findIndex((item) => item.letter === letter);
          if (index < 0) throw new Error('Please provide one of the 32 Persian letters.');
          setSelectedIndex(index);
          setActivePosition('initial');
          setMode('learn');
          return { letter, name: alphabet[index].name, lesson: index + 1 };
        },
      }, { signal: lifecycle.signal });

      await modelContext.registerTool({
        name: 'complete_persian_letter',
        title: 'Complete Persian letter',
        description: 'Mark one Persian letter as learned and update the visible course progress.',
        inputSchema: {
          type: 'object',
          properties: { letter: { type: 'string', description: 'One of the 32 Persian letters.' } },
          required: ['letter'],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input) {
          const letter = typeof input.letter === 'string' ? input.letter.trim() : '';
          const item = alphabet.find((entry) => entry.letter === letter);
          if (!item) throw new Error('Please provide one of the 32 Persian letters.');
          setLearned((previous) => {
            const next = previous.includes(letter) ? previous : [...previous, letter];
            saveLearned(next);
            return next;
          });
          setNotice(`${item.name} added to your learned letters.`);
          return { letter, name: item.name, status: 'learned' };
        },
      }, { signal: lifecycle.signal });
    };

    void register().catch(() => undefined);
    return () => lifecycle.abort();
  }, []);

  const speak = () => {
    const number = String(selectedIndex + 1).padStart(2, '0');
    const audio = new Audio(`/audio/${number}.wav`);
    audio.preload = 'auto';
    void audio.play().catch(() => {
      if (!('speechSynthesis' in window)) {
        setNotice('Audio could not start. Check that this tab is not muted.');
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(current.word);
      utterance.lang = 'fa-IR';
      utterance.rate = 0.72;
      window.speechSynthesis.speak(utterance);
    });
  };

  const selectLetter = (index: number, nextMode: Mode = 'learn') => {
    setSelectedIndex(index);
    setActivePosition('initial');
    setMode(nextMode);
    setQuizAnswer(null);
  };

  const markLearned = (moveNext = true) => {
    setLearned((previous) => {
      const next = previous.includes(current.letter) ? previous : [...previous, current.letter];
      saveLearned(next);
      return next;
    });
    setNotice(`${current.name} is now in your learned set.`);
    if (moveNext && selectedIndex < alphabet.length - 1) {
      setSelectedIndex((value) => value + 1);
      setActivePosition('initial');
    }
  };

  const optionIndexes = useMemo(() => {
    const candidates = [quizIndex, (quizIndex + 7) % 32, (quizIndex + 15) % 32, (quizIndex + 23) % 32];
    return [...candidates].sort((a, b) => ((a * 11 + quizIndex * 3) % 17) - ((b * 11 + quizIndex * 3) % 17));
  }, [quizIndex]);

  const answerQuiz = (index: number) => {
    if (quizAnswer !== null) return;
    setQuizAnswer(index);
    setQuizTotal((value) => value + 1);
    if (index === quizIndex) setQuizScore((value) => value + 1);
  };

  const nextQuestion = () => {
    setQuizIndex((value) => (value + 5) % alphabet.length);
    setQuizAnswer(null);
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setQuizAnswer(null);
    setQuizScore(0);
    setQuizTotal(0);
  };

  return (
    <main className="min-h-screen bg-[#f7f5ef] pb-20 text-[#26362f] md:pb-0">
      <header className="sticky top-0 z-30 border-b border-[#dedbd0] bg-[#fbfaf6]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 lg:px-10">
          <button className="flex items-center gap-3 text-left" onClick={() => setMode('learn')} aria-label="Go to learning mode">
            <div className="font-persian grid size-10 place-items-center rounded-full bg-[#163d32] text-xl font-bold text-[#fffaf0]">پ</div>
            <div>
              <p className="font-display text-[19px] font-bold leading-none">Dabestan</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[.2em] text-[#7d887f]">Persian alphabet</p>
            </div>
          </button>

          <nav className="hidden items-center rounded-full border border-[#ddd9cc] bg-white/70 p-1 md:flex" aria-label="Learning modes">
            <ModeButton active={mode === 'learn'} icon={<BookOpen />} label="Learn" onClick={() => setMode('learn')} />
            <ModeButton active={mode === 'trace'} icon={<PenLine />} label="Trace" onClick={() => setMode('trace')} />
            <ModeButton active={mode === 'review'} icon={<BrainCircuit />} label="Review" onClick={() => setMode('review')} />
            <ModeButton active={mode === 'quiz'} icon={<Trophy />} label="Quiz" onClick={() => setMode('quiz')} />
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full bg-[#fff2dc] px-3 py-2 text-sm font-bold text-[#9b5f16] sm:flex">
              <Flame className="size-4 fill-[#e79a31] text-[#e79a31]" /> {streak} day{streak === 1 ? '' : 's'}
            </div>
            <div className="grid size-10 place-items-center rounded-full border border-[#d9d5c8] bg-white text-[#516158]" title={`${learned.length} letters learned`}>
              <GraduationCap className="size-5" />
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1440px] px-5 pb-10 pt-6 lg:px-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[#a56c28]">
              <Sparkles className="size-3.5" /> {mode === 'learn' ? `Lesson ${selectedIndex + 1} of 32` : mode === 'trace' ? `Writing practice · ${current.name}` : mode === 'review' ? 'Memory practice' : 'Quick quiz'}
            </p>
            <h1 className="font-display mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              {mode === 'learn' ? 'Meet the Persian alphabet' : mode === 'trace' ? 'Build muscle memory' : mode === 'review' ? 'Review at the right time' : 'Test what you remember'}
            </h1>
          </div>
          <div className="hidden w-[250px] sm:block">
            <div className="mb-2 flex justify-between text-xs font-semibold text-[#7e897f]">
              <span>Course progress</span><span>{learned.length} / 32 · {progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#e1dfd6]"><div className="h-full rounded-full bg-[#d58a34] transition-all duration-500" style={{ width: `${progress}%` }} /></div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          {mode === 'learn' && (
            <article className="relative overflow-hidden rounded-[32px] border border-[#d8d5c9] bg-[#fffdf8] shadow-[0_18px_55px_rgba(42,61,51,.08)]">
              <div className="grid min-h-[520px] md:grid-cols-[minmax(270px,.88fr)_1.12fr]">
                <div className="relative flex min-h-[340px] items-center justify-center overflow-hidden bg-[#173e33] px-8 py-12 text-white">
                  <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_25%_22%,#f7c16c_0,transparent_25%),radial-gradient(circle_at_80%_78%,#74aa91_0,transparent_27%)]" />
                  <div className="relative text-center">
                    <span className="mb-3 block text-xs font-bold uppercase tracking-[.24em] text-[#a9c8b9]">Letter {selectedIndex + 1}</span>
                    <div className="font-persian text-[190px] leading-[.95] text-[#fff7e8] drop-shadow-sm" dir="rtl">{current.letter}</div>
                    <p className="font-display mt-5 text-2xl font-bold">{current.name}</p>
                    <p className="mt-1 text-sm text-[#b9cdc3]">{current.sound}</p>
                  </div>
                </div>

                <div className="flex flex-col justify-between p-7 sm:p-10">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[.16em] text-[#a56c28]">Notice the shape</p>
                        <h2 className="font-display mt-2 text-3xl font-bold">{current.memory}</h2>
                      </div>
                      <Button aria-label={`Hear ${current.word}`} onClick={speak} className="size-12 rounded-full bg-[#e89c3e] text-[#3d2a10] hover:bg-[#f2ae59]"><Volume2 className="size-5" /></Button>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-[#edf3ef] p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#7b8a81]">Pronunciation</p>
                        <p className="mt-2 text-sm font-semibold text-[#29493d]">{current.sound}</p>
                      </div>
                      <div className="rounded-2xl bg-[#f7f2e8] p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#90816a]">Connection</p>
                        <p className="mt-2 text-sm font-semibold text-[#554735]">{current.connectsLeft ? 'Joins the next letter' : 'Does not join the next letter'}</p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl border border-[#e4dfd2] bg-[#fbfaf6] p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[.15em] text-[#89928c]">The letter in context</p>
                          <p className="mt-1 text-xs text-[#778079]">Persian letters reshape as they join a word.</p>
                        </div>
                        <Button variant="ghost" size="icon" aria-label={`Hear ${current.word}`} onClick={speak} className="rounded-full text-[#607168]"><Headphones /></Button>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4" dir="ltr">
                        {currentForms.map((form) => {
                          const position = form.label.toLowerCase() as LetterPosition | 'isolated';
                          const selectable = position !== 'isolated';
                          const active = selectable && activePosition === position;
                          return (
                          <button
                            key={form.label}
                            type="button"
                            disabled={!selectable}
                            onClick={() => selectable && setActivePosition(position)}
                            aria-pressed={active}
                            aria-label={selectable ? `Show ${form.label.toLowerCase()} position examples` : 'Isolated letter form'}
                            className={`rounded-xl border px-2 py-3 text-center transition ${active ? 'border-[#173e33] bg-[#173e33] shadow-md' : selectable ? 'border-[#e5e1d7] bg-white hover:-translate-y-0.5 hover:border-[#d49a50] hover:shadow-sm' : 'cursor-default border-[#e5e1d7] bg-[#f7f5ef]'}`}
                          >
                            <div className={`font-persian min-h-11 text-4xl font-bold ${active ? 'text-white' : 'text-[#173e33]'}`} dir="rtl">{form.glyph}</div>
                            <p className={`mt-1 text-[10px] font-bold uppercase tracking-[.12em] ${active ? 'text-[#f4c982]' : 'text-[#727e76]'}`}>{form.label}</p>
                            <p className={`font-persian mt-0.5 text-[11px] ${active ? 'text-[#cce0d6]' : 'text-[#9b7a4d]'}`} dir="rtl">{form.persianLabel}</p>
                          </button>
                        );})}
                      </div>
                      {!current.connectsLeft && <p className="mt-3 text-xs leading-5 text-[#7c7568]">This is a non-connector, so some positions share the same shape.</p>}
                    </div>

                    <div className="mt-5">
                      <div className="mb-3 flex items-end justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[.15em] text-[#89928c]">{activePosition} position · picture words</p>
                          <p className="mt-1 text-xs text-[#778079]">Each word places {current.letter} in the {activePosition} position.</p>
                        </div>
                        <button onClick={speak} className="flex items-center gap-1.5 text-xs font-bold text-[#a6631d] hover:text-[#74420f]"><Volume2 className="size-3.5" /> Hear the first word</button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {currentExamples.map((example) => (
                          <div key={example.word} className="overflow-hidden rounded-2xl border border-[#e1ded3] bg-white">
                            <div className="grid min-h-24 place-items-center bg-[linear-gradient(145deg,#edf3ef,#f8f1e3)] text-5xl" role="img" aria-label={`Picture for ${example.meaning}`}>{example.picture}</div>
                            <div className="p-3 text-center">
                              <p className="font-persian text-2xl font-bold text-[#173e33]" dir="rtl">{example.word}</p>
                              <p className="mt-1 truncate text-xs font-bold text-[#46574e]">{example.transliteration}</p>
                              <p className="mt-0.5 truncate text-[11px] text-[#7b857e]">{example.meaning}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#e5e1d7] pt-6">
                      <Button variant="ghost" className="h-11 rounded-full px-4 text-[#78837c]" disabled={selectedIndex === 0} onClick={() => { setSelectedIndex((value) => Math.max(0, value - 1)); setActivePosition('initial'); }}><ChevronLeft /> Previous</Button>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setMode('trace')} className="h-11 rounded-full px-4"><PenLine /> Trace it</Button>
                      <Button onClick={() => markLearned(true)} className="h-11 rounded-full bg-[#173e33] px-5 text-white hover:bg-[#245849]">{learned.includes(current.letter) ? 'Next letter' : 'I learned this'} <Check className="ml-1" /></Button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          )}

          {mode === 'trace' && (
            <article className="rounded-[32px] border border-[#d8d5c9] bg-[#fffdf8] p-6 shadow-[0_18px_55px_rgba(42,61,51,.08)] sm:p-9">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.15em] text-[#a56c28]">Trace {current.name}</p>
                  <h2 className="font-display mt-2 text-2xl font-bold">Practice all four forms of the letter.</h2>
                </div>
                <div className="flex items-center gap-1 rounded-2xl bg-[#173e33] px-4 py-3 text-white" dir="ltr">
                  {currentForms.map((form) => <span key={form.label} className="font-persian text-3xl">{form.glyph}</span>)}
                </div>
              </div>
              <TracingPad letter={current.letter} forms={currentForms} onComplete={() => { markLearned(false); setNotice(`Beautiful — you traced all four forms of ${current.name}.`); }} />
              <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#f7f2e8] p-4 text-sm leading-6 text-[#655947]">
                <Lightbulb className="mt-0.5 size-5 shrink-0 text-[#bd7929]" />
                <p>Start slowly and aim for the overall rhythm of the shape. Persian handwriting becomes more fluid with repetition, not perfection.</p>
              </div>
            </article>
          )}

          {mode === 'quiz' && (
            <article className="overflow-hidden rounded-[32px] border border-[#d8d5c9] bg-[#fffdf8] shadow-[0_18px_55px_rgba(42,61,51,.08)]">
              <div className="border-b border-[#e2ded3] bg-[#173e33] px-6 py-7 text-white sm:px-10">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[.18em] text-[#a9c8b9]">Question {quizTotal + 1}</p>
                    <h2 className="font-display mt-2 text-2xl font-bold">Which one is {alphabet[quizIndex].name}?</h2>
                  </div>
                  <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold">Score {quizScore} / {quizTotal}</div>
                </div>
              </div>
              <div className="p-6 sm:p-10">
                <p className="mb-5 text-sm text-[#6e7972]">Choose the Persian letter that matches the name.</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {optionIndexes.map((index) => {
                    const isCorrect = index === quizIndex;
                    const isChosen = quizAnswer === index;
                    const showCorrect = quizAnswer !== null && isCorrect;
                    const showWrong = quizAnswer !== null && isChosen && !isCorrect;
                    return (
                      <button
                        key={alphabet[index].letter}
                        onClick={() => answerQuiz(index)}
                        className={`font-persian relative grid min-h-36 place-items-center rounded-3xl border-2 text-7xl transition-all ${showCorrect ? 'border-[#3f8066] bg-[#e9f5ee] text-[#245c48]' : showWrong ? 'border-[#c96a5e] bg-[#fff0ed] text-[#9e4037]' : 'border-[#dedbd0] bg-[#fbfaf6] text-[#31473d] hover:-translate-y-1 hover:border-[#d89a4b] hover:shadow-lg'}`}
                        aria-label={`Answer ${alphabet[index].name}`}
                      >
                        {alphabet[index].letter}
                        {showCorrect && <CircleCheck className="absolute right-3 top-3 size-5" />}
                      </button>
                    );
                  })}
                </div>

                {quizAnswer !== null && (
                  <div className={`mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5 ${quizAnswer === quizIndex ? 'bg-[#e9f5ee] text-[#285743]' : 'bg-[#fff1e4] text-[#794e25]'}`}>
                    <div>
                      <p className="font-bold">{quizAnswer === quizIndex ? 'Exactly right!' : `Good try — ${alphabet[quizIndex].name} is ${alphabet[quizIndex].letter}.`}</p>
                      <p className="mt-1 text-sm opacity-80">It makes {alphabet[quizIndex].sound}. Example: {alphabet[quizIndex].transliteration} · {alphabet[quizIndex].meaning}.</p>
                    </div>
                    <Button onClick={nextQuestion} className="h-11 rounded-full bg-[#173e33] px-5 text-white hover:bg-[#245849]">Next question <ChevronRight /></Button>
                  </div>
                )}

                {quizTotal > 0 && (
                  <button onClick={resetQuiz} className="mt-5 flex items-center gap-2 text-xs font-bold text-[#7b857e] hover:text-[#34463c]"><RotateCcw className="size-3.5" /> Reset score</button>
                )}
              </div>
            </article>
          )}

          {mode === 'review' && <ReviewPractice />}

          <AlphabetPanel selectedIndex={selectedIndex} learned={learned} onSelect={selectLetter} />
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold text-[#89928c]">
          <ArrowLeft className="size-3.5" /> Persian reads from right to left <ChevronRight className="size-3.5" />
        </div>
      </section>

      <nav className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-2xl border border-[#d4d0c3] bg-[#fffdf8]/95 p-2 shadow-[0_10px_35px_rgba(31,49,40,.18)] backdrop-blur-lg md:hidden" aria-label="Learning modes">
        <MobileMode active={mode === 'learn'} icon={<BookOpen />} label="Learn" onClick={() => setMode('learn')} />
        <MobileMode active={mode === 'trace'} icon={<PenLine />} label="Trace" onClick={() => setMode('trace')} />
        <MobileMode active={mode === 'review'} icon={<BrainCircuit />} label="Review" onClick={() => setMode('review')} />
        <MobileMode active={mode === 'quiz'} icon={<Trophy />} label="Quiz" onClick={() => setMode('quiz')} />
      </nav>

      {notice && (
        <div role="status" className="fixed bottom-24 right-5 z-50 flex max-w-sm items-center gap-3 rounded-2xl bg-[#173e33] px-5 py-4 text-sm font-semibold text-white shadow-2xl md:bottom-6">
          <CircleCheck className="size-5 text-[#f1b65f]" /> {notice}
        </div>
      )}
    </main>
  );
}

function ModeButton({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold transition ${active ? 'bg-[#163d32] text-white shadow-sm' : 'text-[#69756d] hover:text-[#26362f]'}`}>
      <span className="[&_svg]:size-4">{icon}</span>{label}
    </button>
  );
}

function MobileMode({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex min-w-20 flex-col items-center gap-1 rounded-xl px-4 py-2 text-[11px] font-bold transition ${active ? 'bg-[#173e33] text-white' : 'text-[#748078]'}`}>
      <span className="[&_svg]:size-4">{icon}</span>{label}
    </button>
  );
}

function AlphabetPanel({ selectedIndex, learned, onSelect }: { selectedIndex: number; learned: string[]; onSelect: (index: number) => void }) {
  return (
    <aside className="rounded-[28px] border border-[#d8d5c9] bg-white/70 p-5 lg:self-start">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#8b958e]">Your path</p>
          <h2 className="font-display mt-1 text-xl font-bold">The alphabet</h2>
        </div>
        <span className="rounded-full bg-[#edf1eb] px-3 py-1 text-xs font-bold text-[#5e6c63]">{learned.length} / 32</span>
      </div>
      <div className="mt-5 grid grid-cols-8 gap-2 lg:grid-cols-4" dir="rtl">
        {alphabet.map((item, index) => {
          const done = learned.includes(item.letter);
          return (
            <button
              key={item.letter}
              aria-label={`Open ${item.name}`}
              onClick={() => onSelect(index)}
              className={`font-persian relative grid aspect-square place-items-center rounded-xl border text-2xl transition ${selectedIndex === index ? 'border-[#173e33] bg-[#173e33] text-white shadow-md' : 'border-[#e4e1d8] bg-[#fbfaf7] text-[#647069] hover:border-[#d39a55] hover:text-[#173e33]'}`}
            >
              {item.letter}
              {done && selectedIndex !== index && <span className="absolute right-1 top-1 size-1.5 rounded-full bg-[#d58a34]" />}
            </button>
          );
        })}
      </div>
      <div className="mt-5 flex items-center gap-3 rounded-2xl bg-[#edf3ef] p-4">
        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-[#285544]"><Headphones className="size-5" /></div>
        <p className="text-xs leading-5 text-[#5f6e65]">Listen first, repeat three times, then trace the shape.</p>
      </div>
    </aside>
  );
}
