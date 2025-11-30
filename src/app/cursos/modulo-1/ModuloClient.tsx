'use client'

import { useState } from 'react'

interface Aula {
  id: number
  number: number
  title: string
  videoUrl: string
}

const aulas: Aula[] = [
  {
    id: 0,
    number: 0,
    title: 'Introdução do Modulo',
    videoUrl: 'https://www.youtube.com/embed/vwXvoqT37Vo'
  },
  {
    id: 1,
    number: 1,
    title: 'Criando conta no app',
    videoUrl: 'https://www.youtube.com/embed/lKKINz8kZLc'
  },
  {
    id: 2,
    number: 2,
    title: 'MT5 + COMO INSTALAR ESTRATEGIA + VPS',
    videoUrl: 'https://www.youtube.com/embed/2GkO885pGJk'
  },
  {
    id: 3,
    number: 3,
    title: 'VPS GRATUITO',
    videoUrl: 'https://www.youtube.com/embed/nO999jJuq1Y'
  },
  {
    id: 4,
    number: 4,
    title: 'STANDARD PARA CENT',
    videoUrl: 'https://www.youtube.com/embed/4Xx2-KrjYpU'
  },
  {
    id: 5,
    number: 5,
    title: 'FORMULARIO - LIBERAÇÃO OFICIAL',
    videoUrl: 'https://www.youtube.com/embed/KEvUwgK5Y_w'
  },
  {
    id: 6,
    number: 6,
    title: 'SUPORTE INDIVIDUAL',
    videoUrl: 'https://www.youtube.com/embed/M0xSmEBvvx8'
  }
]

export default function ModuloClient() {
  const [activeAula, setActiveAula] = useState<number>(0)
  const currentAula = aulas.find((a) => a.id === activeAula)!

  const handleAulaChange = (id: number) => {
    setActiveAula(id)
  }

  return (
    <div className="text-gray-200">
      {/* Header do Módulo (minimalista) */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/5 text-[11px] md:text-xs uppercase tracking-wide text-gray-200">
          Módulo 1
        </div>
        <h1 className="mt-3 text-2xl md:text-[28px] font-semibold text-white tracking-tight">Instalação</h1>
        <p className="mt-1 text-sm text-gray-400">Instalação e primeiros passos</p>
        <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>

      {/* Video Player Section */}
      <div className="w-full mb-6 max-w-xl md:max-w-2xl mx-auto">
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
        <div className="mt-4 flex flex-col items-center gap-2">
          {currentAula.number === 1 && (
            <a
              href="https://one.exnessonelink.com/a/jo986i1iel?platform=mobile"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-xs text-center px-4 py-2 rounded-full text-xs font-semibold bg-green-600 hover:bg-green-500 text-white border border-green-500/60"
            >
              Baixar app
            </a>
          )}
          {currentAula.number === 2 && (
            <a
              href="https://one.exnesstrack.org/metatrader-5/a/tcnv1es7kk/?campaign=34785&track1=Baixar"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-xs text-center px-4 py-2 rounded-full text-xs font-semibold bg-green-600 hover:bg-green-500 text-white border border-green-500/60"
            >
              Baixar MT5
            </a>
          )}
          {currentAula.number === 5 && (
            <a
              href="https://gold.k17.com.br/formulario"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-xs text-center px-4 py-2 rounded-full text-xs font-semibold bg-green-600 hover:bg-green-500 text-white border border-green-500/60"
            >
              Formulário de liberação
            </a>
          )}
          {currentAula.number === 6 && (
            <a
              href="https://wa.me/5573917778075?text=Ol%C3%A1%2C%20sou%20aluno(a)%20e%20j%C3%A1%20salvei%20o%20seu%20n%C3%BAmero%20para%20entrar%20na%20lista%20de%20atualiza%C3%A7%C3%A3o"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-xs text-center px-4 py-2 rounded-full text-xs font-semibold bg-green-600 hover:bg-green-500 text-white border border-green-500/60"
            >
              Entrar na lista de atualizações
            </a>
          )}
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
