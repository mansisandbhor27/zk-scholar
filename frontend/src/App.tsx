import React from 'react';
import { BrowserRouter, Routes, Route, Link, NavLink, useLocation } from 'react-router-dom';
import { Home, GraduationCap, FileCheck, Shield, BarChart3, Users, Settings, Wallet } from 'lucide-react';
import { WalletProvider } from './contexts/WalletContext';
import WalletConnect from './components/WalletConnect';
import HomeScreen from './pages/HomeScreen';
import DashboardScreen from './pages/DashboardScreen';
import EligibilityForm from './components/EligibilityForm';
import ProgramConfig from './components/ProgramConfig';
import ClaimsDashboard from './components/ClaimsDashboard';
import AdminPanel from './components/AdminPanel';

const Navigation = () => {
  const location = useLocation();
  const hideNav = location.pathname === '/' || location.pathname === '/eligibility';
  
  return (
    <nav className="mt-8">
      <div className="glass p-4 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-300">Quick Links</div>
          <div className="text-xs text-gray-400">v1.0</div>
        </div>
        <div className="mt-4 grid grid-cols-5 gap-2">
          <NavLink to="/" className={({ isActive }) => `flex items-center justify-center p-2 rounded-md transition ${isActive ? 'bg-gradient-to-br from-[var(--accent-start)] to-[var(--accent-end)] text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            <Home size={16} />
            <span className="ml-1 text-xs">Home</span>
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => `flex items-center justify-center p-2 rounded-md transition ${isActive ? 'bg-gradient-to-br from-[var(--accent-start)] to-[var(--accent-end)] text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            <BarChart3 size={16} />
            <span className="ml-1 text-xs">Dashboard</span>
          </NavLink>
          <NavLink to="/config" className={({ isActive }) => `flex items-center justify-center p-2 rounded-md transition ${isActive ? 'bg-gradient-to-br from-[var(--accent-start)] to-[var(--accent-end)] text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            <Settings size={16} />
            <span className="ml-1 text-xs">Config</span>
          </NavLink>
          <NavLink to="/claims" className={({ isActive }) => `flex items-center justify-center p-2 rounded-md transition ${isActive ? 'bg-gradient-to-br from-[var(--accent-start)] to-[var(--accent-end)] text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            <Users size={16} />
            <span className="ml-1 text-xs">Claims</span>
          </NavLink>
          <NavLink to="/admin" className={({ isActive }) => `flex items-center justify-center p-2 rounded-md transition ${isActive ? 'bg-gradient-to-br from-[var(--accent-start)] to-[var(--accent-end)] text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            <Shield size={16} />
            <span className="ml-1 text-xs">Admin</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[var(--bg-deep)] text-gray-200">
          <header className="glass m-4 rounded-xl p-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] bg-clip-text text-transparent">ZK-Scholar</h1>
              <p className="text-sm text-gray-400 mt-1">Privacy-preserving scholarship eligibility on Midnight</p>
            </div>
            <WalletConnect />
          </header>
          
          <main className="px-4 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/eligibility" element={<EligibilityForm />} />
              <Route path="/dashboard" element={<DashboardScreen />} />
              <Route path="/config" element={<ProgramConfig />} />
              <Route path="/claims" element={<ClaimsDashboard />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
            
            <Navigation />
          </main>
          
          <footer className="glass m-4 rounded-xl p-4 text-center text-xs text-gray-500">
            <p>ZK-Scholar: Zero-knowledge proof of scholarship eligibility using Midnight Network</p>
          </footer>
        </div>
      </BrowserRouter>
    </WalletProvider>
  );
}

export default App;
