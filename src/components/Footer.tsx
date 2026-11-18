import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="mt-16 bg-[#0b1b2b] text-white">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-500 font-bold text-slate-950">IS</span>
            <span><span className="block font-semibold">Information Solutions</span><span className="block text-xs uppercase tracking-[.14em] text-slate-400">by Amineva Global</span></span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">
            Research, information discovery, analysis and professional information services for better-informed decisions.
          </p>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold text-teal-300">Services</h3>
          <ul className="space-y-3 text-sm text-slate-300">
            <li><Link className="hover:text-teal-300" to="/explore">Info Discovery</Link></li>
            <li><Link className="hover:text-teal-300" to="/contact">InfoService</Link></li>
            <li><Link className="hover:text-teal-300" to="/reports">Reports</Link></li>
            <li><Link className="hover:text-teal-300" to="/pricing">How pricing works</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold text-teal-300">Company & support</h3>
          <ul className="space-y-3 text-sm text-slate-300">
            <li><Link className="hover:text-teal-300" to="/about">About Information Solutions</Link></li>
            <li><Link className="hover:text-teal-300" to="/help">Help Center</Link></li>
            <li><Link className="hover:text-teal-300" to="/faq">FAQs</Link></li>
            <li><Link className="hover:text-teal-300" to="/contact">Contact</Link></li>
            <li><Link className="hover:text-teal-300" to="/privacy">Privacy</Link></li>
            <li><Link className="hover:text-teal-300" to="/terms">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="mt-10 border-t border-white/10 pt-6 text-xs text-slate-500">
        © {new Date().getFullYear()} Amineva Global. Information Solutions.
      </div>
    </div>
  </footer>
);

export default Footer;
