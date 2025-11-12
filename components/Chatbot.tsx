
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createChat } from '../services/geminiService';
import { ChatMessage, FeatureID } from '../types';
import { UserIcon, GeminiLogo, PaperAirplaneIcon } from './shared/Icons';
import Loader from './shared/Loader';
import { Chat } from '@google/genai';

interface ChatbotProps {
  onNavigate?: (id: FeatureID) => void;
}

const Chatbot: React.FC<ChatbotProps> = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChat(createChat());
    setMessages([
        { role: 'model', text: 'I am Quant AI, your sophisticated trading assistant. How can I help you analyze markets, devise strategies, or manage your portfolio today? You can ask things like "Primary earnings drivers for Broadcom?"' }
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || !chat) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chat.sendMessageStream({ message: input });
      let modelResponse = '';
      setMessages((prev) => [...prev, { role: 'model', text: '' }]);
      
      for await (const chunk of result) {
        modelResponse += chunk.text;
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = modelResponse;
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, chat]);

  return (
    <div className="flex flex-col h-[80vh] bg-[#161B22] rounded-lg shadow-2xl border border-[#30363D]">
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-[#25D366] to-green-600 flex items-center justify-center"><GeminiLogo className="h-5 w-5 text-white" /></div>}
            <div className={`max-w-xl p-4 rounded-2xl ${msg.role === 'user' ? 'bg-[#25D366] text-black rounded-br-none' : 'bg-[#30363D] text-[#E6EDF3] rounded-bl-none'}`}>
              <p className="text-sm prose prose-invert max-w-none prose-p:my-0 whitespace-pre-wrap">{msg.text}</p>
            </div>
            {msg.role === 'user' && <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-600 flex items-center justify-center"><UserIcon className="h-5 w-5 text-white" /></div>}
          </div>
        ))}
         {isLoading && (
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-[#25D366] to-green-600 flex items-center justify-center"><GeminiLogo className="h-5 w-5 text-white" /></div>
                <div className="max-w-md p-4 rounded-2xl bg-[#30363D] text-[#E6EDF3] rounded-bl-none flex items-center">
                    <Loader size="sm" />
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-[#30363D] bg-[#161B22] rounded-b-lg">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            placeholder="Ask about a stock..."
            className="w-full pl-4 pr-12 py-3 bg-[#0D1117] border border-[#30363D] rounded-full focus:ring-2 focus:ring-[#25D366] focus:outline-none text-[#E6EDF3]"
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading || !input.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#25D366] text-black hover:opacity-90 disabled:bg-slate-600 disabled:cursor-not-allowed transition">
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;