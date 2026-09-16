'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { artistService } from '@/services/artist.service';
import { ArtistWithDetails } from '@/types/music.types';
import { TrackRow } from '@/components/track/track-row';
import { ArrowLeft, Disc3, Calendar, Heart } from 'lucide-react';
import { SupportModal } from '@/components/artist/support-modal';

export default function AlbumDetailsPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [artist, setArtist] = useState<ArtistWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  useEffect(() => {
    async function load() {
      // Carrega o primeiro artista com faixas para demonstrar o álbum
      const artists = await artistService.getArtists();
      setArtist(artists[0] || null);
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Disc3 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  const tracks = artist?.tracks || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link
        href="/explore"
        className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>

      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row items-center sm:items-end gap-6">
        <div className="w-44 h-44 rounded-2xl overflow-hidden bg-zinc-800 shadow-2xl flex-shrink-0">
          {tracks[0]?.cover_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={tracks[0].cover_url} alt="Álbum" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-500">
              <Disc3 className="w-12 h-12" />
            </div>
          )}
        </div>

        <div className="space-y-2.5 flex-1 text-center sm:text-left">
          <span className="text-[10px] uppercase tracking-widest font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            EP Independente
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Fênix EP</h1>
          <p className="text-zinc-400 text-sm">
            por{' '}
            <Link
              href={`/artist/${artist?.slug}`}
              className="text-amber-400 font-semibold hover:underline"
            >
              {artist?.stage_name}
            </Link>
          </p>

          <div className="flex items-center justify-center sm:justify-start gap-4 text-xs font-mono text-zinc-400 pt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> 2026
            </span>
            <span>•</span>
            <span>{tracks.length} faixas</span>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setIsSupportOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 mx-auto sm:mx-0"
            >
              <Heart className="w-4 h-4 fill-zinc-950" />
              <span>Apoiar este Lançamento</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Faixas do Álbum</h2>
        <div className="space-y-2">
          {tracks.map((t) => (
            <TrackRow
              key={t.id}
              track={{
                ...t,
                artist: {
                  id: artist!.id,
                  stage_name: artist!.stage_name,
                  slug: artist!.slug,
                  avatar_url: artist!.avatar_url,
                  verified: artist!.verified,
                },
              }}
            />
          ))}
        </div>
      </div>

      {artist && (
        <SupportModal
          artistId={artist.id}
          artistName={artist.stage_name}
          isOpen={isSupportOpen}
          onClose={() => setIsSupportOpen(false)}
        />
      )}
    </div>
  );
}
