import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { OptimizedImage } from '../../components/OptimizedImage'
import { Navigation } from '../../components/Navigation'
import A16Client from './A16Client'

export default async function Aula16Page() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
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
          <A16Client />
        </div>
      </main>

      {/* Bottom Navigation */}
      <Navigation />
    </div>
  )
}
