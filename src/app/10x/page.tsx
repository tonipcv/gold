'use client';

import React from 'react';
import { OptimizedImage } from '@/app/components/OptimizedImage';

export default function Page() {
  // Link to WhatsApp group (shown as a link-style button below)
  const groupUrl = 'https://chat.whatsapp.com/EKSQ7znZoppKLFQWeTK7Y2';

  return (
    <div className="font-montserrat bg-black text-white min-h-screen">
      {/* Header with white logo centered (same style language as planos) */}
      <div className="w-full flex justify-center pt-8">
        <OptimizedImage src="/ft-icone.png" alt="FT Logo" width={56} height={56} className="invert brightness-0 md:w-20 md:h-20" />
      </div>

      {/* Vagas Encerradas Banner */}
      <div className="px-3 mt-4 md:px-4 md:mt-6">
        <div className="max-w-3xl mx-auto bg-[#0d0d0d] border border-red-500/30 rounded-xl p-5 md:p-6 text-center">
          <p className="text-red-400 font-semibold text-lg md:text-xl">Vagas encerradas</p>
          <p className="mt-2 text-sm md:text-base text-neutral-300">
            As vagas para o grupo estão encerradas no momento. Caso já faça parte, você pode acessar pelo link abaixo.
          </p>
          <a
            href={groupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-green-400 hover:text-green-300 underline underline-offset-4"
          >
            Entrar no grupo do WhatsApp
          </a>
        </div>
      </div>

      {/* Main content (video removed) */}
      <main className="px-4 py-10">
        <div className="max-w-4xl mx-auto text-center text-neutral-400 text-sm">
          Conteúdo indisponível. As vagas estão encerradas no momento.
        </div>
      </main>
      {/* Footer with requested sentence */}
      <footer className="py-8 px-4 text-center bg-black">
    
      </footer>
    </div>
  );
}
