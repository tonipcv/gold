'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CheckIcon, XMarkIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Navigation } from '../../components/Navigation';
import { BottomNavigation } from '../../../components/BottomNavigation';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string | null;
  guruProductId: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminProducts() {
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
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedProduct, setEditedProduct] = useState({
    id: '',
    name: '',
    description: '',
    guruProductId: ''
  });

  // Página protegida com senha adicional
  const [accessGranted, setAccessGranted] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  // Carregar produtos
  useEffect(() => {
    if (accessGranted) {
      fetchProducts();
    }
  }, [accessGranted]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/products');
      if (!response.ok) {
        throw new Error('Falha ao carregar produtos');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordVerification = (e: FormEvent) => {
    e.preventDefault();
    // Esta é uma senha fixa para fins de demonstração
    // Em produção, deve-se usar um sistema mais robusto
    console.log('Verificando senha:', adminPassword);
    if (adminPassword === 'admin123') {
      console.log('Senha correta!');
      setAccessGranted(true);
      setError(null);
    } else {
      console.log('Senha incorreta!');
      setError('Senha incorreta para acesso à área de administração');
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setEditedProduct({
      id: product.id,
      name: product.name,
      description: product.description || '',
      guruProductId: product.guruProductId || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSaveProduct = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!editedProduct.name) {
      setError('Nome do produto é obrigatório');
      return;
    }

    try {
      const response = await fetch('/api/admin/update-product', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editedProduct.id,
          name: editedProduct.name,
          description: editedProduct.description || null,
          guruProductId: editedProduct.guruProductId || null,
          adminPassword: 'admin123' // Senha fixa para autenticação
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao atualizar produto');
      }

      setSuccess('Produto atualizado com sucesso!');
      setIsEditModalOpen(false);
      fetchProducts(); // Recarregar produtos para atualizar a lista
      
      // Limpar a mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar produto');
    }
  };

  // Filtrar produtos com base no termo de pesquisa
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.guruProductId && product.guruProductId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (status === 'loading') {
    return <div className="p-4">Carregando...</div>;
  }

  if (!accessGranted) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <Navigation />
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4 text-[#5a96f4]">Administração de Produtos</h1>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-[#5a96f4]">Verificação de Acesso</h2>
            <form onSubmit={handlePasswordVerification} className="space-y-4">
              <div>
                <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-300">
                  Senha de Administração
                </label>
                <input
                  type="password"
                  id="adminPassword"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#5a96f4]"
                  required
                  autoFocus
                />
              </div>
              {error && <div className="text-red-400">{error}</div>}
              <button
                type="submit"
                className="px-4 py-2 bg-[#5a96f4] hover:bg-blue-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Verificar
              </button>
            </form>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navigation />
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-[#5a96f4]">Administração de Produtos</h1>
          <div className="flex space-x-2">
            <Link href="/admin/users" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600">
              Gerenciar Usuários
            </Link>
          </div>
        </div>

        {/* Mensagens de sucesso/erro */}
        {success && (
          <div className="mb-4 p-3 bg-green-900/30 border border-green-800 rounded-md text-green-300">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-md text-red-300">
            {error}
          </div>
        )}

        {/* Barra de pesquisa */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Pesquisar produtos..."
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#5a96f4]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Lista de produtos */}
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
                    Nome
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    ID na Guru
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-center text-gray-400">
                      Nenhum produto encontrado
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-700/30">
                      <td className="px-4 py-4">
                        <div className="font-medium">{product.name}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-400">{product.description || '-'}</div>
                      </td>
                      <td className="px-4 py-4">
                        {product.guruProductId ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-300 border border-green-800">
                            {product.guruProductId}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/30 text-red-300 border border-red-800">
                            Não configurado
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="flex items-center text-[#5a96f4] hover:text-blue-400"
                        >
                          <PencilIcon className="h-5 w-5 mr-1" />
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de edição de produto */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-[#5a96f4]">
              Editar Produto
            </h3>
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  value={editedProduct.name}
                  onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a96f4]"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Descrição
                </label>
                <textarea
                  id="description"
                  value={editedProduct.description}
                  onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a96f4]"
                  rows={3}
                />
              </div>
              <div>
                <label htmlFor="guruProductId" className="block text-sm font-medium mb-1">
                  ID na Guru (Plataforma de Pagamento)
                </label>
                <input
                  type="text"
                  id="guruProductId"
                  value={editedProduct.guruProductId}
                  onChange={(e) => setEditedProduct({ ...editedProduct, guruProductId: e.target.value })}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a96f4]"
                  placeholder="Ex: 9ad4f5bf-5fe5-4d02-bd9d-f819961b57cc"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Este é o ID do produto na plataforma de pagamento, usado para mapear webhooks.
                </p>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#5a96f4] hover:bg-blue-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <BottomNavigation />
    </div>
  );
}
