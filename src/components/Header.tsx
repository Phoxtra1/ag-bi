
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/ea0bb535-fc7d-44f0-80e1-abd03b1a3317.png" 
              alt="Amniva Logo" 
              className="h-8 w-8"
            />
            <span className="text-xl font-bold text-[#1D4ED8]">Amniva</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/verify" 
              className="text-gray-700 hover:text-[#1D4ED8] font-medium transition-colors"
            >
              Verify Info
            </Link>
            <Link 
              to="/trending" 
              className="text-gray-700 hover:text-[#1D4ED8] font-medium transition-colors"
            >
              Trending
            </Link>
            <Link 
              to="/predictions" 
              className="text-gray-700 hover:text-[#1D4ED8] font-medium transition-colors"
            >
              Predictions
            </Link>
            <Link 
              to="/reports" 
              className="text-gray-700 hover:text-[#1D4ED8] font-medium transition-colors"
            >
              Reports
            </Link>
            <Link 
              to="/pricing" 
              className="text-gray-700 hover:text-[#1D4ED8] font-medium transition-colors"
            >
              Pricing
            </Link>
            <Link 
              to="/api-organizations" 
              className="text-gray-700 hover:text-[#1D4ED8] font-medium transition-colors"
            >
              API
            </Link>
          </div>

          {/* Action Buttons - Dashboard button removed */}
          <div className="flex items-center space-x-4">
            <Button className="bg-[#F59E0B] hover:bg-[#D97706] text-white">
              Get Started
            </Button>
          </div>
        </div>

        {/* Mobile menu button - you can expand this later */}
        <div className="md:hidden">
          {/* Mobile navigation can be added here */}
        </div>
      </nav>
    </header>
  );
};

export default Header;
