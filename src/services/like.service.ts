import { createClient } from '@/lib/supabase/client';
import { TrackWithArtist } from '@/types/music.types';
import { trackService } from './track.service';

const STORAGE_KEY = 'musio_liked_tracks';
const DEFAULT_INITIAL_LIKED = ['t1000000-0000-0000-0000-000000000001'];

function isValidUUID(str?: string | null): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

function getLocalLikes(): Set<string> {
  if (typeof window === 'undefined') {
    return new Set<string>(DEFAULT_INITIAL_LIKED);
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_INITIAL_LIKED));
      return new Set(DEFAULT_INITIAL_LIKED);
    }
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed : DEFAULT_INITIAL_LIKED);
  } catch {
    return new Set<string>(DEFAULT_INITIAL_LIKED);
  }
}

function saveLocalLikes(set: Set<string>): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
    } catch {
      // Ignore quota errors
    }
  }
}

function emitLikeChange(trackId: string, liked: boolean): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('musio:like-changed', {
        detail: { trackId, liked },
      })
    );
  }
}

export const likeService = {
  async toggleLike(userId: string, trackId: string): Promise<{ liked: boolean; newCount: number }> {
    const canUseSupabase = isValidUUID(userId) && isValidUUID(trackId);

    if (!canUseSupabase) {
      const localLikes = getLocalLikes();
      const isCurrentlyLiked = localLikes.has(trackId);

      if (isCurrentlyLiked) {
        localLikes.delete(trackId);
        saveLocalLikes(localLikes);
        emitLikeChange(trackId, false);
        return { liked: false, newCount: 319 };
      } else {
        localLikes.add(trackId);
        saveLocalLikes(localLikes);
        emitLikeChange(trackId, true);
        return { liked: true, newCount: 321 };
      }
    }

    const supabase = createClient();

    try {
      // 1. Checa se já existe curtida
      const { data: existing, error: selectError } = await supabase
        .from('likes')
        .select('track_id')
        .eq('user_id', userId)
        .eq('track_id', trackId)
        .maybeSingle();

      if (selectError) {
        // Fallback local caso o banco falhe
        const localLikes = getLocalLikes();
        const isCurrentlyLiked = localLikes.has(trackId);
        if (isCurrentlyLiked) {
          localLikes.delete(trackId);
          saveLocalLikes(localLikes);
          emitLikeChange(trackId, false);
          return { liked: false, newCount: 319 };
        } else {
          localLikes.add(trackId);
          saveLocalLikes(localLikes);
          emitLikeChange(trackId, true);
          return { liked: true, newCount: 321 };
        }
      }

      if (existing) {
        // Já curtido -> Descurtir
        await supabase
          .from('likes')
          .delete()
          .eq('user_id', userId)
          .eq('track_id', trackId);

        const localLikes = getLocalLikes();
        localLikes.delete(trackId);
        saveLocalLikes(localLikes);
        emitLikeChange(trackId, false);

        return { liked: false, newCount: 319 };
      } else {
        // Não curtido -> Curtir
        await supabase
          .from('likes')
          .insert({ user_id: userId, track_id: trackId });

        const localLikes = getLocalLikes();
        localLikes.add(trackId);
        saveLocalLikes(localLikes);
        emitLikeChange(trackId, true);

        return { liked: true, newCount: 321 };
      }
    } catch {
      // Fallback local
      const localLikes = getLocalLikes();
      const isCurrentlyLiked = localLikes.has(trackId);
      if (isCurrentlyLiked) {
        localLikes.delete(trackId);
        saveLocalLikes(localLikes);
        emitLikeChange(trackId, false);
        return { liked: false, newCount: 319 };
      } else {
        localLikes.add(trackId);
        saveLocalLikes(localLikes);
        emitLikeChange(trackId, true);
        return { liked: true, newCount: 321 };
      }
    }
  },

  async isLiked(userId: string, trackId: string): Promise<boolean> {
    if (!isValidUUID(userId) || !isValidUUID(trackId)) {
      return getLocalLikes().has(trackId);
    }

    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('likes')
        .select('track_id')
        .eq('user_id', userId)
        .eq('track_id', trackId)
        .maybeSingle();

      if (error) {
        return getLocalLikes().has(trackId);
      }

      return !!data;
    } catch {
      return getLocalLikes().has(trackId);
    }
  },

  async getUserLikedTracks(userId: string): Promise<TrackWithArtist[]> {
    const allTracks = await trackService.getExploreTracks();

    if (!isValidUUID(userId)) {
      const local = getLocalLikes();
      return allTracks.filter((t) => local.has(t.id));
    }

    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('likes')
        .select('track_id')
        .eq('user_id', userId);

      if (error || !data || data.length === 0) {
        const local = getLocalLikes();
        return allTracks.filter((t) => local.has(t.id));
      }

      const likedIds = new Set(data.map((l) => l.track_id));
      return allTracks.filter((t) => likedIds.has(t.id));
    } catch {
      const local = getLocalLikes();
      return allTracks.filter((t) => local.has(t.id));
    }
  },

  async getMockLikedTracks(): Promise<TrackWithArtist[]> {
    const allTracks = await trackService.getExploreTracks();
    const local = getLocalLikes();
    return allTracks.filter((t) => local.has(t.id));
  },
};
