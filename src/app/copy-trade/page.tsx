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

export default function CopyTradePage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <CopyTradePageContent />
    </Suspense>
  )
}

// Componente interno que usa useSearchParams
function CopyTradePageContent() {
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
    fetch('/api/check-product-access?product=copytrade')
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

  const episodes: Episode[] = [
    // AULAS COPY TRADE
    {
      id: 1,
      title: "BEM-VINDO",
      description: "Bem-vindo ao curso de Copy Trading com BH. Nesta aula inicial, você conhecerá a estrutura completa do curso.",
      duration: "",
      videoId: "acd3b5c4-8536-485d-af5c-a32e1bcf1bfc",
      section: "COPY TRADE"
    },
    {
      id: 3,
      title: "COMO CRIAR CONTA NA BYBIT",
      description: "Aprenda o passo a passo para criar sua conta na corretora Bybit e começar a operar.",
      duration: "",
      videoId: "8954304a-73fc-4831-8e93-ec8da5694be8",
      section: "COPY TRADE"
    },
    {
      id: 4,
      title: "VALIDAÇÃO DE DOCUMENTOS",
      description: "Saiba como validar seus documentos na plataforma para garantir segurança e conformidade.",
      duration: "",
      videoId: "7c81a1df-a8ff-47ba-887c-94ab421d3ee1",
      section: "COPY TRADE"
    },
    {
      id: 5,
      title: "PRIMEIRO DEPÓSITO",
      description: "Guia completo para realizar seu primeiro depósito na plataforma de forma segura.",
      duration: "",
      videoId: "5ff10456-1d94-4d40-9081-5bf09b5e5259",
      section: "COPY TRADE"
    },
    {
      id: 6,
      title: "APRESENTANDO O GRÁFICO E FERRAMENTAS",
      description: "Conheça a interface do gráfico e as principais ferramentas para análise técnica.",
      duration: "",
      videoId: "a018e3cb-1ba1-4bc2-a7ae-e6d29ad25c3e",
      section: "COPY TRADE"
    },
    {
      id: 7,
      title: "OPERAÇÃO NA PRÁTICA",
      description: "Veja como realizar operações na prática, desde a análise até a execução.",
      duration: "",
      videoId: "7b6fd1c7-4feb-484a-b795-d10bdae1f12f",
      section: "COPY TRADE"
    },
    {
      id: 8,
      title: "SUPORTE E RESISTÊNCIA",
      description: "Aprenda a identificar e utilizar os níveis de suporte e resistência em suas operações.",
      duration: "",
      videoId: "42ddb13a-37c9-4ed4-8df1-58335272b1db",
      section: "COPY TRADE"
    },
    {
      id: 9,
      title: "TENDÊNCIAS DE ALTA E BAIXA",
      description: "Como identificar e operar em tendências de alta e baixa no mercado.",
      duration: "",
      videoId: "25c05dc8-3e0a-4cd0-a06a-8e1401f9ed3d",
      section: "COPY TRADE"
    },
    {
      id: 10,
      title: "MÉDIAS MÓVEIS (SMA E EMA)",
      description: "Entenda como utilizar as médias móveis simples e exponenciais em suas análises.",
      duration: "",
      videoId: "081375fa-1bdc-4686-9b55-a4dc2e0059c4",
      section: "COPY TRADE"
    },
    {
      id: 11,
      title: "VOLUME: COMO INTERPRETAR E USAR EM OPERAÇÕES",
      description: "Aprenda a interpretar o volume e utilizá-lo para melhorar suas operações.",
      duration: "",
      videoId: "53d6a881-b79f-47de-9026-974ef3d53564",
      section: "COPY TRADE"
    },
    {
      id: 12,
      title: "PULLBACK",
      description: "Entenda o conceito de pullback e como utilizá-lo para entradas mais precisas.",
      duration: "",
      videoId: "3af5f788-cee8-4cad-a283-77093135840c",
      section: "COPY TRADE"
    },
    {
      id: 13,
      title: "OPERAÇÕES CURTAS, OPERAÇÕES MAIS RÁPIDAS",
      description: "Estratégias para operações de curto prazo e day trade.",
      duration: "",
      videoId: "f388073e-c611-4069-875c-df478908b0f2",
      section: "COPY TRADE"
    },
    {
      id: 14,
      title: "OPERAÇÕES MAIS LONGAS",
      description: "Estratégias para operações de médio e longo prazo.",
      duration: "",
      videoId: "f1af6932-c2d5-47c6-9408-5d6773ee4219",
      section: "COPY TRADE"
    },
    {
      id: 15,
      title: "RSI (ÍNDICE DE FORÇA RELATIVA)",
      description: "Como utilizar o indicador RSI para identificar sobrecompra e sobrevenda.",
      duration: "",
      videoId: "68eae7f8-54f8-4665-9616-1f66d0ed2320",
      section: "COPY TRADE"
    },
    {
      id: 16,
      title: "FERRAMENTA DE REVERSÃO DE TENDÊNCIA",
      description: "Aprenda a identificar possíveis reversões de tendência no mercado.",
      duration: "",
      videoId: "00af2eaa-7ea0-403a-9e0b-b126f98f8eb0",
      section: "COPY TRADE"
    },
    {
      id: 17,
      title: "SMC (SMART MONEY CONCEPTS)",
      description: "Entenda os conceitos de Smart Money e como aplicá-los em suas operações.",
      duration: "",
      videoId: "8a68e8d7-c93a-4e66-bcc0-4b1d00c5838f",
      section: "COPY TRADE"
    },
    {
      id: 18,
      title: "ORDER BLOCK",
      description: "Aprenda a identificar e utilizar Order Blocks em suas operações.",
      duration: "",
      videoId: "3f825f38-d9df-40d8-bc4e-cfe78d98df50",
      section: "COPY TRADE"
    },
    {
      id: 19,
      title: "BOS (BREAK OF STRUCTURE)",
      description: "Entenda o conceito de Break of Structure e como utilizá-lo em suas análises.",
      duration: "",
      videoId: "d9d6347b-4f1e-42dc-8f6d-9c1e0f1021e8",
      section: "COPY TRADE"
    },
    {
      id: 20,
      title: "CHOCH (CHANGE OF CHARACTER)",
      description: "Aprenda a identificar mudanças de caráter no mercado para melhores entradas.",
      duration: "",
      videoId: "940f6966-758d-4a52-b398-4762a19db1aa",
      section: "COPY TRADE"
    },
    {
      id: 21,
      title: "FVG (FAIR VALUE GAP)",
      description: "Entenda o conceito de Fair Value Gap e como utilizá-lo em suas operações.",
      duration: "",
      videoId: "f7399bfe-dd34-49b5-ae94-66abaa37294a",
      section: "COPY TRADE"
    },
    {
      id: 22,
      title: "COMO OPERAR COM OMBRO-CABEÇA-OMBRO",
      description: "Aprenda a identificar e operar o padrão Ombro-Cabeça-Ombro.",
      duration: "",
      videoId: "e2da1c6a-be99-4f3b-8276-4b55db07aa3c",
      section: "COPY TRADE"
    },
    {
      id: 23,
      title: "TRIÂNGULO",
      description: "Como identificar e operar padrões de triângulo no gráfico.",
      duration: "",
      videoId: "a41fea0d-6f0d-411a-a2c9-ea461ca1a3c2",
      section: "COPY TRADE"
    },
    {
      id: 24,
      title: "CUNHA DE ALTA E BAIXA",
      description: "Aprenda a identificar e operar padrões de cunha de alta e baixa.",
      duration: "",
      videoId: "67bc0a8f-14fa-4138-82e5-c41c6c5b9f30",
      section: "COPY TRADE"
    },
    {
      id: 25,
      title: "INDICADOR VOLUME PROFILE",
      description: "Como utilizar o indicador Volume Profile para identificar áreas de interesse.",
      duration: "",
      videoId: "e143d26f-96f7-42af-89ca-395b155c1378",
      section: "COPY TRADE"
    },
    {
      id: 26,
      title: "COMO COPIAR AS OPERAÇÕES",
      description: "Guia passo a passo para configurar e copiar as operações dos traders experientes.",
      duration: "",
      videoId: "b52b06ef-e70b-4eb3-a31e-4ad89e0b110c",
      section: "COPY TRADE"
    },
    {
      id: 27,
      title: "GERENCIAMENTO BH",
      description: "Estratégias de gerenciamento de risco para operações com BH.",
      duration: "",
      videoId: "96eedd4e-a766-4fe3-813a-132fd7e04f80",
      section: "COPY TRADE"
    },
    {
      id: 28,
      title: "GERENCIAMENTO COPY TRADE",
      description: "Estratégias de gerenciamento de risco específicas para Copy Trading.",
      duration: "",
      videoId: "4b22d255-44d3-49e4-85d1-0eb02bcddeb1",
      section: "COPY TRADE"
    },
    {
      id: 29,
      title: "LIVE DE LIBERAÇÃO DO COPY",
      description: "Live especial com informações sobre a liberação do sistema de Copy Trading.",
      duration: "",
      videoId: "c09e66e4-447c-4509-abdc-e8fb3692c042",
      section: "COPY TRADE"
    }
  ]

  // Determinar o episódio ativo com base no parâmetro da URL ou usar o primeiro da lista
  const episodeParam = searchParams?.get('episode');
  const activeEpisode = episodeParam ? parseInt(episodeParam) : 1;
  
  const currentEpisode = episodes.find(ep => ep.id === activeEpisode)

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
        {activeEpisode && currentEpisode && (
          <div className="bg-black">
            <div className="w-full md:w-1/2 lg:w-1/2 md:mx-auto lg:mx-auto bg-black">
              <div className="w-full aspect-video rounded-lg">
                <PandaPlayer videoId={currentEpisode.videoId.toString()} />
              </div>
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
                    {section === 'COPY TRADE' ? 'COPY TRADING COM BH' : section}
                  </h3>
                  <div className="space-y-1">
                    {sectionEpisodes.map((episode) => (
                      <Link
                        key={episode.id}
                        href={`/copy-trade?episode=${episode.id}`}
                        className={`w-full flex items-center gap-2 lg:gap-3 p-2 rounded-lg transition-colors ${
                          activeEpisode === episode.id 
                            ? 'bg-gray-400/30 border-l-4 border-[#5a96f4]' 
                            : 'hover:bg-gray-800'
                        }`}
                      >
                        <PlayCircleIcon className="w-6 h-6 text-[#5a96f4] flex-shrink-0" />
                        <div className="flex-1 text-left">
                          <h4 className="font-semibold text-[#5a96f4] text-xs">
                            {`Aula ${episode.id}`}
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
