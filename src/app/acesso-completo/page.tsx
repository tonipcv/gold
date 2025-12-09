'use client';

import React, { useEffect, useState } from 'react';
import { OptimizedImage } from '@/app/components/OptimizedImage';

export default function Page() {
  const [timeLeft, setTimeLeft] = useState({ days: '0', hours: '00', minutes: '00', seconds: '00' });

  // Display-only modules list (all locked)
  const modules = [
    { id: 1, title: 'Módulo 1 - Instalação', description: 'Instalação e primeiros passos', image: '/modulos/1.png' },
    { id: 2, title: 'Módulo 2 - Gold X', description: 'Estratégia Gold X', image: '/modulos/2.png' },
    { id: 3, title: 'Módulo 3 - Power V2', description: 'Estratégia Power V2', image: '/modulos/3.png' },
    { id: 4, title: 'Módulo 4 - Falcon Bit', description: 'Estratégia Falcon Bit', image: '/modulos/4.png' },
    { id: 5, title: 'Módulo 5 - Celular', description: 'Operando pelo celular', image: '/modulos/5.png' },
  ];

  // Inject VTurb script for the provided player ID
  useEffect(() => {
    const scriptId = 'vturb-player-script-693756a7992bdc63457f5142';
    const existing = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!existing) {
      const s = document.createElement('script');
      s.id = scriptId;
      s.src = 'https://scripts.converteai.net/70b43777-e359-4c77-af2c-366de25a153d/players/693756a7992bdc63457f5142/v4/player.js';
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
        <div className="w-full flex justify-center mb-2">
          <OptimizedImage src="/ft-icone.png" alt="FT Logo" width={28} height={28} className="invert brightness-0" />
        </div>
        <div className="max-w-3xl mx-auto bg-[#0d0d0d] border border-red-500/30 rounded-xl p-4 md:p-6 text-center">
          <p className="text-base md:text-lg text-neutral-200 font-semibold">
            Todos os automatizadores foram liberados para acesso imediato.
          </p>
          <p className="mt-1 md:mt-2 text-xs md:text-sm text-neutral-400">
            Assista o vídeo e finalize sua instalação hoje pois temos limite de acesso.
          </p>
        </div>
      </div>

      {/* Main content with centered player */}
      <main className="px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="w-full mx-auto">
            <VturbSmartPlayer
              id="vid-693756a7992bdc63457f5142"
              style={{ display: 'block', margin: '0 auto', width: '100%' }}
            />
          </div>
        </div>
      </main>

      {/* Locked Modules Grid (like cursos, all blocked) */}
      <section className="px-4 pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {modules.map((module) => (
              <div
                key={module.id}
                aria-disabled
                className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-900 border border-gray-800 opacity-70 cursor-not-allowed"
              >
                <OptimizedImage
                  src={module.image}
                  alt={module.title}
                  fill
                  className="object-cover grayscale"
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-black/80 text-gray-300 text-[10px] font-bold rounded backdrop-blur-sm border border-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                      <path d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm-3 8V6a3 3 0 116 0v3H9z" />
                    </svg>
                    BLOQUEADO
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-gray-300 text-xs">{module.description.replace('Estratégia', 'Automatizador')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="py-8 px-4 text-center bg-black">
        <p className="max-w-5xl mx-auto text-[11px] leading-relaxed text-neutral-500">
          Disclaimer: não oferecemos sinais, recomendações ou promessas de resultado. Todo conteúdo é educacional. Operações envolvem riscos e cada usuário é responsável por suas próprias decisões.
        </p>
      </footer>
    </div>
  );
}
