'use client';

import React, { useState } from 'react';
import { defaultPaymentProvider } from '@/lib/payments/mock-payment-service';
import { formatCurrency } from '@/lib/utils';
import { Heart, X, QrCode, CheckCircle2, Copy } from 'lucide-react';

interface SupportModalProps {
  artistId: string;
  artistName: string;
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AMOUNTS = [500, 1000, 2000, 5000]; // em centavos: 5, 10, 20, 50 reais

export function SupportModal({ artistId, artistName, isOpen, onClose }: SupportModalProps) {
  const [selectedCents, setSelectedCents] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [pixResult, setPixResult] = useState<{
    pixCopiaECola?: string;
    orderId?: string;
  } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentTotal = customAmount ? Math.round(parseFloat(customAmount.replace(',', '.')) * 100) || 0 : selectedCents;

  const handleSupport = async () => {
    if (currentTotal <= 0) return;
    setIsProcessing(true);

    try {
      const result = await defaultPaymentProvider.createSupport({
        artistId,
        fanId: 'mock-user-fan',
        amountCents: currentTotal,
        message,
        paymentMethod: 'pix',
      });

      if (result.success) {
        setPixResult({
          pixCopiaECola: result.pixCopiaECola,
          orderId: result.orderId,
        });
      }
    } catch (err) {
      console.error('Erro ao gerar apoio:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyPix = () => {
    if (pixResult?.pixCopiaECola) {
      navigator.clipboard.writeText(pixResult.pixCopiaECola);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-100">Apoiar Artista</h3>
              <p className="text-xs text-zinc-400">Direto para {artistName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!pixResult ? (
          <div className="mt-5 space-y-5">
            {/* Valores pré-definidos */}
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2.5">
                Escolha o valor de apoio
              </label>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_AMOUNTS.map((cents) => {
                  const isSelected = selectedCents === cents && !customAmount;
                  return (
                    <button
                      key={cents}
                      type="button"
                      onClick={() => {
                        setSelectedCents(cents);
                        setCustomAmount('');
                      }}
                      className={`py-2.5 rounded-xl font-bold text-sm border transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-zinc-950 border-amber-500 shadow-lg shadow-amber-500/20'
                          : 'bg-zinc-800/80 text-zinc-300 border-zinc-700 hover:border-zinc-600'
                      }`}
                    >
                      {formatCurrency(cents)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Valor customizado */}
            <div>
              <label className="text-xs font-medium text-zinc-400 block mb-1.5">
                Ou digite um valor personalizado (R$)
              </label>
              <input
                type="number"
                min="1"
                step="any"
                placeholder="Ex: 35,00"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            {/* Mensagem de incentivo */}
            <div>
              <label className="text-xs font-medium text-zinc-400 block mb-1.5">
                Mensagem para o artista (opcional)
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Seu último som foi incrível! Continue criando."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:border-amber-500 text-sm resize-none"
              />
            </div>

            {/* Botão de confirmação */}
            <button
              onClick={handleSupport}
              disabled={isProcessing || currentTotal <= 0}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-zinc-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-zinc-950" />
              <span>Apoiar {formatCurrency(currentTotal)} via Pix</span>
            </button>
          </div>
        ) : (
          /* Estado com QR Code do Pix gerado */
          <div className="mt-5 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-white">Pix Gerado com Sucesso!</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Copie a chave abaixo ou escaneie o código para transferir {formatCurrency(currentTotal)}.
              </p>
            </div>

            <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 text-left">
              <span className="text-[10px] uppercase text-zinc-400 font-mono tracking-wider block mb-1">
                Pix Copia e Cola:
              </span>
              <p className="text-xs font-mono text-zinc-300 break-all line-clamp-3 select-all">
                {pixResult.pixCopiaECola}
              </p>
            </div>

            <button
              onClick={copyPix}
              className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Código Pix copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-zinc-400" />
                  <span>Copiar código Pix</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 text-xs text-zinc-400 hover:text-white"
            >
              Concluir e fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
