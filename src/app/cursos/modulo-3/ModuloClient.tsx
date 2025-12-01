'use client'

import { useState } from 'react'

interface Aula {
  id: number
  number: number
  title: string
  videoUrl: string
}

const aulas: Aula[] = [
  { id: 1, number: 1, title: 'ESTRATEGIA POWER V2', videoUrl: 'https://www.youtube.com/embed/18fjV_l9o3Y' },
  { id: 2, number: 2, title: 'ESTRATEGIAS SIMULTANEAS', videoUrl: 'https://www.youtube.com/embed/DYBmM3ix7XE' },
]

export default function ModuloClient() {
  const [activeAula, setActiveAula] = useState<number>(1)
  const currentAula = aulas.find((a) => a.id === activeAula)!

  return (
    <div className="text-gray-200">
      {/* Header do Módulo (minimalista) */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/5 text-[11px] md:text-xs uppercase tracking-wide text-gray-200">
          Módulo 3
        </div>
        <h1 className="mt-3 text-2xl md:text-[28px] font-semibold text-white tracking-tight">Power V2</h1>
        <p className="mt-1 text-sm text-gray-400">Estratégia Power V2</p>
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
        {/* Botão de Materiais (sempre visível) */}
        <div className="mt-4 flex flex-col items-center gap-2">
          <a
            href="https://drive.google.com/drive/folders/1S2lO0zWMgXpZWmrC8D3kwfXbQoBEUG7q?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-xs text-center px-4 py-2 rounded-full text-xs font-semibold bg-green-600 hover:bg-green-500 text-white border border-green-500/60"
          >
            Materiais do módulo
          </a>
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
    </div>
  )
}
