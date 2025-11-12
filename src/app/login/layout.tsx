import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KTS - Plataforma de automação de estratégias',
  description: 'Faça login na plataforma KTS e descubra como automatizar suas estratégias com alta performance',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}