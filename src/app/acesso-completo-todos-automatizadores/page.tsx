'use client';

import React, { useEffect, useState } from 'react';
import { OptimizedImage } from '@/app/components/OptimizedImage';

export default function Page() {
  const [timeLeft, setTimeLeft] = useState({ days: '0', hours: '00', minutes: '00', seconds: '00' });

  // Inject VTurb script for the provided player ID
  useEffect(() => {
    const scriptId = 'vturb-player-script-692dbe7c8c029b83a0a2d9d5';
    const existing = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!existing) {
      const s = document.createElement('script');
      s.id = scriptId;
      s.src = 'https://scripts.converteai.net/70b43777-e359-4c77-af2c-366de25a153d/players/692dbe7c8c029b83a0a2d9d5/v4/player.js';
      s.async = true;
      document.head.appendChild(s);
    }
  }, []);

  // Tick countdown to today at 23:59 local time (same behavior as reference)
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(23, 59, 0, 0);
      let diff = target.getTime() - now.getTime();
      if (diff < 0) diff = 0;

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

      {/* Countdown Banner */}
      <div className="px-3 mt-4 md:px-4 md:mt-6">
        <div className="max-w-3xl mx-auto bg-[#0d0d0d] border border-red-500/30 rounded-xl p-4 md:p-6 text-center">
          <p className="text-xl md:text-2xl text-neutral-200 font-semibold">
            Todos os automatizadores foram liberados para acesso imediato.
          </p>
          <p className="mt-2 md:mt-3 text-sm md:text-base text-neutral-400">
            Assista o vídeo e finalize sua instalação hoje pois temos limite de acesso.
          </p>
        </div>
      </div>

      {/* Main content with centered player */}
      <main className="px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="w-full mx-auto">
            <VturbSmartPlayer
              id="vid-692dbe7c8c029b83a0a2d9d5"
              style={{ display: 'block', margin: '0 auto', width: '100%' }}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 text-center bg-black"></footer>
    </div>
  );
}
