import { createClient } from '@/lib/supabase/client';
import { Album, ReleaseType, AlbumWithArtist, Track } from '@/types/music.types';
import { Database } from '@/types/database.types';
import { MOCK_ARTISTS } from './artist.service';

export interface CreateAlbumDTO {
  artistId: string;
  title: string;
  releaseType: ReleaseType;
  coverUrl?: string | null;
  description?: string | null;
  releaseDate?: string;
  priceCents?: number;
  trackIds?: string[];
}

export const MOCK_ALBUMS: AlbumWithArtist[] = [
  {
    id: 'alb-1',
    artist_id: 'a1000000-0000-0000-0000-000000000001',
    title: 'Fênix EP',
    slug: 'fenix-ep',
    release_type: 'ep',
    cover_url: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&auto=format&fit=crop&q=80',
    description: 'Primeiro projeto independente de Rick Beatz combinando beats lo-fi e melodias densas.',
    release_date: '2026-03-10',
    price_cents: 0,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    artist: {
      id: 'a1000000-0000-0000-0000-000000000001',
      stage_name: 'Rick Beatz',
      slug: 'rick-beatz',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      verified: true,
    },
    tracks: MOCK_ARTISTS[0].tracks,
  },
];

export const albumService = {
  async getArtistAlbums(artistId: string): Promise<Album[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .eq('artist_id', artistId)
        .order('release_date', { ascending: false });

      if (error || !data || data.length === 0) {
        return MOCK_ALBUMS.filter((a) => a.artist_id === artistId);
      }

      return data;
    } catch {
      return MOCK_ALBUMS.filter((a) => a.artist_id === artistId);
    }
  },

  async getAlbumBySlug(slug: string): Promise<AlbumWithArtist | null> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('albums')
        .select('*, artist:artists(id, stage_name, slug, avatar_url, verified)')
        .eq('slug', slug)
        .maybeSingle();

      if (error || !data) {
        return MOCK_ALBUMS.find((a) => a.slug === slug) || null;
      }

      return data as unknown as AlbumWithArtist;
    } catch {
      return MOCK_ALBUMS.find((a) => a.slug === slug) || null;
    }
  },

  async createAlbum(dto: CreateAlbumDTO): Promise<Album> {
    const slug = dto.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || `album-${Date.now()}`;

    const supabase = createClient();

    try {
      const insertData: Database['public']['Tables']['albums']['Insert'] = {
        artist_id: dto.artistId,
        title: dto.title,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        release_type: dto.releaseType,
        cover_url: dto.coverUrl || null,
        description: dto.description || null,
        release_date: dto.releaseDate || new Date().toISOString().split('T')[0],
        price_cents: dto.priceCents ?? 0,
        is_published: true,
      };

      const { data: album, error } = await supabase
        .from('albums')
        .insert(insertData)
        .select()
        .single();

      if (error || !album) {
        console.warn('Fallback ao criar álbum:', error?.message);
        return this.createMockAlbum(dto, slug);
      }

      // Se informou faixas, insere na tabela de junção album_tracks
      if (dto.trackIds && dto.trackIds.length > 0) {
        const albumTracksData: Database['public']['Tables']['album_tracks']['Insert'][] = dto.trackIds.map((trackId, idx) => ({
          album_id: album.id,
          track_id: trackId,
          track_number: idx + 1,
        }));
        await supabase.from('album_tracks').insert(albumTracksData);
      }

      return album;
    } catch {
      return this.createMockAlbum(dto, slug);
    }
  },

  createMockAlbum(dto: CreateAlbumDTO, slug: string): Album {
    const newAlbum: Album = {
      id: `alb_${Date.now()}`,
      artist_id: dto.artistId,
      title: dto.title,
      slug,
      release_type: dto.releaseType,
      cover_url: dto.coverUrl || null,
      description: dto.description || null,
      release_date: dto.releaseDate || new Date().toISOString().split('T')[0],
      price_cents: dto.priceCents ?? 0,
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const mockArtist = MOCK_ARTISTS.find((a) => a.id === dto.artistId) || MOCK_ARTISTS[0];
    const albumWithArtist: AlbumWithArtist = {
      ...newAlbum,
      artist: {
        id: mockArtist.id,
        stage_name: mockArtist.stage_name,
        slug: mockArtist.slug,
        avatar_url: mockArtist.avatar_url,
        verified: mockArtist.verified,
      },
      tracks: (mockArtist.tracks || []).filter((t: Track) => dto.trackIds?.includes(t.id)),
    };

    MOCK_ALBUMS.unshift(albumWithArtist);
    return newAlbum;
  },
};
