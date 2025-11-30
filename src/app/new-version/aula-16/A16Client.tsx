'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'

export default function A16Client() {
  const { data: session } = useSession()
  const email = (session?.user as any)?.email as string | undefined
  const [loading, setLoading] = useState(false)
  const [coupon, setCoupon] = useState<string>('')
  const [active, setActive] = useState<boolean>(false)
  // Form state (used when coupon is not active)
  const [name, setName] = useState('')
  const [purchaseEmail, setPurchaseEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [friendsCount, setFriendsCount] = useState<number>(1)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const shareLink = useMemo(() => {
    if (!coupon) return ''
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      return `${origin}/automacao-bonus?coupon=${encodeURIComponent(coupon)}`
    } catch {
      return `/automacao-bonus?coupon=${encodeURIComponent(coupon)}`
    }
  }, [coupon])

  const benefitLabel = useMemo(() => {
    const months = friendsCount * 2
    const amigoLabel = friendsCount === 1 ? '1 amigo' : `${friendsCount} amigos`
    return `${amigoLabel} = até ${months} meses grátis`
  }, [friendsCount])

  const handleSubmit = async (e: React.FormEvent) => {
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
    let cancel = false
    const run = async () => {
      if (!email) return
      try {
        setLoading(true)
        const res = await fetch(`/api/admin/user-coupons?email=${encodeURIComponent(email)}`, { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        if (cancel) return
        const it = data?.item as any
        if (it) {
          setCoupon((it.coupon || '').toString().trim().toUpperCase())
          setActive(!!it.isActive)
        }
      } finally {
        if (!cancel) setLoading(false)
      }
    }
    run()
    return () => { cancel = true }
  }, [email])
  return (
    <div className="w-full md:w-3/4 lg:w-3/4 md:mx-auto lg:mx-auto px-4 mt-2">
      <h1 className="text-lg md:text-xl font-medium tracking-tight text-center mt-2 mb-3">
        Ganhe até 2 meses Grátis de Assinatura
      </h1>
      <div id="player" className="bg-black rounded-lg border border-gray-800 overflow-hidden">
        <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
          <div className="absolute inset-0">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/wmH2bPIJpbI?rel=0&modestbranding=1"
              title="YouTube video player"
              frameBorder={0}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      </div>

      <div className="mt-6 w-full max-w-xl mx-auto space-y-4">
        {loading ? (
          <div className="text-sm text-gray-400">Carregando seu cupom...</div>
        ) : active && coupon ? (
          <div className="rounded-md border border-emerald-500/40 bg-emerald-900/20 text-emerald-200 px-4 py-3">
            <div className="font-semibold mb-1">Parabéns! 🎉 Seu cupom foi gerado e está ativo.</div>
            <div className="text-sm mb-2">Compartilhe seu link e ganhe até 2 meses grátis. Seus amigos ganham 1 mês grátis + 9% de desconto.</div>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-black/40 border border-emerald-500/30 px-2 py-1 rounded">{shareLink}</code>
              <button
                onClick={async () => { try { await navigator.clipboard.writeText(shareLink) } catch {} }}
                className="text-xs px-2 py-1 rounded border border-emerald-400/60 hover:bg-emerald-500/10"
              >Copiar link</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 w-full max-w-xl mx-auto space-y-4">
            {success && (
              <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 text-emerald-200 px-4 py-2 text-sm">
                {success}
              </div>
            )}
            {error && (
              <div className="rounded-md border border-red-500/40 bg-red-500/10 text-red-200 px-4 py-2 text-sm">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 gap-4">
              <label className="block">
                <span className="text-sm text-gray-300">Nome</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-700 bg-black/40 px-3 py-2 text-gray-100 outline-none focus:border-gray-500"
                  placeholder="Seu nome completo"
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-300">E-mail de Compra para Liberar Bônus</span>
                <input
                  type="email"
                  value={purchaseEmail}
                  onChange={(e) => setPurchaseEmail(e.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-700 bg-black/40 px-3 py-2 text-gray-100 outline-none focus:border-gray-500"
                  placeholder="voce@exemplo.com"
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-300">Whatsapp</span>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-700 bg-black/40 px-3 py-2 text-gray-100 outline-none focus:border-gray-500"
                  placeholder="(00) 90000-0000"
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-300">Tem quantos amigos para indicar?</span>
                <select
                  value={friendsCount}
                  onChange={(e) => setFriendsCount(parseInt(e.target.value, 10))}
                  className="mt-1 w-full rounded-lg border border-gray-700 bg-black/40 px-3 py-2 text-gray-100 outline-none focus:border-gray-500"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {`${n} amigo${n > 1 ? 's' : ''} = até ${n * 2} meses grátis`}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-400">{benefitLabel}</p>
              </label>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex items-center gap-2 justify-center px-6 py-3 rounded-xl border-2 border-green-500 text-green-200 text-base font-semibold shadow-[0_0_28px_rgba(34,197,94,0.25)] transition-colors ${submitting ? 'opacity-60 cursor-not-allowed' : 'hover:bg-green-600/10'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M8 5v14l11-7L8 5Z" />
              </svg>
              {submitting ? 'Enviando...' : 'SOLICITAR CUPOM'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
