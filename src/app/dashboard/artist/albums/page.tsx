'use client';

import React from 'react';
import { Plus, Calendar } from 'lucide-react';

export default function ArtistAlbumsPage() {
  const albums = [
    {
      id: 'alb-1',
      title: 'Fênix EP',
      releaseType: 'EP',
      tracksCount: 3,
      releaseDate: '2026-03-10',
      coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Álbuns & EPs</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Organize suas faixas em projetos completos, singles ou EPs.
          </p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5">
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Criar Novo Álbum/EP</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums.map((alb) => (
          <div
            key={alb.id}
            className="p-5 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4 hover:border-amber-500/30 transition-all"
          >
            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-zinc-800 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={alb.coverUrl} alt={alb.title} className="w-full h-full object-cover" />
              <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md text-[10px] font-mono text-amber-400 border border-zinc-800">
                {alb.releaseType}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-base text-white">{alb.title}</h3>
              <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono mt-1">
                <span>{alb.tracksCount} músicas</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {alb.releaseDate}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
