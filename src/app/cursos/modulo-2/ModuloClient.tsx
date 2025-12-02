'use client'

import { useState, useEffect } from 'react'

interface Aula {
  id: number
  number: number
  title: string
  videoUrl: string
}

const aulas: Aula[] = [
  {
    id: 1,
    number: 1,
    title: 'INSTALANDO GOLD X',
    videoUrl: 'https://www.youtube.com/embed/dL93pESVFMg'
  }
]

export default function ModuloClient() {
  const [activeAula, setActiveAula] = useState<number>(1)
  const currentAula = aulas.find((a) => a.id === activeAula)!
  const [showModal, setShowModal] = useState(false)

  const tempUrl = 'https://drive.google.com/drive/folders/18OlHm2D4H3EgxkZ7joPgGei4BwmZ5R_p?usp=sharing'

  const openModal = () => setShowModal(true)
  const closeModal = () => setShowModal(false)
  const confirmAndGo = () => {
    setShowModal(false)
    window.open(tempUrl, '_blank', 'noopener,noreferrer')
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
          Módulo 2
        </div>
        <h1 className="mt-3 text-2xl md:text-[28px] font-semibold text-white tracking-tight">Estratégia Gold X</h1>
        <p className="mt-1 text-sm text-gray-400">Aprenda a instalar e configurar a estratégia Gold X</p>
        <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>

      {/* Video Player Section */}
      <div className="w-full mb-6 max-w-xl md:max-w-2xl mx-auto">
        <h2 className="text-lg md:text-xl font-bold text-white text-center mt-3 mb-4 md:mt-6 md:mb-5">
          AULA {currentAula.number} - {currentAula.title}
        </h2>
        <div className="rounded-lg border border-gray-800 overflow-hidden bg-black">
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            <iframe
              src={currentAula.videoUrl}
              title={`AULA ${currentAula.number}`}
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
        {/* Botões abaixo do vídeo (empilhados e arredondados) */}
        <div className="mt-4 flex flex-col items-center justify-center gap-2">
          <button
            type="button"
            onClick={openModal}
            className="w-full max-w-xs text-center px-4 py-2 rounded-full text-xs font-semibold bg-green-600 hover:bg-green-500 text-white border border-green-500/60"
          >
            GOLD X - Temporário
          </button>
          <button
            type="button"
            disabled
            className="w-full max-w-xs px-4 py-2 rounded-full text-xs font-semibold bg-gray-700 text-gray-300 border border-gray-600 cursor-not-allowed"
            title="Disponível em 15/12"
          >
            GOLD X - Oficial (15/12)
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

      {/* Modal overlay for GOLD X Temporário */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-lg rounded-xl border border-white/10 bg-neutral-900/95 p-6 shadow-2xl">
            <h2 className="text-lg md:text-xl font-semibold text-white tracking-tight mb-3">Atenção</h2>
            <div className="text-sm text-gray-200 space-y-3 mb-6">
              <p>Você será redirecionado para o arquivo de instalação, mas antes é fundamental compreender todos os fundamentos e etapas de configuração.</p>
              <p>Embora a estratégia seja automatizada, você é quem define os parâmetros, como o STOP diário e demais ajustes, além de escolher os ativos, já que cada estratégia opera em um ativo diferente.</p>
              <p>Ao clicar no botão abaixo, você confirma que entendeu todas as orientações e já está ciente de todas as informações apresentadas na aula.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 text-center px-4 py-2 rounded-full text-sm font-medium border border-white/30 text-white hover:bg-white/10"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmAndGo}
                className="flex-1 text-center px-4 py-2 rounded-full text-sm font-semibold bg-green-600 hover:bg-green-500 text-white border border-green-500/60"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
