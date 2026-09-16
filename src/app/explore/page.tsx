'use client';

import React, { useState, useEffect } from 'react';
import { trackService } from '@/services/track.service';
import { artistService } from '@/services/artist.service';
import { TrackWithArtist, ArtistWithDetails } from '@/types/music.types';
import { TrackRow } from '@/components/track/track-row';
import { Search, Compass, Flame, Users } from 'lucide-react';
import Link from 'next/link';

const GENRES = [
  { name: 'Boom Bap & Hip-Hop', slug: 'hip-hop', color: 'from-amber-500/20 to-orange-500/20' },
  { name: 'Trap & Drill', slug: 'trap', color: 'from-red-500/20 to-rose-500/20' },
  { name: 'Lo-Fi & Chillhop', slug: 'lo-fi', color: 'from-purple-500/20 to-indigo-500/20' },
  { name: 'Indie & Alternativo', slug: 'indie', color: 'from-cyan-500/20 to-blue-500/20' },
  { name: 'R&B & Neo-Soul', slug: 'r-and-b', color: 'from-pink-500/20 to-rose-500/20' },
  { name: 'MPB & Nova MPB', slug: 'mpb', color: 'from-emerald-500/20 to-teal-500/20' },
];

export default function ExplorePage() {
  const [tracks, setTracks] = useState<TrackWithArtist[]>([]);
  const [artists, setArtists] = useState<ArtistWithDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const [allTracks, allArtists] = await Promise.all([
        trackService.getExploreTracks(),
        artistService.getArtists(),
      ]);
      setTracks(allTracks);
      setArtists(allArtists);
    }
    loadData();
  }, []);

  const filteredTracks = tracks.filter((track) => {
    const matchesQuery =
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist?.stage_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header & Search */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <Compass className="w-7 h-7 text-amber-500" />
              Explorar Catálogo
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Músicas, produtores e artistas independentes prontos para serem descobertos.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar faixa ou artista..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Gêneros em Pílulas */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          <button
            onClick={() => setSelectedGenre(null)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedGenre === null
                ? 'bg-amber-500 text-zinc-950 border-amber-500'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            Todos os Gêneros
          </button>
          {GENRES.map((g) => (
            <button
              key={g.slug}
              onClick={() => setSelectedGenre(g.slug)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedGenre === g.slug
                  ? 'bg-amber-500 text-zinc-950 border-amber-500'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      {/* Músicas em Destaque */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-500" />
          Faixas Populares
        </h2>

        {filteredTracks.length === 0 ? (
          <div className="p-8 text-center bg-zinc-900/40 rounded-2xl border border-zinc-800 text-zinc-400 text-sm">
            Nenhuma música encontrada com o termo pesquisado.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredTracks.map((track, i) => (
              <TrackRow key={track.id} track={track} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Artistas em Destaque */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-amber-500" />
          Artistas em Alta
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {artists.map((artist) => (
            <Link
              key={artist.id}
              href={`/artist/${artist.slug}`}
              className="group p-5 rounded-3xl bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/80 hover:border-amber-500/30 transition-all flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-zinc-800 flex-shrink-0">
                {artist.avatar_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={artist.avatar_url} alt={artist.stage_name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="truncate">
                <h3 className="font-semibold text-sm text-zinc-100 group-hover:text-amber-400 transition-colors truncate">
                  {artist.stage_name}
                </h3>
                <p className="text-xs text-zinc-400 truncate mt-0.5">{artist.bio}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
