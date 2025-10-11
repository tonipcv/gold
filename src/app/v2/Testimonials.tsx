"use client"

import React from 'react'

type Testimonial = {
  name: string
  role?: string
  text: string
}

export function Testimonials({ items, batch = 3 }: { items: Testimonial[]; batch?: number }) {
  const [visibleCount, setVisibleCount] = React.useState(Math.min(batch, items.length))

  const canShowMore = visibleCount < items.length

  const onShowMore = () => setVisibleCount((v) => Math.min(v + batch, items.length))

  return (
    <section className="mx-auto mb-12 max-w-4xl">
      <h2 className="mb-4 text-center text-xl font-semibold text-white">Depoimentos</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.slice(0, visibleCount).map((t, idx) => (
          <blockquote
            key={idx}
            className="rounded-lg border border-neutral-800 bg-neutral-900/80 p-4 text-gray-200 shadow-sm"
          >
            <p className="mb-3 text-sm leading-relaxed text-gray-300">“{t.text}”</p>
            <footer className="text-xs text-gray-400">
              <span className="font-medium text-gray-200">{t.name}</span>
              {t.role ? <span className="text-gray-500"> • {t.role}</span> : null}
            </footer>
          </blockquote>
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
    </section>
  )
}
