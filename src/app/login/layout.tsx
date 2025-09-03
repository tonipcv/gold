import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Automação Gold - A melhor plataforma de automação de estratégias',
  description: 'Faça login na plataforma Automação Gold e descubra como automatizar suas estratégias com alta performance',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}