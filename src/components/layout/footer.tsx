import React from 'react';
import Link from 'next/link';
import { Music, ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 text-zinc-400 text-sm pb-28 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                <Music className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">musio</span>
            </div>
            <p className="text-zinc-400 max-w-sm text-sm leading-relaxed">
              Música independente. Direto de quem faz. Aproxime-se dos seus artistas favoritos,
              compre produções autênticas e apoie a música sem intermediários abusivos.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Direitos 100% declarados e geridos pelos criadores.</span>
            </div>
          </div>

          {/* Fãs */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-4">
              Para Fãs
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/explore" className="hover:text-white transition-colors">
                  Descobrir Músicas
                </Link>
              </li>
              <li>
                <Link href="/artists" className="hover:text-white transition-colors">
                  Explorar Artistas
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Apoiar Criadores
                </Link>
              </li>
            </ul>
          </div>

          {/* Artistas */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-4">
              Para Artistas
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/register?role=artist" className="hover:text-white transition-colors">
                  Criar Perfil de Artista
                </Link>
              </li>
              <li>
                <Link href="/dashboard/artist" className="hover:text-white transition-colors">
                  Painel de Controle
                </Link>
              </li>
              <li>
                <Link href="/dashboard/artist/earnings" className="hover:text-white transition-colors">
                  Monetização & Carteira
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} Musio. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Construído para a música independente com <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
}
