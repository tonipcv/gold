'use client';

import React, { useEffect } from 'react';
import { OptimizedImage } from '@/app/components/OptimizedImage';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const ex = searchParams?.get('ex') ?? '';
  const formatName = (s: string) =>
    decodeURIComponent(s.replace(/\+/g, ' '))
      .split(/[\s_-]+/)
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  const exName = ex ? formatName(ex) : '';
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

  return (
    <div className="font-montserrat bg-black text-white min-h-screen">
      {/* Alert banner */}
      <div className="w-full bg-yellow-400 text-black text-sm md:text-base py-3 px-4 text-center font-medium">
        Liberamos 7 instalações para o mês de outubro, assista o vídeo e lucre automaticamente
      </div>
      {/* Header with white logo centered (same style language as planos) */}
      <div className="w-full flex justify-center pt-8">
        <OptimizedImage src="/ft-icone.png" alt="FT Logo" width={56} height={56} className="invert brightness-0 md:w-20 md:h-20" />
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
          {exName && (
            <p className="mt-4 text-center text-sm text-neutral-300">
              Link exclusivo para <span className="font-semibold text-white">{exName}</span>
            </p>
          )}
        </div>
      </main>
      {/* Footer with requested sentence */}
      <footer className="py-8 px-4 text-center bg-black">
        <p className="text-neutral-400 text-[12px] max-w-3xl mx-auto">
        Liberamos hoje, por ser uma excessão pode acabar em minutos.
        </p>
      </footer>
    </div>
  );
}

