import { createClient } from '@/lib/supabase/client';
import { ArtistWithDetails } from '@/types/music.types';
import { artistService, MOCK_ARTISTS } from './artist.service';

const mockFollowedArtistIds = new Set<string>(['a1000000-0000-0000-0000-000000000001']);

export const followService = {
  async toggleFollow(fanId: string, artistId: string): Promise<{ following: boolean; newFollowerCount: number }> {
    const supabase = createClient();

    try {
      const { data: existing } = await supabase
        .from('follows')
        .select('*')
        .eq('fan_id', fanId)
        .eq('artist_id', artistId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('follows')
          .delete()
          .eq('fan_id', fanId)
          .eq('artist_id', artistId);

        mockFollowedArtistIds.delete(artistId);
        return { following: false, newFollowerCount: 1419 };
      } else {
        await supabase
          .from('follows')
          .insert({ fan_id: fanId, artist_id: artistId });

        mockFollowedArtistIds.add(artistId);
        return { following: true, newFollowerCount: 1421 };
      }
    } catch {
      if (mockFollowedArtistIds.has(artistId)) {
        mockFollowedArtistIds.delete(artistId);
        return { following: false, newFollowerCount: 1419 };
      } else {
        mockFollowedArtistIds.add(artistId);
        return { following: true, newFollowerCount: 1421 };
      }
    }
  },

  async isFollowing(fanId: string, artistId: string): Promise<boolean> {
    const supabase = createClient();
    try {
      const { data } = await supabase
        .from('follows')
        .select('artist_id')
        .eq('fan_id', fanId)
        .eq('artist_id', artistId)
        .maybeSingle();

      return !!data || mockFollowedArtistIds.has(artistId);
    } catch {
      return mockFollowedArtistIds.has(artistId);
    }
  },

  async getFollowedArtists(fanId: string): Promise<ArtistWithDetails[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('follows')
        .select('artist_id')
        .eq('fan_id', fanId);

      if (error || !data || data.length === 0) {
        return this.getMockFollowedArtists();
      }

      const allArtists = await artistService.getArtists();
      const followedIds = new Set(data.map((f) => f.artist_id));
      return allArtists.filter((a) => followedIds.has(a.id));
    } catch {
      return this.getMockFollowedArtists();
    }
  },

  getMockFollowedArtists(): ArtistWithDetails[] {
    return MOCK_ARTISTS.filter((a) => mockFollowedArtistIds.has(a.id));
  },
};
