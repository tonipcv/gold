"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

function getTargetDate() {
  const now = new Date();
  const year = now.getFullYear();
  // Mes é 0-indexado (0=Jan, 8=Setembro)
  const target = new Date(year, 8, 17, 12, 0, 0, 0);
  return target;
}

function formatTime(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return { days, hours: pad(hours), minutes: pad(minutes), seconds: pad(seconds) };
}

export default function AttentionBanner() {
  const targetDate = useMemo(() => getTargetDate(), []);
  const [now, setNow] = useState(new Date());
  const { data: session } = useSession();
  const isPremium = session?.user?.isPremium || false;

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = targetDate.getTime() - now.getTime();
  const { days, hours, minutes, seconds } = formatTime(remaining);

  // Renderiza o banner padrão para usuários premium ou o banner de aviso para não premium
  if (isPremium) {
    return (
      <div className="mx-4 md:mx-auto md:w-3/4 lg:w-3/4">
        <a
          href="?aula=14"
          className="relative block overflow-hidden rounded-xl border border-emerald-500/40 bg-emerald-600/10 text-emerald-100 shadow-[0_0_0_1px_rgba(16,185,129,0.25)] hover:bg-emerald-600/20 transition-colors"
          role="alert"
          aria-label="Liberação oficial do Automatizador. Clique para assistir."
        >
          <div className="p-4 md:p-5">
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mt-0.5 text-emerald-300">
                <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm1 15h-2v-2h2Zm0-4h-2V7h2Z" />
              </svg>
              <div className="flex-1">
                <div className="text-sm md:text-base">
                  <span className="font-semibold">Atenção:</span> Liberação oficial do Automatizador —
                  <span className="underline underline-offset-2 ml-1">clique aqui para assistir agora</span>.
                </div>
                <div className="mt-1 text-xs text-emerald-200/80">
                  Se não abrir direto, selecione a "AULA 14 - Liberação Oficial" na lista.
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-emerald-400/10 blur-2xl" />
          </div>
        </a>
      </div>
    );
  } else {
    // Banner de aviso para usuários não premium (clicável para Aula 6)
    return (
      <div className="mx-4 md:mx-auto md:w-3/4 lg:w-3/4">
        <a
          href="?aula=6"
          className="relative block overflow-hidden rounded-xl border border-amber-500/40 bg-amber-600/10 text-amber-100 shadow-[0_0_0_1px_rgba(217,119,6,0.25)] hover:bg-amber-600/20 transition-colors"
          role="alert"
          aria-label="Aviso importante para não premium. Clique para ir à Aula 6."
        >
          <div className="p-4 md:p-5">
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mt-0.5 text-amber-300">
                <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm1 15h-2v-2h2Zm0-4h-2V7h2Z" />
              </svg>
              <div className="flex-1">
                <div className="text-sm md:text-base font-semibold mb-1">
                  Aviso Importante
                </div>
                <div className="text-sm text-amber-100/90">
                  A versão atualmente liberada não está preparada para operações em grande escala de capital. Nesse início, o ideal é instalar a automação, se familiarizar com o funcionamento e aguardar o encontro de mentoria com o Katsu antes de realizar aportes maiores.
                  <br /><br />
                  Também é fundamental assistir à Aula 6 completa, pois nela você aprenderá como configurar corretamente todo o processo.
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-amber-400/10 blur-2xl" />
          </div>
        </a>
      </div>
    );
  }
}
