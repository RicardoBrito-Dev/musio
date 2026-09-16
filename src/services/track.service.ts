import { createClient } from '@/lib/supabase/client';
import { TrackWithArtist } from '@/types/music.types';
import { MOCK_ARTISTS } from './artist.service';

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
