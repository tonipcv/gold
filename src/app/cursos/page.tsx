import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { OptimizedImage } from '../components/OptimizedImage'
import { Navigation } from '../components/Navigation'
import VturbEmbed from './VturbEmbed'

interface Module {
  id: number
  title: string
  description: string
  image: string
  href: string
  badge?: string
  locked?: boolean
}

const modules: Module[] = [
  {
    id: 1,
    title: 'Módulo 1 - Instalação',
    description: 'Instalação e primeiros passos',
    image: '/modulos/1.png',
    href: '/cursos/modulo-1',
    badge: 'BÁSICO'
  },
  {
    id: 2,
    title: 'Módulo 2 - Gold X',
    description: 'Estratégia Gold X',
    image: '/modulos/2.png',
    href: '/cursos/modulo-2',
    badge: 'INTERMEDIÁRIO'
  },
  {
    id: 3,
    title: 'Módulo 3 - Power V2',
    description: 'Estratégia Power V2',
    image: '/modulos/3.png',
    href: '/cursos/modulo-3',
    badge: 'AVANÇADO'
  },
  {
    id: 4,
    title: 'Módulo 4 - Falcon Bit',
    description: 'Estratégia Falcon Bit',
    image: '/modulos/4.png',
    href: '/cursos/modulo-4',
    badge: 'EXPERT'
  },
  {
    id: 5,
    title: 'Módulo 5 - Celular',
    description: 'Operando pelo celular',
    image: '/modulos/5.png',
    href: '/cursos/modulo-5',
    badge: 'PREMIUM'
  }
]

export default async function CursosPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-black text-gray-200 font-satoshi tracking-[-0.03em]">
      {/* Header */}
      <header className="fixed top-0 w-full bg-black/90 backdrop-blur-sm z-50 px-4 py-3">
        <div className="flex justify-center lg:justify-start items-center">
          <div className="flex items-center">
            <OptimizedImage 
              src="/ft-icone.png" 
              alt="Futuros Tech Logo" 
              width={40} 
              height={40} 
              className="brightness-0 invert" 
            />
          </div>
        </div>
      </header>

      {/* Hero Section com fundo em P&B e vídeo logo abaixo */}
      <section className="relative pt-24 pb-12 px-4">
        {/* Background em toda a seção */}
        <div className="absolute inset-0 -z-10">
          <OptimizedImage
            src="/ai.webp"
            alt="Background"
            fill
            className="object-cover grayscale"
            priority
          />
          {/* Escurecimento para legibilidade */}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Bloco de tag PREMIUM centralizada */}
          <div className="mb-6 px-2 md:px-0 flex justify-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-400/60 bg-yellow-500/10 text-gray-300 text-sm md:text-base font-bold tracking-wide">
              Acesso VIP
            </span>
          </div>

          {/* Vídeo imediatamente abaixo do texto */}
          <div className="mb-12 max-w-2xl mx-auto w-full">
            <div className="rounded-lg border border-gray-800 overflow-hidden bg-black">
              <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                <div className="absolute inset-0">
                  <VturbEmbed playerId="692b55104fd612d7bf33ece1" accountId="70b43777-e359-4c77-af2c-366de25a153d" />
                </div>
              </div>
            </div>
          </div>

          {/* Módulos Section (Premium) */}
          <div id="modulos" className="mb-12">
            {/* Premium gate */}
            {session?.user?.isPremium ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {modules.map((module) => (
                  module.locked ? (
                    <div
                      key={module.id}
                      aria-disabled
                      className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-900 border border-gray-800 opacity-70 cursor-not-allowed"
                    >
                      <OptimizedImage
                        src={module.image}
                        alt={module.title}
                        fill
                        className="object-cover grayscale"
                      />
                      <div className="absolute inset-0 bg-black/50" />
                      <div className="absolute top-2 right-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-black/80 text-gray-300 text-[10px] font-bold rounded backdrop-blur-sm border border-gray-700">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                            <path d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm-3 8V6a3 3 0 116 0v3H9z" />
                          </svg>
                          BLOQUEADO
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-bold text-sm mb-1">{module.title}</h3>
                        <p className="text-gray-300 text-xs">{module.description}</p>
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={module.id}
                      href={module.href}
                      className="group relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-900 hover:ring-2 hover:ring-green-500 transition-all transform hover:scale-105"
                    >
                      <OptimizedImage
                        src={module.image}
                        alt={module.title}
                        fill
                        className="object-cover group-hover:opacity-80 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform">
                        <h3 className="text-white font-bold text-sm mb-1">{module.title}</h3>
                        <p className="text-gray-300 text-xs mb-2">{module.description}</p>
                        {module.badge && (
                          <span className="inline-block px-2 py-1 bg-green-600 text-white text-[10px] font-bold rounded">
                            {module.badge}
                          </span>
                        )}
                      </div>
                      {module.badge && (
                        <div className="absolute top-2 right-2">
                          <span className="inline-block px-2 py-1 bg-black/80 text-green-400 text-[10px] font-bold rounded backdrop-blur-sm">
                            {module.badge}
                          </span>
                        </div>
                      )}
                    </Link>
                  )
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 flex flex-col items-center text-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-gray-300 mb-3">
                  <path d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm-3 8V6a3 3 0 116 0v3H9z" />
                </svg>
                <p className="text-sm text-gray-300">Conteúdo exclusivo para assinantes premium.</p>
              </div>
            )}
          </div>

          
        </div>
      </section>

      {/* Bottom Navigation */}
      <Navigation />

      {/* Floating WhatsApp button */}
      <a
        href="/whatsapp"
        aria-label="Abrir WhatsApp"
        className="fixed bottom-20 right-5 z-50 inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-600 hover:bg-green-500 text-white shadow-xl border border-green-500/70 transition-all hover:scale-110"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M20.52 3.48A11.8 11.8 0 0 0 12.02 0C5.53 0 .26 5.27.26 11.76c0 2.07.55 4.05 1.6 5.82L0 24l6.58-1.8a11.7 11.7 0 0 0 5.44 1.39h.01c6.49 0 11.76-5.27 11.76-11.76 0-3.15-1.23-6.11-3.27-8.35ZM12.03 21.2h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.9 1.07 1.04-3.8-.22-.35a9.39 9.39 0 0 1-1.46-5.06c0-5.2 4.23-9.43 9.43-9.43 2.52 0 4.88.98 6.66 2.77a9.35 9.35 0 0 1 2.77 6.66c0 5.2-4.23 9.43-9.43 9.43Zm5.44-7.06c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.96 1.17-.18.2-.36.22-.66.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.47.13-.62.14-.14.3-.36.45-.54.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.68-1.64-.93-2.24-.24-.58-.49-.5-.68-.5-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.5 1.7.64.71.23 1.36.2 1.88.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z"/>
        </svg>
      </a>
    </div>
  )
}
