// Bynara & Cerebras AI Router Service for Bunnies World (100% matched with BotKasepChat & Up-to-Date Knowledge)

export const BYNARA_MODELS = [
  'agnes-2.0-flash',
  'mistral-large',
  'mistral-medium-3-5',
  'agnes-2.5-flash',
  'grok-4.5'
];

const DEFAULT_BYNARA_KEY = 'sk-nry-SeBr4oWCAcOhc3agiETfc7vrw2o3k9OATLPppaLj1mY';

const SYSTEM_PROMPT = `You are Bunny AI, the ultimate official AI assistant for Bunnies World — the interactive portal for NewJeans & Bunnies!

[IMPORTANT & ACCURATE NEWJEANS KNOWLEDGE BASE (2026 UPDATE)]
- Group Name: NewJeans (뉴진스) / NJZ (엔제이지). Agency: ADOR / HYBE. Debut: July 22, 2022 ("Attention") / August 1, 2022 (EP "New Jeans").
- Current Active Members (4 members): Minji (De Facto Leader/Rapper), Hanni (Vocalist), Haerin (Vocalist), Hyein (Maknae/Vocalist).
- Former Member: Danielle (Contract terminated on December 29, 2025 by ADOR). If asked how many members NewJeans currently has, state clearly: "4 active members (Minji, Hanni, Haerin, Hyein)".
- Fandom Name: Bunnies (Tokki / 토끼).
- Group Name Meaning: Jeans are timeless fashion items; wordplay on "new genes" ushering a new generation of pop music.

MEMBER DETAILS:
1. Minji (Kim Minji / 김민지): Born May 7, 2004 (Taurus). Height 169 cm. Blood Type A. MBTI: ESTJ. De facto leader & main rapper. Emoji: 🧸/🐻. Color: Blue/Yellow. Loves mystery novels & walks.
2. Hanni (Hanni Pham / Phạm Ngọc Hân): Born Oct 6, 2004 (Libra). Height 162 cm. Blood Type O. MBTI: INFP. Vietnamese-Australian. Vocalist. Emoji: 🦭/🦦/🐰. Color: Pink. Speaks Vietnamese, English, Korean. Plays ukulele.
3. Haerin (Kang Haerin / 강해린): Born May 15, 2006 (Taurus). Height 164.5 cm. Blood Type B. MBTI: INTP. Korean. Emoji: 🐱. Color: Green/White. Nickname Kitty Kang. Unpredictable cat charm.
4. Hyein (Lee Hyein / 이혜인): Born April 21, 2008 (Taurus). Height 170 cm. Blood Type O. MBTI: ISFP. Maknae. Emoji: 🐹/🐣. Color: Purple/Cyan. Cries easily (nickname "Faucet"). Former U.SSO Girl member.
5. Danielle (Former Member): Danielle Marsh / Mo Jihye. Born April 11, 2005. Contract terminated Dec 29, 2025.

DISCOGRAPHY & ACHIEVEMENTS:
- EPs: New Jeans (2022 - Attention, Hype Boy, Cookie, Hurt), Get Up (2023 - Super Shy, ETA, Cool with You, New Jeans).
- Singles: OMG (2023 - Ditto, OMG), How Sweet (2024 - How Sweet, Bubble Gum), Supernatural (2024 - Supernatural, Right Now).
- Milestones: #1 on Billboard 200 (Get Up), First K-pop girl group at Lollapalooza US, Billboard Women in Music Group of the Year 2024, KGMA Grand Artist Award 2024.

INSTRUCTIONS:
- Be cheerful, warm, enthusiastic, and use cute Bunny emojis (🐰✨)!
- Always respond accurately based on the up-to-date knowledge base above.
- Always match the user's language (Indonesian, English, Korean, Japanese, etc.).`;

async function callProvider(provider, messages) {
  if (!provider.key) {
    throw new Error(`Missing API Key for ${provider.name}`);
  }

  const payload = {
    model: provider.model,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ],
    temperature: 0.7,
    max_tokens: 1000
  };

  const response = await fetch(provider.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${provider.key}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`[${provider.name}] HTTP ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content;
  if (!reply) {
    throw new Error(`[${provider.name}] Invalid response format`);
  }

  return reply;
}

export async function sendMessageToAI(messages, model = 'mistral-medium-3-5') {
  // Method 1: Call Vercel Serverless Function proxy (/api/chat)
  // This bypasses browser CORS preflight restrictions completely
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, model })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.reply) return data.reply;
      if (data.error) throw new Error(data.error);
    }
  } catch (serverlessErr) {
    console.warn('Serverless proxy /api/chat error:', serverlessErr.message);
  }

  // Method 2: Direct Provider Call (for local static dev fallback)
  const bynaraKey = import.meta.env.VITE_BYNARA_API_KEY || DEFAULT_BYNARA_KEY;
  const cerebrasKey = import.meta.env.VITE_CEREBRAS_API_KEY || '';

  const isBynara = BYNARA_MODELS.includes(model);

  const primary = {
    name: isBynara ? 'Bynara' : 'Cerebras',
    url: isBynara ? 'https://router.bynara.id/v1/chat/completions' : 'https://api.cerebras.ai/v1/chat/completions',
    key: isBynara ? bynaraKey : cerebrasKey,
    model: model
  };

  const fallback = {
    name: isBynara ? 'Cerebras' : 'Bynara',
    url: isBynara ? 'https://api.cerebras.ai/v1/chat/completions' : 'https://router.bynara.id/v1/chat/completions',
    key: isBynara ? cerebrasKey : bynaraKey,
    model: isBynara ? 'gpt-oss-120b' : 'mistral-medium-3-5'
  };

  // Try Primary Provider
  try {
    const reply = await callProvider(primary, messages);
    if (reply) return reply;
  } catch (err) {
    console.warn(`Primary provider (${primary.name}) failed:`, err.message);
  }

  // Try Fallback Provider
  try {
    if (fallback.key) {
      const reply = await callProvider(fallback, messages);
      if (reply) return reply;
    }
  } catch (err) {
    console.error(`Fallback provider (${fallback.name}) failed:`, err.message);
  }

  throw new Error('Maaf, Bunny AI sedang sibuk. Silakan coba beberapa saat lagi! 🐰');
}
