import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ForexRate {
  pair: string;
  rate: number;
  change: number;
  changePercent: number;
}

const ForexTicker: React.FC = () => {
  const [rates, setRates] = useState<ForexRate[]>([]);

  // Mock forex data - in production, this would fetch from a real forex API
  const mockForexRates: ForexRate[] = [
    { pair: 'EUR/USD', rate: 1.0856, change: 0.0023, changePercent: 0.21 },
    { pair: 'GBP/USD', rate: 1.2645, change: -0.0018, changePercent: -0.14 },
    { pair: 'USD/JPY', rate: 149.23, change: 0.45, changePercent: 0.30 },
    { pair: 'USD/CHF', rate: 0.8821, change: 0.0012, changePercent: 0.14 },
    { pair: 'AUD/USD', rate: 0.6534, change: -0.0025, changePercent: -0.38 },
    { pair: 'USD/CAD', rate: 1.3542, change: 0.0031, changePercent: 0.23 },
    { pair: 'NZD/USD', rate: 0.6098, change: 0.0008, changePercent: 0.13 },
    { pair: 'EUR/GBP', rate: 0.8586, change: 0.0015, changePercent: 0.17 },
    { pair: 'EUR/JPY', rate: 162.05, change: 0.78, changePercent: 0.48 },
    { pair: 'GBP/JPY', rate: 188.72, change: -0.34, changePercent: -0.18 },
    { pair: 'XAU/USD', rate: 2024.50, change: 12.30, changePercent: 0.61 },
    { pair: 'XAG/USD', rate: 22.85, change: -0.15, changePercent: -0.65 },
  ];

  useEffect(() => {
    setRates(mockForexRates);
    
    // Simulate rate updates every 5 seconds
    const interval = setInterval(() => {
      setRates(prevRates => 
        prevRates.map(rate => ({
          ...rate,
          rate: rate.rate + (Math.random() - 0.5) * 0.01,
          change: (Math.random() - 0.5) * 0.01,
          changePercent: (Math.random() - 0.5) * 0.5,
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3" />;
    if (change < 0) return <TrendingDown className="h-3 w-3" />;
    return <Minus className="h-3 w-3" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return 'text-muted-foreground';
  };

  // Duplicate the rates for seamless infinite scroll
  const duplicatedRates = [...rates, ...rates];

  return (
    <div className="bg-gray-900 text-white overflow-hidden py-2">
      <div className="flex animate-ticker">
        {duplicatedRates.map((rate, index) => (
          <div 
            key={`${rate.pair}-${index}`}
            className="flex items-center gap-2 px-6 whitespace-nowrap border-r border-gray-700 last:border-r-0"
          >
            <span className="font-semibold text-sm">{rate.pair}</span>
            <span className="text-sm font-mono">
              {rate.rate.toFixed(rate.pair.includes('JPY') || rate.pair.includes('XAU') || rate.pair.includes('XAG') ? 2 : 4)}
            </span>
            <span className={`flex items-center gap-1 text-xs ${getChangeColor(rate.change)}`}>
              {getChangeIcon(rate.change)}
              {rate.changePercent > 0 ? '+' : ''}{rate.changePercent.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
      
      <style>{`
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-ticker {
          animation: ticker 60s linear infinite;
        }
        
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default ForexTicker;
