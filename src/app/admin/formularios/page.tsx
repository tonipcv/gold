"use client";

import { useEffect, useMemo, useState, FormEvent } from "react";

type Formulario = {
  id: string;
  name: string;
  purchaseEmail: string;
  whatsapp: string;
  accountNumber: string;
  customField?: string;
  liberado: boolean;
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
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkRunning, setBulkRunning] = useState(false);
  const [bulkDone, setBulkDone] = useState(0);
  const [bulkTotal, setBulkTotal] = useState(0);
  const [customFilter, setCustomFilter] = useState("");

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
      if (customFilter) params.set("custom", customFilter);
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

  // Bulk: marcar todos como liberado (considerando filtro atual)
  const handleBulkLiberarTodos = async () => {
    try {
      setBulkRunning(true);
      setError(null);
      setBulkDone(0);
      setBulkTotal(0);

      // Buscar todos os itens baseado no filtro atual (similar ao exportAllCSV)
      const allItems: Formulario[] = [];
      // Primeiro, pegue a primeira página grande para saber o total
      const firstParams = new URLSearchParams({ page: '1', pageSize: '1000' });
      if (search) firstParams.set('search', search);
      if (customFilter) firstParams.set('custom', customFilter);
      const firstRes = await fetch(`/api/formulario-liberacao?${firstParams.toString()}`);
      if (!firstRes.ok) {
        const data = await firstRes.json().catch(() => ({}));
        throw new Error(data?.error || 'Falha ao carregar dados');
      }
      const firstData: ApiResponse = await firstRes.json();
      allItems.push(...(firstData.items || []));
      const totalRecords = firstData.total || allItems.length;
      const totalPagesAll = Math.max(1, Math.ceil(totalRecords / 1000));

      if (totalPagesAll > 1) {
        const fetches: Promise<Response>[] = [];
        for (let p = 2; p <= totalPagesAll; p++) {
          const pParams = new URLSearchParams({ page: String(p), pageSize: '1000' });
          if (search) pParams.set('search', search);
          if (customFilter) pParams.set('custom', customFilter);
          fetches.push(fetch(`/api/formulario-liberacao?${pParams.toString()}`));
        }
        const results = await Promise.all(fetches);
        for (const res of results) {
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data?.error || 'Falha ao carregar dados em uma das páginas');
          }
          const data: ApiResponse = await res.json();
          allItems.push(...(data.items || []));
        }
      }

      // Filtrar apenas os que ainda não estão liberados
      const toLiberate = allItems.filter((it) => !it.liberado);
      setBulkTotal(toLiberate.length);

      // PATCH em série com pequeno intervalo para evitar pico
      for (let i = 0; i < toLiberate.length; i++) {
        const it = toLiberate[i];
        try {
          const response = await fetch(`/api/formulario-liberacao/${it.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ liberado: true }),
          });
          if (!response.ok) {
            // Continua, mas registra erro genérico (mostramos uma mensagem final)
            console.warn('Falha ao liberar', it.id);
          }
        } catch (e) {
          console.warn('Exceção ao liberar', it.id, e);
        }
        setBulkDone((prev) => prev + 1);
        // pequeno atraso opcional
        await new Promise((r) => setTimeout(r, 100));
      }

      // Atualiza a lista atual
      await fetchData({ page: 1, search });
    } catch (err: any) {
      setError(err.message || 'Erro no processamento em lote');
    } finally {
      setBulkRunning(false);
      setBulkOpen(false);
      setTimeout(() => {
        setBulkDone(0);
        setBulkTotal(0);
      }, 500);
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

  const toggleLiberado = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/formulario-liberacao/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ liberado: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar status');
      }

      // Update local state
      setItems(items.map(item => 
        item.id === id ? { ...item, liberado: !currentStatus } : item
      ));
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Erro ao atualizar status');
    }
  };

  const exportUnreleasedCSV = async () => {
    try {
      setExporting(true);
      setError(null);

      // Fetch only unreleased items
      const params = new URLSearchParams({
        page: '1',
        pageSize: '1000', // Large number to get all unreleased
        search: search || '',
        liberado: 'false'
      });
      if (customFilter) params.set('custom', customFilter);

      const response = await fetch(`/api/formulario-liberacao/export?${params.toString()}`);
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || "Falha ao exportar dados");
      }
      
      const data = await response.json();
      const itemsToExport = data.items || [];

      if (itemsToExport.length === 0) {
        setError('Nenhum registro não liberado para exportar');
        return;
      }

      // Create CSV content
      const headers = ['Nome', 'E-mail', 'WhatsApp', 'Número da Conta', 'Turma', 'Data de Criação'];
      const csvContent = [
        headers.join(','),
        ...itemsToExport.map((item: Formulario) => [
          `"${item.name.replace(/"/g, '""')}"`,
          `"${item.purchaseEmail}"`,
          `"${item.whatsapp}"`,
          `"${item.accountNumber}"`,
          `"${item.customField || ''}"`,
          `"${new Date(item.createdAt).toLocaleString()}"`
        ].join(','))
      ].join('\n');

      // Create and trigger download
      const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `formularios_nao_liberados_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (err: any) {
      setError(err.message || 'Erro ao exportar dados');
    } finally {
      setExporting(false);
    }
  };

  const exportAllCSV = async () => {
    try {
      setExporting(true);
      setError(null);

      const allItems: Formulario[] = [...items];

      const totalRecords = total;
      const totalPagesAll = Math.max(1, Math.ceil(totalRecords / 1000));

      if (totalPagesAll > 1) {
        // Fetch remaining pages in parallel
        const fetches = [] as Promise<Response>[];
        for (let p = 2; p <= totalPagesAll; p++) {
          const pParams = new URLSearchParams({ page: String(p), pageSize: String(1000) });
          if (search) pParams.set("search", search);
          if (customFilter) pParams.set('custom', customFilter);
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
                <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                  <input
                    type="text"
                    placeholder="Buscar por nome, email, whatsapp..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-80 p-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a96f4]"
                  />
                  <input
                    type="text"
                    placeholder="Filtrar por Custom (ex.: turma 2)"
                    value={customFilter}
                    onChange={(e) => setCustomFilter(e.target.value)}
                    className="w-full md:w-56 p-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a96f4]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md"
                  >
                    Buscar
                  </button>
                </form>
                <button
                  onClick={exportUnreleasedCSV}
                  disabled={exporting || loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {exporting ? 'Exportando...' : 'Exportar Não Liberados (CSV)'}
                </button>
                <button
                  onClick={exportAllCSV}
                  disabled={exporting || (total === 0 && items.length === 0)}
                  className={`px-4 py-2 rounded-md ${exporting || (total === 0 && items.length === 0) ? 'bg-gray-800 text-gray-500' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                >
                  {exporting ? 'Exportando...' : 'Exportar Todos (CSV)'}
                  {exporting ? 'Exportando…' : 'Exportar CSV (todos)'}
                </button>
                <button
                  onClick={() => setBulkOpen(true)}
                  disabled={loading}
                  className={`px-4 py-2 rounded-md ${loading ? 'bg-gray-800 text-gray-500' : 'bg-yellow-600 hover:bg-yellow-700 text-white'}`}
                  title="Marcar todos como liberado (com confirmação)"
                >
                  Liberar todos
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                        E-mail
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                        WhatsApp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                        Número da Conta
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                        Turma
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                        Data
                      </th>
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-100">{it.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-100">{it.purchaseEmail}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-100">{it.whatsapp}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-100">{it.accountNumber}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-100">{it.customField || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => toggleLiberado(it.id, it.liberado)}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                it.liberado 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {it.liberado ? 'Liberado' : 'Pendente'}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-300">
                              {new Date(it.createdAt).toLocaleString()}
                            </div>
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

      {/* Modal de confirmação para liberar todos */}
      {accessGranted && bulkOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-md text-gray-200">
            <h3 className="text-lg font-semibold mb-2 text-yellow-300">Confirmar liberação em massa</h3>
            <p className="text-sm text-gray-300 mb-4">
              Esta ação irá marcar <span className="font-semibold">todos os registros</span> (considerando o filtro atual)
              como <span className="font-semibold text-green-400">liberado</span>. Deseja continuar?
            </p>
            {bulkRunning ? (
              <div className="space-y-2">
                <div className="text-sm">Processando... {bulkDone}/{bulkTotal || '—'}</div>
                <div className="w-full h-2 bg-gray-800 rounded">
                  <div
                    className="h-2 bg-green-600 rounded"
                    style={{ width: bulkTotal > 0 ? `${Math.min(100, Math.round((bulkDone / bulkTotal) * 100))}%` : '10%' }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setBulkOpen(false)}
                  className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-800"
                  disabled={bulkRunning}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleBulkLiberarTodos}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md disabled:opacity-50"
                  disabled={bulkRunning}
                >
                  Confirmar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
