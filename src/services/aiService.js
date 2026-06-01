const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;
const API_URL = '/api/anthropic/v1/messages';

export const generateChatResponse = async (systemPrompt, conversationHistory, userMessage) => {
  if (!CLAUDE_API_KEY) {
    throw new Error('Claude API key is missing. Check your .env file.');
  }

  // Format history for Claude
  // Claude expects messages in the format: { role: 'user' | 'assistant', content: string }
  const messages = [...conversationHistory, { role: 'user', content: userMessage }];

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true' // Required for client-side fetch
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 150, // Increased to 150 to ensure sentences complete naturally, while still keeping it short
        system: systemPrompt,
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Claude API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
};

// Basic helper to fetch from Claude
const fetchFromClaude = async (systemPrompt, userMessage = 'Generate content.', maxTokens = 800) => {
  if (!CLAUDE_API_KEY) {
    throw new Error('Claude API key is missing. Check your .env file.');
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6', // Using the valid model for user's setup
      max_tokens: maxTokens, 
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Claude API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.content[0].text.trim();
};

export const generateTextContent = async (systemPrompt) => {
  console.log("=========================================");
  console.log("🤖 AGENT 1: REQUESTING TEXT POINTS");
  console.log("PROMPT:", systemPrompt);
  console.log("=========================================");
  
  const content = await fetchFromClaude(systemPrompt, 'Generate the memory trick.', 150);
  
  console.log("✅ AGENT 1: RECEIVED TEXT POINTS");
  console.log(content);
  console.log("=========================================");
  return content;
};

export const generateAudioScript = async (systemPrompt) => {
  console.log("=========================================");
  console.log("🗣️ AGENT 2: REQUESTING AUDIO SCRIPT");
  console.log("PROMPT:", systemPrompt);
  console.log("=========================================");
  
  const script = await fetchFromClaude(systemPrompt, 'Generate the spoken audio script.', 150);
  
  console.log("✅ AGENT 2: RECEIVED AUDIO SCRIPT");
  console.log(script);
  console.log("=========================================");
  return script;
};
