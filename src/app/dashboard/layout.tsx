'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import {
  LayoutDashboard,
  Music2,
  Disc3,
  BarChart3,
  DollarSign,
  Heart,
  Radio,
  UserCheck,
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile } = useAuth();

  const isArtist = profile?.role === 'artist' || pathname.startsWith('/dashboard/artist');

  const navItems = isArtist
    ? [
        { href: '/dashboard/artist', label: 'Visão Geral', icon: LayoutDashboard },
        { href: '/dashboard/artist/tracks', label: 'Minhas Músicas', icon: Music2 },
        { href: '/dashboard/artist/albums', label: 'Álbuns & EPs', icon: Disc3 },
        { href: '/dashboard/artist/analytics', label: 'Analytics & Plays', icon: BarChart3 },
        { href: '/dashboard/artist/earnings', label: 'Financeiro & Saques', icon: DollarSign },
        { href: '/dashboard/artist/profile', label: 'Editar Perfil', icon: UserCheck },
      ]
    : [
        { href: '/dashboard', label: 'Meu Feed', icon: LayoutDashboard },
        { href: '/explore', label: 'Descobrir Músicas', icon: Music2 },
        { href: '/artists', label: 'Artistas que Sigo', icon: Heart },
      ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar Lateral */}
      <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-zinc-950 font-bold">
              {profile?.display_name ? profile.display_name.charAt(0).toUpperCase() : 'M'}
            </div>
            <div className="truncate">
              <p className="font-bold text-sm text-white truncate">
                {profile?.display_name || 'Usuário Musio'}
              </p>
              <span className="text-[10px] uppercase tracking-wider font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                {isArtist ? 'Conta Artista' : 'Conta Fã'}
              </span>
            </div>
          </div>
        </div>

        {/* Links de navegação */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20 font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Link para alternar ou ver modo artista */}
        {!isArtist && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 space-y-2">
            <p className="text-xs font-semibold text-white">Você é produtor ou músico?</p>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Publique seus próprios lançamentos e receba apoio dos seus fãs.
            </p>
            <Link
              href="/dashboard/artist"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 pt-1"
            >
              <Radio className="w-3.5 h-3.5" /> Acessar Área do Artista
            </Link>
          </div>
        )}
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
