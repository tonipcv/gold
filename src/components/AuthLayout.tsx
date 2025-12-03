import XLogo from './XLogo';

interface AuthLayoutProps {
  children: React.ReactNode;
  bgClass?: string;
  showFooter?: boolean;
}

export default function AuthLayout({ children, bgClass = 'bg-black', showFooter = true }: AuthLayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${bgClass} px-4`}>
      <div className="w-full max-w-sm space-y-6">
        <div className="flex justify-center">
          <XLogo />
        </div>
        {children}
      </div>
      
      {/* Footer */}
      {showFooter && (
        <div className="fixed bottom-0 left-0 right-0 px-4 py-3 text-center bg-transparent">
          <div className="max-w-md mx-auto">
            <p className="text-[10px] leading-relaxed text-zinc-400">
              Este software não opera por você: todas as configurações de risco, stop e seleção de ativos são responsabilidade exclusiva do usuário. A Provedora não acessa sua conta, não executa ordens e não realiza qualquer gestão ou recomendação de investimento. O usuário reconhece que pode perder parte ou todo o capital investido e que exemplos de performance apresentados são meramente ilustrativos, não representando garantia de resultados futuros.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}