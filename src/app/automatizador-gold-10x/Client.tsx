/* eslint-disable */

'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'

// ConverteAI vturb player component (SSR-safe): render placeholder and init on client
function VturbPlayer({ playerId, accountId = '32ff2495-c71e-49ba-811b-00b5b49c517f' }: { playerId: string; accountId?: string }) {
  const containerId = `vturb-container-${playerId}`
  
  useEffect(() => {
    if (typeof window === 'undefined') return
    const container = document.getElementById(containerId)
    if (!container) return

    // Reset container and inject custom element
    container.innerHTML = ''
    const playerEl = document.createElement('vturb-smartplayer') as any
    playerEl.id = `vid-${playerId}`
    ;(playerEl as HTMLElement).style.display = 'block'
    ;(playerEl as HTMLElement).style.margin = '0 auto'
    ;(playerEl as HTMLElement).style.width = '100%'
    container.appendChild(playerEl)

    // Remove previous scripts for this playerId
    try {
      const prev = Array.from(document.querySelectorAll(`script[data-vturb-player="${playerId}"]`))
      prev.forEach((n) => n.parentElement?.removeChild(n))
    } catch {}

    // Inject script (re-executes even if cached)
    const s = document.createElement('script')
    s.src = `https://scripts.converteai.net/${accountId}/players/${playerId}/v4/player.js`
    s.async = true
    s.setAttribute('data-vturb-player', playerId)
    document.head.appendChild(s)

    return () => {
      try { document.head.removeChild(s) } catch {}
      try { container.innerHTML = '' } catch {}
    }
  }, [playerId, containerId])

  return <div id={containerId} className="w-full" />
}

interface Episode {
  id: number
  number: number
  title: string
  playerId: string
  duration?: string
  linkYouTube?: string
  locked?: boolean
  accountId?: string
}

export default function AutomatizadorGold10xClient() {
  const [activeEpisode, setActiveEpisode] = useState<number>(1)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 })
  const [aula1CtaVisible, setAula1CtaVisible] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const { data: session } = useSession()
  const isPremium = session?.user?.isPremium || false
  const searchParams = useSearchParams()
  const aulaParam = searchParams?.get('aula') ?? null

  // Referral form state (AULA 16)
  const [name, setName] = useState('')
  const [purchaseEmail, setPurchaseEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [friendsCount, setFriendsCount] = useState<number>(1)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const benefitLabel = useMemo(() => {
    const months = friendsCount * 2
    const amigoLabel = friendsCount === 1 ? '1 amigo' : `${friendsCount} amigos`
    return `${amigoLabel} - até ${months} meses grátis`
  }, [friendsCount])

  const handleSubmitReferral = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSuccess(null)
    setError(null)
    try {
      const res = await fetch('/api/referral-bonus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, purchaseEmail, whatsapp, friendsCount }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Falha ao enviar. Tente novamente.')
      }
      setSuccess('Solicitação enviada com sucesso! Redirecionando para o WhatsApp...')
      try {
        const phone = '5511958072826'
        const text = encodeURIComponent('Olá, quero o código de indicacao para ganhar os meses bônus!')
        window.location.href = `https://wa.me/${phone}?text=${text}`
      } catch {}
      setName('')
      setPurchaseEmail('')
      setWhatsapp('')
      setFriendsCount(1)
    } catch (err: any) {
      setError(err?.message || 'Erro inesperado')
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    // Countdown to 08 Sep 2025 19:00 (UTC-3)
    const target = new Date('2025-09-08T19:00:00-03:00').getTime()
    const tick = () => {
      const now = Date.now()
      const diff = Math.max(0, target - now)
      const d = Math.floor(diff / (1000 * 60 * 60 * 24))
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const s = Math.floor((diff % (1000 * 60)) / 1000)
      setTimeLeft({ d, h, m, s })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // Definir quais episódios estão bloqueados com base no status premium do usuário
  const episodes: Episode[] = [
    { id: 0,  number: 0,  title: 'AVISO MUITO IMPORTANTE',                                               playerId: '', linkYouTube: 'https://player-vz-7b6cf9e4-8bf.tv.pandavideo.com.br/embed/?v=c79b5e01-58e6-413c-8451-f3cb792fb6b5' },
    { id: 1,  number: 1,  title: 'CORRETORA',                                                            playerId: '', linkYouTube: 'https://player-vz-7b6cf9e4-8bf.tv.pandavideo.com.br/embed/?v=5d155e09-3f0e-46ec-9b3a-f265f356399e' },
    { id: 2,  number: 2,  title: 'INSTALANDO ESTRATÉGIA',                                                playerId: '', linkYouTube: 'https://player-vz-7b6cf9e4-8bf.tv.pandavideo.com.br/embed/?v=a25ab8a3-1277-4c62-9ee0-5a346eee0230' },
    { id: 3,  number: 3,  title: 'ESTRATÉGIA NOVA - GOLD X',                                             playerId: '', linkYouTube: 'https://youtu.be/6lI-yyCvblQ' },
    { id: 4,  number: 4,  title: 'ATIVANDO VPS',                                                         playerId: '', linkYouTube: 'https://player-vz-7b6cf9e4-8bf.tv.pandavideo.com.br/embed/?v=f907a720-2027-4572-bbb8-fec0719853fa' },
    { id: 5,  number: 5,  title: 'RELATÓRIO ESTRATÉGIA',                                                 playerId: '', linkYouTube: 'https://player-vz-7b6cf9e4-8bf.tv.pandavideo.com.br/embed/?v=ce792cee-c443-474e-9243-9c22036681de' },
    { id: 6,  number: 6,  title: 'GERENCIAMENTO',                                                        playerId: '', linkYouTube: 'https://player-vz-7b6cf9e4-8bf.tv.pandavideo.com.br/embed/?v=93523669-fc2c-48d3-9acc-3ba44f6c004d' },
    { id: 7,  number: 7,  title: 'STANDARD PARA CENT',                                                   playerId: '', linkYouTube: 'https://player-vz-7b6cf9e4-8bf.tv.pandavideo.com.br/embed/?v=a473eb20-3980-45fc-96b9-3900fb93bf33' },
    { id: 8,  number: 8,  title: 'VPS GRATIS',                                                           playerId: '', linkYouTube: 'https://player-vz-7b6cf9e4-8bf.tv.pandavideo.com.br/embed/?v=871a6c24-eec6-42dc-80a0-39917d630607' },
    { id: 9,  number: 9,  title: 'NAO FAÇA ISSO',                                                        playerId: '', linkYouTube: 'https://player-vz-7b6cf9e4-8bf.tv.pandavideo.com.br/embed/?v=9e54e191-b306-4608-8cdb-a463c2267036' },
    { id: 10, number: 10, title: 'COMO FUNCIONA A ESTRATEGIA',                                           playerId: '', linkYouTube: 'https://player-vz-7b6cf9e4-8bf.tv.pandavideo.com.br/embed/?v=b68fa2d3-6d23-4828-9595-961d7eedcfd1' },
    { id: 11, number: 11, title: 'HORARIO DE FUNCIONAMENTO',                                             playerId: '', linkYouTube: 'https://player-vz-7b6cf9e4-8bf.tv.pandavideo.com.br/embed/?v=43328382-6f35-4da1-9b4c-ddae576cf7a4' },
    { id: 12, number: 12, title: 'FORMULARIO - LIBERAÇÃO OFICIAL',                                       playerId: '', linkYouTube: 'https://player-vz-7b6cf9e4-8bf.tv.pandavideo.com.br/embed/?v=81f18403-cf49-43ae-b2ef-4e9d16c066a3' },
    { id: 13, number: 13, title: 'SUPORTE WHATSAPP',                                                      playerId: '', linkYouTube: 'https://player-vz-7b6cf9e4-8bf.tv.pandavideo.com.br/embed/?v=52f26f32-066d-4e61-84f9-1f1cf6f99c55' },
    { id: 14, number: 14, title: 'LIBERAÇÃO OFICIAL',                                                    playerId: '', linkYouTube: 'https://player-vz-7b6cf9e4-8bf.tv.pandavideo.com.br/embed/?v=5f947127-f90c-40e0-a5d9-cd2ff2f3c506', locked: !isPremium },
    { id: 15, number: 15, title: 'ENCONTRO DE MENTORIA GOLD 10X',                                         playerId: '', linkYouTube: 'https://player-vz-7b6cf9e4-8bf.tv.pandavideo.com.br/embed/?v=56b8726a-0951-45ce-aaf8-37ce313fb20f', locked: !isPremium },
    { id: 16, number: 16, title: 'Estrategia Gold X Power V2',                                           playerId: '', linkYouTube: 'https://www.youtube.com/watch?v=stj_1sriQUE' },
    // Aula 16 adicionada à lista
  ]

  const currentEpisode = episodes.find((e) => e.id === activeEpisode)!
  
  // Troca de episódio
  const handleEpisodeChange = (id: number) => {
    if (id === activeEpisode) return
    const target = episodes.find((e) => e.id === id)
    if (!target || target.locked) return
    setActiveEpisode(id)
  }

  // Seleciona episódio via querystring (?aula=17)
  useEffect(() => {
    try {
      const aulaStr = aulaParam
      if (!aulaStr) return
      const aula = parseInt(aulaStr, 10)
      if (Number.isNaN(aula)) return
      const target = episodes.find(e => e.number === aula || e.id === aula)
      // Verifica se o episódio está bloqueado (aulas 14, 15 e 16 para usuários não premium)
      if (target && !target.locked) {
        setActiveEpisode(target.id)
      } else if (target && target.locked) {
        setActiveEpisode(1)
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aulaParam, isPremium])

  // Show Aula 1 CTA after 30s when Aula 1 is active
  useEffect(() => {
    setAula1CtaVisible(false)
    let timer: any
    if (activeEpisode === 1) {
      timer = setTimeout(() => setAula1CtaVisible(true), 30000)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [activeEpisode])

  return (
    <div className="text-gray-200">
      {/* Main Content (header e menu já vêm da página pai) */}
      <main className="pt-4 pb-8">
        {/* (removido) Countdown mobile */}
        {/* Video Player Section */}
        <div id="player" className="w-full md:w-3/4 lg:w-3/4 md:mx-auto lg:mx-auto px-4 mt-2">
          {/* Title above video */}
          <h2 className="text-lg md:text-xl font-bold text-white text-center mt-3 mb-4 md:mt-6 md:mb-5">AULA {currentEpisode.number} - {currentEpisode.title}</h2>
          {currentEpisode.linkYouTube ? (
            <div className="rounded-lg border border-gray-800 overflow-hidden bg-black">
              <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                <iframe
                  src={currentEpisode.linkYouTube.replace('youtu.be/', 'www.youtube.com/embed/').replace('watch?v=', 'embed/')} 
                  title={`AULA ${currentEpisode.number}`}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          ) : currentEpisode.playerId ? (
            <div className="bg-black rounded-lg border border-gray-800 overflow-hidden">
              <VturbPlayer key={currentEpisode.playerId} playerId={currentEpisode.playerId} accountId={currentEpisode.accountId}
              />
            </div>
          ) : (
            <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-6 text-center text-sm text-gray-300">
              Vídeo ainda não disponível para esta aula.
            </div>
          )}
          <div className="px-0 py-4">
            {activeEpisode === 14 && (
              <div className="mt-4 flex flex-col items-center gap-4">
                <a
                  href="https://drive.google.com/drive/folders/1PbzjUuy5jZW-9eVLDVs-tNFyl1bs7bjg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 justify-center px-6 py-3 rounded-xl border border-green-500 bg-green-700 text-white text-base font-semibold shadow-[0_0_28px_rgba(34,197,94,0.35)] hover:bg-green-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M5 20h14v-2H5v2Zm7-3 5-5h-3V4h-4v8H7l5 5Z" />
                  </svg>
                  BAIXAR ARQUIVO!
                </a>
              </div>
            )}
            
            {activeEpisode === 12 && (
              <div className="mt-4 flex flex-col items-center gap-4">
                <Link
                  href={isPremium ? "/formulario" : "/formulario-2"}
                  className="inline-flex items-center gap-2 justify-center px-6 py-3 rounded-xl border border-green-500 bg-green-700 text-white text-base font-semibold shadow-[0_0_28px_rgba(34,197,94,0.35)] hover:bg-green-600 transition-colors w-full max-w-xs"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M5 20h14v-2H5v2Zm7-3 5-5h-3V4h-4v8H7l5 5Z" />
                  </svg>
                  {isPremium ? "ACESSAR FORMULÁRIO" : "ACESSAR FORMULÁRIO (TURMA 2)"}
                </Link>
              </div>
            )}
            {/* Aula 16 removida: formulário não é mais renderizado aqui */}
            {activeEpisode === 1 && (
              <div className="mt-4 flex flex-col items-center gap-4">
                <a
                  href={isPremium 
                    ? "https://one.exnesstrack.org/intl/pt/a/jo986i1iel"
                    : "https://one.exnessonelink.com/a/jo986i1iel?platform=mobile"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 justify-center px-6 py-3 rounded-xl border border-green-500 bg-green-700 text-white text-base font-semibold shadow-[0_0_28px_rgba(34,197,94,0.35)] hover:bg-green-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M5 20h14v-2H5v2Zm7-3 5-5h-3V4h-4v8H7l5 5Z" />
                  </svg>
                  CORRETORA
                </a>
              </div>
            )}
            {activeEpisode === 2 && (
              <div className="mt-4 flex flex-col items-center gap-4">
                {/* Filled green MT5 button (neon) */}
                <a
                  href="https://one.exnesstrack.org/metatrader-5/a/tcnv1es7kk/?campaign=34785&track1=Baixar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 justify-center px-6 py-3 rounded-xl border border-green-500 bg-green-700 text-white text-base font-semibold shadow-[0_0_28px_rgba(34,197,94,0.35)] hover:bg-green-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M5 20h14v-2H5v2Zm7-3 5-5h-3V4h-4v8H7l5 5Z" />
                  </svg>
                  BAIXAR MT5
                </a>
                {/* Outlined green GOLD X button (neon outline) */}
                <a
                  href={isPremium 
                    ? "https://drive.google.com/drive/folders/10Kz1FHj6m9Ys1AgW2JGPhcNIXQYR2trK?usp=sharing"
                    : "https://drive.google.com/drive/folders/1N3GTcskIDYEZTEPYPkcukYk57PIT8egH"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 justify-center px-6 py-3 rounded-xl border-2 border-green-500 text-green-200 text-base font-semibold hover:bg-green-600/10 shadow-[0_0_28px_rgba(34,197,94,0.25)] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M8 5v14l11-7L8 5Z" />
                  </svg>
                  GOLD X
                </a>
              </div>
            )}
            {activeEpisode === 3 && (
              <div className="mt-4 flex flex-col items-center gap-4">
                <a
                  href={isPremium 
                    ? "https://drive.google.com/drive/folders/10Kz1FHj6m9Ys1AgW2JGPhcNIXQYR2trK?usp=sharing"
                    : "https://drive.google.com/drive/folders/1N3GTcskIDYEZTEPYPkcukYk57PIT8egH"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 justify-center px-6 py-3 rounded-xl border-2 border-green-500 text-green-200 text-base font-semibold hover:bg-green-600/10 shadow-[0_0_28px_rgba(34,197,94,0.25)] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M8 5v14l11-7L8 5Z" />
                  </svg>
                  GOLD X
                </a>
              </div>
            )}
            {activeEpisode === 12 && (
              <div className="mt-4 flex flex-col items-center gap-4">
                <a
                  href="https://gold.k17.com.br/formulario"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 justify-center px-6 py-3 rounded-xl border border-blue-500 text-blue-200 text-base font-semibold hover:bg-blue-600/10 transition-colors"
                >
                  FORMULÁRIO
                </a>
              </div>
            )}
            {activeEpisode === 13 && (
              <div className="mt-4 flex flex-col items-center gap-4">
                <a
                  href="https://wa.me/5573991778075"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 justify-center px-6 py-3 rounded-xl border border-emerald-500 text-emerald-200 text-base font-semibold hover:bg-emerald-600/10 transition-colors"
                >
                  SUPORTE
                </a>
              </div>
            )}
            {activeEpisode === 16 && (
              <div className="mt-4 flex flex-col items-center gap-4">
                <a
                  href="https://drive.google.com/drive/folders/1S2lO0zWMgXpZWmrC8D3kwfXbQoBEUG7q?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 justify-center px-6 py-3 rounded-xl border border-green-500 bg-green-700 text-white text-base font-semibold shadow-[0_0_28px_rgba(34,197,94,0.35)] hover:bg-green-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M5 20h14v-2H5v2Zm7-3 5-5h-3V4h-4v8H7l5 5Z" />
                  </svg>
                  BAIXAR
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Episodes List (minimal) */}
        <div className="w-full md:w-3/4 lg:w-3/4 md:mx-auto lg:mx-auto">
          <div className="px-4 pb-2 md:p-4 lg:p-4 episode-list">
            <div className="space-y-1 lg:space-y-2">
              {episodes.map((episode) => {
                const isLocked = !!episode.locked
                const isActive = activeEpisode === episode.id
                const hasTitle = !!episode.title && episode.title.trim().length > 0
                const displayTitle = hasTitle ? episode.title : (isLocked ? 'Em breve' : '')
                const label = `AULA ${episode.number}${displayTitle ? ' - ' + displayTitle : ''}`
                return (
                  <div key={episode.id} className="space-y-1">
                    <button
                      onClick={() => handleEpisodeChange(episode.id)}
                      aria-disabled={isLocked}
                      disabled={isLocked}
                      className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors border ${
                        isActive
                          ? 'bg-green-600/10 border-green-500'
                          : isLocked
                            ? 'bg-transparent border-transparent opacity-60 cursor-not-allowed'
                            : 'bg-transparent hover:bg-white/5 border-transparent cursor-pointer'
                      }`}
                    >
                      {isLocked && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mt-1 text-gray-300">
                          <path d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm-3 8V6a3 3 0 116 0v3H9z" />
                        </svg>
                      )}
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-medium ${isActive ? 'text-green-400' : (isLocked ? 'text-gray-300' : 'text-white')} text-sm md:text-base tracking-tight uppercase`}>{label}</h3>
                          {episode.number === 16 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] md:text-xs font-semibold border border-amber-400 text-amber-300 bg-amber-500/10">
                              AULA NOVA
                            </span>
                          )}
                        </div>
                        {episode.duration && <p className="text-xs text-gray-400 mt-1">{episode.duration}</p>}
                      </div>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Fixed Bottom Actions removed */}

        {/* Download Terms Modal */}
        {showDownloadModal && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="download-modal-title"
          >
            <div className="w-full max-w-md bg-[#111] border border-gray-800 rounded-xl shadow-2xl">
              <div className="p-4 border-b border-gray-800 flex items-start justify-between">
                <h3 id="download-modal-title" className="text-base font-semibold text-gray-100">
                  Leia os Termos antes de baixar
                </h3>
                <button
                  aria-label="Fechar"
                  onClick={() => {
                    setShowDownloadModal(false)
                    setAcceptedTerms(false)
                  }}
                  className="text-gray-400 hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 space-y-3 text-sm text-gray-300">
                <p>
                  Esta é uma versão de teste destinada apenas a fins de avaliação. A leitura e concordância com os
                  <Link href="/termos-automatizador" className="ml-1 text-green-400 hover:text-green-300 underline">Termos de Uso</Link>
                  são obrigatórias antes de prosseguir.
                </p>
              </div>
              {/* Terms acceptance checkbox */}
              <div className="px-4 pb-2">
                <label className="flex items-start gap-2 text-xs text-gray-300">
                  <input
                    id="accept-terms"
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-600 bg-black/40"
                  />
                  <span>
                    Declaro que li e concordo com os
                    <Link href="/termos-automatizador" className="ml-1 text-green-400 hover:text-green-300 underline">Termos de Uso</Link>.
                  </span>
                </label>
              </div>
              <div className="px-4 pb-4 pt-2 flex items-center gap-3">
                <a
                  href="https://drive.google.com/drive/folders/1aNuto8dai003b55qIH6z8dw6-9l7RmAz?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={!acceptedTerms}
                  className={`inline-flex items-center justify-center text-white text-sm font-medium px-4 py-2 rounded-md transition-colors ${
                    acceptedTerms ? 'bg-green-600 hover:bg-green-700' : 'bg-green-600/60 cursor-not-allowed'
                  }`}
                  onClick={(e) => {
                    if (!acceptedTerms) {
                      e.preventDefault()
                      e.stopPropagation()
                      return
                    }
                    setShowDownloadModal(false)
                    setAcceptedTerms(false)
                  }}
                >
                  Concordo e baixar no Drive
                </a>
                <button
                  type="button"
                  className="text-sm text-gray-300 hover:text-gray-100"
                  onClick={() => {
                    setShowDownloadModal(false)
                    setAcceptedTerms(false)
                  }}
                >
                  Cancelar
                </button>
              </div>
              <div className="px-4 pb-4">
                <p className="text-[10px] leading-snug text-gray-400">
                  ESTE SOFTWARE É UM ARQUIVO DIGITAL E NÃO CONSTITUI CONSULTORIA, ASSESSORIA OU PROMESSA DE RENTABILIDADE.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

    </div>
  )
}
