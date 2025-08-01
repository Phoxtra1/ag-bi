
import React from 'react';

const Footer = () => {
  const platformLinks = [
    { name: 'Trending', href: '/trending' },
    { name: 'Checks', href: '/verify' },
    { name: 'Reports', href: '/reports' },
    { name: 'Pricing', href: '/pricing' }
  ];

  const resourceLinks = [
    { name: 'FAQ', href: '/faq' },
    { name: 'Help Center', href: '/help' },
    { name: 'Verify Claims', href: '/verify' },
    { name: 'Developer Docs & API', href: '/api-organizations' }
  ];

  const companyLinks = [
    { name: 'Amnewsworld', href: '/amnewsworld' },
    { name: 'About Amniva', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact Us', href: '/contact' }
  ];

  const connectLinks = [
    { name: 'Register', href: '/register' },
    { name: 'Newsletter', href: '/newsletter' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' }
  ];

  return (
    <footer className="bg-[#002A5C] text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Platform Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Platform</h3>
            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-gray-300 hover:text-[#F59E0B] transition-colors duration-200 text-sm flex items-center gap-2"
                  >
                    <span className="text-[#F59E0B]">🔸</span>
                    {link.name}
                  </a>
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
                  <a 
                    href={link.href}
                    className="text-gray-300 hover:text-[#F59E0B] transition-colors duration-200 text-sm flex items-center gap-2"
                  >
                    <span className="text-[#F59E0B]">🔸</span>
                    {link.name}
                  </a>
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
                  <a 
                    href={link.href}
                    className="text-gray-300 hover:text-[#F59E0B] transition-colors duration-200 text-sm flex items-center gap-2"
                  >
                    <span className="text-[#F59E0B]">🔸</span>
                    {link.name}
                  </a>
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
                  <a 
                    href={link.href}
                    className="text-gray-300 hover:text-[#F59E0B] transition-colors duration-200 text-sm flex items-center gap-2"
                  >
                    <span className="text-[#F59E0B]">🔸</span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#F59E0B]/30">
          <div className="text-center">
            <p className="text-sm text-gray-400">
              © 2025 Amniva. All rights reserved. Powered by Amnewsworld.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
