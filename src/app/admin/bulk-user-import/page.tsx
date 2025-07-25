'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowUpTrayIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Navigation } from '../../components/Navigation';
import { BottomNavigation } from '../../../components/BottomNavigation';

export default function BulkUserImport() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [processedUsers, setProcessedUsers] = useState(0);

  // Página protegida com senha adicional
  const [accessGranted, setAccessGranted] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Por favor, selecione um arquivo CSV');
      return;
    }

    if (!password) {
      setError('Por favor, defina uma senha para os novos usuários');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('password', password);

      const response = await fetch('/api/admin/bulk-user-import', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erro ao processar o arquivo');
      }

      setSuccess(`${result.importedCount} usuários importados com sucesso!`);
      setProcessedUsers(result.importedCount);
      setFile(null);
      setPassword('');
      
      // Reset o campo de arquivo
      const fileInput = document.getElementById('csv-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err) {
      console.error('Import error:', err);
      setError(err instanceof Error ? err.message : 'Erro ao importar usuários');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mostra tela de carregamento enquanto verifica a autenticação
  if (status === 'loading') {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Importação em Massa de Usuários</h1>
        
        {!accessGranted ? (
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 mb-8">
            <h2 className="text-xl font-semibold mb-4">Área Restrita</h2>
            <p className="mb-4 text-zinc-400">Esta área é protegida. Por favor, insira a senha de administrador para continuar.</p>
            
            {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
            
            <form onSubmit={handlePasswordVerification} className="max-w-md space-y-4">
              <div>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Senha de administrador"
                  className="w-full px-3 py-2 text-sm bg-black border border-zinc-700 rounded-xl focus:ring-1 focus:ring-white focus:border-white transition-colors duration-200 placeholder-zinc-500"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full px-4 py-2 text-sm font-medium text-white bg-black border border-white rounded-xl hover:border-opacity-80 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-200"
              >
                Verificar
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 mb-8">
              <h2 className="text-xl font-semibold mb-4">Instruções</h2>
              <ul className="list-disc pl-5 space-y-2 text-zinc-400">
                <li>O arquivo CSV deve conter apenas uma coluna com os endereços de e-mail</li>
                <li>O arquivo não deve conter cabeçalho</li>
                <li>Cada linha deve conter um único endereço de e-mail válido</li>
                <li>Todos os usuários importados receberão a mesma senha inicial</li>
                <li>Os usuários existentes serão ignorados (não serão sobrescritos)</li>
              </ul>
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-800 p-4 rounded-xl mb-6 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-900/30 border border-green-800 p-4 rounded-xl mb-6 flex items-center gap-2">
                <CheckIcon className="w-5 h-5 text-green-500" />
                <span>{success}</span>
              </div>
            )}

            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-zinc-400 mb-1">
                    Senha padrão para novos usuários
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-black border border-zinc-700 rounded-xl focus:ring-1 focus:ring-white focus:border-white transition-colors duration-200 placeholder-zinc-500"
                    placeholder="Senha para todos os novos usuários"
                    required
                  />
                  <p className="mt-1 text-xs text-zinc-500">Esta senha será aplicada a todos os novos usuários importados.</p>
                </div>

                <div className="mt-4">
                  <label htmlFor="csv-file" className="block text-sm font-medium text-zinc-400 mb-1">
                    Arquivo CSV com e-mails
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-zinc-700 border-dashed rounded-xl hover:border-zinc-500 transition-colors duration-200">
                    <div className="space-y-1 text-center">
                      <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-zinc-500" />
                      <div className="flex text-sm text-zinc-400">
                        <label
                          htmlFor="csv-file"
                          className="relative cursor-pointer rounded-md font-medium text-white focus-within:outline-none"
                        >
                          <span>Selecione um arquivo CSV</span>
                          <input
                            id="csv-file"
                            name="csv-file"
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="sr-only"
                            required
                          />
                        </label>
                      </div>
                      <p className="text-xs text-zinc-500">
                        {file ? file.name : 'CSV com uma coluna de e-mails, sem cabeçalho'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    type="submit"
                    disabled={isSubmitting || !file}
                    className={`w-full flex justify-center items-center py-2 px-4 border border-white rounded-xl text-sm font-medium text-white focus:outline-none transition-all duration-200 ${
                      isSubmitting || !file
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:border-opacity-80 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                    }`}
                  >
                    {isSubmitting ? 'Processando...' : 'Importar Usuários'}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}
