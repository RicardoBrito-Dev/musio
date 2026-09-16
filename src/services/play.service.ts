import { createClient } from '@/lib/supabase/client';

export const playService = {
  async recordPlay(trackId: string, durationSeconds: number, userId?: string | null): Promise<void> {
    const supabase = createClient();
    try {
      await supabase.from('plays').insert({
        track_id: trackId,
        user_id: userId || null,
        duration_played_seconds: durationSeconds,
      });
    } catch {
      // Ignora silenciosamente caso em modo offline/desconectado
    }
  },
};
