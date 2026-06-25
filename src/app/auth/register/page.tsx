'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/storage';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    const result = registerUser(email, password, name);
    
    if (result.success) {
      router.push('/auth/login');
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
            <p className="text-gray-300">Crie sua conta gratuita</p>
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
              <label className="block text-gray-300 mb-2">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-red-500/50 rounded-lg text-white focus:outline-none focus:border-red-500"
                placeholder="Seu nome"
                required
              />
            </div>

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

            <div>
              <label className="block text-gray-300 mb-2">Confirmar Senha</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-red-500/50 rounded-lg text-white focus:outline-none focus:border-red-500"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
            >
              Cadastrar
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center">
            <a href="/auth/login" className="text-red-400 hover:text-red-300 text-sm">
              Já tem conta? Faça login
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
