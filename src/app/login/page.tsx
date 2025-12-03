'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react"
import AuthLayout from '@/components/AuthLayout';
// Consent is handled on the cursos page; no modal here

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [showConsent, setShowConsent] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string>('');
  const [pendingPassword, setPendingPassword] = useState<string>('');
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // No consent logic on login page
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    await performSignIn(email, password);
  };

  const performSignIn = async (email: string, password: string, recordConsent = false) => {
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

      if (!result?.ok) {
        throw new Error('Login falhou');
      }

      // Record consent in database after successful login
      if (recordConsent) {
        console.log('[Login] Recording consent after successful login');
        try {
          // Ensure session cookie is available client-side before posting consent
          await fetch('/api/auth/session', { cache: 'no-store' });
          
          const res = await fetch('/api/consents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              consentType: 'terms-of-use',
              text:
                'Ao prosseguir, declaro que:\n' +
                'compreendo que esta plataforma oferece apenas tecnologia de automação e não presta gestão, análise ou recomendação de investimentos;\n' +
                'reconheço que todas as ordens são executadas exclusivamente pela corretora, e que a empresa não acessa, controla ou movimenta minha conta de negociação;\n' +
                'tenho ciência de que operações financeiras envolvem risco elevado e posso perder parte ou todo o capital investido;\n' +
                'entendo que a escolha das estratégias e dos ativos a serem utilizados, bem como a definição de stop, risco, limites e demais parâmetros operacionais, será realizada exclusivamente por mim no momento da ativação;\n' +
                'declaro ainda que todas as configurações na minha conta da corretora são feitas por mim, sob minha total responsabilidade.\n' +
                'Leia os termos completos em test.k17.com.br/termos-de-uso.',
              textVersion: 'v2.0',
            }),
          });
          
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            console.error('[Login] Consent POST failed:', res.status, data);
            // Don't throw - fallback will create record on /cursos page
          } else {
            console.log('[Login] Consent recorded successfully');
          }
        } catch (e) {
          console.error('[Login] Failed to record consent:', e);
          // Don't throw - fallback will create record on /cursos page
        }
      }

      // Aguardar para garantir que o consentimento foi processado
      await new Promise(resolve => setTimeout(resolve, 200));
      
      console.log('[Login] Redirecting to /cursos');
      // Forçar um hard redirect
      window.location.href = '/cursos';
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setIsSubmitting(false);
    }
  };

  // No consent handler on login

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
              ref={emailRef}
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
              ref={passwordRef}
              className="w-full px-3 py-2 text-sm bg-black border border-zinc-700 rounded-xl focus:ring-1 focus:ring-white focus:border-white transition-colors duration-200 placeholder-zinc-500"
            />
          </div>

          <button 
            type="submit" 
            className={`w-full px-4 py-2 text-sm font-medium text-white border rounded-xl transition-all duration-200 bg-black border-white hover:border-opacity-80 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]`}
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

        {/* Consent modal removed from login. Gate appears in cursos page. */}
        
      </div>
    </AuthLayout>
  );
}
