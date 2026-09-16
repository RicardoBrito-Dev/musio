import React from 'react';
import Link from 'next/link';
import {
  Play,
  Users,
  DollarSign,
  TrendingUp,
  Music2,
  ArrowUpRight,
  PlusCircle,
  ArrowRight,
} from 'lucide-react';
import { trackService } from '@/services/track.service';
import { TrackRow } from '@/components/track/track-row';

export default async function ArtistDashboardOverviewPage() {
  const tracks = await trackService.getExploreTracks();

  return (
    <div className="space-y-8">
      {/* Header com ações rápidas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Painel do Artista</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Acompanhe métricas de audiência, lançamentos e saldo em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/artist/tracks"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Publicar Música</span>
          </Link>
        </div>
      </div>

      {/* 1. VISÃO GERAL (CARDS DE MÉTRICAS) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Reproduções */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Reproduções</span>
            <Play className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-white">12.450</p>
          <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +18% este mês
          </span>
        </div>

        {/* Seguidores */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Seguidores</span>
            <Users className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-2xl font-black text-white">1.420</p>
          <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +94 novos fãs
          </span>
        </div>

        {/* Vendas / Apoios */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Vendas & Apoios</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-white">87</p>
          <span className="text-[11px] text-zinc-400">Transações diretas</span>
        </div>

        {/* Conteúdos */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Conteúdos Ativos</span>
            <Music2 className="w-4 h-4 text-cyan-500" />
          </div>
          <p className="text-2xl font-black text-white">6</p>
          <span className="text-[11px] text-zinc-400">3 faixas, 2 stems, 1 EP</span>
        </div>
      </div>

      {/* 2. CARD FINANCEIRO / CARTEIRA */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-white">Resumo Financeiro da Carteira</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div>
                <span className="text-xs text-zinc-400 block mb-0.5">Receita Total</span>
                <span className="text-2xl font-black text-white font-mono">R$ 2.843,20</span>
              </div>
              <div>
                <span className="text-xs text-zinc-400 block mb-0.5">Disponível p/ Saque</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">R$ 1.240,00</span>
              </div>
              <div>
                <span className="text-xs text-zinc-400 block mb-0.5">A Receber</span>
                <span className="text-2xl font-black text-amber-400 font-mono">R$ 384,20</span>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col justify-end gap-2 flex-shrink-0">
            <Link
              href="/dashboard/artist/earnings"
              className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Ver Extrato Completo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. MÚSICAS MAIS OUVIDAS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Music2 className="w-5 h-5 text-amber-500" />
            Músicas Mais Ouvidas
          </h2>
          <Link
            href="/dashboard/artist/tracks"
            className="text-xs font-semibold text-amber-400 hover:underline"
          >
            Gerenciar todas
          </Link>
        </div>

        <div className="space-y-2">
          {tracks.slice(0, 3).map((t, idx) => (
            <TrackRow key={t.id} track={t} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}
