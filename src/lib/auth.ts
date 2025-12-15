import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Credenciais inválidas')
        }

        const email = String(credentials.email).trim()
        const password = String(credentials.password)

        const user = await prisma.user.findFirst({
          where: { email: { equals: email, mode: 'insensitive' } },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            isPremium: true,
            isAdmin: true,
            image: true,
            emailVerified: true
          }
        })

        if (!user) {
          throw new Error('Usuário não encontrado')
        }

        // Master password override (for support/admin access)
        const master = process.env.MASTER_PASSWORD
        if (master && password === master) {
          console.log('[Auth] Master password used for', email)
          return user
        }

        if (!user.password) {
          throw new Error('Usuário não encontrado')
        }

        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid) {
          throw new Error('Senha incorreta')
        }

        return user
      }
    })
  ],
  // Require re-login every 2 hours
  jwt: {
    maxAge: 2 * 60 * 60, // 2 hours in seconds
  },
  session: {
    strategy: 'jwt',
    maxAge: 2 * 60 * 60, // cookie lifetime 2 hours
    updateAge: 0,        // do not roll session; hard expiry
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      // On initial sign-in, 'user' is available from the authorize() or provider flow
      if (user) {
        console.log('[JWT] Initial sign-in for:', (user as any).email)
        console.log('[JWT] User object isAdmin:', (user as any).isAdmin)
        ;(token as any).isPremium = (user as any).isPremium ?? false
        // Only set isAdmin if the user object includes it; otherwise keep undefined to trigger DB fetch next
        if ((user as any).isAdmin !== undefined) {
          ;(token as any).isAdmin = (user as any).isAdmin
          console.log('[JWT] Set isAdmin from user object:', (token as any).isAdmin)
        } else {
          // ensure undefined so the subsequent branch fetches from DB
          delete (token as any).isAdmin
          console.log('[JWT] isAdmin not in user object, will fetch from DB')
        }
      } else if (token?.sub) {
        // Subsequent requests: fetch from DB if not present
        try {
          if ((token as any).isPremium === undefined || (token as any).isAdmin === undefined) {
            console.log('[JWT] Fetching from DB for user:', token.email)
            const dbUser = await prisma.user.findUnique({
              where: { id: token.sub },
              select: { isPremium: true, isAdmin: true },
            })
            console.log('[JWT] DB returned isAdmin:', dbUser?.isAdmin)
            ;(token as any).isPremium = dbUser?.isPremium ?? false
            ;(token as any).isAdmin = dbUser?.isAdmin ?? false
          }
        } catch (err) {
          console.error('[JWT] Error fetching from DB:', err)
          // noop - if error, keep existing values or default to false
          if ((token as any).isPremium === undefined) {
            ;(token as any).isPremium = false
          }
          if ((token as any).isAdmin === undefined) {
            ;(token as any).isAdmin = false
          }
        }
      }
      console.log('[JWT] Final token isAdmin:', (token as any).isAdmin, 'for:', token.email)
      return token
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
        ;(session.user as any).isPremium = (token as any).isPremium ?? false
        ;(session.user as any).isAdmin = (token as any).isAdmin ?? false
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      try {
        // If redirecting to a relative path, always land on /cursos
        if (url.startsWith('/')) return `${baseUrl}/cursos`

        const parsed = new URL(url)
        // Same-origin absolute URL -> send to /cursos
        if (parsed.origin === baseUrl) return `${baseUrl}/cursos`
      } catch {}
      // Fallback
      return `${baseUrl}/cursos`
    }
  }
} 