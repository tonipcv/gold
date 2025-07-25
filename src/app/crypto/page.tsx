'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { OptimizedImage } from '../components/OptimizedImage'
import { PandaPlayer } from '../components/PandaPlayer'
import { BottomNavigation } from '../../components/BottomNavigation'

export default function CryptoPage() {
  const videoId = '16716a7c-8f16-406e-855b-69ac686e2c9b'
  
  return (
    <div className="min-h-screen bg-black text-gray-200 font-satoshi tracking-[-0.03em]">
      {/* Header */}
      <header className="fixed top-0 w-full bg-black/90 backdrop-blur-sm z-50 px-4 py-3">
        <div className="flex justify-center lg:justify-start items-center">
          <Link href="/" className="flex items-center">
            <OptimizedImage src="/ft-icone.png" alt="Futuros Tech Logo" width={40} height={40} />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-14 pb-20">
        {/* Video Player Section */}
        <div className="bg-black">
          <div className="w-full md:w-1/2 lg:w-1/2 md:mx-auto lg:mx-auto bg-black pt-8">
            <PandaPlayer videoId={videoId} />
          </div>
          
          {/* Título e Descrição */}
          <div className="w-full md:w-1/2 lg:w-1/2 md:mx-auto lg:mx-auto mt-4 px-4">
            <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg border-l-4 border-[#5a96f4]">
              <h1 className="text-xl md:text-2xl font-bold mb-2 text-white">4 CRIPTOMOEDAS PARA COMPRAR EM MAIO</h1>
              <div className="flex items-center mb-4">
                <span className="bg-[#5a96f4]/20 text-[#5a96f4] text-xs px-2 py-0.5 rounded-full border border-[#5a96f4]/30">
                  ANÁLISE EXCLUSIVA
                </span>
                <span className="ml-2 text-xs text-gray-400">Futuros Tech Business</span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                Nesta aula exclusiva, apresentamos uma análise completa das 4 criptomoedas com maior potencial para o mês de maio. 
                Você vai descobrir quais são os melhores ativos para investir e por que eles podem valorizar nas próximas semanas.
              </p>
            </div>
          </div>
        </div>

        {/* Conteúdo adicional */}
        <div className="w-full md:w-1/2 lg:w-1/2 md:mx-auto lg:mx-auto mt-6">
          <div className="px-4">
            <section className="bg-gray-900/30 p-4 rounded-lg">
              <h2 className="text-lg font-bold mb-3 flex items-center">
                <span className="w-2 h-2 bg-[#5a96f4] rounded-full mr-2"></span>
                Sobre esta análise
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Esta análise exclusiva foi preparada pela equipe da Futuros Tech Business, com base em indicadores técnicos, 
                fundamentos de mercado e perspectivas de desenvolvimento dos projetos. Lembre-se que investimentos em criptomoedas 
                envolvem riscos e a decisão final de investimento deve ser tomada com cautela.
              </p>
              <div className="mt-4 p-3 bg-[#5a96f4]/10 border border-[#5a96f4]/20 rounded-lg">
                <p className="text-xs text-[#5a96f4]">
                  Conteúdo exclusivo para membros da Futuros Tech Business.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  )
} 