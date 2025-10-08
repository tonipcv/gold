import { Navigation } from '../components/Navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#111] text-gray-200">
      <header className="fixed top-0 w-full bg-[#111]/90 backdrop-blur-sm z-50 px-4 py-3">
        <div className="flex justify-center lg:justify-start">
          <Link href="/" className="flex items-center">
            <Image src="/ft-icone.png" alt="Logo" width={40} height={40} />
          </Link>
        </div>
      </header>

      <main className="pt-16 pb-32">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          {children}
        </div>
      </main>

      <Navigation />
    </div>
  );
}
