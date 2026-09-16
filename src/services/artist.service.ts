import { createClient } from '@/lib/supabase/client';
import { ArtistWithDetails } from '@/types/music.types';
import { Database } from '@/types/database.types';

export interface UpdateArtistProfileDTO {
  stageName?: string;
  bio?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  pixKey?: string;
  socialLinks?: Record<string, string>;
}

// Mock data para desenvolvimento local inicial quando Supabase não estiver conectado
export const MOCK_ARTISTS: ArtistWithDetails[] = [
  {
    id: 'a1000000-0000-0000-0000-000000000001',
    user_id: 'u1000000-0000-0000-0000-000000000001',
    slug: 'rick-beatz',
    stage_name: 'Rick Beatz',
    bio: 'Produtor musical e sound designer focado em Boom Bap, Trap melódico e instrumentais autênticos.',
    banner_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&auto=format&fit=crop&q=80',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    verified: true,
    social_links: { instagram: '@rickbeatz', youtube: 'rickbeatz' },
    pix_key: 'rick@musio.live',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    follower_count: 1420,
    tracks: [
      {
        id: 't1000000-0000-0000-0000-000000000001',
        artist_id: 'a1000000-0000-0000-0000-000000000001',
        title: 'Fênix (Instrumental)',
        slug: 'fenix-instrumental',
        audio_url: 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3',
        cover_url: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&auto=format&fit=crop&q=80',
        duration_seconds: 184,
        is_exclusive: false,
        price_cents: 0,
        lyrics: null,
        bpm: 92,
        musical_key: 'Fm',
        play_count: 4890,
        like_count: 320,
        copyright_declaration: true,
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 't1000000-0000-0000-0000-000000000002',
        artist_id: 'a1000000-0000-0000-0000-000000000001',
        title: 'Horizonte Noturno',
        slug: 'horizonte-noturno',
        audio_url: 'https://cdn.freesound.org/previews/612/612611_5674468-lq.mp3',
        cover_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
        duration_seconds: 215,
        is_exclusive: false,
        price_cents: 0,
        lyrics: null,
        bpm: 120,
        musical_key: 'Am',
        play_count: 2750,
        like_count: 180,
        copyright_declaration: true,
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 't1000000-0000-0000-0000-000000000003',
        artist_id: 'a1000000-0000-0000-0000-000000000001',
        title: 'Beat Pack Vol. 1 [Exclusivo]',
        slug: 'beat-pack-vol-1',
        audio_url: 'https://cdn.freesound.org/previews/612/612612_5674468-lq.mp3',
        cover_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
        duration_seconds: 160,
        is_exclusive: true,
        price_cents: 2900,
        lyrics: null,
        bpm: 140,
        musical_key: 'C#m',
        play_count: 1100,
        like_count: 95,
        copyright_declaration: true,
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'a2000000-0000-0000-0000-000000000002',
    user_id: 'u2000000-0000-0000-0000-000000000002',
    slug: 'luna-silva',
    stage_name: 'Luna Silva',
    bio: 'Cantora e compositora de Neo-Soul e Nova MPB. Poesia crua e arranjos intimistas.',
    banner_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop&q=80',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    verified: true,
    social_links: { instagram: '@lunasilva' },
    pix_key: 'luna@musio.live',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    follower_count: 3200,
    tracks: [
      {
        id: 't2000000-0000-0000-0000-000000000001',
        artist_id: 'a2000000-0000-0000-0000-000000000002',
        title: 'Café & Madrugada',
        slug: 'cafe-e-madrugada',
        audio_url: 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3',
        cover_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
        duration_seconds: 198,
        is_exclusive: false,
        price_cents: 0,
        lyrics: 'Noite que cai sem pressa...',
        bpm: 78,
        musical_key: 'Gmaj7',
        play_count: 6400,
        like_count: 512,
        copyright_declaration: true,
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'a3000000-0000-0000-0000-000000000003',
    user_id: 'u3000000-0000-0000-0000-000000000003',
    slug: 'coletivo-eco',
    stage_name: 'Coletivo Eco',
    bio: 'Banda independente explorando texturas de Indie Rock, guitarras psicodélicas e sintetizadores analógicos.',
    banner_url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1600&auto=format&fit=crop&q=80',
    avatar_url: 'https://images.unsplash.com/photo-1520523839898-507125cd53c1?w=400&auto=format&fit=crop&q=80',
    verified: true,
    social_links: { instagram: '@coletivoeco' },
    pix_key: 'eco@musio.live',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    follower_count: 890,
  },
];

export const artistService = {
  async getArtists(): Promise<ArtistWithDetails[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('artists')
        .select('*, tracks(*)')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        return MOCK_ARTISTS;
      }

      return data as unknown as ArtistWithDetails[];
    } catch {
      return MOCK_ARTISTS;
    }
  },

  async getArtistBySlug(slug: string): Promise<ArtistWithDetails | null> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('artists')
        .select('*, tracks(*)')
        .eq('slug', slug)
        .maybeSingle();

      if (error || !data) {
        const mock = MOCK_ARTISTS.find((a) => a.slug === slug);
        return mock || null;
      }

      return data as unknown as ArtistWithDetails;
    } catch {
      const mock = MOCK_ARTISTS.find((a) => a.slug === slug);
      return mock || null;
    }
  },

  async updateArtistProfile(artistId: string, dto: UpdateArtistProfileDTO): Promise<void> {
    const supabase = createClient();

    try {
      const updatePayload: Database['public']['Tables']['artists']['Update'] = {};
      if (dto.stageName !== undefined) updatePayload.stage_name = dto.stageName;
      if (dto.bio !== undefined) updatePayload.bio = dto.bio;
      if (dto.avatarUrl !== undefined) updatePayload.avatar_url = dto.avatarUrl;
      if (dto.bannerUrl !== undefined) updatePayload.banner_url = dto.bannerUrl;
      if (dto.pixKey !== undefined) updatePayload.pix_key = dto.pixKey;
      if (dto.socialLinks !== undefined) updatePayload.social_links = dto.socialLinks;

      const { error } = await supabase
        .from('artists')
        .update(updatePayload)
        .eq('id', artistId);

      if (error) {
        console.warn('Erro ao atualizar artista no Supabase (atualizando local):', error.message);
      }
    } catch (err) {
      console.warn('Erro na chamada updateArtistProfile:', err);
    }

    // Atualiza o registro em memória no mock
    const target = MOCK_ARTISTS.find((a) => a.id === artistId) || MOCK_ARTISTS[0];
    if (target) {
      if (dto.stageName) target.stage_name = dto.stageName;
      if (dto.bio) target.bio = dto.bio;
      if (dto.avatarUrl) target.avatar_url = dto.avatarUrl;
      if (dto.bannerUrl) target.banner_url = dto.bannerUrl;
      if (dto.pixKey) target.pix_key = dto.pixKey;
      if (dto.socialLinks) target.social_links = { ...target.social_links, ...dto.socialLinks };
    }
  },
};
