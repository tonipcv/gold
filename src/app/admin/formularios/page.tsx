"use client";

import { useEffect, useMemo, useState, FormEvent } from "react";

type Formulario = {
  id: string;
  name: string;
  purchaseEmail: string;
  whatsapp: string;
  accountNumber: string;
  createdAt: string;
};

type ApiResponse = {
  items: Formulario[];
  total: number;
  page: number;
  pageSize: number;
};

export default function AdminFormulariosPage() {
  const [accessGranted, setAccessGranted] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  const [items, setItems] = useState<Formulario[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

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
      const res = await fetch(`/api/formulario-liberacao?${params.toString()}`);
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

  const exportAllCSV = async () => {
    try {
      setExporting(true);
      setError(null);

      // Fetch first page with max pageSize to get total
      const MAX_PS = 200;
      const params = new URLSearchParams({ page: String(1), pageSize: String(MAX_PS) });
      if (search) params.set("search", search);

      const firstRes = await fetch(`/api/formulario-liberacao?${params.toString()}`);
      if (!firstRes.ok) {
        const data = await firstRes.json().catch(() => ({}));
        throw new Error(data?.error || "Falha ao carregar dados para exportação");
      }
      const firstData: ApiResponse = await firstRes.json();
      const allItems: Formulario[] = [...(firstData.items || [])];

      const totalRecords = firstData.total || 0;
      const totalPagesAll = Math.max(1, Math.ceil(totalRecords / MAX_PS));

      if (totalPagesAll > 1) {
        // Fetch remaining pages in parallel
        const fetches = [] as Promise<Response>[];
        for (let p = 2; p <= totalPagesAll; p++) {
          const pParams = new URLSearchParams({ page: String(p), pageSize: String(MAX_PS) });
          if (search) pParams.set("search", search);
          fetches.push(fetch(`/api/formulario-liberacao?${pParams.toString()}`));
        }
        const results = await Promise.all(fetches);
        for (const res of results) {
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data?.error || "Falha ao carregar dados em uma das páginas");
          }
          const data: ApiResponse = await res.json();
          allItems.push(...(data.items || []));
        }
      }

      // Build CSV from allItems
      const headers = [
        "ID",
        "Nome",
        "Email de Compra",
        "Whatsapp",
        "Número de Conta",
        "Criado Em",
      ];
      const rows = allItems.map((it) => [
        it.id,
        it.name,
        it.purchaseEmail,
        it.whatsapp,
        it.accountNumber,
        new Date(it.createdAt).toLocaleString(),
      ]);

      const csvContent = [headers, ...rows]
        .map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
        .join("\n");

      const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `formularios_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || "Erro ao exportar CSV");
    } finally {
      setExporting(false);
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
          <div className="text-lg font-bold text-[#5a96f4]">Admin - Formulários de Liberação</div>
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
              <h1 className="text-2xl font-bold text-[#5a96f4]">Formulários Recebidos</h1>
              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-auto">
                  <input
                    type="text"
                    placeholder="Buscar por nome, email, whatsapp..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-80 p-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a96f4]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md"
                  >
                    Buscar
                  </button>
                </form>
                <button
                  onClick={exportAllCSV}
                  disabled={exporting || (total === 0 && items.length === 0)}
                  className={`px-4 py-2 rounded-md ${exporting || (total === 0 && items.length === 0) ? 'bg-gray-800 text-gray-500' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                >
                  {exporting ? 'Exportando…' : 'Exportar CSV (todos)'}
                </button>
              </div>
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
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nome</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email de Compra</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Whatsapp</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Número de Conta</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Criado Em</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-gray-400">Nenhum registro encontrado</td>
                      </tr>
                    ) : (
                      items.map((it) => (
                        <tr key={it.id} className="hover:bg-gray-700/30">
                          <td className="px-4 py-3 align-top">
                            <div className="font-medium">{it.name}</div>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <div className="text-sm text-gray-200">{it.purchaseEmail}</div>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <div className="text-sm text-gray-200">{it.whatsapp}</div>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <div className="text-sm text-gray-200">{it.accountNumber}</div>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <div className="text-xs text-gray-400">{new Date(it.createdAt).toLocaleString()}</div>
                          </td>
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
