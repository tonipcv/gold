'use client';

import React, { useEffect, useState } from 'react';
import { OptimizedImage } from '@/app/components/OptimizedImage';

// Allow using the custom web component in TSX without type errors
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'vturb-smartplayer': any;
    }
  }
}

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
  // VTurb video removido enquanto vagas estão lotadas

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
  // Video removido: sem player enquanto vagas estão lotadas

  // Load VTurb Smartplayer script once on the client
  useEffect(() => {
    const scriptSrc = 'https://scripts.converteai.net/17e2196c-5794-49ef-bd61-857538a02fa6/players/69810fd0dc9de813f8970b89/v4/player.js';
    const existing = document.querySelector(`script[src="${scriptSrc}"]`);
    if (existing) return;

    const s = document.createElement('script');
    s.src = scriptSrc;
    s.async = true;
    document.head.appendChild(s);

    // No cleanup required; keeping the script avoids re-download on navigation
  }, []);

  return (
    <div className="font-montserrat bg-black text-white min-h-screen">

      {/* Countdown Banner */}
      <div className="px-3 mt-4 md:px-4 md:mt-6">
        <div className="w-full flex justify-center mb-2">
          <OptimizedImage src="/ft-icone.png" alt="FT Logo" width={28} height={28} className="invert brightness-0" />
        </div>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-base md:text-lg text-neutral-100 font-semibold inline-flex items-center gap-2 justify-center">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600/20 text-emerald-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-2.81a.75.75 0 10-1.22-.9l-3.6 4.88-1.63-1.63a.75.75 0 10-1.06 1.06l2.25 2.25c.32.32.84.28 1.1-.09l4.16-5.57z" clipRule="evenodd" />
              </svg>
            </span>
            Acesso ao Automatizador liberado!
          </p>
          <p className="mt-1 md:mt-2 text-xs md:text-sm text-neutral-400">
            (Assista o vídeo e instale em menos de 2 minutos.)
          </p>
        </div>
      </div>

      {/* Main content (vídeo removido) */}
      <main className="px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="w-full">
            <vturb-smartplayer id="vid-69810fd0dc9de813f8970b89" style={{ display: 'block', margin: '0 auto', width: '100%' }} />
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
                className="group relative aspect-[2/3] rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 opacity-70 cursor-not-allowed"
              >
                <OptimizedImage
                  src={module.image}
                  alt={module.title}
                  fill
                  className="object-cover grayscale brightness-75 blur-[1px]"
                />
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute top-2 right-2 text-[10px] font-medium text-neutral-500 opacity-70">BLOQUEADO</div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-neutral-400 text-xs bg-black/50 rounded px-2 py-1 inline-block opacity-0 pointer-events-none">{module.description.replace('Estratégia', 'Automatizador')}</p>
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
