import { createClient } from '@/lib/supabase/client';
import { ArtistWithDetails } from '@/types/music.types';
import { artistService, MOCK_ARTISTS } from './artist.service';

const STORAGE_KEY = 'musio_followed_artists';
const DEFAULT_INITIAL_FOLLOWED = ['a1000000-0000-0000-0000-000000000001'];

function isValidUUID(str?: string | null): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

function getLocalFollows(): Set<string> {
  if (typeof window === 'undefined') {
    return new Set<string>(DEFAULT_INITIAL_FOLLOWED);
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_INITIAL_FOLLOWED));
      return new Set(DEFAULT_INITIAL_FOLLOWED);
    }
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed : DEFAULT_INITIAL_FOLLOWED);
  } catch {
    return new Set<string>(DEFAULT_INITIAL_FOLLOWED);
  }
}

function saveLocalFollows(set: Set<string>): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
    } catch {
      // Ignore
    }
  }
}

export const followService = {
  async toggleFollow(fanId: string, artistId: string): Promise<{ following: boolean; newFollowerCount: number }> {
    const canUseSupabase = isValidUUID(fanId) && isValidUUID(artistId);

    if (!canUseSupabase) {
      const local = getLocalFollows();
      const isCurrentlyFollowing = local.has(artistId);

      if (isCurrentlyFollowing) {
        local.delete(artistId);
        saveLocalFollows(local);
        return { following: false, newFollowerCount: 1419 };
      } else {
        local.add(artistId);
        saveLocalFollows(local);
        return { following: true, newFollowerCount: 1421 };
      }
    }

    const supabase = createClient();

    try {
      const { data: existing, error: selectError } = await supabase
        .from('follows')
        .select('*')
        .eq('fan_id', fanId)
        .eq('artist_id', artistId)
        .maybeSingle();

      if (selectError) {
        const local = getLocalFollows();
        const isCurrentlyFollowing = local.has(artistId);
        if (isCurrentlyFollowing) {
          local.delete(artistId);
          saveLocalFollows(local);
          return { following: false, newFollowerCount: 1419 };
        } else {
          local.add(artistId);
          saveLocalFollows(local);
          return { following: true, newFollowerCount: 1421 };
        }
      }

      if (existing) {
        await supabase
          .from('follows')
          .delete()
          .eq('fan_id', fanId)
          .eq('artist_id', artistId);

        const local = getLocalFollows();
        local.delete(artistId);
        saveLocalFollows(local);
        return { following: false, newFollowerCount: 1419 };
      } else {
        await supabase
          .from('follows')
          .insert({ fan_id: fanId, artist_id: artistId });

        const local = getLocalFollows();
        local.add(artistId);
        saveLocalFollows(local);
        return { following: true, newFollowerCount: 1421 };
      }
    } catch {
      const local = getLocalFollows();
      const isCurrentlyFollowing = local.has(artistId);
      if (isCurrentlyFollowing) {
        local.delete(artistId);
        saveLocalFollows(local);
        return { following: false, newFollowerCount: 1419 };
      } else {
        local.add(artistId);
        saveLocalFollows(local);
        return { following: true, newFollowerCount: 1421 };
      }
    }
  },

  async isFollowing(fanId: string, artistId: string): Promise<boolean> {
    if (!isValidUUID(fanId) || !isValidUUID(artistId)) {
      return getLocalFollows().has(artistId);
    }

    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('follows')
        .select('artist_id')
        .eq('fan_id', fanId)
        .eq('artist_id', artistId)
        .maybeSingle();

      if (error) {
        return getLocalFollows().has(artistId);
      }

      return !!data;
    } catch {
      return getLocalFollows().has(artistId);
    }
  },

  async getFollowedArtists(fanId: string): Promise<ArtistWithDetails[]> {
    const allArtists = await artistService.getArtists();

    if (!isValidUUID(fanId)) {
      const local = getLocalFollows();
      return allArtists.filter((a) => local.has(a.id));
    }

    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('follows')
        .select('artist_id')
        .eq('fan_id', fanId);

      if (error || !data || data.length === 0) {
        const local = getLocalFollows();
        return allArtists.filter((a) => local.has(a.id));
      }

      const followedIds = new Set(data.map((f) => f.artist_id));
      return allArtists.filter((a) => followedIds.has(a.id));
    } catch {
      const local = getLocalFollows();
      return allArtists.filter((a) => local.has(a.id));
    }
  },

  getMockFollowedArtists(): ArtistWithDetails[] {
    const local = getLocalFollows();
    return MOCK_ARTISTS.filter((a) => local.has(a.id));
  },
};
