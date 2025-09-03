'use client';

import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react"
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import AuthLayout from '@/components/AuthLayout';

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showModal, setShowModal] = useState(false);

  // Target: 8 de setembro às 19:00 (BRT)
  useEffect(() => {
    const target = new Date('2025-09-08T19:00:00-03:00');

    const tick = () => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

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
        window.location.href = '/produtos';
      } else {
        router.push('/produtos');
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
        {/* Countdown */}
        <div className="mb-8 text-center text-white">
          <p className="text-sm text-zinc-300 mb-3">Versão 10x será liberada em:</p>
          <div className="grid grid-cols-4 gap-3">
            <div className="rounded-2xl border border-zinc-700/60 bg-gradient-to-b from-zinc-800/80 to-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] p-3">
              <div className="text-3xl font-bold tabular-nums tracking-tight">{String(timeLeft.days).padStart(2, '0')}</div>
              <div className="text-[10px] uppercase tracking-[0.12em] text-zinc-400 mt-1">DIAS</div>
            </div>
            <div className="rounded-2xl border border-zinc-700/60 bg-gradient-to-b from-zinc-800/80 to-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] p-3">
              <div className="text-3xl font-bold tabular-nums tracking-tight">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="text-[10px] uppercase tracking-[0.12em] text-zinc-400 mt-1">HORAS</div>
            </div>
            <div className="rounded-2xl border border-zinc-700/60 bg-gradient-to-b from-zinc-800/80 to-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] p-3">
              <div className="text-3xl font-bold tabular-nums tracking-tight">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="text-[10px] uppercase tracking-[0.12em] text-zinc-400 mt-1">MIN</div>
            </div>
            <div className="rounded-2xl border border-zinc-700/60 bg-gradient-to-b from-zinc-800/80 to-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] p-3">
              <div className="text-3xl font-bold tabular-nums tracking-tight">{String(timeLeft.seconds).padStart(2, '0')}</div>
              <div className="text-[10px] uppercase tracking-[0.12em] text-zinc-400 mt-1">SEG</div>
            </div>
          </div>
          <div className="mt-4 text-xs text-zinc-400">para dia 8 de setembro às 19h</div>
        </div>
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

        {/* Links */}
        <div className="max-w-md mx-auto mt-6 flex flex-col items-center space-y-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/register" 
              className="text-sm text-white hover:text-zinc-300 transition-colors duration-200 flex items-center gap-1"
              onClick={(e) => { e.preventDefault(); setShowModal(true); }}
            >
              Criar conta
              <ArrowRightIcon className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={() => setShowModal(false)} />
            <div className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 text-white p-6 shadow-xl">
              <button
                onClick={() => setShowModal(false)}
                className="absolute right-3 top-3 text-zinc-400 hover:text-white text-sm"
                aria-label="Fechar"
              >
                Fechar
              </button>

              <h2 className="text-lg font-semibold mb-2">Versão 10x</h2>
              <p className="text-sm text-zinc-300 mb-4">
                Será liberado somente para um grupo seleto de participantes que já instalaram o teste no dia 8 de setembro às 19h.
              </p>

              <div className="mb-4">
                <p className="text-xs text-zinc-400 mb-2">Liberado em:</p>
                <div className="grid grid-cols-4 gap-3">
                  <div className="rounded-xl border border-zinc-700 bg-zinc-900/70 p-3 shadow-sm">
                    <div className="text-3xl font-semibold tabular-nums tracking-tight">{String(timeLeft.days).padStart(2, '0')}</div>
                    <div className="text-[10px] uppercase tracking-[0.14em] text-zinc-500 mt-1">DIAS</div>
                  </div>
                  <div className="rounded-xl border border-zinc-700 bg-zinc-900/70 p-3 shadow-sm">
                    <div className="text-3xl font-semibold tabular-nums tracking-tight">{String(timeLeft.hours).padStart(2, '0')}</div>
                    <div className="text-[10px] uppercase tracking-[0.14em] text-zinc-500 mt-1">HORAS</div>
                  </div>
                  <div className="rounded-xl border border-zinc-700 bg-zinc-900/70 p-3 shadow-sm">
                    <div className="text-3xl font-semibold tabular-nums tracking-tight">{String(timeLeft.minutes).padStart(2, '0')}</div>
                    <div className="text-[10px] uppercase tracking-[0.14em] text-zinc-500 mt-1">MIN</div>
                  </div>
                  <div className="rounded-xl border border-zinc-700 bg-zinc-900/70 p-3 shadow-sm">
                    <div className="text-3xl font-semibold tabular-nums tracking-tight">{String(timeLeft.seconds).padStart(2, '0')}</div>
                    <div className="text-[10px] uppercase tracking-[0.14em] text-zinc-500 mt-1">SEG</div>
                  </div>
                </div>
                <div className="mt-2 text-[11px] text-zinc-400">para dia 8 de setembro às 19h</div>
              </div>

              <a
                href="https://chat.whatsapp.com/K6XXjvAaiDx6IJKI60VaLD?mode=ems_copy_c"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-400/60 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-500/15 hover:text-emerald-200 transition"
              >
                Entrar no grupo seleto (WhatsApp)
              </a>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}

