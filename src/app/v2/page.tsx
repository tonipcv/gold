import fs from 'fs/promises'
import path from 'path'
import Link from 'next/link'
import { OptimizedImage } from '../components/OptimizedImage'

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
        {images.length === 0 ? (
          <p className="text-gray-300">Nenhuma imagem encontrada em <code>public/geral/</code>.</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {images.map((src) => (
              <div key={src} className="group">
                <Link href={src} target="_blank" rel="noopener noreferrer" className="block">
                  <div className="relative w-full overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 aspect-[6/13]">
                    {/* Using native img to avoid needing explicit dimensions */}
                    <img
                      src={src}
                      alt={src.split('/').pop() || 'Imagem da galeria'}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
