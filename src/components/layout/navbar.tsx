'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Music, Compass, Users, LayoutDashboard, LogIn, UserPlus } from 'lucide-react';

export function Navbar() {
  const { user, profile, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Music className="w-5 h-5 text-zinc-950 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white group-hover:text-amber-400 transition-colors">
                musio
              </span>
              <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-medium -mt-1">
                Direct to Artist
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/explore"
              className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-amber-500" />
              Explorar
            </Link>
            <Link
              href="/artists"
              className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-amber-500" />
              Artistas
            </Link>
          </nav>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href={profile?.role === 'artist' ? '/dashboard/artist' : '/dashboard'}
                className="px-3.5 py-2 rounded-lg text-sm font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition-colors flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4 text-amber-500" />
                <span>{profile?.role === 'artist' ? 'Painel do Artista' : 'Meu Painel'}</span>
              </Link>
              <button
                onClick={() => signOut()}
                className="text-xs text-zinc-400 hover:text-zinc-200 px-2 py-1 transition-colors"
              >
                Sair
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Entrar</span>
              </Link>
              <Link
                href="/register?role=artist"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 shadow-md shadow-amber-500/10 transition-all flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4 stroke-[2.5]" />
                <span>Sou Artista</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
