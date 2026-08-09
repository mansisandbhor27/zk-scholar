import React, { useEffect, useState } from 'react';
import { Shield, Settings, Key, RefreshCw, AlertCircle, CheckCircle, Users, BarChart3, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const indexerUrl = import.meta.env.VITE_INDEXER_URL || 'https://indexer.preview.midnight.network';
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || '';

interface ProgramState {
  minScore: bigint;
  maxIncome: bigint;
  minAge: bigint;
  claimCount: bigint;
  programCreated: boolean;
}

export default function AdminPanel() {
  const [programState, setProgramState] = useState<ProgramState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchState();
  }, []);

  const fetchState = async () => {
    setLoading(true);
    setError(null);
    
    if (!contractAddress || contractAddress === 'REPLACE_WITH_DEPLOYED_ADDRESS') {
      setError('Contract address not configured.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${indexerUrl}/contracts/${contractAddress}`);
      if (!response.ok) throw new Error('Failed to fetch contract state');
      const json = await response.json();
      const state = json.state || {};
      setProgramState({
        minScore: BigInt(state.minScore || 0),
        maxIncome: BigInt(state.maxIncome || 0),
        minAge: BigInt(state.minAge || 0),
        claimCount: BigInt(state.claimCount || 0),
        programCreated: state.programCreated || false,
      });
    } catch (err) {
      setError('Unable to read contract state from indexer.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchState();
    setRefreshing(false);
  };

  const isConfigured = contractAddress && contractAddress !== 'REPLACE_WITH_DEPLOYED_ADDRESS';
  const programCreated = programState?.programCreated ?? false;

  return (
    <section className="py-8">
      <div className="mb-6">
        <Link to="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="text-gray-400">Manage scholarship program settings and view analytics</p>
      </div>

      {!isConfigured && (
        <div className="glass p-6 rounded-xl mb-8">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-amber-400" />
            <h3 className="font-semibold">Contract Not Configured</h3>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Set VITE_CONTRACT_ADDRESS in your environment configuration to manage the program.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="glass p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Program Status</h3>
            <RefreshCw
              className={`h-4 w-4 cursor-pointer ${refreshing ? 'animate-spin' : 'hover:text-[var(--cyan-glow)]'}`}
              onClick={handleRefresh}
            />
          </div>
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : error ? (
            <div className="text-sm text-red-400">{error}</div>
          ) : (
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-md ${programCreated ? 'bg-green-900/20' : 'bg-amber-900/20'}`}>
                {programCreated ? (
                  <CheckCircle className="text-green-400" />
                ) : (
                  <Shield className="text-amber-400" />
                )}
              </div>
              <div>
                <div className="font-medium">{programCreated ? 'Active' : 'Not Created'}</div>
                <div className="text-xs text-gray-400">
                  {programCreated ? 'Program is accepting applications' : 'Create program first'}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="glass p-6 rounded-xl">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Settings className="text-[var(--cyan-glow)]" />
            Settings
          </h3>
          <div className="space-y-3">
            <Link
              to="/config"
              className="w-full text-left p-3 bg-white/5 rounded-lg hover:bg-white/10 transition"
            >
              <div className="font-medium">Program Configuration</div>
              <div className="text-xs text-gray-400">Set eligibility thresholds</div>
            </Link>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="font-medium">Wallet Management</div>
              <div className="text-xs text-gray-400">Connect maintenance wallet</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="font-medium">Contract Address</div>
              <div className="text-xs text-gray-400 font-mono text-[var(--cyan-glow)]">
                {isConfigured ? contractAddress?.substring(0, 12) + '...' : 'Not set'}
              </div>
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-xl">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Users className="text-[var(--cyan-glow)]" />
            Security
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Network</span>
              <span className="text-sm font-medium">Midnight Preview</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Verification</span>
              <span className="text-sm font-medium text-green-400">On-chain</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Privacy</span>
              <span className="text-sm font-medium text-[var(--cyan-glow)]">ZK Protected</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass p-6 rounded-xl mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="text-[var(--cyan-glow)]" />
          Program Metrics
        </h3>
        
        {loading ? (
          <div className="text-center py-8">Loading metrics...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-400">{error}</div>
        ) : programState && programCreated ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="text-xs text-gray-400">Total Claims</div>
              <div className="text-2xl font-bold">{programState.claimCount.toString()}</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="text-xs text-gray-400">Min Score</div>
              <div className="text-2xl font-bold">{programState.minScore > 0n ? `${programState.minScore}%` : '0%'}</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="text-xs text-gray-400">Max Income</div>
              <div className="text-2xl font-bold">₹{programState.maxIncome > 0n ? (Number(programState.maxIncome) / 100000).toFixed(0) + 'L' : '0'}</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="text-xs text-gray-400">Min Age</div>
              <div className="text-2xl font-bold">{programState.minAge > 0n ? `${programState.minAge}` : '0'}</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Shield className="mx-auto h-12 w-12 text-gray-500 mb-4" />
            <p className="text-gray-400">Configure program first to see metrics</p>
          </div>
        )}
      </div>

      <div className="glass p-6 rounded-xl">
        <h4 className="text-lg font-semibold mb-3">Contract Information</h4>
        <div className="text-sm text-gray-400 space-y-2">
          <div className="flex justify-between">
            <span>Contract ID:</span>
            <code className="bg-white/5 px-2 py-1 rounded">{contractAddress || 'Not set'}</code>
          </div>
          <div className="flex justify-between">
            <span>Network:</span>
            <span>Midnight Preview</span>
          </div>
          <div className="flex justify-between">
            <span>Index API:</span>
            <code className="text-[var(--cyan-glow)]">{indexerUrl}</code>
          </div>
        </div>
      </div>
    </section>
  );
}
