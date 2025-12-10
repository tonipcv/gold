import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminAuth'

const REQUIRED_VERSION = 'v3.0'

export default async function AdminConsentsPage() {
  await requireAdmin()
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      consentLogs: {
        where: { consentType: 'terms-of-use' },
        orderBy: { acceptedAt: 'desc' },
        take: 1,
      },
    },
  })

  const rows = users.map((u) => {
    const last = u.consentLogs[0]
    const status = !last
      ? 'MISSING'
      : last.textVersion === REQUIRED_VERSION
      ? 'ACCEPTED_V3'
      : `OUTDATED_${last.textVersion ?? 'unknown'}`

    return {
      id: u.id,
      name: u.name ?? '-',
      email: u.email,
      consentVersion: last?.textVersion ?? '-',
      acceptedAt: last?.acceptedAt ?? null,
      status,
    }
  })

  const totalUsers = rows.length
  const totalAccepted = rows.filter((r) => r.status === 'ACCEPTED_V3').length
  const totalMissing = rows.filter((r) => r.status === 'MISSING').length
  const totalOutdated = rows.filter((r) => r.status !== 'MISSING' && r.status !== 'ACCEPTED_V3').length

  return (
    <div className="min-h-screen bg-black text-gray-200 font-satoshi tracking-[-0.03em] p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Compliance • Termos de Uso</h1>
        <a
          href="/admin/consents.csv"
          className="text-sm px-3 py-2 border border-white/30 rounded-lg hover:bg-white/10"
        >
          Exportar CSV
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
        <div className="border border-white/10 rounded-xl p-4">
          <div className="text-xs text-white/60">Total de usuários</div>
          <div className="text-2xl font-semibold mt-1">{totalUsers}</div>
        </div>
        <div className="border border-emerald-500/20 rounded-xl p-4">
          <div className="text-xs text-emerald-300/80">Aceitos v3.0</div>
          <div className="text-2xl font-semibold mt-1 text-emerald-400">{totalAccepted}</div>
        </div>
        <div className="border border-amber-500/20 rounded-xl p-4">
          <div className="text-xs text-amber-300/80">Aceitos (versão antiga)</div>
          <div className="text-2xl font-semibold mt-1 text-amber-400">{totalOutdated}</div>
        </div>
        <div className="border border-red-500/20 rounded-xl p-4">
          <div className="text-xs text-red-300/80">Não aceitos</div>
          <div className="text-2xl font-semibold mt-1 text-red-400">{totalMissing}</div>
        </div>
      </div>

      <div className="overflow-x-auto border border-white/10 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr className="text-left">
              <th className="p-3">Nome</th>
              <th className="p-3">Email</th>
              <th className="p-3">Status</th>
              <th className="p-3">Versão</th>
              <th className="p-3">Aceito em</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-white/10">
                <td className="p-3">{r.name}</td>
                <td className="p-3">{r.email}</td>
                <td className="p-3">
                  {r.status === 'MISSING' && (
                    <span className="text-red-400">Não aceitou</span>
                  )}
                  {r.status === 'ACCEPTED_V3' && (
                    <span className="text-emerald-400">Aceito (v3.0)</span>
                  )}
                  {r.status !== 'MISSING' && r.status !== 'ACCEPTED_V3' && (
                    <span className="text-amber-400">Aceito (versão antiga)</span>
                  )}
                </td>
                <td className="p-3">{r.consentVersion}</td>
                <td className="p-3">{r.acceptedAt ? new Date(r.acceptedAt).toLocaleString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-white/50">
        Exigindo versão: {REQUIRED_VERSION}. Itens marcados como "versão antiga" deverão aceitar novamente.
      </p>
    </div>
  )
}
