'use client';

import React from 'react';
import { Users, Play, DollarSign, TrendingUp, ArrowUpRight } from 'lucide-react';

export default function ArtistAnalyticsPage() {
  const metrics = [
    { label: 'Total de Plays', value: '12.450', change: '+18%', period: 'vs. mês anterior', icon: Play },
    { label: 'Ouvintes Únicos', value: '4.890', change: '+12%', period: 'vs. mês anterior', icon: Users },
    { label: 'Novos Seguidores', value: '94', change: '+24%', period: 'vs. mês anterior', icon: TrendingUp },
    { label: 'Taxa de Conversão em Apoio', value: '3,8%', change: '+0.5%', period: 'média da plataforma', icon: DollarSign },
  ];

  const topLocations = [
    { city: 'São Paulo, SP', percent: '34%' },
    { city: 'Rio de Janeiro, RJ', percent: '22%' },
    { city: 'Belo Horizonte, MG', percent: '14%' },
    { city: 'Curitiba, PR', percent: '11%' },
    { city: 'Outras regiões', percent: '19%' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Analytics & Audiência</h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Estatísticas detalhadas de reprodução, perfil dos fãs e engajamento.
        </p>
      </div>

      {/* Grid de Métricas Chave */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-semibold">{m.label}</span>
                <Icon className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-black text-white">{m.value}</p>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="text-emerald-400 font-medium flex items-center">
                  <ArrowUpRight className="w-3 h-3" /> {m.change}
                </span>
                <span className="text-zinc-500">{m.period}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Localização e Fontes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <h3 className="font-bold text-base text-white">Top Cidades dos Ouvintes</h3>
          <div className="space-y-3">
            {topLocations.map((loc) => (
              <div key={loc.city} className="space-y-1">
                <div className="flex justify-between text-xs text-zinc-300">
                  <span>{loc.city}</span>
                  <span className="font-mono text-amber-400">{loc.percent}</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                    style={{ width: loc.percent }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <h3 className="font-bold text-base text-white">Engajamento por Dispositivo</h3>
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-3.5 bg-zinc-950 rounded-2xl border border-zinc-800">
              <span className="text-xs text-zinc-300">Dispositivos Móveis (Web Mobile)</span>
              <span className="text-xs font-mono font-bold text-white">72%</span>
            </div>
            <div className="flex items-center justify-between p-3.5 bg-zinc-950 rounded-2xl border border-zinc-800">
              <span className="text-xs text-zinc-300">Computadores & Laptops</span>
              <span className="text-xs font-mono font-bold text-white">28%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
