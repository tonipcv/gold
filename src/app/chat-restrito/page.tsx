/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import { Navigation } from '../components/Navigation';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import OptimizedImage from 'next/image';
import { useSession } from "next-auth/react";

interface Message {
  id: number;
  text: string;
  createdAt: string;
}

export default function ChatRestrito() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        if (!session) {
          router.push('/');
        } else {
          await pollMessages();
        }
      } finally {
        setIsInitialLoading(false);
      }
    };

    checkUser();

    const intervalId = setInterval(pollMessages, 5000);
    const weeklyIntervalId = setInterval(pollMessages, 7 * 24 * 60 * 60 * 1000);

    return () => {
      clearInterval(intervalId);
      clearInterval(weeklyIntervalId);
    };
  }, [router, session]);

  const pollMessages = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await fetch('https://servidor-servidor-telegram.dpbdp1.easypanel.host/messages/');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      // Atualiza as mensagens sempre que receber dados
      setMessages(data);
      
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };

    const brazilTime = date.toLocaleString('pt-BR', options);
    const [datePart] = date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short' }).split(',');
    const [nowDatePart] = now.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short' }).split(',');

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const [yesterdayDatePart] = yesterday.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short' }).split(',');

    if (datePart === nowDatePart) {
      return `Hoje, ${brazilTime}`;
    } else if (datePart === yesterdayDatePart) {
      return `Ontem, ${brazilTime}`;
    } else {
      return date.toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    }
  };

  const removeEmojis = (text: string) => {
    let modifiedText = text.replace(/🟢/g, '-');
    modifiedText = modifiedText.replace(/️(\s*)ALAVANCAGEM ISOLADA/, '$1ALAVANCAGEM ISOLADA');
    return modifiedText.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
  };

  const formatMessage = (text: string) => {
    const lines = removeEmojis(text).split('\n');
    
    if (lines[0].includes('COMPRA')) {
      return formatCompra(lines);
    } else if (lines[0].includes('VENDA')) {
      return formatVenda(lines);
    } else if (lines[0].includes('cancelado')) {
      return formatCancelado(lines);
    } else if (lines[0].toLowerCase().includes('take - profit') || lines[0].toLowerCase().includes('take-profit') || (lines[0].toLowerCase().includes('metas') && lines[0].toLowerCase().includes('alcançadas'))) {
      return formatTakeProfit(lines);
    } else if (lines[0].toLowerCase().includes('aviso')) {
      return formatAviso(lines);
    }
    
    return lines.map((line, index) => (
      <p key={index} className={`text-${getTextColor(line)}`}>{line.trim()}</p>
    ));
  };


  const getTextColor = (line: string) => {
    if (line.toLowerCase().includes('compra')) return 'green-500 font-bold';
    if (line.toLowerCase().includes('alvos:')) return 'white';
    if (line.toLowerCase().startsWith('stooploss')) return 'gray-500';
    return 'white';
  };

  const formatTakeProfit = (lines: string[]) => {
    // Extrai as informações do texto
    const header = lines[0];
    let type = '', lucro = '', periodo = '', alvo = '';
    
    lines.forEach(line => {
      if (line.toLowerCase().includes('futuros')) type = line;
      if (line.toLowerCase().includes('lucro')) lucro = line;
      if (line.toLowerCase().includes('período')) periodo = line;
      if (line.toLowerCase().includes('alvo:')) alvo = line;
    });

    // Extrai o par de trading do cabeçalho e remove o #
    const tradingPair = header.split('Take')[0].split('Todas')[0].trim().replace('#', '');
    
    // Verifica se é um take-profit de todas as metas ou de alvo específico
    const isFullTakeProfit = header.toLowerCase().includes('todas');

    if (isFullTakeProfit) {
      return (
        <div className="bg-gray-700 p-3 rounded-lg text-white">
          <p className="font-bold text-base md:text-lg text-green-500">LUCRO COM {tradingPair}</p>
          <p className="text-xs text-gray-400">Graças ao time do Futuros Tech todas as metas foram alcançadas</p>
          <div className="mt-4">
            <p className="text-green-500 text-lg md:text-xl font-bold">
              {lucro.includes(':') ? lucro.split(':')[1].trim() : lucro.replace('Lucro:', '').trim()}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {periodo.includes(':') ? periodo.split(':')[1].trim().replace('⏰', '') : periodo.replace('Período:', '').trim().replace('⏰', '')}
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-gray-700 p-3 rounded-lg text-white">
          <p className="font-bold text-base md:text-lg text-green-500">LUCRO COM {tradingPair}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="bg-green-300 text-black px-2 py-0.5 rounded-full text-xs">
              Alvo {alvo.includes(':') ? alvo.split(':')[1].trim() : alvo.replace('Alvo:', '').trim()}
            </span>
            <span className="text-xs text-gray-400">atingido</span>
          </div>
          <div className="mt-4">
            <p className="text-green-500 text-lg md:text-xl font-bold">
              {lucro.includes(':') ? lucro.split(':')[1].trim() : lucro.replace('Lucro:', '').trim()}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {periodo.includes(':') ? periodo.split(':')[1].trim().replace('⏰', '') : periodo.replace('Período:', '').trim().replace('⏰', '')}
            </p>
          </div>
        </div>
      );
    }
  };
  

  const formatTargets = (line: string) => {
    const [label, targetsString] = line.split(':');
    const targets = targetsString.split('-').map(t => t.trim()).filter(t => t !== '');
    return (
      <div className="mt-1">
        <p className="text-white font-bold">{label.trim()}:</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {targets.map((target, index) => (
            <span key={index} className="bg-green-300 text-black px-2 py-0.5 rounded-full text-xs">
              {target}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const formatCompra = (lines: string[]) => {
    const [header, ...rest] = lines;
    let entradaZona = '', alavancagem = '', stoploss = '';
    const alvos: string[] = [];

    rest.forEach(line => {
      if (line.toLowerCase().includes('entrada na zona')) entradaZona = line;
      if (line.toLowerCase().includes('alavancagem isolada')) alavancagem = line;
      if (line.toLowerCase().includes('alvos:')) alvos.push(...line.split(':')[1].split('-').map(a => a.trim()));
      if (line.toLowerCase().includes('stooploss')) stoploss = line;
    });

    return (
      <div className="bg-gray-700 p-3 rounded-lg text-white">
        <p className="font-bold text-base md:text-lg text-green-500">{header.replace('#', '').trim()}</p>
        {entradaZona && <p className="mt-2 text-xs md:text-sm">{entradaZona}</p>}
        {alavancagem && <p className="mt-1 text-xs md:text-sm">{alavancagem}</p>}
        {alvos.length > 0 && formatTargets(`Alvos: ${alvos.join(' - ')}`)}
        {stoploss && <p className="mt-2 text-gray-200 text-xs md:text-sm">{stoploss}</p>}
      </div>
    );
  };

  const formatCancelado = (lines: string[]) => {
    const [header, ...rest] = lines;
    let message = rest.join(' ').replace('@FuturosTech', '').trim();
    if (message.endsWith('<')) message = message.slice(0, -1) + '.';
    else if (!message.endsWith('.')) message += '.';

    return (
      <div className="bg-gray-700 p-3 rounded-lg text-white">
        <p className="font-bold text-base md:text-lg text-gray-200">{header.replace('#', '').trim()}</p>
        <p className="mt-2 text-gray-300 text-xs md:text-sm">{message}</p>
      </div>
    );
  };

  const formatVenda = (lines: string[]) => {
    const [header, ...rest] = lines;
    let entradaZona = '', alavancagem = '', stoploss = '';
    const alvos: string[] = [];

    rest.forEach(line => {
      if (line.toLowerCase().includes('entrada na zona')) entradaZona = line;
      if (line.toLowerCase().includes('alavancagem isolada')) alavancagem = line;
      if (line.toLowerCase().includes('alvos:')) alvos.push(...line.split(':')[1].split('-').map(a => a.trim()));
      if (line.toLowerCase().includes('stooploss')) stoploss = line;
    });

    return (
      <div className="bg-gray-700 p-3 rounded-lg text-white">
        <p className="font-bold text-base md:text-lg text-green-500">{header.replace('#', '').trim()}</p>
        {entradaZona && <p className="mt-2 text-xs md:text-sm">{entradaZona}</p>}
        {alavancagem && <p className="mt-1 text-xs md:text-sm">{alavancagem}</p>}
        {alvos.length > 0 && formatTargets(`Alvos: ${alvos.join(' - ')}`)}
        {stoploss && <p className="mt-2 text-gray-200 text-xs md:text-sm">{stoploss}</p>}
      </div>
    );
  };

  const formatAviso = (lines: string[]) => {
    return (
      <div className="bg-gray-700 p-3 rounded-lg text-white">
        <div className="flex items-center gap-2">
          <span className="bg-gray-600 text-gray-300 px-2 py-0.5 rounded-full text-xs font-medium">
            Atenção
          </span>
        </div>
        <p className="mt-2 text-sm">Entrada editada, zona de entrada atualizada</p>
        <p className="mt-2 text-xs text-gray-400">Ótimo dia a todos!</p>
        <p className="mt-1 text-xs text-gray-400">Att Futuros Tech</p>
      </div>
    );
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-gray-200">
      {/* Disclaimer Minimalista */}
      <div className="fixed top-[4.5rem] left-1/2 -translate-x-1/2 z-10 px-4 w-full max-w-sm">
        <div className="bg-black/60 backdrop-blur-sm rounded-full py-1.5 px-4 flex items-center justify-between gap-3">
          <p className="text-xs text-gray-300 truncate">
            Versão gratuita. Acesso limitado
          </p>
          <a 
            href="https://checkout.k17.com.br/subscribe/anual-ft-promocional"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 text-xs font-medium hover:text-green-300 transition-colors whitespace-nowrap"
          >
            Fazer Upgrade
          </a>
        </div>
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full bg-[#111]/90 backdrop-blur-sm z-50 px-4 py-3">
        <div className="flex justify-center lg:justify-start items-center gap-4">
          <Link href="/" className="flex items-center">
            <OptimizedImage src="/ft-icone.png" alt="Futuros Tech Logo" width={40} height={40} />
          </Link>
          <Link 
            href="/informacao"
            className="text-xs px-3 py-1 bg-green-500 text-black font-medium rounded-full hover:bg-green-400 transition-colors"
          >
            Seja premium!
          </Link>
        </div>
      </header>

      <div className="w-full md:w-1/2 lg:w-1/2 md:mx-auto lg:mx-auto h-[calc(100vh-8.5rem)]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 px-4 md:px-0">
          <h1 className="font-helvetica text-xl">Alertas de Entradas:</h1>
          <button
            onClick={pollMessages}
            disabled={isLoading}
            className="p-2 text-white hover:text-green-300 focus:outline-none transition-colors duration-200"
            title="Atualizar sinais"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
          </button>
        </div>

        {/* Mensagens com Blur mais intenso */}
        <div className="rounded-lg shadow-md p-4 overflow-y-auto mx-4 md:mx-0 h-[calc(100%-3rem)] relative">
          <div className="space-y-2 blur-[8px] select-none pointer-events-none">
            {messages.map((message, index) => {
              const formattedMessage = formatMessage(message.text);
              if (!formattedMessage) return null;
              return (
                <div key={index} className="bg-gray-700 p-3 rounded-2xl border border-gray-700">
                  <div className="text-sm md:text-base">{formattedMessage}</div>
                  <p className="text-gray-400 text-xs mt-1">{formatDate(message.createdAt)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Adicionar o componente Navigation */}
      <Navigation />
    </div>
  );
}
