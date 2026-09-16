'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { usePlayer } from '@/contexts/player-context';
import { likeService } from '@/services/like.service';
import { TrackWithArtist } from '@/types/music.types';
import { TrackRow } from '@/components/track/track-row';
import { Heart, Play, Compass, Loader2 } from 'lucide-react';

export default function FavoritesPage() {
  const { user } = useAuth();
  const { playTrack } = usePlayer();
  const [tracks, setTracks] = useState<TrackWithArtist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      setLoading(true);
      try {
        const userId = user?.id || 'guest';
        const liked = await likeService.getUserLikedTracks(userId);
        setTracks(liked);
      } catch (err) {
        console.error('Erro ao carregar favoritos:', err);
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, [user]);

  const handlePlayAll = () => {
    if (tracks.length === 0) return;
    const playerQueue = tracks.map((t) => ({
      id: t.id,
      title: t.title,
      artistName: t.artist?.stage_name || 'Artista Musio',
      artistSlug: t.artist?.slug || '',
      audioUrl: t.audio_url,
      coverUrl: t.cover_url,
      durationSeconds: t.duration_seconds,
    }));
    playTrack(playerQueue[0], playerQueue);
  };

  return (
    <div className="space-y-8">
      {/* Header com banner estilizado */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-rose-950/60 via-zinc-900 to-zinc-950 border border-rose-500/20 p-6 md:p-8">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
              <Heart className="w-3.5 h-3.5 fill-rose-400" /> Minha Coleção
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Músicas Curtidas
            </h1>
            <p className="text-sm text-zinc-400 max-w-lg leading-relaxed">
              Todas as faixas que você favoritou no Musio reunidas em um só lugar.
              Apoie os produtores e curta sem limites.
            </p>
            <div className="text-xs text-zinc-500 font-mono">
              {loading ? 'Carregando faixas...' : `${tracks.length} ${tracks.length === 1 ? 'música' : 'músicas'}`}
            </div>
          </div>

          {tracks.length > 0 && (
            <button
              onClick={handlePlayAll}
              className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2.5 active:scale-95 flex-shrink-0"
            >
              <Play className="w-4 h-4 fill-zinc-950" />
              Tocar Tudo
            </button>
          )}
        </div>
      </div>

      {/* Lista de Faixas */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          <p className="text-sm font-medium">Buscando suas faixas favoritas...</p>
        </div>
      ) : tracks.length > 0 ? (
        <div className="space-y-2">
          {tracks.map((track, idx) => (
            <TrackRow key={track.id} track={track} index={idx} />
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
            <Heart className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Nenhuma música favoritada ainda</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Clique no ícone de coração em qualquer música enquanto navega ou escuta para salvá-la aqui.
            </p>
          </div>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-all"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            Explorar Músicas Agora
          </Link>
        </div>
      )}
    </div>
  );
}
