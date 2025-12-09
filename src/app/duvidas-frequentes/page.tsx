import Link from 'next/link'
import { OptimizedImage } from '@/app/components/OptimizedImage'
import FAQAccordionClient from './FAQAccordionClient'

export default function DuvidasFrequentesPage() {

  return (
    <div className="min-h-screen bg-black text-gray-200 font-satoshi tracking-[-0.03em]">
      <header className="fixed top-0 w-full bg-black/90 backdrop-blur-sm z-50 px-4 py-3">
        <div className="flex justify-center items-center max-w-7xl mx-auto">
          <Link href="/" className="flex items-center">
            <OptimizedImage src="/ft-icone.png" alt="Futuros Tech Logo" width={40} height={40} className="brightness-0 invert" />
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-20">
        <div className="w-full md:w-3/4 lg:w-3/4 md:mx-auto lg:mx-auto px-4 py-4">
          <h1 className="text-2xl md:text-[28px] font-semibold text-white tracking-tight mb-6">Dúvidas Frequentes (FAQ) – Uso do Software</h1>
          <FAQAccordionClient />
          <div className="mt-6 flex justify-center">
            <a
              href="https://test.k17.com.br/register"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold bg-green-600 hover:bg-green-500 text-white border border-green-500/60"
            >
              Criar conta
            </a>
          </div>
        </div>
      </main>

      <div className="px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          <p className="text-[11px] md:text-xs leading-relaxed text-gray-400 border-t border-white/10 pt-4">
            Este software não opera por você: todas as configurações de risco, stop e seleção de ativos são responsabilidade exclusiva do usuário. A Provedora não acessa sua conta, não executa ordens e não realiza qualquer gestão ou recomendação de investimento. O usuário reconhece que pode perder parte ou todo o capital investido e que exemplos de performance apresentados são meramente ilustrativos, não representando garantia de resultados futuros.
          </p>
        </div>
      </div>
    </div>
  )
}
