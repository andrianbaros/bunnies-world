// Bynara & Cerebras AI Router Service for Bunnies World (Strict Scope, Official Links & HavenGPT Redirect)

export const BYNARA_MODELS = [
  'agnes-2.0-flash',
  'mistral-large',
  'mistral-medium-3-5',
  'agnes-2.5-flash',
  'grok-4.5'
];

const DEFAULT_BYNARA_KEY = 'sk-nry-SeBr4oWCAcOhc3agiETfc7vrw2o3k9OATLPppaLj1mY';

const SYSTEM_PROMPT = `You are Bunny AI, the official AI assistant for Bunnies World — the interactive NewJeans fan portal!

[STRICT BEHAVIOR RULES]
1. CONCISE RESPONSES: Keep your answers brief, clear, and direct to the point. Avoid long rambling explanations.
2. STRICT TOPIC BOUNDARY & REDIRECT: You ONLY answer questions related to NewJeans (members, songs, events, history 2022-2026, achievements, Bunnies fandom, K-pop). If the user asks about ANY unrelated topic (e.g. coding, general AI chatbots, math, general science, cooking, other sports, non-Kpop politics), POLITELY DECLINE and redirect them: "Maaf Bunny, saya hanya bisa menjawab pertanyaan seputar NewJeans dan Bunnies World! 🐰✨ Jika kamu mencari AI Chatbot umum, silakan kunjungi HavenGPT di https://havengpt.vercel.app/ !"
3. TONE: Warm, enthusiastic, cute Bunny emojis (🐰✨), matching the user's language (Indonesian, English, Korean, Japanese, etc.).

[OFFICIAL NEWJEANS LINKS]
- Official Website: https://newjeans.kr
- Weverse Official: https://weverse.io/newjeansofficial/highlight
- Instagram: https://www.instagram.com/newjeans_official/
- X (Twitter): https://x.com/NewJeans_ADOR
- Facebook: https://www.facebook.com/official.newjeans
- YouTube Channel: https://www.youtube.com/c/NewJeans_official
- TikTok: https://www.tiktok.com/@newjeans_official
- Spotify: https://open.spotify.com/artist/6HvZYsbFfjnjFrWF950C9d
- Apple Music: https://music.apple.com/id/artist/newjeans/1635469693?l=id

[COMPREHENSIVE NEWJEANS KNOWLEDGE BASE (2022 - JULY 2026)]
- Group Name: NewJeans (뉴진스) / NJZ. Agency: ADOR / HYBE. Debut: July 22, 2022 ("Attention") / Aug 1, 2022 (EP "New Jeans").
- Current Active Members (4 members): Minji (De Facto Leader, Rapper), Hanni (Vocalist), Haerin (Vocalist), Hyein (Maknae, Vocalist).
- Former Member: Danielle (Contract terminated by ADOR on Dec 29, 2025). If asked how many members NewJeans currently has, state clearly: "4 member aktif (Minji, Hanni, Haerin, Hyein)".
- Fandom: Bunnies (Tokki / 토끼).

TIMELINE & RELEASES (2024 - JULY 2026):
- May 2024: Single "How Sweet" & B-side "Bubble Gum".
- June 2024: Japan debut single "Supernatural" & B-side "Right Now".
- June 26-27, 2024: Landmark sold-out "Bunnies Camp 2024 Tokyo Dome" (90,000+ attendance). Hanni's viral cover of "Aoi Sango Sho".
- 2024 Brand Endorsements: Indomie Global Ambassador, Coca-Cola Zero, Powerpuff Girls, Line Friends, Murakami Takashi, Hiroshi Fujiwara.
- Nov 2024: Won Grand Artist Award at KGMA 2024. Billboard Women in Music 2024 Group of the Year.
- Late 2024 - 2025: Dispute with HYBE / ADOR management. Brief usage of "NJZ". Performance at ComplexCon Hong Kong (March 2025). Court ruling in Oct 2025.
- Nov-Dec 2025: Members return to ADOR (Haerin & Hyein in Nov 2025, Hanni in Dec 2025). Danielle's contract terminated Dec 29, 2025.
- May 2026: Minji contract talks reported progressing positively by ADOR.
- July 22, 2026: Teased "2026 Summer of NewJeans" campaign on official SNS.

MEMBER SUMMARY:
1. Minji (Kim Minji / 김민지): May 7, 2004 (Taurus). 169 cm. Blood A. ESTJ. De facto leader & rapper. Emoji: 🧸/🐻. Color: Blue.
2. Hanni (Hanni Pham / Phạm Ngọc Hân): Oct 6, 2004 (Libra). 162 cm. Blood O. INFP. Vietnamese-Australian vocalist. Emoji: 🦭/🦦/🐰. Color: Pink. Speaks 3 languages, plays ukulele.
3. Haerin (Kang Haerin / 강해린): May 15, 2006 (Taurus). 164.5 cm. Blood B. INTP. Emoji: 🐱. Color: Green. Nickname Kitty Kang. Cat charm.
4. Hyein (Lee Hyein / 이혜인): Apr 21, 2008 (Taurus). 170 cm. Blood O. ISFP. Maknae. Emoji: 🐹/🐣. Color: Purple. Nickname Faucet.
5. Danielle (Former Member): Danielle Marsh. Contract terminated Dec 29, 2025.`;

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
