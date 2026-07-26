import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, RotateCcw, Trophy, Award, Sparkles } from 'lucide-react';
import quizData from '../data/json/quiz.json';
import { useSettings } from '../contexts/SettingsContext';

// Fisher-Yates Shuffle helper
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Universe() {
  const { settings, updateSetting, unlockAchievement } = useSettings();

  // Pick 5 randomized questions for each quiz session
  const [sessionQuestions, setSessionQuestions] = useState(() => shuffleArray(quizData).slice(0, 5));
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [soulBunny, setSoulBunny] = useState(null);

  const soulTypes = [
    { title: 'Soul Bunny', desc: 'You are deeply synced with Hanni & Minji! Your warmth and musical passion radiate happiness.' },
    { title: 'Forever Bunny', desc: 'You are eternal! Your nostalgia for Ditto and classic Y2K beats is unmatched.' },
    { title: 'Ultimate Bunny', desc: 'Flawless score! You are a master NewJeans scholar!' }
  ];

  const handleQuizAnswer = (optionIdx) => {
    if (selectedOption !== null) return; // Prevent double clicks
    setSelectedOption(optionIdx);

    const isCorrect = optionIdx === sessionQuestions[currentQuizIdx].answer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentQuizIdx + 1 < sessionQuestions.length) {
        setCurrentQuizIdx((prev) => prev + 1);
        setSelectedOption(null);
      } else {
        const finalScore = score + (isCorrect ? 1 : 0);
        setIsQuizCompleted(true);

        const soul = finalScore >= 4 ? soulTypes[2] : finalScore >= 2 ? soulTypes[1] : soulTypes[0];
        setSoulBunny(soul);

        if (finalScore > (settings.quizHighScore || 0)) {
          updateSetting('quizHighScore', finalScore);
        }

        unlockAchievement('finishQuiz', 'Trivia Master Bunny');
      }
    }, 600);
  };

  const resetQuiz = () => {
    // Re-shuffle question bank and pick 5 new random questions
    setSessionQuestions(shuffleArray(quizData).slice(0, 5));
    setCurrentQuizIdx(0);
    setSelectedOption(null);
    setScore(0);
    setIsQuizCompleted(false);
    setSoulBunny(null);
  };

  const currentQ = sessionQuestions[currentQuizIdx];

  return (
    <div className="flex flex-col gap-8 py-6 px-4 max-w-4xl mx-auto z-10 relative">
      <div className="text-center flex flex-col items-center gap-3">
        <span className="px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 text-xs font-bold tracking-widest uppercase flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>KNOWLEDGE & TRIVIA</span>
        </span>
        <h1 className="text-hero">
          BUNNIES TRIVIA & QUIZ
        </h1>
        <p className="text-sm text-[var(--text-secondary)] max-w-md">
          Test your NewJeans knowledge and discover your fandom affinity result! (5 randomized questions per session)
        </p>
      </div>

      {/* Quiz Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-surface rounded-3xl p-6 sm:p-8 flex flex-col gap-6 border border-[var(--border-color)] shadow-sm bg-white/80 dark:bg-[var(--bg-card)]"
      >
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-pink-500" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">TRIVIA CHALLENGE</h2>
          </div>
          <span className="text-xs font-bold text-pink-600 dark:text-pink-400">
            Question {currentQuizIdx + 1} of {sessionQuestions.length}
          </span>
        </div>

        {!isQuizCompleted && currentQ ? (
          <div className="flex flex-col gap-5">
            {/* Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-[var(--bg-subtle)] h-2 rounded-full overflow-hidden">
              <div
                className="bg-pink-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${((currentQuizIdx + 1) / sessionQuestions.length) * 100}%` }}
              />
            </div>

            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
              {currentQ.question}
            </h3>

            {/* High-contrast options grid visible in Day & Night mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {currentQ.options.map((opt, idx) => {
                let btnStyle = 'bg-slate-100 dark:bg-[var(--bg-subtle)] border-slate-300 dark:border-[var(--border-color)] text-slate-900 dark:text-white hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-pink-500/10';

                if (selectedOption !== null) {
                  if (idx === currentQ.answer) {
                    btnStyle = 'bg-emerald-500 text-white border-emerald-600 font-extrabold shadow-sm';
                  } else if (selectedOption === idx) {
                    btnStyle = 'bg-rose-500 text-white border-rose-600 font-extrabold shadow-sm';
                  } else {
                    btnStyle = 'opacity-40 bg-slate-100 dark:bg-[var(--bg-subtle)] border-slate-200 dark:border-[var(--border-color)] text-slate-700 dark:text-gray-300';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedOption !== null}
                    onClick={() => handleQuizAnswer(idx)}
                    className={`p-4 rounded-xl text-xs sm:text-sm font-bold text-left transition-all border shadow-2xs leading-snug ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Quiz Results Page */
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <Trophy className="w-12 h-12 text-pink-500 animate-bounce" />
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Quiz Completed!</h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-[var(--text-secondary)] font-medium">
              You scored <span className="font-extrabold text-pink-600 dark:text-pink-400 text-base">{score}</span> out of {sessionQuestions.length}!
            </p>

            {soulBunny && (
              <div className="bg-slate-100 dark:bg-[var(--bg-subtle)] p-5 rounded-2xl border border-slate-300 dark:border-[var(--border-color)] max-w-md text-center flex flex-col gap-1.5 shadow-2xs">
                <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 uppercase tracking-widest">Fandom Result</span>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{soulBunny.title}</h4>
                <p className="text-xs text-slate-700 dark:text-[var(--text-secondary)] leading-relaxed font-medium">{soulBunny.desc}</p>
              </div>
            )}

            <button
              onClick={resetQuiz}
              className="px-6 py-3 rounded-full bg-pink-500 text-white font-bold text-xs flex items-center gap-2 hover:bg-pink-600 transition-colors shadow-sm mt-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Quiz (5 New Questions)</span>
            </button>
          </div>
        )}
      </motion.div>

      {/* Highscore Leaderboard */}
      <div className="glass-surface p-5 rounded-2xl flex items-center justify-between border border-[var(--border-color)] bg-white/70 dark:bg-[var(--bg-card)]">
        <div className="flex items-center gap-3">
          <Award className="w-5 h-5 text-pink-500" />
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">Your High Score</h4>
            <p className="text-xs text-slate-600 dark:text-[var(--text-muted)] mt-0.5 font-medium">Saved in LocalStorage.</p>
          </div>
        </div>
        <span className="text-xl font-black text-pink-600 dark:text-pink-400">{settings.quizHighScore || 0} pts</span>
      </div>
    </div>
  );
}
