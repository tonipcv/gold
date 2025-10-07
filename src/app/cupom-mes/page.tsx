'use client'

import { Suspense, useState } from 'react'
import XLogo from '@/components/XLogo'

export default function CupomMesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Carregando…</div>}>
      <FormContent />
    </Suspense>
  )
}

function FormContent() {
  const [form, setForm] = useState({
    name: '',
    purchaseEmail: '',
    whatsapp: '',
    divulgacao: '',
    desiredCouponName: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    const { name, purchaseEmail, whatsapp, divulgacao, desiredCouponName } = form
    if (!name || !purchaseEmail || !whatsapp || !divulgacao || !desiredCouponName) {
      setError('Preencha todos os campos.')
      return
    }

    try {
      setLoading(true)
      const res = await fetch('/api/indicacao-cupom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Erro ao enviar.')
      setSuccess(true)
      setForm({ name: '', purchaseEmail: '', whatsapp: '', divulgacao: '', desiredCouponName: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-10">
      <div className="mb-10">
        <XLogo />
      </div>

      <div className="w-full max-w-md">
        {success && (
          <div className="mb-4 rounded-lg border border-green-700 bg-green-950/40 text-green-300 px-4 py-3 text-sm">
            Obrigado! Recebemos sua solicitação. Em breve entraremos em contato.
          </div>
        )}

        <h1 className="text-center text-lg text-neutral-200 mb-6">
          Exclusivo para alunos: gere o seu cupom, indique amigos e ganhe até 2 meses grátis na sua assinatura
        </h1>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm text-neutral-400 mb-1">
              Nome
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={onChange}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-700"
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div>
            <label htmlFor="purchaseEmail" className="block text-sm text-neutral-400 mb-1">
              E-mail de Compra
            </label>
            <input
              id="purchaseEmail"
              name="purchaseEmail"
              type="email"
              value={form.purchaseEmail}
              onChange={onChange}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-700"
              placeholder="email@exemplo.com"
              autoComplete="off"
              required
            />
          </div>

          <div>
            <label htmlFor="whatsapp" className="block text-sm text-neutral-400 mb-1">
              Whatsapp
            </label>
            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              value={form.whatsapp}
              onChange={onChange}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-700"
              placeholder="(00) 00000-0000"
              required
            />
          </div>

          <div>
            <label htmlFor="divulgacao" className="block text-sm text-neutral-400 mb-1">
              Como fará a divulgação?
            </label>
            <textarea
              id="divulgacao"
              name="divulgacao"
              value={form.divulgacao}
              onChange={onChange}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-700 min-h-28"
              placeholder="Ex.: Stories no Instagram, grupos de WhatsApp, etc."
              required
            />
          </div>

          <div>
            <label htmlFor="desiredCouponName" className="block text-sm text-neutral-400 mb-1">
              Nome do Cupom Desejado
            </label>
            <input
              id="desiredCouponName"
              name="desiredCouponName"
              type="text"
              value={form.desiredCouponName}
              onChange={onChange}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-700"
              placeholder="Ex.: MEUCUPO10"
              required
            />
          </div>

          {error && <div className="text-sm text-red-400">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex justify-center px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl text-white font-medium transition-all disabled:opacity-60"
          >
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </div>
    </div>
  )
}
