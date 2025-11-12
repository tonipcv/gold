'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import AuthLayout from '@/components/AuthLayout';

// Hook personalizado para máscara de telefone
const usePhoneMask = () => {
  const applyMask = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d)(\d{4})$/, '$1-$2')
      .slice(0, 15);
  };

  return (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    e.target.value = applyMask(value);
  };
};

export default function Register() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const handlePhoneChange = usePhoneMask();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;

    // Validação de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um e-mail válido');
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
          phone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: 'Erro ao processar resposta do servidor'
        }));
        throw new Error(errorData.message || 'Erro desconhecido');
      }

      const data = await response.json().catch(() => null);
      if (!data || !data.success) {
        throw new Error(data?.message || 'Erro desconhecido ao processar resposta');
      }

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      await new Promise((r) => setTimeout(r, 100));
      if (result?.ok) {
        window.location.href = '/marketplace';
      } else {
        router.push('/marketplace');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError(err instanceof Error ? err.message : 'Ocorreu um erro inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout bgClass="bg-white" showFooter={false}>
      <div className="w-full max-w-md mx-auto" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans'" }}>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-zinc-900">Crie sua conta</h1>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          {error && (
            <div className="mb-6 text-red-600 text-center text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4" autoComplete="off">
            <input 
              type="text" 
              id="name" 
              name="name" 
              placeholder="Nome completo"
              required 
              autoComplete="off"
              className="w-full px-4 py-3 text-sm bg-white text-zinc-900 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-black transition-colors duration-200 placeholder-zinc-500"
            />

            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="E-mail"
              required 
              className="w-full px-4 py-3 text-sm bg-white text-zinc-900 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-black transition-colors duration-200 placeholder-zinc-500"
            />

            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              placeholder="Telefone"
              required 
              onChange={handlePhoneChange}
              className="w-full px-4 py-3 text-sm bg-white text-zinc-900 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-black transition-colors duration-200 placeholder-zinc-500"
            />

            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="Senha"
              required 
              className="w-full px-4 py-3 text-sm bg-white text-zinc-900 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-black transition-colors duration-200 placeholder-zinc-500"
            />

            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword" 
              placeholder="Confirmar senha"
              required 
              className="w-full px-4 py-3 text-sm bg-white text-zinc-900 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-black transition-colors duration-200 placeholder-zinc-500"
            />

            <button 
              type="submit" 
              className="w-full h-11 text-sm font-medium text-white bg-black rounded-full hover:bg-black/90 transition-colors duration-200 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Cadastrando...' : 'Criar conta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-xs text-zinc-600">Já tem uma conta? </span>
            <Link 
              href="/login" 
              className="text-xs font-medium text-zinc-900 hover:text-black transition-colors duration-200 inline-flex items-center gap-1"
            >
              Entrar
            </Link>
          </div>
        </div>

        
      </div>
    </AuthLayout>
  );
}
