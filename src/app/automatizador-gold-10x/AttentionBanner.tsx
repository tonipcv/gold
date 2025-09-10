"use client";

import { useEffect, useMemo, useState } from "react";

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

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = targetDate.getTime() - now.getTime();
  const { days, hours, minutes, seconds } = formatTime(remaining);

  return (
    <div className="mx-4 md:mx-auto md:w-3/4 lg:w-3/4">
      <div className="relative overflow-hidden rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-100 shadow-[0_0_0_1px_rgba(234,179,8,0.2)]">
        <div className="p-4 md:p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="text-sm md:text-base leading-relaxed">
              <span className="font-semibold">Atenção:</span> caso esteja entrando hoje ao instalar o Automatizador utilize banca reduzida e assista a <span className="underline">aula 5</span>.
              Essa contagem regressiva é para a versão ficar 100% otimizada para escala, até <span className="whitespace-nowrap">17/09 às 12h</span>:
            </div>
            <div className="flex items-center gap-2 font-mono">
              <div className="text-center">
                <div className="text-lg md:text-2xl font-bold">{days}</div>
                <div className="text-[10px] uppercase tracking-wider opacity-70">dias</div>
              </div>
              <div className="text-lg md:text-2xl font-bold">:</div>
              <div className="text-center">
                <div className="text-lg md:text-2xl font-bold">{hours}</div>
                <div className="text-[10px] uppercase tracking-wider opacity-70">horas</div>
              </div>
              <div className="text-lg md:text-2xl font-bold">:</div>
              <div className="text-center">
                <div className="text-lg md:text-2xl font-bold">{minutes}</div>
                <div className="text-[10px] uppercase tracking-wider opacity-70">min</div>
              </div>
              <div className="text-lg md:text-2xl font-bold">:</div>
              <div className="text-center">
                <div className="text-lg md:text-2xl font-bold">{seconds}</div>
                <div className="text-[10px] uppercase tracking-wider opacity-70">seg</div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-yellow-400/10 blur-2xl" />
        </div>
      </div>
    </div>
  );
}
