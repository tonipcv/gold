'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string;
  isPremium: boolean;
  createdAt: string;
  phone: string | null;
}

interface UserStats {
  totalUsers: number;
  premiumUsers: number;
  activeUsers: number;
  lastDaySignups: number;
  users?: User[];
}

const ITEMS_PER_PAGE = 10;

const fontStyles = {
  primary: 'font-satoshi tracking-[-0.03em]',
  secondary: 'font-satoshi tracking-[-0.02em] font-light'
};

export default function AdminDashboard() {
  const [token, setToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      verifyToken(savedToken);
    }
  }, []);

  const verifyToken = async (inputToken: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: inputToken }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        localStorage.setItem('admin_token', inputToken);
        fetchStats();
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem('admin_token');
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePremium = async (userId: string, isPremium: boolean) => {
    try {
      const savedToken = localStorage.getItem('admin_token');
      const res = await fetch(`/api/admin/users/${userId}/premium`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${savedToken}`
        },
        body: JSON.stringify({ isPremium })
      });
      if (res.ok) {
        await fetchStats();
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch (e) {
      console.error('Failed to update premium', e);
    }
  };

  const fetchStats = async () => {
    try {
      const savedToken = localStorage.getItem('admin_token');
      
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${savedToken}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUserStats(userData);
      } else if (response.status === 401) {
        handleLogout();
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setToken('');
    router.push('/');
  };

  const normalized = (s: string | null | undefined) => (s || '').toLowerCase();
  const users = userStats?.users || [];
  const filteredUsers = users.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      normalized(u.name).includes(q) ||
      normalized(u.email).includes(q) ||
      normalized(u.phone).includes(q)
    );
  });
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE));
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-4">
            <Image
              src="/ft-icone.png"
              alt="FT Logo"
              width={48}
              height={48}
              className="mx-auto"
            />
            <h1 className={`text-2xl font-semibold text-white ${fontStyles.primary}`}>
              Admin Dashboard
            </h1>
            <p className={`text-gray-400 text-sm ${fontStyles.secondary}`}>
              Acesso restrito a administradores
            </p>
          </div>
          <div className="space-y-4">
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className={`w-full px-4 py-3 bg-[#111111] text-white rounded-lg border border-[#222222] focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight/50 transition-all ${fontStyles.secondary}`}
              placeholder="Token de acesso"
            />
            <button
              onClick={() => verifyToken(token)}
              disabled={isLoading}
              className={`w-full bg-highlight hover:bg-highlight-light text-white py-3 rounded-lg font-medium transition-all disabled:opacity-50 ${fontStyles.primary}`}
            >
              {isLoading ? 'Verificando...' : 'Acessar Dashboard'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000]">
      {/* Header */}
      <header className="border-b border-[#222222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Image
                src="/ft-icone.png"
                alt="FT Logo"
                width={32}
                height={32}
              />
              <div className="h-6 w-px bg-[#222222]" />
              <h1 className={`text-white font-medium ${fontStyles.primary}`}>Admin</h1>
            </div>
            <button
              onClick={handleLogout}
              className={`text-gray-400 hover:text-white text-sm transition-colors ${fontStyles.secondary}`}
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total de Usuários', value: userStats?.totalUsers || 0 },
            { label: 'Usuários Premium', value: userStats?.premiumUsers || 0 },
            { label: 'Usuários Ativos', value: userStats?.activeUsers || 0 },
            { label: 'Novos (24h)', value: userStats?.lastDaySignups || 0 }
          ].map((stat) => (
            <div key={stat.label} className="bg-[#111111] rounded-xl p-6">
              <p className={`text-sm text-gray-400 ${fontStyles.secondary}`}>{stat.label}</p>
              <p className={`text-2xl font-semibold text-white mt-2 ${fontStyles.primary}`}>
                {stat.value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Users Table */}
        <div className="bg-[#111111] rounded-xl overflow-hidden">
          <div className="p-6 border-b border-[#222222] flex items-center justify-between gap-4">
            <h2 className={`text-lg font-medium text-white ${fontStyles.primary}`}>Usuários</h2>
            <div className="flex items-center gap-3">
              <span className={`hidden sm:inline text-sm text-gray-400 ${fontStyles.secondary}`}>
                Total: {filteredUsers.length}
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Buscar por nome, email ou telefone"
                className={`w-64 max-w-[60vw] px-3 py-2 bg-[#0f0f0f] text-white rounded-lg border border-[#222222] focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight/40 text-sm ${fontStyles.secondary}`}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-[#222222] hover:bg-transparent">
                  <TableHead className={`text-gray-400 ${fontStyles.secondary}`}>Nome</TableHead>
                  <TableHead className={`text-gray-400 ${fontStyles.secondary}`}>Email</TableHead>
                  <TableHead className={`text-gray-400 ${fontStyles.secondary}`}>Telefone</TableHead>
                  <TableHead className={`text-gray-400 ${fontStyles.secondary}`}>Status</TableHead>
                  <TableHead className={`text-gray-400 ${fontStyles.secondary}`}>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers?.map((user) => (
                  <TableRow 
                    key={user.id} 
                    className="border-[#222222] hover:bg-[#1A1A1A] transition-colors"
                  >
                    <TableCell className={`text-white font-medium ${fontStyles.primary}`}>
                      {user.name || '-'}
                    </TableCell>
                    <TableCell className={`text-gray-300 ${fontStyles.secondary}`}>{user.email}</TableCell>
                    <TableCell className={`text-gray-300 ${fontStyles.secondary}`}>{user.phone || '-'}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isPremium 
                          ? 'bg-highlight/10 text-highlight' 
                          : 'bg-[#1A1A1A] text-gray-400'
                      } ${fontStyles.secondary}`}>
                        {user.isPremium ? 'Premium' : 'Free'}
                      </span>
                    </TableCell>
                    <TableCell className={`text-gray-300 ${fontStyles.secondary}`}>
                      {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      {user.isPremium ? (
                        <button
                          onClick={() => updatePremium(user.id, false)}
                          className={`px-3 py-1.5 rounded-lg text-xs bg-[#1A1A1A] hover:bg-[#222222] text-gray-300 border border-[#2a2a2a] ${fontStyles.secondary}`}
                        >
                          Remover Premium
                        </button>
                      ) : (
                        <button
                          onClick={() => updatePremium(user.id, true)}
                          className={`px-3 py-1.5 rounded-lg text-xs bg-highlight hover:bg-highlight-light text-white ${fontStyles.primary}`}
                        >
                          Tornar Premium
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="p-6 border-t border-[#222222]">
            <Pagination>
              <PaginationContent className={fontStyles.secondary}>
                <PaginationItem>
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={`text-gray-400 hover:text-white transition-colors ${
                      currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={currentPage === 1}
                  >
                    <span className="sr-only">Página anterior</span>
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className={`${
                        currentPage === page 
                          ? 'bg-highlight text-white' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={`text-gray-400 hover:text-white transition-colors ${
                      currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={currentPage === totalPages}
                  >
                    <span className="sr-only">Próxima página</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#222222] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <p className={`text-sm text-gray-400 ${fontStyles.secondary}`}>
              © 2024 Futuros Tech. Todos os direitos reservados.
            </p>
            <p className={`text-sm text-gray-400 ${fontStyles.secondary}`}>
              Made by KRX
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 