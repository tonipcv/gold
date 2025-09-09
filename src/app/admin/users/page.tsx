'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CheckIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Navigation } from '../../components/Navigation';
import { BottomNavigation } from '../../../components/BottomNavigation';
import Link from 'next/link';

interface User {
  id: string;
  name: string | null;
  email: string;
  purchases: Purchase[];
}

interface Purchase {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    description: string | null;
  };
  status: string;
  startDate: string | null;
  endDate: string | null;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
}

export default function AdminUsers() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });

  // Estados
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [isSetPasswordOpen, setIsSetPasswordOpen] = useState(false);
  const [setPwdUser, setSetPwdUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Seleção em massa e ações em lote
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkSending, setIsBulkSending] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  // Página protegida com senha adicional
  const [accessGranted, setAccessGranted] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  // Lista filtrada (por nome/email) usada na tabela e na seleção em massa
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Helpers para seleção e filtro de "paid"
  const userIsPaid = (user: User) => {
    return Array.isArray(user.purchases) && user.purchases.some(p => (p.status || '').toLowerCase() === 'paid');
  };

  const toggleSelect = (userId: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId); else next.add(userId);
      return next;
    });
  };

  const selectAllPaidVisible = () => {
    const allPaidIds = filteredUsers.filter(userIsPaid).map(u => u.id);
    setSelectedIds(new Set(allPaidIds));
  };

  const clearSelection = () => setSelectedIds(new Set());

  // Reenvio em massa apenas para usuários com status "paid"
  const handleBulkResendAccess = async () => {
    try {
      setIsBulkSending(true);
      setError(null);
      setSuccess(null);
      const selectedUsers = users.filter(u => selectedIds.has(u.id));
      const paidUsers = selectedUsers.filter(userIsPaid);
      if (paidUsers.length === 0) {
        setError('Nenhum usuário selecionado com status paid.');
        setTimeout(() => setError(null), 3000);
        return;
      }

      let sent = 0;
      let failures = 0;
      for (const u of paidUsers) {
        try {
          const response = await fetch('/api/admin/resend-access', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: u.email }),
          });
          if (!response.ok) {
            failures++;
          } else {
            sent++;
          }
          // Intervalo curto para evitar picos no provedor
          await new Promise(res => setTimeout(res, 200));
        } catch {
          failures++;
        }
      }

      setSuccess(`Reenvio concluído. Sucesso: ${sent}. Falhas: ${failures}.`);
      setTimeout(() => setSuccess(null), 4000);
    } finally {
      setIsBulkSending(false);
    }
  };

  // Reenvio para TODOS os usuários com status "paid" (independente de seleção/filtro)
  const handleResendAllPaid = async () => {
    try {
      setIsBulkSending(true);
      setError(null);
      setSuccess(null);
      const paidUsers = users.filter(userIsPaid);
      if (paidUsers.length === 0) {
        setError('Nenhum usuário com status paid encontrado.');
        setTimeout(() => setError(null), 3000);
        return;
      }

      let sent = 0;
      let failures = 0;
      for (const u of paidUsers) {
        try {
          const response = await fetch('/api/admin/resend-access', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: u.email }),
          });
          if (!response.ok) {
            failures++;
          } else {
            sent++;
          }
          await new Promise(res => setTimeout(res, 200));
        } catch {
          failures++;
        }
      }

      setSuccess(`Reenvio (todos paid) concluído. Sucesso: ${sent}. Falhas: ${failures}.`);
      setTimeout(() => setSuccess(null), 4000);
    } finally {
      setIsBulkSending(false);
    }
  };

  // Carregar usuários e produtos
  useEffect(() => {
    if (accessGranted) {
      fetchUsers();
      fetchProducts();
    }
  }, [accessGranted]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/user-products');
      if (!response.ok) {
        throw new Error('Falha ao carregar usuários');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuários');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      if (!response.ok) {
        throw new Error('Falha ao carregar produtos');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
    }
  };

  const handlePasswordVerification = (e: FormEvent) => {
    e.preventDefault();
    // Esta é uma senha fixa para fins de demonstração
    // Em produção, deve-se usar um sistema mais robusto
    if (adminPassword === 'admin123') {
      setAccessGranted(true);
      setError(null);
    } else {
      setError('Senha incorreta para acesso à área de administração');
    }
  };

  const handleAddProduct = async () => {
    if (!selectedUser || !selectedProduct) {
      setError('Selecione um usuário e um produto');
      return;
    }

    try {
      const response = await fetch('/api/admin/add-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          productId: selectedProduct,
          status: 'ACTIVE',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 ano
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao adicionar produto');
      }

      setSuccess('Produto adicionado com sucesso!');
      setIsModalOpen(false);
      fetchUsers(); // Recarregar usuários para atualizar a lista
      
      // Limpar a mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Reenviar acesso por e-mail (usuário já confirmado)
  const handleResendAccess = async (email: string) => {
    try {
      setError(null);
      const response = await fetch('/api/admin/resend-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Falha ao reenviar acesso');
      }
      if (data.skipped) {
        setSuccess(
          `${data.message} Configure SMTP (.env): SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, EMAIL_FROM_NAME, EMAIL_FROM_ADDRESS.`
        );
      } else {
        setSuccess(data.message || 'Acesso reenviado com sucesso!');
      }
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Erro ao reenviar acesso');
      setTimeout(() => setError(null), 4000);
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      setError('Nome, email e senha são obrigatórios');
      return;
    }

    try {
      setError(null);
      const response = await fetch('/api/admin/add-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar usuário');
      }

      setSuccess('Usuário criado com sucesso!');
      setIsNewUserModalOpen(false);
      setNewUser({ name: '', email: '', password: '', phone: '' });
      fetchUsers(); // Recarregar usuários para atualizar a lista
      
      // Limpar a mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemoveProduct = async (userId: string, purchaseId: string) => {
    try {
      const response = await fetch('/api/admin/remove-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          purchaseId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao remover produto');
      }

      setSuccess('Produto removido com sucesso');
      fetchUsers(); // Recarregar a lista de usuários
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover produto');
    }
  };

  const openAddProductModal = (user: User) => {
    setSelectedUser(user);
    setSelectedProduct('');
    setIsModalOpen(true);
  };

  const openSetPasswordModal = (user: User) => {
    setSetPwdUser(user);
    setNewPassword('');
    setConfirmPassword('');
    setIsSetPasswordOpen(true);
  };

  const handleSetPassword = async (useDefault = false) => {
    if (!setPwdUser) return;
    if (!useDefault) {
      if (!newPassword || newPassword.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres');
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('As senhas não conferem');
        return;
      }
    }
    try {
      setError(null);
      const body = useDefault
        ? { userId: setPwdUser.id, useDefault: true }
        : { userId: setPwdUser.id, password: newPassword };
      const res = await fetch('/api/admin/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Falha ao definir senha');
      }
      setSuccess('Senha atualizada com sucesso!');
      setIsSetPasswordOpen(false);
      setSetPwdUser(null);
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Erro ao definir senha');
      setTimeout(() => setError(null), 4000);
    }
  };

  

  if (status === 'loading') {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-gray-200 font-satoshi tracking-[-0.03em]">
      {/* Header */}
      <header className="fixed top-0 w-full bg-black/90 backdrop-blur-sm z-50 px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <img src="/ft-icone.png" alt="Futuros Tech Logo" className="h-8 w-auto" />
          </Link>
          <div className="text-lg font-bold text-[#5a96f4]">Administração de Usuários</div>
          <div className="w-8"></div> {/* Espaço para balancear o layout */}
        </div>
      </header>

      {/* Main Content */}
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h1 className="text-2xl font-bold mb-4 md:mb-0 text-[#5a96f4]">Gerenciamento de Usuários</h1>
              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <button
                  onClick={() => setIsNewUserModalOpen(true)}
                  className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  <PlusIcon className="h-5 w-5" />
                  Adicionar Usuário
                </button>
                <button
                  onClick={handleResendAllPaid}
                  disabled={isBulkSending || users.filter(userIsPaid).length === 0}
                  className={`flex items-center justify-center gap-1 py-2 px-4 rounded-md transition-colors ${isBulkSending ? 'bg-teal-900 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'} text-white`}
                  title="Reenviar e-mail de acesso para TODOS os usuários com status paid"
                >
                  {isBulkSending ? 'Reenviando...' : 'Reenviar acesso (todos paid)'}
                </button>
                <button
                  onClick={selectAllPaidVisible}
                  className="flex items-center justify-center gap-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors"
                  title="Selecionar todos os usuários visíveis com status paid"
                >
                  Selecionar todos (paid)
                </button>
                <button
                  onClick={clearSelection}
                  className="flex items-center justify-center gap-1 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors"
                  title="Limpar seleção"
                >
                  Limpar seleção
                </button>
                <button
                  onClick={handleBulkResendAccess}
                  disabled={isBulkSending || users.filter(u => selectedIds.has(u.id) && userIsPaid(u)).length === 0}
                  className={`flex items-center justify-center gap-1 py-2 px-4 rounded-md transition-colors ${isBulkSending ? 'bg-blue-900 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                  title="Reenviar acesso por e-mail para os usuários selecionados que estão paid"
                >
                  {isBulkSending ? 'Reenviando...' : 'Reenviar acesso (selecionados paid)'}
                </button>
                <div className="w-full md:w-64">
                  <input
                    type="text"
                    placeholder="Buscar usuários..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a96f4]"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-md text-red-300">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-900/30 border border-green-800 rounded-md text-green-300">
                {success}
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5a96f4]"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800/30 rounded-lg overflow-hidden">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Sel.
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Usuário
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Produtos
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-700/30">
                        <td className="px-4 py-4 align-top">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(user.id)}
                            onChange={() => toggleSelect(user.id)}
                            disabled={!userIsPaid(user)}
                            title={userIsPaid(user) ? 'Selecionar usuário (paid)' : 'Disponível apenas para usuários paid'}
                          />
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-medium">{user.name || 'Sem nome'}</div>
                          <div className="text-sm text-gray-400">{user.email}</div>
                        </td>
                        <td className="px-4 py-4">
                          {user.purchases && user.purchases.length > 0 ? (
                            <div className="space-y-2">
                              {user.purchases.map((purchase) => (
                                <div key={purchase.id} className="flex items-center justify-between bg-gray-700/30 p-2 rounded">
                                  <div>
                                    <div className="font-medium">{purchase.product.name}</div>
                                    <div className="text-xs text-gray-400">
                                      Status: <span className={(purchase.status || '').toLowerCase() === 'paid' || purchase.status === 'ACTIVE' ? 'text-green-400' : 'text-yellow-400'}>
                                        {purchase.status}
                                      </span>
                                    </div>
                                    {purchase.startDate && purchase.endDate && (
                                      <div className="text-xs text-gray-400">
                                        Validade: {new Date(purchase.startDate).toLocaleDateString()} - {new Date(purchase.endDate).toLocaleDateString()}
                                      </div>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => handleRemoveProduct(user.id, purchase.id)}
                                    className="text-red-400 hover:text-red-300 p-1"
                                    title="Remover produto"
                                  >
                                    <XMarkIcon className="h-5 w-5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400">Nenhum produto</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => openAddProductModal(user)}
                            className="flex items-center text-[#5a96f4] hover:text-blue-400"
                          >
                            <PlusIcon className="h-5 w-5 mr-1" />
                            Adicionar Produto
                          </button>
                          <div className="mt-2">
                            <button
                              onClick={() => handleResendAccess(user.email)}
                              className="text-green-400 hover:text-green-300 text-sm underline"
                              title="Reenviar e-mail de acesso confirmado"
                            >
                              Reenviar acesso por e-mail
                            </button>
                          </div>
                          <div className="mt-2">
                            <button
                              onClick={() => openSetPasswordModal(user)}
                              className="text-yellow-300 hover:text-yellow-200 text-sm underline"
                              title="Definir/alterar senha do usuário"
                            >
                              Definir senha
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Modal para adicionar produto */}
            {isModalOpen && selectedUser && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
                  <h2 className="text-xl font-bold mb-4 text-[#5a96f4]">
                    Adicionar Produto para {selectedUser.email}
                  </h2>
                  <div className="mb-4">
                    <label htmlFor="product" className="block text-sm font-medium mb-1">
                      Produto
                    </label>
                    <select
                      id="product"
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a96f4]"
                    >
                      <option value="">Selecione um produto</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleAddProduct}
                      className="px-4 py-2 bg-[#5a96f4] text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal para adicionar novo usuário */}
            {isNewUserModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
                  <h2 className="text-xl font-semibold mb-4 text-[#5a96f4]">Adicionar Novo Usuário</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">
                        Nome
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                        className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a96f4]"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a96f4]"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium mb-1">
                        Senha
                      </label>
                      <input
                        type="password"
                        id="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a96f4]"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-1">
                        Telefone (opcional)
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={newUser.phone}
                        onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                        className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a96f4]"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-6">
                    <button
                      onClick={() => {
                        setIsNewUserModalOpen(false);
                        setNewUser({ name: '', email: '', password: '', phone: '' });
                      }}
                      className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleAddUser}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      Criar Usuário
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal para definir senha do usuário */}
            {isSetPasswordOpen && setPwdUser && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
                  <h2 className="text-xl font-bold mb-4 text-[#5a96f4]">
                    Definir senha para {setPwdUser.email}
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium mb-1">Nova senha</label>
                      <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a96f4]"
                        placeholder={process.env.NEXT_PUBLIC_DEFAULT_USER_PASSWORD ? `Padrão: ${process.env.NEXT_PUBLIC_DEFAULT_USER_PASSWORD}` : 'Mínimo 6 caracteres'}
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirmar senha</label>
                      <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a96f4]"
                      />
                    </div>
                    {process.env.NEXT_PUBLIC_DEFAULT_USER_PASSWORD && (
                      <button
                        type="button"
                        onClick={() => {
                          const pwd = process.env.NEXT_PUBLIC_DEFAULT_USER_PASSWORD as string
                          setNewPassword(pwd)
                          setConfirmPassword(pwd)
                        }}
                        className="text-xs text-yellow-300 hover:text-yellow-200 underline"
                      >
                        Usar senha padrão
                      </button>
                    )}
                  </div>
                  <div className="flex justify-end space-x-2 mt-6">
                    <button
                      onClick={() => {
                        setIsSetPasswordOpen(false)
                        setSetPwdUser(null)
                        setNewPassword('')
                        setConfirmPassword('')
                      }}
                      className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleSetPassword(false)}
                      className="px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-400 transition-colors"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => handleSetPassword(true)}
                      className="px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-white transition-colors"
                      title="Usar a senha padrão configurada no servidor"
                    >
                      Usar senha padrão do servidor
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Navigation />
    </div>
  );
}
