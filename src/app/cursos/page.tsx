import Link from 'next/link'
import { OptimizedImage } from '../components/OptimizedImage'
import { Navigation } from '../components/Navigation'
import VturbEmbed from './VturbEmbed'
import ConsentGate from '@/components/ConsentGate'
import { getConsentStatus } from '@/lib/getConsentStatus'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

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
    title: 'Módulo 2 - Preset Gold X',
    description: 'Instalação e configuração do Preset Gold X',
    image: '/modulos/2.png',
    href: '/cursos/modulo-2',
    badge: 'INTERMEDIÁRIO'
  },
  {
    id: 3,
    title: 'Módulo 3 - Preset Power V2',
    description: 'Instalação e configuração do Preset Power V2',
    image: '/modulos/3.png',
    href: '/cursos/modulo-3',
    badge: 'AVANÇADO'
  },
  {
    id: 4,
    title: 'Módulo 4 - Preset Falcon Bit',
    description: 'Instalação e configuração do Preset Falcon Bit',
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
  },
  {
    id: 6,
    title: 'Módulo 6',
    description: 'Em breve',
    image: '/modulos/6.png',
    href: '/cursos/modulo-6',
    badge: 'MUITO IMPORTANTE'
  }
]

export default async function CursosPage() {
  const consent = await getConsentStatus('v3.0')
  if (!consent.ok) {
    return (
      <div className="min-h-screen bg-black text-gray-200 font-satoshi tracking-[-0.03em]">
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
        <main className="pt-20">
          <ConsentGate />
        </main>
      </div>
    )
  }

  // Detect premium status to decide visibility of modules 2 and 3
  const session = await getServerSession(authOptions)
  // @ts-ignore injected in auth callback
  const isPremium = session?.user?.isPremium === true

  // Hide Module 5 (Celular) on all devices by filtering it out
  // Block Module 2 (Preset Gold X) and Module 3 (Preset Power V2) only when not premium
  const displayedModules = modules
    .map((module) => ({
      ...module,
      locked: false,
    }))

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
                  <VturbEmbed playerId="69335a3ba9b4b605fd3261ae" accountId="70b43777-e359-4c77-af2c-366de25a153d" />
                </div>
              </div>
            </div>
          </div>

          {/* Módulos Section */}
          <div id="modulos" className="mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 lg:max-w-5xl lg:mx-auto">
              {displayedModules.map((module) => (
                module.locked ? (
                  <div
                    key={module.id}
                    aria-disabled="true"
                    className="group relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-900 border border-gray-800 opacity-60 cursor-not-allowed"
                  >
                    <OptimizedImage
                      src={module.image}
                      alt={module.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold text-sm">Em breve</h3>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="inline-block px-2 py-1 bg-black/80 text-gray-300 text-[10px] font-bold rounded backdrop-blur-sm">
                        EM BREVE
                      </span>
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
          </div>

          
        </div>
      </section>

      <div className="px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          <p className="text-[11px] md:text-xs leading-relaxed text-gray-400 border-t border-white/10 pt-4">
            Este software não opera por você: todas as configurações de risco, stop e seleção de ativos são responsabilidade exclusiva do usuário. A Provedora não acessa sua conta, não executa ordens e não realiza qualquer gestão ou recomendação de investimento. O usuário reconhece que pode perder parte ou todo o capital investido e que exemplos de performance apresentados são meramente ilustrativos, não representando garantia de resultados futuros.
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <Navigation />

      {/* Floating WhatsApp button */}
      <a
        href="/whatsapp-cliqueaqui"
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
