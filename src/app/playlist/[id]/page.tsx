'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { playlistService, PlaylistWithTracks } from '@/services/playlist.service';
import { usePlayer } from '@/contexts/player-context';
import { TrackRow } from '@/components/track/track-row';
import { formatDuration } from '@/lib/utils';
import {
  Play,
  Pause,
  ArrowLeft,
  Share2,
  Disc3,
  Globe,
  Lock,
  ListMusic,
  Clock,
  Compass,
  Check,
} from 'lucide-react';

export default function PlaylistPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();

  const [playlist, setPlaylist] = useState<PlaylistWithTracks | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadPlaylist() {
      if (!id) return;
      setLoading(false);
      try {
        const pl = await playlistService.getPlaylistById(id);
        setPlaylist(pl);
      } catch (err) {
        console.error('Erro ao carregar playlist:', err);
      } finally {
        setLoading(false);
      }
    }

    loadPlaylist();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Disc3 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Playlist não encontrada</h2>
        <p className="text-xs text-zinc-400">Esta playlist pode ter sido removida ou não existe.</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-xl bg-zinc-800 text-white text-xs font-semibold hover:bg-zinc-700 transition-colors"
        >
          Voltar
        </button>
      </div>
    );
  }

  const isCurrentPlaylistPlaying =
    playlist.tracks.length > 0 &&
    playlist.tracks.some((t) => t.id === currentTrack?.id) &&
    isPlaying;

  const totalDurationSeconds = playlist.tracks.reduce(
    (acc, t) => acc + (t.duration_seconds || 0),
    0
  );

  const handlePlayPlaylist = () => {
    if (playlist.tracks.length === 0) return;

    if (playlist.tracks.some((t) => t.id === currentTrack?.id)) {
      togglePlay();
      return;
    }

    const playerQueue = playlist.tracks.map((t) => ({
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

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Voltar */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-zinc-900 via-zinc-900/60 to-zinc-950 border border-zinc-800 p-6 md:p-8 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 shadow-2xl">
        {/* Cover */}
        <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden bg-zinc-800 shadow-2xl flex-shrink-0">
          {playlist.cover_url ? (
            <Image
              src={playlist.cover_url}
              alt={playlist.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-amber-500/20 via-zinc-800 to-orange-500/20 flex items-center justify-center">
              <Disc3 className="w-16 h-16 text-zinc-600" />
            </div>
          )}
        </div>

        {/* Informações */}
        <div className="flex-1 space-y-3 text-center md:text-left min-w-0">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-800/80 border border-zinc-700 text-zinc-300 text-[11px] font-mono">
            {playlist.is_public ? (
              <>
                <Globe className="w-3 h-3 text-amber-400" /> Playlist Pública
              </>
            ) : (
              <>
                <Lock className="w-3 h-3 text-zinc-400" /> Playlist Privada
              </>
            )}
          </div>

          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white tracking-tight break-words">
            {playlist.title}
          </h1>

          {playlist.description && (
            <p className="text-xs md:text-sm text-zinc-400 max-w-2xl leading-relaxed">
              {playlist.description}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-zinc-400 font-mono pt-1">
            <span className="flex items-center gap-1.5">
              <ListMusic className="w-3.5 h-3.5 text-amber-500" />
              {playlist.tracks.length} {playlist.tracks.length === 1 ? 'faixa' : 'faixas'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              {formatDuration(totalDurationSeconds)}
            </span>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-center md:justify-start gap-3 pt-4">
            {playlist.tracks.length > 0 && (
              <button
                onClick={handlePlayPlaylist}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2.5 active:scale-95"
              >
                {isCurrentPlaylistPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-zinc-950" /> Pausar
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-zinc-950" /> Tocar Playlist
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleShare}
              className="p-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors border border-zinc-700 flex items-center gap-2 text-xs font-semibold"
              title="Copiar link"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Compartilhar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Faixas */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Faixas da Playlist</h2>

        {playlist.tracks.length > 0 ? (
          <div className="space-y-2">
            {playlist.tracks.map((track, idx) => (
              <TrackRow key={track.id} track={track} index={idx} />
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-zinc-900/40 border border-zinc-800 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
              <Disc3 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Esta playlist ainda está vazia</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Explore as músicas independentes do catálogo e adicione suas faixas prediletas a esta seleção.
              </p>
            </div>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20"
            >
              <Compass className="w-4 h-4" />
              Explorar Faixas
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
