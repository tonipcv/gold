"use client";

import { Button } from "@/components/ui/button";
import XLogo from "@/components/XLogo";
import { useState } from "react";

// Metadata deve ser movida para um arquivo layout.tsx ou removida do componente client

export default function SucessoInscricaoPage() {
  const whatsappHref = "https://wa.me/5511958072826";
  const [copied, setCopied] = useState(false);
  const tempPassword = "R8!kZ3wq@7fLpN2";
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="font-montserrat bg-black text-white min-h-screen">
      {/* Logo centralizado no topo, como na página 10x */}
      <div className="w-full flex justify-center pt-8">
        <XLogo />
      </div>

      {/* Conteúdo principal centralizado */}
      <main className="px-4 py-10">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Parabéns por realizar a inscrição, seu pagamento está sendo processado e demora alguns minutos para ser confirmado, quando confirmado seu acesso será liberado com as credenciais abaixo!
          </h1>
          
          <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 text-left">
            <h2 className="text-xl font-medium mb-4 text-center">Instruções de Acesso</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Login:</p>
                <p className="text-base">Use o nome do seu email como login</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Senha temporária:</p>
                <div className="flex items-center gap-2">
                  <code className="bg-gray-800 px-3 py-2 rounded text-green-400 flex-grow">
                    {tempPassword}
                  </code>
                  <button 
                    onClick={copyToClipboard}
                    className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors"
                    aria-label="Copiar senha"
                  >
                    {copied ? (
                      <span className="text-green-400">Copiado ✓</span>
                    ) : (
                      <span>Copiar</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              <a href="https://gold.k17.com.br" target="_blank" rel="noopener noreferrer">
                Acessar Login
              </a>
            </Button>
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                Falar no WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
