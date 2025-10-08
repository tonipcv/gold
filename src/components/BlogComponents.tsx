import React from 'react';

// Componente para formatar blocos de texto com estilos consistentes
export const TextBlock = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`text-gray-300 my-6 leading-relaxed ${className}`}>{children}</div>
);

// Componente para títulos de seção
export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-semibold text-green-400 mt-12 mb-6">{children}</h2>
);

// Componente para subtítulos
export const SubTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xl font-medium text-gray-100 mt-8 mb-4">{children}</h3>
);

// Componente para listas
export const ListItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start mb-3">
    <span className="text-green-400 mr-2 mt-1">•</span>
    <span className="text-gray-300">{children}</span>
  </li>
);

// Componente para cards informativos
export const InfoCard = ({ title, children, className = '' }: { title: string, children: React.ReactNode, className?: string }) => (
  <div className={`bg-[#1a1a1a] border border-gray-700 rounded-lg p-6 ${className}`}>
    <h3 className="text-green-400 font-medium text-lg mb-3">{title}</h3>
    <div className="text-gray-300">{children}</div>
  </div>
);

// Componente para citações
export const Quote = ({ children, author }: { children: React.ReactNode, author?: string }) => (
  <blockquote className="border-l-4 border-green-400 pl-4 py-2 my-6">
    <p className="text-gray-300 italic">{children}</p>
    {author && <p className="text-gray-400 text-sm mt-2">— {author}</p>}
  </blockquote>
);

// Componente para código
export const CodeBlock = ({ children, language = 'javascript' }: { children: string, language?: string }) => (
  <pre className="bg-[#0d0d0d] border border-gray-800 rounded-lg p-4 overflow-x-auto my-6">
    <code className="text-gray-300 text-sm font-mono">{children}</code>
  </pre>
);

// Componente para tabelas
export const Table = ({ children }: { children: React.ReactNode }) => (
  <div className="overflow-x-auto my-6">
    <table className="w-full border-collapse">
      {children}
    </table>
  </div>
);

export const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-[#1a1a1a] border-b border-gray-700">
    <tr>
      {children}
    </tr>
  </thead>
);

export const TableHeaderCell = ({ children }: { children: React.ReactNode }) => (
  <th className="text-left p-3 text-gray-100">{children}</th>
);

export const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody>
    {children}
  </tbody>
);

export const TableRow = ({ children }: { children: React.ReactNode }) => (
  <tr className="border-b border-gray-800 hover:bg-[#1a1a1a]">
    {children}
  </tr>
);

export const TableCell = ({ children }: { children: React.ReactNode }) => (
  <td className="p-3 text-gray-300">{children}</td>
);
