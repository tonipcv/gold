'use client';

import { useEffect, useState } from 'react';
import * as fbq from '@/lib/fpixel';
import { OptimizedImage } from '@/app/components/OptimizedImage';

export default function Page() {
  const [countdown, setCountdown] = useState(300); // 5 minutos em segundos

  // Página não possui carrossel nem elementos dependentes do tamanho da janela

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubscribeClick = (plan: string) => {
    fbq.event('InitiateCheckout', {
      content_name: `hotmart_${plan}`,
      currency: 'BRL',
    });
  };

  // Progress bar (same style as original page)
  const ProgressBar = ({ percentage, color = 'green' }: { percentage: number, color?: 'green' | 'red' | 'white' }) => (
    <div className="mt-4 mb-2">
      <div className="flex justify-between text-xs text-neutral-400 mb-1">
        <span>{percentage}% preenchido</span>
        <span>Vagas restantes</span>
      </div>
      <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${color === 'red' ? 'bg-red-500' : color === 'white' ? 'bg-white' : 'bg-green-500'} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="font-montserrat bg-black text-white min-h-screen relative overflow-hidden">
      <div className="relative z-10">
        {/* Logo (smaller on mobile) */}
        <div className="w-full flex justify-center pt-8">
          <OptimizedImage src="/ft-icone.png" alt="FT Logo" width={56} height={56} className="invert brightness-0 md:w-20 md:h-20" />
        </div>

        {/* Countdown */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center gap-2 bg-neutral-900/50 px-4 py-2 rounded-full border border-neutral-800">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-xl font-medium text-white">{formatTime(countdown)}</span>
            </div>
          </div>
          <div className="text-center">
            
          </div>
        </div>

        {/* Planos Hotmart */}
        <section id="planos" className="py-16 px-4 bg-black">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Plano Mensal */}
              <div className="order-1 border border-neutral-800/50 rounded-2xl p-8 bg-black/30 backdrop-blur-sm hover:border-neutral-700 transition-all duration-300">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-white">PLANO MENSAL</h3>
                  <ProgressBar percentage={60} />
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">Acesso à Automação Gold X (10x) por 30 dias</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">Estratégias Exclusivas Versão 10x</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">Encontro de Mentoria Exlusivo e Fechado com Daniel Katsu</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">1 mês de acompanhamento individual</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">Suporte especializado</span></li>
                </ul>
                <div className="text-center pt-6 border-t border-neutral-800/30">
                  <div className="mt-6">
                    <a
                      href="https://pay.hotmart.com/A101799970P?off=j6cu9mmi"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleSubscribeClick('mensal')}
                      className="w-full inline-flex justify-center px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl text-white font-medium transition-all duration-200"
                    >
                      ASSINAR MENSAL
                    </a>
                  </div>
                </div>
              </div>

              {/* Plano Trimestral */}
              <div className="order-2 border border-neutral-800/50 rounded-2xl p-8 bg-black/30 backdrop-blur-sm hover:border-neutral-700 transition-all duration-300">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-white">PLANO TRIMESTRAL</h3>
                  <ProgressBar percentage={73} color="red" />
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">Acesso à Automação Gold X (10x) por 3 meses</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">Estratégias Exclusivas Versão 10x</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">Encontro de Mentoria Exlusivo e Fechado com Daniel Katsu</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">1 mês de acompanhamento individual</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">Suporte especializado</span></li>
                </ul>
                <div className="text-center pt-6 border-t border-neutral-800/30">
                  <div className="mt-6">
                    <a
                      href="https://pay.hotmart.com/A101799970P?off=infj6t6z"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleSubscribeClick('trimestral')}
                      className="w-full inline-flex justify-center px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl text-white font-medium transition-all duration-200"
                    >
                      ASSINAR TRIMESTRAL
                    </a>
                  </div>
                </div>
              </div>

              {/* Plano Semestral */}
              <div className="order-3 relative border border-neutral-800/50 rounded-2xl p-8 bg-black/30 backdrop-blur-sm hover:border-neutral-700 transition-all duration-300">
                <span className="absolute -top-3 right-4 text-[10px] px-2 py-1 rounded-full bg-green-600 text-white border border-green-500/70 shadow">Recomendado</span>
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-white">PLANO SEMESTRAL</h3>
                  <ProgressBar percentage={85} color="red" />
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">Acesso à Automação Gold X (10x) por 6 meses</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">Estratégias Exclusivas Versão 10x</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">Encontro de Mentoria Exlusivo e Fechado com Daniel Katsu</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">2 meses de acompanhamento individual</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">Suporte dedicado</span></li>
                </ul>
                <div className="text-center pt-6 border-t border-neutral-800/30">
                  <div className="mt-6">
                    <a
                      href="https://pay.hotmart.com/A101799970P?off=tl58i9p0"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleSubscribeClick('semestral')}
                      className="w-full inline-flex justify-center px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl text-white font-medium transition-all duration-200"
                    >
                      ASSINAR SEMESTRAL
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Floating WhatsApp Link */}
        <a
          href="https://wa.me/5511958072826"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-600 hover:bg-green-500 text-white text-sm font-medium shadow-lg border border-green-500/60"
        >
          WhatsApp
        </a>

        {/* Depoimentos e FAQ removidos nesta versão Hotmart */}

        <footer className="py-8 px-4 text-center bg-black">
          <p className="text-neutral-400 text-[12px] max-w-3xl mx-auto">
            Liberar acesso à instalação do V2
          </p>
        </footer>
      </div>
    </div>
  );
}
