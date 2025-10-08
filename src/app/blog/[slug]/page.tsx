'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Componente para formatar blocos de texto com estilos consistentes
const TextBlock = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`text-gray-300 my-6 leading-relaxed ${className}`}>{children}</div>
);

// Componente para títulos de seção
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-semibold text-green-400 mt-12 mb-6">{children}</h2>
);

// Componente para subtítulos
const SubTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xl font-medium text-gray-100 mt-8 mb-4">{children}</h3>
);

// Componente para listas
const ListItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start mb-3">
    <span className="text-green-400 mr-2 mt-1">•</span>
    <span className="text-gray-300">{children}</span>
  </li>
);

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  image?: string;
  content: React.ReactNode;
}

// Conteúdo dos posts do blog
const blogPosts: Record<string, BlogPost> = {
  'krx-labs-local-payments-global-settlement': {
    slug: 'krx-labs-local-payments-global-settlement',
    title: 'KRX Labs: Pagamentos Locais, Liquidação Global',
    date: '2025-10-05',
    author: 'Equipe Gold',
    image: '/blog/krx-labs-cover.jpg',
    content: (
      <>
        <TextBlock>
          A KRX Labs está redefinindo o cenário de pagamentos internacionais com uma abordagem inovadora que combina a facilidade dos pagamentos locais com a eficiência da liquidação global. Em um mundo cada vez mais interconectado, a capacidade de realizar transações financeiras sem fronteiras torna-se não apenas uma conveniência, mas uma necessidade para empresas e indivíduos.
        </TextBlock>

        <SectionTitle>Desafios dos Pagamentos Internacionais</SectionTitle>
        <TextBlock>
          Tradicionalmente, os pagamentos internacionais enfrentam vários obstáculos:
        </TextBlock>
        <ul className="list-none space-y-3 my-6 pl-4">
          <ListItem>
            <strong className="text-gray-100">Altas taxas de conversão:</strong> As taxas de câmbio desfavoráveis e as comissões bancárias podem consumir uma parte significativa do valor transferido.
          </ListItem>
          <ListItem>
            <strong className="text-gray-100">Tempos de processamento longos:</strong> As transferências internacionais podem levar dias ou até semanas para serem concluídas.
          </ListItem>
          <ListItem>
            <strong className="text-gray-100">Complexidade regulatória:</strong> Navegar pelas diferentes regulamentações financeiras de cada país representa um desafio considerável.
          </ListItem>
          <ListItem>
            <strong className="text-gray-100">Falta de transparência:</strong> Muitas vezes é difícil rastrear o status de uma transferência internacional ou entender todas as taxas envolvidas.
          </ListItem>
        </ul>

        <SectionTitle>A Solução KRX Labs</SectionTitle>
        <TextBlock>
          A plataforma desenvolvida pela KRX Labs aborda esses desafios através de uma combinação de tecnologia blockchain, parcerias estratégicas com instituições financeiras locais e um sistema de liquidação inovador.
        </TextBlock>

        <SubTitle>Como Funciona</SubTitle>
        <TextBlock>
          O processo é surpreendentemente simples do ponto de vista do usuário:
        </TextBlock>
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 my-6">
          <ol className="list-decimal pl-5 space-y-4 text-gray-300">
            <li><span className="text-gray-100">Iniciação:</span> O remetente inicia uma transferência em sua moeda local através da plataforma KRX.</li>
            <li><span className="text-gray-100">Conversão:</span> A KRX utiliza seu pool de liquidez para converter o valor para a moeda do destinatário a taxas competitivas.</li>
            <li><span className="text-gray-100">Liquidação:</span> O valor é creditado na conta do destinatário através de um parceiro bancário local.</li>
            <li><span className="text-gray-100">Confirmação:</span> Ambas as partes recebem confirmação em tempo real da transação concluída.</li>
          </ol>
        </div>

        <SectionTitle>Vantagens Competitivas</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6">
            <h3 className="text-green-400 font-medium text-lg mb-3">Rapidez</h3>
            <p className="text-gray-300">Liquidação em minutos ou horas, em vez de dias, graças à rede de parceiros locais e tecnologia blockchain.</p>
          </div>
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6">
            <h3 className="text-green-400 font-medium text-lg mb-3">Economia</h3>
            <p className="text-gray-300">Taxas significativamente menores comparadas às soluções bancárias tradicionais e outros serviços de transferência.</p>
          </div>
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6">
            <h3 className="text-green-400 font-medium text-lg mb-3">Transparência</h3>
            <p className="text-gray-300">Rastreamento em tempo real e divulgação clara de todas as taxas antes da confirmação da transação.</p>
          </div>
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6">
            <h3 className="text-green-400 font-medium text-lg mb-3">Conformidade</h3>
            <p className="text-gray-300">Processos robustos de KYC/AML e parcerias com instituições regulamentadas em cada mercado.</p>
          </div>
        </div>

        <SectionTitle>Casos de Uso</SectionTitle>
        <TextBlock>
          A solução da KRX Labs está sendo adotada por diversos segmentos:
        </TextBlock>
        <ul className="list-none space-y-3 my-6 pl-4">
          <ListItem>
            <strong className="text-gray-100">E-commerce internacional:</strong> Facilitando pagamentos transfronteiriços para vendedores e marketplaces.
          </ListItem>
          <ListItem>
            <strong className="text-gray-100">Remessas:</strong> Permitindo que trabalhadores enviem dinheiro para suas famílias em outros países com taxas reduzidas.
          </ListItem>
          <ListItem>
            <strong className="text-gray-100">Empresas multinacionais:</strong> Simplificando a gestão de folha de pagamento e pagamentos a fornecedores em diferentes países.
          </ListItem>
          <ListItem>
            <strong className="text-gray-100">Plataformas de freelancers:</strong> Possibilitando pagamentos rápidos e econômicos para profissionais em qualquer parte do mundo.
          </ListItem>
        </ul>

        <SectionTitle>Informações de Pagamento</SectionTitle>
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 my-6">
          <h3 className="text-xl font-medium text-gray-100 mb-4">Detalhes do Recebedor</h3>
          <div className="space-y-3 text-gray-300">
            <p><span className="text-gray-400">Status:</span> <span className="text-green-400">ACTIVE</span></p>
            <p><span className="text-gray-400">Recipient:</span> re_cmg9qh7vt009e0l9thca6g13m</p>
            <p><span className="text-gray-400">Split % (clínica):</span> 100%</p>
            <p><span className="text-gray-400">Taxa plataforma (bps):</span> 0</p>
            <p><span className="text-gray-400">Última sincronização:</span> 10/2/2025, 3:13:16 PM</p>
            
            <div className="mt-6">
              <h4 className="text-lg font-medium text-gray-100 mb-3">Recebedor</h4>
              <p><span className="text-gray-400">Nome:</span> Joao</p>
              <p><span className="text-gray-400">Documento:</span> 066.242.895-11</p>
              <p><span className="text-gray-400">Conta bancária:</span> 123 · ag 1234-1 · conta 12345-1 · checking</p>
              <p><span className="text-gray-400">Transferências:</span> Desativadas · Daily · dia 0</p>
            </div>
          </div>
        </div>

        <SectionTitle>Simulador de Cartão de Crédito</SectionTitle>
        <TextBlock>
          Para facilitar testes e demonstrações, a KRX Labs disponibiliza um simulador de cartão de crédito. Este simulador permite que desenvolvedores e parceiros testem a integração com a plataforma sem a necessidade de usar cartões reais.
        </TextBlock>
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 my-6">
          <p className="text-gray-300 mb-4">
            Acesse o simulador através do link abaixo:
          </p>
          <a 
            href="https://docs.pagar.me/docs/simulador-de-cartão-de-crédit" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300 transition-colors underline"
          >
            https://docs.pagar.me/docs/simulador-de-cartão-de-crédit
          </a>
        </div>

        <SectionTitle>Conclusão</SectionTitle>
        <TextBlock>
          A KRX Labs está na vanguarda da revolução dos pagamentos internacionais, combinando a conveniência dos sistemas locais com a eficiência da tecnologia global. À medida que as fronteiras econômicas continuam a se dissolver, soluções como esta se tornarão cada vez mais essenciais para empresas e indivíduos que operam em um mundo verdadeiramente globalizado.
        </TextBlock>
        <TextBlock>
          Para mais informações sobre como integrar a solução da KRX Labs ao seu negócio, entre em contato com nossa equipe de suporte.
        </TextBlock>
      </>
    )
  }
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const post = blogPosts[slug];

  if (!post) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-100 mb-4">Artigo não encontrado</h1>
        <p className="text-gray-400 mb-8">O artigo que você está procurando não existe ou foi removido.</p>
        <Link href="/blog" className="text-green-400 hover:text-green-300 transition-colors">
          Voltar para o blog
        </Link>
      </div>
    );
  }

  return (
    <article className="py-8">
      <Link href="/blog" className="inline-flex items-center text-green-400 hover:text-green-300 mb-6 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Voltar para o blog
      </Link>

      <h1 className="text-3xl md:text-4xl font-bold text-green-400 mb-4">{post.title}</h1>
      
      <div className="flex items-center text-sm text-gray-400 mb-8">
        <span>{post.author}</span>
        <span className="mx-2">•</span>
        <span>{new Date(post.date).toLocaleDateString('pt-BR')}</span>
      </div>

      {post.image && (
        <div className="relative h-64 md:h-96 w-full mb-8 rounded-xl overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
            priority
          />
        </div>
      )}

      <div className="prose prose-invert max-w-none">
        {post.content}
      </div>
    </article>
  );
}
