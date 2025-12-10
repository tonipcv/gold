// middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token
    
    // Proteção de rotas admin - CRÍTICO
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (!(token as any)?.isAdmin) {
        console.warn('[Security] Unauthorized admin access attempt:', token?.email)
        return NextResponse.redirect(new URL('/cursos', req.url))
      }
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
