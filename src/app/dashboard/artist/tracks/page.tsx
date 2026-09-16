'use client';

import React, { useState } from 'react';
import { Plus, UploadCloud, Music, CheckCircle2, Disc3 } from 'lucide-react';
import { formatDuration } from '@/lib/utils';

export default function ArtistTracksPage() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [title, setTitle] = useState('');
  const [bpm, setBpm] = useState('');
  const [musicalKey, setMusicalKey] = useState('');
  const [copyrightAccepted, setCopyrightAccepted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedSuccess, setUploadedSuccess] = useState(false);

  const initialTracks = [
    {
      id: '1',
      title: 'Fênix (Instrumental)',
      duration: 184,
      bpm: 92,
      key: 'Fm',
      plays: 4890,
      likes: 320,
      isExclusive: false,
    },
    {
      id: '2',
      title: 'Horizonte Noturno',
      duration: 215,
      bpm: 120,
      key: 'Am',
      plays: 2750,
      likes: 180,
      isExclusive: false,
    },
    {
      id: '3',
      title: 'Beat Pack Vol. 1 [Exclusivo]',
      duration: 160,
      bpm: 140,
      key: 'C#m',
      plays: 1100,
      likes: 95,
      isExclusive: true,
    },
  ];

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copyrightAccepted) return;
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadedSuccess(true);
      setTimeout(() => {
        setUploadedSuccess(false);
        setShowUploadModal(false);
      }, 1500);
    }, 1200);
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
          <span className="col-span-2 text-right">Duração</span>
        </div>

        <div className="divide-y divide-zinc-800/60">
          {initialTracks.map((t) => (
            <div
              key={t.id}
              className="p-4 grid grid-cols-12 gap-4 items-center text-xs hover:bg-zinc-800/40 transition-colors"
            >
              <div className="col-span-6 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-amber-500 flex-shrink-0">
                  <Music className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <p className="font-semibold text-zinc-200 truncate">{t.title}</p>
                  {t.isExclusive && (
                    <span className="text-[10px] text-amber-400 font-mono">Conteúdo Exclusivo</span>
                  )}
                </div>
              </div>

              <div className="col-span-2 text-center text-zinc-400 font-mono">
                {t.bpm} BPM • {t.key}
              </div>

              <div className="col-span-2 text-center text-zinc-400 font-mono">
                {t.plays}
              </div>

              <div className="col-span-2 text-right text-zinc-400 font-mono">
                {formatDuration(t.duration)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Upload de Músicas */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl text-white space-y-5">
            <h3 className="font-bold text-lg text-white">Publicar Nova Faixa</h3>

            {uploadedSuccess ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white">Música Enviada com Sucesso!</h4>
                <p className="text-xs text-zinc-400">Sua faixa já está disponível no seu catálogo.</p>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                {/* Zona de Drop de Áudio */}
                <div className="border-2 border-dashed border-zinc-700 hover:border-amber-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-zinc-950/50">
                  <UploadCloud className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-zinc-200">
                    Selecione ou arraste seu arquivo de áudio
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-1">MP3, WAV ou FLAC até 100MB</p>
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
                    <label className="text-xs font-semibold text-zinc-400 block mb-1">BPM (Opcional)</label>
                    <input
                      type="number"
                      placeholder="Ex: 120"
                      value={bpm}
                      onChange={(e) => setBpm(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 block mb-1">Tom Musical</label>
                    <input
                      type="text"
                      placeholder="Ex: Dm, Am, C"
                      value={musicalKey}
                      onChange={(e) => setMusicalKey(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
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
                    Declaro solenemente possuir 100% dos direitos autorais e fonográficos sobre esta música,
                    autorizando sua veiculação e distribuição no Musio.
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 text-xs text-zinc-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading || !copyrightAccepted}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-bold text-xs flex items-center gap-1.5"
                  >
                    {isUploading && <Disc3 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{isUploading ? 'Processando...' : 'Salvar & Publicar'}</span>
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
