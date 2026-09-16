import { createClient } from '@/lib/supabase/client';
import { TrackWithArtist } from '@/types/music.types';
import { trackService } from './track.service';

export interface PlaylistWithTracks {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  tracks: TrackWithArtist[];
}

export interface CreatePlaylistDTO {
  title: string;
  description?: string;
  isPublic?: boolean;
  coverUrl?: string;
}

const mockPlaylists: PlaylistWithTracks[] = [
  {
    id: 'pl-1',
    user_id: 'user-default',
    title: 'Boas Vibrações & Lo-Fi',
    description: 'Minhas faixas instrumentais favoritas para trabalhar e relaxar.',
    cover_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
    is_public: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tracks: [],
  },
];

export const playlistService = {
  async getUserPlaylists(userId: string): Promise<PlaylistWithTracks[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        if (mockPlaylists[0] && mockPlaylists[0].tracks.length === 0) {
          const allTracks = await trackService.getExploreTracks();
          mockPlaylists[0].tracks = allTracks.slice(0, 2);
        }
        return mockPlaylists;
      }

      // Para cada playlist, buscar as faixas
      const allTracks = await trackService.getExploreTracks();
      const enriched: PlaylistWithTracks[] = await Promise.all(
        data.map(async (pl) => {
          const { data: plTracks } = await supabase
            .from('playlist_tracks')
            .select('track_id, position')
            .eq('playlist_id', pl.id)
            .order('position', { ascending: true });

          const trackIds = new Set((plTracks || []).map((pt) => pt.track_id));
          return {
            ...pl,
            tracks: allTracks.filter((t) => trackIds.has(t.id)),
          };
        })
      );

      return enriched;
    } catch {
      if (mockPlaylists[0] && mockPlaylists[0].tracks.length === 0) {
        const allTracks = await trackService.getExploreTracks();
        mockPlaylists[0].tracks = allTracks.slice(0, 2);
      }
      return mockPlaylists;
    }
  },

  async getPlaylistById(id: string): Promise<PlaylistWithTracks | null> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error || !data) {
        const found = mockPlaylists.find((p) => p.id === id) || mockPlaylists[0];
        if (found && found.tracks.length === 0) {
          const allTracks = await trackService.getExploreTracks();
          found.tracks = allTracks.slice(0, 2);
        }
        return found;
      }

      const allTracks = await trackService.getExploreTracks();
      const { data: plTracks } = await supabase
        .from('playlist_tracks')
        .select('track_id, position')
        .eq('playlist_id', id)
        .order('position', { ascending: true });

      const trackIds = new Set((plTracks || []).map((pt) => pt.track_id));
      return {
        ...data,
        tracks: allTracks.filter((t) => trackIds.has(t.id)),
      };
    } catch {
      const found = mockPlaylists.find((p) => p.id === id) || mockPlaylists[0];
      if (found && found.tracks.length === 0) {
        const allTracks = await trackService.getExploreTracks();
        found.tracks = allTracks.slice(0, 2);
      }
      return found;
    }
  },

  async createPlaylist(userId: string, dto: CreatePlaylistDTO): Promise<PlaylistWithTracks> {
    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from('playlists')
        .insert({
          user_id: userId,
          title: dto.title,
          description: dto.description || null,
          cover_url: dto.coverUrl || null,
          is_public: dto.isPublic ?? true,
        })
        .select()
        .single();

      if (error || !data) {
        return this.createMockPlaylist(userId, dto);
      }

      return { ...data, tracks: [] };
    } catch {
      return this.createMockPlaylist(userId, dto);
    }
  },

  async addTrackToPlaylist(playlistId: string, trackId: string): Promise<void> {
    const supabase = createClient();
    try {
      await supabase.from('playlist_tracks').insert({
        playlist_id: playlistId,
        track_id: trackId,
        position: 0,
      });
    } catch {
      // Ignora erro e atualiza mock
    }

    const target = mockPlaylists.find((p) => p.id === playlistId);
    if (target) {
      const allTracks = await trackService.getExploreTracks();
      const track = allTracks.find((t) => t.id === trackId);
      if (track && !target.tracks.some((t) => t.id === trackId)) {
        target.tracks.push(track);
      }
    }
  },

  async removeTrackFromPlaylist(playlistId: string, trackId: string): Promise<void> {
    const supabase = createClient();
    try {
      await supabase
        .from('playlist_tracks')
        .delete()
        .eq('playlist_id', playlistId)
        .eq('track_id', trackId);
    } catch {
      // Fallback
    }

    const target = mockPlaylists.find((p) => p.id === playlistId);
    if (target) {
      target.tracks = target.tracks.filter((t) => t.id !== trackId);
    }
  },

  async deletePlaylist(playlistId: string): Promise<void> {
    const supabase = createClient();
    try {
      await supabase.from('playlists').delete().eq('id', playlistId);
    } catch {
      // Fallback
    }

    const index = mockPlaylists.findIndex((p) => p.id === playlistId);
    if (index >= 0) {
      mockPlaylists.splice(index, 1);
    }
  },

  createMockPlaylist(userId: string, dto: CreatePlaylistDTO): PlaylistWithTracks {
    const newPl: PlaylistWithTracks = {
      id: `pl-${Date.now()}`,
      user_id: userId,
      title: dto.title,
      description: dto.description || null,
      cover_url: dto.coverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      is_public: dto.isPublic ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tracks: [],
    };
    mockPlaylists.unshift(newPl);
    return newPl;
  },
};
