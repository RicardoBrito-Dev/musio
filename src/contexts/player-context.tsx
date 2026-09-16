'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { PlayerTrack } from '@/types/music.types';
import { playService } from '@/services/play.service';
import { likeService } from '@/services/like.service';
import { useAuth } from '@/contexts/auth-context';

interface PlayerContextType {
  currentTrack: PlayerTrack | null;
  queue: PlayerTrack[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isCurrentLiked: boolean;
  playTrack: (track: PlayerTrack, newQueue?: PlayerTrack[]) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seek: (timeSeconds: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleCurrentLike: () => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [currentTrack, setCurrentTrack] = useState<PlayerTrack | null>(null);
  const [queue, setQueue] = useState<PlayerTrack[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isCurrentLiked, setIsCurrentLiked] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const nextTrackRef = useRef<() => void>(() => {});
  const playRecordedRef = useRef<boolean>(false);

  // Sincroniza estado de like com eventos de outras partes da UI
  useEffect(() => {
    const handleLikeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ trackId: string; liked: boolean }>;
      if (currentTrack && customEvent.detail.trackId === currentTrack.id) {
        setIsCurrentLiked(customEvent.detail.liked);
      }
    };
    window.addEventListener('musio:like-changed', handleLikeChange);
    return () => window.removeEventListener('musio:like-changed', handleLikeChange);
  }, [currentTrack]);

  const playTrack = useCallback((track: PlayerTrack, newQueue?: PlayerTrack[]) => {
    setCurrentTrack(track);
    playRecordedRef.current = false;

    // Checar se a faixa já é favoritada
    likeService.isLiked(user?.id || 'guest', track.id).then(setIsCurrentLiked);

    if (newQueue) {
      setQueue(newQueue);
    } else {
      setQueue((prev) => {
        if (!prev.find((t) => t.id === track.id)) {
          return [...prev, track];
        }
        return prev;
      });
    }

    if (audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Auto-play bloqueado ou falha de áudio:', err);
      });
    }
  }, [user?.id]);

  const nextTrack = useCallback(() => {
    if (!currentTrack || queue.length === 0) return;
    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex >= 0 && currentIndex < queue.length - 1) {
      playTrack(queue[currentIndex + 1]);
    } else if (queue.length > 0) {
      playTrack(queue[0]);
    }
  }, [currentTrack, queue, playTrack]);

  useEffect(() => {
    nextTrackRef.current = nextTrack;
  }, [nextTrack]);

  // Inicializa o elemento de áudio nativo
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);

      // Computa play automático quando passar de 10s de reprodução
      if (audio.currentTime >= 10 && !playRecordedRef.current && currentTrack?.id) {
        playRecordedRef.current = true;
        playService.recordPlay(currentTrack.id, Math.round(audio.currentTime));
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      nextTrackRef.current();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [currentTrack?.id]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
  }, [isPlaying, currentTrack]);

  const previousTrack = useCallback(() => {
    if (!currentTrack || queue.length === 0) return;
    if (currentTime > 3 && audioRef.current) {
      audioRef.current.currentTime = 0;
      return;
    }
    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex > 0) {
      playTrack(queue[currentIndex - 1]);
    }
  }, [currentTrack, queue, currentTime, playTrack]);

  const seek = useCallback((timeSeconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = timeSeconds;
      setCurrentTime(timeSeconds);
    }
  }, []);

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  const toggleCurrentLike = useCallback(async () => {
    if (!currentTrack) return;
    const result = await likeService.toggleLike(user?.id || 'guest', currentTrack.id);
    setIsCurrentLiked(result.liked);
  }, [currentTrack, user?.id]);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        queue,
        isPlaying,
        currentTime,
        duration: duration || currentTrack?.durationSeconds || 0,
        volume,
        isMuted,
        isCurrentLiked,
        playTrack,
        togglePlay,
        nextTrack,
        previousTrack,
        seek,
        setVolume,
        toggleMute,
        toggleCurrentLike,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
