'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { artistService } from '@/services/artist.service';
import { followService } from '@/services/follow.service';
import { useAuth } from '@/contexts/auth-context';
import { ArtistWithDetails } from '@/types/music.types';
import { TrackRow } from '@/components/track/track-row';
import { SupportModal } from '@/components/artist/support-modal';
import { formatCompactNumber } from '@/lib/utils';
import {
  Heart,
  UserPlus,
  Check,
  Disc3,
  Sparkles,
  Lock,
  Layers,
  Music2,
} from 'lucide-react';

export default function ArtistProfilePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { user } = useAuth();

  const [artist, setArtist] = useState<ArtistWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'releases' | 'exclusive' | 'club'>('releases');

  useEffect(() => {
    async function loadArtist() {
      if (slug) {
        const data = await artistService.getArtistBySlug(slug);
        setArtist(data);
        if (data) {
          setFollowerCount(data.follower_count || 0);
          const following = await followService.isFollowing(user?.id || 'guest', data.id);
          setIsFollowing(following);
        }
        setLoading(false);
      }
    }
    loadArtist();
  }, [slug, user]);

  const handleToggleFollow = async () => {
    if (!artist) return;
    const previous = isFollowing;
    const previousCount = followerCount;

    setIsFollowing(!previous);
    setFollowerCount(previous ? previousCount - 1 : previousCount + 1);

    try {
      const res = await followService.toggleFollow(user?.id || 'guest', artist.id);
      setIsFollowing(res.following);
      setFollowerCount(res.newFollowerCount);
    } catch {
      setIsFollowing(previous);
      setFollowerCount(previousCount);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-zinc-500">
        <Disc3 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Artista não encontrado</h1>
        <p className="text-zinc-400 text-sm">O link pode estar incorreto ou o artista foi removido.</p>
      </div>
    );
  }

  const tracks = artist.tracks || [];
  const publicTracks = tracks.filter((t) => !t.is_exclusive);
  const exclusiveTracks = tracks.filter((t) => t.is_exclusive);

  return (
    <div className="pb-16 space-y-8">
      {/* 1. BANNER & HEADER */}
      <div className="relative">
        <div className="h-64 sm:h-80 w-full bg-zinc-900 overflow-hidden relative">
          {artist.banner_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={artist.banner_url}
              alt=""
              className="w-full h-full object-cover brightness-75"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-zinc-900 to-zinc-800" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
        </div>

        {/* Profile Details Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-20 sm:-mt-24 z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              {/* Avatar */}
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden border-4 border-zinc-950 bg-zinc-900 shadow-2xl flex-shrink-0">
                {artist.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={artist.avatar_url}
                    alt={artist.stage_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500">
                    <Disc3 className="w-12 h-12" />
                  </div>
                )}
              </div>

              {/* Informações */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    {artist.stage_name}
                  </h1>
                  {artist.verified && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-semibold text-amber-400">
                      Verificado
                    </span>
                  )}
                </div>
                <p className="text-sm text-zinc-300 max-w-xl leading-relaxed">{artist.bio}</p>
                <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 pt-1">
                  <span>{formatCompactNumber(followerCount)} seguidores</span>
                  <span>•</span>
                  <span>{tracks.length} produções</span>
                </div>
              </div>
            </div>

            {/* Ações: Seguir e Apoiar */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleToggleFollow}
                className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-2xl font-semibold text-xs transition-all flex items-center justify-center gap-2 border ${
                  isFollowing
                    ? 'bg-zinc-800 text-zinc-200 border-zinc-700'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-800'
                }`}
              >
                {isFollowing ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Seguindo</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Seguir</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setIsSupportModalOpen(true)}
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 fill-zinc-950" />
                <span>❤️ Apoiar artista</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ABAS DE CONTEÚDO */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <button
            onClick={() => setActiveTab('releases')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
              activeTab === 'releases'
                ? 'bg-zinc-900 text-amber-400 border border-zinc-800'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Music2 className="w-4 h-4" />
            Lançamentos ({publicTracks.length})
          </button>
          <button
            onClick={() => setActiveTab('exclusive')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
              activeTab === 'exclusive'
                ? 'bg-zinc-900 text-amber-400 border border-zinc-800'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Lock className="w-4 h-4" />
            Exclusivos & Stems ({exclusiveTracks.length})
          </button>
          <button
            onClick={() => setActiveTab('club')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
              activeTab === 'club'
                ? 'bg-zinc-900 text-amber-400 border border-zinc-800'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Clube do Artista
          </button>
        </div>

        {/* Conteúdo da Aba Lançamentos */}
        {activeTab === 'releases' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Faixas & Singles</h3>
            <div className="space-y-2">
              {publicTracks.map((t) => (
                <TrackRow
                  key={t.id}
                  track={{
                    ...t,
                    artist: {
                      id: artist.id,
                      stage_name: artist.stage_name,
                      slug: artist.slug,
                      avatar_url: artist.avatar_url,
                      verified: artist.verified,
                    },
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Conteúdo da Aba Exclusivos */}
        {activeTab === 'exclusive' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
              <Lock className="w-4 h-4 flex-shrink-0" />
              <span>
                Conteúdos exclusivos disponibilizados diretamente por {artist.stage_name} para apoiadores e compradores.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {exclusiveTracks.length > 0 ? (
                exclusiveTracks.map((t) => (
                  <div
                    key={t.id}
                    className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-amber-400">
                        <Layers className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{t.title}</h4>
                        <p className="text-xs text-zinc-400">BPM: {t.bpm} • Tom: {t.musical_key}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsSupportModalOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs"
                    >
                      Adquirir (R$ {(t.price_cents / 100).toFixed(2)})
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-zinc-500 text-sm col-span-2">
                  Nenhum stem ou beat pack publicado no momento.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Conteúdo da Aba Clube do Artista */}
        {activeTab === 'club' && (
          <div className="max-w-xl p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-zinc-950">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Clube {artist.stage_name}</h3>
                <p className="text-xs text-amber-400 font-medium">R$ 14,90 / mês</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Junte-se ao círculo íntimo do artista. Tenha acesso antecipado a todos os lançamentos,
              ouça prévias inéditas e converse diretamente com a comunidade de membros.
            </p>

            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400" /> Acesso a faixas e demos 7 dias antes do público geral
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400" /> Stems e instrumentais para produtores
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400" /> Selo exclusivo de apoiador no perfil
              </li>
            </ul>

            <button
              onClick={() => setIsSupportModalOpen(true)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20"
            >
              Assinar Clube do Artista
            </button>
          </div>
        )}
      </div>

      {/* Modal de Apoio Integrado */}
      <SupportModal
        artistId={artist.id}
        artistName={artist.stage_name}
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
    </div>
  );
}
