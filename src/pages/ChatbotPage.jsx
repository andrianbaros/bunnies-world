import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, Send, Trash2, RefreshCw, Cpu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { sendMessageToAI, BYNARA_MODELS } from '../services/aiService';

export default function ChatbotPage() {
  const { t } = useTranslation();
  const [selectedModel, setSelectedModel] = useState('agnes-2.5-flash');
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('bunnies_ai_chat');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'welcome',
        role: 'assistant',
        content: t('chatbot_welcome', { defaultValue: 'Halo Bunny! 🐰✨ Saya Bunny AI, asistenmu di Bunnies World. Tanya saya apa saja tentang NewJeans!' }),
        timestamp: new Date().toISOString()
      }
    ];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('bunnies_ai_chat', JSON.stringify(messages));
    } catch (e) {}
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toISOString()
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const apiMessages = newHistory
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      const replyText = await sendMessageToAI(apiMessages, selectedModel);

      const aiMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('Chatbot error:', err);
      const errorMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: `⚠️ ${err.message || 'Maaf, terjadi kesalahan pada server AI.'}`,
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm(t('chatbot_clear_confirm', { defaultValue: 'Hapus semua riwayat percakapan?' }))) {
      const resetMsg = [
        {
          id: 'welcome',
          role: 'assistant',
          content: t('chatbot_welcome', { defaultValue: 'Halo Bunny! 🐰✨ Saya Bunny AI, asistenmu di Bunnies World. Tanya saya apa saja tentang NewJeans!' }),
          timestamp: new Date().toISOString()
        }
      ];
      setMessages(resetMsg);
      localStorage.removeItem('bunnies_ai_chat');
    }
  };

  const suggestions = [
    t('chatbot_suggestion_1', { defaultValue: 'Siapa saja member NewJeans?' }),
    t('chatbot_suggestion_2', { defaultValue: 'Apa lagu terbaru NewJeans?' }),
    t('chatbot_suggestion_3', { defaultValue: 'Ceritakan tentang Hanni' })
  ];

  return (
    <div className="flex flex-col gap-6 py-6 px-4 max-w-4xl mx-auto z-10 relative flex-grow w-full">
      {/* Header Banner */}
      <div className="text-center flex flex-col items-center gap-3">
        <span className="px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 text-xs font-bold tracking-widest uppercase flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>BUNNY AI ASSISTANT</span>
        </span>
        <h1 className="text-hero">
          {t('chatbot_title', { defaultValue: 'BUNNY AI ASSISTANT' })}
        </h1>
        <p className="text-sm text-[var(--text-secondary)] max-w-md">
          {t('chatbot_subtitle', { defaultValue: 'Tanya apa saja tentang NewJeans!' })}
        </p>
      </div>

      {/* Main Full-Page Chat Container */}
      <div className="glass-surface rounded-3xl border border-[var(--border-color)] flex flex-col h-[600px] max-h-[75vh] shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Chat Control Header */}
        <div className="p-4 bg-[var(--bg-subtle)] border-b border-[var(--border-color)] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white text-lg shadow-md">
              🐰
            </div>
            <div>
              <h2 className="font-bold text-sm text-[var(--text-heading)]">Bunny AI Assistant</h2>
              <span className="text-[10px] text-pink-500 font-semibold">Online • Powered by Bynara AI</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-3 py-1.5">
              <Cpu className="w-3.5 h-3.5 text-pink-500" />
              <span className="text-xs text-[var(--text-muted)] font-medium">Model:</span>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-transparent text-xs font-bold text-[var(--text-heading)] outline-none cursor-pointer"
              >
                {BYNARA_MODELS.map((m) => (
                  <option key={m} value={m} className="bg-[var(--bg-popover)]">{m}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleClearChat}
              className="px-3.5 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-500 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t('chatbot_clear', { defaultValue: 'Hapus Chat' })}</span>
            </button>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-600 dark:text-pink-400 font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5 border border-pink-500/30">
                    🐰
                  </div>
                )}
                <div
                  className={`max-w-[85%] sm:max-w-[70%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed font-sans shadow-xs whitespace-pre-wrap break-words ${
                    isUser
                      ? 'bg-pink-500 text-white rounded-br-none font-medium'
                      : 'bg-[var(--bg-subtle)] text-[var(--text-heading)] border border-[var(--border-color)] rounded-bl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] italic">
              <div className="w-7 h-7 rounded-full bg-pink-500/20 flex items-center justify-center text-xs animate-bounce">
                🐰
              </div>
              <span className="font-medium">{t('chatbot_thinking', { defaultValue: 'Bunny AI sedang berpikir... 🐰✨' })}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions Chips */}
        {messages.length <= 2 && (
          <div className="px-5 py-2.5 bg-[var(--bg-subtle)]/50 border-t border-[var(--border-color)] flex items-center gap-2 overflow-x-auto">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s)}
                className="px-3 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-secondary)] hover:text-pink-500 hover:border-pink-500/40 whitespace-nowrap transition-all shadow-xs font-medium"
              >
                ✨ {s}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-4 bg-[var(--bg-subtle)] border-t border-[var(--border-color)] flex items-center gap-3">
          <input
            type="text"
            placeholder={t('chatbot_placeholder', { defaultValue: 'Tanya Bunny AI sesuatu...' })}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-grow bg-[var(--bg-input)] border border-[var(--border-color)] rounded-full px-5 py-3 text-xs sm:text-sm text-[var(--text-heading)] placeholder-[var(--text-muted)] outline-none focus:border-pink-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 rounded-full bg-pink-500 text-white font-bold text-xs sm:text-sm hover:bg-pink-600 transition-colors flex items-center gap-2 disabled:opacity-40 shadow-sm"
          >
            <span>{t('chatbot_send', { defaultValue: 'Kirim' })}</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
