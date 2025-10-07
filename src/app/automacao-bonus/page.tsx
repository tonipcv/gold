'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import XLogo from '@/components/XLogo'

function AutomacaoBonusInner() {
  const searchParams = useSearchParams()
  const couponParam = (searchParams?.get('coupon') || searchParams?.get('discount') || searchParams?.get('cupom') || '').trim()

  // Countdown (igual ao de liberacao-planos)
  const [countdown, setCountdown] = useState(300)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Progress bar (mesmo estilo)
  const ProgressBar = ({ percentage, color = 'green' }: { percentage: number; color?: 'green' | 'red' | 'white' }) => (
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
  )

  const trimestralUrl = useMemo(() => {
    const base = 'https://checkout.k17.com.br/subscribe/trimestral-gold10x'
    return couponParam ? `${base}?coupon=${encodeURIComponent(couponParam)}` : base
  }, [couponParam])

  const semestralUrl = useMemo(() => {
    const base = 'https://checkout.k17.com.br/subscribe/semestral-gold10x'
    return couponParam ? `${base}?coupon=${encodeURIComponent(couponParam)}` : base
  }, [couponParam])

  return (
    <div className="font-montserrat bg-black text-white min-h-screen relative overflow-hidden">
      {/* Header */}
      <header className="w-full py-8 flex justify-center">
        <XLogo />
      </header>

      <main className="px-4 pb-16">
        <section className="max-w-5xl mx-auto">
          {/* Countdown e aviso (mesma pegada) */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center gap-2 bg-neutral-900/50 px-4 py-2 rounded-full border border-neutral-800">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-xl font-medium text-white">{formatTime(countdown)}</span>
            </div>
          </div>
          {/* Mensagem de cupom aplicada (substitui o texto antigo) */}
          {couponParam && (
            <div className="text-center">
              <p className="text-sm md:text-base text-emerald-300 leading-relaxed max-w-3xl mx-auto">
                Cupom aplicado: ganhe meses de graça na sua assinatura!
              </p>
            </div>
          )}

          {/* Cupom aplicado */}
          {couponParam && (
            <div className="text-center mt-4">
              <p className="text-sm text-emerald-300">Cupom aplicado: <span className="font-medium">{couponParam}</span></p>
            </div>
          )}

          {/* Plans grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {/* Plano Vitalício (igual ao de liberacao-planos) */}
            <div className="order-3 md:order-3 border border-neutral-800/60 rounded-2xl p-8 bg-black/20 backdrop-blur-sm transition-all duration-300 filter grayscale cursor-not-allowed">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-white">PLANO VITALÍCIO (Exclusivo)</h3>
                <div className="mt-2 text-xs text-neutral-400">Vagas encerradas</div>
                <ProgressBar percentage={100} color="white" />
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3 text-sm"><span className="text-white/70 mt-1">✓</span><span className="text-white">Acesso vitalício à Automação Gold X (10x)</span></li>
                <li className="flex items-start gap-3 text-sm"><span className="text-white/70 mt-1">✓</span><span className="text-white">Estratégias Exclusivas Versão 10x</span></li>
                <li className="flex items-start gap-3 text-sm"><span className="text-white/70 mt-1">✓</span><span className="text-white">Encontro de Mentoria Exlusivo e Fechado com Daniel Katsu</span></li>
                <li className="flex items-start gap-3 text-sm"><span className="text-white/70 mt-1">✓</span><span className="text-white">Acesso ao Automatizador para Sempre.</span></li>
                <li className="flex items-start gap-3 text-sm"><span className="text-white/70 mt-1">✓</span><span className="text-white">Suporte prioritário direto com Daniel Katsu.</span></li>
                <li className="flex items-start gap-3 text-sm"><span className="text-white/70 mt-1">✓</span><span className="text-white">Comunidade exclusiva dos vitalícios</span></li>
              </ul>
              <div className="text-center pt-6 border-t border-neutral-800/30">
                <div className="text-2xl font-light text-white">12x R$1.578,50</div>
                <div className="mt-6">
                  <button
                    type="button"
                    aria-disabled
                    className="w-full inline-flex justify-center px-6 py-3 bg-neutral-700 rounded-xl text-neutral-300 font-medium"
                  >
                    VAGAS ENCERRADAS
                  </button>
                </div>
              </div>
            </div>
            {/* Trimestral */}
            <div className="order-2 md:order-2 border border-neutral-800/50 rounded-2xl p-8 bg-black/30 backdrop-blur-sm hover:border-neutral-700 transition-all duration-300">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-white">PLANO TRIMESTRAL</h3>
                <div className="mt-2 text-xs text-neutral-400">80 vagas</div>
                <ProgressBar percentage={73} color="red" />
              </div>
              <ul className="space-y-3 text-sm mb-6">
                <li className="flex gap-2"><span className="text-green-400">✓</span><span>Acesso à Automação Gold X (10x) por 3 meses</span></li>
                <li className="flex gap-2"><span className="text-green-400">✓</span><span>Estratégias Exclusivas Versão 10x</span></li>
                <li className="flex gap-2"><span className="text-green-400">✓</span><span>Suporte especializado</span></li>
              </ul>
              {couponParam && (
                <div className="text-xs text-emerald-300 mb-2 text-center">
                  No trimestral: ganhe mais 1 mês de graça, pois você está com cupom
                </div>
              )}
              <div className="text-center pt-6 border-t border-neutral-800/30">
                <div className="text-2xl font-light text-white mb-4">3x R$319,71</div>
                <a
                  href={trimestralUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex justify-center px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl text-white font-medium transition-all duration-200 tracking-wide"
                >
                  COMEÇAR AGORA
                </a>
              </div>
            </div>

            {/* Semestral */}
            <div className="order-1 md:order-1 relative border border-neutral-800/50 rounded-2xl p-8 bg-black/30 backdrop-blur-sm hover:border-neutral-700 transition-all duration-300">
              <span className="absolute -top-3 right-4 text-[10px] px-2 py-1 rounded-full bg-green-600 text-white border border-green-500/70 shadow">Recomendado</span>
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-white">PLANO SEMESTRAL</h3>
                <div className="mt-2 text-xs text-neutral-400">43 vagas</div>
                <ProgressBar percentage={85} color="red" />
              </div>
              <ul className="space-y-3 text-sm mb-6">
                <li className="flex gap-2"><span className="text-green-400">✓</span><span>Acesso à Automação Gold X (10x) por 6 meses</span></li>
                <li className="flex gap-2"><span className="text-green-400">✓</span><span>Estratégias Exclusivas Versão 10x</span></li>
                <li className="flex gap-2"><span className="text-green-400">✓</span><span>Suporte dedicado</span></li>
              </ul>
              {couponParam && (
                <div className="text-xs text-emerald-300 mb-2 text-center">
                  No semestral: ganhe mais de 2 meses de graça, pois você está com cupom
                </div>
              )}
              <div className="text-center pt-6 border-t border-neutral-800/30">
                <div className="text-2xl font-light text-white mb-4">6x R$263,99</div>
                <a
                  href={semestralUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex justify-center px-6 py-3 bg-white hover:bg-neutral-200 rounded-xl text-black font-medium transition-all duration-200 tracking-wide"
                >
                  COMEÇAR AGORA
                </a>
              </div>
            </div>
          </div>

          {/* Helper */}
          <div className="text-center mt-6 text-xs text-neutral-400">
            Os botões acima já levam seu cupom aplicado automaticamente.
          </div>

          {/* Footer */}
          <footer className="py-8 px-4 text-center bg-black mt-10 rounded-2xl">
            <p className="text-neutral-500 text-xs">Automação Gold - Todos os direitos reservados</p>
          </footer>

          {/* Back link */}
          <div className="text-center mt-10">
            <Link href="/" className="text-neutral-400 hover:text-white underline underline-offset-4">Voltar</Link>
          </div>
        </section>
      </main>
    </div>
  )
}

export default function AutomacaoBonusPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}> 
      <AutomacaoBonusInner />
    </Suspense>
  )
}
