import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Sparkles, Database, CheckCircle, Users, BarChart3 } from 'lucide-react';
import { INDEXER_URL, INDEXER_WS_URL } from '../lib/indexer';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { ledger } from '../../../managed/contract/index';
import type { ContractAddress } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';

const publicDataProvider = indexerPublicDataProvider(INDEXER_URL, INDEXER_WS_URL);

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || '';

interface ProgramState {
  minScore: bigint;
  maxIncome: bigint;
  minAge: bigint;
  claimCount: bigint;
  programCreated: boolean;
}

export default function HomeScreen() {
  const [programState, setProgramState] = useState<ProgramState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!contractAddress || contractAddress === 'REPLACE_WITH_DEPLOYED_ADDRESS') {
      setLoading(false);
      return;
    }

    const fetchState = async () => {
      try {
        const contractState =
          await publicDataProvider.queryContractState(
            contractAddress as ContractAddress
          );

        if (!contractState) {
          throw new Error('Contract state not found on indexer');
        }

        const contractLedger = ledger(contractState.data);
        setProgramState({
          minScore: contractLedger.minScore,
          maxIncome: contractLedger.maxIncome,
          minAge: contractLedger.minAge,
          claimCount: contractLedger.claimCount,
          programCreated: contractLedger.programCreated,
        });
      } catch (err) {
        setError('Unable to fetch program state from indexer.');
      } finally {
        setLoading(false);
      }
    };

    fetchState();
  }, []);

  const isConfigured = contractAddress && contractAddress !== 'REPLACE_WITH_DEPLOYED_ADDRESS';

  return (
    <section className="py-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] bg-clip-text text-transparent">
          Privacy-Preserving Scholarship Verification
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Prove your scholarship eligibility using zero-knowledge proofs without revealing sensitive personal data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass p-6 rounded-xl text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-gradient-to-br from-[var(--accent-start)] to-[var(--accent-end)] mb-4">
            <Shield size={24} />
          </div>
          <h3 className="font-semibold mb-2">Zero-Knowledge Proof</h3>
          <p className="text-sm text-gray-400">Cryptographically proven eligibility without revealing your score, income, or age.</p>
        </div>
        <div className="glass p-6 rounded-xl text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-gradient-to-br from-[var(--accent-start)] to-[var(--accent-end)] mb-4">
            <Lock size={24} />
          </div>
          <h3 className="font-semibold mb-2">Private Inputs</h3>
          <p className="text-sm text-gray-400">Your personal data never leaves your browser or gets stored on-chain.</p>
        </div>
        <div className="glass p-6 rounded-xl text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-gradient-to-br from-[var(--accent-start)] to-[var(--accent-end)] mb-4">
            <Database size={24} />
          </div>
          <h3 className="font-semibold mb-2">Blockchain Verification</h3>
          <p className="text-sm text-gray-400">Eligibility is verified on Midnight's privacy-preserving ledger.</p>
        </div>
      </div>

      <div className="glass p-6 rounded-xl mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <CheckCircle className="text-[var(--cyan-glow)]" />
          Program Configuration
        </h3>
        
        {loading && (
          <p className="text-gray-400">Loading program state...</p>
        )}
        
        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-sm">
            {error}
          </div>
        )}
        
        {isConfigured && programState ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="text-xs text-gray-400">Minimum Score</div>
              <div className="text-lg font-semibold">{programState.minScore > 0n ? `${programState.minScore}%` : 'Not Set'}</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="text-xs text-gray-400">Max Income</div>
              <div className="text-lg font-semibold">₹{programState.maxIncome > 0n ? programState.maxIncome.toLocaleString() : 'Not Set'}</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="text-xs text-gray-400">Minimum Age</div>
              <div className="text-lg font-semibold">{programState.minAge > 0n ? `${programState.minAge} years` : 'Not Set'}</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="text-xs text-gray-400">Claims Recorded</div>
              <div className="text-lg font-semibold">{programState.claimCount.toString()}</div>
            </div>
          </div>
        ) : isConfigured ? (
          <p className="text-gray-400">Program not yet created. Use the Config page to set eligibility thresholds.</p>
        ) : (
          <p className="text-gray-400">Contract address not configured. Set VITE_CONTRACT_ADDRESS in your environment.</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">Get Started</h3>
          <p className="text-gray-400 mb-4">
            To prove your scholarship eligibility, you'll need to:
          </p>
          <ol className="space-y-2 text-sm text-gray-300">
            <li>1. Connect your Midnight wallet</li>
            <li>2. Complete the eligibility form with your score, income, and age</li>
            <li>3. Submit the zero-knowledge proof to the network</li>
          </ol>
          <Link
            to="/eligibility"
            className="btn-primary px-5 py-2 rounded-full font-medium mt-6 inline-block glow"
          >
            Apply for Scholarship
          </Link>
        </div>

        <div className="glass p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">How It Works</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/5 rounded-md mt-0.5">
                <Sparkles size={16} className="text-[var(--cyan-glow)]" />
              </div>
              <div>
                <p className="font-medium">Local Proof Generation</p>
                <p className="text-sm text-gray-400">ZK proofs are generated client-side using your device's browser capabilities.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/5 rounded-md mt-0.5">
                <Lock size={16} className="text-[var(--cyan-glow)]" />
              </div>
              <div>
                <p className="font-medium">Private Data Protection</p>
                <p className="text-sm text-gray-400">Your score, income, and age are never revealed publicly.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/5 rounded-md mt-0.5">
                <Shield size={16} className="text-[var(--cyan-glow)]" />
              </div>
              <div>
                <p className="font-medium">Blockchain Verification</p>
                <p className="text-sm text-gray-400">Midnight verifies your eligibility on-chain without seeing your inputs.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
