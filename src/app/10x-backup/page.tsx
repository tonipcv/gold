'use client';

import React, { useEffect, useState } from 'react';
import { OptimizedImage } from '@/app/components/OptimizedImage';

export default function Page() {
  useEffect(() => {
    const existing = document.getElementById(
      'vturb-player-script-68bf4a22f63660aafd297e8e'
    ) as HTMLScriptElement | null;

    if (!existing) {
      const s = document.createElement('script');
      s.id = 'vturb-player-script-68bf4a22f63660aafd297e8e';
      s.src =
        'https://scripts.converteai.net/17e2196c-5794-49ef-bd61-857538a02fa6/players/68bf4a22f63660aafd297e8e/v4/player.js';
      s.async = true;
      document.head.appendChild(s);
    }
  }, []);

  // Typed alias to allow using the custom web component in TSX
  const VturbSmartPlayer = 'vturb-smartplayer' as unknown as React.ElementType;

  // Countdown to today at 23:59
  const [timeLeft, setTimeLeft] = useState<string>('--:--:--');

  useEffect(() => {
    const getEndOfToday = () => {
      const d = new Date();
      d.setHours(23, 59, 0, 0); // 23:59:00 local time
      return d;
    };

    const update = () => {
      const now = new Date().getTime();
      const end = getEndOfToday().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('00:00:00');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const fmt = (v: number) => String(v).padStart(2, '0');
      setTimeLeft(`${fmt(hours)}:${fmt(minutes)}:${fmt(seconds)}`);
    };

    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="font-montserrat bg-black text-white min-h-screen">
      {/* Top minimal countdown (replaces previous red banner) */}
      <div className="w-full text-center py-2 px-4 border-b border-neutral-800">
        <span className="uppercase text-[11px] tracking-wider text-neutral-300">Encerra hoje às 23:59</span>
        <span className="ml-2 font-mono tabular-nums text-sm md:text-base">{timeLeft}</span>
      </div>
      {/* Header with white logo centered (same style language as planos) */}
      <div className="w-full flex justify-center pt-8">
        <OptimizedImage src="/ft-icone.png" alt="FT Logo" width={56} height={56} className="invert brightness-0 md:w-20 md:h-20" />
      </div>

      {/* Page Title */}
      <div className="px-4 mt-6">
        <h1 className="text-center text-xl md:text-xl font-light bg-gradient-to-r from-neutral-300 to-white bg-clip-text text-transparent tracking-tight">
          Estamos liberando os últimos acessos ao GOLD X, assista o vídeo:
        </h1>
      </div>

      {/* Main content with centered player */}
      <main className="px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="w-full mx-auto">
            <VturbSmartPlayer
              id="vid-68bf4a22f63660aafd297e8e"
              style={{ display: 'block', margin: '0 auto', width: '100%' }}
            />
          </div>
        </div>
      </main>
      {/* Footer with requested sentence */}
      <footer className="py-8 px-4 text-center bg-black">
        <p className="text-neutral-400 text-[12px] max-w-3xl mx-auto">
        Alta demanda, vagas podem se esgotar, assista o vídeo até o final e libere seu acesso hoje.
        </p>
      </footer>
    </div>
  );
}
