'use client';

import { useState, FormEvent, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import XLogo from '@/components/XLogo';
import AuthLayout from '@/components/AuthLayout';

// Modifique a função validatePassword para retornar um objeto com todos os status
const validatePassword = (password: string) => {
  return {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*]/.test(password)
  };
};

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [validations, setValidations] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      setError('Token inválido ou expirado');
      router.push('/login');
    }
  }, [token, router]);

  // Adicione esta função para atualizar as validações quando a senha mudar
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setValidations(validatePassword(newPassword));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setError('');

    if (!token) {
      setError('Token inválido ou expirado');
      setIsSubmitting(false);
      return;
    }

    // Validar se as senhas são iguais
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setIsSubmitting(false);
      return;
    }

    // Verificar se todos os requisitos foram atendidos
    const currentValidations = validatePassword(password);
    if (!Object.values(currentValidations).every(Boolean)) {
      setError('A senha não atende a todos os requisitos');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token,
          password 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao atualizar senha');
      }

      setMessage('Senha atualizada com sucesso!');
      
      // Redirecionar para a página de login após 2 segundos
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      setError(error instanceof Error ? error.message : 'Ocorreu um erro ao atualizar a senha. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-sm space-y-8">
        <h2 className="text-center text-2xl font-extrabold text-white">
          Redefinir senha
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-zinc-400">
              Nova Senha
            </label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="Digite sua nova senha" 
              required 
              autoComplete="new-password"
              className="w-full px-3 py-2 text-sm bg-black border border-zinc-700 rounded-xl focus:ring-1 focus:ring-white focus:border-white transition-colors duration-200 placeholder-zinc-500"
              value={password}
              onChange={handlePasswordChange}
              minLength={8}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-zinc-400">
              Confirmar Senha
            </label>
            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword" 
              placeholder="Confirme sua nova senha" 
              required 
              autoComplete="new-password"
              className="w-full px-3 py-2 text-sm bg-black border border-zinc-700 rounded-xl focus:ring-1 focus:ring-white focus:border-white transition-colors duration-200 placeholder-zinc-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
            />
          </div>

          <div className="text-sm bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <p className="text-zinc-400">A senha deve conter:</p>
            <ul className="mt-2 space-y-1">
              <li className={`flex items-center ${validations.minLength ? 'text-green-500' : 'text-gray-400'}`}>
                {validations.minLength ? '✓' : '○'} Mínimo de 8 caracteres
              </li>
              <li className={`flex items-center ${validations.hasUpperCase ? 'text-green-500' : 'text-gray-400'}`}>
                {validations.hasUpperCase ? '✓' : '○'} Pelo menos uma letra maiúscula
              </li>
              <li className={`flex items-center ${validations.hasLowerCase ? 'text-green-500' : 'text-gray-400'}`}>
                {validations.hasLowerCase ? '✓' : '○'} Pelo menos uma letra minúscula
              </li>
              <li className={`flex items-center ${validations.hasNumber ? 'text-green-500' : 'text-gray-400'}`}>
                {validations.hasNumber ? '✓' : '○'} Pelo menos um número
              </li>
              <li className={`flex items-center ${validations.hasSpecialChar ? 'text-green-500' : 'text-gray-400'}`}>
                {validations.hasSpecialChar ? '✓' : '○'} Pelo menos um caractere especial (!@#$%^&*)
              </li>
            </ul>
          </div>

          {error && (
            <div className="mb-4 text-center text-red-500">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 text-center text-green-500">
              {message}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full px-4 py-2 text-sm font-medium text-black bg-white rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-sm"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Atualizando...' : 'Atualizar Senha'}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
