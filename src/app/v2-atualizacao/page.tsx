"use client";

import React, { useEffect } from "react";
import { OptimizedImage } from "@/app/components/OptimizedImage";

export default function Page() {
  const SmartPlayer = "vturb-smartplayer" as any;

  useEffect(() => {
    const existing = document.querySelector(
      'script[src="https://scripts.converteai.net/17e2196c-5794-49ef-bd61-857538a02fa6/players/690898ee44fd1362986a4795/v4/player.js"]'
    );
    if (!existing) {
      const s = document.createElement("script");
      s.src =
        "https://scripts.converteai.net/17e2196c-5794-49ef-bd61-857538a02fa6/players/690898ee44fd1362986a4795/v4/player.js";
      s.async = true;
      document.head.appendChild(s);
    }
  }, []);

  return (
    <div className="font-montserrat bg-black text-white min-h-screen flex flex-col">
      {/* Header with white logo centered */}
      <div className="w-full flex justify-center pt-2 md:pt-6 mb-1 md:mb-3">
        <OptimizedImage
          src="/ft-icone.png"
          alt="FT Logo"
          width={56}
          height={56}
          className="invert brightness-0 md:w-20 md:h-20"
        />
      </div>

      <main className="flex-1 px-6 pt-0 md:pt-2 flex flex-col items-stretch justify-center text-left gap-3 pb-16 md:pb-0">
        <h1 className="mx-auto max-w-3xl text-left text-xl md:text-xxl font-light bg-gradient-to-r from-neutral-300 to-white bg-clip-text text-transparent tracking-tight">
          Assista o vídeo e atualize seu Robô V2 para a Versão Oficial Hoje!
        </h1>

        <div className="w-full max-w-3xl mx-auto mt-3 md:mt-6">
          <SmartPlayer
            id="vid-690898ee44fd1362986a4795"
            style={{ display: "block", margin: "0 auto", width: "100%" }}
          />
        </div>
      </main>
      <div className="fixed bottom-0 inset-x-0 z-50 px-3 py-2 text-[10px] md:text-xs text-neutral-300 bg-red-500/25 backdrop-blur border-t border-neutral-800 text-center">
        Atualização para Aumentar a Performance e o prazo de acesso, pela alta demanda não conseguiremos atender todos.
      </div>
    </div>
  );
}

