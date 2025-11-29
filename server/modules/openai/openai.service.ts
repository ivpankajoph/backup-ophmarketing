const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface Agent {
  id: string;
  name: string;
  systemPrompt?: string;
  instructions?: string;
  model?: string;
  temperature?: number;
}

export async function sendChatCompletion(
  messages: ChatMessage[],
  agent?: Agent
): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const model = agent?.model || OPENAI_MODEL;
  const temperature = agent?.temperature ?? 0.7;

  // Support both systemPrompt and instructions fields for backward compatibility
  const systemPromptContent = agent?.systemPrompt || agent?.instructions || '';
  const systemMessages: ChatMessage[] = systemPromptContent
    ? [{ role: 'system', content: systemPromptContent }]
    : [];

  const allMessages = [...systemMessages, ...messages];

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: allMessages,
        temperature,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response generated';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

export async function generateAgentResponse(
  userMessage: string,
  agent: Agent,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  const messages: ChatMessage[] = [
    ...conversationHistory,
    { role: 'user', content: userMessage },
  ];

  return sendChatCompletion(messages, agent);
}
