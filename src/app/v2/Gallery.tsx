"use client"

import Link from 'next/link'
import React from 'react'

export function Gallery({ images, batch = 3 }: { images: string[]; batch?: number }) {
  const [visibleCount, setVisibleCount] = React.useState(Math.min(batch, images.length))

  const canShowMore = visibleCount < images.length
  const onShowMore = () => setVisibleCount((v) => Math.min(v + batch, images.length))

  if (!images || images.length === 0) {
    return (
      <p className="text-gray-300">
        Nenhuma imagem encontrada em <code>public/geral/</code>.
      </p>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {images.slice(0, visibleCount).map((src) => (
          <div key={src} className="group">
            <Link href={src} target="_blank" rel="noopener noreferrer" className="block">
              <div className="relative w-full overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 aspect-[6/13]">
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

      {canShowMore && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onShowMore}
            className="inline-flex items-center rounded-md bg-white/10 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/15 transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            Ver mais
          </button>
        </div>
      )}
    </div>
  )
}
