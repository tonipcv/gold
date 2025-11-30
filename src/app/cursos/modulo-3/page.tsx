import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { OptimizedImage } from '@/app/components/OptimizedImage'
import { Navigation } from '@/app/components/Navigation'

export default async function Modulo3Page() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-black text-gray-200 font-satoshi tracking-[-0.03em]">
      {/* Header */}
      <header className="fixed top-0 w-full bg-black/90 backdrop-blur-sm z-50 px-4 py-3">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Link href="/cursos" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M7.28 7.72a.75.75 0 0 1 0 1.06l-2.47 2.47H21a.75.75 0 0 1 0 1.5H4.81l2.47 2.47a.75.75 0 1 1-1.06 1.06l-3.75-3.75a.75.75 0 0 1 0-1.06l3.75-3.75a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium hidden md:inline">Voltar aos Cursos</span>
          </Link>
          <Link href="/" className="flex items-center">
            <OptimizedImage src="/ft-icone.png" alt="Futuros Tech Logo" width={40} height={40} className="brightness-0 invert" />
          </Link>
          <div className="w-20" />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-20">
        <div className="w-full md:w-3/4 lg:w-3/4 md:mx-auto lg:mx-auto px-4 py-4">
          <div className="text-gray-200">
            {/* Header do Módulo */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">MÓDULO 3 - POWER V2</h1>
              <p className="text-gray-400">Estratégia Power V2</p>
            </div>

            {/* Conteúdo do Módulo */}
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-8 md:p-12 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-green-500">
                  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4c-1.48 0-2.85.43-4.01 1.17l1.46 1.46a5.5 5.5 0 0 1 8.05 4.87v.5h1.5c1.66 0 3 1.34 3 3s-1.34 3-3 3H13v2h6c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM11 13H5c-1.66 0-3-1.34-3-3s1.34-3 3-3l.14.01C5.58 5.59 7.62 4 10 4c.46 0 .91.07 1.34.18L9.89 5.64C9.6 5.56 9.3 5.5 9 5.5c-1.93 0-3.5 1.57-3.5 3.5H5c-1.1 0-2 .9-2 2s.9 2 2 2h6v2zm0 7l-3.5-3.5L9 15l2 2V11h2v6l2-2 1.5 1.5L13 20z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">MÓDULO - POWER V2</h2>
              <p className="text-gray-300 mb-6 max-w-md">
                Acesse os arquivos e materiais do módulo Power V2
              </p>
              <a
                href="https://drive.google.com/drive/folders/1S2lO0zWMgXpZWmrC8D3kwfXbQoBEUG7q?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full max-w-xs px-6 py-3 rounded-full text-sm font-semibold bg-green-600 hover:bg-green-500 text-white border border-green-500/60 transition-all inline-flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4c-1.48 0-2.85.43-4.01 1.17l1.46 1.46a5.5 5.5 0 0 1 8.05 4.87v.5h1.5c1.66 0 3 1.34 3 3s-1.34 3-3 3H13v2h6c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM11 13H5c-1.66 0-3-1.34-3-3s1.34-3 3-3l.14.01C5.58 5.59 7.62 4 10 4c.46 0 .91.07 1.34.18L9.89 5.64C9.6 5.56 9.3 5.5 9 5.5c-1.93 0-3.5 1.57-3.5 3.5H5c-1.1 0-2 .9-2 2s.9 2 2 2h6v2zm0 7l-3.5-3.5L9 15l2 2V11h2v6l2-2 1.5 1.5L13 20z"/>
                </svg>
                POWER V2
              </a>
            </div>
          </div>
        </div>
      </main>

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
