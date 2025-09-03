/* eslint-disable */

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'

// ConverteAI vturb player component (SSR-safe): render placeholder and init on client
function VturbPlayer({ playerId }: { playerId: string }) {
  const accountId = '32ff2495-c71e-49ba-811b-00b5b49c517f'
  const containerId = `vturb-container-${playerId}`
  
  useEffect(() => {
    if (typeof window === 'undefined') return
    const container = document.getElementById(containerId)
    if (!container) return

    // Reset container and inject custom element
    container.innerHTML = ''
    const playerEl = document.createElement('vturb-smartplayer') as any
    playerEl.id = `vid-${playerId}`
    ;(playerEl as HTMLElement).style.display = 'block'
    ;(playerEl as HTMLElement).style.margin = '0 auto'
    ;(playerEl as HTMLElement).style.width = '100%'
    container.appendChild(playerEl)

    // Remove previous scripts for this playerId
    try {
      const prev = Array.from(document.querySelectorAll(`script[data-vturb-player="${playerId}"]`))
      prev.forEach((n) => n.parentElement?.removeChild(n))
    } catch {}

    // Inject script (re-executes even if cached)
    const s = document.createElement('script')
    s.src = `https://scripts.converteai.net/${accountId}/players/${playerId}/v4/player.js`
    s.async = true
    s.setAttribute('data-vturb-player', playerId)
    document.head.appendChild(s)

    return () => {
      try { document.head.removeChild(s) } catch {}
      try { container.innerHTML = '' } catch {}
    }
  }, [playerId, containerId])

  return <div id={containerId} className="w-full" />
}

interface Episode {
  id: number
  number: number
  title: string
  playerId: string
  duration?: string
}

export default function AutomatizadorGold10xClient() {
  const [activeEpisode, setActiveEpisode] = useState<number>(1)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 })
  const [aula1CtaVisible, setAula1CtaVisible] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  useEffect(() => {
    // Countdown to 08 Sep 2025 19:00 (UTC-3)
    const target = new Date('2025-09-08T19:00:00-03:00').getTime()
    const tick = () => {
      const now = Date.now()
      const diff = Math.max(0, target - now)
      const d = Math.floor(diff / (1000 * 60 * 60 * 24))
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const s = Math.floor((diff % (1000 * 60)) / 1000)
      setTimeLeft({ d, h, m, s })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const episodes: Episode[] = [
    { id: 1, number: 1, title: 'Começando do Absoluto Zero e Instalando a Automação pelo Celular', playerId: '68af32d1c3d8b7bced8ce3db' },
    { id: 2, number: 2, title: 'Instalando a Estratégia da Automação do Zero', playerId: '68aeeb36040f0b0ec4ad980e' },
    { id: 3, number: 3, title: 'Ativando a Automação no Celular', playerId: '68aeeb15d03165f25f444b0b' },
    { id: 4, number: 4, title: 'Como aumentar a perfomance da Automação', playerId: '68af0480d92b07c6d4ea02b0' },
  ]

  const currentEpisode = episodes.find((e) => e.id === activeEpisode)!
  
  // Troca de episódio
  const handleEpisodeChange = (id: number) => {
    if (id === activeEpisode) return
    setActiveEpisode(id)
  }

  // Show Aula 1 CTA after 30s when Aula 1 is active
  useEffect(() => {
    setAula1CtaVisible(false)
    let timer: any
    if (activeEpisode === 1) {
      timer = setTimeout(() => setAula1CtaVisible(true), 30000)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [activeEpisode])

  return (
    <div className="min-h-screen bg-[#111] text-gray-200">
      {/* Header */}
      <header className="fixed top-0 w-full bg-[#111]/90 backdrop-blur-sm z-50 px-4 py-3">
        <div className="flex justify-center lg:justify-start">
          <div className="flex items-center">
            <Image src="/ft-icon.png" alt="Futuros Tech Logo" width={40} height={40} className="brightness-0 invert" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-14 pb-8">
        {/* Mobile-only Countdown at Top */}
        <div className="block md:hidden px-4 mt-2">
          <section className="bg-gray-900/40 p-3 rounded-lg border border-gray-800">
            <p className="text-center text-sm text-gray-300 font-semibold mb-3">
              Versão 10x será liberada em:
            </p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Dias', value: timeLeft.d },
                { label: 'Horas', value: timeLeft.h },
                { label: 'Min', value: timeLeft.m },
                { label: 'Seg', value: timeLeft.s },
              ].map((item) => (
                <div key={item.label} className="text-center bg-black/40 rounded-lg py-2 border border-gray-800">
                  <div className="text-3xl font-bold text-green-400 leading-none">{String(item.value).padStart(2, '0')}</div>
                  <div className="text-xs uppercase tracking-wide text-gray-400">{item.label}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
        {/* Video Player Section */}
        <div className="w-full md:w-1/2 lg:w-1/2 md:mx-auto lg:mx-auto px-4 mt-4">
          {/* Title above video */}
          <h2 className="text-lg md:text-xl font-bold text-white text-center mt-5 mb-5 md:mt-8 md:mb-6">{currentEpisode.title}</h2>
          <div className="bg-black">
            <VturbPlayer key={currentEpisode.playerId} playerId={currentEpisode.playerId} />
          </div>
          <div className="px-0 py-4">
            {activeEpisode === 1 && aula1CtaVisible && (
              <div className="mt-4 flex flex-col items-center gap-4">
                <a
                  href="https://one.exnesstrack.org/a/jo986i1iel?platform=mobile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 justify-center px-6 py-3 rounded-xl border border-green-500 bg-green-700 text-white text-base font-semibold shadow-[0_0_28px_rgba(34,197,94,0.35)] hover:bg-green-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M5 20h14v-2H5v2Zm7-3 5-5h-3V4h-4v8H7l5 5Z" />
                  </svg>
                  BAIXAR APP
                </a>
              </div>
            )}
            {activeEpisode === 2 && (
              <div className="mt-4 flex flex-col items-center gap-4">
                {/* Filled green MT5 button (neon) */}
                <a
                  href="https://www.exness.com/pt/metatrader-5/?utm_source=partners&campaign=34785&track1=Baixar&ex_ol=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 justify-center px-6 py-3 rounded-xl border border-green-500 bg-green-700 text-white text-base font-semibold shadow-[0_0_28px_rgba(34,197,94,0.35)] hover:bg-green-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M5 20h14v-2H5v2Zm7-3 5-5h-3V4h-4v8H7l5 5Z" />
                  </svg>
                  BAIXAR MT5
                </a>
                {/* Outlined green GOLD SYSTEM button (neon outline) */}
                <button
                  type="button"
                  onClick={() => setShowDownloadModal(true)}
                  className="inline-flex items-center gap-2 justify-center px-6 py-3 rounded-xl border-2 border-green-500 text-green-200 text-base font-semibold hover:bg-green-600/10 shadow-[0_0_28px_rgba(34,197,94,0.25)] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M8 5v14l11-7L8 5Z" />
                  </svg>
                  BAIXAR GOLD SYSTEM
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Episodes List and Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 md:w-1/2 lg:w-1/2 md:mx-auto lg:mx-auto gap-0">
          {/* Episodes List */}
          <div className="md:h-[calc(100vh-11rem)] lg:h-[calc(100vh-11rem)] md:overflow-y-auto lg:overflow-y-auto px-4 pb-2 md:p-4 lg:p-4 episode-list">
            <div className="space-y-1 lg:space-y-2">
              {episodes.map((episode) => (
                <button
                  key={episode.id}
                  onClick={() => handleEpisodeChange(episode.id)}
                  className={`w-full flex gap-3 p-3 rounded-lg transition-colors ${
                    activeEpisode === episode.id ? 'bg-gray-400/30 border-l-4 border-green-300' : 'hover:bg-gray-800'
                  }`}
                >
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-green-300 text-lg md:text-sm">Aula {episode.number}</h3>
                    <p className="text-base md:text-xs text-gray-200">{episode.title}</p>
                    {episode.duration && <p className="text-xs text-gray-400 mt-1">{episode.duration}</p>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content and Materials */}
          <div className="hidden md:space-y-4 lg:space-y-4 px-4 md:p-4 lg:p-4 md:block">
            <section className="bg-gray-900/40 p-3 lg:p-4 rounded-lg border border-gray-800">
              {/* Countdown only */}
              <p className="text-center text-sm md:text-base text-gray-300 font-semibold mb-3">
                Versão 10x será liberada em:
              </p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Dias', value: timeLeft.d },
                  { label: 'Horas', value: timeLeft.h },
                  { label: 'Min', value: timeLeft.m },
                  { label: 'Seg', value: timeLeft.s },
                ].map((item) => (
                  <div key={item.label} className="text-center bg-black/40 rounded-lg py-2 border border-gray-800">
                    <div className="text-3xl md:text-2xl font-bold text-green-400 leading-none">{String(item.value).padStart(2, '0')}</div>
                    <div className="text-xs md:text-[10px] uppercase tracking-wide text-gray-400">{item.label}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Fixed Bottom Actions removed */}

        {/* Download Terms Modal */}
        {showDownloadModal && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="download-modal-title"
          >
            <div className="w-full max-w-md bg-[#111] border border-gray-800 rounded-xl shadow-2xl">
              <div className="p-4 border-b border-gray-800 flex items-start justify-between">
                <h3 id="download-modal-title" className="text-base font-semibold text-gray-100">
                  Leia os Termos antes de baixar
                </h3>
                <button
                  aria-label="Fechar"
                  onClick={() => {
                    setShowDownloadModal(false)
                    setAcceptedTerms(false)
                  }}
                  className="text-gray-400 hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 space-y-3 text-sm text-gray-300">
                <p>
                  Esta é uma versão de teste destinada apenas a fins de avaliação. A leitura e concordância com os
                  <Link href="/termos-automatizador" className="ml-1 text-green-400 hover:text-green-300 underline">Termos de Uso</Link>
                  são obrigatórias antes de prosseguir.
                </p>
              </div>
              {/* Terms acceptance checkbox */}
              <div className="px-4 pb-2">
                <label className="flex items-start gap-2 text-xs text-gray-300">
                  <input
                    id="accept-terms"
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-600 bg-black/40"
                  />
                  <span>
                    Declaro que li e concordo com os
                    <Link href="/termos-automatizador" className="ml-1 text-green-400 hover:text-green-300 underline">Termos de Uso</Link>.
                  </span>
                </label>
              </div>
              <div className="px-4 pb-4 pt-2 flex items-center gap-3">
                <a
                  href="https://drive.google.com/drive/folders/1aNuto8dai003b55qIH6z8dw6-9l7RmAz?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={!acceptedTerms}
                  className={`inline-flex items-center justify-center text-white text-sm font-medium px-4 py-2 rounded-md transition-colors ${
                    acceptedTerms ? 'bg-green-600 hover:bg-green-700' : 'bg-green-600/60 cursor-not-allowed'
                  }`}
                  onClick={(e) => {
                    if (!acceptedTerms) {
                      e.preventDefault()
                      e.stopPropagation()
                      return
                    }
                    setShowDownloadModal(false)
                    setAcceptedTerms(false)
                  }}
                >
                  Concordo e baixar no Drive
                </a>
                <button
                  type="button"
                  className="text-sm text-gray-300 hover:text-gray-100"
                  onClick={() => {
                    setShowDownloadModal(false)
                    setAcceptedTerms(false)
                  }}
                >
                  Cancelar
                </button>
              </div>
              <div className="px-4 pb-4">
                <p className="text-[10px] leading-snug text-gray-400">
                  ESTE SOFTWARE É UM ARQUIVO DIGITAL E NÃO CONSTITUI CONSULTORIA, ASSESSORIA OU PROMESSA DE RENTABILIDADE.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

    </div>
  )
}
