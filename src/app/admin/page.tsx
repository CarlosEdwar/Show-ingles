'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout, getQuestions, addQuestion, deleteQuestion, getRewards, addReward } from '@/lib/storage';
import { User, Question, Reward } from '@/types';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'questions' | 'rewards'>('questions');
  
  // Question form state
  const [newQuestion, setNewQuestion] = useState({
    level: 1,
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
  });

  // Reward form state
  const [newReward, setNewReward] = useState({
    name: '',
    description: '',
    cost: 0,
    icon: '🎁',
    requiredLevel: 1,
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.isAdmin) {
      router.push('/auth/login');
      return;
    }
    setUser(currentUser);
    loadQuestions();
    loadRewards();
  }, [router]);

  const loadQuestions = () => {
    const qs = getQuestions();
    setQuestions(qs);
  };

  const loadRewards = () => {
    const rw = getRewards();
    setRewards(rw);
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    
    const question: Question = {
      id: `question-${Date.now()}`,
      level: newQuestion.level,
      question: newQuestion.question,
      options: newQuestion.options,
      correctAnswer: newQuestion.correctAnswer,
      explanation: newQuestion.explanation,
    };

    addQuestion(question);
    loadQuestions();
    
    // Reset form
    setNewQuestion({
      level: 1,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
    });
  };

  const handleDeleteQuestion = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta questão?')) {
      deleteQuestion(id);
      loadQuestions();
    }
  };

  const handleAddReward = (e: React.FormEvent) => {
    e.preventDefault();
    
    const reward: Reward = {
      id: `reward-${Date.now()}`,
      name: newReward.name,
      description: newReward.description,
      cost: newReward.cost,
      icon: newReward.icon,
      requiredLevel: newReward.requiredLevel,
    };

    addReward(reward);
    loadRewards();
    
    // Reset form
    setNewReward({
      name: '',
      description: '',
      cost: 0,
      icon: '🎁',
      requiredLevel: 1,
    });
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
          <h1 className="text-2xl font-bold text-red-500">⚙️ Painel Admin</h1>
          <span className="text-gray-300">|</span>
          <span className="text-gray-300">{user.name}</span>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Sair
        </button>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-6 py-3 rounded-lg font-bold transition-colors ${
            activeTab === 'questions'
              ? 'bg-red-600 text-white'
              : 'bg-black/50 text-gray-400 hover:text-white'
          }`}
        >
          📝 Questões
        </button>
        <button
          onClick={() => setActiveTab('rewards')}
          className={`px-6 py-3 rounded-lg font-bold transition-colors ${
            activeTab === 'rewards'
              ? 'bg-red-600 text-white'
              : 'bg-black/50 text-gray-400 hover:text-white'
          }`}
        >
          🏆 Recompensas
        </button>
      </div>

      {/* Questions Tab */}
      {activeTab === 'questions' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Question Form */}
          <div className="bg-black/50 backdrop-blur-sm rounded-lg border border-red-500/30 p-6">
            <h2 className="text-xl font-bold text-red-400 mb-4">➕ Nova Questão</h2>
            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Nível</label>
                <select
                  value={newQuestion.level}
                  onChange={(e) => setNewQuestion({ ...newQuestion, level: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-black/50 border border-red-500/50 rounded-lg text-white focus:outline-none focus:border-red-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(lvl => (
                    <option key={lvl} value={lvl}>Nível {lvl}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Pergunta</label>
                <input
                  type="text"
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 border border-red-500/50 rounded-lg text-white focus:outline-none focus:border-red-500"
                  placeholder="Digite a pergunta em inglês"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Opções de Resposta</label>
                {newQuestion.options.map((opt, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={newQuestion.correctAnswer === idx}
                      onChange={() => setNewQuestion({ ...newQuestion, correctAnswer: idx })}
                      className="mt-3"
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOptions = [...newQuestion.options];
                        newOptions[idx] = e.target.value;
                        setNewQuestion({ ...newQuestion, options: newOptions });
                      }}
                      className="flex-1 px-4 py-2 bg-black/50 border border-red-500/50 rounded-lg text-white focus:outline-none focus:border-red-500"
                      placeholder={`Opção ${String.fromCharCode(65 + idx)}`}
                      required
                    />
                  </div>
                ))}
                <p className="text-xs text-gray-400 mt-1">Selecione o rádio da resposta correta</p>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Explicação</label>
                <textarea
                  value={newQuestion.explanation}
                  onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 border border-red-500/50 rounded-lg text-white focus:outline-none focus:border-red-500"
                  placeholder="Explique por que esta é a resposta correta (em português)"
                  rows={3}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
              >
                Adicionar Questão
              </button>
            </form>
          </div>

          {/* Questions List */}
          <div className="bg-black/50 backdrop-blur-sm rounded-lg border border-red-500/30 p-6">
            <h2 className="text-xl font-bold text-red-400 mb-4">📋 Questões Existentes ({questions.length})</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {questions.map((q) => (
                <div key={q.id} className="p-4 bg-black/30 rounded-lg border border-red-500/20">
                  <div className="flex justify-between items-start mb-2">
                    <span className="inline-block px-2 py-1 bg-red-600/30 text-red-400 rounded text-xs">
                      Nível {q.level}
                    </span>
                    <button
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                  <p className="text-white font-medium mb-2">{q.question}</p>
                  <div className="text-sm text-gray-400">
                    <p><strong>Resposta:</strong> {q.options[q.correctAnswer]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rewards Tab */}
      {activeTab === 'rewards' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Reward Form */}
          <div className="bg-black/50 backdrop-blur-sm rounded-lg border border-red-500/30 p-6">
            <h2 className="text-xl font-bold text-red-400 mb-4">➕ Nova Recompensa</h2>
            <form onSubmit={handleAddReward} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Nome</label>
                <input
                  type="text"
                  value={newReward.name}
                  onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 border border-red-500/50 rounded-lg text-white focus:outline-none focus:border-red-500"
                  placeholder="Ex: Badge Mestre"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Descrição</label>
                <input
                  type="text"
                  value={newReward.description}
                  onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 border border-red-500/50 rounded-lg text-white focus:outline-none focus:border-red-500"
                  placeholder="Ex: Complete 100 questões"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Custo (pontos)</label>
                  <input
                    type="number"
                    value={newReward.cost}
                    onChange={(e) => setNewReward({ ...newReward, cost: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-black/50 border border-red-500/50 rounded-lg text-white focus:outline-none focus:border-red-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Nível Mínimo</label>
                  <select
                    value={newReward.requiredLevel}
                    onChange={(e) => setNewReward({ ...newReward, requiredLevel: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-black/50 border border-red-500/50 rounded-lg text-white focus:outline-none focus:border-red-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(lvl => (
                      <option key={lvl} value={lvl}>Nível {lvl}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Ícone (emoji)</label>
                <input
                  type="text"
                  value={newReward.icon}
                  onChange={(e) => setNewReward({ ...newReward, icon: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 border border-red-500/50 rounded-lg text-white focus:outline-none focus:border-red-500"
                  placeholder="🎁"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
              >
                Adicionar Recompensa
              </button>
            </form>
          </div>

          {/* Rewards List */}
          <div className="bg-black/50 backdrop-blur-sm rounded-lg border border-red-500/30 p-6">
            <h2 className="text-xl font-bold text-red-400 mb-4">🎁 Recompensas Existentes ({rewards.length})</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {rewards.map((r) => (
                <div key={r.id} className="p-4 bg-black/30 rounded-lg border border-red-500/20 flex items-center gap-4">
                  <div className="text-4xl">{r.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white">{r.name}</h3>
                    <p className="text-sm text-gray-400">{r.description}</p>
                    <div className="flex gap-4 mt-1 text-xs">
                      <span className="text-yellow-400">⭐ {r.cost} pts</span>
                      <span className="text-red-400">Nível {r.requiredLevel}+</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
