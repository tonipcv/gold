import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Futuros Tech Business - A melhor plataforma de educação financeira',
  description: 'Faça login na plataforma Futuros Tech Business e descubra como gerar renda com nossos treinamentos exclusivos',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 