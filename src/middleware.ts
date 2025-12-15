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

      // Edge: não é permitido usar Prisma aqui. Se isAdmin ainda não está no token,
      // deixe passar para que o JWT callback/população do servidor resolva.
      const isAdmin = (token as any)?.isAdmin
      if (isAdmin === false) {
        console.warn('[Security] Unauthorized admin access attempt:', token?.email)
        return NextResponse.redirect(new URL('/cursos', req.url))
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
        return NextResponse.redirect(new URL(restrictedRoute, req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
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
