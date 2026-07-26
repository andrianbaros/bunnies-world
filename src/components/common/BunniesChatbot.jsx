import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Trash2, Minus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../contexts/SettingsContext';
import { sendMessageToAI } from '../../services/aiService';

export default function BunniesChatbot() {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);

  const selectedModel = settings.aiModel || 'mistral-medium-3-5';

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('bunnies_ai_chat');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Halo Bunny! 🐰✨ Saya Bunny AI, asistenmu di Bunnies World. Tanya saya apa saja tentang NewJeans!',
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
    scrollToBottom();
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

  const renderMessageWithLinks = (text) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s!.,)]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, i) => {
      if (part.match(/^https?:\/\//)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-bold text-pink-300 dark:text-pink-400 hover:opacity-80 transition-opacity break-all cursor-pointer"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const suggestions = [
    t('chatbot_suggestion_1', { defaultValue: 'Siapa saja member NewJeans?' }),
    t('chatbot_suggestion_2', { defaultValue: 'Apa lagu terbaru NewJeans?' }),
    t('chatbot_suggestion_3', { defaultValue: 'Ceritakan tentang Hanni' })
  ];

  const chatbotContent = (
    <>
      {/* Floating Collapsed Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-44 sm:bottom-28 right-4 sm:right-6 z-[99999]"
          >
            <button
              onClick={() => setIsOpen(true)}
              className="group relative flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-white/20 active:scale-95 cursor-pointer"
              title="Bunny AI Assistant"
            >
              <div className="relative flex items-center justify-center">
                <Sparkles className="w-5 h-5 animate-pulse text-white" />
              </div>
              <span className="font-extrabold text-xs tracking-wider uppercase pr-1">Bunny AI</span>

              {/* Pulsing indicator ring */}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500" />
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-44 sm:bottom-28 right-3 sm:right-6 z-[99999] w-[calc(100%-1.5rem)] max-w-[380px] sm:w-[380px] h-[460px] max-h-[60vh] rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header Bar */}
            <div className="p-4 bg-[var(--bg-subtle)] border-b border-[var(--border-color)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                    🐰
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[var(--bg-card)]" title="Online" />
                </div>
                <div className="flex flex-col text-left">
                  <h3 className="font-extrabold text-xs text-[var(--text-heading)] uppercase tracking-wider">
                    {t('chatbot_title', { defaultValue: 'BUNNY AI ASSISTANT' })}
                  </h3>
                  <span className="text-[9px] text-pink-600 dark:text-pink-400 font-bold">
                    Powered by Bynara AI Router
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleClearChat}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  title={t('chatbot_clear', { defaultValue: 'Clear Chat' })}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle-hover)] transition-colors"
                  title="Minimize"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat History Area */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 scrollbar-thin">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-full bg-pink-500/20 text-pink-600 dark:text-pink-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-pink-500/30">
                        🐰
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed font-sans shadow-xs whitespace-pre-wrap break-words ${
                        isUser
                          ? 'bg-pink-500 text-white rounded-br-none font-medium'
                          : 'bg-[var(--bg-subtle)] text-[var(--text-heading)] border border-[var(--border-color)] rounded-bl-none'
                      }`}
                    >
                      {renderMessageWithLinks(msg.content)}
                    </div>
                  </div>
                );
              })}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] italic">
                  <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center text-xs animate-bounce">
                    🐰
                  </div>
                  <span className="text-[11px] font-medium">{t('chatbot_thinking', { defaultValue: 'Bunny AI sedang berpikir... 🐰✨' })}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Chips */}
            {messages.length <= 2 && (
              <div className="px-3 py-2 bg-[var(--bg-subtle)]/50 border-t border-[var(--border-color)] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(s)}
                    className="px-2.5 py-1 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] text-[10px] text-[var(--text-secondary)] hover:text-pink-500 hover:border-pink-500/40 whitespace-nowrap transition-all shadow-2xs font-medium"
                  >
                    ✨ {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 bg-[var(--bg-subtle)] border-t border-[var(--border-color)] flex items-center gap-2">
              <input
                type="text"
                placeholder={t('chatbot_placeholder', { defaultValue: 'Tanya Bunny AI sesuatu...' })}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-grow bg-[var(--bg-input)] border border-[var(--border-color)] rounded-full px-4 py-2 text-xs text-[var(--text-heading)] placeholder-[var(--text-muted)] outline-none focus:border-pink-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center hover:bg-pink-600 transition-colors disabled:opacity-40 flex-shrink-0 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  return createPortal(chatbotContent, document.body);
}
