// Vercel Serverless Function Proxy for Bynara AI Router (Solves Browser CORS Preflight Issue)

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
    const { messages, model } = req.body || {};
    const bynaraKey = process.env.VITE_BYNARA_API_KEY || process.env.BYNARA_API_KEY || 'sk-nry-SeBr4oWCAcOhc3agiETfc7vrw2o3k9OATLPppaLj1mY';

    const SYSTEM_PROMPT = `You are Bunny AI, the enthusiastic, friendly, and helpful AI assistant for Bunnies World — the ultimate NewJeans fan portal! 
You know everything about NewJeans (Minji, Hanni, Danielle, Haerin, Hyein), their discography (Get Up, OMG, Ditto, How Sweet, Supernatural, Attention, Hype Boy, etc.), achievements, lyrics, events, and community.
Be helpful, cheerful, and use cute Bunny emojis (🐰✨)! Always respond in the language used by the user (English, Indonesian, Korean, Japanese, etc.).`;

    const payload = {
      model: model || 'agnes-2.5-flash',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...(messages || [])
      ],
      temperature: 0.7,
      max_tokens: 1000
    };

    const response = await fetch('https://router.bynara.id/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bynaraKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: `[Bynara API HTTP ${response.status}] ${errText}` });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;
    if (!reply) {
      return res.status(500).json({ error: 'Invalid response format from Bynara AI' });
    }

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('API Chat Serverless Error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
