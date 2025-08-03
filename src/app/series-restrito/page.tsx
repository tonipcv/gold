'use client'

import Link from 'next/link'
import { PlayCircleIcon } from '@heroicons/react/24/outline'
import { OptimizedImage } from '../components/OptimizedImage'
import { Navigation } from '../components/Navigation'
import { PandaPlayer } from '../components/PandaPlayer'
import { BottomNavigation } from '../../components/BottomNavigation'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

interface Episode {
  id: number
  title: string
  description: string
  duration: string
  videoId: string
  section: string
}

// Componente interno que usa useSearchParams
function SeriesPageContent() {
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar acesso ao produto quando a sessão estiver carregada
    if (status === 'loading') return
    
    if (!session) {
      router.push('/api/auth/signin')
      return
    }

    // Verificar acesso ao produto
    fetch('/api/check-product-access?product=futurostech')
      .then(res => res.json())
      .then(data => {
        setHasAccess(data.hasAccess)
        setLoading(false)
      })
      .catch(err => {
        console.error('Erro ao verificar acesso:', err)
        setLoading(false)
      })
  }, [session, status, router])

  // Mostrar carregando enquanto verifica acesso
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  // Redirecionar se não tiver acesso
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
        <p className="mb-4">Você não tem acesso a este conteúdo.</p>
        <Link href="/produtos" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Ver Produtos Disponíveis
        </Link>
      </div>
    )
  }

  // Determinar episódio ativo com base no parâmetro da URL
  const episodeParam = searchParams?.get('episode')
  const activeEpisodeId = episodeParam 
    ? parseInt(episodeParam, 10) 
    : 1

  const episodes: Episode[] = [
    // AULAS FIP - Formação Investidor Profissional
    {
      id: 1,
      title: "BEM VINDO",
      description: "Bem-vindo à Formação Investidor Profissional. Nesta aula inicial, você conhecerá a estrutura completa do curso e como aproveitar ao máximo todo o conteúdo.",
      duration: "",
      videoId: "558152a1-90c5-4552-b98a-35fd559cf9fe",
      section: "FIP"
    },
    {
      id: 2,
      title: "CRONOGRAMA",
      description: "Conheça o cronograma completo das aulas e como organizar seus estudos para obter os melhores resultados na sua formação como investidor profissional.",
      duration: "",
      videoId: "a393bcfb-b27e-4c37-91b2-f6eec8f4a5fd",
      section: "FIP"
    },
    {
      id: 3,
      title: "CADASTRANDO NA PLATAFORMA",
      description: "Aprenda o passo a passo completo para se cadastrar na plataforma de trading e começar a operar de forma profissional.",
      duration: "",
      videoId: "d7c6eb78-755c-487a-af6a-da788c4dcd40",
      section: "FIP"
    },
    {
      id: 4,
      title: "DEPOSITAR E SACAR",
      description: "Entenda como fazer depósitos e saques na plataforma de forma segura e eficiente, conhecendo todas as opções disponíveis.",
      duration: "",
      videoId: "640887b2-4ad7-4753-aecf-f14eb5b31b2a",
      section: "FIP"
    },
    {
      id: 5,
      title: "INFORMAÇÕES DE ORDEM",
      description: "Domine as informações essenciais sobre ordens de compra e venda, tipos de ordem e como executá-las corretamente.",
      duration: "",
      videoId: "6499b129-6385-4a95-a6e4-6a67d6ac71bf",
      section: "FIP"
    },
    {
      id: 6,
      title: "ALAVANCAGEM",
      description: "Compreenda o conceito de alavancagem, seus riscos e benefícios, e como utilizá-la de forma inteligente em suas operações.",
      duration: "",
      videoId: "e3134edf-2cc1-40ac-9524-4e72a5679305",
      section: "FIP"
    },
    {
      id: 7,
      title: "TP - STPS - MARGEM",
      description: "Aprenda sobre Take Profit, Stop Loss e gerenciamento de margem para proteger seu capital e maximizar seus lucros.",
      duration: "",
      videoId: "546b9cee-079d-417f-96f4-1ade4c57335e",
      section: "FIP"
    },
    {
      id: 8,
      title: "Utilizando o Celular para TP, SL e Margem",
      description: "Tutorial completo sobre como configurar Take Profit, Stop Loss e gerenciar margem usando apenas seu smartphone.",
      duration: "",
      videoId: "a2965bc0-9071-4ef5-89ab-c28b40b786ea",
      section: "FIP"
    },
    {
      id: 9,
      title: "INTRODUÇÃO À ANÁLISE GRÁFICA",
      description: "Fundamentos da análise técnica e como interpretar gráficos para tomar decisões de investimento mais assertivas.",
      duration: "",
      videoId: "04018176-ac80-47c3-9d45-a3d2c03c8fce",
      section: "FIP"
    },
    {
      id: 10,
      title: "TRADINGVIEW",
      description: "Como utilizar a plataforma TradingView para análise técnica profissional, configurações e principais ferramentas.",
      duration: "30:00",
      videoId: "ae8c01fb-f79b-40f6-ae4f-542d975422c6",
      section: "FIP"
    },
    {
      id: 11,
      title: "PROJEÇÃO DE FIBONACCI",
      description: "Domine a ferramenta de Fibonacci para identificar níveis de suporte, resistência e projeções de preço.",
      duration: "28:00",
      videoId: "70f33259-b152-4f13-922e-c147b69a1b23",
      section: "FIP"
    },
    {
      id: 12,
      title: "SITES PARA ANALISAR",
      description: "Conheça os melhores sites e ferramentas para análise de mercado e acompanhamento de ativos financeiros.",
      duration: "14:00",
      videoId: "b09494d9-a15e-4411-a77b-a4009038d74f",
      section: "FIP"
    },
    {
      id: 13,
      title: "SMC",
      description: "Smart Money Concepts - Aprenda como o dinheiro inteligente se move no mercado e como seguir essas movimentações.",
      duration: "35:00",
      videoId: "4e7966cb-e192-48f6-b07d-35f94f587e28",
      section: "FIP"
    },
    {
      id: 14,
      title: "BOS",
      description: "Break of Structure - Entenda como identificar quebras de estrutura para antecipar movimentos de preço.",
      duration: "24:00",
      videoId: "4e97ed20-adb3-44a8-8e8f-70e55eaefc48",
      section: "FIP"
    },
    {
      id: 15,
      title: "CHOCH",
      description: "Change of Character - Aprenda a identificar mudanças no caráter do mercado para timing perfeito de entrada.",
      duration: "26:00",
      videoId: "9d41e2c3-2a96-427c-993e-458660036f3c",
      section: "FIP"
    },
    {
      id: 16,
      title: "TEORIA DE DOW",
      description: "Fundamentos da Teoria de Dow e como aplicar seus princípios na análise de tendências do mercado.",
      duration: "32:00",
      videoId: "8840a5d9-4e8c-426c-8b9c-b41fbbd12fa2",
      section: "FIP"
    },
    {
      id: 17,
      title: "ONDAS DE ELLIOTT",
      description: "Teoria das Ondas de Elliott para identificar padrões de movimento do mercado e projetar futuros movimentos.",
      duration: "40:00",
      videoId: "b57b3bd4-5388-49a9-a951-5333920ad592",
      section: "FIP"
    },
    {
      id: 18,
      title: "TEORIA DE WYCKOFF",
      description: "Método Wyckoff para entender a psicologia do mercado e identificar acumulação e distribuição.",
      duration: "38:00",
      videoId: "e7aa84fa-ee4c-4581-8213-8d1f43bce6a6",
      section: "FIP"
    },
    {
      id: 19,
      title: "CONFLUÊNCIA NA ANÁLISE GRÁFICA",
      description: "Como combinar diferentes indicadores e análises para aumentar a precisão de suas operações.",
      duration: "30:00",
      videoId: "4f4f7277-be5c-47ff-80c9-891ffb51e64f",
      section: "FIP"
    },
    {
      id: 20,
      title: "OPERANDO TODO DUPLO",
      description: "Estratégia avançada de operação com topo duplo para maximizar lucros em reversões de tendência.",
      duration: "27:00",
      videoId: "2d115d80-6214-457c-a561-1768ac457079",
      section: "FIP"
    },
    {
      id: 21,
      title: "COMO OPERAR COM O.C.O",
      description: "One Cancels Other - Aprenda a usar ordens OCO para automatizar suas estratégias de trading.",
      duration: "",
      videoId: "901cc088-469a-4ba6-8a18-10c395de32a4",
      section: "FIP"
    },
    {
      id: 22,
      title: "COMO OPERAR COM ONDAS DE ELLIOTT",
      description: "Aplicação prática da Teoria das Ondas de Elliott em operações reais do mercado.",
      duration: "33:00",
      videoId: "878cb42a-72f0-47db-aa72-15030e5efb9b",
      section: "FIP"
    },
    {
      id: 23,
      title: "CONFLUÊNCIA DE RSI",
      description: "Como usar o RSI em confluência com outras análises para encontrar pontos de entrada precisos.",
      duration: "21:00",
      videoId: "306fbd96-3f01-4968-9bf1-638a24c79256",
      section: "FIP"
    },
    {
      id: 24,
      title: "ROMPIMENTO DE TRIÂNGULO + FIBONACCI",
      description: "Estratégia combinada de rompimento de triângulo com projeções de Fibonacci para trades de alta probabilidade.",
      duration: "29:00",
      videoId: "88f9378c-dcc6-495e-9b0e-9e2ed8ff5548",
      section: "FIP"
    },
    {
      id: 25,
      title: "COMO IDENTIFICAR OS CICLOS DO MERCADO",
      description: "Aprenda a identificar e aproveitar os diferentes ciclos do mercado para otimizar seus investimentos.",
      duration: "36:00",
      videoId: "b1efba80-f791-4fcd-8ada-e26e6962dbae",
      section: "FIP"
    },
    {
      id: 26,
      title: "CONSOLIDAÇÃO DO MERCADO",
      description: "Como identificar períodos de consolidação e posicionar-se para os próximos movimentos direcionais.",
      duration: "23:00",
      videoId: "8e6554be-e47e-4975-b585-42fc30b2c918",
      section: "FIP"
    },
    {
      id: 27,
      title: "COMO NÃO FICAR DE FORA DAS ESTICADAS",
      description: "Estratégias para não perder grandes movimentos do mercado e aproveitar extensões de tendência.",
      duration: "",
      videoId: "52b15efc-d62c-4c28-bda8-e0c7eec53f12",
      section: "FIP"
    },
    {
      id: 28,
      title: "COMO ENCONTRAR ATIVOS PARA OPERAR",
      description: "Metodologia para screening e seleção dos melhores ativos para suas operações diárias.",
      duration: "31:00",
      videoId: "d91937a5-87f5-46dd-8915-e3042b1ec60d",
      section: "FIP"
    },
    {
      id: 29,
      title: "QUANDO FICAR DE FORA",
      description: "Aprenda a identificar momentos em que é melhor não operar e preservar seu capital.",
      duration: "19:00",
      videoId: "5aefd7ab-3c1f-4c37-83ec-64c7eb28cf80",
      section: "FIP"
    },
    {
      id: 30,
      title: "ANALISANDO ATIVOS",
      description: "Análise completa de ativos: desde a seleção até a execução da operação com gestão de risco.",
      duration: "42:00",
      videoId: "f01c3aef-1032-4812-83f1-95e1f25e1f7a",
      section: "FIP"
    },
    // AULAS BLACKBOOK
    {
      id: 31,
      title: "BLACKBOOK",
      description: "Conteúdo exclusivo do BlackBook com estratégias avançadas e técnicas profissionais de trading.",
      duration: "45:00",
      videoId: "32dd9bf0-7003-4e92-895a-a35f98dcd4a2",
      section: "BLACKBOOK"
    },
    // AULAS FUTUROS TECH
    {
      id: 32,
      title: "Futuros Tech Sinais",
      description: "Como utilizar os sinais do Futuros Tech para maximizar seus resultados no mercado de criptomoedas.",
      duration: "",
      videoId: "35186692-adde-4280-819f-e35af9ece710",
      section: "FUTUROS TECH"
    },
    {
      id: 33,
      title: "Como usar o APP",
      description: "Tutorial completo sobre como utilizar o aplicativo Futuros Tech para acompanhar sinais e análises.",
      duration: "",
      videoId: "c3a2d1bf-0e47-44cd-b361-937ea9f0242b",
      section: "FUTUROS TECH"
    },
    {
      id: 34,
      title: "Alavancagem Futuros Tech",
      description: "Como utilizar alavancagem de forma inteligente seguindo as estratégias do Futuros Tech.",
      duration: "",
      videoId: "5cdfb2bc-df6a-4ae0-a2d5-2aded0f5a295",
      section: "FUTUROS TECH"
    },
    // AULAS BÔNUS SECRETO
    {
      id: 35,
      title: "BÔNUS SECRETO",
      description: "Conteúdo bônus exclusivo com estratégias secretas e técnicas avançadas não reveladas em outros cursos.",
      duration: "50:00",
      videoId: "c2cda031-0370-4851-9ba9-2d32def8c8cd",
      section: "BÔNUS SECRETO"
    }
  ]

  const currentEpisode = episodes.find(ep => ep.id === activeEpisodeId)

  // Group episodes by section
  const groupedEpisodes = episodes.reduce((acc, episode) => {
    if (!acc[episode.section]) {
      acc[episode.section] = []
    }
    acc[episode.section].push(episode)
    return acc
  }, {} as Record<string, Episode[]>)

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
        {activeEpisodeId && currentEpisode && (
          <div className="bg-black">
            <div className="w-full md:w-1/2 lg:w-1/2 md:mx-auto lg:mx-auto bg-black">
              <PandaPlayer videoId={currentEpisode.videoId} />
            </div>
            <div className="px-6 py-4 bg-black md:w-1/2 lg:w-1/2 md:mx-auto lg:mx-auto">
              <div className="flex items-center mb-2">
                <span className="bg-[#5a96f4]/20 text-[#5a96f4] text-xs px-2 py-0.5 rounded-full border border-[#5a96f4]/30 mr-2">
                  {currentEpisode.section}
                </span>
                <span className="text-xs text-gray-400">{currentEpisode.duration}</span>
              </div>
              <h2 className="text-xl font-bold">{currentEpisode.title}</h2>
              <p className="text-sm text-gray-400 mt-2">{currentEpisode.description}</p>
            </div>
          </div>
        )}

        {/* Episodes List */}
        <div className="w-full md:w-1/2 lg:w-1/2 md:mx-auto lg:mx-auto">
          <div className="md:h-[calc(100vh-11rem)] lg:h-[calc(100vh-11rem)] md:overflow-y-auto lg:overflow-y-auto px-4 pb-2 md:p-4 lg:p-4">
            <h2 className="text-lg font-bold mb-2 lg:mb-3">Aulas Disponíveis</h2>
            <div className="space-y-4">
              {Object.entries(groupedEpisodes).map(([section, sectionEpisodes]) => (
                <div key={section}>
                  <h3 className="text-md font-semibold text-[#5a96f4] mb-2 border-b border-gray-700 pb-1">
                    {section === 'FIP' ? 'FORMAÇÃO INVESTIDOR PROFISSIONAL' : 
                     section === 'BLACKBOOK' ? 'AULAS BLACKBOOK' :
                     section === 'FUTUROS TECH' ? 'AULAS FUTUROS TECH' :
                     section === 'BÔNUS SECRETO' ? 'AULAS BÔNUS SECRETO' : section}
                  </h3>
                  <div className="space-y-1">
                    {sectionEpisodes.map((episode) => (
                      <Link
                        key={episode.id}
                        href={`/series-restrito?episode=${episode.id}`}
                        className={`w-full flex items-center gap-2 lg:gap-3 p-2 rounded-lg transition-colors ${
                          activeEpisodeId === episode.id 
                            ? 'bg-gray-400/30 border-l-4 border-[#5a96f4]' 
                            : 'hover:bg-gray-800'
                        }`}
                      >
                        <PlayCircleIcon className="w-6 h-6 text-[#5a96f4] flex-shrink-0" />
                        <div className="flex-1 text-left">
                          <h4 className="font-semibold text-[#5a96f4] text-xs">
                            {section === 'FIP' ? `Aula ${episode.id}` : episode.section}
                          </h4>
                          <p className="text-xs text-gray-200 line-clamp-2">{episode.title}</p>
                          <p className="text-xs text-gray-400">{episode.duration}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Navigation />
    </div>
  )
}

// Componente principal envolvido em Suspense
export default function SeriesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center"><p>Carregando...</p></div>}>
      <SeriesPageContent />
    </Suspense>
  )
} 