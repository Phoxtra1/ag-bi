import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import amnivaLogo from '@/assets/amniva-logo.png';

const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={amnivaLogo}
              alt="Amniva Logo" 
              className="h-9 w-9 rounded-lg"
            />
            <span className="text-xl font-bold text-foreground">Amniva</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/verify" 
              className="text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              Verify
            </Link>
            <Link 
              to="/reports" 
              className="text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              Info
            </Link>
            <Link 
              to="/predictions" 
              className="text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              Prediction
            </Link>
            <Link 
              to="/trending" 
              className="text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              Business Trends
            </Link>
            <Link 
              to="/pricing" 
              className="text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              Pricing
            </Link>
            <Link 
              to="/api-organizations" 
              className="text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              API
            </Link>
            <Link 
              to="/odeneho-ai" 
              className="text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              Odeneho AI
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          {/* Mobile navigation can be added here */}
        </div>
      </nav>
    </header>
  );
};

export default Header;