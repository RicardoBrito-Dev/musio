import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Compass,
  ArrowRight,
  Heart,
  Headphones,
  ShoppingBag,
  Flame,
  ShieldCheck,
  Coins,
  Radio,
  BarChart3,
  Users,
} from 'lucide-react';
import { artistService } from '@/services/artist.service';
import { trackService } from '@/services/track.service';
import { TrackRow } from '@/components/track/track-row';

export default async function HomePage() {
  const artists = await artistService.getArtists();
  const popularTracks = await trackService.getExploreTracks();

  return (
    <div className="space-y-24 pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 lg:pt-28 pb-12 overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-500/15 via-orange-600/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs text-amber-400 font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>A revolução da música independente</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
            Música independente.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-300">
              Direto de quem faz.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-xl text-zinc-400 font-normal leading-relaxed">
            Descubra artistas autênticos, apoie seus criadores favoritos sem intermediários abusivos e tenha acesso a faixas, stems e conteúdos exclusivos.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/explore"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-bold text-base shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-5 h-5 stroke-[2.5]" />
              <span>Explorar músicas</span>
            </Link>

            <Link
              href="/register?role=artist"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-100 font-semibold text-base transition-all flex items-center justify-center gap-2"
            >
              <span>Sou artista</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </Link>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% dos direitos com o criador
            </span>
            <span className="flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-400" /> Monetização direta via Pix
            </span>
            <span className="flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-orange-400" /> Player de alta fidelidade
            </span>
          </div>
        </div>
      </section>

      {/* 2. DESTAQUE MUSICAL INICIAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              Lançamentos em Destaque
            </h2>
            <p className="text-sm text-zinc-400 mt-1">Ouça agora faixas recém-publicadas pelos artistas</p>
          </div>
          <Link href="/explore" className="text-sm font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1">
            Ver todas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {popularTracks.slice(0, 4).map((track, i) => (
            <TrackRow key={track.id} track={track} index={i} />
          ))}
        </div>
      </section>

      {/* 3. ARTISTAS EM EVIDÊNCIA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-500" />
              Artistas Independentes
            </h2>
            <p className="text-sm text-zinc-400 mt-1">Conecte-se e apoie os talentos de destaque</p>
          </div>
          <Link href="/artists" className="text-sm font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1">
            Conhecer todos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map((artist) => (
            <Link
              key={artist.id}
              href={`/artist/${artist.slug}`}
              className="group p-5 rounded-3xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-amber-500/40 transition-all block relative overflow-hidden"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-zinc-800 border border-zinc-700/80 flex-shrink-0">
                  {artist.avatar_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={artist.avatar_url} alt={artist.stage_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-base text-zinc-100 group-hover:text-amber-400 transition-colors truncate">
                      {artist.stage_name}
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                    {artist.bio}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. PILARES: PARA FÃS & PARA ARTISTAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Box Fãs */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-zinc-900/80 to-zinc-950 border border-zinc-800/90 relative space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Para os Fãs</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Uma experiência intimista de escuta. Descubra novos talentos antes de todo mundo e tenha um canal de proximidade real com seus ídolos.
            </p>
            <ul className="space-y-3 text-sm text-zinc-300">
              <li className="flex items-start gap-2.5">
                <Compass className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>Descubra novos artistas sem o filtro de algoritmos comerciais.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Heart className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                <span>Apoie financeiramente via Pix em 1 clique direto para o artista.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <ShoppingBag className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>Compre singles, álbuns e tenha acesso a bastidores e faixas inéditas.</span>
              </li>
            </ul>
            <div className="pt-2">
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300"
              >
                Explorar catálogo independente <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Box Artistas */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-zinc-900/80 to-zinc-950 border border-zinc-800/90 relative space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Para os Artistas</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              O controle do seu trabalho de volta em suas mãos. Sem centavos de fração por milhares de plays: aqui seu fã apoia e compra seu trabalho diretamente.
            </p>
            <ul className="space-y-3 text-sm text-zinc-300">
              <li className="flex items-start gap-2.5">
                <Flame className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span>Publique faixas, álbuns e beat packs sem burocracia de distribuidoras.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Coins className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>Venda produções e receba apoio sem intermediários predatórios.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Users className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span>Construa sua comunidade própria e crie seu clube de assinantes.</span>
              </li>
            </ul>
            <div className="pt-2">
              <Link
                href="/register?role=artist"
                className="inline-flex items-center gap-2 text-sm font-semibold text-orange-400 hover:text-orange-300"
              >
                Criar conta de artista agora <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
