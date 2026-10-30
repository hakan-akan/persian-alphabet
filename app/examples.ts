export type WordExample = {
  word: string;
  transliteration: string;
  meaning: string;
  picture: string;
};

export type LetterPosition = 'initial' | 'medial' | 'final';

export const wordExamples: WordExample[][] = [
  [{ word: 'آب', transliteration: 'âb', meaning: 'water', picture: '💧' }, { word: 'آتش', transliteration: 'âtash', meaning: 'fire', picture: '🔥' }, { word: 'آسمان', transliteration: 'âsemân', meaning: 'sky', picture: '☁️' }],
  [{ word: 'باران', transliteration: 'bârân', meaning: 'rain', picture: '🌧️' }, { word: 'باد', transliteration: 'bâd', meaning: 'wind', picture: '💨' }, { word: 'بستنی', transliteration: 'bastani', meaning: 'ice cream', picture: '🍦' }],
  [{ word: 'پنجره', transliteration: 'panjere', meaning: 'window', picture: '🪟' }, { word: 'پرنده', transliteration: 'parande', meaning: 'bird', picture: '🐦' }, { word: 'پرتقال', transliteration: 'porteghâl', meaning: 'orange', picture: '🍊' }],
  [{ word: 'توپ', transliteration: 'tup', meaning: 'ball', picture: '⚽' }, { word: 'توت', transliteration: 'tut', meaning: 'berry', picture: '🫐' }, { word: 'تخم‌مرغ', transliteration: 'tokhm-e morgh', meaning: 'egg', picture: '🥚' }],
  [{ word: 'ثانیه', transliteration: 'sâniye', meaning: 'second', picture: '⏱️' }, { word: 'ثابت', transliteration: 'sâbet', meaning: 'fixed', picture: '📌' }, { word: 'ثروت', transliteration: 'servat', meaning: 'wealth', picture: '💰' }],
  [{ word: 'جنگل', transliteration: 'jangal', meaning: 'forest', picture: '🌲' }, { word: 'جوراب', transliteration: 'jurâb', meaning: 'socks', picture: '🧦' }, { word: 'جوجه', transliteration: 'juje', meaning: 'chick', picture: '🐥' }],
  [{ word: 'چای', transliteration: 'chây', meaning: 'tea', picture: '🍵' }, { word: 'چشم', transliteration: 'cheshm', meaning: 'eye', picture: '👁️' }, { word: 'چتر', transliteration: 'chatr', meaning: 'umbrella', picture: '☂️' }],
  [{ word: 'حوض', transliteration: 'howz', meaning: 'pond', picture: '⛲' }, { word: 'حباب', transliteration: 'hobâb', meaning: 'bubble', picture: '🫧' }, { word: 'حوله', transliteration: 'hole', meaning: 'towel', picture: '🛁' }],
  [{ word: 'خانه', transliteration: 'khâne', meaning: 'house', picture: '🏠' }, { word: 'خورشید', transliteration: 'khorshid', meaning: 'sun', picture: '☀️' }, { word: 'خرس', transliteration: 'khers', meaning: 'bear', picture: '🐻' }],
  [{ word: 'درخت', transliteration: 'derakht', meaning: 'tree', picture: '🌳' }, { word: 'در', transliteration: 'dar', meaning: 'door', picture: '🚪' }, { word: 'دریا', transliteration: 'daryâ', meaning: 'sea', picture: '🌊' }],
  [{ word: 'ذرت', transliteration: 'zorat', meaning: 'corn', picture: '🌽' }, { word: 'ذهن', transliteration: 'zehn', meaning: 'mind', picture: '🧠' }, { word: 'ذره', transliteration: 'zarre', meaning: 'particle', picture: '✨' }],
  [{ word: 'روز', transliteration: 'ruz', meaning: 'day', picture: '🌞' }, { word: 'روباه', transliteration: 'rubâh', meaning: 'fox', picture: '🦊' }, { word: 'رود', transliteration: 'rud', meaning: 'river', picture: '🏞️' }],
  [{ word: 'زمین', transliteration: 'zamin', meaning: 'earth', picture: '🌍' }, { word: 'زنبور', transliteration: 'zanbur', meaning: 'bee', picture: '🐝' }, { word: 'زنگ', transliteration: 'zang', meaning: 'bell', picture: '🔔' }],
  [{ word: 'ژاله', transliteration: 'zhâle', meaning: 'dew', picture: '💧' }, { word: 'ژاکت', transliteration: 'zhâket', meaning: 'jacket', picture: '🧥' }, { word: 'ژله', transliteration: 'zhele', meaning: 'jelly', picture: '🍮' }],
  [{ word: 'سیب', transliteration: 'sib', meaning: 'apple', picture: '🍎' }, { word: 'ستاره', transliteration: 'setâre', meaning: 'star', picture: '⭐' }, { word: 'ساعت', transliteration: "sâ'at", meaning: 'clock', picture: '🕰️' }],
  [{ word: 'شب', transliteration: 'shab', meaning: 'night', picture: '🌙' }, { word: 'شیر', transliteration: 'shir', meaning: 'milk', picture: '🥛' }, { word: 'شمع', transliteration: "sham'", meaning: 'candle', picture: '🕯️' }],
  [{ word: 'صبح', transliteration: 'sobh', meaning: 'morning', picture: '🌅' }, { word: 'صابون', transliteration: 'sâbun', meaning: 'soap', picture: '🧼' }, { word: 'صندلی', transliteration: 'sandali', meaning: 'chair', picture: '🪑' }],
  [{ word: 'ضربه', transliteration: 'zarbe', meaning: 'hit', picture: '🥊' }, { word: 'ضبط', transliteration: 'zabt', meaning: 'recording', picture: '📻' }, { word: 'ضماد', transliteration: 'zemâd', meaning: 'bandage', picture: '🩹' }],
  [{ word: 'طلا', transliteration: 'talâ', meaning: 'gold', picture: '🪙' }, { word: 'طوطی', transliteration: 'tuti', meaning: 'parrot', picture: '🦜' }, { word: 'طبل', transliteration: 'tabl', meaning: 'drum', picture: '🥁' }],
  [{ word: 'ظهر', transliteration: 'zohr', meaning: 'noon', picture: '☀️' }, { word: 'ظرف', transliteration: 'zarf', meaning: 'dish', picture: '🍽️' }, { word: 'ظاهر', transliteration: 'zâher', meaning: 'appearance', picture: '🪞' }],
  [{ word: 'عسل', transliteration: 'asal', meaning: 'honey', picture: '🍯' }, { word: 'عینک', transliteration: 'eynak', meaning: 'glasses', picture: '👓' }, { word: 'عروس', transliteration: 'arus', meaning: 'bride', picture: '👰' }],
  [{ word: 'غذا', transliteration: 'ghazâ', meaning: 'food', picture: '🍲' }, { word: 'غروب', transliteration: 'ghorub', meaning: 'sunset', picture: '🌇' }, { word: 'غاز', transliteration: 'ghâz', meaning: 'goose', picture: '🪿' }],
  [{ word: 'فیل', transliteration: 'fil', meaning: 'elephant', picture: '🐘' }, { word: 'فنجان', transliteration: 'fenjân', meaning: 'cup', picture: '☕' }, { word: 'فرش', transliteration: 'farsh', meaning: 'rug', picture: '🧶' }],
  [{ word: 'قلم', transliteration: 'ghalam', meaning: 'pen', picture: '🖊️' }, { word: 'قایق', transliteration: 'ghâyegh', meaning: 'boat', picture: '⛵' }, { word: 'قفل', transliteration: 'ghofl', meaning: 'lock', picture: '🔒' }],
  [{ word: 'کتاب', transliteration: 'ketâb', meaning: 'book', picture: '📚' }, { word: 'کفش', transliteration: 'kafsh', meaning: 'shoe', picture: '👟' }, { word: 'کیک', transliteration: 'keyk', meaning: 'cake', picture: '🎂' }],
  [{ word: 'گل', transliteration: 'gol', meaning: 'flower', picture: '🌷' }, { word: 'گربه', transliteration: 'gorbe', meaning: 'cat', picture: '🐈' }, { word: 'گلابی', transliteration: 'golâbi', meaning: 'pear', picture: '🍐' }],
  [{ word: 'لبخند', transliteration: 'labkhand', meaning: 'smile', picture: '😊' }, { word: 'لیمو', transliteration: 'limu', meaning: 'lemon', picture: '🍋' }, { word: 'لباس', transliteration: 'lebâs', meaning: 'clothes', picture: '👕' }],
  [{ word: 'ماه', transliteration: 'mâh', meaning: 'moon', picture: '🌕' }, { word: 'ماهی', transliteration: 'mâhi', meaning: 'fish', picture: '🐟' }, { word: 'موز', transliteration: 'moz', meaning: 'banana', picture: '🍌' }],
  [{ word: 'نان', transliteration: 'nân', meaning: 'bread', picture: '🫓' }, { word: 'نارنگی', transliteration: 'nârangi', meaning: 'tangerine', picture: '🍊' }, { word: 'نردبان', transliteration: 'nardebân', meaning: 'ladder', picture: '🪜' }],
  [{ word: 'ورزش', transliteration: 'varzesh', meaning: 'sport', picture: '🏃' }, { word: 'ویولن', transliteration: 'violon', meaning: 'violin', picture: '🎻' }, { word: 'وان', transliteration: 'vân', meaning: 'bathtub', picture: '🛁' }],
  [{ word: 'هوا', transliteration: 'havâ', meaning: 'air', picture: '🌬️' }, { word: 'هلو', transliteration: 'holu', meaning: 'peach', picture: '🍑' }, { word: 'هندوانه', transliteration: 'hendevâne', meaning: 'watermelon', picture: '🍉' }],
  [{ word: 'یخ', transliteration: 'yakh', meaning: 'ice', picture: '🧊' }, { word: 'یاقوت', transliteration: 'yâghut', meaning: 'ruby', picture: '💎' }, { word: 'یوز', transliteration: 'yuz', meaning: 'cheetah', picture: '🐆' }],
];

// Extra vocabulary gives the less common letters useful examples in every
// textual position. The gallery also draws from the main lesson vocabulary.
const positionExtras: WordExample[] = [
  { word: 'سپید', transliteration: 'sepid', meaning: 'white', picture: '⬜' },
  { word: 'لپه', transliteration: 'lappe', meaning: 'split peas', picture: '🫛' },
  { word: 'سوپ', transliteration: 'sup', meaning: 'soup', picture: '🍲' },
  { word: 'چاپ', transliteration: 'châp', meaning: 'printing', picture: '🖨️' },
  { word: 'کثیف', transliteration: 'kasif', meaning: 'dirty', picture: '🧹' },
  { word: 'تأثیر', transliteration: "ta'sir", meaning: 'effect', picture: '✨' },
  { word: 'مثلث', transliteration: 'mosallas', meaning: 'triangle', picture: '🔺' },
  { word: 'ارث', transliteration: 'ers', meaning: 'inheritance', picture: '📜' },
  { word: 'تاج', transliteration: 'tâj', meaning: 'crown', picture: '👑' },
  { word: 'کاج', transliteration: 'kâj', meaning: 'pine tree', picture: '🌲' },
  { word: 'برنج', transliteration: 'berenj', meaning: 'rice', picture: '🍚' },
  { word: 'بچه', transliteration: 'bache', meaning: 'child', picture: '🧒' },
  { word: 'کوچه', transliteration: 'kuche', meaning: 'alley', picture: '🏘️' },
  { word: 'قیچی', transliteration: 'gheychi', meaning: 'scissors', picture: '✂️' },
  { word: 'قارچ', transliteration: 'ghârch', meaning: 'mushroom', picture: '🍄' },
  { word: 'پیچ', transliteration: 'pich', meaning: 'screw', picture: '🔩' },
  { word: 'ساحل', transliteration: 'sâhel', meaning: 'beach', picture: '🏖️' },
  { word: 'محل', transliteration: 'mahal', meaning: 'place', picture: '📍' },
  { word: 'فتح', transliteration: 'fath', meaning: 'victory', picture: '🏆' },
  { word: 'شبح', transliteration: 'shabah', meaning: 'ghost', picture: '👻' },
  { word: 'کاغذ', transliteration: 'kâghaz', meaning: 'paper', picture: '📄' },
  { word: 'لذیذ', transliteration: 'laziz', meaning: 'delicious', picture: '😋' },
  { word: 'پروژه', transliteration: 'prozhe', meaning: 'project', picture: '📋' },
  { word: 'ویژه', transliteration: 'vizhe', meaning: 'special', picture: '🌟' },
  { word: 'دژ', transliteration: 'dezh', meaning: 'fortress', picture: '🏰' },
  { word: 'کلاژ', transliteration: 'kolâzh', meaning: 'collage', picture: '🖼️' },
  { word: 'فصل', transliteration: 'fasl', meaning: 'season', picture: '🍂' },
  { word: 'قصر', transliteration: 'ghasr', meaning: 'palace', picture: '🏰' },
  { word: 'رقص', transliteration: 'raghs', meaning: 'dance', picture: '💃' },
  { word: 'قرص', transliteration: 'ghors', meaning: 'pill', picture: '💊' },
  { word: 'رمضان', transliteration: 'ramezân', meaning: 'Ramadan', picture: '🌙' },
  { word: 'لحظه', transliteration: 'lahze', meaning: 'moment', picture: '⏳' },
  { word: 'حافظ', transliteration: 'hâfez', meaning: 'Hafez', picture: '📖' },
  { word: 'نظافت', transliteration: 'nezâfat', meaning: 'cleaning', picture: '🧼' },
  { word: 'لفظ', transliteration: 'lafz', meaning: 'wording', picture: '💬' },
  { word: 'حفظ', transliteration: 'hefz', meaning: 'memorizing', picture: '🧠' },
];

const normalizePersian = (value: string) =>
  value.replace(/[آأإ]/g, 'ا').replace(/ي/g, 'ی').replace(/ك/g, 'ک').replace(/\u200c/g, '');

export const examplesForPosition = (letter: string, position: LetterPosition): WordExample[] => {
  const target = normalizePersian(letter);
  const candidates = [...wordExamples.flat(), ...positionExtras];
  const seen = new Set<string>();

  return candidates.filter((example) => {
    const word = normalizePersian(example.word);
    const matches = position === 'initial'
      ? word.startsWith(target)
      : position === 'final'
        ? word.endsWith(target)
        : word.slice(1, -1).includes(target);

    if (!matches || seen.has(example.word)) return false;
    seen.add(example.word);
    return true;
  }).slice(0, 3);
};

export const letterForms = (letter: string, connectsLeft: boolean) => [
  { label: 'Isolated', persianLabel: 'تنها', glyph: letter },
  { label: 'Initial', persianLabel: 'اول', glyph: connectsLeft ? `${letter}ـ` : letter },
  { label: 'Medial', persianLabel: 'وسط', glyph: connectsLeft ? `ـ${letter}ـ` : `ـ${letter}` },
  { label: 'Final', persianLabel: 'آخر', glyph: `ـ${letter}` },
];
