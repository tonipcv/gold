'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react"
import AuthLayout from '@/components/AuthLayout';

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string>('');
  const [pendingPassword, setPendingPassword] = useState<string>('');

  useEffect(() => {
    try {
      if (showModal) {
        const prev = document.body.style.overflow;
        document.body.setAttribute('data-prev-overflow', prev);
        document.body.style.overflow = 'hidden';
      } else {
        const prev = document.body.getAttribute('data-prev-overflow') || '';
        document.body.style.overflow = prev;
        document.body.removeAttribute('data-prev-overflow');
      }
    } catch {}
    return () => {
      try {
        const prev = document.body.getAttribute('data-prev-overflow') || '';
        document.body.style.overflow = prev;
        document.body.removeAttribute('data-prev-overflow');
      } catch {}
    };
  }, [showModal]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const ack = typeof window !== 'undefined' ? localStorage.getItem('login_ack') : null;
      if (ack === '1') {
        await performSignIn(email, password);
        return;
      }
    } catch {}

    setPendingEmail(email);
    setPendingPassword(password);
    setShowModal(true);
  };

  const performSignIn = async (email: string, password: string) => {
    setIsSubmitting(true);
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

  const handleConfirm = async () => {
    try {
      localStorage.setItem('login_ack', '1');
    } catch {}
    setShowModal(false);
    await performSignIn(pendingEmail, pendingPassword);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <AuthLayout bgClass="bg-zinc-900">
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

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <div className="relative z-10 w-full max-w-lg rounded-xl border border-white/10 bg-neutral-900/95 p-6 shadow-2xl">
              <h2 className="text-lg md:text-xl font-semibold text-white tracking-tight mb-3">Atenção</h2>
              <div className="text-sm text-gray-200 space-y-3 mb-6">
                <p>As estratégias da plataforma são ferramentas automatizadas que o próprio usuário configura. Elas só funcionam depois que o usuário conecta sua conta e define todos os parâmetros, como stop diário e regras de operação.</p>
                <p>Cada estratégia trabalha com ativos diferentes e a escolha ou diversificação é feita exclusivamente pelo usuário. A plataforma não escolhe ativos, não orienta decisões e não executa nada sozinha sem pré configuração.</p>
                <p>Não oferecemos recomendação de investimento. O software apenas executa automaticamente aquilo que o usuário configurou na sua própria conta. Toda responsabilidade sobre escolhas, ajustes e resultados é do usuário.</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 text-center px-4 py-2 rounded-full text-sm font-medium border border-white/30 text-white hover:bg-white/10"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="flex-1 text-center px-4 py-2 rounded-full text-sm font-semibold bg-green-600 hover:bg-green-500 text-white border border-green-500/60"
                >
                  Entendi
                </button>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </AuthLayout>
  );
}
