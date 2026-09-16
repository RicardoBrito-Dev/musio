'use client';

import React, { useState } from 'react';
import { DollarSign, ArrowDownRight, ArrowUpRight, Landmark } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function ArtistEarningsPage() {
  const pixKey = 'rick@musio.live';
  const [payoutRequested, setPayoutRequested] = useState(false);

  const transactions = [
    {
      id: 'tx-1',
      desc: 'Apoio direto de fã via Pix',
      type: 'support',
      amount: 5000,
      date: 'Hoje, 14:32',
      status: 'completed',
    },
    {
      id: 'tx-2',
      desc: 'Venda de Beat Pack Vol. 1',
      type: 'sale',
      amount: 2900,
      date: 'Ontem, 20:15',
      status: 'completed',
    },
    {
      id: 'tx-3',
      desc: 'Assinatura Clube do Artista (Mensal)',
      type: 'membership',
      amount: 1490,
      date: '14 de Março',
      status: 'completed',
    },
    {
      id: 'tx-4',
      desc: 'Saque para conta bancária via Pix',
      type: 'payout',
      amount: -80000,
      date: '02 de Março',
      status: 'completed',
    },
  ];

  const handleRequestPayout = () => {
    setPayoutRequested(true);
    setTimeout(() => {
      setPayoutRequested(false);
      alert('Solicitação de saque de R$ 1.240,00 registrada com sucesso! Processamento via Pix em até 24h.');
    }, 800);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Financeiro & Saques</h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Acompanhe suas receitas de apoios, vendas e solicite saques diretamente para sua chave Pix.
        </p>
      </div>

      {/* Cards de Saldos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <span className="text-xs text-zinc-400 font-medium">Receita Total Acumulada</span>
          <p className="text-3xl font-black text-white font-mono">R$ 2.843,20</p>
          <span className="text-[11px] text-zinc-500">Histórico de todas as vendas</span>
        </div>

        <div className="p-6 rounded-3xl bg-zinc-900/60 border border-emerald-500/20 space-y-2 relative overflow-hidden">
          <span className="text-xs text-emerald-400 font-medium">Saldo Disponível para Saque</span>
          <p className="text-3xl font-black text-emerald-400 font-mono">R$ 1.240,00</p>
          <span className="text-[11px] text-zinc-500">Liberado para transferência Pix</span>
        </div>

        <div className="p-6 rounded-3xl bg-zinc-900/60 border border-amber-500/20 space-y-2">
          <span className="text-xs text-amber-400 font-medium">Saldo a Receber</span>
          <p className="text-3xl font-black text-amber-400 font-mono">R$ 384,20</p>
          <span className="text-[11px] text-zinc-500">Vendas em período de compensação</span>
        </div>
      </div>

      {/* Caixa de Solicitação de Saque Pix */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-base text-white">Transferência Pix Automática</h3>
          </div>
          <p className="text-xs text-zinc-400">
            Chave Pix configurada: <span className="text-zinc-200 font-mono font-medium">{pixKey}</span>
          </p>
        </div>

        <button
          onClick={handleRequestPayout}
          disabled={payoutRequested}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
        >
          <DollarSign className="w-4 h-4 stroke-[3]" />
          <span>{payoutRequested ? 'Processando...' : 'Sacar R$ 1.240,00 Agora'}</span>
        </button>
      </div>

      {/* Histórico / Extrato de Transações */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Extrato de Movimentações Recentes</h3>
        <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 divide-y divide-zinc-800/60 overflow-hidden">
          {transactions.map((t) => {
            const isPositive = t.amount > 0;
            return (
              <div key={t.id} className="p-4 flex items-center justify-between text-xs hover:bg-zinc-800/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}
                  >
                    {isPositive ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-200">{t.desc}</p>
                    <span className="text-[11px] text-zinc-500">{t.date}</span>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`font-mono font-bold ${
                      isPositive ? 'text-emerald-400' : 'text-zinc-300'
                    }`}
                  >
                    {isPositive ? '+' : ''}
                    {formatCurrency(Math.abs(t.amount))}
                  </p>
                  <span className="text-[10px] text-zinc-500 uppercase font-mono">Concluído</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
