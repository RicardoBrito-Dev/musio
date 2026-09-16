import { createClient } from '@/lib/supabase/client';

function isValidUUID(str?: string | null): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

export const playService = {
  async recordPlay(trackId: string, durationSeconds: number, userId?: string | null): Promise<void> {
    if (!isValidUUID(trackId)) {
      return;
    }

    const supabase = createClient();
    try {
      await supabase.from('plays').insert({
        track_id: trackId,
        user_id: isValidUUID(userId) ? (userId as string) : null,
        duration_played_seconds: durationSeconds,
      });
    } catch {
      // Ignora silenciosamente caso em modo offline/desconectado
    }
  },
};
