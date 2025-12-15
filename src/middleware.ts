// middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token
    
    // Proteção de rotas admin - CRÍTICO (Edge-safe)
    if (req.nextUrl.pathname.startsWith('/admin')) {
      console.log('[Middleware] Admin route access attempt')
      console.log('[Middleware] Email:', token?.email)
      console.log('[Middleware] Token isAdmin:', (token as any)?.isAdmin)
      console.log('[Middleware] Token isPremium:', (token as any)?.isPremium)

      const pathname = req.nextUrl.pathname
      const host = req.headers.get('host') ?? ''
      const proto = req.headers.get('x-forwarded-proto') ?? ''
      const cookieHeader = req.headers.get('cookie') ?? ''
      const hasSessionCookie = /(?:__Secure-)?next-auth\.session-token=/.test(cookieHeader)
      console.log('[AuthEdge]', JSON.stringify({ path: pathname, host, proto, hasToken: !!token, email: token?.email, isAdmin: (token as any)?.isAdmin, hasSessionCookie }))

      // Edge: não é permitido usar Prisma aqui. Se isAdmin ainda não está no token,
      // deixe passar para que o JWT callback/população do servidor resolva.
      const isAdmin = (token as any)?.isAdmin
      if (isAdmin === false) {
        console.warn('[Security] Unauthorized admin access attempt:', token?.email)
        const res = NextResponse.redirect(new URL('/cursos', req.url))
        res.headers.set('X-Auth-Reason', 'NON_ADMIN')
        res.headers.set('X-Auth-Email', String(token?.email ?? ''))
        res.headers.set('X-Auth-HasToken', String(!!token))
        res.headers.set('X-Auth-HasSessionCookie', String(hasSessionCookie))
        return res
      }
      // isAdmin === true -> permitido; isAdmin === undefined -> permitir e deixar o server validar
      console.log('[Middleware] Pass-through (isAdmin:', isAdmin, ') for:', token?.email)
    }
    
    // Rotas premium e suas versões restritas
    const premiumRoutes = {
      '/chat': '/chat-restrito',
      '/series': '/series-restrito',
      '/grafico': '/grafico-restrito'
    }

    // Verifica acesso premium
    if (premiumRoutes[req.nextUrl.pathname as keyof typeof premiumRoutes]) {
      if (!token?.isPremium) {
        const restrictedRoute = premiumRoutes[req.nextUrl.pathname as keyof typeof premiumRoutes]
        const res = NextResponse.redirect(new URL(restrictedRoute, req.url))
        res.headers.set('X-Auth-Reason', 'PREMIUM_REQUIRED')
        res.headers.set('X-Auth-Email', String(token?.email ?? ''))
        res.headers.set('X-Auth-HasToken', String(!!token))
        return res
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        const has = !!token
        if (!has) {
          try {
            // Minimal diagnostics when no token is present
            // Note: cannot set headers here, only log
            console.warn('[AuthEdge] No token in authorized()')
          } catch {}
        }
        return has
      }
    },
    pages: {
      signIn: '/login',
    },
  }
)

// Configurar quais rotas devem ser protegidas
export const config = {
  matcher: [
    '/admin/:path*',
    '/chat',
    '/chat-restrito',
    '/series',
    '/series-restrito',
    '/grafico',
    '/grafico-restrito',
    '/assinatura',
    '/relatorio'
  ]
}
