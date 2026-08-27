import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Users, TrendingUp, AlertCircle, CheckCircle, Clock, FileCheck, Shield } from 'lucide-react';

const indexerUrl = import.meta.env.VITE_INDEXER_URL || 'https://indexer.preview.midnight.network';
const LOCAL_STORAGE_KEY = 'zk-scholar-contract-address';
const ENV_CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';

interface ProgramState {
  minScore: bigint;
  maxIncome: bigint;
  minAge: bigint;
  claimCount: bigint;
  programCreated: boolean;
}

export default function DashboardScreen() {
  const [programState, setProgramState] = useState<ProgramState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contractAddress, setContractAddress] = useState<string | null>(null);

  // Load contract address from localStorage or env
  useEffect(() => {
    const savedAddress = localStorage.getItem(LOCAL_STORAGE_KEY);
    setContractAddress(savedAddress || ENV_CONTRACT_ADDRESS || null);
  }, []);

  useEffect(() => {
    if (!contractAddress) return;
    
    const fetchState = async () => {
      if (!contractAddress || contractAddress === 'REPLACE_WITH_DEPLOYED_ADDRESS') {
        setError('Contract address not configured.');
        setLoading(false);
        return;
      }

      try {
        const { indexerPublicDataProvider } =
  await import('@midnight-ntwrk/midnight-js-indexer-public-data-provider');

const { ledger } =
  await import('../../../managed/contract/index');

const { ContractAddress } =
  await import('@midnight-ntwrk/midnight-js-protocol/compact-runtime');

const provider = indexerPublicDataProvider(
  'https://indexer.preview.midnight.network/api/v4/graphql',
  'wss://indexer.preview.midnight.network/api/v4/graphql'
);

console.log('Dashboard: Reading contract state:', contractAddress);

const contractState =
  await provider.watchForContractState(
    contractAddress as ContractAddress
  );

console.log('Dashboard: Contract state received:', contractState);

const contractLedger = ledger(contractState.data);

console.log('Dashboard: Contract ledger:', contractLedger);

setProgramState({
  minScore: contractLedger.minScore,
  maxIncome: contractLedger.maxIncome,
  minAge: contractLedger.minAge,
  claimCount: contractLedger.claimCount,
  programCreated: contractLedger.programCreated,
});
      } catch (err) {
        setError('Unable to read contract state from indexer.');
      } finally {
        setLoading(false);
      }
    };

    fetchState();
  }, [contractAddress]);

  // Check both localStorage address and env variable
  const isConfigured = contractAddress 
    && contractAddress !== 'REPLACE_WITH_DEPLOYED_ADDRESS'

  if (!isConfigured) {
    return (
      <section className="py-8">
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-orange-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Contract Not Configured</h3>
          <p className="text-gray-400 mb-4">
            The contract address has not been set. Please configure VITE_CONTRACT_ADDRESS in your environment.
          </p>
          <Link to="/config" className="btn-primary px-5 py-2 rounded-full font-medium glow">
            Configure Program
          </Link>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="py-8">
        <div className="text-center py-12">
          <div className="animate-spin h-12 w-12 border-4 border-[var(--cyan-glow)] border-transparent rounded-full mb-4"></div>
          <h3 className="text-xl font-semibold mb-2">Loading Dashboard</h3>
          <p className="text-gray-400">Fetching program state from indexer...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8">
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Error Loading Data</h3>
          <p className="text-gray-400 mb-4">{error}</p>
        </div>
      </section>
    );
  }

  if (!programState || !programState.programCreated) {
    return (
      <section className="py-8">
        <div className="text-center py-12">
          <Clock className="mx-auto h-12 w-12 text-yellow-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Program Not Created</h3>
          <p className="text-gray-400 mb-4">
            No scholarship program has been configured yet. Create one using the Config page.
          </p>
          <Link to="/config" className="btn-primary px-5 py-2 rounded-full font-medium glow">
            Configure Program
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Program Dashboard</h1>
        <p className="text-gray-400">View scholarship program statistics and manage configurations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="glass p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/5 rounded-md">
              <Award size={20} className="text-[var(--cyan-glow)]" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Total Claims</div>
              <div className="text-2xl font-bold">{programState.claimCount.toString()}</div>
            </div>
          </div>
          <div className="text-xs text-gray-500">Verified scholarship recipients</div>
        </div>

        <div className="glass p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/5 rounded-md">
              <TrendingUp size={20} className="text-[var(--cyan-glow)]" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Min Score Threshold</div>
              <div className="text-2xl font-bold">{programState.minScore > 0n ? `${programState.minScore}%` : '--'}</div>
            </div>
          </div>
          <div className="text-xs text-gray-500">Minimum academic score required</div>
        </div>

        <div className="glass p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/5 rounded-md">
              <Users size={20} className="text-[var(--cyan-glow)]" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Max Income</div>
              <div className="text-2xl font-bold">₹{programState.maxIncome > 0n ? (Number(programState.maxIncome) / 100000).toFixed(0) + 'L' : '--'}</div>
            </div>
          </div>
          <div className="text-xs text-gray-500">Maximum family income threshold</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">Program Details</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-400">Minimum Age</div>
              <div className="font-medium">{programState.minAge > 0n ? `${programState.minAge} years` : 'Not set'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Eligibility Criteria</div>
              <div className="font-medium">
                {programState.minScore > 0n && programState.maxIncome > 0n && programState.minAge > 0n
                  ? `Score: ${programState.minScore}% | Income: max ₹${programState.maxIncome} | Age: ${programState.minAge}+`
                  : 'Configure in Settings'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Program Status</div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-400" />
                <span className="font-medium text-green-400">Active</span>
              </div>
            </div>
          </div>
          <Link
            to="/claims"
            className="btn-primary px-4 py-2 rounded-full font-medium glow mt-6 inline-block"
          >
            View All Claims
          </Link>
        </div>

        <div className="glass p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/eligibility"
              className="bg-gradient-to-br from-[var(--accent-start)] to-[var(--accent-end)] p-4 rounded-xl text-center hover:opacity-90 transition"
            >
              <FileCheck size={24} className="mx-auto mb-2" />
              <div className="font-medium">New Application</div>
              <div className="text-xs text-gray-300">Apply for scholarship</div>
            </Link>
            <Link
              to="/admin"
              className="bg-gradient-to-br from-purple-500 to-indigo-600 p-4 rounded-xl text-center hover:opacity-90 transition"
            >
              <Shield size={24} className="mx-auto mb-2" />
              <div className="font-medium">Admin Panel</div>
              <div className="text-xs text-gray-300">Manage settings</div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
