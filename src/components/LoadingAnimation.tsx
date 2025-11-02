import React from 'react';
import amnivaLogo from '@/assets/amniva-logo.png';

const LoadingAnimation = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="relative flex flex-col items-center gap-8">
        {/* Animated logo container */}
        <div className="relative">
          {/* Pulsing rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-4 border-primary/30 animate-ping" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 rounded-full border-4 border-primary/20 animate-pulse" style={{ animationDelay: '0.2s' }} />
          </div>
          
          {/* Logo with rotation */}
          <div className="relative z-10 w-24 h-24 animate-[spin_3s_ease-in-out_infinite]">
            <img 
              src={amnivaLogo} 
              alt="Amniva" 
              className="w-full h-full object-contain filter drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Loading text */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0s' }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
          <p className="text-lg font-semibold text-foreground animate-pulse">
            Loading Amniva...
          </p>
        </div>

        {/* Gradient bar */}
        <div className="w-64 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary animate-[slide_1.5s_ease-in-out_infinite]" 
               style={{ width: '40%' }} />
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
