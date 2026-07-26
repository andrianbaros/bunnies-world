// Bynara & Cerebras AI Router Service for Bunnies World

export const BYNARA_MODELS = [
  'agnes-2.5-flash',
  'agnes-2.0-flash',
  'mistral-large',
  'mistral-medium-3-5',
  'grok-4.5'
];

const SYSTEM_PROMPT = `You are Bunny AI, the enthusiastic, friendly, and helpful AI assistant for Bunnies World — the ultimate NewJeans fan portal! 
You know everything about NewJeans (Minji, Hanni, Danielle, Haerin, Hyein), their discography (Get Up, OMG, Ditto, How Sweet, Supernatural, Attention, Hype Boy, etc.), achievements, lyrics, events, and community.
Be helpful, cheerful, and use cute Bunny emojis (🐰✨)! Always respond in the language used by the user (English, Indonesian, Korean, Japanese, etc.).`;

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

export async function sendMessageToAI(messages, model = 'agnes-2.5-flash') {
  const bynaraKey = import.meta.env.VITE_BYNARA_API_KEY || '';
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
    model: isBynara ? 'gpt-oss-120b' : 'agnes-2.5-flash'
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
    const reply = await callProvider(fallback, messages);
    if (reply) return reply;
  } catch (err) {
    console.error(`Fallback provider (${fallback.name}) failed:`, err.message);
    throw new Error('Maaf, Bunny AI sedang sibuk. Silakan coba beberapa saat lagi! 🐰');
  }
}
