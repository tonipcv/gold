'use client'

import { useState, useEffect } from 'react'

interface Aula {
  id: number
  number: number
  title: string
  videoUrl?: string
  playerId?: string
  accountId?: string
}

const aulas: Aula[] = [
  {
    id: 1,
    number: 1,
    title: 'VERSÃO CELULAR PART 1',
    videoUrl: 'https://www.youtube.com/embed/pfyCP2UASXA'
  },
  {
    id: 2,
    number: 2,
    title: 'VERSÃO CELULAR PART 2',
    playerId: '69279cc39498a1dd3a4f1aa8',
    accountId: '70b43777-e359-4c77-af2c-366de25a153d'
  }
]

// Componente VturbPlayer
function VturbPlayer({ playerId, accountId = '70b43777-e359-4c77-af2c-366de25a153d' }: { playerId: string; accountId?: string }) {
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
  }, [playerId, containerId, accountId])

  return <div id={containerId} className="w-full" />
}

export default function ModuloClient() {
  const [activeAula, setActiveAula] = useState<number>(1)
  const currentAula = aulas.find((a) => a.id === activeAula)!

  const handleAulaChange = (id: number) => {
    setActiveAula(id)
  }

  return (
    <div className="text-gray-200">
      {/* Header do Módulo (minimalista) */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/5 text-[11px] md:text-xs uppercase tracking-wide text-gray-200">
          Módulo 5
        </div>
        <h1 className="mt-3 text-2xl md:text-[28px] font-semibold text-white tracking-tight">Celular</h1>
        <p className="mt-1 text-sm text-gray-400">Aprenda a operar pelo celular</p>
        <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>

      {/* Video Player Section */}
      <div className="w-full mb-6 max-w-xl md:max-w-2xl mx-auto">
        <div className="rounded-lg border border-gray-800 overflow-hidden bg-black">
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            {currentAula.videoUrl ? (
              <iframe
                src={currentAula.videoUrl}
                title={`AULA ${currentAula.number}`}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : currentAula.playerId ? (
              <div className="absolute inset-0">
                <VturbPlayer key={currentAula.playerId} playerId={currentAula.playerId} accountId={currentAula.accountId} />
              </div>
            ) : null}
          </div>
        </div>
        {/* Botões para Aula 2 */}
        {currentAula.number === 2 && (
          <div className="mt-4 flex flex-col items-center gap-2">
            <a
              href="https://social-trading.exness.com/strategy/227997130/a/tcnv1es7kk?sharer=trader"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-xs text-center px-4 py-2 rounded-full text-xs font-semibold bg-green-600 hover:bg-green-500 text-white border border-green-500/60"
            >
              🔘 FALCON BIT
            </a>
            <a
              href="https://social-trading.exness.com/strategy/227997134/a/tcnv1es7kk?sharer=trader"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-xs text-center px-4 py-2 rounded-full text-xs font-semibold bg-green-600 hover:bg-green-500 text-white border border-green-500/60"
            >
              🔘 POWER V2
            </a>
            <a
              href="https://social-trading.exness.com/strategy/227997139/a/tcnv1es7kk?sharer=trader"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-xs text-center px-4 py-2 rounded-full text-xs font-semibold bg-green-600 hover:bg-green-500 text-white border border-green-500/60"
            >
              🔘 GOLD X
            </a>
          </div>
        )}
      </div>

      {/* Lista de Aulas */}
      <div className="w-full">
        <div className="space-y-2">
          {aulas.map((aula) => {
            const isActive = activeAula === aula.id
            return (
              <button
                key={aula.id}
                onClick={() => handleAulaChange(aula.id)}
                className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors border ${
                  isActive
                    ? 'bg-green-600/10 border-green-500'
                    : 'bg-transparent hover:bg-white/5 border-transparent cursor-pointer'
                }`}
              >
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-medium ${isActive ? 'text-green-400' : 'text-white'} text-sm md:text-base tracking-tight uppercase`}>
                      AULA {aula.number} - {aula.title}
                    </h3>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
