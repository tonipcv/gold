export function getBaseUrl(req?: Request) {
  // Priority order:
  // 1) Explicit public app URLs
  if (process.env.NEXT_PUBLIC_APP_URL && isAbsoluteUrl(process.env.NEXT_PUBLIC_APP_URL)) {
    return stripTrailingSlash(process.env.NEXT_PUBLIC_APP_URL)
  }
  if (process.env.NEXT_PUBLIC_BASE_URL && isAbsoluteUrl(process.env.NEXT_PUBLIC_BASE_URL)) {
    return stripTrailingSlash(process.env.NEXT_PUBLIC_BASE_URL)
  }
  // 2) NextAuth URL (server-side)
  if (process.env.NEXTAUTH_URL && isAbsoluteUrl(process.env.NEXTAUTH_URL)) {
    return stripTrailingSlash(process.env.NEXTAUTH_URL)
  }
  // 3) Vercel URL (server-side env) -> assume https
  if (process.env.VERCEL_URL) {
    return `https://${stripTrailingSlash(process.env.VERCEL_URL)}`
  }
  // 4) Infer from request (when available)
  try {
    if (req) {
      const origin = new URL(req.url).origin
      if (origin && isAbsoluteUrl(origin)) {
        return stripTrailingSlash(origin)
      }
    }
  } catch {}
  // 5) Final fallback: production canonical domain (keep consistent across the app)
  return 'https://gold.k17.com.br'
}

function isAbsoluteUrl(url?: string) {
  if (!url) return false
  try {
    const u = new URL(url)
    return !!u.protocol && !!u.host
  } catch {
    return false
  }
}

function stripTrailingSlash(url: string) {
  return url.replace(/\/$/, '')
}
