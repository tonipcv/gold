import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { OptimizedImage } from '../components/OptimizedImage'
import { Navigation } from '../components/Navigation'
import AutomatizadorGold10xClient from '../automatizador-gold-10x/Client'
import Cards from './Cards'

export default async function MarketplacePage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-satoshi tracking-[-0.03em]" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'" }}>
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 px-4 py-3">
        <div className="flex justify-center items-center">
          <Link href="/" className="flex items-center">
            <OptimizedImage src="/ft-icone.png" alt="Logo" width={40} height={40} className="" />
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-20">
        {/* Aula (player) no topo */}
        <div className="w-full md:w-3/4 lg:w-3/4 md:mx-auto lg:mx-auto px-4 py-4">
          <AutomatizadorGold10xClient
            variant="light"
            mode="playerOnly"
            customTitle="RECEBA ACESSO A TODAS ESTRATÉGIAS AVANÇADAS"
          />
        </div>

        {/* Marketplace cards */}
        <div className="w-full md:w-3/4 lg:w-3/4 md:mx-auto lg:mx-auto px-4 py-4">
          <Cards />
        </div>
      </main>

      <details className="fixed bottom-5 right-5 z-50 group">
        <summary className="list-none cursor-pointer">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-900 text-white shadow-xl border border-zinc-200">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M12 2.25a4.5 4.5 0 0 0-2.473 8.28 7.504 7.504 0 0 0-5.777 7.345.75.75 0 0 0 1.5 0 6.002 6.002 0 0 1 11.998 0 .75.75 0 0 0 1.5 0 7.504 7.504 0 0 0-5.777-7.345A4.5 4.5 0 0 0 12 2.25Zm0 1.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" clipRule="evenodd" />
            </svg>
          </div>
        </summary>
        <div className="absolute bottom-16 right-0 w-56 rounded-xl border border-zinc-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="py-2">
            <a href="https://wa.me/5573991778075" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-zinc-800 hover:bg-zinc-50">Falar no WhatsApp</a>
            <a href="/automatizador-gold-10x?aula=16" className="block px-4 py-2 text-sm text-zinc-800 hover:bg-zinc-50">Convidar amigos</a>
            <form method="get" action="/auth/signout" className="mt-2 border-t border-zinc-200">
              <input type="hidden" name="callbackUrl" value="/login" />
              <button type="submit" className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Sair</button>
            </form>
          </div>
        </div>
      </details>
    </div>
  )
}
