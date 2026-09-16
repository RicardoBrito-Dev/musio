# Musio — Plataforma de Música Direta ao Artista

> **"Música independente. Direto de quem faz."**

O **Musio** é uma plataforma digital desenvolvida para aproximar criadores independentes e seus fãs, permitindo que artistas publiquem suas produções, construam comunidades engajadas e monetizem diretamente seu trabalho sem intermediários abusivos ou centavos predatórios por milhares de reproduções.

---

## 🚀 Tecnologias Utilizadas

### Frontend Web
- **[Next.js 15+](https://nextjs.org/)** (App Router, Server Actions, Server Components)
- **[React 19](https://react.dev/)**
- **[TypeScript](https://www.typescriptlang.org/)** (Tipagem rigorosa do banco e das entidades)
- **[Tailwind CSS](https://tailwindcss.com/)** (Interface moderna, minimalista e *dark-first*)
- **[Lucide React](https://lucide.dev/)** (Ícones limpos e funcionais)

### Backend & Infraestrutura
- **[Supabase](https://supabase.com/)**
  - **PostgreSQL**: banco relacional completo com mais de 25 tabelas.
  - **Supabase Auth**: autenticação integrada com gerenciamento de sessões via cookies assíncronos (`@supabase/ssr`).
  - **Row Level Security (RLS)**: segurança em camada de banco em 100% das tabelas.
  - **Supabase Storage**: estrutura preparada para áudios, capas e conteúdos restritos.

### Arquitetura de Pagamentos
- **Camada Desacoplada (`PaymentProvider`)**: interface abstrata pronta para integração de gateways brasileiros (Pix, Asaas, Pagar.me, etc.) sem reescrita de frontend.

---

## 🏛️ Visão da Arquitetura

O Musio foi projetado desde o primeiro dia com regras de negócio desacopladas para compartilhar o mesmo backend de forma transparente entre o **Web App** atual e o futuro **Mobile App (React Native + Expo)**:

```text
                    PLATAFORMA MUSIO
                            |
             +--------------+--------------+
             |                             |
          WEB APP                      MOBILE APP
      Next.js (App Router)        React Native + Expo
             |                             |
             +--------------+--------------+
                            |
              [ Camada de Serviços / SDK ]
                            |
                         BACKEND
                        Supabase
                            |
          +-----------------+-----------------+
          |                 |                 |
      PostgreSQL         Storage             Auth
     (25+ tabelas)      (Buckets)         (Sessions)
```

---

## ✨ Funcionalidades Principais

### 🎧 Para Fãs e Ouvintes
- **Landing Page explicativa**: manifesto da música independente e apresentação dos benefícios.
- **Explorar (`/explore`)**: busca em tempo real e filtros de gêneros musicais (Boom Bap, Trap, Lo-Fi, MPB, Indie, etc.).
- **Catálogo de Artistas (`/artists`)**: vitrine de talentos independentes com avatares e métricas de seguidores.
- **Página do Artista (`/artist/[slug]`)**: perfil completo com abas de Lançamentos, Exclusivos/Stems e Clube de Membros.
- **Sistema de Apoio ❤️**: contribuições diretas nos valores de R$5, R$10, R$20, R$50 ou personalizado via Pix.
- **Player Global Persistente**: barra inferior fixa que não interrompe a reprodução entre rotas, com controle de progresso, volume e fila.
- **Painel do Fã (`/dashboard`)**: atividades recentes e lançamentos dos criadores seguidos.

### 🎤 Para Artistas e Produtores
- **Painel Geral (`/dashboard/artist`)**: métricas em tempo real de reproduções, seguidores, conversão e saldo da carteira.
- **Gestão de Músicas (`/dashboard/artist/tracks`)**: catálogo de produções e fluxo de envio com **declaração expressa de direitos autorais**.
- **Lançamentos (`/dashboard/artist/albums`)**: organização de singles e EPs.
- **Analytics (`/dashboard/artist/analytics`)**: distribuição geográfica de ouvintes e divisão de audiência móvel vs desktop.
- **Carteira & Saques (`/dashboard/artist/earnings`)**: extrato de movimentações e solicitação de transferência automática via Pix.

### 🛡️ Administração e Moderação
- **Painel Administrativo (`/admin`)**: controle de métricas gerais da plataforma, integridade de direitos autorais e resolução de denúncias.

---

## 📁 Estrutura de Pastas

```text
src/
├── app/
│   ├── (auth)/             # Telas de login, cadastro e recuperação de senha
│   ├── (public)/           # Landing page, explorar, artistas, álbum e faixa
│   ├── dashboard/          # Painel do fã e sub-rotas do artista (analytics, tracks, earnings)
│   ├── admin/              # Painel de gestão e moderação
│   ├── auth/callback/      # Route handler de confirmação de sessão Supabase
│   ├── layout.tsx          # Layout base com Navbar, Footer, Player e Providers
│   └── globals.css         # Variáveis e tema dark-first
├── components/
│   ├── artist/             # Modais de apoio Pix e cards de artista
│   ├── layout/             # Navbar e Footer institucionais
│   ├── player/             # Player persistente, botões de áudio e gaveta de fila
│   └── track/              # Linhas de faixas interativas com play integrado
├── contexts/
│   ├── auth-context.tsx    # Contexto de autenticação reativo
│   └── player-context.tsx  # Controle de áudio nativo HTML5 e lista de reprodução
├── lib/
│   ├── payments/           # Interface PaymentProvider e mock de Pix
│   ├── supabase/           # Clientes browser, server e middleware (@supabase/ssr)
│   └── utils.ts            # Utilitários de formatação (BRL, duração mm:ss, classes CSS)
├── services/               # Serviços desacoplados de dados (artistas, faixas, auth)
└── types/                  # Tipagem de banco de dados e contratos de negócio
supabase/
├── migrations/             # Scripts SQL DDL, triggers e RLS
└── seed.sql                # Dados iniciais de gêneros para desenvolvimento
```

---

## ⚙️ Como Executar Localmente

### 1. Pré-requisitos
- **Node.js**: versão 18+ (recomendado Node 20 ou superior)
- **npm**, **pnpm** ou **yarn**

### 2. Clonar o Repositório
```bash
git clone https://github.com/RicardoBrito-Dev/musio.git
cd musio
```

### 3. Instalar as Dependências
```bash
npm install
```

### 4. Configurar as Variáveis de Ambiente
Copie o arquivo `.env.example` para `.env.local`:
```bash
cp .env.example .env.local
```

Preencha com as credenciais do seu projeto Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Configurar o Banco de Dados (Supabase)
1. Acesse o **SQL Editor** do seu projeto no Supabase.
2. Execute o conteúdo de [`supabase/migrations/20260916000001_initial_schema.sql`](supabase/migrations/20260916000001_initial_schema.sql).
3. Execute o conteúdo de [`supabase/seed.sql`](supabase/seed.sql) para carregar os gêneros iniciais.

### 6. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```
Abra no navegador em **[http://localhost:3000](http://localhost:3000)**.

---

## 🧪 Scripts Disponíveis

- `npm run dev`: inicia o servidor local de desenvolvimento com Turbopack.
- `npm run build`: realiza o build de produção e verificação de tipagem estrita TypeScript.
- `npm run lint`: executa o linter ESLint sobre todo o código.
- `npm run start`: inicia o servidor Next.js compilado para produção.

---

## 🗺️ Roadmap de Desenvolvimento

- [x] **Fase 1**: Fundação Sólida (Next.js, Tailwind, Supabase, RLS, Autenticação, Player Global, Telas Iniciais).
- [x] **Fase 2**: Artistas (Upload real no Supabase Storage, gestão de mídias e edição de perfil).
- [ ] **Fase 3**: Fãs & Catálogo (Playlists personalizadas, curtidas persistentes e histórico de reproduções).
- [ ] **Fase 4**: Monetização (Integração de gateway de pagamento brasileiro real para Pix e cartão).
- [ ] **Fase 5**: Marketplace & Clube (Venda de Stems/Beat Packs e assinaturas recorrentes do Clube do Artista).
- [ ] **Fase 6**: Aplicativo Mobile (React Native + Expo compartilhando o mesmo backend).

---

## 📄 Licença e Direitos

Projeto desenvolvido com foco na valorização da música independente. Todos os direitos autorais das músicas permanecem 100% de propriedade de seus respectivos criadores.
