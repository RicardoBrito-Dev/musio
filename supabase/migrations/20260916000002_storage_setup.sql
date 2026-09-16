-- ==============================================================================
-- MUSIO: CONFIGURAÇÃO DE BUCKETS E RLS DO SUPABASE STORAGE (FASE 2)
-- Buckets: covers, tracks, avatars, exclusive
-- ==============================================================================

-- 1. Criação dos Buckets de Armazenamento
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('covers', 'covers', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('tracks', 'tracks', true, 52428800, ARRAY['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/ogg', 'audio/mp4', 'audio/x-m4a']),
    ('exclusive', 'exclusive', false, 104857600, ARRAY['application/zip', 'application/x-zip-compressed', 'audio/wav', 'audio/flac'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Políticas de Acesso (RLS) no storage.objects

-- Leitura pública para covers, avatars e tracks
CREATE POLICY "Leitura pública de capas"
ON storage.objects FOR SELECT
USING (bucket_id = 'covers');

CREATE POLICY "Leitura pública de avatares"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Leitura pública de faixas de áudio"
ON storage.objects FOR SELECT
USING (bucket_id = 'tracks');

-- Upload para usuários autenticados
CREATE POLICY "Usuários autenticados enviam capas"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'covers');

CREATE POLICY "Usuários autenticados enviam avatares"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Artistas autenticados enviam faixas"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'tracks');

CREATE POLICY "Artistas autenticados enviam conteúdo exclusivo"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'exclusive');

-- Atualização e exclusão apenas pelo proprietário do arquivo
CREATE POLICY "Usuários atualizam seus arquivos de capa"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'covers' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Usuários removem suas capas"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'covers' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Artistas removem suas faixas de áudio"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'tracks' AND auth.uid()::text = (storage.foldername(name))[1]);
