'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export default function AdminDashboardPage() {
  const reports = [
    {
      id: 'rep-1',
      target: 'Faixa "Beat Trap Sample #4"',
      reporter: 'produtor_indie_sp',
      reason: 'Possível cópia não autorizada de melodia protegida',
      date: 'Há 2 horas',
      status: 'pending',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Área Administrativa Restrita</span>
        </div>
        <h1 className="text-3xl font-black text-white">Gestão da Plataforma Musio</h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Moderação de conteúdos, verificação de artistas, relatórios e controle de integridade de direitos.
        </p>
      </div>

      {/* Cards de Métricas da Plataforma */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-xs text-zinc-400 font-semibold">Total de Artistas</span>
          <p className="text-2xl font-black text-white">412</p>
          <span className="text-[11px] text-emerald-400">+28 cadastros esta semana</span>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-xs text-zinc-400 font-semibold">Total de Ouvintes/Fãs</span>
          <p className="text-2xl font-black text-white">18.940</p>
          <span className="text-[11px] text-emerald-400">Ativos na plataforma</span>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-xs text-zinc-400 font-semibold">Volume Transacionado</span>
          <p className="text-2xl font-black text-white font-mono">R$ 94.210</p>
          <span className="text-[11px] text-amber-400">Taxa média retida: 10%</span>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-xs text-zinc-400 font-semibold">Denúncias Pendentes</span>
          <p className="text-2xl font-black text-rose-400">1</p>
          <span className="text-[11px] text-zinc-500">Requer atenção da equipe</span>
        </div>
      </div>

      {/* Fila de Moderação e Copyright */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          Fila de Moderação & Direitos Autorais
        </h3>

        <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 divide-y divide-zinc-800/60 overflow-hidden">
          {reports.map((r) => (
            <div key={r.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">{r.target}</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Aguardando Análise
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Denunciado por <span className="text-zinc-300 font-semibold">@{r.reporter}</span> • {r.reason}
                </p>
                <span className="text-[11px] text-zinc-500">{r.date}</span>
              </div>

              <div className="flex items-center gap-2">
                <button className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200">
                  Dispensar
                </button>
                <button className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-xs font-semibold text-white">
                  Suspender Faixa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
