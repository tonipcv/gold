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
    id: 0,
    number: 0,
    title: 'INFORMAÇÕES IMPORTANTES ANTES DA UTILIZAÇÃO',
    playerId: '6936e38a62cebd25172bf985',
    accountId: '70b43777-e359-4c77-af2c-366de25a153d'
  },
  {
    id: 1,
    number: 1,
    title: 'AUTOMAÇÃO CELULAR',
    playerId: '693098cc1fe8f267646089bf',
    accountId: '70b43777-e359-4c77-af2c-366de25a153d'
  },
  {
    id: 2,
    number: 2,
    title: 'AUTOMAÇÃO CELULAR PARTE 2',
    playerId: '69373abc199d124a45527963',
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
  const [activeAula, setActiveAula] = useState<number>(0)
  const currentAula = aulas.find((a) => a.id === activeAula)!

  const [ack, setAck] = useState(false)

  const handleAck = () => {
    setAck(true)
  }

  const handleAulaChange = (id: number) => {
    setActiveAula(id)
  }

  useEffect(() => {
    try {
      if (!ack) {
        const prev = document.body.style.overflow
        document.body.setAttribute('data-prev-overflow', prev)
        document.body.style.overflow = 'hidden'
      } else {
        const prev = document.body.getAttribute('data-prev-overflow') || ''
        document.body.style.overflow = prev
        document.body.removeAttribute('data-prev-overflow')
      }
    } catch {}
    return () => {
      try {
        const prev = document.body.getAttribute('data-prev-overflow') || ''
        document.body.style.overflow = prev
        document.body.removeAttribute('data-prev-overflow')
      } catch {}
    }
  }, [ack])

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
        {currentAula.number === 1 && (
          <div className="mt-4 flex flex-col items-center gap-2">
            <a
              href="https://one.exnessonelink.com/a/jo986i1iel?platform=mobile"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-xs text-center px-4 py-2 rounded-full text-xs font-semibold bg-green-600 hover:bg-green-500 text-white border border-green-500/60"
            >
              Baixar app
            </a>
          </div>
        )}
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

      {/* Modal overlay */}
      {!ack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-2xl rounded-xl border border-white/10 bg-neutral-900/95 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg md:text-xl font-semibold text-white tracking-tight mb-3">Atenção</h2>
            <div className="text-sm text-gray-200 space-y-3 mb-6">
              <p>Este módulo é somente para usuários que não têm acesso ao computador.</p>
              <p>O recurso de copy possui limitações técnicas e permite alterar apenas parâmetros básicos de segurança, como stop diário, stop loss e stop win.</p>
              <p>A personalização completa da estratégia só pode ser feita pelo computador.</p>
              <p>Antes de continuar, é essencial que você:</p>
              <ul className="list-disc list-inside pl-2 space-y-1">
                <li>já tenha definido seu STOP diário,</li>
                <li>entendido como funciona o gerenciamento de risco,</li>
                <li>e configurado todas as travas de segurança corretamente.</li>
              </ul>
              <p className="font-semibold text-amber-400">Se você ainda tiver dúvidas, não opere com dinheiro real.</p>
              <p>A escolha dos ativos é sempre responsabilidade exclusiva do usuário e deve ser feita com atenção, analisando seu próprio perfil de risco.</p>
              <p>Para utilizar o copy com segurança, você precisa entender como montar sua estratégia personalizada.</p>
              <p>Se você já sabe personalizar e configurar tudo corretamente e deseja utilizar algum dos Templates Técnicos (presets) como ponto de partida, pode prosseguir para o Módulo 5.</p>
              <p className="font-semibold">Lembre-se:</p>
              <ul className="list-disc list-inside pl-2 space-y-1">
                <li>Os presets são apenas referências técnicas e opcionais, criados para demonstrar funcionamento.</li>
                <li>Eles não representam recomendação de investimento, nem indicação de ativo ou estratégia.</li>
              </ul>
              <p className="font-semibold mt-4">Ao avançar, você declara que:</p>
              <ul className="list-disc list-inside pl-2 space-y-1">
                <li>compreende as limitações do copy,</li>
                <li>assume total responsabilidade por suas escolhas,</li>
                <li>e está ciente de que o software apenas executa o que você configurou.</li>
              </ul>
            </div>
            <button
              onClick={handleAck}
              className="w-full text-center px-4 py-2 rounded-full text-sm font-semibold bg-green-600 hover:bg-green-500 text-white border border-green-500/60"
            >
              Li e compreendo todas as orientações
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
