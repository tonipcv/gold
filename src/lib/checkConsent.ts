import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export async function checkConsentOrRedirect() {
  const requiredVersion = 'v3.0'
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    redirect('/login?needConsent=1')
  }

  // Verify consent exists in database
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) {
    redirect('/login?needConsent=1')
  }

  const consentRecord = await prisma.consentLog.findFirst({
    where: {
      userId: user.id,
      consentType: 'terms-of-use',
    },
    orderBy: { acceptedAt: 'desc' },
  })

  if (!consentRecord || consentRecord.textVersion !== requiredVersion) {
    redirect('/login?needConsent=1')
  }

  return { session, user, consentRecord }
}
