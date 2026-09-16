'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-context';
import { playlistService, PlaylistWithTracks } from '@/services/playlist.service';
import {
  ListMusic,
  Plus,
  Lock,
  Globe,
  Trash2,
  Play,
  Loader2,
  X,
  Disc3,
} from 'lucide-react';

export default function PlaylistsPage() {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<PlaylistWithTracks[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newIsPublic, setNewIsPublic] = useState(true);

  useEffect(() => {
    async function loadPlaylists() {
      setLoading(true);
      try {
        const userId = user?.id || 'guest';
        const data = await playlistService.getUserPlaylists(userId);
        setPlaylists(data);
      } catch (err) {
        console.error('Erro ao carregar playlists:', err);
      } finally {
        setLoading(false);
      }
    }

    loadPlaylists();
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setCreating(true);
    try {
      const userId = user?.id || 'guest';
      const created = await playlistService.createPlaylist(userId, {
        title: newTitle.trim(),
        description: newDescription.trim() || undefined,
        isPublic: newIsPublic,
      });

      setPlaylists((prev) => [created, ...prev]);
      setNewTitle('');
      setNewDescription('');
      setIsModalOpen(false);
    } catch (err) {
      console.error('Erro ao criar playlist:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (playlistId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!confirm('Deseja realmente excluir esta playlist?')) return;

    try {
      await playlistService.deletePlaylist(playlistId);
      setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
    } catch (err) {
      console.error('Erro ao excluir playlist:', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2.5">
            <ListMusic className="w-7 h-7 text-amber-500" /> Minhas Playlists
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Organize seus sons favoritos em coleções para qualquer momento do dia.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Criar Playlist
        </button>
      </div>

      {/* Grid de Playlists */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          <p className="text-sm font-medium">Carregando suas playlists...</p>
        </div>
      ) : playlists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {playlists.map((pl) => (
            <Link
              key={pl.id}
              href={`/playlist/${pl.id}`}
              className="group block p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 transition-all space-y-3 relative overflow-hidden"
            >
              {/* Capa com overlay de play no hover */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-800 flex items-center justify-center">
                {pl.cover_url ? (
                  <Image
                    src={pl.cover_url}
                    alt={pl.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-amber-500/20 via-zinc-800 to-orange-500/20 flex items-center justify-center">
                    <Disc3 className="w-10 h-10 text-zinc-600" />
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <Play className="w-5 h-5 fill-zinc-950 ml-0.5" />
                  </div>
                </div>

                {/* Badge visibilidade */}
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-zinc-950/80 backdrop-blur-sm border border-zinc-800 text-[10px] font-mono text-zinc-300 flex items-center gap-1">
                  {pl.is_public ? (
                    <>
                      <Globe className="w-2.5 h-2.5 text-amber-400" /> Pública
                    </>
                  ) : (
                    <>
                      <Lock className="w-2.5 h-2.5 text-zinc-400" /> Privada
                    </>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors truncate">
                    {pl.title}
                  </h3>
                  {pl.description && (
                    <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                      {pl.description}
                    </p>
                  )}
                  <span className="text-[11px] text-zinc-500 font-mono mt-1 inline-block">
                    {pl.tracks?.length || 0} faixas
                  </span>
                </div>

                <button
                  onClick={(e) => handleDelete(pl.id, e)}
                  title="Excluir playlist"
                  className="p-2 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-zinc-900/40 border border-zinc-800 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
            <ListMusic className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Nenhuma playlist criada ainda</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Crie seleções musicais personalizadas para seus treinos, foco, viagens ou para compartilhar com amigos.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" /> Criar Minha Primeira Playlist
          </button>
        </div>
      )}

      {/* Modal Criar Playlist */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white">Nova Playlist</h2>
              <p className="text-xs text-zinc-400">
                Dê um título marcante para sua nova compilação independente.
              </p>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">Título da Playlist</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Noites de Trap, Foco Total, Vibes de Verão"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">
                  Descrição (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Sobre o que é essa playlist..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-500 transition-colors resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="modalIsPublic"
                  checked={newIsPublic}
                  onChange={(e) => setNewIsPublic(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-amber-500 focus:ring-amber-500/20"
                />
                <label htmlFor="modalIsPublic" className="text-xs text-zinc-300 cursor-pointer select-none">
                  Tornar playlist pública (outros ouvintes poderão ouvir e compartilhar)
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating || !newTitle.trim()}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {creating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Criar Playlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
