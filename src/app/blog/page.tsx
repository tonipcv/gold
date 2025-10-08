'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image?: string;
  author: string;
}

const blogPosts: BlogPost[] = [
  {
    slug: 'krx-labs-local-payments-global-settlement',
    title: 'KRX Labs: Pagamentos Locais, Liquidação Global',
    excerpt: 'Como a KRX Labs está revolucionando o mercado de pagamentos com soluções inovadoras para transações internacionais.',
    date: '2025-10-05',
    image: '/blog/krx-labs-cover.jpg',
    author: 'Equipe Gold'
  },
  // Outros posts podem ser adicionados aqui
];

export default function BlogPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="py-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-green-400 mb-2">Blog</h1>
        <p className="text-gray-400">Artigos, notícias e análises sobre o mercado financeiro</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {blogPosts.map((post) => (
          <Link 
            href={`/blog/${post.slug}`} 
            key={post.slug}
            className="group"
          >
            <div className="bg-[#1a1a1a] hover:bg-[#222] border border-gray-800 rounded-xl overflow-hidden transition-all duration-300">
              <div className="relative h-48 w-full bg-gray-800">
                {post.image ? (
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                    <span>Sem imagem</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-green-400 group-hover:text-green-300 mb-2 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-300 mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{post.author}</span>
                  <span className="text-gray-500">
                    {new Date(post.date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
