'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/storage';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Initialize storage on mount
    if (typeof window !== 'undefined') {
      const users = localStorage.getItem('english_game_users');
      if (!users) {
        // Will be initialized by home page
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = login(email, password);
    
    if (result.success && result.user) {
      if (result.user.isAdmin) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-black to-red-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg border border-red-500/30 p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-red-500">🎮 English Quest</h1>
            <p className="text-gray-300">Login para continuar</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-red-500/50 rounded-lg text-white focus:outline-none focus:border-red-500"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-red-500/50 rounded-lg text-white focus:outline-none focus:border-red-500"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
            >
              Entrar
            </button>
          </form>

          {/* Demo Users Info */}
          <div className="pt-4 border-t border-red-500/30">
            <p className="text-sm text-gray-400 text-center mb-2">Usuários de teste:</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Demo: demo@english.com | demo123</p>
              <p>Admin: admin@english.com | admin123</p>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <a href="/auth/register" className="text-red-400 hover:text-red-300 text-sm">
              Não tem conta? Cadastre-se
            </a>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <a href="/" className="text-gray-500 hover:text-gray-400 text-sm">
              ← Voltar ao início
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
