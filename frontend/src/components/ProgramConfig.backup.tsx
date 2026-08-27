import React, { useEffect, useState } from 'react';
import { useContractDeployment } from '../hooks/useContractDeployment';
import { Settings, Save, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { ledger } from '../../../managed/contract/index';
import type { ContractAddress } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
import { firstValueFrom } from 'rxjs';

const indexerUrl = import.meta.env.VITE_INDEXER_URL || 'https://indexer.preview.midnight.network';
const contractAddress =
  localStorage.getItem('zk-scholar-contract-address') ||
  import.meta.env.VITE_CONTRACT_ADDRESS ||
  '';

interface ProgramState {
  minScore: bigint;
  maxIncome: bigint;
  minAge: bigint;
  claimCount: bigint;
  programCreated: boolean;
}

export default function ProgramConfig() {
const { callTx } = useContractDeployment();
  const [programState, setProgramState] = useState<ProgramState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    scoreThreshold: '',
    incomeThreshold: '',
    ageThreshold: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchState = async () => {
      if (!contractAddress || contractAddress === 'REPLACE_WITH_DEPLOYED_ADDRESS') {
        setError('Contract address not configured.');
        setLoading(false);
        return;
      }

      try {
        const stateObservable = publicDataProvider.contractStateObservable(
  contractAddress as ContractAddress,
  { type: 'latest' }
);

const contractState = await firstValueFrom(stateObservable);

console.log('✓ Contract state received:', contractState);

const contractLedger = ledger(contractState);

console.log('✓ Contract ledger:', contractLedger);

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
  }, []);

  const handleSubmit = async (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    setMessage(null);
    setError(null);

    if (!contractAddress || contractAddress === 'REPLACE_WITH_DEPLOYED_ADDRESS') {
      setError('Contract address not configured.');
      return;
    }

    const score = parseInt(form.scoreThreshold);
    const income = parseInt(form.incomeThreshold);
    const age = parseInt(form.ageThreshold);

    if (isNaN(score) || isNaN(income) || isNaN(age)) {
      setError('Please enter valid numbers for all thresholds.');
      return;
    }

    if (score < 0 || score > 100) {
      setError('Score threshold must be between 0 and 100.');
      return;
    }

    if (income < 0 || income > 10000000) {
      setError('Income threshold must be between 0 and 10,000,000.');
      return;
    }

    if (age < 0 || age > 120) {
      setError('Age threshold must be between 0 and 120.');
      return;
    }

    setStatus('submitting');

    try {
      if (!callTx) {
  throw new Error(
    'Contract transaction interface is not ready. Please connect your wallet and deploy/load the contract first.'
  );
}

console.log('Calling createScholarshipProgram...');
console.log('Score:', score);
console.log('Income:', income);
console.log('Age:', age);

const result = await callTx.createScholarshipProgram(
  BigInt(score),
  BigInt(income),
  BigInt(age)
);

console.log('✓ createScholarshipProgram transaction submitted:', result);
          
      setStatus('success');
      setMessage(
  `Scholarship program created successfully on Midnight. Transaction ID: ${
    result.public?.txId || 'submitted'
  }`
);
      setForm({ scoreThreshold: '', incomeThreshold: '', ageThreshold: '' });

      // Refresh state
   

      setTimeout(() => setMessage(null), 5000);

    } catch (err) {
      setStatus('error');
      setError('An error occurred during configuration submission.');
    }
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

      <div className="glass p-6 rounded-xl shadow-lg max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold">Program Configuration</h3>
            <p className="text-sm text-gray-400">Set scholarship eligibility thresholds</p>
          </div>
        </div>

        {loading && (
          <div className="text-center py-8">Loading configuration...</div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {!loading && isConfigured && !programCreated && (
          <div className="mt-6 p-4 bg-amber-900/20 border border-amber-700 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-amber-400" />
              <span className="font-medium text-amber-200">Program Not Created</span>
            </div>
            <p className="text-sm text-amber-300 mt-1">
              Create the scholarship program to enable eligibility verification.
            </p>
          </div>
        )}

        {!loading && isConfigured && programCreated && (
          <div className="mt-6 p-4 bg-green-900/20 border border-green-600 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-400" />
              <span className="font-medium text-green-400">Program Active</span>
            </div>
            <p className="text-sm text-green-300 mt-1">
              <div>Current thresholds:</div>
              <div>• Score: {programState?.minScore?.toString() || '--'}%</div>
              <div>• Max Income: ₹{programState?.maxIncome?.toString() || '--'}</div>
              <div>• Min Age: {programState?.minAge?.toString() || '--'} years</div>
            </p>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Minimum Score Threshold (%)</label>
            <div className="mt-2">
              <input
                className="w-full rounded-md bg-transparent border border-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--cyan-glow)] transition"
                type="number"
                min={0}
                max={100}
                value={form.scoreThreshold}
                onChange={(e) => setForm({...form, scoreThreshold: e.target.value})}
                placeholder="e.g. 70"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Maximum Income Threshold (₹)</label>
            <div className="mt-2">
              <input
                className="w-full rounded-md bg-transparent border border-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--cyan-glow)] transition"
                type="number"
                min={0}
                max={10000000}
                value={form.incomeThreshold}
                onChange={(e) => setForm({...form, incomeThreshold: e.target.value})}
                placeholder="e.g. 500000"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Minimum Age Threshold (years)</label>
            <div className="mt-2">
              <input
                className="w-full rounded-md bg-transparent border border-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--cyan-glow)] transition"
                type="number"
                min={0}
                max={120}
                value={form.ageThreshold}
                onChange={(e) => setForm({...form, ageThreshold: e.target.value})}
                placeholder="e.g. 18"
                required
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={status === 'submitting' || !isConfigured}
              className="btn-primary px-6 py-3 rounded-full font-medium glow flex items-center gap-3 w-full"
            >
              {status === 'submitting' && (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)" strokeWidth="4" fill="none"/></svg>
              )}
              {status === 'submitting' ? 'Submitting Configuration...' : 'Create Scholarship Program'}
            </button>
          </div>

          {status === 'success' && (
            <div className="mt-4 p-4 bg-green-900/30 border border-green-600 rounded-lg">
              <div className="flex items-center gap-3">
                <Save size={20} />
                <div className="font-semibold">Configuration Saved</div>
              </div>
              <div className="text-sm text-gray-300 mt-2">{message}</div>
            </div>
          )}
        </form>
      </div>

      <div className="mt-8 glass p-6 rounded-xl max-w-2xl mx-auto">
        <h4 className="text-lg font-semibold mb-3">Configuration Guidelines</h4>
        <ul className="text-sm text-gray-400 space-y-2">
          <li className="flex items-start gap-2">
            <span className="mt-1">•</span>
            <span>Score threshold: Minimum percentage required (e.g., 70%)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1">•</span>
            <span>Income threshold: Maximum family income allowed (e.g., ₹500,000)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1">•</span>
            <span>Age threshold: Minimum age required (e.g., 18 years)</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
