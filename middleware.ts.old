import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/cursos')) {
    // Verify user is authenticated (DB consent check happens server-side in pages)
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token?.email) {
      const url = new URL('/login', req.url)
      return NextResponse.redirect(url)
    }
  }

  if (pathname.startsWith('/admin')) {
    // Protect all /admin routes behind a simple Basic Auth using ADMIN_TOKEN
    const adminToken = process.env.ADMIN_TOKEN
    const auth = req.headers.get('authorization') || ''

    const unauthorized = () => {
      const realm = `Admin-${Date.now()}` // dynamic realm to avoid credential reuse
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: { 'WWW-Authenticate': `Basic realm="${realm}"` },
      })
    }

    if (!adminToken) {
      // If no token configured, deny access by default
      return unauthorized()
    }

    if (!auth.startsWith('Basic ')) {
      return unauthorized()
    }

    try {
      const base64 = auth.slice(6)
      // atob is available in the Edge runtime
      const decoded = atob(base64)
      // format is username:password, we only validate password equals ADMIN_TOKEN
      const idx = decoded.indexOf(':')
      const password = idx >= 0 ? decoded.slice(idx + 1) : ''
      if (password !== adminToken) {
        return unauthorized()
      }
    } catch {
      return unauthorized()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/cursos/:path*', '/admin/:path*'],
}
