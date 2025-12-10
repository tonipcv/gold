import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

/**
 * Verifica se o usuário atual é admin.
 * Redireciona para /login se não autenticado.
 * Redireciona para /cursos se não for admin.
 * 
 * Use no início de qualquer página ou API route admin.
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/login')
  }
  
  if (!(session.user as any).isAdmin) {
    console.warn('[Security] Non-admin user attempted to access admin area:', session.user.email)
    redirect('/cursos')
  }
  
  return session
}

/**
 * Verifica se o usuário atual é admin (para API routes).
 * Retorna a session se for admin, ou null se não for.
 * 
 * Use em API routes onde você precisa retornar um erro em vez de redirecionar.
 */
export async function checkAdmin() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || !(session.user as any).isAdmin) {
    return null
  }
  
  return session
}
