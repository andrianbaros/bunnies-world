import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, CheckCircle2, RotateCcw, Trophy, Award, Sparkles } from 'lucide-react';
import quizData from '../data/json/quiz.json';
import { useSettings } from '../contexts/SettingsContext';

export default function Universe() {
  const { settings, updateSetting, unlockAchievement } = useSettings();

  // Quiz States
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [soulBunny, setSoulBunny] = useState(null);

  const soulTypes = [
    { title: 'Soul Bunny 🐰', desc: 'You are deeply synced with Hanni & Minji! Your warmth and musical passion radiate happiness.' },
    { title: 'Forever Bunny 🎧', desc: 'You are eternal! Your nostalgia for Ditto and classic Y2K beats is unmatched.' },
    { title: 'Ultimate Bunny 👑', desc: 'Flawless 100% score! You are a master NewJeans scholar!' }
  ];

  const handleQuizAnswer = (optionIdx) => {
    setSelectedOption(optionIdx);
    if (optionIdx === quizData[currentQuizIdx].answer) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentQuizIdx + 1 < quizData.length) {
        setCurrentQuizIdx((prev) => prev + 1);
        setSelectedOption(null);
      } else {
        const finalScore = score + (optionIdx === quizData[currentQuizIdx].answer ? 1 : 0);
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
    setCurrentQuizIdx(0);
    setSelectedOption(null);
    setScore(0);
    setIsQuizCompleted(false);
    setSoulBunny(null);
  };

  return (
    <div className="flex flex-col gap-10 py-8 px-4 max-w-4xl mx-auto z-10 relative">
      <div className="text-center flex flex-col items-center gap-3">
        <span className="px-4 py-1 rounded-full bg-cyan-400/10 border border-cyan-300/30 text-cyan-300 text-xs font-bold tracking-widest uppercase">
          KNOWLEDGE & ACHIEVEMENTS
        </span>
        <h1 className="text-hero font-extrabold bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
          BUNNIES TRIVIA & QUIZ
        </h1>
        <p className="text-body-custom text-gray-300 max-w-md">
          Test your NewJeans knowledge, unlock local achievements, and discover your Soul Bunny!
        </p>
      </div>

      {/* Quiz Card */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-surface-blue rounded-3xl p-6 sm:p-8 flex flex-col gap-6 border border-cyan-300/30 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-300" />
            <h2 className="text-base font-bold text-white">TRIVIA CHALLENGE</h2>
          </div>
          <span className="text-xs font-bold text-cyan-300">Question {currentQuizIdx + 1} of {quizData.length}</span>
        </div>

        {!isQuizCompleted ? (
          <div className="flex flex-col gap-5">
            {/* Progress Bar */}
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-400 to-pink-400 h-full transition-all duration-300" style={{ width: `${((currentQuizIdx + 1) / quizData.length) * 100}%` }} />
            </div>

            <h3 className="text-base font-bold text-white">{quizData[currentQuizIdx].question}</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quizData[currentQuizIdx].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuizAnswer(idx)}
                  className={`p-4 rounded-2xl text-xs font-bold text-left transition-all border ${
                    selectedOption === idx
                      ? idx === quizData[currentQuizIdx].answer
                        ? 'bg-green-500/20 border-green-400 text-green-300'
                        : 'bg-red-500/20 border-red-400 text-red-300'
                      : 'bg-black/40 border-white/10 hover:border-cyan-300/40 text-gray-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Quiz Results & Soul Bunny Result */
          <div className="flex flex-col items-center text-center gap-4 py-6">
            <Trophy className="w-14 h-14 text-yellow-300 animate-bounce" />
            <h3 className="text-2xl font-extrabold text-white">Quiz Completed!</h3>
            <p className="text-sm text-gray-300">You scored <span className="font-extrabold text-pink-300">{score}</span> out of {quizData.length}!</p>

            {soulBunny && (
              <div className="bg-black/30 p-5 rounded-2xl border border-pink-300/30 max-w-md text-center flex flex-col gap-2">
                <span className="text-xs font-bold text-pink-300 uppercase tracking-widest">Your Soul Bunny Result</span>
                <h4 className="text-lg font-bold text-white">{soulBunny.title}</h4>
                <p className="text-xs text-gray-300 leading-relaxed">{soulBunny.desc}</p>
              </div>
            )}

            <button onClick={resetQuiz} className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold text-xs flex items-center gap-2 hover:scale-105 transition-transform">
              <RotateCcw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </button>
          </div>
        )}
      </motion.div>

      {/* Local Highscore Leaderboard */}
      <div className="glass-surface p-6 rounded-3xl flex items-center justify-between border border-white/10">
        <div className="flex items-center gap-3">
          <Award className="w-6 h-6 text-pink-300" />
          <div>
            <h4 className="font-bold text-sm text-white">Your High Score</h4>
            <p className="text-xs text-gray-400">Persisted safely in LocalStorage.</p>
          </div>
        </div>
        <span className="text-2xl font-black text-pink-300">{settings.quizHighScore || 0} pts</span>
      </div>
    </div>
  );
}
