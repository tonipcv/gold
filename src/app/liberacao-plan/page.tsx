'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import * as fbq from '@/lib/fpixel';

export default function Page() {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(12);
  const [showProtectionModal, setShowProtectionModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  });
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [timeLeft, setTimeLeft] = useState('');
  const [countdown, setCountdown] = useState(300); // 5 minutos em segundos

  useEffect(() => {
    // Inicializa a largura da janela
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setIsMobile(window.innerWidth <= 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Atualiza o autoplay baseado no layout
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev < (isMobile ? 4 : 3) ? prev + 1 : 0));
    }, 5000);

    return () => clearInterval(timer);
  }, [isMobile]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(23, 59, 59, 999);
      
      if (now > target) {
        target.setDate(target.getDate() + 1);
      }

      const difference = target.getTime() - now.getTime();
      
      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
      } else {
        setTimeLeft('00:00:00');
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  // Add countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format countdown time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleQuestion = (index: number) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  const handleSubscribeClick = (plan: string) => {
    // Track the subscription event
    fbq.event('InitiateCheckout', {
      content_name: plan,
      currency: 'BRL',
      value: plan === 'annual' ? 297 : 405
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // redirect removido — manter na página
  };

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
      value = value.replace(/(\d)(\d{4})$/, '$1-$2');
      setFormData({ ...formData, whatsapp: value });
    }
  };

  // Função para renderizar a barra de progresso
  const ProgressBar = ({ percentage }: { percentage: number }) => (
    <div className="mt-4 mb-2">
      <div className="flex justify-between text-xs text-neutral-400 mb-1">
        <span>{percentage}% preenchido</span>
        <span>Vagas restantes</span>
      </div>
      <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-green-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );

  if (showProtectionModal) {
    return (
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/95" />
        
        <div className="relative h-full flex items-center justify-center p-4">
          <div className="bg-black border border-neutral-800 rounded-2xl p-8 max-w-md w-full">
            <div className="flex justify-center mb-8">
              <Image
                src="/logo.jpg"
                alt="Automação Gold"
                width={120}
                height={120}
                className="mx-auto"
                priority
              />
            </div>

            <div className="text-center mb-8">
              <h2 className="text-xl font-medium bg-gradient-to-r from-neutral-200 to-white bg-clip-text text-transparent mb-2">
                Infelizmente as vagas foram Encerradas
              </h2>
              <p className="text-sm text-neutral-400">
                Preencha seus dados para caso aja outra disponibilidade
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm text-neutral-400 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-700 transition-colors"
                  placeholder="Digite seu nome completo"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm text-neutral-400 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-700 transition-colors"
                  placeholder="Digite seu melhor e-mail"
                />
              </div>

              <div>
                <label htmlFor="whatsapp" className="block text-sm text-neutral-400 mb-2">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  id="whatsapp"
                  required
                  value={formData.whatsapp}
                  onChange={handleWhatsAppChange}
                  maxLength={15}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-700 transition-colors"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-neutral-700 to-neutral-600 hover:from-neutral-600 hover:to-neutral-500 text-white rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200"
              >
                Entrar na Lista de Espera
              </button>

              <p className="text-xs text-neutral-500 text-center mt-4">
                Seus dados estão seguros e não serão compartilhados.
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-montserrat bg-black text-white min-h-screen relative overflow-hidden">
      <div className="relative z-10">
        {/* Logo Section */}
        <div className="w-full flex justify-center pt-8">
          <Image
            src="/logo.jpg"
            alt="Automação Gold"
            width={120}
            height={120}
            className="mx-auto"
            priority
          />
        </div>

        {/* Countdown and Warning Section */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Countdown Timer */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center gap-2 bg-neutral-900/50 px-4 py-2 rounded-full border border-neutral-800">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-xl font-medium text-white">{formatTime(countdown)}</span>
            </div>
          </div>

          {/* Warning Text */}
          <div className="text-center">
            <p className="text-sm md:text-base text-neutral-300 leading-relaxed max-w-3xl mx-auto">
              <span className="text-green-400 font-medium">Esse link é único</span> e sua liberação está garantida com{' '}
              <span className="text-white font-medium">2 encontros de Mentoria em Grupo com Daniel Katsu</span>. 
              Ao sair da página não nos responsabilizamos em liberar mais vagas e você terá que assistir o vídeo todo de novo e não terá os bônus ou alguns planos.
            </p>
          </div>
        </div>

        {/* Plans Section */}
        <section id="planos" className="py-16 px-4 bg-black">
          <div className="max-w-5xl mx-auto">
            {/* Grid de Planos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Plano 3 Anos (transformado do antigo Mensal) */}
              <div className="order-2 md:order-1 border border-neutral-800/50 rounded-2xl p-8 bg-black/30 backdrop-blur-sm hover:border-neutral-700 transition-all duration-300">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-white">PLANO 3 ANOS (Exclusivo)</h3>
                  <div className="mt-2 text-xs text-neutral-400">Liberdade por 3 anos</div>
                  <ProgressBar percentage={65} />
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">Acesso por 3 anos à Automação Power V2 (Versão Premium)</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">Estratégias Exclusivas Versão 10x</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">2 encontros de mentoria em grupo</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">3 meses de acompanhamento individualizado</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">Suporte prioritário direto comigo</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">Comunidade exclusiva dos 3 anos</span></li>
                </ul>

                <div className="text-center pt-6 border-t border-neutral-800/30">
                  <div className="text-2xl font-light text-white">12x R$297</div>
                  <div className="mt-2 text-2xl md:text-3xl font-semibold text-green-400">Equivalente a 97 por mês</div>
                  
                  <div className="mt-6">
                    <a 
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleSubscribeClick('3years')}
                      className="w-full inline-flex justify-center px-6 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-xl text-black font-medium transition-all duration-200"
                    >
                      PEGAR MINHA VAGA (3 ANOS)
                    </a>
                  </div>
                </div>
              </div>

              {/* Plano Anual */
              }
              <div className="order-1 md:order-2 border border-neutral-800/50 rounded-2xl p-8 bg-black/30 backdrop-blur-sm hover:border-neutral-700 transition-all duration-300">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-white">PLANO ANUAL</h3>
                  <div className="mt-2 text-xs text-neutral-400">Melhor Custo-Benefício</div>
                  <ProgressBar percentage={92} />
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">1 ano de acesso à Automação Power V2 (Versão Premium)</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">Estratégias Exclusivas Versão 10x</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">2 encontros de mentoria em grupo</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">3 meses de acompanhamento individual</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">Suporte premium</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">Atualizações automáticas inclusas</span></li>
                </ul>

                <div className="text-center pt-6 border-t border-neutral-800/30">
                  <div className="text-2xl font-light text-white">12x R$197</div>
                  
                  <div className="mt-6">
                    <a 
                      href="https://checkout.k17.com.br/subscribe/9ef5b01e-4b63-40b0-bfe7-5acf051cfbc6"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleSubscribeClick('annual')}
                      className="w-full inline-flex justify-center px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl text-white font-medium transition-all duration-200"
                    >
                      GARANTIR MINHA VAGA
                    </a>
                  </div>

                  <p className="text-sm text-green-400 font-medium mt-2">Economia de até 67%</p>
                </div>
              </div>

              {/* Plano Trimestral */}
              <div className="order-3 border border-neutral-800/50 rounded-2xl p-8 bg-black/30 backdrop-blur-sm hover:border-neutral-700 transition-all duration-300">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-white">PLANO TRIMESTRAL</h3>
                  <div className="mt-2 text-xs text-neutral-400">Compromisso Médio</div>
                  <ProgressBar percentage={73} />
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">Acesso à Automação Power V2 (Versão Premium) por 3 meses</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">Estratégias Exclusivas Versão 10x</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">2 encontros de mentoria em grupo</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">1 mês de acompanhamento individual</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">Suporte especializado</span></li>
                </ul>

                <div className="text-center pt-6 border-t border-neutral-800/30">
                  <div className="text-2xl font-light text-white">3x de R$347</div>
                  
                  <div className="mt-6">
                    <a 
                      href="https://checkout.k17.com.br/subscribe/ft-trimestral"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleSubscribeClick('quarterly')}
                      className="w-full inline-flex justify-center px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl text-white font-medium transition-all duration-200"
                    >
                      COMEÇAR AGORA
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Depoimentos */}
        <section className="py-24 px-4 bg-black/30">
          <div className="max-w-7xl mx-auto">
            <div className="relative">
              <div className="overflow-hidden rounded-xl">
                <div 
                  className="flex transition-transform duration-500 ease-out" 
                  style={{ 
                    transform: `translateX(-${currentTestimonial * (windowWidth <= 768 ? 50 : 33.333)}%)`
                  }}
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <div 
                      key={num} 
                      className="w-1/2 md:w-1/3 flex-shrink-0 px-3"
                    >
                      <Image
                        src={`/depoimento${num}.webp`}
                        alt={`Depoimento ${num}`}
                        width={600}
                        height={450}
                        className="w-full h-auto rounded-xl shadow-lg transform hover:scale-[1.02] transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={() => setCurrentTestimonial((prev) => (prev > 0 ? prev - 1 : windowWidth <= 768 ? 4 : 3))}
                className="absolute -left-4 md:left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setCurrentTestimonial((prev) => (prev < (windowWidth <= 768 ? 4 : 3) ? prev + 1 : 0))}
                className="absolute -right-4 md:right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Dots Navigation */}
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: windowWidth <= 768 ? 5 : 4 }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentTestimonial === index ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 bg-black">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-light text-center mb-12 bg-gradient-to-r from-neutral-400 to-white bg-clip-text text-transparent">
              Perguntas Frequentes
            </h2>

            <div className="space-y-4">
              {[
                {
                  question: 'O que é o FIP?',
                  answer: 'O FIP (Formação para Investidor Profissional) é um curso completo que leva o aluno do zero até a certificação, com conteúdo didático e liberado por etapas baseado na metodologia de investimentos de Daniel Katsu. Será revelado tudo que ele utilizou para ganhar milhões com mercado do zero ao avançado.'
                },
                {
                  question: 'O que está incluído no bônus de 1 ano do Futuros Tech?',
                  answer: 'O bônus de 1 ano do Futuros Tech oferece acesso à tecnologia exclusiva que ajuda no acompanhamento e análise de mercados futuros, facilitando a tomada de decisão nas operações financeiras. A mensalidade avulsa do Futuros Tech é 500 reais ou o plano anual é 2997 e fazendo a inscrição você ganhar 1 ano de bônus. Como os membros gostam de falar – com apenas um sinal você já paga a mensalidade com lucro.'
                },
                {
                  question: 'O que é o Black Book?',
                  answer: 'O Black Book é um livro exclusivo que compila estratégias e insights valiosos sobre análise gráfica em mais de 274 páginas. É realmente um manual para quem quer se especializar no mercado e está a venda avulso por 1.500 reais (k17.com.br/blackbook) mas ao fazer a inscrição no FIP você recebe a versão digital de graça.'
                },
                {
                  question: 'Qual o suporte que eu recebo durante o curso?',
                  answer: 'Ao se inscrever no FIP, você terá suporte dedicado através do nosso portal de suporte e e-mail. Ao longo das semanas serão liberados conteúdos e você poderá tirar dúvida quando quiser.'
                },
                {
                  question: 'Os sinais no Futuros Tech são de Segunda a Sexta?',
                  answer: 'Não, é todos os dias da semana, em média 5 sinais de operações, essa tecnologia é uma verdadeira máquina de fazer dinheiro.'
                },
                {
                  question: 'Poderei conhecer o Escritório da K17?',
                  answer: 'Com certeza, quando você lucrar mais de 50 mil, uma meta básica, você poderá vim para o escritório para ter o seu reconhecimento pessoalmente e poder conhecer os nossos profissionais pessoalmente.'
                },
                {
                  question: 'E se eu não gostar do FIP?',
                  answer: 'Se você não ficar completamente satisfeito em 7 dias, garantimos a devolução total do seu investimento. Basta enviar um e-mail para contato@k17.com.br e faremos o resto.'
                }
              ].map((item, index) => (
                <div key={index} className="border-b border-neutral-800">
                  <button
                    onClick={() => toggleQuestion(index)}
                    className="w-full flex justify-between items-center py-4 text-left group"
                  >
                    <span className="text-sm bg-gradient-to-r from-neutral-200 to-white bg-clip-text text-transparent font-medium group-hover:from-white group-hover:to-white transition-all duration-300">
                      {item.question}
                    </span>
                    <ChevronDown 
                      className={`w-4 h-4 text-neutral-400 transition-transform duration-300 ${
                        activeQuestion === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {activeQuestion === index && (
                    <p className="text-neutral-400 text-sm pb-4 leading-relaxed">
                      {item.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 text-center bg-black">
          <p className="text-neutral-500 text-xs">Automação Gold - Todos os direitos reservados</p>
        </footer>
      </div>
    </div>
  );
}
