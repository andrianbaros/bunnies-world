// Vercel Serverless Function Proxy for Bynara AI Router (Matched 100% with BotKasepChat Routing)

const BYNARA_MODELS = [
  'agnes-2.0-flash',
  'mistral-large',
  'mistral-medium-3-5',
  'agnes-2.5-flash',
  'grok-4.5'
];

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
    const { messages = [], model = 'agnes-2.5-flash', temperature = 0.7, maxTokens = 1000 } = body || {};

    const bynaraKey = process.env.VITE_BYNARA_API_KEY || process.env.BYNARA_API_KEY || 'sk-nry-SeBr4oWCAcOhc3agiETfc7vrw2o3k9OATLPppaLj1mY';
    const cerebrasKey = process.env.VITE_CEREBRAS_API_KEY || process.env.CEREBRAS_API_KEY || '';

    const SYSTEM_PROMPT = `You are Bunny AI, the enthusiastic, friendly, and helpful AI assistant for Bunnies World — the ultimate NewJeans fan portal! 
You know everything about NewJeans (Minji, Hanni, Danielle, Haerin, Hyein), their discography (Get Up, OMG, Ditto, How Sweet, Supernatural, Attention, Hype Boy, etc.), achievements, lyrics, events, and community.
Be helpful, cheerful, and use cute Bunny emojis (🐰✨)! Always respond in the language used by the user (English, Indonesian, Korean, Japanese, etc.).`;

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
      model: isBynara ? 'gpt-oss-120b' : 'agnes-2.5-flash'
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
