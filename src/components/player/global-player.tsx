'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePlayer } from '@/contexts/player-context';
import { formatDuration } from '@/lib/utils';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ListMusic,
  Disc3,
  X,
  Heart,
} from 'lucide-react';

export function GlobalPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isCurrentLiked,
    queue,
    togglePlay,
    nextTrack,
    previousTrack,
    seek,
    setVolume,
    toggleMute,
    toggleCurrentLike,
    playTrack,
  } = usePlayer();

  const [showQueue, setShowQueue] = useState(false);

  if (!currentTrack) {
    return null;
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Drawer da Fila (Modal/Flyout) */}
      {showQueue && (
        <div className="fixed bottom-24 right-4 z-50 w-80 max-h-96 bg-zinc-900/95 border border-zinc-800 rounded-2xl shadow-2xl p-4 backdrop-blur-xl flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-2">
            <div className="flex items-center gap-2">
              <ListMusic className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-semibold text-white">Fila de Reprodução</h3>
            </div>
            <button
              onClick={() => setShowQueue(false)}
              className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-y-auto space-y-1.5 flex-1 pr-1 custom-scrollbar">
            {queue.map((track, idx) => {
              const isCurrent = track.id === currentTrack.id;
              return (
                <div
                  key={`${track.id}-${idx}`}
                  onClick={() => playTrack(track)}
                  className={`p-2 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-colors ${
                    isCurrent
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'hover:bg-zinc-800/60 text-zinc-300'
                  }`}
                >
                  <div className="truncate pr-2">
                    <p className="font-medium truncate">{track.title}</p>
                    <p className="text-[11px] text-zinc-400 truncate">{track.artistName}</p>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {formatDuration(track.durationSeconds)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Barra do Player Persistente */}
      <aside aria-label="Audio Player" className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 border-t border-zinc-800/80 backdrop-blur-xl shadow-2xl text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Lado Esquerdo: Info da Faixa + Botão de Curtir */}
          <div className="flex items-center gap-3 min-w-[180px] sm:min-w-[240px] max-w-[30%]">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 flex-shrink-0">
              {currentTrack.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-400">
                  <Disc3 className="w-6 h-6 animate-spin" style={{ animationDuration: '4s' }} />
                </div>
              )}
            </div>

            <div className="truncate min-w-0 flex-1">
              <Link
                href={`/track/${currentTrack.id}`}
                className="font-medium text-sm text-zinc-100 hover:text-amber-400 truncate block transition-colors"
              >
                {currentTrack.title}
              </Link>
              <Link
                href={`/artist/${currentTrack.artistSlug}`}
                className="text-xs text-zinc-400 hover:text-zinc-200 truncate block transition-colors"
              >
                {currentTrack.artistName}
              </Link>
            </div>

            <button
              onClick={toggleCurrentLike}
              className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
                isCurrentLiked ? 'text-rose-500' : 'text-zinc-500 hover:text-rose-400'
              }`}
              title={isCurrentLiked ? 'Descurtir' : 'Curtir'}
            >
              <Heart className={`w-4 h-4 ${isCurrentLiked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Centro: Controles e Barra de Progresso */}
          <div className="flex-1 max-w-xl flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-3 sm:gap-5">
              <button
                onClick={previousTrack}
                className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                title="Faixa anterior"
              >
                <SkipBack className="w-4 h-4 fill-current" />
              </button>

              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 flex items-center justify-center shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
                title={isPlaying ? 'Pausar' : 'Tocar'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={nextTrack}
                className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                title="Próxima faixa"
              >
                <SkipForward className="w-4 h-4 fill-current" />
              </button>
            </div>

            {/* Barra de Progresso e Tempos */}
            <div className="w-full flex items-center gap-2.5 text-[11px] font-mono text-zinc-400">
              <span className="w-9 text-right">{formatDuration(currentTime)}</span>
              <div
                className="relative flex-1 h-1.5 bg-zinc-800 rounded-full cursor-pointer group"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                  seek(ratio * duration);
                }}
              >
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full relative group-hover:brightness-110"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <span className="w-9">{formatDuration(duration)}</span>
            </div>
          </div>

          {/* Lado Direito: Volume e Fila */}
          <div className="flex items-center justify-end gap-3 min-w-[140px] max-w-[25%]">
            <button
              onClick={() => setShowQueue(!showQueue)}
              className={`p-2 rounded-lg transition-colors relative ${
                showQueue ? 'bg-zinc-800 text-amber-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
              title="Fila de reprodução"
            >
              <ListMusic className="w-4 h-4" />
              {queue.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
              )}
            </button>

            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-zinc-400 hover:text-white transition-colors"
                title={isMuted ? 'Desmutar' : 'Mutar'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-16 sm:w-20 h-1 bg-zinc-800 accent-amber-500 rounded-lg cursor-pointer"
                aria-label="Controle de volume"
              />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
