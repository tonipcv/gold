"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function GrupoAutomacaoV2() {
  // Images for the testimonials carousel
  const images = [
    "/dep1.1.jpg",
    "/dep1.2.jpg",
    "/dep1.3.jpg",
    "/dep1.4.jpg",
    "/dep1.5.jpg",
    "/dep1.6.jpg",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const visibleSlides = 3;
  const totalSlides = images.length;
  const maxIndex = Math.max(0, totalSlides - visibleSlides);
  
  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000); // Change slide every 4 seconds
    
    return () => clearInterval(interval);
  }, [maxIndex]);
  
  // Manual navigation
  const goToSlide = (index: number) => {
    const clamped = Math.max(0, Math.min(index, maxIndex));
    setCurrentSlide(clamped);
  };
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev <= 0 ? maxIndex : prev + 1));
  };

  // Função para disparar evento de Lead e redirecionar
  const handleWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Dispara o evento Lead do Facebook Pixel
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        content_name: 'Grupo Automação V3',
        content_category: 'WhatsApp Group',
      });
    }
    
    // Redireciona para o WhatsApp após um pequeno delay
    setTimeout(() => {
      window.open('https://chat.whatsapp.com/GKvWWKI4IkK3Bol6NSV2cR?mode=wwc', '_blank');
    }, 100);
  };
  
  return (
    <div className={`${inter.className} bg-black text-gray-100 min-h-screen relative overflow-hidden`}>
      {/* Solid Black Background */}
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center">
        {/* Profile Avatar */}
        <div className="mb-12 relative">
          <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden">
            <Image 
              src="/perfil.webp" 
              alt="Perfil" 
              width={224} 
              height={224} 
              className="object-contain w-full h-full"
              priority
            />
          </div>
        </div>
        
        {/* Text Content */}
        <div className="text-center mb-12">
          <h1 className={`text-2xl md:text-3xl font-semibold tracking-wide mb-6 text-gray-100`}>
            GRUPO DE TESTE GRATUITO DE AUTOMAÇÃO NO MERCADO INTERNACIONAL
          </h1>
        </div>
        
        {/* WhatsApp Button */}
        <div className="mb-16">
          <a 
            href="https://chat.whatsapp.com/GKvWWKI4IkK3Bol6NSV2cR?mode=wwc"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white font-medium py-3 px-8 rounded-full flex items-center transition-all duration-300 shadow-lg shadow-emerald-600/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span className={`tracking-wider`}>Entrar no grupo</span>
          </a>
        </div>
        
        {/* Images Carousel - Professional 3-up layout */}
        <div className="w-full max-w-5xl">
          <div className="relative overflow-hidden rounded-lg border border-gray-800 bg-black/40">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * (100 / visibleSlides)}%)` }}
            >
              {images.map((src, idx) => (
                <div key={idx} className="min-w-[33.3333%] p-2 md:p-3">
                  <div className="rounded-md overflow-hidden border border-gray-800 bg-zinc-900/60 shadow-md">
                    <Image src={src} alt={`Depoimento ${idx + 1}`} width={800} height={800} className="w-full h-auto object-cover" />
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full border border-gray-700"
              aria-label="Previous slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full border border-gray-700"
              aria-label="Next slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dots */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full ${currentSlide === index ? "bg-white" : "bg-gray-500"}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
