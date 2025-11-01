import { NextRequest, NextResponse } from 'next/server';
import { getChatResponse, ChatMessage } from '@/lib/groqService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    console.log('Received messages:', messages.length);

    // Validate and convert messages
    const validMessages: ChatMessage[] = messages
      .filter((msg: any) => msg.role && msg.content)
      .map((msg: any) => ({
        role: msg.role === 'user' || msg.role === 'assistant' ? msg.role : 'user',
        content: String(msg.content).trim()
      }))
      .filter((msg: ChatMessage) => msg.content.length > 0);

    if (validMessages.length === 0) {
      return NextResponse.json(
        { error: 'No valid messages provided' },
        { status: 400 }
      );
    }

    console.log('Processing chat with', validMessages.length, 'messages');

    const response = await getChatResponse(validMessages);

    console.log('Got response, length:', response.length);

    return NextResponse.json({
      message: response,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    
    const errorMessage = error.message || 'Failed to process chat request';
    const statusCode = error.message?.includes('API key') ? 401 : 
                      error.message?.includes('Rate limit') ? 429 : 500;

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}