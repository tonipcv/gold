'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import XLogo from "@/components/XLogo";

// Page component: provides Suspense boundary
export default function FormularioLiberacao2Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Carregando…</div>}>
      <FormContent />
    </Suspense>
  );
}

// Child component that uses useSearchParams inside Suspense
function FormContent() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    purchaseEmail: "",
    whatsapp: "",
    accountNumber: "",
    customField: "turma 2"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();
  const hasAttemptedAuto = useRef(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // Auto-preencher e enviar caso todos os parâmetros estejam presentes na URL
  useEffect(() => {
    if (!searchParams || hasAttemptedAuto.current) return;

    const qp = {
      name: searchParams.get("name")?.toString() || "",
      purchaseEmail: searchParams.get("purchaseEmail")?.toString() || "",
      whatsapp: searchParams.get("whatsapp")?.toString() || "",
      accountNumber: searchParams.get("accountNumber")?.toString() || "",
      customField: "turma 2"
    };

    const allPresent = qp.name && qp.purchaseEmail && qp.whatsapp && qp.accountNumber;
    setForm(qp);

    async function autoSubmit() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/formulario-liberacao", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(qp),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Erro ao enviar.");
        setSuccess(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao enviar.");
      } finally {
        setLoading(false);
        hasAttemptedAuto.current = true;
      }
    }

    if (allPresent) {
      autoSubmit();
    }
  }, [searchParams]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!form.name || !form.purchaseEmail || !form.whatsapp || !form.accountNumber) {
      setError("Preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/formulario-liberacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Erro ao enviar.");
      }
      setSuccess(true);
      setForm({ name: "", purchaseEmail: "", whatsapp: "", accountNumber: "", customField: "turma 2" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-10">
      {/* Logo branca no topo (mesma do login) */}
      <div className="mb-10">
        <XLogo />
      </div>

      <div className="w-full max-w-md">
        {/* Mensagem de confirmação em destaque se enviado com sucesso */}
        {success && (
          <div className="mb-4 rounded-lg border border-green-700 bg-green-950/40 text-green-300 px-4 py-3 text-sm">
            Obrigado! Seus dados foram recebidos com sucesso. Nossa equipe entrará em contato em breve.
          </div>
        )}
        <h1 className="text-center text-lg text-neutral-200 mb-6">
          Preencha os dados para nosso time de programadores gerar o código para você:
        </h1>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm text-neutral-400 mb-1">
              Nome
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={onChange}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-700"
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div>
            <label htmlFor="purchaseEmail" className="block text-sm text-neutral-400 mb-1">
              E-mail de Compra
            </label>
            <input
              id="purchaseEmail"
              name="purchaseEmail"
              type="email"
              value={form.purchaseEmail}
              onChange={onChange}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-700"
              placeholder="email@exemplo.com"
              required
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="whatsapp" className="block text-sm text-neutral-400 mb-1">
              Telefone (Whatsapp)
            </label>
            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              value={form.whatsapp}
              onChange={onChange}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-700"
              placeholder="(00) 00000-0000"
              required
            />
          </div>

          <div>
            <label htmlFor="accountNumber" className="block text-sm text-neutral-400 mb-1">
              Número de Conta que será conectado
            </label>
            <input
              id="accountNumber"
              name="accountNumber"
              type="text"
              value={form.accountNumber}
              onChange={onChange}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-700"
              placeholder="Ex: 123456"
              required
            />
          </div>

          {/* Hidden field for customField */}
          <input type="hidden" name="customField" value="turma 2" />

          {error && (
            <div className="text-sm text-red-400">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex justify-center px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl text-white font-medium transition-all disabled:opacity-60"
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </form>
      </div>
    </div>
  );
}
