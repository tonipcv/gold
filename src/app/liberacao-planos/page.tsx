'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import * as fbq from '@/lib/fpixel';
import XLogo from '@/components/XLogo';

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
  const ProgressBar = ({ percentage, color = 'green' }: { percentage: number, color?: 'green' | 'red' | 'white' }) => (
    <div className="mt-4 mb-2">
      <div className="flex justify-between text-xs text-neutral-400 mb-1">
        <span>{percentage}% preenchido</span>
        <span>Vagas restantes</span>
      </div>
      <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${color === 'red' ? 'bg-red-400' : color === 'white' ? 'bg-white' : 'bg-green-500'} rounded-full transition-all duration-500`}
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
              <XLogo />
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
    <div className="font-sans bg-black text-white min-h-screen relative overflow-hidden">
      <div className="relative z-10">
        {/* Logo Section */}
        <div className="w-full flex justify-center pt-8">
          <XLogo />
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
              Este link é único e garante sua vaga com todos os automatizadores liberados e acesso à versão otimizada para melhor performance.
            </p>
          </div>
        </div>

        {/* Plans Section */}
        <section id="planos" className="py-16 px-4 bg-black">
          <div className="max-w-5xl mx-auto">
            {/* Grid de Planos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Plano Vitalício (transformado do antigo Mensal) */}
              <div className="order-3 md:order-3 border border-neutral-800 rounded-2xl p-8 bg-transparent transition-all duration-200">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-white">PLANO VITALÍCIO (Exclusivo)</h3>
                  <div className="mt-2 text-xs text-neutral-400">5 vagas</div>
                  <ProgressBar percentage={65} color="red" />
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3 text-sm"><span className="text-white/70 mt-1">✓</span><span className="text-white">Acesso Vitalício à Versão Otimizada</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-white/70 mt-1">✓</span><span className="text-white">Todos: GOLD X 10x, POWER V2, FALCON BIT liberados.</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-white/70 mt-1">✓</span><span className="text-white">Atualizações Futuras Inclusas</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-white/70 mt-1">✓</span><span className="text-white">Suporte Prioritário</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-white/70 mt-1">✓</span><span className="text-white">Comunidade Vitalícia</span></li>
                </ul>

                <div className="text-center pt-6 border-t border-neutral-800/30">
                  <div className="text-2xl font-light text-white">12x R$1.578,50</div>
                  
                  <div className="mt-6">
                    <a
                      href="https://checkout.k17.com.br/pay/vitalicio-10x"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleSubscribeClick('lifetime')}
                      className="w-full inline-flex justify-center px-6 py-3 bg-transparent hover:bg-white/5 border border-neutral-700 rounded-xl text-white font-medium transition-all duration-150"
                    >
                      GARANTIR ACESSO VITALÍCIO AGORA
                    </a>
                  </div>
                </div>
              </div>

              {/* Plano Semestral */}
              <div className="order-1 md:order-1 relative border border-neutral-800 rounded-2xl p-8 bg-transparent transition-all duration-200">
                {/* Badge Recomendado */}
                <span className="absolute -top-3 right-4 text-[10px] px-2 py-1 rounded-full bg-neutral-900 text-neutral-300 border border-neutral-800">Recomendado</span>
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-white">PLANO SEMESTRAL</h3>
                  <div className="mt-2 text-xs text-neutral-400">43 vagas</div>
                  <ProgressBar percentage={85} color="red" />
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">Acesso à Versão Otimizada (Melhor Performance)</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">Todos: GOLD X 10x, POWER V2, FALCON BIT liberados.</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">Instalação Guiada + Suporte Individual</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">Encontro de Mentoria Exclusivo</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">Atualizações Inclusas Durante o Período</span></li>
                </ul>

                <div className="text-center pt-6 border-t border-neutral-800/30">
                  <div className="text-2xl font-light text-white">6x R$263,99</div>
                  
                  <div className="mt-6">
                    <a 
                      href="https://checkout.k17.com.br/subscribe/semetral10x"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleSubscribeClick('semiannual')}
                      className="w-full inline-flex justify-center px-6 py-3 bg-green-400 hover:bg-green-500 rounded-xl text-white font-medium transition-all duration-150"
                    >
                      COMEÇAR AGORA
                    </a>
                  </div>
                </div>
              </div>

              {/* Plano Trimestral */}
              <div className="order-2 md:order-2 border border-neutral-800 rounded-2xl p-8 bg-transparent transition-all duration-200">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-white">PLANO TRIMESTRAL</h3>
                  <div className="mt-2 text-xs text-neutral-400">80 vagas</div>
                  <ProgressBar percentage={73} color="red" />
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">Acesso à Versão Otimizada (Melhor Performance)</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">Todos: GOLD X 10x, POWER V2, FALCON BIT liberados.</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">Instalação Guiada + Suporte Individual</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">Encontro de Mentoria Exclusivo</span></li>
                  <li className="flex items-start gap-3 text-sm"><span className="text-green-400 mt-1">✓</span><span className="text-white">Atualizações Inclusas Durante o Período</span></li>
                </ul>

                <div className="text-center pt-6 border-t border-neutral-800/30">
                  <div className="text-2xl font-light text-white">3x R$319,71</div>
                  
                  <div className="mt-6">
                    <a 
                      href="https://checkout.k17.com.br/subscribe/trimestral10x"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleSubscribeClick('quarterly')}
                      className="w-full inline-flex justify-center px-6 py-3 bg-green-400 hover:bg-green-500 rounded-xl text-white font-medium transition-all duration-150"
                    >
                      COMEÇAR AGORA
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Depoimentos removidos */}

        {/* FAQ removido */}

        {/* Footer (same texto do login, não fixo) */}
        <footer className="px-4 py-6 text-center bg-black">
          <div className="max-w-md mx-auto">
            <p className="text-[10px] leading-relaxed text-zinc-400">
              Este software não opera por você: todas as configurações de risco, stop e seleção de ativos são responsabilidade exclusiva do usuário. A Provedora não acessa sua conta, não executa ordens e não realiza qualquer gestão ou recomendação de investimento. O usuário reconhece que pode perder parte ou todo o capital investido e que exemplos de performance apresentados são meramente ilustrativos, não representando garantia de resultados futuros.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
