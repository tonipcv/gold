"use client";

import React, { useEffect, useState } from "react";
import { OptimizedImage } from "@/app/components/OptimizedImage";

const WAITLIST_URL =
  "https://chat.whatsapp.com/Lql8LbzWpvkEiu6D4Ty5XY?mode=ems_copy_c";

export default function Page() {
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    const timeout = window.setTimeout(() => {
      window.location.href = WAITLIST_URL;
    }, 5000);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="font-montserrat bg-black text-white min-h-screen flex flex-col">
      {/* Header with white logo centered (same style language as 10x) */}
      <div className="w-full flex justify-center pt-10">
        <OptimizedImage
          src="/ft-icone.png"
          alt="FT Logo"
          width={56}
          height={56}
          className="invert brightness-0 md:w-20 md:h-20"
        />
      </div>

      <main className="flex-1 px-6 py-10 flex flex-col items-center text-center gap-4">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Vagas Lotadas para o Automatizador Gold X
        </h1>
        <p className="text-neutral-300 text-base md:text-lg">
          Redirecionando para o Grupo de Espera
        </p>
        <p className="text-neutral-400 text-sm md:text-base mt-2">
          Você será redirecionado em {seconds}s...
        </p>

        <a
          href={WAITLIST_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-white text-black px-6 py-3 text-sm md:text-base font-medium transition hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white/40"
        >
          Ir para o Grupo de Espera agora
        </a>
      </main>

      <footer className="py-8 px-4 text-center bg-black">
        <p className="text-neutral-500 text-[12px] max-w-3xl mx-auto">
          Caso não seja redirecionado automaticamente, clique no botão acima.
        </p>
      </footer>
    </div>
  );
}
