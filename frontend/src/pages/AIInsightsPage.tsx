import React, { useState } from 'react';
import api from '../services/api';
import { BrainCircuit, Send, Bot, User, Sparkles } from 'lucide-react';

export const AIInsightsPage: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    {
      sender: 'bot',
      text: 'Hello! I am UrjaMitra AI, your smart utility companion. How can I help you understand your electricity bill, tariff slabs, or unexpected charges today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', {
        message: userText,
        language
      });
      setMessages(prev => [...prev, { sender: 'bot', text: res.data.reply }]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: 'UrjaMitra AI is analyzing your bill. Please check your connectivity or try asking about slab tiers again.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-blue-600" />
            UrjaMitra AI Assistant
          </h2>
          <p className="text-sm text-slate-500">Ask questions in English or Hindi about your electricity bills, FPPCA, and fixed charges.</p>
        </div>

        {/* Language Toggle */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              language === 'en' ? 'bg-[#14243A] text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              language === 'hi' ? 'bg-[#14243A] text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            हिंदी
          </button>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-2">
        {[
          'Why did my electricity bill increase?',
          'What are fixed charges and demand charges?',
          'How can I save electricity to reduce slab rate?',
          'बिजली बिल कैसे कम करें?'
        ].map((prompt, i) => (
          <button
            key={i}
            onClick={() => setInput(prompt)}
            className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-full hover:border-blue-500 hover:text-blue-600 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[500px]">
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  UM
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 text-sm whitespace-pre-line leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                }`}
              >
                {m.text}
              </div>
              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  You
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Sparkles className="w-4 h-4 animate-spin text-blue-600" />
              <span>UrjaMitra AI is formulating advice...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-200 flex gap-2 bg-slate-50 rounded-b-xl">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={language === 'hi' ? 'अपना प्रश्न यहाँ लिखें...' : 'Ask UrjaMitra AI about your bill...'}
            className="flex-1 px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-2.5 bg-[#14243A] text-white rounded-lg hover:bg-slate-900 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
