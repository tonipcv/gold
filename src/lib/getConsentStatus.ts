import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function getConsentStatus(requiredVersion = 'v3.0') {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return { ok: false, reason: 'no-session' as const }
  }

  const user = await prisma.user.findUnique({ 
    where: { email: session.user.email },
    select: { id: true, email: true, name: true, isPremium: true }
  })
  if (!user) {
    return { ok: false, reason: 'no-user' as const }
  }

  const consentRecord = await prisma.consentLog.findFirst({
    where: { userId: user.id, consentType: 'terms-of-use' },
    orderBy: { acceptedAt: 'desc' },
  })

  if (!consentRecord || consentRecord.textVersion !== requiredVersion) {
    return { ok: false, reason: 'no-consent' as const, user }
  }

  return { ok: true, user, consentRecord }
}
