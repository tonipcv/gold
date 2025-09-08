"use client";

import { useState } from "react";
import XLogo from "@/components/XLogo";

export default function FormularioLiberacaoPage() {
  const [form, setForm] = useState({
    name: "",
    purchaseEmail: "",
    whatsapp: "",
    accountNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

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
      setForm({ name: "", purchaseEmail: "", whatsapp: "", accountNumber: "" });
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

          {error && (
            <div className="text-sm text-red-400">{error}</div>
          )}
          {success && (
            <div className="text-sm text-green-400">Enviado com sucesso! Nossa equipe entrará em contato.</div>
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
