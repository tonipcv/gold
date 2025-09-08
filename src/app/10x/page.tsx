'use client';

import React, { useEffect } from 'react';
import XLogo from '@/components/XLogo';

export default function Page() {
  useEffect(() => {
    const existing = document.getElementById(
      'vturb-player-script-68be2a739eb8eabea3030266'
    ) as HTMLScriptElement | null;

    if (!existing) {
      const s = document.createElement('script');
      s.id = 'vturb-player-script-68be2a739eb8eabea3030266';
      s.src =
        'https://scripts.converteai.net/32ff2495-c71e-49ba-811b-00b5b49c517f/players/68be2a739eb8eabea3030266/v4/player.js';
      s.async = true;
      document.head.appendChild(s);
    }
  }, []);

  // Typed alias to allow using the custom web component in TSX
  const VturbSmartPlayer = 'vturb-smartplayer' as unknown as React.ElementType;

  return (
    <div className="font-montserrat bg-black text-white min-h-screen">
      {/* Header with white logo centered (same style language as planos) */}
      <div className="w-full flex justify-center pt-8">
        <XLogo />
      </div>

      {/* Main content with centered player */}
      <main className="px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="w-full mx-auto">
            <VturbSmartPlayer
              id="vid-68be2a739eb8eabea3030266"
              style={{ display: 'block', margin: '0 auto', width: '100%' }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
