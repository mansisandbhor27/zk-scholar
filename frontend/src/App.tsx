import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useWallet } from './hooks/useWallet';
import Layout from './components/Layout';
import HomeScreen from './pages/HomeScreen';
import Dashboard from './pages/Dashboard';
import Scholarships from './pages/Scholarships';
import ScholarshipDetails from './pages/ScholarshipDetails';
import CheckEligibility from './pages/CheckEligibility';
import ZkProofProgress from './pages/ZkProofProgress';
import PrivacyVisualization from './pages/PrivacyVisualization';
import MyProofs from './pages/MyProofs';
import Claims from './pages/Claims';
import BlockchainActivity from './pages/BlockchainActivity';
import CreateScholarship from './pages/CreateScholarship';
import Analytics from './pages/Analytics';
import AdminPanel from './components/AdminPanel';

function App() {
  const { connected } = useWallet();

  // Protected routes - only accessible when wallet is connected
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return connected ? <>{children}</> : <Navigate to="/" replace />;
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--bg-deep)] text-gray-200">
        <Routes>
          <Route path="/" element={<Layout><HomeScreen /></Layout>} />
          <Route path="/eligibility" element={<Layout><CheckEligibility /></Layout>} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/scholarships" element={<Layout><Scholarships /></Layout>} />
          <Route path="/scholarships/:id" element={
            <ProtectedRoute>
              <Layout><ScholarshipDetails /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/zk-proof" element={
            <ProtectedRoute>
              <Layout><ZkProofProgress /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/privacy" element={
            <ProtectedRoute>
              <Layout><PrivacyVisualization /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/my-proofs" element={
            <ProtectedRoute>
              <Layout><MyProofs /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/claims" element={
            <ProtectedRoute>
              <Layout><Claims /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/activity" element={
            <ProtectedRoute>
              <Layout><BlockchainActivity /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/create" element={
            <ProtectedRoute>
              <Layout><CreateScholarship /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <Layout><Analytics /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <Layout><AdminPanel /></Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
