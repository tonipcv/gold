'use client'

import { useState } from 'react'

type Item = { q: string; a: string }

const items: Item[] = [
  {
    q: '1. O que é o Software?',
    a: 'É uma ferramenta tecnológica que permite ao Usuário automatizar estratégias de operações com ativos financeiros e/ou digitais. Todas as configurações, ativações, parâmetros e decisões são feitas exclusivamente pelo Usuário.'
  },
  {
    q: '2. O Software envia ordens ou faz operações por conta própria?',
    a: 'Não. O Software não opera automaticamente sem intervenção do Usuário. Tudo depende de ativação, configuração e escolha do Usuário.'
  },
  {
    q: '3. O Software é uma recomendação de investimento?',
    a: 'Não. O Software não recomenda, não analisa, não indica ativos, não assessora e não garante resultados. Ele apenas executa a estratégia que o próprio Usuário decide e configura.'
  },
  {
    q: '4. A empresa tem acesso à minha conta na corretora?',
    a: 'Não. A empresa não acessa, não gerencia, não movimenta e não interfere na conta do Usuário em nenhuma corretora.'
  },
  {
    q: '5. Os resultados das operações são garantidos?',
    a: 'Não. Mercados financeiros envolvem volatilidade e riscos significativos. O Usuário assume total responsabilidade por suas configurações e decisões.'
  },
  {
    q: '6. Posso usar o Software no celular?',
    a: 'Sim. A conexão pode ser feita por ferramentas de terceiros (como copy trade), dependendo da corretora escolhida pelo Usuário. A empresa não controla essas ferramentas.'
  },
  {
    q: '7. Quem é responsável pelas configurações de risco?',
    a: 'O próprio Usuário. É ele quem define: volume; limites; travas; stop loss; ativos utilizados; ativação e desativação da automação.'
  },
  {
    q: '8. O que acontece se eu não configurar corretamente?',
    a: 'Configurações inadequadas podem resultar em perdas financeiras, total ou parcial. A responsabilidade é 100% do Usuário.'
  },
  {
    q: '9. A empresa garante estabilidade de terceiros, como corretoras ou apps externos?',
    a: 'Não. Falhas, instabilidades, bloqueios, indisponibilidades ou problemas externos não são responsabilidade da empresa.'
  },
  {
    q: '10. Minhas informações são usadas de forma segura?',
    a: 'Sim. Os dados são tratados de acordo com a legislação vigente e utilizados apenas para identificação, suporte e comunicação.'
  },
  {
    q: '11. O acesso pode ser bloqueado?',
    a: 'Sim, em casos como: comportamento inadequado; tentativa de compartilhamento de acesso; uso indevido; atividades suspeitas.'
  },
  {
    q: '12. O Software é vitalício?',
    a: 'Não. O acesso é por período determinado, conforme o plano contratado, podendo ser renovado conforme disponibilidade.'
  },
  {
    q: '13. Posso solicitar reembolso?',
    a: 'O Usuário deve verificar a política da plataforma onde realizou a compra. Reembolsos seguem exclusivamente as regras da plataforma e da legislação aplicável.'
  },
  {
    q: '14. A empresa monitora minhas operações?',
    a: 'Não. A empresa não acompanha, não avalia, não fiscaliza nem monitora objetivos, perfil de risco ou resultados do Usuário.'
  },
  {
    q: '15. Posso compartilhar conteúdos do Software?',
    a: 'Não. Todo conteúdo fornecido — visual, textual, técnico ou educacional — é protegido por direitos autorais e não pode ser distribuído ou copiado.'
  }
]

export default function FAQAccordionClient() {
  const [open, setOpen] = useState<number | null>(null)
  const toggle = (idx: number) => setOpen((prev) => (prev === idx ? null : idx))

  return (
    <div className="divide-y divide-white/10 rounded-lg border border-white/10 bg-white/5">
      {items.map((item, idx) => {
        const expanded = open === idx
        return (
          <div key={idx}>
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={`faq-panel-${idx}`}
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-white/5"
            >
              <span className="font-semibold text-white text-sm md:text-base">{item.q}</span>
              <span className={`transition-transform text-gray-300 ${expanded ? 'rotate-180' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M12 14.25a.75.75 0 0 1-.53-.22l-5-5a.75.75 0 1 1 1.06-1.06L12 12.44l4.47-4.47a.75.75 0 0 1 1.06 1.06l-5 5a.75.75 0 0 1-.53.22Z" clipRule="evenodd" />
                </svg>
              </span>
            </button>
            <div
              id={`faq-panel-${idx}`}
              className={`px-4 overflow-hidden transition-[max-height] duration-300 ${expanded ? 'max-h-96 py-2' : 'max-h-0'}`}
            >
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">{item.a}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
