// components/Layout.tsx
import { ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          Amoeba
        </Link>
        <nav className="space-x-4">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/login" className="hover:underline">Login</Link>
        </nav>
      </header>
      <main className="p-4 max-w-4xl mx-auto">{children}</main>
      <footer className="p-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Amoeba. All rights reserved.
      </footer>
    </div>
  );
}
