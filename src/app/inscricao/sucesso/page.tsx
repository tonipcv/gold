import { Button } from "@/components/ui/button";
import XLogo from "@/components/XLogo";

export const metadata = {
  title: "Inscrição realizada com sucesso",
};

export default function SucessoInscricaoPage() {
  const whatsappHref = "https://wa.me/5511958072826";

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
            Parabéns por realizar a inscrição!
          </h1>
          <p className="text-base leading-relaxed text-gray-300">
            Caso já tenha efetuado o pagamento, em instantes será liberado no seu e-mail
            um link de acesso.
          </p>
          <p className="text-sm text-gray-400">
            Pode demorar até 20 minutos pela demanda. Se não receber, envie uma mensagem
            para <span className="whitespace-nowrap">(11) 95807-2826</span>.
          </p>

          <div className="pt-2">
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
