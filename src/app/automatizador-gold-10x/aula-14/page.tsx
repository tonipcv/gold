import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { OptimizedImage } from '../../components/OptimizedImage'
import { Navigation } from '../../components/Navigation'
 

export default async function Aula14Page() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }

  // Somente Premium
  // @ts-ignore - propriedade injetada no callback da sessão
  const isPremium = session?.user?.isPremium === true
  if (!isPremium) {
    redirect('/automatizador-gold-10x')
  }

  return (
    <div className="min-h-screen bg-black text-gray-200 font-satoshi tracking-[-0.03em]">
      {/* Header */}
      <header className="fixed top-0 w-full bg-black/90 backdrop-blur-sm z-50 px-4 py-3">
        <div className="flex justify-center lg:justify-start items-center">
          <Link href="/" className="flex items-center">
            <OptimizedImage src="/ft-icone.png" alt="Futuros Tech Logo" width={40} height={40} className="brightness-0 invert" />
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="pt-24 pb-20">
        <div className="w-full md:w-3/4 lg:w-3/4 md:mx-auto lg:mx-auto px-4 py-4">
          <div id="player" className="bg-black rounded-lg border border-gray-800 overflow-hidden">
            <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/h77uIIwLABI?rel=0"
                title="Aula 14 - Estratégia Nova GOLD X V2"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <Navigation />
    </div>
  )
}
