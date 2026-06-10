import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import amnivaLogo from '@/assets/amniva-logo.png';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/explore', label: 'Explore' },
  { to: '/reports', label: 'Reports' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
];

const Header = () => (
  <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-border">
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <Link to="/" className="flex items-center space-x-3">
          <img src={amnivaLogo} alt="ABI Logo" className="h-9 w-9 rounded-lg" />
          <span className="text-xl font-bold text-foreground tracking-tight">ABI</span>
        </Link>

        <div className="hidden md:flex items-center space-x-7">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-muted-foreground hover:text-foreground font-medium transition-colors text-sm"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link to="/login" className="hidden sm:inline">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              Launch workspace
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  </header>
);

export default Header;
