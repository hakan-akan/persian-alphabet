export type PersianLetter = {
  letter: string;
  name: string;
  sound: string;
  soundShort: string;
  word: string;
  transliteration: string;
  meaning: string;
  memory: string;
  connectsLeft: boolean;
};

export const alphabet: PersianLetter[] = [
  { letter: 'ا', name: 'Alef', sound: 'long “â”, as in father', soundShort: 'â', word: 'آب', transliteration: 'âb', meaning: 'water', memory: 'A tall, simple stroke—like the number one.', connectsLeft: false },
  { letter: 'ب', name: 'Be', sound: '“b”, as in book', soundShort: 'b', word: 'باران', transliteration: 'bârân', meaning: 'rain', memory: 'One dot rests below the bowl.', connectsLeft: true },
  { letter: 'پ', name: 'Pe', sound: '“p”, as in paper', soundShort: 'p', word: 'پنجره', transliteration: 'panjere', meaning: 'window', memory: 'Three dots below make the Persian “p”.', connectsLeft: true },
  { letter: 'ت', name: 'Te', sound: '“t”, as in tea', soundShort: 't', word: 'توپ', transliteration: 'tup', meaning: 'ball', memory: 'Two dots sit above the bowl.', connectsLeft: true },
  { letter: 'ث', name: 'Se', sound: '“s”, as in sun', soundShort: 's', word: 'ثانیه', transliteration: 'sâniye', meaning: 'second', memory: 'Three dots above; in Persian it sounds like “s”.', connectsLeft: true },
  { letter: 'ج', name: 'Jim', sound: '“j”, as in jam', soundShort: 'j', word: 'جنگل', transliteration: 'jangal', meaning: 'forest', memory: 'A curved cup with one dot inside.', connectsLeft: true },
  { letter: 'چ', name: 'Che', sound: '“ch”, as in chair', soundShort: 'ch', word: 'چای', transliteration: 'chây', meaning: 'tea', memory: 'Three dots turn Jim into “ch”.', connectsLeft: true },
  { letter: 'ح', name: 'He-ye jimi', sound: '“h”, a soft breath', soundShort: 'h', word: 'حوض', transliteration: 'howz', meaning: 'pond', memory: 'The same curved cup, with no dot.', connectsLeft: true },
  { letter: 'خ', name: 'Khe', sound: '“kh”, like the ch in loch', soundShort: 'kh', word: 'خانه', transliteration: 'khâne', meaning: 'house', memory: 'One dot above gives the cup a throaty sound.', connectsLeft: true },
  { letter: 'د', name: 'Dâl', sound: '“d”, as in door', soundShort: 'd', word: 'درخت', transliteration: 'derakht', meaning: 'tree', memory: 'A small bent back that does not join forward.', connectsLeft: false },
  { letter: 'ذ', name: 'Zâl', sound: '“z”, as in zebra', soundShort: 'z', word: 'ذرت', transliteration: 'zorat', meaning: 'corn', memory: 'Dâl with one dot above; it sounds like “z”.', connectsLeft: false },
  { letter: 'ر', name: 'Re', sound: 'a lightly rolled “r”', soundShort: 'r', word: 'روز', transliteration: 'ruz', meaning: 'day', memory: 'A simple descending curve.', connectsLeft: false },
  { letter: 'ز', name: 'Ze', sound: '“z”, as in zoo', soundShort: 'z', word: 'زمین', transliteration: 'zamin', meaning: 'earth', memory: 'Re with one dot above.', connectsLeft: false },
  { letter: 'ژ', name: 'Zhe', sound: '“zh”, as in vision', soundShort: 'zh', word: 'ژاله', transliteration: 'zhâle', meaning: 'dew', memory: 'Three dots above make the Persian “zh”.', connectsLeft: false },
  { letter: 'س', name: 'Sin', sound: '“s”, as in sea', soundShort: 's', word: 'سیب', transliteration: 'sib', meaning: 'apple', memory: 'Three small teeth flow into a long tail.', connectsLeft: true },
  { letter: 'ش', name: 'Shin', sound: '“sh”, as in shoe', soundShort: 'sh', word: 'شب', transliteration: 'shab', meaning: 'night', memory: 'Three dots above turn Sin into “sh”.', connectsLeft: true },
  { letter: 'ص', name: 'Sâd', sound: '“s”, as in sun', soundShort: 's', word: 'صبح', transliteration: 'sobh', meaning: 'morning', memory: 'A broad loop and tail; in Persian it sounds like “s”.', connectsLeft: true },
  { letter: 'ض', name: 'Zâd', sound: '“z”, as in zoo', soundShort: 'z', word: 'ضربه', transliteration: 'zarbe', meaning: 'hit', memory: 'Sâd with a dot above; it sounds like “z”.', connectsLeft: true },
  { letter: 'ط', name: 'Tâ', sound: '“t”, as in top', soundShort: 't', word: 'طلا', transliteration: 'talâ', meaning: 'gold', memory: 'A tall stem grows from a rounded base.', connectsLeft: true },
  { letter: 'ظ', name: 'Zâ', sound: '“z”, as in zoo', soundShort: 'z', word: 'ظهر', transliteration: 'zohr', meaning: 'noon', memory: 'Tâ with one dot above; it sounds like “z”.', connectsLeft: true },
  { letter: 'ع', name: 'Eyn', sound: 'a gentle throat sound', soundShort: '‘', word: 'عسل', transliteration: 'asal', meaning: 'honey', memory: 'A deep curve whose sound softens in everyday speech.', connectsLeft: true },
  { letter: 'غ', name: 'Gheyn', sound: 'a throaty “gh”', soundShort: 'gh', word: 'غذا', transliteration: 'ghazâ', meaning: 'food', memory: 'Eyn with a dot above.', connectsLeft: true },
  { letter: 'ف', name: 'Fe', sound: '“f”, as in fish', soundShort: 'f', word: 'فیل', transliteration: 'fil', meaning: 'elephant', memory: 'One dot sits above a small loop.', connectsLeft: true },
  { letter: 'ق', name: 'Ghâf', sound: 'a deep “gh”', soundShort: 'gh', word: 'قلم', transliteration: 'ghalam', meaning: 'pen', memory: 'Two dots above a deeper bowl.', connectsLeft: true },
  { letter: 'ک', name: 'Kâf', sound: '“k”, as in kite', soundShort: 'k', word: 'کتاب', transliteration: 'ketâb', meaning: 'book', memory: 'A long arm opens into the line.', connectsLeft: true },
  { letter: 'گ', name: 'Gâf', sound: '“g”, as in garden', soundShort: 'g', word: 'گل', transliteration: 'gol', meaning: 'flower', memory: 'Kâf with an extra bar above.', connectsLeft: true },
  { letter: 'ل', name: 'Lâm', sound: '“l”, as in lamp', soundShort: 'l', word: 'لبخند', transliteration: 'labkhand', meaning: 'smile', memory: 'A tall stem falls into a soft curve.', connectsLeft: true },
  { letter: 'م', name: 'Mim', sound: '“m”, as in moon', soundShort: 'm', word: 'ماه', transliteration: 'mâh', meaning: 'moon', memory: 'A tiny loop with a graceful tail.', connectsLeft: true },
  { letter: 'ن', name: 'Nun', sound: '“n”, as in name', soundShort: 'n', word: 'نان', transliteration: 'nân', meaning: 'bread', memory: 'One dot floats above the bowl.', connectsLeft: true },
  { letter: 'و', name: 'Vâv', sound: '“v”, “u”, or long “oo”', soundShort: 'v / u', word: 'ورزش', transliteration: 'varzesh', meaning: 'sport', memory: 'A small loop curls downward and does not join forward.', connectsLeft: false },
  { letter: 'ه', name: 'He', sound: '“h”, as in home', soundShort: 'h', word: 'هوا', transliteration: 'havâ', meaning: 'air', memory: 'Its shape changes dramatically inside a word.', connectsLeft: true },
  { letter: 'ی', name: 'Ye', sound: '“y” or long “ee”', soundShort: 'y / i', word: 'یخ', transliteration: 'yakh', meaning: 'ice', memory: 'A wide curve; Persian Ye has no dots below at the end.', connectsLeft: true },
];

export const persianDigits = (value: number) =>
  String(value).replace(/\d/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)]);
