'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-context';
import { followService } from '@/services/follow.service';
import { ArtistWithDetails } from '@/types/music.types';
import { UserCheck, UserPlus, Users, Compass, Loader2 } from 'lucide-react';

export default function FollowingPage() {
  const { user } = useAuth();
  const [artists, setArtists] = useState<ArtistWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadFollowed() {
      setLoading(true);
      try {
        const userId = user?.id || 'guest';
        const data = await followService.getFollowedArtists(userId);
        setArtists(data);
        const map: Record<string, boolean> = {};
        data.forEach((a) => {
          map[a.id] = true;
        });
        setFollowingMap(map);
      } catch (err) {
        console.error('Erro ao carregar artistas seguidos:', err);
      } finally {
        setLoading(false);
      }
    }

    loadFollowed();
  }, [user]);

  const handleToggleFollow = async (artistId: string) => {
    const userId = user?.id || 'guest';
    const currentStatus = followingMap[artistId] ?? true;

    // Otimista
    setFollowingMap((prev) => ({ ...prev, [artistId]: !currentStatus }));

    try {
      const res = await followService.toggleFollow(userId, artistId);
      setFollowingMap((prev) => ({ ...prev, [artistId]: res.following }));
    } catch (err) {
      console.error('Erro ao alternar follow:', err);
      setFollowingMap((prev) => ({ ...prev, [artistId]: currentStatus }));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2.5">
          <Users className="w-7 h-7 text-amber-500" /> Artistas que Sigo
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Músicos e produtores independentes que você acompanha de perto no Musio.
        </p>
      </div>

      {/* Grid de Artistas */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          <p className="text-sm font-medium">Carregando artistas...</p>
        </div>
      ) : artists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {artists.map((artist) => {
            const isFollowing = followingMap[artist.id] ?? true;

            return (
              <div
                key={artist.id}
                className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="flex items-center gap-4">
                  <Link
                    href={`/artist/${artist.slug}`}
                    className="relative w-14 h-14 rounded-2xl overflow-hidden bg-zinc-800 flex-shrink-0 group"
                  >
                    {artist.avatar_url ? (
                      <Image
                        src={artist.avatar_url}
                        alt={artist.stage_name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center font-bold text-zinc-950 text-xl">
                        {artist.stage_name.charAt(0)}
                      </div>
                    )}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/artist/${artist.slug}`}
                      className="font-bold text-sm text-white hover:text-amber-400 transition-colors truncate block"
                    >
                      {artist.stage_name}
                    </Link>
                    <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                      {(artist.follower_count || 0).toLocaleString()} seguidores
                    </p>
                  </div>
                </div>

                {artist.bio && (
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {artist.bio}
                  </p>
                )}

                <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/80">
                  <Link
                    href={`/artist/${artist.slug}`}
                    className="flex-1 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold text-center transition-colors"
                  >
                    Ver Perfil
                  </Link>

                  <button
                    onClick={() => handleToggleFollow(artist.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isFollowing
                        ? 'bg-zinc-800 hover:bg-rose-500/10 text-zinc-300 hover:text-rose-400 border border-zinc-700 hover:border-rose-500/30'
                        : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-md shadow-amber-500/20'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Seguindo</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Seguir</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-zinc-900/40 border border-zinc-800 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
            <Users className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Você ainda não segue nenhum artista</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Conheça novos produtores e músicos independentes para acompanhar seus lançamentos em primeira mão.
            </p>
          </div>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20"
          >
            <Compass className="w-4 h-4" />
            Explorar Catálogo
          </Link>
        </div>
      )}
    </div>
  );
}
