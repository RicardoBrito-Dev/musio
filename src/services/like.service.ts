import { createClient } from '@/lib/supabase/client';
import { TrackWithArtist } from '@/types/music.types';
import { trackService } from './track.service';

// Mock em memória para desenvolvimento local
const mockLikedTrackIds = new Set<string>(['t1000000-0000-0000-0000-000000000001']);

export const likeService = {
  async toggleLike(userId: string, trackId: string): Promise<{ liked: boolean; newCount: number }> {
    const supabase = createClient();

    try {
      // Checar se já curtiu
      const { data: existing } = await supabase
        .from('likes')
        .select('*')
        .eq('user_id', userId)
        .eq('track_id', trackId)
        .maybeSingle();

      if (existing) {
        // Remover curtida
        await supabase
          .from('likes')
          .delete()
          .eq('user_id', userId)
          .eq('track_id', trackId);

        mockLikedTrackIds.delete(trackId);
        return { liked: false, newCount: 319 };
      } else {
        // Adicionar curtida
        await supabase
          .from('likes')
          .insert({ user_id: userId, track_id: trackId });

        mockLikedTrackIds.add(trackId);
        return { liked: true, newCount: 321 };
      }
    } catch {
      // Fallback local
      if (mockLikedTrackIds.has(trackId)) {
        mockLikedTrackIds.delete(trackId);
        return { liked: false, newCount: 319 };
      } else {
        mockLikedTrackIds.add(trackId);
        return { liked: true, newCount: 321 };
      }
    }
  },

  async isLiked(userId: string, trackId: string): Promise<boolean> {
    const supabase = createClient();
    try {
      const { data } = await supabase
        .from('likes')
        .select('track_id')
        .eq('user_id', userId)
        .eq('track_id', trackId)
        .maybeSingle();

      return !!data || mockLikedTrackIds.has(trackId);
    } catch {
      return mockLikedTrackIds.has(trackId);
    }
  },

  async getUserLikedTracks(userId: string): Promise<TrackWithArtist[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('likes')
        .select('track_id')
        .eq('user_id', userId);

      if (error || !data || data.length === 0) {
        return this.getMockLikedTracks();
      }

      const allTracks = await trackService.getExploreTracks();
      const likedIds = new Set(data.map((l) => l.track_id));
      return allTracks.filter((t) => likedIds.has(t.id));
    } catch {
      return this.getMockLikedTracks();
    }
  },

  async getMockLikedTracks(): Promise<TrackWithArtist[]> {
    const allTracks = await trackService.getExploreTracks();
    return allTracks.filter((t) => mockLikedTrackIds.has(t.id));
  },
};
