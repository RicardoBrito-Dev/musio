'use client';

import React, { useState, useEffect } from 'react';
import { trackService } from '@/services/track.service';
import { storageService } from '@/services/storage.service';
import { usePlayer } from '@/contexts/player-context';
import { Track, PlayerTrack } from '@/types/music.types';
import { formatDuration } from '@/lib/utils';
import {
  Plus,
  UploadCloud,
  Music,
  CheckCircle2,
  Disc3,
  Trash2,
  Play,
  Pause,
  AlertCircle,
  Image as ImageIcon,
  Lock,
} from 'lucide-react';

export default function ArtistTracksPage() {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();

  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Form states
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [bpm, setBpm] = useState('');
  const [musicalKey, setMusicalKey] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [isExclusive, setIsExclusive] = useState(false);
  const [price, setPrice] = useState('');
  const [copyrightAccepted, setCopyrightAccepted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [uploadedSuccess, setUploadedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const artistId = 'a1000000-0000-0000-0000-000000000001';

  const loadTracks = async () => {
    try {
      const data = await trackService.getArtistTracks(artistId);
      setTracks(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTracks();
  }, []);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile) {
      setError('Por favor, selecione um arquivo de áudio (MP3, WAV ou FLAC).');
      return;
    }
    if (!copyrightAccepted) {
      setError('Você deve declarar que possui os direitos autorais sobre a música.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      setUploadStatus('Enviando arquivo de áudio...');
      const audioUpload = await storageService.uploadTrackAudio(audioFile, artistId);

      let coverUrl: string | null = null;
      if (coverFile) {
        setUploadStatus('Enviando imagem de capa...');
        const coverUpload = await storageService.uploadCoverImage(coverFile, artistId);
        coverUrl = coverUpload.url;
      }

      setUploadStatus('Salvando metadados e registrando faixa...');
      const newTrack = await trackService.createTrack({
        artistId,
        title,
        audioUrl: audioUpload.url,
        coverUrl,
        durationSeconds: 180, // Calculado ou padrão inicial
        bpm: bpm ? parseInt(bpm, 10) : null,
        musicalKey: musicalKey || null,
        lyrics: lyrics || null,
        isExclusive,
        priceCents: isExclusive && price ? Math.round(parseFloat(price) * 100) : 0,
        copyrightDeclaration: true,
      });

      setTracks((prev) => [newTrack, ...prev]);
      setUploadedSuccess(true);
      setTimeout(() => {
        setUploadedSuccess(false);
        setShowUploadModal(false);
        // Reset form
        setTitle('');
        setAudioFile(null);
        setCoverFile(null);
        setBpm('');
        setMusicalKey('');
        setLyrics('');
        setIsExclusive(false);
        setPrice('');
        setCopyrightAccepted(false);
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro no upload. Verifique o arquivo e tente novamente.');
      }
    } finally {
      setIsUploading(false);
      setUploadStatus('');
    }
  };

  const handleDelete = async (trackId: string) => {
    if (confirm('Tem certeza que deseja excluir esta música?')) {
      await trackService.deleteTrack(trackId);
      setTracks((prev) => prev.filter((t) => t.id !== trackId));
    }
  };

  const handlePlay = (t: Track) => {
    if (currentTrack?.id === t.id) {
      togglePlay();
    } else {
      const pTrack: PlayerTrack = {
        id: t.id,
        title: t.title,
        artistName: 'Rick Beatz',
        artistSlug: 'rick-beatz',
        audioUrl: t.audio_url,
        coverUrl: t.cover_url,
        durationSeconds: t.duration_seconds,
      };
      playTrack(pTrack);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Minhas Músicas</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Gerencie seu catálogo de singles, instrumentais e produções.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Enviar Nova Faixa</span>
        </button>
      </div>

      {/* Lista de Músicas */}
      <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
        <div className="p-4 border-b border-zinc-800 text-xs font-semibold text-zinc-400 uppercase tracking-wider grid grid-cols-12 gap-4">
          <span className="col-span-6">Título</span>
          <span className="col-span-2 text-center">BPM / Tom</span>
          <span className="col-span-2 text-center">Plays</span>
          <span className="col-span-2 text-right">Ações</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-zinc-500">
            <Disc3 className="w-8 h-8 animate-spin text-amber-500 mx-auto" />
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/60">
            {tracks.map((t) => {
              const isCurrent = currentTrack?.id === t.id;
              return (
                <div
                  key={t.id}
                  className="p-4 grid grid-cols-12 gap-4 items-center text-xs hover:bg-zinc-800/40 transition-colors"
                >
                  <div className="col-span-6 flex items-center gap-3">
                    <button
                      onClick={() => handlePlay(t)}
                      className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-amber-500 text-zinc-400 hover:text-zinc-950 flex items-center justify-center transition-colors flex-shrink-0"
                    >
                      {isCurrent && isPlaying ? (
                        <Pause className="w-3.5 h-3.5 fill-current text-amber-500" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      )}
                    </button>

                    <div className="w-9 h-9 rounded-xl bg-zinc-800 overflow-hidden flex-shrink-0 border border-zinc-700/60">
                      {t.cover_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={t.cover_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-amber-500">
                          <Music className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div className="truncate">
                      <p className="font-semibold text-zinc-200 truncate">{t.title}</p>
                      {t.is_exclusive && (
                        <span className="text-[10px] text-amber-400 font-mono flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" /> Exclusivo (R$ {(t.price_cents / 100).toFixed(2)})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-span-2 text-center text-zinc-400 font-mono">
                    {t.bpm ? `${t.bpm} BPM` : '—'} • {t.musical_key || '—'}
                  </div>

                  <div className="col-span-2 text-center text-zinc-400 font-mono">
                    {t.play_count}
                  </div>

                  <div className="col-span-2 text-right flex items-center justify-end gap-2 text-zinc-400 font-mono">
                    <span>{formatDuration(t.duration_seconds)}</span>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-1 text-zinc-500 hover:text-rose-400 transition-colors ml-2"
                      title="Excluir música"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Upload de Músicas com Supabase Storage */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl text-white space-y-5 my-8">
            <h3 className="font-bold text-lg text-white">Publicar Nova Faixa</h3>

            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {uploadedSuccess ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white">Música Enviada com Sucesso!</h4>
                <p className="text-xs text-zinc-400">Sua faixa já está disponível no seu catálogo.</p>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                {/* Seleção do Arquivo de Áudio */}
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                    Arquivo de Áudio (MP3, WAV, FLAC até 50MB)
                  </label>
                  <label className="border-2 border-dashed border-zinc-700 hover:border-amber-500 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-zinc-950/50 flex flex-col items-center justify-center">
                    <UploadCloud className="w-6 h-6 text-amber-500 mb-1" />
                    <span className="text-xs text-zinc-200 font-medium">
                      {audioFile ? audioFile.name : 'Clique para selecionar o áudio'}
                    </span>
                    <span className="text-[10px] text-zinc-500 mt-0.5">
                      {audioFile ? `${(audioFile.size / 1024 / 1024).toFixed(2)} MB` : 'MP3, WAV ou FLAC'}
                    </span>
                    <input
                      type="file"
                      accept="audio/*,.mp3,.wav,.flac,.m4a"
                      onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Seleção da Capa */}
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                    Imagem de Capa (Opcional, até 5MB)
                  </label>
                  <label className="border border-zinc-800 hover:border-zinc-700 rounded-2xl p-3 text-center cursor-pointer transition-colors bg-zinc-950/50 flex items-center justify-center gap-2">
                    <ImageIcon className="w-4 h-4 text-zinc-400" />
                    <span className="text-xs text-zinc-300">
                      {coverFile ? coverFile.name : 'Selecionar imagem de capa'}
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
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">Título da Faixa</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Novo Começo"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 block mb-1">BPM</label>
                    <input
                      type="number"
                      placeholder="Ex: 120"
                      value={bpm}
                      onChange={(e) => setBpm(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 block mb-1">Tom Musical</label>
                    <input
                      type="text"
                      placeholder="Ex: Dm, Am, C"
                      value={musicalKey}
                      onChange={(e) => setMusicalKey(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">Letra (Opcional)</label>
                  <textarea
                    rows={2}
                    placeholder="Cole aqui a letra da música se houver..."
                    value={lyrics}
                    onChange={(e) => setLyrics(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                {/* Exclusividade e Preço */}
                <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="exclusiveCheck"
                        checked={isExclusive}
                        onChange={(e) => setIsExclusive(e.target.checked)}
                        className="accent-amber-500 cursor-pointer"
                      />
                      <label htmlFor="exclusiveCheck" className="text-xs font-semibold text-zinc-200 cursor-pointer">
                        Conteúdo Exclusivo / Venda Direta
                      </label>
                    </div>
                  </div>
                  {isExclusive && (
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Preço para Download (R$)</label>
                      <input
                        type="number"
                        step="0.50"
                        min="1"
                        placeholder="Ex: 19.90"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  )}
                </div>

                {/* Termo de Copyright Obrigatório (#22) */}
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="copyright"
                    checked={copyrightAccepted}
                    onChange={(e) => setCopyrightAccepted(e.target.checked)}
                    className="mt-0.5 accent-amber-500 cursor-pointer"
                    required
                  />
                  <label htmlFor="copyright" className="text-[11px] text-zinc-400 cursor-pointer leading-tight">
                    Declaro formalmente possuir 100% dos direitos autorais e fonomecânicos sobre esta produção,
                    isento de plágio e em conformidade com as regras da plataforma Musio.
                  </label>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-amber-400 font-mono animate-pulse">
                    {uploadStatus}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowUploadModal(false)}
                      className="px-4 py-2 text-xs text-zinc-400 hover:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isUploading || !copyrightAccepted || !audioFile}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-bold text-xs flex items-center gap-1.5"
                    >
                      {isUploading && <Disc3 className="w-3.5 h-3.5 animate-spin" />}
                      <span>{isUploading ? 'Processando...' : 'Salvar & Publicar'}</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
