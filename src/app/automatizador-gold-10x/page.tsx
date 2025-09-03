import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AutomatizadorGold10xClient from './Client'

export default async function AutomatizadorGold10xPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }

  return <AutomatizadorGold10xClient />
}
