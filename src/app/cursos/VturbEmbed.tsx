'use client'

import { useEffect } from 'react'

export default function VturbEmbed({ playerId, accountId = '70b43777-e359-4c77-af2c-366de25a153d' }: { playerId: string; accountId?: string }) {
  const containerId = `vturb-container-${playerId}`

  useEffect(() => {
    if (typeof window === 'undefined') return
    const container = document.getElementById(containerId)
    if (!container) return

    container.innerHTML = ''
    const playerEl = document.createElement('vturb-smartplayer') as any
    playerEl.id = `vid-${playerId}`
    ;(playerEl as HTMLElement).style.display = 'block'
    ;(playerEl as HTMLElement).style.margin = '0 auto'
    ;(playerEl as HTMLElement).style.width = '100%'
    container.appendChild(playerEl)

    try {
      const prev = Array.from(document.querySelectorAll(`script[data-vturb-player="${playerId}"]`))
      prev.forEach((n) => n.parentElement?.removeChild(n))
    } catch {}

    const s = document.createElement('script')
    s.src = `https://scripts.converteai.net/${accountId}/players/${playerId}/v4/player.js`
    s.async = true
    s.setAttribute('data-vturb-player', playerId)
    document.head.appendChild(s)

    return () => {
      try { document.head.removeChild(s) } catch {}
      try { container.innerHTML = '' } catch {}
    }
  }, [playerId, containerId, accountId])

  return <div id={containerId} className="w-full" />
}
