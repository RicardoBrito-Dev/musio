import React from 'react';
import Link from 'next/link';
import { Compass, Music2 } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
        <Music2 className="w-10 h-10" />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-xs uppercase tracking-widest font-mono text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          Erro 404
        </span>
        <h1 className="text-3xl font-black text-white tracking-tight">Página não encontrada</h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Esta página pode ter sido removida ou o endereço digitado pode estar incorreto.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20"
        >
          Voltar para o Início
        </Link>
        <Link
          href="/explore"
          className="px-6 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs border border-zinc-800 transition-colors flex items-center gap-2"
        >
          <Compass className="w-4 h-4 text-amber-500" />
          Explorar Músicas
        </Link>
      </div>
    </div>
  );
}
