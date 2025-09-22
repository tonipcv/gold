"use client";

import { Button } from "@/components/ui/button";
import XLogo from "@/components/XLogo";

export default function PendenteInscricaoPage() {
  // Mensagem pré-configurada para o WhatsApp
  const mensagem = encodeURIComponent("Olá, paguei meu pix, segue o comprovante de pagamento!");
  const whatsappHref = `https://wa.me/5511958072826?text=${mensagem}`;

  return (
    <div className="font-montserrat bg-black text-white min-h-screen">
      {/* Logo centralizado no topo */}
      <div className="w-full flex justify-center pt-8">
        <XLogo />
      </div>

      {/* Conteúdo principal centralizado */}
      <main className="px-4 py-10">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Sua inscrição está pendente
          </h1>
          
          <div className="bg-amber-900/20 border border-amber-800/30 rounded-lg p-6">
            <p className="text-base leading-relaxed text-amber-100">
              Caso já tenha efetuado o pagamento, clique no botão abaixo e envie o comprovante de pagamento.
            </p>
            <p className="text-sm text-amber-200/70 mt-2">
              Após a confirmação do pagamento, seu acesso será liberado imediatamente.
            </p>
          </div>
          
          <div className="pt-4">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                Enviar Comprovante no WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
