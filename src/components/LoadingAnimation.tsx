import React from 'react';
import amnivaLogo from '@/assets/amniva-logo.png';

const LoadingAnimation = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Logo with glow effect */}
        <div className="relative mb-8 animate-fade-in">
          <div className="absolute inset-0 blur-3xl bg-blue-400/30 rounded-full animate-pulse" />
          <img
            src="/lovable-uploads/09200a87-69a1-40bc-ba24-967d1f42f0e7.png"
            alt="Amniva"
            className="relative w-24 h-24 mx-auto rounded-full shadow-2xl animate-scale-in"
          />
        </div>

        {/* Loading text */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Amniva
          </h2>
          <p className="text-blue-200 text-sm font-medium">
            Powering Your Intelligence Platform
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-8 w-64 mx-auto">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-slide rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
