'use client'

import { useEffect, useState } from 'react'

type ConsentModalProps = {
  open: boolean
  onClose: () => void
  onAccepted?: (consentId: string) => void
  consentType: string
  text: string
  textVersion?: string
  configSnapshot?: unknown
  disableServerLog?: boolean
  hideTermsLink?: boolean
}

export default function ConsentModal({ open, onClose, onAccepted, consentType, text, textVersion, configSnapshot, disableServerLog = false, hideTermsLink = false }: ConsentModalProps) {
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    try {
      if (open) {
        const prev = document.body.style.overflow
        document.body.setAttribute('data-prev-overflow', prev)
        document.body.style.overflow = 'hidden'
      } else {
        const prev = document.body.getAttribute('data-prev-overflow') || ''
        document.body.style.overflow = prev
        document.body.removeAttribute('data-prev-overflow')
      }
    } catch {}
    return () => {
      try {
        const prev = document.body.getAttribute('data-prev-overflow') || ''
        document.body.style.overflow = prev
        document.body.removeAttribute('data-prev-overflow')
      } catch {}
    }
  }, [open])

  const handleAccept = async () => {
    setSubmitting(true)
    try {
      if (!disableServerLog) {
        const res = await fetch('/api/consents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            consentType,
            text,
            textVersion,
            configSnapshot,
          }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'Falha ao registrar aceite')
        onAccepted?.(data.id)
      } else {
        onAccepted?.('local')
      }
      onClose()
    } catch (e) {
      alert((e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  const renderContent = () => {
    const lines = String(text).split('\n').map((l) => l.trim()).filter(Boolean)
    if (lines.length === 0) return null
    const title = lines[0]
    const rest = lines.slice(1)

    const termoUrl = 'https://test.k17.com.br/termos-de-uso'
    const linkify = (line: string) => {
      if (line.toLowerCase().includes('test.k17.com.br/termos-de-uso')) {
        const prefix = line.split('test.k17.com.br/termos-de-uso')[0]
        return (
          <span>
            {prefix}
            <a href={termoUrl} target="_blank" rel="noopener noreferrer" className="underline text-gray-200 hover:text-white">
              test.k17.com.br/termos-de-uso
            </a>
            .
          </span>
        )
      }
      return <span>{line}</span>
    }

    return (
      <>
        <p className="text-[14px] md:text-[15px] text-white font-semibold mb-2.5">{title}</p>
        <ul className="space-y-2 mb-4">
          {rest.map((line, idx) => (
            <li key={idx} className="flex items-start gap-2 text-[13px] text-gray-200 leading-relaxed">
              <svg className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-2.59a.75.75 0 1 0-1.06-1.06L10.5 12.44l-1.49-1.49a.75.75 0 0 0-1.06 1.06l2.02 2.02c.293.293.767.293 1.06 0l4.68-4.62Z" clipRule="evenodd"/>
              </svg>
              <span className="text-gray-200">{linkify(line)}</span>
            </li>
          ))}
        </ul>
      </>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-md rounded-xl border border-white/10 bg-neutral-900/95 p-5 md:p-6 shadow-xl text-gray-200">
        <div className="flex items-center gap-2 mb-1.5">
          <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.25 4.5c.414 0 .75.336.75.75v7.5a.75.75 0 0 1-1.5 0v-7.5c0-.414.336-.75.75-.75Zm0 12a.75.75 0 0 0 0 1.5h.008a.75.75 0 0 0 0-1.5H11.25Z" />
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm0 18a8.25 8.25 0 1 1 0-16.5 8.25 8.25 0 0 1 0 16.5Z" clipRule="evenodd" />
          </svg>
          <h2 className="text-base md:text-lg font-semibold text-white tracking-tight">Atenção</h2>
        </div>
        <div className="mt-1.5">
          {renderContent()}
        </div>
        {!hideTermsLink && (
          <p className="text-[11px] text-gray-400 mb-5">
            Leia os termos completos em{' '}
            <a href="https://test.k17.com.br/termos-de-uso" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-300">
              test.k17.com.br/termos-de-uso
            </a>.
          </p>
        )}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex-1 text-center px-3.5 py-2 rounded-full text-[13px] font-medium border border-white/20 text-gray-200 hover:bg-white/5"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleAccept}
            disabled={submitting}
            className="flex-1 text-center px-3.5 py-2 rounded-full text-[13px] font-semibold bg-green-600 hover:bg-green-500 text-white border border-green-500/60 shadow-md"
          >
            {submitting ? 'Registrando...' : 'Li e Concordo'}
          </button>
        </div>
      </div>
    </div>
  )
}
