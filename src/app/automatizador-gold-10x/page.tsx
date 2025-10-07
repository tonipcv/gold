import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AutomatizadorGold10xClient from './Client'
import Link from 'next/link'
import ActiveCouponBanner from './ActiveCouponBanner'
import { OptimizedImage } from '../components/OptimizedImage'
import { Navigation } from '../components/Navigation'
import AttentionBanner from './AttentionBanner'

export default async function AutomatizadorGold10xPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-black text-gray-200 font-satoshi tracking-[-0.03em]">
      {/* Header (igual produtos) */}
      <header className="fixed top-0 w-full bg-black/90 backdrop-blur-sm z-50 px-4 py-3">
        <div className="flex justify-center lg:justify-start items-center">
          <Link href="/" className="flex items-center">
            <OptimizedImage src="/ft-icone.png" alt="Futuros Tech Logo" width={40} height={40} className="brightness-0 invert" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-20">
        {session?.user?.isPremium && (
          <ActiveCouponBanner />
        )}
        {/* Banner verde removido a pedido */}
        {/* Alert no topo informando sobre a aula bônus no final (somente para premium) */}
        {session?.user?.isPremium && (
          <div className="w-full md:w-3/4 lg:w-3/4 md:mx-auto lg:mx-auto px-4">
            <div role="alert" className="mb-4 rounded-md border border-yellow-400/40 bg-yellow-900/20 text-yellow-100 px-3 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mt-0.5">
                  <path fillRule="evenodd" d="M10.29 3.86c.77-1.33 2.65-1.33 3.42 0l7.35 12.7c.77 1.33-.19 3-1.71 3H4.65c-1.52 0-2.48-1.67-1.71-3l7.35-12.7Zm1.71 4.64a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5c0-.41.34-.75.75-.75Zm0 8.25a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8Z" clipRule="evenodd" />
                </svg>
                <p className="text-sm md:text-base font-semibold">
                  Parabéns! Você foi selecionado para ganhar até 2 meses grátis de assinatura.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link href='/automatizador-gold-10x/aula-16' className="inline-flex items-center px-3 py-1.5 rounded border border-yellow-400/50 text-yellow-100 text-xs md:text-sm">
                  Ler regulamentos
                </Link>
                <Link href='/automatizador-gold-10x/aula-16' className="inline-flex items-center px-3 py-1.5 rounded border border-yellow-400/50 bg-yellow-400/10 hover:bg-yellow-400/15 text-yellow-100 text-xs md:text-sm">
                  Ir para AULA 16
                </Link>
              </div>
            </div>
          </div>
        )}
        <div className="w-full md:w-3/4 lg:w-3/4 md:mx-auto lg:mx-auto px-4 py-4">
          <AutomatizadorGold10xClient />
        </div>
      </main>

      {/* Bottom Navigation */}
      <Navigation />

      {/* Floating WhatsApp button (only on this page) */}
      <a
        href="/whatsapp"
        aria-label="Abrir WhatsApp"
        className="fixed bottom-5 right-5 z-50 inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-600 hover:bg-green-500 text-white shadow-xl border border-green-500/70"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M20.52 3.48A11.8 11.8 0 0 0 12.02 0C5.53 0 .26 5.27.26 11.76c0 2.07.55 4.05 1.6 5.82L0 24l6.58-1.8a11.7 11.7 0 0 0 5.44 1.39h.01c6.49 0 11.76-5.27 11.76-11.76 0-3.15-1.23-6.11-3.27-8.35ZM12.03 21.2h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.9 1.07 1.04-3.8-.22-.35a9.39 9.39 0 0 1-1.46-5.06c0-5.2 4.23-9.43 9.43-9.43 2.52 0 4.88.98 6.66 2.77a9.35 9.35 0 0 1 2.77 6.66c0 5.2-4.23 9.43-9.43 9.43Zm5.44-7.06c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.96 1.17-.18.2-.36.22-.66.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.47.13-.62.14-.14.3-.36.45-.54.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.68-1.64-.93-2.24-.24-.58-.49-.5-.68-.5-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.5 1.7.64.71.23 1.36.2 1.88.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z"/>
        </svg>
      </a>
    </div>
  )
}
