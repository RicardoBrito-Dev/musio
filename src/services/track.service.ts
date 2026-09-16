import { createClient } from '@/lib/supabase/client';
import { TrackWithArtist, Track } from '@/types/music.types';
import { Database } from '@/types/database.types';
import { MOCK_ARTISTS } from './artist.service';

export interface CreateTrackDTO {
  artistId: string;
  title: string;
  audioUrl: string;
  coverUrl?: string | null;
  durationSeconds: number;
  isExclusive?: boolean;
  priceCents?: number;
  lyrics?: string | null;
  bpm?: number | null;
  musicalKey?: string | null;
  copyrightDeclaration: boolean;
}

export const trackService = {
  async getExploreTracks(): Promise<TrackWithArtist[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('tracks')
        .select('*, artist:artists(id, stage_name, slug, avatar_url, verified)')
        .eq('is_published', true)
        .order('play_count', { ascending: false });

      if (error || !data || data.length === 0) {
        return this.getMockExploreTracks();
      }

      return data as unknown as TrackWithArtist[];
    } catch {
      return this.getMockExploreTracks();
    }
  },

  async getArtistTracks(artistId: string): Promise<Track[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('tracks')
        .select('*')
        .eq('artist_id', artistId)
        .order('created_at', { ascending: false });

      if (error || !data) {
        const mockArtist = MOCK_ARTISTS.find((a) => a.id === artistId);
        return mockArtist?.tracks || [];
      }

      return data;
    } catch {
      const mockArtist = MOCK_ARTISTS.find((a) => a.id === artistId);
      return mockArtist?.tracks || [];
    }
  },

  async createTrack(dto: CreateTrackDTO): Promise<Track> {
    if (!dto.copyrightDeclaration) {
      throw new Error('É obrigatório aceitar os termos de direitos autorais para publicar.');
    }

    const slug = dto.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || `track-${Date.now()}`;

    const supabase = createClient();

    try {
      const insertData: Database['public']['Tables']['tracks']['Insert'] = {
        artist_id: dto.artistId,
        title: dto.title,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        audio_url: dto.audioUrl,
        cover_url: dto.coverUrl || null,
        duration_seconds: dto.durationSeconds,
        is_exclusive: dto.isExclusive ?? false,
        price_cents: dto.priceCents ?? 0,
        lyrics: dto.lyrics || null,
        bpm: dto.bpm || null,
        musical_key: dto.musicalKey || null,
        copyright_declaration: true,
        is_published: true,
      };

      const { data, error } = await supabase
        .from('tracks')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.warn('Fallback local ao criar faixa:', error.message);
        return this.createMockTrack(dto, slug);
      }

      return data;
    } catch {
      return this.createMockTrack(dto, slug);
    }
  },

  async deleteTrack(trackId: string): Promise<void> {
    const supabase = createClient();
    try {
      await supabase.from('tracks').delete().eq('id', trackId);
    } catch (err) {
      console.warn('Erro ao deletar faixa:', err);
    }
  },

  createMockTrack(dto: CreateTrackDTO, slug: string): Track {
    const newTrack: Track = {
      id: `t_${Date.now()}`,
      artist_id: dto.artistId,
      title: dto.title,
      slug,
      audio_url: dto.audioUrl,
      cover_url: dto.coverUrl || null,
      duration_seconds: dto.durationSeconds,
      is_exclusive: dto.isExclusive ?? false,
      price_cents: dto.priceCents ?? 0,
      lyrics: dto.lyrics || null,
      bpm: dto.bpm || null,
      musical_key: dto.musicalKey || null,
      play_count: 0,
      like_count: 0,
      copyright_declaration: true,
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Adiciona ao mock local para refletir na sessão
    const mockArtist = MOCK_ARTISTS.find((a) => a.id === dto.artistId) || MOCK_ARTISTS[0];
    if (mockArtist) {
      mockArtist.tracks = [newTrack, ...(mockArtist.tracks || [])];
    }

    return newTrack;
  },

  getMockExploreTracks(): TrackWithArtist[] {
    const list: TrackWithArtist[] = [];
    MOCK_ARTISTS.forEach((artist) => {
      (artist.tracks || []).forEach((t) => {
        list.push({
          ...t,
          artist: {
            id: artist.id,
            stage_name: artist.stage_name,
            slug: artist.slug,
            avatar_url: artist.avatar_url,
            verified: artist.verified,
          },
        });
      });
    });
    return list;
  },
};
