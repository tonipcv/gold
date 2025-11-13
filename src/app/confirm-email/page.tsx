'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

function ConfirmEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams?.get('email') || '';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#111] px-4">
      <div className="max-w-md w-full space-y-8 bg-black p-8 rounded-lg border border-zinc-800">
        <div className="flex justify-center">
          <Image
            src="/ft-icone.png"
            alt="Logo"
            width={80}
            height={80}
            className="mb-4"
          />
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Verifique seu e-mail
          </h2>
          
          <p className="text-gray-300 mb-2">
            Enviamos um link de confirmação para:
          </p>
          
          <p className="text-white font-medium mb-6">
            {email}
          </p>
          
          <p className="text-gray-400 text-sm mb-8">
            Clique no link enviado para seu e-mail para confirmar sua conta.
          </p>

          <Link 
            href="/login" 
            className="text-green-400 hover:text-green-300 transition-colors duration-200"
          >
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmEmail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#111]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
        </div>
      </div>
    }>
      <ConfirmEmailContent />
    </Suspense>
  );
} 