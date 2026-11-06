'use client';

import { useEffect, useMemo, useState } from 'react';
import { BookOpenText, ChevronLeft, ChevronRight, Eye, EyeOff, Languages, Search, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { alphabet } from './alphabet';
import { curatedLoanwords } from './curated-loanwords';
import { turkishBridgeWords } from './turkish-bridge-words';

const pageSize = 12;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const vowelMarks = /[\u064b-\u065f\u0670]/g;
const persianLetters = /[\u0621-\u063a\u0641-\u064a\u067e\u0686\u0698\u06a9\u06af\u06cc]/u;
const plainPersian = (value: string) => value.replace(vowelMarks, '');
const normalizedLetter = (value: string) => value.replace(/[آأإ]/g, 'ا').replace(/ي/g, 'ی').replace(/ك/g, 'ک');

const separatedLetters = (word: string) => Array.from(plainPersian(word).normalize('NFC'))
  .filter((character) => persianLetters.test(character));

const persianFontFaces = `
  @font-face { font-family: 'Dabestan Vazirmatn'; src: url('${basePath}/fonts/Vazirmatn.ttf') format('truetype'); font-weight: 100 900; font-display: swap; }
  @font-face { font-family: 'Dabestan Naskh'; src: url('${basePath}/fonts/NotoNaskhArabic.ttf') format('truetype'); font-weight: 100 900; font-display: swap; }
  @font-face { font-family: 'Dabestan Kufi'; src: url('${basePath}/fonts/NotoKufiArabic.ttf') format('truetype'); font-weight: 100 900; font-display: swap; }
  @font-face { font-family: 'Dabestan Nastaliq'; src: url('${basePath}/fonts/NotoNastaliqUrdu.ttf') format('truetype'); font-weight: 400 700; font-display: swap; }
`;

const persianFonts = [
  { id: 'modern', label: 'Modern', family: "'Dabestan Vazirmatn', Tahoma, sans-serif" },
  { id: 'naskh', label: 'Naskh', family: "'Dabestan Naskh', 'Noto Naskh Arabic', serif" },
  { id: 'kufi', label: 'Kufi', family: "'Dabestan Kufi', sans-serif" },
  { id: 'nastaliq', label: 'Nastaliq', family: "'Dabestan Nastaliq', serif" },
] as const;

type PersianFontId = typeof persianFonts[number]['id'] | 'compare';

export function DictionaryPage() {
  const [collection, setCollection] = useState<'turkish' | 'english'>('turkish');
  const [query, setQuery] = useState('');
  const [focusLetter, setFocusLetter] = useState<string | null>(null);
  const [showVowels, setShowVowels] = useState(false);
  const [persianFont, setPersianFont] = useState<PersianFontId>('modern');
  const [page, setPage] = useState(1);
  const activeFont = persianFonts.find((font) => font.id === persianFont) || persianFonts[0];

  const entries = useMemo(() => collection === 'turkish'
    ? turkishBridgeWords.map((entry) => ({
      familiar: entry.turkish,
      persian: entry.persian,
      vowelled: entry.vowelled,
      transliteration: entry.transliteration,
      tag: entry.category,
    }))
    : curatedLoanwords.map((entry) => ({
      familiar: entry.english,
      persian: entry.persian,
      vowelled: entry.vowelled,
      transliteration: entry.transliteration,
      tag: entry.meaning,
    })), [collection]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return entries.filter((entry) => {
      const haystack = `${entry.familiar} ${entry.persian} ${entry.transliteration} ${entry.tag}`.toLocaleLowerCase();
      const hasLetter = !focusLetter || separatedLetters(entry.persian).some((letter) => normalizedLetter(letter) === normalizedLetter(focusLetter));
      return hasLetter && (!needle || haystack.includes(needle));
    });
  }, [entries, focusLetter, query]);

  useEffect(() => setPage(1), [collection, focusLetter, query]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <article className="overflow-hidden rounded-[32px] border border-[#d8d5c9] bg-[#fffdf8] shadow-[0_18px_55px_rgba(42,61,51,.08)]">
      <style>{persianFontFaces}</style>
      <div className="border-b border-[#e2ded3] bg-[#173e33] px-6 py-7 text-white sm:px-9">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-[#a9c8b9]"><BookOpenText className="size-4" /> {collection === 'turkish' ? 'Türkçe köprü · Farsça harfler' : 'Familiar English · Persian letters'}</p>
        <h2 className="font-display mt-2 text-2xl font-bold">{collection === 'turkish' ? 'Bildiğiniz Türkçe kelimelerle Farsça okuyun' : 'Use words you know to remember the script'}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#c7d8d0]">{collection === 'turkish'
          ? `Bu ${turkishBridgeWords.length} kelime Türkçeden zaten tanıdığınız biçimleri Farsça yazıyla eşleştirir. Kelimeyi tanıyın, sonra Farsça harflerini tek tek inceleyin.`
          : `These ${curatedLoanwords.length} recognizable English words have a clear Persian or Iranian source. Start with the familiar English word, then study how its source is built from Persian letters.`}</p>
      </div>

      <div className="p-6 sm:p-9">
        <div className="mb-5 inline-flex rounded-2xl border border-[#dcd8cc] bg-[#f7f4ec] p-1" aria-label="Choose familiar language">
          <button onClick={() => setCollection('turkish')} className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${collection === 'turkish' ? 'bg-[#173e33] text-white shadow-sm' : 'text-[#66736c] hover:text-[#173e33]'}`} aria-pressed={collection === 'turkish'}><Languages className="size-4" /> Türkçe köprü</button>
          <button onClick={() => setCollection('english')} className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${collection === 'english' ? 'bg-[#173e33] text-white shadow-sm' : 'text-[#66736c] hover:text-[#173e33]'}`} aria-pressed={collection === 'english'}>English bridge</button>
        </div>

        <div className="mb-5 rounded-3xl border border-[#ddd8cb] bg-[#f8f5ed] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.13em] text-[#65736b]"><Type className="size-4 text-[#a6631d]" /> Persian font practice</p>
            <p className="text-[11px] text-[#7c857f]">The letters stay the same even when their proportions change.</p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5" role="radiogroup" aria-label="Persian dictionary font">
            {persianFonts.map((font) => (
              <button key={font.id} onClick={() => setPersianFont(font.id)} role="radio" aria-checked={persianFont === font.id} className={`rounded-2xl border px-3 py-2.5 text-center transition ${persianFont === font.id ? 'border-[#173e33] bg-[#173e33] text-white shadow-sm' : 'border-[#ddd8cb] bg-white text-[#41554b] hover:border-[#c99150]'}`}>
                <span className="block text-2xl leading-9" dir="rtl" style={{ fontFamily: font.family }}>فارسی</span>
                <span className="block text-[10px] font-bold uppercase tracking-[.12em]">{font.label}</span>
              </button>
            ))}
            <button onClick={() => setPersianFont('compare')} role="radio" aria-checked={persianFont === 'compare'} className={`rounded-2xl border px-3 py-2.5 text-center transition ${persianFont === 'compare' ? 'border-[#173e33] bg-[#173e33] text-white shadow-sm' : 'border-[#ddd8cb] bg-white text-[#41554b] hover:border-[#c99150]'}`}>
              <span className="grid h-9 place-items-center text-lg font-bold">4×</span>
              <span className="block text-[10px] font-bold uppercase tracking-[.12em]">Compare all</span>
            </button>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
          <label className="relative block">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#7c8981]" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={collection === 'turkish' ? 'Türkçe kelime, Farsça yazım veya harf ara…' : 'Find a familiar word, Persian source, or letter…'} className="h-13 w-full rounded-2xl border border-[#dcd8cc] bg-white pl-12 pr-4 text-sm outline-none transition focus:border-[#bd7929] focus:ring-2 focus:ring-[#f0d6ae]" />
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
              <section key={`${collection}-${entry.familiar}-${entry.persian}`} className="rounded-3xl border border-[#dfdbd0] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#d4a264] hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[.13em] text-[#9a6a31]">{collection === 'turkish' ? 'Tanıdığınız Türkçe kelime' : 'Familiar English word'}</p>
                    <h3 className="font-display mt-1 text-xl font-bold text-[#26362f]">{entry.familiar}</h3>
                  </div>
                  <span className="max-w-36 rounded-full bg-[#f7f2e8] px-2.5 py-1 text-right text-[10px] font-semibold text-[#786b59]">{entry.tag}</span>
                </div>

                <div className="mt-4 rounded-2xl bg-[#edf3ef] p-4 text-center">
                  {persianFont === 'compare' ? (
                    <div className="grid gap-1.5">
                      {persianFonts.map((font) => (
                        <div key={font.id} className="grid grid-cols-[4.25rem_1fr] items-center gap-2 rounded-xl bg-white/65 px-2 py-1.5">
                          <span className="text-left text-[8px] font-bold uppercase tracking-[.1em] text-[#839087]">{font.label}</span>
                          <span className={`text-right text-3xl font-bold text-[#173e33] ${font.id === 'nastaliq' ? 'py-2 leading-[1.8]' : 'leading-relaxed'}`} dir="rtl" style={{ fontFamily: font.family }}>{showVowels ? entry.vowelled : entry.persian}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={`text-4xl font-bold text-[#173e33] ${persianFont === 'nastaliq' ? 'py-3 leading-[1.8]' : 'leading-relaxed'}`} dir="rtl" style={{ fontFamily: activeFont.family }}>{showVowels ? entry.vowelled : entry.persian}</p>
                  )}
                  <p className="mt-1 text-sm font-bold text-[#a6631d]">{entry.transliteration}</p>
                </div>

                <div className="mt-4">
                  <p className="mb-2 text-[9px] font-bold uppercase tracking-[.14em] text-[#8c938e]">Letters, separated</p>
                  <div className="flex flex-wrap gap-1.5" dir="rtl" aria-label={`${entry.persian}, separated into Persian letters`}>
                    {separatedLetters(entry.persian).map((letter, index) => {
                      const lesson = alphabet.find((item) => normalizedLetter(item.letter) === normalizedLetter(letter));
                      return (
                        <span key={`${letter}-${index}`} className="min-w-10 rounded-lg border border-[#dfe5e1] bg-[#f5f8f6] px-1.5 py-1 text-center">
                          <span className="block text-xl font-bold text-[#24483a]" style={{ fontFamily: activeFont.family }}>{letter}</span>
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
          {collection === 'turkish' ? <>
            <p><strong>Neden “köprü” kelimeleri?</strong> Liste yalnızca köken bilgisi vermek için değil, Farsça harfleri daha hızlı tanımanız için hazırlandı. Farsçadan Türkçeye geçen kelimelerin yanında iki dilde de kullanılan bölgesel ve uluslararası kelimeler bulunur.</p>
            <p className="mt-2">Anlamı belirgin biçimde değişmiş yanıltıcı benzerlikler özellikle dışarıda bırakıldı. Seçimde Türkiye Türkçesindeki Farsça kökenli kelimeler üzerine akademik çalışmalar ve <a className="font-bold text-[#8d581c] underline" href="https://dergipark.org.tr/tr/download/article-file/3704597" target="_blank" rel="noreferrer">Türkçe–Farsça ortak kelimeler çalışması</a> temel alındı.</p>
          </> : <>
            <p><strong>Why fewer words?</strong> This set deliberately favors recognizable English words and useful Persian letter patterns. It leaves out obscure technical, historical, and personal names even when a dictionary classifies them as Persian-derived.</p>
            <p className="mt-2">Origins were checked against <a className="font-bold text-[#8d581c] underline" href="https://www.iranicaonline.org/articles/english/" target="_blank" rel="noreferrer">Encyclopaedia Iranica</a> and the <a className="font-bold text-[#8d581c] underline" href="https://en.wikipedia.org/wiki/List_of_English_words_of_Persian_origin" target="_blank" rel="noreferrer">referenced etymology list</a>. Some words reached English through intermediary languages.</p>
          </>}
        </div>
      </div>
    </article>
  );
}
