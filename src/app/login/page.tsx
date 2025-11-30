'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react"
import AuthLayout from '@/components/AuthLayout';

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Map the error messages to more user-friendly versions
        const errorMessages: { [key: string]: string } = {
          'Credenciais inválidas': 'Email ou senha incorretos',
          'Usuário não encontrado': 'Não encontramos uma conta com este email',
          'Senha incorreta': 'A senha está incorreta'
        };
        throw new Error(errorMessages[result.error] || result.error);
      }

      // Aguardar um momento antes de redirecionar
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Forçar um hard redirect se o router.push não funcionar
      if (result?.ok) {
        window.location.href = '/cursos';
      } else {
        router.push('/cursos');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout bgClass="bg-zinc-900" showFooter={false}>
      <div className="w-full max-w-sm font-satoshi tracking-[-0.03em]">
        
        {/* Mensagem de erro */}
        {error && (
          <div className="mb-6 text-red-500 text-center text-sm">{error}</div>
        )}
        
        {/* Formulário */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6" autoComplete="off">
          <div>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="E-mail"
              required
              autoComplete="off"
              className="w-full px-3 py-2 text-sm bg-black border border-zinc-700 rounded-xl focus:ring-1 focus:ring-white focus:border-white transition-colors duration-200 placeholder-zinc-500"
            />
          </div>
          
          <div>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Senha"
              required
              autoComplete="new-password"
              className="w-full px-3 py-2 text-sm bg-black border border-zinc-700 rounded-xl focus:ring-1 focus:ring-white focus:border-white transition-colors duration-200 placeholder-zinc-500"
            />
          </div>

          <button 
            type="submit" 
            className="w-full px-4 py-2 text-sm font-medium text-white bg-black border border-white rounded-xl hover:border-opacity-80 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Link: Esqueci minha senha */}
        <div className="max-w-md mx-auto mt-6 flex justify-center">
          <Link 
            href="/forgot-password"
            className="text-sm text-zinc-300 hover:text-white transition-colors duration-200"
          >
            Esqueci minha senha
          </Link>
        </div>

        
      </div>
    </AuthLayout>
  );
}

