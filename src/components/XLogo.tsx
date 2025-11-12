import Image from 'next/image';
// ou import { TrendingUp, CandlestickChart } from 'lucide-react';

const XLogo = ({ invert = false }: { invert?: boolean }) => {
  return (
    <div className="flex flex-col items-center space-y-3">
      <Image
        src="/ft-icone.png"
        alt="FT Logo"
        width={80}
        height={80}
        className={`h-auto ${invert ? 'invert brightness-0' : ''}`}
        priority
      />
    </div>
  );
};

export default XLogo;