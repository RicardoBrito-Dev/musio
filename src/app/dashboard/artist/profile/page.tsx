'use client';

import React, { useState, useEffect } from 'react';
import { artistService } from '@/services/artist.service';
import { storageService } from '@/services/storage.service';
import { useAuth } from '@/contexts/auth-context';
import {
  User,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Disc3,
  Landmark,
  Globe,
  Video,
  Share2,
} from 'lucide-react';

export default function ArtistProfileEditPage() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [stageName, setStageName] = useState('Rick Beatz');
  const [bio, setBio] = useState('Produtor musical e sound designer focado em Boom Bap, Trap melódico e instrumentais autênticos.');
  const [pixKey, setPixKey] = useState('rick@musio.live');
  const [instagram, setInstagram] = useState('@rickbeatz');
  const [youtube, setYoutube] = useState('rickbeatz');
  const [twitter, setTwitter] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80');
  const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&auto=format&fit=crop&q=80');

  useEffect(() => {
    async function loadData() {
      try {
        const artists = await artistService.getArtists();
        const current = artists[0];
        if (current) {
          setStageName(current.stage_name);
          setBio(current.bio || '');
          setPixKey(current.pix_key || '');
          setAvatarUrl(current.avatar_url || '');
          setBannerUrl(current.banner_url || '');
          setInstagram(current.social_links?.instagram || '');
          setYoutube(current.social_links?.youtube || '');
          setTwitter(current.social_links?.twitter || '');
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await storageService.uploadAvatarImage(file, profile?.id || 'artist');
      setAvatarUrl(result.url);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    }
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await storageService.uploadCoverImage(file, profile?.id || 'artist');
      setBannerUrl(result.url);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await artistService.updateArtistProfile('a1000000-0000-0000-0000-000000000001', {
        stageName,
        bio,
        pixKey,
        avatarUrl,
        bannerUrl,
        socialLinks: {
          instagram,
          youtube,
          twitter,
        },
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao salvar alterações no perfil.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-zinc-500">
        <Disc3 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Editar Perfil de Artista</h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Personalize as informações públicas que seus fãs verão na sua página do Musio.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Perfil atualizado com sucesso! As alterações já estão visíveis na sua página pública.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Banners & Imagens */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300">Imagens do Perfil</h2>

          {/* Banner */}
          <div className="relative h-44 rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 group">
            {bannerUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-600">
                <ImageIcon className="w-8 h-8" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <label className="cursor-pointer px-4 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-white font-semibold text-xs border border-zinc-700 flex items-center gap-2 shadow-xl">
                <Camera className="w-4 h-4 text-amber-500" />
                <span>Trocar Imagem do Banner</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-5 pt-2">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-zinc-900 border-2 border-zinc-700 flex-shrink-0 group">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-500">
                  <User className="w-8 h-8" />
                </div>
              )}
              <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Camera className="w-5 h-5 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <p className="font-semibold text-sm text-white">Foto de Perfil</p>
              <p className="text-xs text-zinc-500 mt-0.5">JPG, PNG ou WEBP até 5MB</p>
            </div>
          </div>
        </div>

        {/* Informações Básicas */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300">Dados do Artista</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Nome Artístico</label>
              <input
                type="text"
                required
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5 flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-emerald-400" />
                <span>Chave Pix (Para Recebimento de Apoios e Saques)</span>
              </label>
              <input
                type="text"
                required
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-sm font-mono focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Biografia / Sobre Você</label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Conte aos ouvintes sobre sua trajetória e estilo musical..."
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-amber-500 transition-colors resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Redes Sociais */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
            <Globe className="w-4 h-4 text-amber-500" />
            Redes Sociais & Links Externos
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1.5 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-pink-500" /> Instagram
              </label>
              <input
                type="text"
                placeholder="@seuperfil"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1.5 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-red-500" /> YouTube
              </label>
              <input
                type="text"
                placeholder="Canal no YouTube"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-sky-400" /> X / Twitter
              </label>
              <input
                type="text"
                placeholder="@seuusuario"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Salvar */}
        <div className="pt-4 border-t border-zinc-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
          >
            {saving && <Disc3 className="w-3.5 h-3.5 animate-spin" />}
            <span>{saving ? 'Salvando...' : 'Salvar Alterações'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
