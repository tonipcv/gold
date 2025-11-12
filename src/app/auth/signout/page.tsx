'use client'

import { useEffect, useRef, useState } from 'react'
import { getCsrfToken } from 'next-auth/react'

export default function SignOutPage() {
  const formRef = useRef<HTMLFormElement>(null)
  const [csrf, setCsrf] = useState<string>('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const token = await getCsrfToken()
        if (mounted) {
          setCsrf(token || '')
          // auto submit as soon as we have a token
          setTimeout(() => {
            formRef.current?.submit()
          }, 50)
        }
      } catch {
        // fallback: try submit anyway
        setTimeout(() => {
          formRef.current?.submit()
        }, 100)
      }
    })()
    return () => { mounted = false }
  }, [])

  return (
    <div className="min-h-screen bg-white text-zinc-900" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans'" }}>
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-xl font-semibold">Saindo…</h1>
          <p className="mt-2 text-sm text-zinc-600">Aguarde um instante enquanto finalizamos sua sessão.</p>
          <form ref={formRef} method="post" action="/api/auth/signout" className="hidden">
            <input type="hidden" name="csrfToken" value={csrf} />
            <input type="hidden" name="callbackUrl" value="/login" />
          </form>
        </div>
      </div>
    </div>
  )
}
