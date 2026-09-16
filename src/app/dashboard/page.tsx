import React from 'react';
import Link from 'next/link';
import { trackService } from '@/services/track.service';
import { TrackRow } from '@/components/track/track-row';
import { Heart, Music, Sparkles } from 'lucide-react';

export default async function DashboardPage() {
  const tracks = await trackService.getExploreTracks();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Meu Painel de Ouvinte</h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Suas atividades recentes, artistas que você apoia e novas músicas recomendadas.
        </p>
      </div>

      {/* Cards de resumo rápido */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500" /> Artistas Apoiados
          </span>
          <p className="text-2xl font-black text-white">2</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5 text-amber-500" /> Músicas Ouvidas
          </span>
          <p className="text-2xl font-black text-white">48</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" /> Clubes Assinados
          </span>
          <p className="text-2xl font-black text-white">1</p>
        </div>
      </div>

      {/* Feed de Lançamentos Recentes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Lançamentos Recentes dos seus Artistas</h2>
          <Link href="/explore" className="text-xs font-semibold text-amber-400 hover:underline">
            Explorar mais
          </Link>
        </div>

        <div className="space-y-2">
          {tracks.slice(0, 4).map((t, idx) => (
            <TrackRow key={t.id} track={t} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}
