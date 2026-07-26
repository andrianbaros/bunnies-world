// Multi-language Profanity Filter Engine (English, Indonesian, Korean, Japanese)

const BAD_WORDS = [
  // Indonesian
  'anjing', 'babi', 'monyet', 'kuntul', 'kontol', 'memek', 'jancok', 'pantek', 'bangsat', 'bajingan',
  'kampang', 'itil', 'perek', 'goblok', 'tolol', 'bego', 'idiot', 'asu', 'bajingul', 'peler', 'pepek',
  'ngentot', 'tetek', 'puki', 'kimak', 'memek', 'kintil', 'colli', 'coli',
  
  // English
  'fuck', 'shit', 'asshole', 'bitch', 'bastard', 'cunt', 'dick', 'pussy', 'whore', 'slut',
  'motherfucker', 'cock', 'bullshit', 'wanker', 'prick', 'nigger', 'faggot',
  
  // Korean (Romanized & Hangul)
  'ssibal', 'si-bal', '씨발', '개새끼', 'gaesae-ggi', '병신', 'byeong-shin', '지랄', 'ji-ral', '미친년',
  
  // Japanese (Romanized & Kana)
  'bakayaro', 'baka', '馬鹿', 'kuso', 'くそ', 'chiku-sho', 'ちくしょう', 'shine', '死ね'
];

export const cleanText = (text) => {
  if (!text) return '';
  let cleaned = text;

  BAD_WORDS.forEach((word) => {
    const cleanWord = word.toLowerCase().trim();
    if (!cleanWord) return;

    if (isAsianText(cleanWord)) {
      const asianRegex = new RegExp(escapeRegExp(cleanWord), 'gi');
      cleaned = cleaned.replace(asianRegex, '***');
    } else {
      const regex = new RegExp(`\\b${escapeRegExp(cleanWord)}\\b`, 'gi');
      cleaned = cleaned.replace(regex, '***');

      if (cleanWord.length >= 4) {
        const subRegex = new RegExp(escapeRegExp(cleanWord), 'gi');
        cleaned = cleaned.replace(subRegex, '***');
      }
    }
  });

  return cleaned;
};

export const hasProfanity = (text) => {
  if (!text) return false;
  const lower = text.toLowerCase().trim();
  if (!lower) return false;

  return BAD_WORDS.some((word) => {
    const cleanWord = word.toLowerCase().trim();
    if (!cleanWord) return false;

    if (isAsianText(cleanWord)) {
      return lower.includes(cleanWord);
    }

    const regex = new RegExp(`\\b${escapeRegExp(cleanWord)}\\b`, 'i');
    if (regex.test(lower)) return true;

    if (cleanWord.length >= 3 && lower.includes(cleanWord)) return true;

    return false;
  });
};

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isAsianText(text) {
  return /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uffef\u4e00-\u9faf\uac00-\ud7af]/.test(text);
}
