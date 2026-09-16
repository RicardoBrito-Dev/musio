import React from 'react';
import Link from 'next/link';
import { artistService } from '@/services/artist.service';
import { Users, Disc3, ArrowRight } from 'lucide-react';
import { formatCompactNumber } from '@/lib/utils';

export default async function ArtistsPage() {
  const artists = await artistService.getArtists();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
          <Users className="w-7 h-7 text-amber-500" />
          Comunidade de Artistas
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          Criadores, compositores e produtores independentes construindo suas carreiras no Musio.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {artists.map((artist) => (
          <div
            key={artist.id}
            className="group rounded-3xl bg-zinc-900/40 border border-zinc-800/80 overflow-hidden hover:border-amber-500/30 transition-all flex flex-col justify-between"
          >
            {/* Banner superior */}
            <div className="h-28 relative bg-zinc-800 overflow-hidden">
              {artist.banner_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={artist.banner_url}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
            </div>

            {/* Conteúdo do Card */}
            <div className="p-5 pt-0 relative -mt-10 flex-1 flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-zinc-900 bg-zinc-800 shadow-xl mb-3">
                  {artist.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={artist.avatar_url}
                      alt={artist.stage_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-500">
                      <Disc3 className="w-6 h-6" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors">
                    {artist.stage_name}
                  </h3>
                </div>

                <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {artist.bio}
                </p>

                <div className="flex items-center gap-4 mt-4 text-xs font-mono text-zinc-400">
                  <span>{formatCompactNumber(artist.follower_count || 0)} seguidores</span>
                  <span>•</span>
                  <span>{artist.tracks?.length || 0} lançamentos</span>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-zinc-800/60 flex items-center justify-between">
                <Link
                  href={`/artist/${artist.slug}`}
                  className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Ver Perfil & Músicas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
