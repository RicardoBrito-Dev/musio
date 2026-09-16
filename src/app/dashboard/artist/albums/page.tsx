'use client';

import React, { useState, useEffect } from 'react';
import { albumService } from '@/services/album.service';
import { trackService } from '@/services/track.service';
import { storageService } from '@/services/storage.service';
import { Album, Track, ReleaseType } from '@/types/music.types';
import {
  Plus,
  Calendar,
  Disc3,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Layers,
  Music2,
} from 'lucide-react';

export default function ArtistAlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [availableTracks, setAvailableTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [releaseType, setReleaseType] = useState<ReleaseType>('album');
  const [releaseDate, setReleaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [selectedTrackIds, setSelectedTrackIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const artistId = 'a1000000-0000-0000-0000-000000000001';

  const loadData = async () => {
    try {
      const [albs, trks] = await Promise.all([
        albumService.getArtistAlbums(artistId),
        trackService.getArtistTracks(artistId),
      ]);
      setAlbums(albs);
      setAvailableTracks(trks);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleTrack = (id: string) => {
    setSelectedTrackIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      let coverUrl: string | null = null;
      if (coverFile) {
        const upload = await storageService.uploadCoverImage(coverFile, artistId);
        coverUrl = upload.url;
      }

      const newAlbum = await albumService.createAlbum({
        artistId,
        title,
        releaseType,
        releaseDate,
        description,
        coverUrl,
        trackIds: selectedTrackIds,
      });

      setAlbums((prev) => [newAlbum, ...prev]);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setShowModal(false);
        setTitle('');
        setDescription('');
        setCoverFile(null);
        setSelectedTrackIds([]);
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao criar álbum.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Álbuns & EPs</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Organize suas faixas em projetos completos, singles ou EPs.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Criar Novo Álbum/EP</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-zinc-500">
          <Disc3 className="w-8 h-8 animate-spin text-amber-500 mx-auto" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((alb) => (
            <div
              key={alb.id}
              className="p-5 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4 hover:border-amber-500/30 transition-all"
            >
              <div className="w-full aspect-square rounded-2xl overflow-hidden bg-zinc-800 relative">
                {alb.cover_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={alb.cover_url} alt={alb.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600">
                    <Layers className="w-12 h-12" />
                  </div>
                )}
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md text-[10px] uppercase font-mono font-bold text-amber-400 border border-zinc-800">
                  {alb.release_type}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-white">{alb.title}</h3>
                {alb.description && (
                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{alb.description}</p>
                )}
                <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {alb.release_date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Criação de Álbum */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl text-white space-y-5 my-8">
            <h3 className="font-bold text-lg text-white">Criar Lançamento (Álbum / EP)</h3>

            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white">Álbum Criado com Sucesso!</h4>
              </div>
            ) : (
              <form onSubmit={handleCreateAlbum} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">Título do Álbum/EP</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Fênix (Deluxe)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">Tipo de Lançamento</label>
                    <select
                      value={releaseType}
                      onChange={(e) => setReleaseType(e.target.value as ReleaseType)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    >
                      <option value="album">Álbum Completo</option>
                      <option value="ep">EP (Extended Play)</option>
                      <option value="single">Single com Lado B</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">Data de Lançamento</label>
                    <input
                      type="date"
                      value={releaseDate}
                      onChange={(e) => setReleaseDate(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">Capa do Álbum (Opcional)</label>
                  <label className="border border-zinc-800 hover:border-zinc-700 rounded-2xl p-3 text-center cursor-pointer transition-colors bg-zinc-950/50 flex items-center justify-center gap-2">
                    <ImageIcon className="w-4 h-4 text-zinc-400" />
                    <span className="text-xs text-zinc-300">
                      {coverFile ? coverFile.name : 'Selecionar imagem de capa do projeto'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">Descrição</label>
                  <textarea
                    rows={2}
                    placeholder="Conceito e detalhes deste lançamento..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                {/* Seleção de faixas do catálogo */}
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                    Faixas a incluir neste projeto ({selectedTrackIds.length} selecionadas)
                  </label>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 p-2 bg-zinc-950 rounded-2xl border border-zinc-800 custom-scrollbar">
                    {availableTracks.map((trk) => {
                      const isSelected = selectedTrackIds.includes(trk.id);
                      return (
                        <div
                          key={trk.id}
                          onClick={() => handleToggleTrack(trk.id)}
                          className={`p-2 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'hover:bg-zinc-900 text-zinc-400'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Music2 className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{trk.title}</span>
                          </div>
                          <span className="text-[10px] font-mono">{trk.bpm ? `${trk.bpm} BPM` : ''}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-xs text-zinc-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving || !title}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-bold text-xs flex items-center gap-1.5"
                  >
                    {saving && <Disc3 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{saving ? 'Criando...' : 'Salvar Álbum'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
