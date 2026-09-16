-- ==============================================================================
-- MUSIO: SCHEMA INICIAL, RLS & TRIGGERS (FASE 1)
-- "Música independente. Direto de quem faz."
-- ==============================================================================

-- 1. EXTENSÕES NECESSÁRIAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. FUNÇÃO AUXILIAR PARA ATUALIZAR TIMESTAMP
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. TABELA: PROFILES (Extensão da tabela auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'fan' CHECK (role IN ('fan', 'artist', 'admin')),
    username TEXT UNIQUE,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. TABELA: ARTISTS (Dados públicos e de criador)
CREATE TABLE IF NOT EXISTS public.artists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    stage_name TEXT NOT NULL,
    bio TEXT,
    banner_url TEXT,
    avatar_url TEXT,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
    pix_key TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_artists_updated_at
BEFORE UPDATE ON public.artists
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. TABELA: ARTIST_PROFILES (Métricas e preferências do artista)
CREATE TABLE IF NOT EXISTS public.artist_profiles (
    artist_id UUID PRIMARY KEY REFERENCES public.artists(id) ON DELETE CASCADE,
    monthly_listeners INTEGER NOT NULL DEFAULT 0,
    total_plays BIGINT NOT NULL DEFAULT 0,
    tags TEXT[] NOT NULL DEFAULT '{}',
    featured_track_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_artist_profiles_updated_at
BEFORE UPDATE ON public.artist_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. TABELA: GENRES (Gêneros musicais)
CREATE TABLE IF NOT EXISTS public.genres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    color TEXT NOT NULL DEFAULT '#f59e0b',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. TABELA: TRACKS (Faixas de áudio)
CREATE TABLE IF NOT EXISTS public.tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    audio_url TEXT NOT NULL,
    cover_url TEXT,
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    is_exclusive BOOLEAN NOT NULL DEFAULT FALSE,
    price_cents INTEGER NOT NULL DEFAULT 0,
    lyrics TEXT,
    bpm INTEGER,
    musical_key TEXT,
    play_count BIGINT NOT NULL DEFAULT 0,
    like_count BIGINT NOT NULL DEFAULT 0,
    copyright_declaration BOOLEAN NOT NULL DEFAULT TRUE,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_artist_track_slug UNIQUE (artist_id, slug)
);

CREATE TRIGGER set_tracks_updated_at
BEFORE UPDATE ON public.tracks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. TABELA: ALBUMS (Álbuns, EPs e Lançamentos)
CREATE TABLE IF NOT EXISTS public.albums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    release_type TEXT NOT NULL DEFAULT 'album' CHECK (release_type IN ('single', 'ep', 'album')),
    cover_url TEXT,
    description TEXT,
    release_date DATE NOT NULL DEFAULT CURRENT_DATE,
    price_cents INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_artist_album_slug UNIQUE (artist_id, slug)
);

CREATE TRIGGER set_albums_updated_at
BEFORE UPDATE ON public.albums
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. TABELA: ALBUM_TRACKS (Ordem das faixas nos lançamentos)
CREATE TABLE IF NOT EXISTS public.album_tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    album_id UUID NOT NULL REFERENCES public.albums(id) ON DELETE CASCADE,
    track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    track_number INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT unique_album_track UNIQUE (album_id, track_id)
);

-- 10. TABELA: TRACK_GENRES
CREATE TABLE IF NOT EXISTS public.track_genres (
    track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    genre_id UUID NOT NULL REFERENCES public.genres(id) ON DELETE CASCADE,
    PRIMARY KEY (track_id, genre_id)
);

-- 11. TABELA: PLAYLISTS
CREATE TABLE IF NOT EXISTS public.playlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    cover_url TEXT,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_playlists_updated_at
BEFORE UPDATE ON public.playlists
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 12. TABELA: PLAYLIST_TRACKS
CREATE TABLE IF NOT EXISTS public.playlist_tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
    track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 0,
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_playlist_track UNIQUE (playlist_id, track_id)
);

-- 13. TABELA: FOLLOWS (Fã segue Artista)
CREATE TABLE IF NOT EXISTS public.follows (
    fan_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (fan_id, artist_id)
);

-- 14. TABELA: LIKES (Curtida em Faixa)
CREATE TABLE IF NOT EXISTS public.likes (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, track_id)
);

-- 15. TABELA: PLAYS (Histórico de Reproduções para Analytics)
CREATE TABLE IF NOT EXISTS public.plays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    duration_played_seconds INTEGER NOT NULL DEFAULT 0,
    played_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. TABELA: PRODUCTS (Marketplace do Artista - stems, samples, packs, singles)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price_cents INTEGER NOT NULL,
    product_type TEXT NOT NULL DEFAULT 'single' CHECK (product_type IN ('single', 'album', 'stem', 'sample_pack', 'exclusive', 'merch')),
    cover_url TEXT,
    download_file_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 17. TABELA: ORDERS (Pedidos de apoio ou compra direta)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
    total_cents INTEGER NOT NULL,
    platform_fee_cents INTEGER NOT NULL DEFAULT 0,
    artist_net_cents INTEGER NOT NULL DEFAULT 0,
    support_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 18. TABELA: ORDER_ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    track_id UUID REFERENCES public.tracks(id) ON DELETE SET NULL,
    album_id UUID REFERENCES public.albums(id) ON DELETE SET NULL,
    item_type TEXT NOT NULL, -- 'support', 'product', 'track', 'album'
    price_cents INTEGER NOT NULL
);

-- 19. TABELA: PAYMENTS (Registro de transações e gateway)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    payment_method TEXT NOT NULL DEFAULT 'pix' CHECK (payment_method IN ('pix', 'credit_card', 'wallet', 'mock')),
    provider TEXT NOT NULL DEFAULT 'mock',
    provider_tx_id TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 20. TABELA: ARTIST_WALLETS (Carteira financeira do Artista)
CREATE TABLE IF NOT EXISTS public.artist_wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id UUID UNIQUE NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
    balance_available_cents BIGINT NOT NULL DEFAULT 0,
    balance_pending_cents BIGINT NOT NULL DEFAULT 0,
    total_earned_cents BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_artist_wallets_updated_at
BEFORE UPDATE ON public.artist_wallets
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 21. TABELA: TRANSACTIONS (Extrato financeiro)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES public.artist_wallets(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('sale', 'support', 'membership', 'payout', 'fee')),
    amount_cents INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 22. TABELA: PAYOUTS (Solicitações de Saque)
CREATE TABLE IF NOT EXISTS public.payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
    amount_cents INTEGER NOT NULL,
    pix_key TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 23. TABELA: MEMBERSHIP_PLANS (Clubes de Assinatura de Fãs)
CREATE TABLE IF NOT EXISTS public.membership_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price_monthly_cents INTEGER NOT NULL,
    benefits TEXT[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 24. TABELA: MEMBERSHIP_SUBSCRIBERS
CREATE TABLE IF NOT EXISTS public.membership_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES public.membership_plans(id) ON DELETE CASCADE,
    fan_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled')),
    current_period_end TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_plan_subscriber UNIQUE (plan_id, fan_id)
);

-- 25. TABELA: EXCLUSIVE_CONTENTS (Publicações fechadas para apoiadores/membros)
CREATE TABLE IF NOT EXISTS public.exclusive_contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    content_type TEXT NOT NULL DEFAULT 'post' CHECK (content_type IN ('audio', 'video', 'stems', 'post', 'download')),
    file_url TEXT,
    cover_url TEXT,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 26. TABELA: NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    link TEXT,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 27. TABELA: REPORTS (Denúncias e moderação de copyright)
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    track_id UUID REFERENCES public.tracks(id) ON DELETE SET NULL,
    artist_id UUID REFERENCES public.artists(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_reports_updated_at
BEFORE UPDATE ON public.reports
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 28. GATILHO AUTOMÁTICO: REGISTRO DE NOVO USUÁRIO (AUTH -> PROFILES)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    chosen_role TEXT;
    chosen_display_name TEXT;
    chosen_username TEXT;
    new_artist_id UUID;
BEGIN
    chosen_role := COALESCE(NEW.raw_user_meta_data->>'role', 'fan');
    chosen_display_name := COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1));
    chosen_username := COALESCE(NEW.raw_user_meta_data->>'username', LOWER(REGEXP_REPLACE(split_part(NEW.email, '@', 1), '[^a-zA-Z0-9_]', '', 'g')));

    -- Inserir perfil
    INSERT INTO public.profiles (id, role, username, display_name, avatar_url)
    VALUES (
        NEW.id,
        chosen_role,
        chosen_username || '_' || SUBSTRING(NEW.id::text, 1, 4),
        chosen_display_name,
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL)
    );

    -- Se for cadastrado como artista, inicializa tabela artists e artist_wallets
    IF chosen_role = 'artist' THEN
        INSERT INTO public.artists (user_id, slug, stage_name, bio)
        VALUES (
            NEW.id,
            chosen_username || '-' || SUBSTRING(NEW.id::text, 1, 4),
            chosen_display_name,
            'Artista independente no Musio'
        )
        RETURNING id INTO new_artist_id;

        INSERT INTO public.artist_profiles (artist_id)
        VALUES (new_artist_id);

        INSERT INTO public.artist_wallets (artist_id)
        VALUES (new_artist_id);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger disparado após criação em auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 29. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.album_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.track_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exclusive_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Função auxiliar: Checar se usuário logado é Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função auxiliar: Checar se usuário é dono do artista
CREATE OR REPLACE FUNCTION public.is_artist_owner(artist_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.artists
        WHERE id = artist_uuid AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES
CREATE POLICY "Perfis visíveis publicamente" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Usuário atualiza o próprio perfil" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- ARTISTS
CREATE POLICY "Artistas visíveis publicamente" ON public.artists
    FOR SELECT USING (true);

CREATE POLICY "Artista atualiza seus próprios dados" ON public.artists
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Artista insere seu registro" ON public.artists
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ARTIST PROFILES
CREATE POLICY "Estatísticas de artista públicas" ON public.artist_profiles
    FOR SELECT USING (true);

CREATE POLICY "Artista atualiza seus dados de perfil" ON public.artist_profiles
    FOR UPDATE USING (public.is_artist_owner(artist_id));

-- GENRES
CREATE POLICY "Gêneros são visíveis por todos" ON public.genres
    FOR SELECT USING (true);

CREATE POLICY "Apenas admin edita gêneros" ON public.genres
    FOR ALL USING (public.is_admin());

-- TRACKS
CREATE POLICY "Faixas publicadas são visíveis publicamente" ON public.tracks
    FOR SELECT USING (is_published = true OR public.is_artist_owner(artist_id) OR public.is_admin());

CREATE POLICY "Artista cria faixas para seu perfil" ON public.tracks
    FOR INSERT WITH CHECK (public.is_artist_owner(artist_id));

CREATE POLICY "Artista atualiza suas próprias faixas" ON public.tracks
    FOR UPDATE USING (public.is_artist_owner(artist_id) OR public.is_admin());

CREATE POLICY "Artista remove suas próprias faixas" ON public.tracks
    FOR DELETE USING (public.is_artist_owner(artist_id) OR public.is_admin());

-- ALBUMS
CREATE POLICY "Álbuns publicados são visíveis por todos" ON public.albums
    FOR SELECT USING (is_published = true OR public.is_artist_owner(artist_id) OR public.is_admin());

CREATE POLICY "Artista cria álbuns para seu perfil" ON public.albums
    FOR INSERT WITH CHECK (public.is_artist_owner(artist_id));

CREATE POLICY "Artista edita seus próprios álbuns" ON public.albums
    FOR UPDATE USING (public.is_artist_owner(artist_id) OR public.is_admin());

CREATE POLICY "Artista deleta seus próprios álbuns" ON public.albums
    FOR DELETE USING (public.is_artist_owner(artist_id) OR public.is_admin());

-- ALBUM_TRACKS
CREATE POLICY "Relação album-faixa pública" ON public.album_tracks
    FOR SELECT USING (true);

CREATE POLICY "Artista gerencia faixas do seu álbum" ON public.album_tracks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.albums
            WHERE albums.id = album_tracks.album_id AND public.is_artist_owner(albums.artist_id)
        )
    );

-- TRACK_GENRES
CREATE POLICY "Gêneros da faixa são públicos" ON public.track_genres
    FOR SELECT USING (true);

-- PLAYLISTS
CREATE POLICY "Playlists públicas visíveis por todos ou privadas pelo dono" ON public.playlists
    FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Usuário gerencia suas próprias playlists" ON public.playlists
    FOR ALL USING (auth.uid() = user_id);

-- PLAYLIST_TRACKS
CREATE POLICY "Faixas de playlist visíveis se playlist visível" ON public.playlist_tracks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.playlists
            WHERE playlists.id = playlist_tracks.playlist_id
            AND (playlists.is_public = true OR playlists.user_id = auth.uid())
        )
    );

CREATE POLICY "Usuário gerencia faixas da sua playlist" ON public.playlist_tracks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.playlists
            WHERE playlists.id = playlist_tracks.playlist_id
            AND playlists.user_id = auth.uid()
        )
    );

-- FOLLOWS
CREATE POLICY "Seguidores visíveis publicamente" ON public.follows
    FOR SELECT USING (true);

CREATE POLICY "Fã pode seguir/deixar de seguir artista" ON public.follows
    FOR ALL USING (auth.uid() = fan_id);

-- LIKES
CREATE POLICY "Curtidas visíveis para o próprio usuário" ON public.likes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuário gerencia suas próprias curtidas" ON public.likes
    FOR ALL USING (auth.uid() = user_id);

-- PLAYS
CREATE POLICY "Qualquer usuário pode registrar plays" ON public.plays
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Plays visíveis por admin e donos de faixas" ON public.plays
    FOR SELECT USING (
        auth.uid() = user_id OR
        public.is_admin() OR
        EXISTS (
            SELECT 1 FROM public.tracks
            WHERE tracks.id = plays.track_id AND public.is_artist_owner(tracks.artist_id)
        )
    );

-- PRODUCTS
CREATE POLICY "Produtos ativos são visíveis por todos" ON public.products
    FOR SELECT USING (is_active = true OR public.is_artist_owner(artist_id) OR public.is_admin());

CREATE POLICY "Artista gerencia seus produtos" ON public.products
    FOR ALL USING (public.is_artist_owner(artist_id) OR public.is_admin());

-- ORDERS
CREATE POLICY "Usuário vê seus próprios pedidos" ON public.orders
    FOR SELECT USING (auth.uid() = user_id OR public.is_artist_owner(artist_id) OR public.is_admin());

CREATE POLICY "Usuário pode criar pedidos" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ORDER_ITEMS
CREATE POLICY "Itens visíveis pelos envolvidos no pedido" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND (orders.user_id = auth.uid() OR public.is_artist_owner(orders.artist_id) OR public.is_admin())
        )
    );

-- PAYMENTS
CREATE POLICY "Pagamentos visíveis pelos envolvidos no pedido" ON public.payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = payments.order_id
            AND (orders.user_id = auth.uid() OR public.is_artist_owner(orders.artist_id) OR public.is_admin())
        )
    );

-- ARTIST_WALLETS
CREATE POLICY "Artista visualiza sua própria carteira" ON public.artist_wallets
    FOR SELECT USING (public.is_artist_owner(artist_id) OR public.is_admin());

-- TRANSACTIONS
CREATE POLICY "Artista visualiza transações de sua carteira" ON public.transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.artist_wallets
            WHERE artist_wallets.id = transactions.wallet_id
            AND (public.is_artist_owner(artist_wallets.artist_id) OR public.is_admin())
        )
    );

-- PAYOUTS
CREATE POLICY "Artista gerencia seus próprios saques" ON public.payouts
    FOR ALL USING (public.is_artist_owner(artist_id) OR public.is_admin());

-- MEMBERSHIP_PLANS
CREATE POLICY "Planos ativos são visíveis por todos" ON public.membership_plans
    FOR SELECT USING (is_active = true OR public.is_artist_owner(artist_id) OR public.is_admin());

CREATE POLICY "Artista gerencia seus planos de membros" ON public.membership_plans
    FOR ALL USING (public.is_artist_owner(artist_id) OR public.is_admin());

-- MEMBERSHIP_SUBSCRIBERS
CREATE POLICY "Inscrito e artista veem o status da assinatura" ON public.membership_subscribers
    FOR SELECT USING (
        auth.uid() = fan_id OR
        EXISTS (
            SELECT 1 FROM public.membership_plans
            WHERE membership_plans.id = membership_subscribers.plan_id
            AND public.is_artist_owner(membership_plans.artist_id)
        ) OR
        public.is_admin()
    );

-- EXCLUSIVE_CONTENTS
CREATE POLICY "Conteúdo exclusivo visível se publicado ou dono" ON public.exclusive_contents
    FOR SELECT USING (
        is_published = true OR public.is_artist_owner(artist_id) OR public.is_admin()
    );

CREATE POLICY "Artista gerencia conteúdos exclusivos" ON public.exclusive_contents
    FOR ALL USING (public.is_artist_owner(artist_id) OR public.is_admin());

-- NOTIFICATIONS
CREATE POLICY "Usuário visualiza suas próprias notificações" ON public.notifications
    FOR ALL USING (auth.uid() = user_id);

-- REPORTS
CREATE POLICY "Usuário cria denúncia" ON public.reports
    FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Denúncias acessíveis pelo criador ou admin" ON public.reports
    FOR SELECT USING (auth.uid() = reporter_id OR public.is_admin());

-- ==============================================================================
-- 30. CONFIGURAÇÃO DE BUCKETS DE STORAGE (METADATA)
-- ==============================================================================
-- Buckets sugeridos no Supabase Storage:
-- 1. 'covers'     (público - capas de faixas, álbuns, avatares, banners)
-- 2. 'tracks'     (privado ou público com URL assinada - arquivos de áudio)
-- 3. 'exclusive'  (privado - stems, acapellas, packs, downloads fechados)
-- 4. 'avatars'    (público - fotos de perfil de fãs e artistas)
