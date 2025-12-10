'use client'

import { useState, useEffect } from 'react'
import VturbEmbed from '@/app/cursos/VturbEmbed'

interface Aula {
  id: number
  number: number
  title: string
  videoUrl?: string
  playerId?: string
  accountId?: string
}

const aulas: Aula[] = [
  { id: 1, number: 1, title: 'PRESET FALCON BIT', playerId: '693726fd2d43d777bf1c1e09', accountId: '70b43777-e359-4c77-af2c-366de25a153d' },
  { id: 2, number: 2, title: 'PRESETS SIMULTÂNEOS', playerId: '69309ac48f8686608182c8dd', accountId: '70b43777-e359-4c77-af2c-366de25a153d' },
]

export default function ModuloClient() {
  const [activeAula, setActiveAula] = useState<number>(1)
  const currentAula = aulas.find((a) => a.id === activeAula)!
  const [showModal, setShowModal] = useState(false)

  const materialsUrl = 'https://drive.google.com/drive/folders/1uaN5F57mOnm2JIunnWEZTPIwunFu7HwJ?usp=sharing'

  const openModal = () => setShowModal(true)
  const closeModal = () => setShowModal(false)
  const confirmAndGo = () => {
    setShowModal(false)
    window.open(materialsUrl, '_blank', 'noopener,noreferrer')
  }

  useEffect(() => {
    try {
      if (showModal) {
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
  }, [showModal])

  return (
    <div className="text-gray-200">
      {/* Header do Módulo (minimalista) */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/5 text-[11px] md:text-xs uppercase tracking-wide text-gray-200">
          Módulo 4
        </div>
        <h1 className="mt-3 text-2xl md:text-[28px] font-semibold text-white tracking-tight">Preset Falcon Bit</h1>
        <p className="mt-1 text-sm text-gray-400">Preset Falcon Bit</p>
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
                <VturbEmbed key={currentAula.playerId} playerId={currentAula.playerId} accountId={currentAula.accountId} />
              </div>
            ) : null}
          </div>
        </div>
        {/* Botão de Materiais com confirmação */}
        <div className="mt-4 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={openModal}
            className="w-full max-w-xs text-center px-4 py-2 rounded-full text-xs font-semibold bg-green-600 hover:bg-green-500 text-white border border-green-500/60"
          >
            Baixar Preset Falcon Bit
          </button>
        </div>
      </div>

      {/* Lista de Aulas */}
      <div className="w-full">
        <div className="space-y-2">
          {aulas.map((aula) => {
            const isActive = activeAula === aula.id
            return (
              <button
                key={aula.id}
                onClick={() => setActiveAula(aula.id)}
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

      {/* Modal overlay para materiais (idêntico ao do Módulo 2) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-lg rounded-xl border border-white/10 bg-neutral-900/95 p-6 shadow-2xl">
            <h2 className="text-lg md:text-xl font-semibold text-white tracking-tight mb-3">Atenção</h2>
            <div className="text-sm text-gray-200 space-y-3 mb-6">
              <p>Antes de baixar o arquivo de instalação, é essencial que você assista à aula completa de personalização e backtesting.</p>
              <p>Somente após entender esses fundamentos você conseguirá configurar a automação do seu jeito, definindo todos os parâmetros como risco, stop diário, ativos, horários e demais ajustes técnicos.</p>
              <p>Na plataforma, você também encontrará Templates Técnicos opcionais criados pelo Daniel, que servem apenas como ponto de partida educacional para demonstrar como o sistema funciona.</p>
              <p>Você pode utilizá-los caso queira, mas a configuração final e todas as decisões são exclusivamente suas, incluindo personalização de ativo, risco, horários e níveis de segurança.</p>
              <p>Ao clicar no botão abaixo, você confirma que: compreendeu todas as orientações apresentadas nas aulas, está ciente de que a personalização é totalmente sua responsabilidade, e que qualquer template é apenas uma referência técnica opcional, não uma recomendação financeira.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <a
                href="/cursos/modulo-6"
                className="flex-1 text-center px-4 py-2 rounded-full text-sm font-medium border border-white/30 text-white hover:bg-white/10"
              >
                Assistir personalização completa
              </a>
              <button
                type="button"
                onClick={confirmAndGo}
                className="flex-1 text-center px-4 py-2 rounded-full text-sm font-semibold bg-green-600 hover:bg-green-500 text-white border border-green-500/60"
              >
                Baixar Preset Falcon Bit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
