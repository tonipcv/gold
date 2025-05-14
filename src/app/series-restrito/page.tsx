/* eslint-disable @typescript-eslint/no-unused-vars */

'use client'

import Link from 'next/link'
import { useState } from 'react'
import { DocumentArrowDownIcon, BookOpenIcon, PlayCircleIcon } from '@heroicons/react/24/outline'
import { OptimizedImage } from '../components/OptimizedImage'
import { Navigation } from '../components/Navigation'
import { PandaPlayer } from '../components/PandaPlayer'
import { BottomNavigation } from '../../components/BottomNavigation'

interface Episode {
  id: number
  title: string
  description: string
  duration: string
  thumbnail: string
  number: number
  videoId: string
}

export default function SeriesPage() {
  const [activeEpisode, setActiveEpisode] = useState<number | null>(1)

  const episodes: Episode[] = [
    {
      id: 1,
      title: "Inicialização no Futuros Tech Business?",
      description: "Descubra por que ser parceiro do FuturosTech pode ser a forma mais inteligente de aumentar sua banca e começar a gerar uma renda extra com o mercado de criptoativos. Nesta aula, você entende o papel estratégico do programa e como isso impacta diretamente sua liberdade financeira.",
      duration: "10:00",
      thumbnail: "",
      number: 1,
      videoId: "c5dbb724-cf4f-44c5-847a-df1a60524e05"
    },
    {
      id: 2,
      title: "Como funciona o programa de Business na prática",
      description: "Conheça os dois níveis do programa (VIP e Super VIP), quais comissões você pode receber, e quais os benefícios reais que cada parceiro tem acesso. Tudo explicado de forma clara, com números reais e exemplos práticos.",
      duration: "12:00",
      thumbnail: "",
      number: 2,
      videoId: "80272c83-624b-4505-9c3a-610568a9bbf8"
    },
    {
      id: 3,
      title: "Como se cadastrar e pedir a afiliação na Hotmart",
      description: "Passo a passo simples e direto para criar sua conta na Hotmart, solicitar sua afiliação ao produto e preencher o formulário de forma correta.",
      duration: "15:00",
      thumbnail: "",
      number: 3,
      videoId: "d8deced3-9055-4b0e-b5f8-cc34e6327c58"
    },
    {
      id: 4,
      title: "Como ser aprovado e desbloquear seus ganhos",
      description: "Saiba quais são os critérios para aprovação como parceiro, o que pode te reprovar e como garantir que você comece a receber suas comissões de forma correta e segura.",
      duration: "8:00",
      thumbnail: "",
      number: 4,
      videoId: "a0bbe1ce-bccc-4bda-b7a7-38dab797b072"
    },
    {
      id: 5,
      title: "Como fazer suas primeiras vendas com amigos e contatos próximos",
      description: "Descubra como gerar suas primeiras vendas usando apenas o seu celular e seu círculo de contatos. Com o link certo, cupom de desconto e uma abordagem simples, você já pode começar a ganhar hoje.",
      duration: "20:00",
      thumbnail: "",
      number: 5,
      videoId: "21a9132e-1edb-4f95-8bc8-38f3a617ac9e"
    },
    {
      id: 6,
      title: "Estratégias para atrair pessoas novas com autoridade e conteúdo",
      description: "Aprenda a divulgar de forma natural no seu próprio Instagram, como gerar interesse real com resultados, e como usar os conteúdos prontos do drive para atrair leads sem parecer vendedor.",
      duration: "18:00",
      thumbnail: "",
      number: 6,
      videoId: "f4b87324-297b-4036-ade1-a1eb69e15e6b"
    },
    {
      id: 7,
      title: "Como virar Super VIP e aumentar seus ganhos",
      description: "Veja o que muda quando você bate 10 vendas no mês: comissões maiores, grupo fechado, bônus, viagens e reconhecimento. Aqui você entende por que o Super VIP é o verdadeiro sócio do projeto.",
      duration: "15:00",
      thumbnail: "",
      number: 7,
      videoId: "917acb9f-62ad-4310-858a-4e6b772ce0c5"
    }
  ]

  const currentEpisode = episodes.find(ep => ep.id === activeEpisode)

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
        {/* Hero Section */}
        {!activeEpisode && (
          <div className="relative bg-black h-48 md:h-32 lg:h-32 flex items-center">
            <div className="w-full md:w-1/2 lg:w-1/2 md:mx-auto lg:mx-auto">
              <div className="px-6 py-8 md:py-4 lg:py-4">
                <h1 className="text-2xl font-bold mb-3 md:mb-1 lg:mb-1">Programa de Parceiros</h1>
                <p className="text-sm text-gray-300">Aprenda como se tornar um parceiro oficial e começar a lucrar com o mercado de criptoativos</p>
              </div>
            </div>
          </div>
        )}

        {/* Video Player Section */}
        {activeEpisode && currentEpisode && (
          <div className="bg-black">
            <div className="w-full md:w-1/2 lg:w-1/2 md:mx-auto lg:mx-auto bg-black">
              <PandaPlayer videoId={currentEpisode.videoId} />
            </div>
            <div className="px-6 py-4 bg-black md:w-1/2 lg:w-1/2 md:mx-auto lg:mx-auto">
              <h2 className="text-xl font-bold">{currentEpisode.title}</h2>
              <p className="text-sm text-gray-400 mt-2">{currentEpisode.description}</p>
            </div>
          </div>
        )}

        {/* Episodes List and Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 md:w-1/2 lg:w-1/2 md:mx-auto lg:mx-auto gap-0">
          {/* Episodes List */}
          <div className="md:h-[calc(100vh-11rem)] lg:h-[calc(100vh-11rem)] md:overflow-y-auto lg:overflow-y-auto px-4 pb-2 md:p-4 lg:p-4">
            <h2 className="text-lg font-bold mb-2 lg:mb-3">Aulas Disponíveis</h2>
            <div className="space-y-1 lg:space-y-2">
              {episodes.map((episode) => (
                <button
                  key={episode.id}
                  onClick={() => setActiveEpisode(episode.id)}
                  className={`w-full flex items-center gap-2 lg:gap-3 p-2 rounded-lg transition-colors ${
                    activeEpisode === episode.id 
                      ? 'bg-gray-400/30 border-l-4 border-[#5a96f4]' 
                      : 'hover:bg-gray-800'
                  }`}
                >
                  <PlayCircleIcon className="w-8 h-8 text-[#5a96f4]" />
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-[#5a96f4] text-sm">Aula {episode.number}</h3>
                    <p className="text-xs text-gray-200">{episode.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{episode.duration}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content and Materials */}
          <div className="space-y-3 md:space-y-4 lg:space-y-4 px-4 md:p-4 lg:p-4">
            <section className="bg-gray-900/50 backdrop-blur-sm p-3 lg:p-4 rounded-lg">
              <h2 className="text-lg font-bold mb-3">Programa de Parceiros:</h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Aprenda como se tornar um parceiro oficial e começar a lucrar com o mercado de criptoativos. Siga o passo a passo e comece a gerar renda extra hoje mesmo.
              </p>
              <div className="mt-3 p-3 bg-[#5a96f4]/10 border border-[#5a96f4]/50 rounded-lg">
                <p className="text-xs text-[#5a96f4]">
                  Este é um treinamento exclusivo para parceiros oficiais.
                </p>
              </div>
            </section>

            <section className="bg-gray-900/50 p-4 rounded-lg">
              <h2 className="text-lg font-bold mb-3">Solicite entrar no grupo</h2>
              <p className="text-sm text-gray-300 mb-4">
                Torne-se um parceiro VIP e tenha acesso a benefícios exclusivos, comissões maiores e suporte dedicado.
              </p>
              <a 
                href="https://ai.k17.com.br/parceiro"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center px-4 py-2.5 border border-[#5a96f4] text-[#5a96f4] text-sm font-medium rounded-lg hover:bg-[#5a96f4] hover:text-black transition-all duration-200"
              >
                Quero ser VIP
              </a>
            </section>
          </div>
        </div>
      </main>

      <Navigation />
    </div>
  )
} 