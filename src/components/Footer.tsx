import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const platformLinks = [
    { name: 'Business Trends', href: '/trending' },
    { name: 'Verify', href: '/verify' },
    { name: 'Info', href: '/reports' },
    { name: 'Pricing', href: '/pricing' }
  ];

  const resourceLinks = [
    { name: 'FAQ', href: '/faq' },
    { name: 'Help Center', href: '/help' },
    { name: 'Verify Claims', href: '/verify' },
    { name: 'Developer Docs & API', href: '/api-organizations' }
  ];

  const companyLinks = [
    { name: 'Amineva', href: 'https://amineva.com', external: true },
    { name: 'About Amniva', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact Us', href: '/contact' }
  ];

  const connectLinks = [
    { name: 'Register', href: '/login' },
    { name: 'Newsletter', href: '/newsletter' },
    { name: 'Privacy Policy', href: 'https://hub.amineva.com/privacy-policy/', external: true },
    { name: 'Terms of Service', href: 'https://hub.amineva.com/term-of-service/', external: true }
  ];

  return (
    <footer className="bg-[#0a1628] text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Platform Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Platform</h3>
            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-slate-400 hover:text-amber-400 transition-colors duration-200 text-sm flex items-center gap-2"
                  >
                    <span className="text-amber-500">•</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-slate-400 hover:text-amber-400 transition-colors duration-200 text-sm flex items-center gap-2"
                  >
                    <span className="text-amber-500">•</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a 
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-amber-400 transition-colors duration-200 text-sm flex items-center gap-2"
                    >
                      <span className="text-amber-500">•</span>
                      {link.name}
                    </a>
                  ) : (
                    <Link 
                      to={link.href}
                      className="text-slate-400 hover:text-amber-400 transition-colors duration-200 text-sm flex items-center gap-2"
                    >
                      <span className="text-amber-500">•</span>
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Stay Connected Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Stay Connected</h3>
            <ul className="space-y-3">
              {connectLinks.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a 
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-amber-400 transition-colors duration-200 text-sm flex items-center gap-2"
                    >
                      <span className="text-amber-500">•</span>
                      {link.name}
                    </a>
                  ) : (
                    <Link 
                      to={link.href}
                      className="text-slate-400 hover:text-amber-400 transition-colors duration-200 text-sm flex items-center gap-2"
                    >
                      <span className="text-amber-500">•</span>
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-amber-500/20">
          <div className="text-center">
            <p className="text-sm text-slate-500">
              © 2025 Amniva. All rights reserved. Powered by Amineva Global.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;