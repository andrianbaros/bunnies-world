// Vercel Serverless Function Proxy for Bynara AI Router (Matched 100% with BotKasepChat Routing & Up-to-Date NewJeans Knowledge)

const BYNARA_MODELS = [
  'agnes-2.0-flash',
  'mistral-large',
  'mistral-medium-3-5',
  'agnes-2.5-flash',
  'grok-4.5'
];

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

export default async function handler(req, res) {
  // Set CORS headers for frontend client
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }
    const { messages = [], model = 'mistral-medium-3-5', temperature = 0.7, maxTokens = 1000 } = body || {};

    const bynaraKey = process.env.VITE_BYNARA_API_KEY || process.env.BYNARA_API_KEY || 'sk-nry-SeBr4oWCAcOhc3agiETfc7vrw2o3k9OATLPppaLj1mY';
    const cerebrasKey = process.env.VITE_CEREBRAS_API_KEY || process.env.CEREBRAS_API_KEY || '';

    const formattedMessages = [...messages];
    const sysIdx = formattedMessages.findIndex((m) => m.role === 'system');
    if (sysIdx === -1) {
      formattedMessages.unshift({ role: 'system', content: SYSTEM_PROMPT });
    } else {
      formattedMessages[sysIdx].content = `${SYSTEM_PROMPT}\n\n${formattedMessages[sysIdx].content}`;
    }

    const isBynara = BYNARA_MODELS.includes(model);

    const primary = {
      name: isBynara ? 'Bynara' : 'Cerebras',
      url: isBynara ? 'https://router.bynara.id/v1/chat/completions' : 'https://api.cerebras.ai/v1/chat/completions',
      key: isBynara ? bynaraKey : cerebrasKey,
      model
    };

    const fallback = {
      name: isBynara ? 'Cerebras' : 'Bynara',
      url: isBynara ? 'https://api.cerebras.ai/v1/chat/completions' : 'https://router.bynara.id/v1/chat/completions',
      key: isBynara ? cerebrasKey : bynaraKey,
      model: isBynara ? 'gpt-oss-120b' : 'mistral-medium-3-5'
    };

    let replyContent = null;
    let lastError = null;

    // ── 1. Try primary ─────────────────────────────
    if (primary.key) {
      try {
        console.log(`[BunniesAI] Primary -> ${primary.name} / ${primary.model}`);
        const pRes = await fetch(primary.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${primary.key}`
          },
          body: JSON.stringify({
            model: primary.model,
            messages: formattedMessages,
            temperature,
            max_tokens: maxTokens,
            stream: false
          })
        });

        if (pRes.ok) {
          const pData = await pRes.json();
          replyContent = pData.choices?.[0]?.message?.content;
        } else {
          const errTxt = await pRes.text().catch(() => '');
          lastError = `[${primary.name}] ${pRes.status}: ${errTxt}`;
          console.warn(`[BunniesAI] Primary (${primary.name}) failed — ${lastError}`);
        }
      } catch (err) {
        lastError = `[${primary.name}] ${err.message}`;
        console.warn(`[BunniesAI] Primary (${primary.name}) threw:`, err);
      }
    } else {
      console.warn(`[BunniesAI] Primary key for ${primary.name} missing. Skipping to fallback.`);
    }

    // ── 2. Try fallback ────────────────────────────
    if (!replyContent && fallback.key) {
      try {
        console.log(`[BunniesAI] Fallback -> ${fallback.name} / ${fallback.model}`);
        const fRes = await fetch(fallback.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${fallback.key}`
          },
          body: JSON.stringify({
            model: fallback.model,
            messages: formattedMessages,
            temperature,
            max_tokens: maxTokens,
            stream: false
          })
        });

        if (fRes.ok) {
          const fData = await fRes.json();
          replyContent = fData.choices?.[0]?.message?.content;
        } else {
          const errTxt = await fRes.text().catch(() => '');
          lastError = `[${fallback.name}] ${fRes.status}: ${errTxt}`;
          console.warn(`[BunniesAI] Fallback (${fallback.name}) failed — ${lastError}`);
        }
      } catch (err) {
        lastError = `[${fallback.name}] ${err.message}`;
        console.warn(`[BunniesAI] Fallback (${fallback.name}) threw:`, err);
      }
    }

    if (!replyContent) {
      return res.status(503).json({ error: `Maaf, Bunny AI sedang sibuk. Detail: ${lastError || 'No provider available'}` });
    }

    return res.status(200).json({ reply: replyContent });
  } catch (err) {
    console.error('API Chat Serverless Error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
