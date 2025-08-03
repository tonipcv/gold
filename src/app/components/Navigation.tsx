'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  BookOpenIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

export function Navigation() {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigationItems = [
    {
      href: '/produtos',
      icon: BookOpenIcon,
    }
  ];

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setIsLoading(false);
      setShowLogoutModal(false);
    }
  };

  return (
    <>
      <nav className="fixed bottom-0 w-full bg-black border-t border-gray-800">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex justify-around items-center h-16">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center ${
                  pathname === item.href ? 'text-[#5a96f4]' : 'text-gray-400'
                } transition-colors hover:text-[#5a96f4]`}
              >
                <item.icon className="w-6 h-6" />
              </Link>
            ))}
            
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex flex-col items-center text-gray-400 transition-colors hover:text-[#5a96f4]"
            >
              <ArrowRightOnRectangleIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Modal de Confirmação */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-semibold text-white mb-2">
              Confirmar Saída
            </h3>
            <p className="text-gray-300 mb-6">
              Tem certeza que deseja sair da sua conta?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium border border-gray-700 rounded-xl hover:bg-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 text-sm font-medium bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-colors"
              >
                {isLoading ? 'Saindo...' : 'Sair'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}