import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Navigation } from '../components/Navigation'
import { BottomNavigation } from '../../components/BottomNavigation'
import { OptimizedImage } from '../components/OptimizedImage'
import { hasProductAccess } from '@/lib/product-access'

export default async function ProdutosPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }
  
  // Verificar acesso aos produtos
  const hasFuturosTechAccess = await hasProductAccess('futurostech')
  const hasCopyTradeAccess = await hasProductAccess('copytrade')
  // Temporarily unlocked: always allow access to Gold 10x
  const hasGold10xAccess = true

  return (
    <div className="min-h-screen bg-black text-gray-200 font-satoshi tracking-[-0.03em]">
      {/* Header */}
      <header className="fixed top-0 w-full bg-black/90 backdrop-blur-sm z-50 px-4 py-3">
        <div className="flex justify-center lg:justify-start items-center">
          <Link href="/" className="flex items-center">
            <OptimizedImage src="/ft-icone.png" alt="Futuros Tech Logo" width={40} height={40} />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-14 pb-20">
        <div className="w-full md:w-3/4 lg:w-3/4 md:mx-auto lg:mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-8 text-[#5a96f4]">Meus Produtos</h1>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* FIP - Formação para Investidor Profissional */}
            <div className={`rounded-lg overflow-hidden shadow-lg border ${hasFuturosTechAccess ? 'bg-gray-800/30 border-gray-700 hover:border-[#5a96f4]' : 'bg-gray-900/20 border-gray-800'} transition-all ${!hasFuturosTechAccess ? 'grayscale' : ''}`}>
              <div className="p-6">
                <h2 className={`text-xl mb-2 ${hasFuturosTechAccess ? 'font-bold text-[#5a96f4]' : 'font-light text-gray-400'}`}>FIP - Formação para Investidor Profissional</h2>
                <p className={`mb-4 ${hasFuturosTechAccess ? 'text-gray-300' : 'text-gray-500 font-light'}`}>Aprenda estratégias avançadas de investimento e torne-se um investidor profissional.</p>
                <div className="mt-4">
                  {hasFuturosTechAccess ? (
                    <Link 
                      href="/series-restrito" 
                      className="inline-block bg-[#5a96f4] text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Acessar Curso
                    </Link>
                  ) : (
                    <span className="inline-block bg-gray-700 text-gray-400 font-light px-4 py-2 rounded-md cursor-not-allowed">
                      Indisponível
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Copy Trading com BH */}
            <div className={`rounded-lg overflow-hidden shadow-lg border ${hasCopyTradeAccess ? 'bg-gray-800/30 border-gray-700 hover:border-[#5a96f4]' : 'bg-gray-900/20 border-gray-800'} transition-all ${!hasCopyTradeAccess ? 'grayscale' : ''}`}>
              <div className="p-6">
                <h2 className={`text-xl mb-2 ${hasCopyTradeAccess ? 'font-bold text-[#5a96f4]' : 'font-light text-gray-400'}`}>Copy Trading com BH</h2>
                <p className={`mb-4 ${hasCopyTradeAccess ? 'text-gray-300' : 'text-gray-500 font-light'}`}>Copie as operações de traders experientes e obtenha resultados consistentes.</p>
                <div className="mt-4">
                  {hasCopyTradeAccess ? (
                    <Link 
                      href="/copy-trade" 
                      className="inline-block bg-[#5a96f4] text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Acessar Curso
                    </Link>
                  ) : (
                    <span className="inline-block bg-gray-700 text-gray-400 font-light px-4 py-2 rounded-md cursor-not-allowed">
                      Indisponível
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Gold 10x */}
          <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className={`rounded-lg overflow-hidden shadow-lg border ${hasGold10xAccess ? 'bg-gray-800/30 border-gray-700 hover:border-[#5a96f4]' : 'bg-gray-900/20 border-gray-800'} transition-all ${!hasGold10xAccess ? 'grayscale' : ''}`}>
              <div className="p-6">
                <h2 className={`${hasGold10xAccess ? 'text-xl font-bold text-[#5a96f4]' : 'text-xl font-light text-gray-400'} mb-2`}>Gold 10x</h2>
                <p className={`${hasGold10xAccess ? 'text-gray-300' : 'text-gray-500 font-light'} mb-4`}>Acesse o plano Gold 10x com conteúdos e recursos exclusivos.</p>
                <div className="mt-4">
                  {hasGold10xAccess ? (
                    <Link 
                      href="/10x" 
                      className="inline-block bg-[#5a96f4] text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Acessar
                    </Link>
                  ) : (
                    <span className="inline-block bg-gray-700 text-gray-400 font-light px-4 py-2 rounded-md cursor-not-allowed">
                      Indisponível
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
      
      <Navigation />
    </div>
  )
}
