'use client';

import React from 'react';
import { usePlayer } from '@/contexts/player-context';
import { TrackWithArtist, PlayerTrack } from '@/types/music.types';
import { formatDuration, formatCompactNumber } from '@/lib/utils';
import { Play, Pause, Disc3 } from 'lucide-react';

interface TrackRowProps {
  track: TrackWithArtist;
  index?: number;
}

export function TrackRow({ track }: TrackRowProps) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();

  const isCurrent = currentTrack?.id === track.id;

  const handlePlayClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      const playerTrack: PlayerTrack = {
        id: track.id,
        title: track.title,
        artistName: track.artist?.stage_name || 'Artista',
        artistSlug: track.artist?.slug || '',
        audioUrl: track.audio_url,
        coverUrl: track.cover_url,
        durationSeconds: track.duration_seconds,
      };
      playTrack(playerTrack);
    }
  };

  return (
    <div
      className={`group flex items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all border ${
        isCurrent
          ? 'bg-amber-500/10 border-amber-500/30'
          : 'bg-zinc-900/40 hover:bg-zinc-900/80 border-transparent hover:border-zinc-800'
      }`}
    >
      {/* Esquerda: Número/Play + Capa + Título */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Play Button */}
        <button
          onClick={handlePlayClick}
          className="w-8 h-8 rounded-full flex items-center justify-center bg-zinc-800 group-hover:bg-amber-500 text-zinc-400 group-hover:text-zinc-950 transition-all flex-shrink-0"
        >
          {isCurrent && isPlaying ? (
            <Pause className="w-4 h-4 fill-current text-amber-500 group-hover:text-zinc-950" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          )}
        </button>

        {/* Capa */}
        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0">
          {track.cover_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={track.cover_url} alt={track.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-400">
              <Disc3 className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Título e Artista */}
        <div className="min-w-0 pr-2">
          <p
            className={`font-semibold text-sm truncate ${
              isCurrent ? 'text-amber-400' : 'text-zinc-200'
            }`}
          >
            {track.title}
          </p>
          <p className="text-xs text-zinc-400 truncate">
            {track.artist?.stage_name}
          </p>
        </div>
      </div>

      {/* Direita: Plays, Duração */}
      <div className="flex items-center gap-4 text-xs text-zinc-400 font-mono">
        <span className="hidden sm:inline text-zinc-400">
          {formatCompactNumber(track.play_count)} plays
        </span>
        <span className="w-10 text-right">{formatDuration(track.duration_seconds)}</span>
      </div>
    </div>
  );
}
