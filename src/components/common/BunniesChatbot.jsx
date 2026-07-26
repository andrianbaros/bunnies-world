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
      const formattedHistory = newHistory.map((m) => ({
        role: m.role,
        content: m.content
      }));

      const aiReplyText = await sendMessageToAI(formattedHistory, selectedModel);

      const aiMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: aiReplyText,
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('Chatbot API error:', err);
      const errorMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Maaf Bunny, koneksi AI sedang sibuk. Coba lagi beberapa saat ya! 🐰💖',
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    const reset = [
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Halo Bunny! 🐰✨ Chat telah dibersihkan. Tanya saya apa saja tentang NewJeans!',
        timestamp: new Date().toISOString()
      }
    ];
    setMessages(reset);
    localStorage.removeItem('bunnies_ai_chat');
  };

  const parseLinksInText = (text) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 dark:text-pink-400 font-extrabold underline hover:text-pink-700 dark:hover:text-pink-300 transition-colors inline-flex items-center gap-0.5 break-all"
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
            className="fixed bottom-20 sm:bottom-6 left-3 sm:left-6 z-[9990]"
          >
            <button
              onClick={() => setIsOpen(true)}
              className="group relative flex items-center justify-center gap-2 w-11 h-11 sm:w-auto sm:h-auto sm:px-4 sm:py-2.5 rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-pink-300/40 active:scale-95 cursor-pointer"
              title="Bunny AI Assistant"
            >
              <div className="relative flex items-center justify-center">
                <Sparkles className="w-5 h-5 animate-pulse text-white" />
              </div>
              <span className="hidden sm:inline font-black text-xs tracking-wider uppercase pr-1">Bunny AI</span>

              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500" />
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded iPhone Frost Glass Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-20 sm:bottom-6 left-3 sm:left-6 z-[99995] w-[calc(100%-1.5rem)] max-w-[380px] sm:w-[380px] h-[460px] max-h-[65vh] rounded-3xl border border-pink-500/30 bg-white/95 dark:bg-zinc-900/95 shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl"
          >
            {/* Header Bar */}
            <div className="p-4 bg-slate-100/90 dark:bg-zinc-800/90 border-b border-pink-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                    🐰
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-900" title="Online" />
                </div>
                <div className="flex flex-col text-left">
                  <h3 className="font-black text-xs text-slate-950 dark:text-white uppercase tracking-wider">
                    {t('chatbot_title', { defaultValue: 'BUNNY AI ASSISTANT' })}
                  </h3>
                  <span className="text-[9px] text-pink-600 dark:text-pink-400 font-extrabold">
                    Powered by Bynara AI Router
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleClearChat}
                  className="p-1.5 rounded-lg text-slate-500 dark:text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title={t('chatbot_clear', { defaultValue: 'Clear Chat' })}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
                  title={t('chatbot_minimize', { defaultValue: 'Minimize' })}
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-3">
              {messages.map((m) => {
                const isUser = m.role === 'user';
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col max-w-[85%] ${isUser ? 'self-end items-end' : 'self-start items-start'}`}
                  >
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold leading-relaxed shadow-2xs ${
                        isUser
                          ? 'bg-pink-500 text-white rounded-br-xs'
                          : 'bg-slate-100 dark:bg-zinc-800 text-slate-950 dark:text-white border border-pink-500/20 rounded-bl-xs'
                      }`}
                    >
                      {parseLinksInText(m.content)}
                    </div>
                    <span className="text-[9px] text-slate-500 dark:text-zinc-500 mt-1 px-1 font-medium">
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}

              {isLoading && (
                <div className="self-start flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 px-3 py-2 rounded-2xl border border-pink-500/20 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-spin" />
                  <span className="font-extrabold">{t('chatbot_thinking', { defaultValue: 'Bunny AI lagi ngetik...' })}</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions (if few messages) */}
            {messages.length <= 2 && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5 justify-center">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s)}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800/80 hover:bg-pink-50 dark:hover:bg-pink-500/10 text-slate-950 dark:text-white font-extrabold border border-pink-500/20 transition-all cursor-pointer shadow-2xs"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-slate-100/90 dark:bg-zinc-800/90 border-t border-pink-500/20 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={t('chatbot_input_ph', { defaultValue: 'Tanya Bunny AI...' })}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-grow bg-white dark:bg-zinc-900 border border-pink-500/20 rounded-2xl px-3.5 py-2 text-xs font-bold text-slate-950 dark:text-white placeholder-slate-400 dark:placeholder-zinc-400 outline-none focus:border-pink-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 rounded-xl bg-pink-500 text-white hover:bg-pink-600 transition-colors disabled:opacity-50 flex-shrink-0 cursor-pointer shadow-2xs"
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
