-- ==============================================================================
-- MUSIO: SEED DATA INICIAL
-- Gêneros musicais e dados base para inicialização do ambiente
-- ==============================================================================

INSERT INTO public.genres (name, slug, color) VALUES
('Boom Bap & Hip-Hop', 'hip-hop', '#f59e0b'),
('Trap & Drill', 'trap', '#ef4444'),
('Lo-Fi & Chillhop', 'lo-fi', '#8b5cf6'),
('Indie & Rock Alternativo', 'indie', '#06b6d4'),
('R&B & Neo-Soul', 'r-and-b', '#ec4899'),
('MPB & Nova MPB', 'mpb', '#10b981'),
('Electronic & House', 'electronic', '#3b82f6'),
('Afrobeats & Dancehall', 'afrobeats', '#f97316'),
('Synthwave & Retrowave', 'synthwave', '#a855f7'),
('Jazz & Instrumental', 'jazz', '#64748b')
ON CONFLICT (name) DO NOTHING;
