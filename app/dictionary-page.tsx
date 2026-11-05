'use client';

import { useEffect, useMemo, useState } from 'react';
import { BookOpenText, ChevronLeft, ChevronRight, Eye, EyeOff, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { alphabet } from './alphabet';
import { curatedLoanwords } from './curated-loanwords';

const pageSize = 12;
const vowelMarks = /[\u064b-\u065f\u0670]/g;
const persianLetters = /[\u0621-\u063a\u0641-\u064a\u067e\u0686\u0698\u06a9\u06af\u06cc]/u;
const plainPersian = (value: string) => value.replace(vowelMarks, '');
const normalizedLetter = (value: string) => value.replace(/[آأإ]/g, 'ا').replace(/ي/g, 'ی').replace(/ك/g, 'ک');

const separatedLetters = (word: string) => Array.from(plainPersian(word).normalize('NFC'))
  .filter((character) => persianLetters.test(character));

export function DictionaryPage() {
  const [query, setQuery] = useState('');
  const [focusLetter, setFocusLetter] = useState<string | null>(null);
  const [showVowels, setShowVowels] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return curatedLoanwords.filter((entry) => {
      const haystack = `${entry.english} ${entry.persian} ${entry.transliteration} ${entry.meaning}`.toLocaleLowerCase();
      const hasLetter = !focusLetter || separatedLetters(entry.persian).some((letter) => normalizedLetter(letter) === normalizedLetter(focusLetter));
      return hasLetter && (!needle || haystack.includes(needle));
    });
  }, [focusLetter, query]);

  useEffect(() => setPage(1), [focusLetter, query]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <article className="overflow-hidden rounded-[32px] border border-[#d8d5c9] bg-[#fffdf8] shadow-[0_18px_55px_rgba(42,61,51,.08)]">
      <div className="border-b border-[#e2ded3] bg-[#173e33] px-6 py-7 text-white sm:px-9">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-[#a9c8b9]"><BookOpenText className="size-4" /> Familiar English · Persian letters</p>
        <h2 className="font-display mt-2 text-2xl font-bold">Use words you know to remember the script</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#c7d8d0]">These {curatedLoanwords.length} recognizable English words have a clear Persian or Iranian source. Start with the familiar English word, then study how its source is built from Persian letters.</p>
      </div>

      <div className="p-6 sm:p-9">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
          <label className="relative block">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#7c8981]" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a familiar word, Persian source, or letter…" className="h-13 w-full rounded-2xl border border-[#dcd8cc] bg-white pl-12 pr-4 text-sm outline-none transition focus:border-[#bd7929] focus:ring-2 focus:ring-[#f0d6ae]" />
          </label>
          <Button variant="outline" className="h-13 rounded-2xl px-5" onClick={() => setShowVowels((value) => !value)} aria-pressed={showVowels}>
            {showVowels ? <EyeOff /> : <Eye />} {showVowels ? 'Hide short vowels' : 'Add short vowels'}
          </Button>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#89928c]">Practice words containing a letter</p>
            {focusLetter && <button onClick={() => setFocusLetter(null)} className="text-xs font-bold text-[#a6631d]">Show all words</button>}
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-2" dir="rtl" aria-label="Filter by Persian letter">
            {alphabet.map((item) => (
              <button key={item.letter} onClick={() => setFocusLetter(item.letter)} title={item.name} className={`font-persian grid size-10 shrink-0 place-items-center rounded-xl border text-xl font-bold transition ${focusLetter === item.letter ? 'border-[#173e33] bg-[#173e33] text-white' : 'border-[#ddd9ce] bg-white text-[#29493d] hover:border-[#d49a50]'}`}>{item.letter}</button>
            ))}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[#778079]">
          <p><strong className="text-[#40564b]">{filtered.length}</strong> word{filtered.length === 1 ? '' : 's'} · page {page} of {pageCount}</p>
          {showVowels && <p>Short-vowel marks now appear directly <strong>above or below the Persian letters.</strong></p>}
        </div>

        {visible.length ? (
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((entry) => (
              <section key={entry.english} className="rounded-3xl border border-[#dfdbd0] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#d4a264] hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[.13em] text-[#9a6a31]">Familiar English word</p>
                    <h3 className="font-display mt-1 text-xl font-bold text-[#26362f]">{entry.english}</h3>
                  </div>
                  <span className="max-w-36 rounded-full bg-[#f7f2e8] px-2.5 py-1 text-right text-[10px] font-semibold text-[#786b59]">{entry.meaning}</span>
                </div>

                <div className="mt-4 rounded-2xl bg-[#edf3ef] p-4 text-center">
                  <p className="font-persian text-4xl font-bold leading-relaxed text-[#173e33]" dir="rtl">{showVowels ? entry.vowelled : entry.persian}</p>
                  <p className="mt-1 text-sm font-bold text-[#a6631d]">{entry.transliteration}</p>
                </div>

                <div className="mt-4">
                  <p className="mb-2 text-[9px] font-bold uppercase tracking-[.14em] text-[#8c938e]">Letters, separated</p>
                  <div className="flex flex-wrap gap-1.5" dir="rtl" aria-label={`${entry.persian}, separated into Persian letters`}>
                    {separatedLetters(entry.persian).map((letter, index) => {
                      const lesson = alphabet.find((item) => normalizedLetter(item.letter) === normalizedLetter(letter));
                      return (
                        <span key={`${letter}-${index}`} className="min-w-10 rounded-lg border border-[#dfe5e1] bg-[#f5f8f6] px-1.5 py-1 text-center">
                          <span className="font-persian block text-xl font-bold text-[#24483a]">{letter}</span>
                          <span className="block truncate text-[8px] font-bold text-[#89938d]">{lesson?.name || ''}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-3xl border border-dashed border-[#d9d3c5] bg-[#f8f5ed] px-6 py-14 text-center">
            <p className="font-display text-xl font-bold">No matching practice word</p>
            <p className="mt-2 text-sm text-[#78827c]">Try another letter or clear your search.</p>
          </div>
        )}

        {pageCount > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button variant="outline" size="icon" className="rounded-full" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} aria-label="Previous dictionary page"><ChevronLeft /></Button>
            <span className="min-w-24 text-center text-xs font-bold text-[#68766e]">{page} / {pageCount}</span>
            <Button variant="outline" size="icon" className="rounded-full" disabled={page === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))} aria-label="Next dictionary page"><ChevronRight /></Button>
          </div>
        )}

        <div className="mt-7 rounded-2xl bg-[#f7f2e8] p-4 text-xs leading-5 text-[#6b604f]">
          <p><strong>Why fewer words?</strong> This set deliberately favors recognizable English words and useful Persian letter patterns. It leaves out obscure technical, historical, and personal names even when a dictionary classifies them as Persian-derived.</p>
          <p className="mt-2">Origins were checked against <a className="font-bold text-[#8d581c] underline" href="https://www.iranicaonline.org/articles/english/" target="_blank" rel="noreferrer">Encyclopaedia Iranica</a> and the <a className="font-bold text-[#8d581c] underline" href="https://en.wikipedia.org/wiki/List_of_English_words_of_Persian_origin" target="_blank" rel="noreferrer">referenced etymology list</a>. Some words reached English through intermediary languages.</p>
        </div>
      </div>
    </article>
  );
}
