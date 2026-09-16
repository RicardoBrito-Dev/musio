import { Database } from './database.types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Artist = Database['public']['Tables']['artists']['Row'];
export type Track = Database['public']['Tables']['tracks']['Row'];
export type Album = Database['public']['Tables']['albums']['Row'];
export type Genre = Database['public']['Tables']['genres']['Row'];

export interface TrackWithArtist extends Track {
  artist: Pick<Artist, 'id' | 'stage_name' | 'slug' | 'avatar_url' | 'verified'>;
}

export interface AlbumWithArtist extends Album {
  artist: Pick<Artist, 'id' | 'stage_name' | 'slug' | 'avatar_url' | 'verified'>;
  tracks?: Track[];
}

export interface ArtistWithDetails extends Artist {
  profile?: Profile;
  tracks?: Track[];
  albums?: Album[];
  follower_count?: number;
  is_following?: boolean;
}

export interface PlayerTrack {
  id: string;
  title: string;
  artistName: string;
  artistSlug: string;
  audioUrl: string;
  coverUrl?: string | null;
  durationSeconds: number;
}
