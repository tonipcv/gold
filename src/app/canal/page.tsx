'use client';

import { useEffect } from 'react';

const CHANNEL_URL = 'https://www.instagram.com/channel/AbbSMEMQHnb_qFit/?igsh=MTRjbWJoMHhoczgzbw==';

export default function CanalRedirectPage() {
  useEffect(() => {
    const t = setTimeout(() => {
      window.location.href = CHANNEL_URL;
    }, 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-semibold">Redirecionando para o canal…</h1>
        <p className="text-sm text-gray-500">
          Caso não seja redirecionado automaticamente, clique no botão abaixo.
        </p>
        <div>
          <a
            href={CHANNEL_URL}
            className="inline-flex items-center justify-center rounded-md bg-black text-white px-4 py-2 text-sm font-medium hover:opacity-90"
          >
            Ir para o canal do Instagram
          </a>
        </div>
      </div>
    </main>
  );
}
