'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { trackService } from '@/services/track.service';
import { TrackWithArtist, PlayerTrack } from '@/types/music.types';
import { usePlayer } from '@/contexts/player-context';
import { formatDuration, formatCompactNumber } from '@/lib/utils';
import { Play, Pause, Disc3, Heart, ArrowLeft, Radio } from 'lucide-react';
import { SupportModal } from '@/components/artist/support-modal';

export default function TrackDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();

  const [track, setTrack] = useState<TrackWithArtist | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  useEffect(() => {
    async function loadTrack() {
      const all = await trackService.getExploreTracks();
      const found = all.find((t) => t.id === id);
      setTrack(found || all[0] || null);
      setLoading(false);
    }
    loadTrack();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Disc3 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!track) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <h1 className="text-xl font-bold text-white">Faixa não encontrada</h1>
      </div>
    );
  }

  const isCurrent = currentTrack?.id === track.id;

  const handlePlayClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      const pTrack: PlayerTrack = {
        id: track.id,
        title: track.title,
        artistName: track.artist.stage_name,
        artistSlug: track.artist.slug,
        audioUrl: track.audio_url,
        coverUrl: track.cover_url,
        durationSeconds: track.duration_seconds,
      };
      playTrack(pTrack);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link
        href="/explore"
        className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar ao catálogo
      </Link>

      {/* Hero da Faixa */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row items-center sm:items-end gap-6">
        <div className="w-44 h-44 rounded-2xl overflow-hidden bg-zinc-800 shadow-2xl flex-shrink-0">
          {track.cover_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={track.cover_url} alt={track.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-500">
              <Disc3 className="w-12 h-12" />
            </div>
          )}
        </div>

        <div className="space-y-3 flex-1 text-center sm:text-left">
          <span className="text-[10px] uppercase tracking-widest font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            {track.is_exclusive ? 'Faixa Exclusiva' : 'Single Independente'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">{track.title}</h1>
          <p className="text-zinc-400 text-sm">
            por{' '}
            <Link
              href={`/artist/${track.artist.slug}`}
              className="text-amber-400 font-semibold hover:underline"
            >
              {track.artist.stage_name}
            </Link>
          </p>

          <div className="flex items-center justify-center sm:justify-start gap-4 text-xs font-mono text-zinc-400 pt-1">
            <span>{formatDuration(track.duration_seconds)}</span>
            <span>•</span>
            <span>{formatCompactNumber(track.play_count)} reproduções</span>
            {track.bpm && (
              <>
                <span>•</span>
                <span>{track.bpm} BPM</span>
              </>
            )}
            {track.musical_key && (
              <>
                <span>•</span>
                <span>Tom: {track.musical_key}</span>
              </>
            )}
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <button
              onClick={handlePlayClick}
              className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              {isCurrent && isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>Tocar agora</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsSupportOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Apoiar este Artista</span>
            </button>
          </div>
        </div>
      </div>

      {/* Declaração de Direitos */}
      <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 text-xs text-zinc-400 flex items-center gap-2.5">
        <Radio className="w-4 h-4 text-amber-500 flex-shrink-0" />
        <span>
          O artista declara possuir integralmente os direitos autorais e fonomecânicos desta produção.
        </span>
      </div>

      {track.lyrics && (
        <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800 space-y-3">
          <h3 className="font-bold text-white text-base">Letra</h3>
          <p className="text-sm text-zinc-300 whitespace-pre-line leading-relaxed font-sans">
            {track.lyrics}
          </p>
        </div>
      )}

      <SupportModal
        artistId={track.artist.id}
        artistName={track.artist.stage_name}
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />
    </div>
  );
}
