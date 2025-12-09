import Link from 'next/link'
import { OptimizedImage } from '@/app/components/OptimizedImage'

export default function ComoFuncionaPage() {
  return (
    <div className="min-h-screen bg-black text-gray-200 font-satoshi tracking-[-0.03em]">
      <header className="fixed top-0 w-full bg-black/90 backdrop-blur-sm z-50 px-4 py-3">
        <div className="flex justify-center items-center max-w-7xl mx-auto">
          <Link href="/" className="flex items-center">
            <OptimizedImage src="/ft-icone.png" alt="Futuros Tech Logo" width={40} height={40} className="brightness-0 invert" />
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-20">
        <div className="w-full md:w-3/4 lg:w-3/4 md:mx-auto lg:mx-auto px-4 py-4 space-y-8">
          <h1 className="text-2xl md:text-[28px] font-semibold text-white tracking-tight">Como funciona a Assinatura de Automação</h1>

          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-white">A Assinatura de Automação: tecnologia avançada para quem busca operar com mais eficiência e controle</h2>
            <p className="text-gray-300">A Assinatura de Automação é um software profissional de automação operacional, desenvolvido para ajudar traders e investidores a executarem suas estratégias com mais agilidade, disciplina e precisão.</p>
            <p className="text-gray-300">Ela não substitui o usuário, não toma decisões por conta própria e não realiza nenhuma operação independente: você configura, o sistema executa.</p>
            <p className="text-gray-300">Criada a partir de meses de otimização, análises de fluxo e dados reais de mercado, a Assinatura de Automação foi construída para quem busca operar de forma mais estruturada, com regras claras e total controle sobre cada etapa do processo.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-white">Tecnologia projetada para maximizar eficiência operacional</h2>
            <p className="text-gray-300">A Assinatura de Automação oferece recursos avançados que ajudam o usuário a reduzir erros manuais, manter consistência nas entradas e saídas e acompanhar a estratégia com clareza.</p>
            <p className="text-gray-300">Entre os principais diferenciais, estão:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>Execução automatizada das regras definidas pelo próprio usuário</li>
              <li>Filtros inteligentes, inspirados em dados operacionais reais</li>
              <li>Ajustes dinâmicos de volatilidade, para adaptação a diferentes condições de mercado</li>
              <li>Configurações totalmente personalizáveis: ativos, riscos, stops, horários e muito mais</li>
              <li>Segurança adicional com limites, travas e parâmetros opcionais na sua corretora</li>
              <li>Interface intuitiva, ideal para iniciantes e experientes</li>
              <li>Integração com corretoras reconhecidas no mercado</li>
            </ul>
            <p className="text-gray-300">A lógica é simples: você define a estratégia, o sistema executa com disciplina.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-white">Criado para quem busca consistência no longo prazo</h2>
            <p className="text-gray-300">A Assinatura de Automação foi desenvolvida com base em um princípio simples: disciplina vence emoção.</p>
            <p className="text-gray-300">Ela ajuda você a:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>evitar erros de clique,</li>
              <li>manter o foco em regras claras,</li>
              <li>seguir parâmetros definidos previamente,</li>
              <li>automatizar tarefas repetitivas,</li>
              <li>operar com a mesma lógica todos os dias.</li>
            </ul>
            <p className="text-gray-300">Essa consistência é fundamental para qualquer estratégia bem estruturada.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-white">Ideal para traders que valorizam autonomia e controle</h2>
            <p className="text-gray-300">Aqui, você tem liberdade total para configurar sua operação da forma que desejar.</p>
            <p className="text-gray-300">Você pode:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>definir stops e travas de segurança,</li>
              <li>ajustar horários de atuação,</li>
              <li>escolher os ativos,</li>
              <li>controlar o tamanho das posições,</li>
              <li>personalizar cada detalhe da sua estratégia.</li>
            </ul>
            <p className="text-gray-300">E o mais importante: tudo fica 100% sob o seu controle.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-white">Copy e estratégias prontas (opcionais e totalmente personalizáveis)</h2>
            <p className="text-gray-300">A Assinatura de Automação oferece modelos de configuração que servem apenas como referência técnica para demonstrar funcionalidades.</p>
            <p className="text-gray-300">Eles podem ser usados como ponto de partida, mas devem ser ajustados pelo próprio usuário.</p>
            <p className="text-gray-300">Nada do que disponibilizamos é recomendação de investimento.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-white">Compatível com computador e mobile</h2>
            <p className="text-gray-300">Pelo celular, é possível ajustar parâmetros de segurança, como stops.</p>
            <p className="text-gray-300">Pelo computador, o usuário tem acesso à personalização completa da estratégia.</p>
            <p className="text-gray-300">Isso permite que você opere do seu jeito, onde estiver.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-white">Desenvolvida com foco em segurança, transparência e responsabilidade</h2>
            <p className="text-gray-300">A Assinatura de Automação segue boas práticas regulatórias e respeita todas as limitações exigidas para empresas de tecnologia que atuam no mercado financeiro:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>Não acessamos sua conta.</li>
              <li>Não gerimos capital.</li>
              <li>Não fazemos recomendações.</li>
              <li>Não realizamos operações por iniciativa própria.</li>
            </ul>
            <p className="text-gray-300">Nosso papel é entregar uma ferramenta tecnológica segura, funcional e eficiente para que você possa executar sua estratégia com mais organização e consistência.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-white">Para quem é a Assinatura de Automação</h2>
            <p className="text-gray-300">Ela é ideal para quem deseja:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>operar com mais disciplina;</li>
              <li>reduzir erros manuais;</li>
              <li>executar estratégias com precisão;</li>
              <li>manter consistência operacional;</li>
              <li>automatizar rotinas sem abrir mão do controle;</li>
              <li>utilizar tecnologia a favor da gestão do tempo e da disciplina.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-white">Transparência sempre</h2>
            <p className="text-gray-300">A Assinatura de Automação não garante resultados, não promete lucro e não assegura performance.</p>
            <p className="text-gray-300">Cada resultado depende exclusivamente das configurações escolhidas pelo usuário e das condições do mercado.</p>
            <p className="text-gray-300">Nosso compromisso é com a qualidade da tecnologia — não com retorno financeiro.</p>
          </section>

          <div className="pt-2 flex justify-center">
            <a
              href="https://test.k17.com.br/register"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold bg-green-600 hover:bg-green-500 text-white border border-green-500/60"
            >
              Criar conta
            </a>
          </div>
        </div>
      </main>

      <div className="px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          <p className="text-[11px] md:text-xs leading-relaxed text-gray-400 border-t border-white/10 pt-4">
            Este software não opera por você: todas as configurações de risco, stop e seleção de ativos são responsabilidade exclusiva do usuário. A Provedora não acessa sua conta, não executa ordens e não realiza qualquer gestão ou recomendação de investimento. O usuário reconhece que pode perder parte ou todo o capital investido e que exemplos de performance apresentados são meramente ilustrativos, não representando garantia de resultados futuros.
          </p>
        </div>
      </div>
    </div>
  )
}
