"use client";

import React, { useEffect, useState } from "react";
import { OptimizedImage } from "@/app/components/OptimizedImage";

const WAITLIST_URL =
  "https://chat.whatsapp.com/Lql8LbzWpvkEiu6D4Ty5XY?mode=ems_copy_c";

export default function Page() {
  const [seconds, setSeconds] = useState(5);
  const [timeLeft, setTimeLeft] = useState("");

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

  useEffect(() => {
    const target = new Date();
    target.setHours(19, 0, 0, 0);

    const tick = () => {
      const now = new Date();
      let diff = Math.max(0, target.getTime() - now.getTime());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      diff -= days * 24 * 60 * 60 * 1000;
      const hrs = Math.floor(diff / (1000 * 60 * 60));
      diff -= hrs * 60 * 60 * 1000;
      const mins = Math.floor(diff / (1000 * 60));
      diff -= mins * 60 * 1000;
      const secs = Math.floor(diff / 1000);
      const pad = (n: number) => String(n).padStart(2, "0");
      const padDays = (n: number) => String(n).padStart(2, "0");
      setTimeLeft(`${padDays(days)}:${pad(hrs)}:${pad(mins)}:${pad(secs)}`);
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="font-montserrat bg-black text-white min-h-screen flex flex-col">
      {/* Top minimal countdown */}
      <div className="w-full text-center py-2 px-4 border-b border-neutral-800">
        <span className="font-mono tabular-nums text-base md:text-lg text-neutral-100">{timeLeft}</span>
      </div>
      {/* Header with white logo centered */}
      <div className="w-full flex justify-center pt-10">
        <OptimizedImage
          src="/ft-icone.png"
          alt="FT Logo"
          width={56}
          height={56}
          className="invert brightness-0 md:w-20 md:h-20"
        />
      </div>

      <main className="flex-1 px-6 py-8 flex flex-col items-center text-center gap-3">
        <h1 className="text-center text-2xl md:text-3xl font-light bg-gradient-to-r from-neutral-300 to-white bg-clip-text text-transparent tracking-tight">
          FAREMOS AS 30 INSTALAÇÕES RESTANTES HOJE AS 19H
        </h1>
        
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
