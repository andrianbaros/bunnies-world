// Multi-language Profanity Filter Engine (English, Indonesian, Korean, Japanese)

const BAD_WORDS = [
  // Indonesian
  'anjing', 'babi', 'monyet', 'kuntul', 'kontol', 'memek', 'jancok', 'pantek', 'bangsat', 'bajingan',
  'kampang', 'itil', 'perek', 'goblok', 'tolol', 'bego', 'idiot', 'asu', 'bajingul', 'peler',
  
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
    // Create regex matching whole words case-insensitively
    const regex = new RegExp(`\\b${escapeRegExp(word)}\\b`, 'gi');
    cleaned = cleaned.replace(regex, '***');
    
    // Also match Asian non-space characters
    if (isAsianText(word)) {
      const asianRegex = new RegExp(escapeRegExp(word), 'gi');
      cleaned = cleaned.replace(asianRegex, '***');
    }
  });

  return cleaned;
};

export const hasProfanity = (text) => {
  if (!text) return false;
  return BAD_WORDS.some((word) => {
    if (isAsianText(word)) {
      return text.includes(word);
    }
    const regex = new RegExp(`\\b${escapeRegExp(word)}\\b`, 'i');
    return regex.test(text);
  });
};

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isAsianText(text) {
  return /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uffef\u4e00-\u9faf\uac00-\ud7af]/.test(text);
}
