"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MessageCircle, 
  X, 
  Send, 
  Minimize2, 
  Maximize2,
  Bot,
  User,
  Sparkles,
  Info,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  "What is the structure of Indian Parliament?",
  "How does voting work in India?",
  "What are fundamental rights?",
  "Explain the role of President vs Prime Minister",
  "What is RTI and how to file it?",
  "How are bills passed in Parliament?"
];

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm Nayak Niti AI, your guide to Indian politics and governance. Ask me anything about the political system, policies, leaders, or how to participate in democracy! 🇮🇳",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage.trim();
    
    if (!textToSend) return;

    const userMessage: Message = {
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();

      if (data.message) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('No response received');
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      setError(error.message || 'Something went wrong');
      
      const errorMessage: Message = {
        role: 'assistant',
        content: `I apologize, but I encountered an error: ${error.message}. Please try again in a moment.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-[#FF9800] to-[#F57C00] text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        aria-label="Open chat"
      >
        <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#4CAF50] rounded-full animate-pulse"></span>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80' : 'w-96'
    }`}>
      <Card className="shadow-2xl border-2 border-[#FF9800] overflow-hidden">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-[#FF9800] to-[#F57C00] text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Nayak Niti</CardTitle>
                <p className="text-xs text-orange-100">Your Political Guide</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
                aria-label={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0">
            {/* Error Banner */}
            {error && (
              <div className="bg-red-50 border-b border-red-200 p-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 bg-gradient-to-b from-orange-50/30 to-white space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-[#00BCD4] to-[#0097A7]'
                      : 'bg-gradient-to-br from-[#FF9800] to-[#F57C00]'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`flex-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block max-w-[85%] p-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-[#00BCD4] to-[#0097A7] text-white rounded-tr-none'
                        : 'bg-white border-2 border-orange-100 text-[#263238] rounded-tl-none shadow-sm'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <p className="text-xs text-[#9E9E9E] mt-1 px-2">
                      {message.timestamp.toLocaleTimeString('en-IN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF9800] to-[#F57C00] flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white border-2 border-orange-100 p-3 rounded-2xl rounded-tl-none">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-[#FF9800] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-[#FF9800] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-[#FF9800] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length === 1 && (
              <div className="px-4 py-3 bg-orange-50/50 border-t border-orange-100">
                <p className="text-xs font-semibold text-[#263238] mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#FF9800]" />
                  Try asking:
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUESTIONS.slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question)}
                      disabled={isLoading}
                      className="text-xs bg-white hover:bg-gradient-to-r hover:from-[#FF9800] hover:to-[#F57C00] hover:text-white border border-orange-200 text-[#424242] px-3 py-1.5 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 bg-white border-t-2 border-orange-100">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about Indian politics..."
                  disabled={isLoading}
                  className="flex-1 border-2 border-orange-200 focus:border-[#FF9800] rounded-xl"
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-gradient-to-r from-[#FF9800] to-[#F57C00] hover:from-[#F57C00] hover:to-[#E65100] text-white rounded-xl px-4"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs text-[#9E9E9E]">
                <Info className="w-3 h-3" />
                <span>Powered by Groq AI • Always verify important information</span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ChatBot;