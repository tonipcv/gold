import fs from 'fs/promises'
import path from 'path'
import Link from 'next/link'
import Script from 'next/script'
import { OptimizedImage } from '../components/OptimizedImage'
import { Countdown } from './Countdown'
import { Gallery } from './Gallery'

// Local JSX declaration to ensure TS recognizes the custom web component during build
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'vturb-smartplayer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        id?: string
        style?: React.CSSProperties
      }
    }
  }
}

// Ensure this runs on the server and revalidates when rebuilt
export const dynamic = 'force-static'

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'])

async function getImagesFromPublicGeral() {
  const geralDir = path.join(process.cwd(), 'public', 'geral')
  let entries: string[] = []

  try {
    entries = await fs.readdir(geralDir)
  } catch (e) {
    console.error('Erro ao ler diretório public/geral:', e)
    return [] as string[]
  }

  const images = entries
    .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
    .map((name) => `/geral/${name}`)

  return images
}

export default async function GaleriaPage() {
  const images = await getImagesFromPublicGeral()

  return (
    <div className="min-h-screen bg-black text-gray-200">
      {/* Header com logo (igual ao estilo do automatizador) */}
      <header className="fixed top-0 w-full bg-black/90 backdrop-blur-sm z-50 px-4 py-3">
        <div className="flex justify-center lg:justify-start items-center">
          <Link href="/" className="flex items-center">
            <OptimizedImage src="/ft-icone.png" alt="Futuros Tech Logo" width={40} height={40} className="brightness-0 invert" />
          </Link>
        </div>
      </header>

      <main className="px-4 pt-24 pb-10 mx-auto max-w-7xl">
        {/* Countown section for TESTE GRATUITO do Robô V2 */}
        <section className="mb-10 text-center">
          <Countdown
            target="2025-10-22T12:00:00-03:00"
            label="Contagem regressiva para a liberação do Teste Gratuito do V2"
          />
        </section>
        {/* Video embed (vturb) at the top */}
        <div className="mb-10">
          {/* Custom element provided by vturb */}
          {/* eslint-disable-next-line @next/next/no-sync-scripts */}
          <vturb-smartplayer
            id="vid-68ea8fadd469876bc12a195c"
            style={{ display: 'block', margin: '0 auto', width: '100%' }}
          />
          {/* Load the external player script safely using Next.js Script */}
          <Script
            src="https://scripts.converteai.net/17e2196c-5794-49ef-bd61-857538a02fa6/players/68ea8fadd469876bc12a195c/v4/player.js"
            strategy="afterInteractive"
          />
        </div>

        {/* Galeria: 3 imagens por vez + Ver mais */}
        <Gallery images={images} batch={3} />
      </main>
      {/* Floating WhatsApp button */}
      <a
        href="https://chat.whatsapp.com/I5jrVyC0SPm2PWiQgT1SNu?mode=wwc"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Entrar no grupo do WhatsApp"
        className="fixed bottom-4 right-4 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 ring-1 ring-white/10 transition-colors hover:bg-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
      >
        {/* WhatsApp SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6"
          aria-hidden="true"
        >
          <path d="M20.52 3.48A11.94 11.94 0 0 0 12.06 0C5.46 0 .1 5.36.1 11.96c0 2.1.56 4.14 1.63 5.94L0 24l6.26-1.65a11.86 11.86 0 0 0 5.8 1.48h.01c6.6 0 11.96-5.36 11.96-11.96 0-3.2-1.25-6.2-3.51-8.39ZM12.07 21.4h-.01a9.46 9.46 0 0 1-4.82-1.32l-.35-.2-3.72.98.99-3.63-.23-.37a9.46 9.46 0 1 1 8.14 4.54Zm5.19-7.12c-.28-.14-1.64-.81-1.9-.9-.26-.1-.45-.14-.64.14-.19.29-.73.9-.9 1.08-.17.19-.34.21-.62.07-.28-.14-1.19-.44-2.26-1.41-.84-.75-1.4-1.67-1.57-1.95-.16-.28-.02-.43.12-.57.12-.12.28-.31.42-.47.14-.16.19-.27.29-.45.1-.19.05-.36-.02-.5-.07-.14-.64-1.54-.88-2.12-.23-.56-.47-.48-.64-.49l-.55-.01c-.19 0-.5.07-.76.36-.26.29-1 1-1 2.45 0 1.44 1.02 2.83 1.16 3.03.14.19 2 3.05 4.85 4.28.68.29 1.21.47 1.62.6.68.21 1.3.18 1.79.11.55-.08 1.64-.67 1.87-1.33.23-.66.23-1.22.16-1.33-.07-.1-.26-.18-.54-.32Z"/>
        </svg>
      </a>
    </div>
  )
}
