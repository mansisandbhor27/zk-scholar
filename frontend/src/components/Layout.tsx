import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { 
  Home,
  GraduationCap,
  Shield,
  Users,
  BarChart3,
  FileCheck,
  Settings,
  ShieldCheck,
  Clipboard,
  Activity,
  Sparkles,
  Gift
} from 'lucide-react';
import { useWallet } from '../hooks/useWallet';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass m-4 rounded-xl p-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] bg-clip-text text-transparent">
            ZK-Scholar
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Privacy-preserving scholarship eligibility on Midnight
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="glass m-4 rounded-xl p-4 text-center text-xs text-gray-500">
        <p>ZK-Scholar: Zero-knowledge proof of scholarship eligibility using Midnight Network</p>
      </footer>
    </div>
  );
}