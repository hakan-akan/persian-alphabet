'use client';

import { useEffect, useMemo, useState } from 'react';
import { BookOpenText, ChevronLeft, ChevronRight, Eye, EyeOff, ExternalLink, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { persianLoanwords, type PersianLoanword } from './persian-loanwords-data';

const pageSize = 24;
const vowelMarks = /[\u064b-\u065f\u0670]/g;
const dictionaryEntries = persianLoanwords.filter((entry) => entry.persian !== '—');
const letters = ['All', ...Array.from(new Set(dictionaryEntries.map((entry) => entry.english[0]?.toUpperCase()).filter(Boolean))).sort()];

const plainPersian = (value: string) => value.replace(vowelMarks, '');

const searchable = (entry: PersianLoanword) => [
  entry.english,
  entry.persian,
  entry.transliteration,
  entry.definition,
  entry.route,
].join(' ').toLocaleLowerCase();

function VowelPronunciation({ value }: { value: string }) {
  return (
    <span aria-label={value}>
      {Array.from(value).map((character, index) => (
        <span key={`${character}-${index}`} className={/[aeiouâāīūēō]/i.test(character) ? 'font-black text-[#c46d20]' : 'text-[#426052]'}>{character}</span>
      ))}
    </span>
  );
}

function correctedRoute(value: string) {
  const parts = value.split(' → ');
  if (parts.at(-1) === 'English') return value;
  if (parts.at(-1) !== 'Persian') return `${value} → English`;
  const intermediaries = parts.slice(0, -1);
  const historicalPersian = intermediaries.some((part) => ['Old Persian', 'Middle Persian', 'Classical Persian'].includes(part));
  const route = historicalPersian ? [...intermediaries].reverse() : ['Persian', ...intermediaries.reverse()];
  return [...new Set([...route, 'English'])].join(' → ');
}

export function DictionaryPage() {
  const [query, setQuery] = useState('');
  const [letter, setLetter] = useState('All');
  const [showVowels, setShowVowels] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return dictionaryEntries.filter((entry) => {
      const matchesLetter = letter === 'All' || entry.english.toUpperCase().startsWith(letter);
      return matchesLetter && (!needle || searchable(entry).includes(needle));
    });
  }, [letter, query]);

  useEffect(() => setPage(1), [letter, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <article className="overflow-hidden rounded-[32px] border border-[#d8d5c9] bg-[#fffdf8] shadow-[0_18px_55px_rgba(42,61,51,.08)]">
      <div className="border-b border-[#e2ded3] bg-[#173e33] px-6 py-7 text-white sm:px-9">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-[#a9c8b9]"><BookOpenText className="size-4" /> Persian roots in English</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold">The words that travelled west</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#c7d8d0]">Explore {dictionaryEntries.length} English words with a recoverable Persian source form. Many travelled through Arabic, Turkish, Hindi, Urdu, French, or other languages before reaching English.</p>
          </div>
          <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold">{dictionaryEntries.length} sourced entries</span>
        </div>
      </div>

      <div className="p-6 sm:p-9">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
          <label className="relative block">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#7c8981]" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search English, Persian, pronunciation, meaning, or route…" className="h-13 w-full rounded-2xl border border-[#dcd8cc] bg-white pl-12 pr-4 text-sm outline-none transition focus:border-[#bd7929] focus:ring-2 focus:ring-[#f0d6ae]" />
          </label>
          <Button variant="outline" className="h-13 rounded-2xl px-5" onClick={() => setShowVowels((value) => !value)} aria-pressed={showVowels}>
            {showVowels ? <EyeOff /> : <Eye />} {showVowels ? 'Hide vowel help' : 'Show vowel help'}
          </Button>
        </div>

        <div className="mt-4 flex gap-1.5 overflow-x-auto pb-2" aria-label="Filter by first letter">
          {letters.map((item) => (
            <button key={item} onClick={() => setLetter(item)} className={`grid min-w-9 shrink-0 place-items-center rounded-full border px-2.5 py-2 text-xs font-bold transition ${letter === item ? 'border-[#173e33] bg-[#173e33] text-white' : 'border-[#ddd9ce] bg-white text-[#69756d] hover:border-[#d49a50]'}`}>{item}</button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[#778079]">
          <p><strong className="text-[#40564b]">{filtered.length}</strong> result{filtered.length === 1 ? '' : 's'} · page {page} of {pageCount}</p>
          {showVowels && <p><span className="font-black text-[#c46d20]">Orange letters</span> are vowel sounds missing from ordinary Persian spelling.</p>}
        </div>

        {visible.length ? (
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((entry) => {
              const markedSource = entry.persian;
              const ordinarySource = plainPersian(markedSource);
              const hasWrittenMarks = ordinarySource !== markedSource;
              return (
                <section key={`${entry.english}-${entry.persian}`} className="flex min-h-64 flex-col rounded-3xl border border-[#dfdbd0] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#d4a264] hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-xl font-bold text-[#26362f]">{entry.english}</h3>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-[.12em] text-[#9a6a31]">{entry.partOfSpeech}</p>
                    </div>
                    <a href={entry.sourceUrl} target="_blank" rel="noreferrer" className="grid size-8 shrink-0 place-items-center rounded-full bg-[#f3f1ea] text-[#718078] hover:bg-[#e8eee9]" aria-label={`Open etymology source for ${entry.english}`}><ExternalLink className="size-3.5" /></a>
                  </div>

                  <div className="mt-4 rounded-2xl bg-[#edf3ef] p-4 text-center">
                    <p className="font-persian text-3xl font-bold text-[#173e33]" dir="rtl">{showVowels && hasWrittenMarks ? markedSource : ordinarySource}</p>
                    {showVowels ? (
                      <p className="mt-2 text-sm font-bold"><VowelPronunciation value={entry.transliteration} /></p>
                    ) : (
                      <p className="mt-2 text-[10px] font-bold uppercase tracking-[.13em] text-[#7e8b83]">Persian source form</p>
                    )}
                  </div>

                  <p className="mt-4 flex-1 text-sm leading-6 text-[#59675f]">{entry.definition.replace(/^Q\d+\s+/, '')}</p>
                  <div className="mt-4 border-t border-[#ece8de] pt-3">
                    <p className="text-[9px] font-bold uppercase tracking-[.14em] text-[#969c98]">Route into English</p>
                    <p className="mt-1 text-xs font-semibold leading-5 text-[#596b62]">{correctedRoute(entry.route)}</p>
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="mt-5 rounded-3xl border border-dashed border-[#d9d3c5] bg-[#f8f5ed] px-6 py-14 text-center">
            <p className="font-display text-xl font-bold">No matching word</p>
            <p className="mt-2 text-sm text-[#78827c]">Try a shorter search or choose “All.”</p>
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
          <p><strong>About vowel help:</strong> ordinary Persian normally omits short-vowel marks. When “Show vowel help” is on, supplied vowel marks are preserved and every vowel in the scholarly pronunciation is highlighted. Historical Persian forms do not always use modern Persian spelling.</p>
          <p className="mt-2">Etymologies and definitions are adapted from <a className="font-bold text-[#8d581c] underline" href="https://en.wiktionary.org/wiki/Category:English_terms_borrowed_from_Persian" target="_blank" rel="noreferrer">English Wiktionary</a> (CC BY-SA). For historical context, see <a className="font-bold text-[#8d581c] underline" href="https://www.iranicaonline.org/articles/english/" target="_blank" rel="noreferrer">Encyclopaedia Iranica’s “Persian Elements in English.”</a></p>
        </div>
      </div>
    </article>
  );
}
