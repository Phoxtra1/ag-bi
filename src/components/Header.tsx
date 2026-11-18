import React from "react";
import { Button } from "@/components/ui/button";
import { Link, NavLink } from "react-router-dom";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/explore", label: "Info Discovery" },
  { to: "/contact", label: "InfoService" },
  { to: "/reports", label: "Reports" },
  { to: "/about", label: "About" },
];

const Header = () => (
  <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 shadow-sm backdrop-blur">
    <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex h-[4.5rem] items-center justify-between gap-4">
        <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="Information Solutions by Amineva Global home">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#0b1b2b] text-sm font-bold tracking-tight text-teal-300">IS</span>
          <span className="min-w-0">
            <span className="block truncate text-base font-bold tracking-tight text-foreground sm:text-lg">Information Solutions</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[.16em] text-muted-foreground">by Amineva Global</span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === "/"} className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-teal-700 ${isActive ? "text-teal-700" : "text-muted-foreground"}`
            }>{link.label}</NavLink>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link to="/login" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:inline">Sign in</Link>
          <Link to="/signup">
            <Button className="bg-teal-600 font-semibold text-white hover:bg-teal-700">Create account</Button>
          </Link>
        </div>
      </div>
    </nav>
  </header>
);

export default Header;
