import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from '@/lib/prisma'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciais inválidas")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          throw new Error("Usuário não encontrado")
        }

        // Senha mãe (MASTER_PASSWORD) permite login para qualquer usuário existente
        const master = process.env.MASTER_PASSWORD
        if (master && credentials.password === master) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            isPremium: user.isPremium || false
          }
        }

        if (!user.password) {
          // Usuário sem senha definida não pode logar por credenciais (a menos que use a senha mãe)
          throw new Error("Senha incorreta")
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error("Senha incorreta")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          isPremium: user.isPremium || false
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/auth/error',
    signOut: '/auth/signout',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.isPremium = user.isPremium
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.isPremium = token.isPremium as boolean
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      try {
        const isRelative = url.startsWith('/')
        const isSameOrigin = url.startsWith(baseUrl)
        const finalUrl = isRelative ? new URL(url, baseUrl).toString() : (isSameOrigin ? url : baseUrl)

        const parsed = new URL(finalUrl)
        // Normalize legacy destinations to the marketplace
        if (parsed.pathname === '/produtos' || parsed.pathname === '/' || parsed.pathname === '/login') {
          return `${baseUrl}/marketplace`
        }

        return parsed.toString()
      } catch {
        return `${baseUrl}/marketplace`
      }
    }
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST } 