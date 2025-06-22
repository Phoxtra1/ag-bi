
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Verify Info', href: '/verify' },
    { name: 'Trending', href: '/trending' },
    { name: 'Predictions', href: '/predictions' },
    { name: 'Reports', href: '/reports' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'API for Organizations', href: '/api-organizations' },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-blue-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img 
                src="/lovable-uploads/9741a386-df5a-4ff1-b5f8-e7e30900ca86.png" 
                alt="Amnova Logo" 
                className="h-10 w-10"
              />
              <div>
                <h1 className="text-2xl font-bold text-[#1D4ED8]">
                  Amnova<span className="text-[#F59E0B]">™</span>
                </h1>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-[#374151] hover:text-[#1D4ED8] px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-blue-50 rounded-lg"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="text-[#374151] hover:text-[#1D4ED8]">
              Login
            </Button>
            <Button className="bg-[#1D4ED8] hover:bg-[#3B82F6] text-white">
              Register
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#374151] hover:text-[#1D4ED8] p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-blue-100">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-[#374151] hover:text-[#1D4ED8] block px-3 py-2 text-base font-medium hover:bg-blue-50 rounded-lg"
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4 space-y-2">
                <Button variant="ghost" className="w-full text-[#374151] hover:text-[#1D4ED8]">
                  Login
                </Button>
                <Button className="w-full bg-[#1D4ED8] hover:bg-[#3B82F6] text-white">
                  Register
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
