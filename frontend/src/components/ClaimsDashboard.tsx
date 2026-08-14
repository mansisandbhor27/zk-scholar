import React, { useEffect, useState } from 'react';
import { Users, CheckCircle, Calendar, Hash, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { ledger } from '../../managed/contract/index';
import type { ContractAddress } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';

const indexerUrl = import.meta.env.VITE_INDEXER_URL || 'https://indexer.preview.midnight.network';
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || '';
const INDEXER_URL = "https://indexer.preview.midnight.network/api/v4/graphql";
const INDEXER_WS_URL = "wss://indexer.preview.midnight.network/api/v4/graphql";

const publicDataProvider = indexerPublicDataProvider(
  INDEXER_URL,
  INDEXER_WS_URL
);

interface ProofRecord {
  id: string;
  score: 'redacted';
  income: 'redacted';
  age: 'redacted';
  salt: string;
  hash: string;
  createdAt: string;
  network: string;
}

interface ProgramState {
  minScore: bigint;
  maxIncome: bigint;
  minAge: bigint;
  claimCount: bigint;
  programCreated: boolean;
}

export default function ClaimsDashboard() {
  const [programState, setProgramState] = useState<ProgramState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [proofs, setProofs] = useState<ProofRecord[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch program state
      if (contractAddress && contractAddress !== 'REPLACE_WITH_DEPLOYED_ADDRESS') {
        try {
          const contractState =
  await publicDataProvider.watchForContractState(
    contractAddress as ContractAddress
  );

console.log('✓ Claims: Contract state received:', contractState);

const contractLedger = ledger(contractState.data);

console.log('✓ Claims: Contract ledger:', contractLedger);

setProgramState({
  minScore: contractLedger.minScore,
  maxIncome: contractLedger.maxIncome,
  minAge: contractLedger.minAge,
  claimCount: contractLedger.claimCount,
  programCreated: contractLedger.programCreated,
});
        } catch (err) {
          // Ignore error for program state
        }
      }

      // Fetch local proofs from localStorage
      try {
        const stored = localStorage.getItem('zk-scholar-proofs');
        if (stored) {
          const parsed = JSON.parse(stored);
          setProofs(parsed.map((p: any, i: number) => ({
            id: p.id || `proof-${i}`,
            score: p.score,
            income: p.income,
            age: p.age,
            salt: p.salt,
            hash: p.hash,
            createdAt: p.createdAt || new Date().toISOString(),
            network: p.network || 'preview'
          })));
        }
      } catch (err) {
        console.error('Error loading proofs:', err);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const isConfigured = contractAddress && contractAddress !== 'REPLACE_WITH_DEPLOYED_ADDRESS';

  return (
    <section className="py-8">
      <div className="mb-6">
        <Link to="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Claims Dashboard</h1>
        <p className="text-gray-400">View all submitted scholarship eligibility proofs</p>
      </div>

      <div className="glass p-6 rounded-xl mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Program Statistics</h3>
            <p className="text-sm text-gray-400">Total claims on-chain</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              {programState ? programState.claimCount.toString() : '0'}
            </div>
            <div className="text-xs text-gray-400">claims verified</div>
          </div>
        </div>
      </div>

      <div className="glass p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Users className="text-[var(--cyan-glow)]" />
          Submitted Proofs ({proofs.length})
        </h3>

        {proofs.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-500 mb-4" />
            <h4 className="text-lg font-medium mb-2">No Proofs Submitted</h4>
            <p className="text-gray-400 mb-4">
              No eligibility proofs have been submitted yet.
            </p>
            <Link
              to="/eligibility"
              className="btn-primary px-5 py-2 rounded-full font-medium glow inline-block"
            >
              Submit First Proof
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {proofs
              .slice()
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((proof) => (
                <div
                  key={proof.id}
                  className="border border-white/10 rounded-lg p-4 hover:bg-white/5 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-900/20 rounded-md">
                        <CheckCircle size={20} className="text-green-400" />
                      </div>
                      <div>
                        <div className="font-medium">Proof #{proofs.indexOf(proof) + 1}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(proof.createdAt).toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Hash size={12} />
                            {proof.hash.substring(0, 16)}...
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400 mb-1">Status</div>
                      <div className="font-medium text-green-400">Verified</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="mt-8 glass p-6 rounded-xl">
        <h4 className="text-lg font-semibold mb-3">Privacy Information</h4>
        <div className="text-sm text-gray-400 space-y-2">
          <p>
            • Your personal inputs (score, income, age) are kept private and never stored in plaintext
          </p>
          <p>
            • Only proof hashes are stored locally for demonstration purposes
          </p>
          <p>
            • On-chain, only the claim count is publicly visible
          </p>
        </div>
        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
          <p className="text-sm text-blue-300">
            <strong>Note:</strong> Clear localStorage to remove stored proof records.
          </p>
        </div>
      </div>
    </section>
  );
}
