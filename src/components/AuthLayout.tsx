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
        <div className="fixed bottom-0 left-0 right-0 py-4 text-center">
          <p className="text-xs text-zinc-500">Made by KRX</p>
        </div>
      )}
    </div>
  );
}