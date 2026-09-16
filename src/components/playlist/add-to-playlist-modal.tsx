'use client';

import React, { useState, useEffect } from 'react';
import { playlistService, PlaylistWithTracks } from '@/services/playlist.service';
import { useAuth } from '@/contexts/auth-context';
import { X, Plus, ListMusic, Check, Disc3 } from 'lucide-react';

interface AddToPlaylistModalProps {
  trackId: string;
  trackTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AddToPlaylistModal({
  trackId,
  trackTitle,
  isOpen,
  onClose,
}: AddToPlaylistModalProps) {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<PlaylistWithTracks[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function load() {
      if (!isOpen) return;
      setLoading(true);
      try {
        const data = await playlistService.getUserPlaylists(user?.id || 'user-default');
        setPlaylists(data);

        // Identifica quais playlists já contêm esta música
        const alreadyIn = new Set<string>();
        data.forEach((pl) => {
          if (pl.tracks?.some((t) => t.id === trackId)) {
            alreadyIn.add(pl.id);
          }
        });
        setAddedIds(alreadyIn);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isOpen, trackId, user?.id]);

  if (!isOpen) return null;

  const handleTogglePlaylist = async (playlistId: string) => {
    if (addedIds.has(playlistId)) {
      await playlistService.removeTrackFromPlaylist(playlistId, trackId);
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(playlistId);
        return next;
      });
    } else {
      await playlistService.addTrackToPlaylist(playlistId, trackId);
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.add(playlistId);
        return next;
      });
    }
  };

  const handleCreateNewPlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newPl = await playlistService.createPlaylist(user?.id || 'user-default', {
      title: newTitle.trim(),
    });

    await playlistService.addTrackToPlaylist(newPl.id, trackId);
    setPlaylists((prev) => [newPl, ...prev]);
    setAddedIds((prev) => new Set(prev).add(newPl.id));
    setNewTitle('');
    setShowCreate(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-2xl text-white space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <ListMusic className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-sm text-white">Adicionar à Playlist</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-zinc-400 truncate">
          Faixa: <span className="text-zinc-200 font-semibold">{trackTitle}</span>
        </p>

        {/* Lista de Playlists */}
        {loading ? (
          <div className="p-8 text-center text-zinc-500">
            <Disc3 className="w-6 h-6 animate-spin text-amber-500 mx-auto" />
          </div>
        ) : (
          <div className="max-h-48 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
            {playlists.map((pl) => {
              const isAdded = addedIds.has(pl.id);
              return (
                <div
                  key={pl.id}
                  onClick={() => handleTogglePlaylist(pl.id)}
                  className={`p-2.5 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-colors border ${
                    isAdded
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      : 'bg-zinc-950/60 border-zinc-800/80 hover:bg-zinc-800 text-zinc-300'
                  }`}
                >
                  <span className="font-medium truncate">{pl.title}</span>
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                      isAdded
                        ? 'bg-amber-500 border-amber-500 text-zinc-950'
                        : 'border-zinc-700 bg-zinc-900'
                    }`}
                  >
                    {isAdded && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Criar nova playlist inline */}
        {showCreate ? (
          <form onSubmit={handleCreateNewPlaylist} className="pt-2 space-y-2">
            <input
              type="text"
              required
              autoFocus
              placeholder="Nome da nova playlist..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-500"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs"
              >
                Criar & Adicionar
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowCreate(true)}
            className="w-full py-2 rounded-xl border border-dashed border-zinc-700 hover:border-amber-500 text-zinc-400 hover:text-amber-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Criar Nova Playlist</span>
          </button>
        )}
      </div>
    </div>
  );
}
