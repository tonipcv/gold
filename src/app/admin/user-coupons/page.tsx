'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

export default function AdminUserCouponsPage() {
  const [accessGranted, setAccessGranted] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [userId, setUserId] = useState<string>('')
  const [coupon, setCoupon] = useState('')
  const [link, setLink] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // Listagem
  type Row = { id: string; name: string | null; email: string; coupon: string; link: string; isActive: boolean; saving?: boolean }
  const [rows, setRows] = useState<Row[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [total, setTotal] = useState(0)
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize])
  const [search, setSearch] = useState('')
  const [activeOnly, setActiveOnly] = useState(false)
  const [activeCount, setActiveCount] = useState(0)
  const [inactiveCount, setInactiveCount] = useState(0)

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminPassword === 'admin123') {
      setAccessGranted(true)
      setError(null)
    } else {
      setError('Senha incorreta para acesso à área de administração')
    }
  }

  // Helpers de sugestão
  const suggestCoupon = (email: string) => {
    const local = email.split('@')[0] || 'user'
    // Ex: LOCAL-UPPER + 10 (só exemplo simples)
    return `${local.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}10`
  }
  const suggestLink = (coupon: string) => `/automacao-bonus?coupon=${encodeURIComponent(coupon)}`

  // Carregar lista
  const loadList = async (opts?: { p?: number; q?: string; active?: boolean }) => {
    try {
      setLoading(true)
      setError(null)
      const p = opts?.p ?? page
      const q = (opts?.q ?? search).trim()
      const onlyActive = typeof opts?.active === 'boolean' ? opts.active : activeOnly
      const params = new URLSearchParams({ list: '1', page: String(p), pageSize: String(pageSize) })
      if (q) params.set('q', q)
      if (onlyActive) params.set('active', '1')
      const res = await fetch(`/api/admin/user-coupons?${params.toString()}`)
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Falha ao carregar lista')
      }
      const data = await res.json()
      const items: Row[] = (data?.items || []).map((r: any) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        coupon: r.coupon || '',
        link: r.link || '',
        isActive: !!r.isActive,
      }))
      setRows(items)
      setPage(data?.page || 1)
      setPageSize(data?.pageSize || 20)
      setTotal(data?.total || items.length)
      setActiveCount(data?.activeCount || 0)
      setInactiveCount(data?.inactiveCount || 0)
    } catch (e: any) {
      setError(e?.message || 'Erro ao carregar lista')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (accessGranted) loadList({ p: 1 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessGranted])

  useEffect(() => {
    if (accessGranted) loadList({ p: 1, q: search, active: activeOnly })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeOnly])

  const handleLoad = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)
      setLoaded(false)
      setUserId('')

      const res = await fetch(`/api/admin/user-coupons?email=${encodeURIComponent(email.trim())}`)
      if (res.status === 404) {
        setError('Usuário não encontrado')
        return
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Falha ao buscar cupom')
      }
      const data = await res.json()
      // Se veio item, popular. Caso contrário, buscar userId por email
      if (data?.item) {
        setUserId(data.item.userId)
        setCoupon(data.item.coupon || '')
        setLink(data.item.link || '')
        setIsActive(!!data.item.isActive)
        setLoaded(true)
        return
      }
      // Tenta resolver userId para permitir criar o primeiro cupom
      const u = await fetch(`/api/admin/user-coupons?email=${encodeURIComponent(email.trim())}`)
      if (u.status === 404) {
        setError('Usuário não encontrado')
        return
      }
      // Se não tem item mas não 404, ao menos temos usuário válido via mesma rota (já tratada)
      setLoaded(true)
    } catch (e: any) {
      setError(e?.message || 'Erro ao carregar')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      if (!email.trim() || !coupon.trim() || !link.trim()) {
        setError('Preencha e-mail, cupom e link')
        return
      }
      const res = await fetch('/api/admin/user-coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), coupon: coupon.trim(), link: link.trim(), isActive }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Falha ao salvar')
      setSuccess('Cupom salvo com sucesso')
    } catch (e: any) {
      setError(e?.message || 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  // Salvar uma linha (upsert)
  const saveRow = async (r: Row) => {
    try {
      setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, saving: true } : x)))
      const res = await fetch('/api/admin/user-coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: r.id, coupon: r.coupon.trim(), link: r.link.trim(), isActive: r.isActive }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Falha ao salvar')
      setSuccess('Cupom salvo')
      setTimeout(() => setSuccess(null), 2000)
    } catch (e: any) {
      setError(e?.message || 'Erro ao salvar')
      setTimeout(() => setError(null), 2500)
    } finally {
      setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, saving: false } : x)))
    }
  }

  // Sugerir todos
  const suggestAll = () => {
    setRows((prev) =>
      prev.map((r) => {
        const c = r.coupon?.trim() || suggestCoupon(r.email)
        return { ...r, coupon: c, link: suggestLink(c) }
      })
    )
  }

  return (
    <div className="min-h-screen bg-black text-gray-200 font-satoshi tracking-[-0.03em]">
      {/* Header */}
      <header className="fixed top-0 w-full bg-black/90 backdrop-blur-sm z-50 px-4 py-3 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <img src="/ft-icone.png" alt="Futuros Tech Logo" className="h-8 w-auto" />
          </Link>
          <div className="text-lg font-bold text-[#5a96f4]">Admin - Cupons de Usuário</div>
          <div className="w-8"></div>
        </div>
      </header>

      <main className="pt-16 pb-20 px-4">
        {!accessGranted ? (
          <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800/30 rounded-lg border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-[#5a96f4]">Acesso Restrito</h2>
            <form onSubmit={handleVerify}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Senha de Administrador</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a96f4]"
                  required
                />
              </div>
              {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
              <button type="submit" className="w-full bg-[#5a96f4] text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
                Acessar
              </button>
            </form>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-[#5a96f4] mb-4">Gerenciar Cupons de Usuários</h1>

            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-md text-red-300">{error}</div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-900/30 border border-green-800 rounded-md text-green-300">{success}</div>
            )}

            {/* Resumo */}
            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-md border border-gray-700 bg-gray-800/40">
                <div className="text-xs text-gray-400">Usuários</div>
                <div className="text-xl font-semibold">{total}</div>
              </div>
              <div className="p-3 rounded-md border border-green-800 bg-green-900/20">
                <div className="text-xs text-green-300">Com cupom ativo</div>
                <div className="text-xl font-semibold text-green-300">{activeCount}</div>
              </div>
              <div className="p-3 rounded-md border border-yellow-800 bg-yellow-900/20">
                <div className="text-xs text-yellow-300">Com cupom inativo</div>
                <div className="text-xl font-semibold text-yellow-300">{inactiveCount}</div>
              </div>
            </div>

            {/* Filtros */}
            <div className="flex flex-col md:flex-row gap-2 md:items-end mb-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-300 mb-1">Buscar por nome ou e-mail</label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a96f4]"
                  placeholder="Digite para filtrar..."
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-2 text-sm text-gray-300">
                  <input type="checkbox" checked={activeOnly} onChange={(e) => setActiveOnly(e.target.checked)} />
                  Somente ativos
                </label>
              </div>
              <button onClick={() => loadList({ p: 1, q: search, active: activeOnly })} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md">Buscar</button>
            </div>

            {/* Tabela */}
            {loading ? (
              <div className="flex justify-center items-center h-40"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#5a96f4]"></div></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800/30 rounded-lg overflow-hidden">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Usuário</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">E-mail</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cupom</th>
                      
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ativo</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {rows.length === 0 ? (
                      <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">Nenhum usuário encontrado</td></tr>
                    ) : rows.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-700/30">
                        <td className="px-4 py-2 text-sm">{r.name || 'Sem nome'}</td>
                        <td className="px-4 py-2 text-sm text-gray-300">{r.email}</td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={r.coupon}
                            onChange={(e) => setRows((prev) => prev.map((x) => x.id === r.id ? { ...x, coupon: e.target.value } : x))}
                            className="w-40 p-2 bg-gray-900 border border-gray-700 rounded-md text-sm"
                            placeholder="PROMO10"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => setRows((prev) => prev.map((x) => x.id === r.id ? { ...x, isActive: !x.isActive } : x))}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${r.isActive ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                          >
                            {r.isActive ? 'Sim' : 'Não'}
                          </button>
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => saveRow(r)}
                            disabled={r.saving}
                            className={`px-3 py-1.5 text-xs rounded-md ${r.saving ? 'bg-gray-700 text-gray-400' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                          >
                            {r.saving ? 'Salvando...' : 'Salvar'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Paginação */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-400">Página {page} de {totalPages} — {total} registro(s)</div>
              <div className="flex gap-2">
                <button onClick={() => loadList({ p: Math.max(1, page - 1) })} disabled={page <= 1 || loading} className={`px-3 py-2 rounded-md ${page <= 1 || loading ? 'bg-gray-800 text-gray-500' : 'bg-gray-700 hover:bg-gray-600'}`}>Anterior</button>
                <button onClick={() => loadList({ p: Math.min(totalPages, page + 1) })} disabled={page >= totalPages || loading} className={`px-3 py-2 rounded-md ${page >= totalPages || loading ? 'bg-gray-800 text-gray-500' : 'bg-gray-700 hover:bg-gray-600'}`}>Próxima</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
