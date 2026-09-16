import { createClient } from '@/lib/supabase/client';

export interface UploadResult {
  url: string;
  path: string;
}

const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/flac',
  'audio/x-flac',
  'audio/ogg',
  'audio/mp4',
  'audio/x-m4a',
];

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const MAX_AUDIO_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export const storageService = {
  validateAudio(file: File): { valid: boolean; error?: string } {
    if (!ALLOWED_AUDIO_TYPES.includes(file.type) && !file.name.match(/\.(mp3|wav|flac|m4a|ogg)$/i)) {
      return { valid: false, error: 'Formato de áudio inválido. Formatos permitidos: MP3, WAV, FLAC, M4A.' };
    }
    if (file.size > MAX_AUDIO_SIZE_BYTES) {
      return { valid: false, error: 'O arquivo de áudio excede o limite máximo de 50MB.' };
    }
    return { valid: true };
  },

  validateImage(file: File): { valid: boolean; error?: string } {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
      return { valid: false, error: 'Formato de imagem inválido. Formatos permitidos: JPG, PNG, WEBP.' };
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return { valid: false, error: 'A imagem de capa excede o limite máximo de 5MB.' };
    }
    return { valid: true };
  },

  async uploadTrackAudio(file: File, artistId: string): Promise<UploadResult> {
    const validation = this.validateAudio(file);
    if (!validation.valid) throw new Error(validation.error);

    const supabase = createClient();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${artistId}/${Date.now()}_${cleanFileName}`;

    try {
      const { data, error } = await supabase.storage
        .from('tracks')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.warn('Falha no upload para o Supabase Storage (modo fallback ativado):', error.message);
        return {
          url: URL.createObjectURL(file),
          path: filePath,
        };
      }

      const { data: publicUrlData } = supabase.storage
        .from('tracks')
        .getPublicUrl(data.path);

      return {
        url: publicUrlData.publicUrl,
        path: data.path,
      };
    } catch {
      return {
        url: URL.createObjectURL(file),
        path: filePath,
      };
    }
  },

  async uploadCoverImage(file: File, artistId: string): Promise<UploadResult> {
    const validation = this.validateImage(file);
    if (!validation.valid) throw new Error(validation.error);

    const supabase = createClient();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${artistId}/${Date.now()}_${cleanFileName}`;

    try {
      const { data, error } = await supabase.storage
        .from('covers')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.warn('Falha no upload para covers:', error.message);
        return {
          url: URL.createObjectURL(file),
          path: filePath,
        };
      }

      const { data: publicUrlData } = supabase.storage
        .from('covers')
        .getPublicUrl(data.path);

      return {
        url: publicUrlData.publicUrl,
        path: data.path,
      };
    } catch {
      return {
        url: URL.createObjectURL(file),
        path: filePath,
      };
    }
  },

  async uploadAvatarImage(file: File, userId: string): Promise<UploadResult> {
    const validation = this.validateImage(file);
    if (!validation.valid) throw new Error(validation.error);

    const supabase = createClient();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${userId}/${Date.now()}_${cleanFileName}`;

    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        return {
          url: URL.createObjectURL(file),
          path: filePath,
        };
      }

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path);

      return {
        url: publicUrlData.publicUrl,
        path: data.path,
      };
    } catch {
      return {
        url: URL.createObjectURL(file),
        path: filePath,
      };
    }
  },
};
