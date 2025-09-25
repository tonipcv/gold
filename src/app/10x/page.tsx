'use client';

import React, { useEffect, useState } from 'react';

export default function Page() {
  const [showModal, setShowModal] = useState(true);

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
    <div className="min-h-screen w-full bg-black text-white flex items-center justify-center relative">
      {/* Modal Overlay */}
      {showModal && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 px-6">
          <div className="w-full max-w-md rounded-lg bg-zinc-900 border border-zinc-800 p-6 text-center shadow-xl">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Hoje é o último dia para acessar o Automatizador Gold</h2>
            <button
              onClick={() => setShowModal(false)}
              className="inline-flex items-center justify-center rounded-md bg-yellow-400 text-black font-semibold px-5 py-3 hover:bg-yellow-300 transition-colors w-full"
            >
              Acessar agora
            </button>
          </div>
        </div>
      )}

      {/* Video Only */}
      <main className={`w-full px-4 ${showModal ? 'blur-sm pointer-events-none select-none' : ''}`}>
        <div className="max-w-4xl mx-auto">
          <div className="w-full mx-auto">
            <VturbSmartPlayer
              id="vid-68bf4a22f63660aafd297e8e"
              style={{ display: 'block', margin: '0 auto', width: '100%' }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
