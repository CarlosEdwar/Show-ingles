'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout, getQuestions, completeQuestion } from '@/lib/storage';
import { User, Question } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }
    setUser(currentUser);
    loadQuestion(currentUser.level);
  }, [router]);

  const loadQuestion = (level: number) => {
    const questions = getQuestions(level);
    const user = getCurrentUser();
    const availableQuestions = questions.filter(
      q => !user?.completedQuestions?.includes(q.id)
    );
    
    if (availableQuestions.length > 0) {
      setCurrentQuestion(availableQuestions[Math.floor(Math.random() * availableQuestions.length)]);
    } else {
      // Se não há mais questões neste nível, carrega do próximo
      if (level < 10) {
        loadQuestion(level + 1);
      } else {
        setCurrentQuestion(null);
      }
    }
  };

  const handleAnswer = (answerIndex: number) => {
    if (!currentQuestion || showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    const correct = answerIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      completeQuestion(currentQuestion.id, 10);
      setTimeout(() => {
        setShowResult(false);
        setSelectedAnswer(null);
        const updatedUser = getCurrentUser();
        setUser(updatedUser);
        loadQuestion(updatedUser?.level || 1);
      }, 2000);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-black to-red-900 p-4">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 p-4 bg-black/50 rounded-lg border border-red-500/30">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-red-500">🎮 English Quest</h1>
          <span className="text-gray-300">|</span>
          <span className="text-gray-300">{user.name}</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-xs text-gray-400">Nível</p>
              <p className="text-xl font-bold text-red-400">{user.level}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">Pontos</p>
              <p className="text-xl font-bold text-yellow-400">⭐ {user.points}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto space-y-8">
        {/* Current Question Card */}
        <div className="bg-black/50 backdrop-blur-sm rounded-lg border border-red-500/30 p-8">
          {currentQuestion ? (
            <>
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-red-600/30 text-red-400 rounded-full text-sm mb-4">
                  Nível {currentQuestion.level}
                </span>
                <h2 className="text-2xl font-bold text-white mb-6">
                  {currentQuestion.question}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showResult}
                    className={`p-4 rounded-lg border-2 transition-all text-left font-medium
                      ${showResult && index === currentQuestion.correctAnswer 
                        ? 'border-green-500 bg-green-900/30 text-green-400' 
                        : showResult && selectedAnswer === index && !isCorrect
                        ? 'border-red-500 bg-red-900/30 text-red-400'
                        : 'border-red-500/50 hover:border-red-500 hover:bg-red-900/20 text-white'
                      }
                      ${!showResult && 'hover:scale-105'}
                    `}
                  >
                    <span className="inline-block w-8 h-8 rounded-full bg-red-600/50 text-center leading-8 mr-3">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </button>
                ))}
              </div>

              {showResult && (
                <div className={`mt-6 p-4 rounded-lg ${isCorrect ? 'bg-green-900/30 border border-green-500' : 'bg-red-900/30 border border-red-500'}`}>
                  <p className={`font-bold mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    {isCorrect ? '🎉 Correto!' : '❌ Incorreto'}
                  </p>
                  <p className="text-gray-300">{currentQuestion.explanation}</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-2xl font-bold text-white mb-2">Parabéns!</h2>
              <p className="text-gray-300 mb-4">Você completou todas as questões disponíveis!</p>
              <button
                onClick={() => loadQuestion(user.level)}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
              >
                Praticar Novamente
              </button>
            </div>
          )}
        </div>

        {/* Rewards Section */}
        <div className="bg-black/50 backdrop-blur-sm rounded-lg border border-red-500/30 p-6">
          <h3 className="text-xl font-bold text-red-400 mb-4">🏆 Suas Recompensas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {user.unlockedRewards.length > 0 ? (
              user.unlockedRewards.map(rewardId => {
                // Simple reward display
                return (
                  <div key={rewardId} className="p-4 bg-red-900/20 rounded-lg border border-red-500/30 text-center">
                    <div className="text-3xl mb-2">🏅</div>
                    <p className="text-sm text-gray-300">Recompensa Desbloqueada</p>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400 col-span-full text-center py-4">
                Complete desafios para desbloquear recompensas!
              </p>
            )}
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg border border-red-500/30 p-6 text-center">
            <div className="text-3xl mb-2">📚</div>
            <p className="text-2xl font-bold text-white">
              {user.completedQuestions?.length || 0}
            </p>
            <p className="text-gray-400">Questões Completadas</p>
          </div>
          <div className="bg-black/50 backdrop-blur-sm rounded-lg border border-red-500/30 p-6 text-center">
            <div className="text-3xl mb-2">🔥</div>
            <p className="text-2xl font-bold text-white">{user.level}</p>
            <p className="text-gray-400">Nível Atual</p>
          </div>
          <div className="bg-black/50 backdrop-blur-sm rounded-lg border border-red-500/30 p-6 text-center">
            <div className="text-3xl mb-2">⭐</div>
            <p className="text-2xl font-bold text-yellow-400">{user.points}</p>
            <p className="text-gray-400">Pontos Totais</p>
          </div>
        </div>
      </main>
    </div>
  );
}
