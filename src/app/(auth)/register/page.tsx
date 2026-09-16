'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { UserRole } from '@/types/database.types';
import { Music, ArrowRight, AlertCircle, Headphones, Radio, Disc3 } from 'lucide-react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<UserRole>(() => (searchParams.get('role') === 'artist' ? 'artist' : 'fan'));
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authService.signUp({
        email,
        password,
        displayName,
        role,
      });
      router.push(role === 'artist' ? '/dashboard/artist' : '/dashboard');
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-zinc-900/70 border border-zinc-800 p-8 rounded-3xl backdrop-blur-xl shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
          <Music className="w-6 h-6 text-zinc-950 stroke-[2.5]" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Criar Conta no Musio</h1>
        <p className="text-xs text-zinc-400">
          Música independente, direto de quem faz.
        </p>
      </div>

      {/* Seletor de Perfil: Fan vs Artist */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-zinc-950 rounded-2xl border border-zinc-800">
        <button
          type="button"
          onClick={() => setRole('fan')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            role === 'fan'
              ? 'bg-zinc-800 text-amber-400 shadow-md'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Headphones className="w-3.5 h-3.5" />
          <span>Sou Fã / Ouvinte</span>
        </button>
        <button
          type="button"
          onClick={() => setRole('artist')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            role === 'artist'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 shadow-md'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Sou Artista</span>
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
            {role === 'artist' ? 'Nome Artístico / Banda' : 'Seu Nome'}
          </label>
          <input
            type="text"
            required
            placeholder={role === 'artist' ? 'Ex: Rick Beatz' : 'Ex: Alex Silva'}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-300 block mb-1.5">E-mail</label>
          <input
            type="email"
            required
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Senha</label>
          <input
            type="password"
            required
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-zinc-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
        >
          {loading ? 'Cadastrando...' : role === 'artist' ? 'Criar Perfil de Artista' : 'Criar Conta de Fã'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="pt-4 border-t border-zinc-800/80 text-center text-xs text-zinc-400">
        Já possui conta?{' '}
        <Link href="/login" className="font-semibold text-amber-400 hover:underline">
          Fazer login
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-8">
      <Suspense
        fallback={
          <div className="p-8 text-center text-zinc-500">
            <Disc3 className="w-8 h-8 animate-spin text-amber-500 mx-auto" />
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </div>
  );
}
