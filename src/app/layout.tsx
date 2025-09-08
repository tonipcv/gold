// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../contexts/ThemeContext';
import FacebookPixel from '../components/FacebookPixel';
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Automação Gold 10X',
  description: 'Tecnologia de estratégia automatizada para automatizar suas operações.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="theme-color" content="#111111" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
        {/* VTurb SmartPlayer performance preloads and dns-prefetch */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              '!function(i,n){i._plt=i._plt||(n&&n.timeOrigin?n.timeOrigin+n.now():Date.now())}(window,performance);',
          }}
        />
        <link
          rel="preload"
          href="https://scripts.converteai.net/17e2196c-5794-49ef-bd61-857538a02fa6/players/68bf26e08b8411c0246b6aff/v4/player.js"
          as="script"
        />
        <link
          rel="preload"
          href="https://scripts.converteai.net/lib/js/smartplayer-wc/v4/smartplayer.js"
          as="script"
        />
        <link
          rel="preload"
          href="https://cdn.converteai.net/17e2196c-5794-49ef-bd61-857538a02fa6/68bf23d78b8411c0246b66e5/main.m3u8"
          as="fetch"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://cdn.converteai.net" />
        <link rel="dns-prefetch" href="https://scripts.converteai.net" />
        <link rel="dns-prefetch" href="https://images.converteai.net" />
        <link rel="dns-prefetch" href="https://api.vturb.com.br" />
      </head>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider>
            <FacebookPixel />
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
