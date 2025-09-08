import XLogo from "@/components/XLogo";

export const metadata = {
  title: "Termos de Uso – Gold 10x (Versão Oficial)",
  description:
    "Termos de Uso oficiais da Versão Oficial do software/estratégia Gold 10x disponibilizada pela LYS Metaverse.",
};

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header / Logo */}
      <header className="w-full flex justify-center pt-8">
        <XLogo />
      </header>

      <main className="px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-semibold text-center mb-2">
            Termos de Uso – Gold 10x (Versão Oficial)
          </h1>
          <p className="text-center text-neutral-400 mb-10">Data: 26 de agosto de 2025</p>

          <p className="text-neutral-300 leading-relaxed mb-8">
            A versão oficial do software/estratégia Gold 10x (“Versão Oficial”) é disponibilizada pela LYS Metaverse,
            exclusivamente aos usuários que adquirirem regularmente a licença de uso. Ao baixar, instalar, ativar ou
            utilizar a Versão Oficial, o usuário declara que leu, entendeu e concorda integralmente com estes Termos de Uso.
          </p>

          {/* 1. Natureza da Versão Oficial */}
          <section className="mb-8">
            <h2 className="text-xl font-medium mb-3">1. Natureza da Versão Oficial</h2>
            <ol className="list-decimal pl-5 space-y-2 text-neutral-300">
              <li>
                O Gold 10x consiste em um software/arquivo digital de estratégia automatizada para operações financeiras.
              </li>
              <li>
                Trata-se de uma versão licenciada e oficial, distinta da versão de teste, com funcionalidades adicionais,
                maior estabilidade e suporte limitado.
              </li>
              <li>
                O objetivo é oferecer ao usuário acesso contínuo e legítimo ao produto, conforme os termos aqui descritos.
              </li>
            </ol>
          </section>

          {/* 2. Isenção de Responsabilidade */}
          <section className="mb-8">
            <h2 className="text-xl font-medium mb-3">2. Isenção de Responsabilidade</h2>
            <ol className="list-decimal pl-5 space-y-2 text-neutral-300">
              <li>
                A LYS Metaverse não garante resultados financeiros específicos, nem assume responsabilidade por perdas
                decorrentes do uso do Gold 10x.
              </li>
              <li>
                A empresa não responde por falhas de conexão, erros de configuração, mau uso do software, instabilidades
                em corretoras, plataformas ou terceiros integrados.
              </li>
              <li>
                O usuário reconhece que toda operação em mercado financeiro envolve risco elevado, sendo de sua exclusiva
                responsabilidade qualquer decisão tomada.
              </li>
            </ol>
          </section>

          {/* 3. Ausência de Consultoria ou Assessoria */}
          <section className="mb-8">
            <h2 className="text-xl font-medium mb-3">3. Ausência de Consultoria ou Assessoria</h2>
            <ol className="list-decimal pl-5 space-y-2 text-neutral-300">
              <li> A LYS Metaverse não é corretora, banco, consultoria financeira ou assessoria de investimentos.</li>
              <li>
                O Gold 10x é apenas uma ferramenta tecnológica automatizadora, não devendo ser interpretado como
                recomendação de investimento, gestão de carteira ou promessa de rentabilidade.
              </li>
            </ol>
          </section>

          {/* 4. Licença de Uso */}
          <section className="mb-8">
            <h2 className="text-xl font-medium mb-3">4. Licença de Uso</h2>
            <ol className="list-decimal pl-5 space-y-2 text-neutral-300">
              <li>
                O usuário adquire uma licença pessoal, limitada, não exclusiva, intransferível e revogável, para uso
                individual do Gold 10x.
              </li>
              <li>
                É expressamente proibido:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>revender, redistribuir ou compartilhar o software sem autorização;</li>
                  <li>copiar, modificar, realizar engenharia reversa ou criar produtos derivados;</li>
                  <li>utilizar o Gold 10x de forma que viole leis, regulamentos ou direitos de terceiros.</li>
                </ul>
              </li>
              <li>
                Todos os direitos autorais, marcas e propriedade intelectual pertencem exclusivamente à LYS Metaverse.
              </li>
            </ol>
          </section>

          {/* 5. Condições Comerciais */}
          <section className="mb-8">
            <h2 className="text-xl font-medium mb-3">5. Condições Comerciais</h2>
            <ol className="list-decimal pl-5 space-y-2 text-neutral-300">
              <li>
                O acesso à Versão Oficial está condicionado ao pagamento integral do valor acordado no ato da contratação.
              </li>
              <li>A falta de pagamento poderá resultar na suspensão ou cancelamento imediato da licença.</li>
              <li>
                O valor pago é referente à licença de uso e não constitui depósito, investimento ou promessa de retorno financeiro.
              </li>
            </ol>
          </section>

          {/* 6. Suporte Técnico */}
          <section className="mb-8">
            <h2 className="text-xl font-medium mb-3">6. Suporte Técnico</h2>
            <ol className="list-decimal pl-5 space-y-2 text-neutral-300">
              <li>
                O usuário terá direito a suporte técnico limitado, fornecido em canais oficiais da LYS Metaverse.
              </li>
              <li>
                O suporte será restrito a dúvidas sobre instalação, configuração e funcionamento básico do software.
              </li>
              <li>
                A LYS Metaverse não se compromete a fornecer suporte individualizado para estratégias personalizadas,
                erros externos ou integração com plataformas de terceiros.
              </li>
            </ol>
          </section>

          {/* 7. Atualizações e Melhorias */}
          <section className="mb-8">
            <h2 className="text-xl font-medium mb-3">7. Atualizações e Melhorias</h2>
            <ol className="list-decimal pl-5 space-y-2 text-neutral-300">
              <li>
                A LYS Metaverse poderá disponibilizar atualizações, correções e melhorias ao Gold 10x, a seu exclusivo critério.
              </li>
              <li>O fornecimento de atualizações pode estar condicionado ao plano de licença contratado.</li>
              <li> A empresa não é obrigada a manter compatibilidade retroativa com versões antigas.</li>
            </ol>
          </section>

          {/* 8. Revogação e Cancelamento */}
          <section className="mb-8">
            <h2 className="text-xl font-medium mb-3">8. Revogação e Cancelamento</h2>
            <ol className="list-decimal pl-5 space-y-2 text-neutral-300">
              <li>
                A LYS Metaverse poderá suspender ou revogar o acesso do usuário ao Gold 10x em caso de violação destes
                Termos de Uso.
              </li>
              <li>
                O cancelamento da licença não gera direito a reembolso, salvo nos casos previstos na legislação vigente.
              </li>
            </ol>
          </section>

          {/* 9. Aviso de Risco */}
          <section className="mb-8">
            <h2 className="text-xl font-medium mb-3">9. Aviso de Risco</h2>
            <ol className="list-decimal pl-5 space-y-2 text-neutral-300">
              <li>
                O usuário reconhece que operações em mercados financeiros envolvem risco elevado, podendo resultar em
                perda parcial ou total do capital investido.
              </li>
              <li>
                A LYS Metaverse não se responsabiliza por qualquer decisão de investimento tomada com base no uso do Gold 10x.
              </li>
            </ol>
          </section>

          {/* 10. Foro e Legislação Aplicável */}
          <section className="mb-10">
            <h2 className="text-xl font-medium mb-3">10. Foro e Legislação Aplicável</h2>
            <ol className="list-decimal pl-5 space-y-2 text-neutral-300">
              <li> Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil.</li>
              <li>
                Fica eleito o foro da comarca de São Paulo/SP, com renúncia a qualquer outro, por mais privilegiado que seja,
                para dirimir eventuais controvérsias.
              </li>
            </ol>
          </section>

          {/* Aviso Final */}
          <section className="mb-4">
            <h2 className="text-xl font-medium mb-3">AVISO FINAL</h2>
            <p className="text-neutral-300 leading-relaxed">
              O Gold 10x é uma ferramenta oficial e licenciada da LYS Metaverse, destinada a usuários que compreendem os riscos
              inerentes às operações financeiras. Não constitui consultoria, assessoria ou promessa de rentabilidade. O uso é
              pessoal, exclusivo e intransferível.
            </p>
          </section>
        </div>
      </main>

      <footer className="py-8 px-4 text-center text-neutral-500 text-xs">
        Automação Gold - Todos os direitos reservados
      </footer>
    </div>
  );
}
