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

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          throw new Error('Usuário não encontrado')
        }

        const isValid = await bcrypt.compare(credentials.password, user.password)

        if (!isValid) {
          throw new Error('Senha incorreta')
        }

        return user
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      // On initial sign-in, user is available
      if (user) {
        ;(token as any).isPremium = (user as any).isPremium ?? false
      } else if (token?.sub) {
        // On subsequent requests, fetch from DB if not present
        try {
          if ((token as any).isPremium === undefined) {
            const dbUser = await prisma.user.findUnique({ where: { id: token.sub } })
            ;(token as any).isPremium = dbUser?.isPremium ?? false
          }
        } catch {
          // noop
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
        ;(session.user as any).isPremium = (token as any).isPremium ?? false
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