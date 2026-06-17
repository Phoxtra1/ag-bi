import React from 'react';
import amnivaLogo from '@/assets/amniva-logo.png';

const LoadingAnimation = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#0a1628] via-[#0f2847] to-[#0a1628]">
      {/* Animated grid background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(212, 175, 55, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(212, 175, 55, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Animated data nodes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          >
            <div 
              className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 border border-amber-400/20 rounded-full"
              style={{
                animation: `ping ${3 + Math.random() * 2}s ease-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Logo with glow effect */}
        <div className="relative mb-8 animate-fade-in">
          <div className="absolute inset-0 blur-3xl bg-amber-400/20 rounded-full animate-pulse" />
          <img
            src={amnivaLogo}
            alt="Amniva"
            className="relative w-24 h-24 mx-auto rounded-full shadow-2xl animate-scale-in"
            style={{
              boxShadow: '0 0 60px rgba(212, 175, 55, 0.3)'
            }}
          />
        </div>


        {/* Progress bar */}
        <div className="mt-8 w-64 mx-auto">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full animate-slide"
              style={{
                background: 'linear-gradient(90deg, #d4af37, #f5c842, #d4af37)'
              }}
            />
          </div>
        </div>

        {/* Powered by */}
        <p className="mt-6 text-xs text-slate-400">
          Powered by Amineva Global
        </p>
      </div>
    </div>
  );
};

export default LoadingAnimation;