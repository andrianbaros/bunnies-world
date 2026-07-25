import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, RotateCcw, Trophy, Award } from 'lucide-react';
import quizData from '../data/json/quiz.json';
import { useSettings } from '../contexts/SettingsContext';

export default function Universe() {
  const { settings, updateSetting, unlockAchievement } = useSettings();

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
    }, 500);
  };

  const resetQuiz = () => {
    setCurrentQuizIdx(0);
    setSelectedOption(null);
    setScore(0);
    setIsQuizCompleted(false);
    setSoulBunny(null);
  };

  return (
    <div className="flex flex-col gap-8 py-6 px-4 max-w-4xl mx-auto z-10 relative">
      <div className="text-center flex flex-col items-center gap-3">
        <span className="px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 text-xs font-bold tracking-widest uppercase">
          KNOWLEDGE & TRIVIA
        </span>
        <h1 className="text-hero">
          BUNNIES TRIVIA & QUIZ
        </h1>
        <p className="text-sm text-slate-700 dark:text-gray-400 max-w-md">
          Test your NewJeans knowledge and discover your fandom affinity result!
        </p>
      </div>

      {/* Quiz Card */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-surface rounded-2xl p-6 sm:p-8 flex flex-col gap-6 border shadow-sm">
        <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-pink-500" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">TRIVIA CHALLENGE</h2>
          </div>
          <span className="text-xs font-semibold text-pink-600 dark:text-pink-400">Question {currentQuizIdx + 1} of {quizData.length}</span>
        </div>

        {!isQuizCompleted ? (
          <div className="flex flex-col gap-5">
            {/* Progress Bar */}
            <div className="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-pink-500 h-full transition-all duration-300" style={{ width: `${((currentQuizIdx + 1) / quizData.length) * 100}%` }} />
            </div>

            <h3 className="text-base font-bold text-gray-900 dark:text-white">{quizData[currentQuizIdx].question}</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quizData[currentQuizIdx].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuizAnswer(idx)}
                  className={`p-4 rounded-xl text-xs font-semibold text-left transition-all border ${
                    selectedOption === idx
                      ? idx === quizData[currentQuizIdx].answer
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                        : 'bg-rose-500/20 border-rose-500 text-rose-700 dark:text-rose-300'
                      : 'bg-black/5 dark:bg-black/40 border-black/10 dark:border-white/10 hover:border-pink-500/40 text-slate-900 dark:text-gray-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Quiz Results */
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <Trophy className="w-12 h-12 text-pink-500" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Quiz Completed!</h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-gray-300">
              You scored <span className="font-bold text-pink-600 dark:text-pink-400">{score}</span> out of {quizData.length}!
            </p>

            {soulBunny && (
              <div className="bg-black/5 dark:bg-black/40 p-5 rounded-xl border border-black/10 dark:border-white/10 max-w-md text-center flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 uppercase tracking-widest">Fandom Result</span>
                <h4 className="text-base font-bold text-gray-900 dark:text-white">{soulBunny.title}</h4>
                <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed">{soulBunny.desc}</p>
              </div>
            )}

            <button
              onClick={resetQuiz}
              className="px-6 py-2.5 rounded-full bg-pink-500 text-white font-semibold text-xs flex items-center gap-2 hover:bg-pink-600 transition-colors shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </button>
          </div>
        )}
      </motion.div>

      {/* Highscore Leaderboard */}
      <div className="glass-surface p-5 rounded-2xl flex items-center justify-between border">
        <div className="flex items-center gap-3">
          <Award className="w-5 h-5 text-pink-500" />
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 dark:text-white">Your High Score</h4>
            <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5">Saved in LocalStorage.</p>
          </div>
        </div>
        <span className="text-xl font-black text-pink-600 dark:text-pink-400">{settings.quizHighScore || 0} pts</span>
      </div>
    </div>
  );
}
