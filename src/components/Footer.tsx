import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12 md:flex md:items-center md:justify-between">
        <div className="mb-6 md:mb-0">
          <Link to="/" className="flex items-center">
            <img src="/logo.svg" className="h-8 mr-3" alt="Amniva Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap">Amniva</span>
          </Link>
          <p className="mt-4 text-sm text-gray-400">
            AI-driven news verification and analysis platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">Company</h3>
            <ul>
              <li className="mb-2"><Link to="/about" className="hover:text-gray-300">About Us</Link></li>
              <li className="mb-2"><Link to="/pricing" className="hover:text-gray-300">Pricing</Link></li>
              <li className="mb-2"><Link to="/contact" className="hover:text-gray-300">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Resources</h3>
            <ul>
              <li className="mb-2"><Link to="/help" className="hover:text-gray-300">Help Center</Link></li>
              <li className="mb-2"><Link to="/api-organizations" className="hover:text-gray-300">API</Link></li>
              {/* <li className="mb-2"><a href="#" className="hover:text-gray-300">Terms & Conditions</a></li> */}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Contact</h3>
            <ul className="text-sm">
              <li className="flex items-center mb-2">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                <a href="mailto:info@amniva.com" className="hover:text-gray-300">info@amniva.com</a>
              </li>
              <li className="flex items-center mb-2">
                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                <a href="tel:+15551234567" className="hover:text-gray-300">+1 (555) 123-4567</a>
              </li>
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                <span>123 Main Street, New York, NY</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="py-4 bg-gray-800 text-center">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} Amniva. All Rights Reserved.
        </p>
      </div>
      
      {/* Chat Support Bot */}
      <div className="fixed bottom-4 right-4 z-50">
        <Link to="/help">
        <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors">
          <span className="sr-only">Odeneho Support</span>
          <MessageSquare className="h-6 w-6" />
        </button>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
