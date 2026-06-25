'use client';

import { useEffect } from 'react';
import { initializeStorage } from '@/lib/storage';

export default function Home() {
  useEffect(() => {
    initializeStorage();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-black to-red-900 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-2xl">
        {/* Logo / Título */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-red-500 drop-shadow-lg">
            🎮 English Quest
          </h1>
          <p className="text-xl text-gray-300">
            Aprenda inglês através de jogos e desafios!
          </p>
        </div>

        {/* Imagem/Ícone decorativo */}
        <div className="py-8">
          <div className="text-8xl animate-bounce">🇬🇧</div>
        </div>

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/auth/login"
            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transform transition-all hover:scale-105 shadow-lg shadow-red-500/50"
          >
            🔐 Login
          </a>
          <a
            href="/auth/register"
            className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transform transition-all hover:scale-105 border-2 border-red-500"
          >
            ✨ Cadastrar
          </a>
        </div>

        {/* Informações de Demo */}
        <div className="mt-8 p-6 bg-black/50 rounded-lg border border-red-500/30">
          <h3 className="text-lg font-semibold text-red-400 mb-3">📝 Usuários para Teste:</h3>
          <div className="text-left text-gray-300 space-y-2 text-sm">
            <p><strong className="text-red-400">Demo:</strong> demo@english.com | senha: demo123</p>
            <p><strong className="text-red-400">Admin:</strong> admin@english.com | senha: admin123</p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <div className="p-4 bg-black/30 rounded-lg border border-red-500/20">
            <div className="text-3xl mb-2">🎯</div>
            <h4 className="font-semibold text-red-400">Desafios</h4>
            <p className="text-sm text-gray-400">Questões interativas</p>
          </div>
          <div className="p-4 bg-black/30 rounded-lg border border-red-500/20">
            <div className="text-3xl mb-2">🏆</div>
            <h4 className="font-semibold text-red-400">Recompensas</h4>
            <p className="text-sm text-gray-400">Prêmios exclusivos</p>
          </div>
          <div className="p-4 bg-black/30 rounded-lg border border-red-500/20">
            <div className="text-3xl mb-2">📈</div>
            <h4 className="font-semibold text-red-400">Progresso</h4>
            <p className="text-sm text-gray-400">Suba de nível</p>
          </div>
        </div>
      </div>
    </div>
  );
}
