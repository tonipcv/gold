'use client'

import { useEffect, useState } from 'react'

interface Aula {
  id: number
  number: number
  title: string
  playerId?: string
  accountId?: string
}

const aulas: Aula[] = [
  {
    id: 1,
    number: 1,
    title: 'Criando uma Estratégia 100% Personalizada com Base nos Presets',
    playerId: '6939c5867af3fcac47bb73f5',
    accountId: '70b43777-e359-4c77-af2c-366de25a153d'
  }
]

function VturbPlayer({ playerId, accountId = '70b43777-e359-4c77-af2c-366de25a153d' }: { playerId: string; accountId?: string }) {
  const containerId = `vturb-container-${playerId}`

  useEffect(() => {
    if (typeof window === 'undefined') return
    const container = document.getElementById(containerId)
    if (!container) return
    container.innerHTML = ''
    const playerEl = document.createElement('vturb-smartplayer') as any
    playerEl.id = `vid-${playerId}`
    ;(playerEl as HTMLElement).style.display = 'block'
    ;(playerEl as HTMLElement).style.margin = '0 auto'
    ;(playerEl as HTMLElement).style.width = '100%'
    container.appendChild(playerEl)
    try {
      const prev = Array.from(document.querySelectorAll(`script[data-vturb-player="${playerId}"]`))
      prev.forEach((n) => n.parentElement?.removeChild(n))
    } catch {}
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

  return (
    <div className="text-gray-200">
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/5 text-[11px] md:text-xs uppercase tracking-wide text-gray-200">
          Módulo 6
        </div>
        <h1 className="mt-3 text-2xl md:text-[28px] font-semibold text-white tracking-tight">Criando Estratégia Personalizada</h1>
        <p className="mt-1 text-sm text-gray-400">Baseada nos presets</p>
        <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>

      <div className="w-full mb-6 max-w-xl md:max-w-2xl mx-auto">
        <div className="rounded-lg border border-gray-800 overflow-hidden bg-black">
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            {currentAula.playerId ? (
              <div className="absolute inset-0">
                <VturbPlayer key={currentAula.playerId} playerId={currentAula.playerId} accountId={currentAula.accountId} />
              </div>
            ) : null}
          </div>
        </div>
        <div className="mt-4 flex flex-col items-center gap-2">
          <a
            href="https://drive.google.com/drive/folders/17r3ZV3g7wbticbYoKkhJmfD_BuO0Op-c?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-xs text-center px-4 py-2 rounded-full text-xs font-semibold bg-green-600 hover:bg-green-500 text-white border border-green-500/60"
          >
            Baixar arquivos
          </a>
        </div>
      </div>

      <div className="w-full">
        <div className="space-y-2">
          {aulas.map((aula) => {
            const isActive = activeAula === aula.id
            return (
              <button
                key={aula.id}
                onClick={() => setActiveAula(aula.id)}
                className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors border ${
                  isActive ? 'bg-green-600/10 border-green-500' : 'bg-transparent hover:bg-white/5 border-transparent cursor-pointer'
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
