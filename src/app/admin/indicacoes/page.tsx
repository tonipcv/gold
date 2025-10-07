"use client";

import { useEffect, useMemo, useState, FormEvent } from "react";

type ReferralItem = {
  id: string;
  name: string;
  purchaseEmail: string;
  whatsapp: string;
  friendsCount: number;
  coupon: string | null;
  isActive: boolean | null;
  createdAt: string;
};

type ApiResponse = {
  items: ReferralItem[];
  total: number;
  page: number;
  pageSize: number;
};

export default function AdminIndicacoesPage() {
  const [accessGranted, setAccessGranted] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  const [items, setItems] = useState<ReferralItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  const fetchData = async (opts?: { page?: number; pageSize?: number; search?: string }) => {
    try {
      setLoading(true);
      setError(null);
      const p = opts?.page ?? page;
      const ps = opts?.pageSize ?? pageSize;
      const s = opts?.search ?? search;
      const params = new URLSearchParams({ page: String(p), pageSize: String(ps) });
      if (s) params.set("search", s);
      const res = await fetch(`/api/admin/indicacoes?${params.toString()}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Falha ao carregar dados");
      }
      const data: ApiResponse = await res.json();
      setItems(data.items || []);
      setTotal(data.total || 0);
      setPage(data.page || 1);
      setPageSize(data.pageSize || 20);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessGranted) {
      fetchData({ page: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessGranted]);

  const handlePasswordVerification = (e: FormEvent) => {
    e.preventDefault();
    // Segue o mesmo padrão de /admin/formularios
    if (adminPassword === "admin123") {
      setAccessGranted(true);
      setError(null);
    } else {
      setError("Senha incorreta para acesso à área de administração");
    }
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetchData({ page: 1, search });
  };

  const updateItem = async (id: string, patch: Partial<Pick<ReferralItem, "coupon" | "isActive">>) => {
    try {
      const res = await fetch(`/api/admin/indicacoes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Falha ao atualizar');
      }
      const data = await res.json();
      const updated: ReferralItem = data.item;
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...updated } : it)));
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar');
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 font-satoshi tracking-[-0.03em]">
      {/* Header */}
      <header className="fixed top-0 w-full bg-black/90 backdrop-blur-sm z-50 px-4 py-3 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <a href="/" className="flex items-center">
            <img src="/ft-icone.png" alt="Futuros Tech Logo" className="h-8 w-auto" />
          </a>
          <div className="text-lg font-bold text-[#5a96f4]">Admin - Indicações</div>
          <div className="w-8"></div>
        </div>
      </header>

      <main className="pt-16 pb-20 px-4">
        {!accessGranted ? (
          <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800/30 rounded-lg border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-[#5a96f4]">Acesso Restrito</h2>
            <form onSubmit={handlePasswordVerification}>
              <div className="mb-4">
                <label htmlFor="adminPassword" className="block text-sm font-medium mb-1">
                  Senha de Administrador
                </label>
                <input
                  type="password"
                  id="adminPassword"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a96f4]"
                  required
                />
              </div>
              {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
              <button
                type="submit"
                className="w-full bg-[#5a96f4] text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
              >
                Acessar
              </button>
            </form>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
              <h1 className="text-2xl font-bold text-[#5a96f4]">Solicitações de Bônus por Indicação</h1>
              <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Buscar por nome, e-mail ou whatsapp..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full md:w-96 p-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a96f4]"
                />
                <button type="submit" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md">
                  Buscar
                </button>
              </form>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-md text-red-300">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5a96f4]"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800/30 rounded-lg overflow-hidden">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Nome</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">E-mail</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">WhatsApp</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Amigos</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Cupom</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Ativo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Criado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-6 text-center text-gray-400">Nenhum registro encontrado</td>
                      </tr>
                    ) : (
                      items.map((it) => (
                        <tr key={it.id} className="hover:bg-gray-700/30">
                          <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-100">{it.name}</td>
                          <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-100">{it.purchaseEmail}</td>
                          <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-100">{it.whatsapp}</td>
                          <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-100">{it.friendsCount}</td>
                          <td className="px-6 py-3 whitespace-nowrap">
                            <input
                              type="text"
                              defaultValue={it.coupon ?? ''}
                              onBlur={(e) => {
                                const val = e.target.value.trim();
                                if (val !== (it.coupon ?? '')) {
                                  updateItem(it.id, { coupon: val || null });
                                }
                              }}
                              className="w-40 p-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a96f4] text-sm text-gray-100"
                              placeholder="Cupom"
                            />
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap">
                            <button
                              onClick={() => updateItem(it.id, { isActive: !(it.isActive ?? false) })}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                it.isActive ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {it.isActive ? 'Sim' : 'Não'}
                            </button>
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-300">{new Date(it.createdAt).toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-400">
                Página {page} de {totalPages} — {total} registro(s)
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchData({ page: Math.max(1, page - 1) })}
                  disabled={page <= 1 || loading}
                  className={`px-3 py-2 rounded-md ${page <= 1 || loading ? 'bg-gray-800 text-gray-500' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                  Anterior
                </button>
                <button
                  onClick={() => fetchData({ page: Math.min(totalPages, page + 1) })}
                  disabled={page >= totalPages || loading}
                  className={`px-3 py-2 rounded-md ${page >= totalPages || loading ? 'bg-gray-800 text-gray-500' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                  Próxima
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
