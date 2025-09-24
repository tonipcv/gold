'use client';

import React, { useEffect, useState } from 'react';
import { OptimizedImage } from '@/app/components/OptimizedImage';

export default function Page() {
  const [timeLeft, setTimeLeft] = useState({ days: '0', hours: '00', minutes: '00', seconds: '00' });

  useEffect(() => {
    const existing = document.getElementById(
      'vturb-player-script-68d1781c1563ea2ce05c00b6'
    ) as HTMLScriptElement | null;

    if (!existing) {
      const s = document.createElement('script');
      s.id = 'vturb-player-script-68d1781c1563ea2ce05c00b6';
      s.src =
        'https://scripts.converteai.net/17e2196c-5794-49ef-bd61-857538a02fa6/players/68d1781c1563ea2ce05c00b6/v4/player.js';
      s.async = true;
      document.head.appendChild(s);
    }
  }, []);

  // Tick countdown to today at 23:59 local time
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(23, 59, 0, 0);
      let diff = target.getTime() - now.getTime();
      if (diff < 0) diff = 0; // after deadline, stop at 00:00:00

      const dayMs = 1000 * 60 * 60 * 24;
      const hourMs = 1000 * 60 * 60;
      const minuteMs = 1000 * 60;

      const days = Math.floor(diff / dayMs);
      const hours = Math.floor((diff % dayMs) / hourMs);
      const minutes = Math.floor((diff % hourMs) / minuteMs);
      const seconds = Math.floor((diff % minuteMs) / 1000);

      setTimeLeft({
        days: String(days),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Typed alias to allow using the custom web component in TSX
  const VturbSmartPlayer = 'vturb-smartplayer' as unknown as React.ElementType;

  return (
    <div className="font-montserrat bg-black text-white min-h-screen">
      {/* Header with white logo centered (same style language as planos) */}
      <div className="w-full flex justify-center pt-8">
        <OptimizedImage src="/ft-icone.png" alt="FT Logo" width={56} height={56} className="invert brightness-0 md:w-20 md:h-20" />
      </div>

      {/* Countdown Banner */}
      <div className="px-3 mt-4 md:px-4 md:mt-6">
        <div className="max-w-3xl mx-auto bg-[#0d0d0d] border border-red-500/30 rounded-xl p-3 md:p-4 text-center">
          <p className="text-xs md:text-sm text-red-300/90 tracking-wide">
            Termina hoje às 23:59
          </p>
          <div className="mt-2 md:mt-3 grid grid-cols-4 gap-2 md:gap-3 items-end justify-center font-mono">
            <div>
              <div className="text-2xl md:text-4xl font-semibold tabular-nums">{timeLeft.days}</div>
              <div className="text-[10px] md:text-[11px] uppercase tracking-wide text-neutral-400 mt-1">Dias</div>
            </div>
            <div>
              <div className="text-2xl md:text-4xl font-semibold tabular-nums">{timeLeft.hours}</div>
              <div className="text-[10px] md:text-[11px] uppercase tracking-wide text-neutral-400 mt-1">Horas</div>
            </div>
            <div>
              <div className="text-2xl md:text-4xl font-semibold tabular-nums">{timeLeft.minutes}</div>
              <div className="text-[10px] md:text-[11px] uppercase tracking-wide text-neutral-400 mt-1">Minutos</div>
            </div>
            <div>
              <div className="text-2xl md:text-4xl font-semibold tabular-nums">{timeLeft.seconds}</div>
              <div className="text-[10px] md:text-[11px] uppercase tracking-wide text-neutral-400 mt-1">Segundos</div>
            </div>
          </div>
          <p className="mt-3 md:mt-4 text-[11px] md:text-[12px] text-neutral-400">
            As vagas acabam hoje às 23h59, por definitivo.
          </p>
        </div>
      </div>

      {/* Main content with centered player */}
      <main className="px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="w-full mx-auto">
            <VturbSmartPlayer
              id="vid-68d1781c1563ea2ce05c00b6"
              style={{ display: 'block', margin: '0 auto', width: '100%' }}
            />
          </div>
        </div>
      </main>
      {/* Footer with requested sentence */}
      <footer className="py-8 px-4 text-center bg-black">
    
      </footer>
    </div>
  );
}
