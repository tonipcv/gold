'use client'

import { useState } from 'react'
import { OptimizedImage } from '../components/OptimizedImage'

type PackKey = 'goldx' | 'powerv2' | 'falconfx'

const PACKS: { key: PackKey; title: string; img: string; price: string }[] = [
  { key: 'goldx', title: 'GOLD X', img: '/gold.png', price: '823 reais por mês ou 12x786 por ano' },
  { key: 'powerv2', title: 'POWER V2', img: '/power.png', price: '823 reais por mês ou 12x786 por ano' },
  { key: 'falconfx', title: 'FALCON FX', img: '/falcon.png', price: '823 reais por mês ou 12x786 por ano' },
]

const DETAILS: Record<PackKey, { title: string; sections: { heading?: string; lines: string[] }[] }> = {
  goldx: {
    title: 'GOLD X',
    sections: [
      {
        lines: [
          'O GOLD X foi desenvolvido para operar de forma totalmente automática, executando ordens de compra com inteligência, precisão e velocidade. O software segue parâmetros definidos pelo usuário ou pela estratégia base configurada no sistema.',
          'Assim que uma oportunidade é identificada, o GOLD X executa a ordem de compra instantaneamente, eliminando atrasos manuais e garantindo agilidade na operação. Logo após a entrada, o sistema define automaticamente o stop loss diretamente no servidor, protegendo o capital contra movimentos inesperados de preço. Essa proteção permanece ativa mesmo em casos de desconexão, queda de energia ou encerramento da plataforma.',
        ],
      },
      {
        heading: 'Principais Características',
        lines: [
          'Entrada automática em operações de compra.',
          'Stop Loss configurado diretamente no servidor (ordem nativa de proteção).',
          'Execução instantânea e precisa.',
          'Gestão de risco integrada para controle de perdas.',
          'Operações 100% automáticas, sem necessidade de intervenção manual.',
        ],
      },
      {
        heading: 'Vantagens',
        lines: [
          'Elimina erros decorrentes de decisões emocionais.',
          'Protege cada operação desde o início.',
          'Ideal para quem busca consistência e disciplina nas execuções.',
        ],
      },
    ],
  },
  powerv2: {
    title: 'POWER V2',
    sections: [
      {
        lines: [
          'O POWER V2 é uma versão otimizada do sistema desenvolvido exclusivamente para operações com o ativo Ouro (XAU/USD). O software foi projetado para otimizar ganhos e proteger resultados de forma totalmente automática.',
          'Diferente dos sistemas convencionais, o POWER V2 utiliza um mecanismo inteligente de proteção dinâmica, que ajusta automaticamente o stop à medida que a operação evolui positivamente. Conforme o preço avança, o stop é movido para proteger o lucro já obtido, garantindo estabilidade e reduzindo a exposição ao risco.',
          'Essa tecnologia permite capturar movimentos expressivos do ouro sem comprometer a segurança e a consistência — fatores essenciais para resultados sólidos a longo prazo.',
        ],
      },
      {
        heading: 'Principais Características',
        lines: [
          'Operações automáticas no ativo Ouro (XAU/USD).',
          'Proteção automática de lucro (trailing stop inteligente).',
          'Ajuste dinâmico de stop conforme a evolução da operação.',
          'Sistema de gestão de risco integrado.',
          'Execuções instantâneas, sem necessidade de intervenção manual.',
          'Compatível com MetaTrader 4 e 5.',
        ],
      },
      {
        heading: 'Diferenciais',
        lines: [
          'Mantém o lucro protegido enquanto busca novas oportunidades.',
          'Ideal para quem busca consistência com controle total de risco.',
          'Estratégia adaptada ao comportamento técnico e volátil do ouro.',
          'Automatiza totalmente a parte operacional, técnica e emocional das execuções.',
        ],
      },
    ],
  },
  falconfx: {
    title: 'FALCON FX',
    sections: [
      {
        lines: [
          'O Falcon FX foi desenvolvido para operar de forma totalmente automática, com foco em precisão, agilidade e segurança nas execuções. O sistema atua de maneira inteligente na abertura de operações de compra, seguindo parâmetros definidos pelo usuário ou conforme a estratégia base configurada no software.',
          'Ao identificar uma oportunidade, o Falcon FX executa a ordem de compra de forma imediata, garantindo eficiência e eliminando atrasos comuns em processos manuais. Assim que a operação é iniciada, o sistema define automaticamente o stop loss diretamente no servidor, protegendo o capital configurado contra oscilações inesperadas. Essa proteção permanece ativa mesmo em casos de desconexão, queda de energia ou fechamento da plataforma.',
        ],
      },
      {
        heading: 'Principais Características',
        lines: [
          'Execução automática de operações de compra.',
          'Stop Loss configurado diretamente no servidor (proteção nativa).',
          'Execução instantânea e de alta precisão.',
          'Gestão de risco integrada para controle de perdas.',
          'Operações 100% automatizadas, sem necessidade de intervenção manual.',
        ],
      },
      {
        heading: 'Vantagens',
        lines: [
          'Elimina erros decorrentes de decisões emocionais.',
          'Protege cada operação desde o início.',
          'Ideal para quem busca consistência, disciplina e eficiência nas execuções.',
        ],
      },
      {
        heading: 'Recursos Avançados',
        lines: [
          'O Falcon FX incorpora um sistema de monitoramento dinâmico que otimiza a abertura e o encerramento das operações, adaptando-se às condições configuradas em tempo real. Essa abordagem permite maximizar o desempenho do software, mantendo estabilidade, segurança e resultados consistentes ao longo do tempo.',
        ],
      },
    ],
  },
}

export default function Cards() {
  const [open, setOpen] = useState<PackKey | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PACKS.map((p) => (
          <div key={p.key} className="rounded-2xl border border-zinc-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="w-full h-28 sm:h-32 md:h-36 lg:h-40 bg-zinc-50 flex items-center justify-center p-2 sm:p-3">
              <OptimizedImage src={p.img} alt={p.title} width={800} height={600} className="max-h-full max-w-[80%] object-contain" />
            </div>
            <div className="p-5">
              <h3 className="text-base font-semibold text-zinc-900">{p.title}</h3>
              <div className="mt-2 flex items-center gap-2 text-xs text-zinc-600">
                <span><span className="font-semibold text-zinc-900">823</span> reais/mês</span>
                <span className="text-zinc-300">•</span>
                <span>ou 12x <span className="font-semibold text-zinc-900">786</span> por ano</span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <button onClick={() => setOpen(p.key)} className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-black text-white hover:bg-black/90">
                  Saber mais
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(null)} />
          <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white shadow-2xl p-6 md:p-8 overflow-y-auto max-h-[80vh]">
            <h2 className="text-xl font-semibold text-zinc-900">{DETAILS[open].title}</h2>
            <div className="mt-4 space-y-4 text-zinc-800">
              {DETAILS[open].sections.map((sec, idx) => (
                <div key={idx}>
                  {sec.heading && <h3 className="text-sm font-semibold text-zinc-900">{sec.heading}</h3>}
                  <div className="mt-2 space-y-2">
                    {sec.lines.map((line, i) => (
                      <p key={i} className="text-sm leading-relaxed">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setOpen(null)} className="px-4 py-2 text-sm rounded-full border border-zinc-300 text-zinc-800 hover:bg-zinc-50">Fechar</button>
              <a href="#" className="px-4 py-2 text-sm rounded-full bg-black text-white hover:bg-black/90">Assinar</a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
