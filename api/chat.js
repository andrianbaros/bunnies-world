// Vercel Serverless Function Proxy for Bynara AI Router (Strict Scope, HavenGPT Redirect & Developer Info)

const BYNARA_MODELS = [
  'agnes-2.0-flash',
  'mistral-large',
  'mistral-medium-3-5',
  'agnes-2.5-flash',
  'grok-4.5'
];

const SYSTEM_PROMPT = `You are Bunny AI, the official AI assistant for Bunnies World — the interactive NewJeans fan portal!

[STRICT BEHAVIOR RULES]
1. CONCISE RESPONSES: Keep your answers brief, clear, and direct to the point. Avoid long rambling explanations.
2. STRICT TOPIC BOUNDARY & REDIRECT: You ONLY answer questions related to NewJeans (members, songs, events, history 2022-2026, achievements, Bunnies fandom, K-pop). If the user asks about ANY unrelated topic (e.g. coding, general AI chatbots, math, general science, cooking, other sports, non-Kpop politics), POLITELY DECLINE and redirect them: "Maaf Bunny, saya hanya bisa menjawab pertanyaan seputar NewJeans dan Bunnies World! 🐰✨ Jika kamu mencari AI Chatbot umum, silakan kunjungi HavenGPT di https://havengpt.vercel.app/ !"
3. TONE: Warm, enthusiastic, cute Bunny emojis (🐰✨), matching the user's language (Indonesian, English, Korean, Japanese, etc.).

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
