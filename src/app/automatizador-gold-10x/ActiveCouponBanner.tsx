'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'

export default function ActiveCouponBanner() {
  const { data: session } = useSession()
  const email = (session?.user as any)?.email as string | undefined
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState(false)
  const [coupon, setCoupon] = useState('')

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
          setActive(!!it.isActive)
          setCoupon((it.coupon || '').toString().trim().toUpperCase())
        }
      } finally {
        if (!cancel) setLoading(false)
      }
    }
    run()
    return () => { cancel = true }
  }, [email])

  const shareLink = useMemo(() => {
    if (!coupon) return ''
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    return `${origin}/automacao-bonus?coupon=${encodeURIComponent(coupon)}`
  }, [coupon])

  if (loading || !active) return null

  return (
    <div className="w-full md:w-3/4 lg:w-3/4 md:mx-auto lg:mx-auto px-4">
      <div className="mb-4 rounded-xl border border-emerald-400/50 bg-emerald-900/20 text-emerald-200 px-4 py-4 flex items-center justify-between gap-4 shadow-[0_0_32px_rgba(16,185,129,0.15)]">
        <div className="space-y-1">
          <p className="text-base md:text-lg font-bold leading-tight">Parabéns! 🎉 Seu cupom está ativo.</p>
          <p className="text-xs md:text-sm opacity-90">Compartilhe seu link com amigos e ganhe até 2 meses grátis na sua assinatura.</p>
          <p className="text-xs md:text-sm opacity-90">Eles também recebem 1 mês grátis + 9% de desconto. Todo mundo sai ganhando!</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={async () => { try { await navigator.clipboard.writeText(shareLink) } catch {} }}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-emerald-400/70 text-emerald-100 hover:bg-emerald-500/10 transition-colors text-xs md:text-sm font-medium"
          >
            Copiar link
          </button>
        </div>
      </div>
    </div>
  )
}
