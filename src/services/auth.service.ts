import { createClient } from '@/lib/supabase/client';
import { UserRole } from '@/types/database.types';

export interface SignUpParams {
  email: string;
  password: string;
  displayName: string;
  role?: UserRole;
}

export const authService = {
  async signUp({ email, password, displayName, role = 'fan' }: SignUpParams) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          role,
        },
      },
    });

    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentProfile() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.warn('Erro ao carregar perfil:', error.message);
      return null;
    }

    return profile;
  },

  async getCurrentArtist() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: artist, error } = await supabase
      .from('artists')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.warn('Erro ao carregar artista:', error.message);
      return null;
    }

    return artist;
  },
};
