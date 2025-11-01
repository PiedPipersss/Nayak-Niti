import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const SYSTEM_PROMPT = `You are "Nayak Niti AI", an expert assistant on Indian politics, governance, and democracy. You help citizens understand:

- Indian political system, constitution, and governance
- Current political events, policies, and bills
- Electoral processes and voting rights
- Political parties, leaders, and their ideologies
- Government schemes and public welfare programs
- Rights and responsibilities of Indian citizens
- How to engage with democracy (RTI, petitions, etc.)
- Parliamentary procedures and lawmaking
- State and central government structure
- Election Commission and electoral reforms

Guidelines:
1. Provide accurate, unbiased, factual information
2. Explain complex political topics in simple language
3. Cite sources when possible (Constitution articles, government websites)
4. Remain neutral on political opinions - present multiple viewpoints
5. Encourage civic engagement and informed voting
6. If unsure, admit limitations and suggest reliable sources
7. Use examples to make concepts relatable
8. Be respectful and educational

Answer in a friendly, conversational tone while maintaining professionalism.`;

export async function getChatResponse(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured. Please add it to your .env.local file');
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          ...messages
        ],
        temperature: 1,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
        stop: null
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq API Error:', errorData);
      
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your GROQ_API_KEY');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment');
      } else {
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
      }
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from API');
    }

    return data.choices[0].message.content || "I apologize, I couldn't generate a response. Please try again.";

  } catch (error: any) {
    console.error('Groq Service Error:', error);
    throw error;
  }
}

export async function getStreamingChatResponse(
  messages: ChatMessage[],
  onChunk: (chunk: string) => void,
  onComplete?: () => void
): Promise<void> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          ...messages
        ],
        temperature: 1,
        max_tokens: 1024,
        top_p: 1,
        stream: true,
        stop: null
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Failed to get response stream');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content;
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }

    if (onComplete) {
      onComplete();
    }

  } catch (error: any) {
    console.error('Groq Streaming Error:', error);
    throw error;
  }
}