
import React, { useEffect, useState } from 'react';
import { useContractDeployment } from '../hooks/useContractDeployment';
import { useWalletContext } from '../contexts/WalletContext';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { Lock, ShieldCheck, Sparkles, Database, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { ledger } from '../../managed/contract/index';
import type { ContractAddress } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';

const INDEXER_URL =
  'https://indexer.preview.midnight.network/api/v4/graphql';

const INDEXER_WS_URL =
  'wss://indexer.preview.midnight.network/api/v4/graphql';

const publicDataProvider = indexerPublicDataProvider(
  INDEXER_URL,
  INDEXER_WS_URL
);

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

export default function EligibilityForm() {
  const { callTx, contractAddress: hookContractAddress, networkName: hookNetworkName } = useContractDeployment();
  const { connectedAPI, isConnected: walletIsConnected } = useWalletContext();
  const [programState, setProgramState] = useState<ProgramState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [form, setForm] = useState({ score: '', income: '', dob: '' });
  const [status, setStatus] = useState<'idle' | 'generating' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  console.log("ELIGIBILITY CALLTX STATE", {
    hasCallTx: !!callTx,
    contractAddress: hookContractAddress,
    networkName: hookNetworkName,
    walletIsConnected,
    hasConnectedAPI: !!connectedAPI
  });

// Fetch program state
useEffect(() => {
  const fetchState = async () => {
    if (
      !contractAddress ||
      contractAddress === 'REPLACE_WITH_DEPLOYED_ADDRESS'
    ) {
      setError('Contract address not configured.');
      setLoading(false);
      return;
    }

    try {

      console.log('Reading contract state:', contractAddress);

      const contractState =
  await publicDataProvider.queryContractState(
    contractAddress as ContractAddress
  );

console.log('✓ Contract state received:', contractState);

if (!contractState) {
  throw new Error('No contract state found for this contract address.');
}

      console.log('✓ Contract state received:', contractState);
console.log('STATE:', contractState);
console.log('STATE.DATA:', contractState.data);
console.log('STATE.DATA.CONSTRUCTOR:', contractState.data?.constructor?.name);
      const contractLedger = ledger(contractState.data);

      console.log('✓ Contract ledger:', contractLedger);
console.log('MIN SCORE:', contractLedger.minScore);
console.log('MAX INCOME:', contractLedger.maxIncome);
console.log('MIN AGE:', contractLedger.minAge);
console.log('CLAIM COUNT:', contractLedger.claimCount);
console.log('PROGRAM CREATED:', contractLedger.programCreated);

      setProgramState({
        minScore: contractLedger.minScore,
        maxIncome: contractLedger.maxIncome,
        minAge: contractLedger.minAge,
        claimCount: contractLedger.claimCount,
        programCreated: contractLedger.programCreated,
      });
    } catch (err: any) {
      console.error('Failed to read contract state:', err);

      setError(
        err?.message ||
          'Unable to read contract state from Midnight indexer.'
      );
    } finally {
      setLoading(false);
    }
  };

  fetchState();
}, []);

    // Check wallet connection status from the real wallet context
  useEffect(() => {
    setWalletConnected(walletIsConnected);
    if (walletIsConnected && connectedAPI) {
      connectedAPI.getShieldedAddresses().then((addrs: any) => {
        setWalletAddress(addrs.shieldedAddress || null);
      }).catch(() => setWalletAddress(null));
    }
  }, [walletIsConnected, connectedAPI]);

  // Check eligibility before submission
  const checkEligibility = () => {
   if (status === 'success') {
  return { eligible: true, reason: null };
}
    if (!programState?.programCreated) return { eligible: false, reason: 'Program not created' };
    
    const score = Number(form.score);
    const income = Number(form.income);
    const age = Number(form.dob);
    
    if (score < Number(programState.minScore)) {
      return { eligible: false, reason: `Score ${score}% is below minimum ${programState.minScore}%` };
    }
    if (income >= Number(programState.maxIncome)) {
      return { eligible: false, reason: `Income ₹${income} exceeds maximum ₹${programState.maxIncome}` };
    }
    if (age < Number(programState.minAge)) {
      return { eligible: false, reason: `Age ${age} is below minimum ${programState.minAge}` };
    }
    
    return { eligible: true, reason: null };
  };

  const handleSubmit = async (event?: React.FormEvent) => {
   setNetworkId('preview');
 console.log('🔥 GENERATE & SUBMIT BUTTON CLICKED');

    if (event) event.preventDefault();
    setMessage(null);
    setError(null);

    console.log('📦 Form data:', form);
    console.log('📜 Program state:', programState);

    if (!contractAddress || contractAddress === 'REPLACE_WITH_DEPLOYED_ADDRESS') {
      setError('Contract address not configured.');
      return;
    }

    if (!form.score || !form.income || !form.dob) {
      setError('Please fill all fields.');
      return;
    }

    // Validate inputs
    const score = Number(form.score);
    const income = Number(form.income);
    const age = Number(form.dob);

    if (isNaN(score) || isNaN(income) || isNaN(age)) {
      setError('Please enter valid numbers.');
      return;
    }

    if (score < 0 || score > 100) {
      setError('Score must be between 0 and 100.');
      return;
    }
    if (income < 0) {
      setError('Income must be non-negative.');
      return;
    }
    if (age < 0 || age > 150) {
      setError('Please enter a valid age.');
      return;
    }

    setStatus('generating');
    
    try {
      console.log('🔵 STEP 1/6: BEFORE proof generation / private-input hashing');

      // Generate privacy-preserving data
      const saltArray = new Uint8Array(16);
      window.crypto.getRandomValues(saltArray);
      const saltHex = Array.from(saltArray).map(b => b.toString(16).padStart(2, '0')).join('');

      // Create hash for local storage (for demo/testing purposes)
      // Note: This is NOT a real ZK proof - it's a placeholder for demonstration
      const toHash = JSON.stringify({ score, income, age, contract: contractAddress, salt: saltHex });
      const encoder = new TextEncoder();
      const data = encoder.encode(toHash);
      const digest = await window.crypto.subtle.digest('SHA-256', data);
      const hashHex = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');

      console.log('🟢 STEP 2/6: AFTER proof generation (hash of private inputs):', hashHex.slice(0, 16) + '…');

      // Store proof data locally
      const localRecord = {
        score: 'redacted',
        income: 'redacted',
        age: 'redacted',
        salt: saltHex,
        hash: hashHex,
        createdAt: new Date().toISOString(),
        network: 'preview'
      };
      const saved = JSON.parse(localStorage.getItem('zk-scholar-proofs') || '[]');
      saved.push(localRecord);
      localStorage.setItem('zk-scholar-proofs', JSON.stringify(saved));

            setStatus('submitting');

      console.log("SUBMIT CALLTX CHECK", !!callTx);
      // Submit proof to backend
            if (!callTx) {
        throw new Error(
          'Contract transaction interface is not ready. Please connect your wallet and load the contract first.'
        );
      }

      console.log('🟡 STEP 3/6: BEFORE proveEligibility callTx', { score, income, age });

      const result = await callTx.proveEligibility(
        BigInt(score),
        BigInt(income),
        BigInt(age)
      );

      console.log('🟢 STEP 4/6: AFTER proveEligibility — callTx returned:', result);

      console.log('🟡 STEP 5/6: BEFORE recordClaim');

      const claimResult = await callTx.recordClaim();

      console.log('🟢 STEP 6/6: AFTER recordClaim — callTx returned:', claimResult);

      setStatus('success');
      setMessage(
        `Eligibility proof submitted successfully on Midnight. Transaction ID: ${
          result.public?.txId || 'submitted'
        }`
      );

      setForm({ score: '', income: '', dob: '' });

      setTimeout(() => setMessage(null), 5000);
      
    } catch (err) {
      console.error('🔥 PROOF SUBMISSION ERROR:', err);
      console.error('🔥 ERROR STACK:', err instanceof Error ? err.stack : err);
      console.error('🔥 ERROR MESSAGE:', err instanceof Error ? err.message : String(err));
      console.error('🔥 ERROR OBJECT:', err);
      if (err && typeof err === 'object') {
        try {
          const cause = (err as { cause?: unknown })?.cause;
          if (cause !== undefined) {
            console.error('🔥 ERROR CAUSE:', cause);
            if (cause instanceof Error) console.error('🔥 ERROR CAUSE STACK:', cause.stack);
          }
        } catch (_) {
          /* ignore nested inspection errors */
        }
      }
      setStatus('error');
      setError('An error occurred during proof generation or submission.');
    }
  };

  const eligibility = checkEligibility();

  return (
    <section className="py-8">
      <div className="mb-6">
        <Link to="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="glass p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-semibold">Submit Scholarship Eligibility Proof</h3>
                <p className="text-sm text-gray-400">Enter your details to generate a privacy-preserving proof</p>
              </div>
            </div>

            {loading && (
              <div className="text-center py-8">Loading program configuration...</div>
            )}

            {error && !form.score && (
              <div className="mt-4 p-4 bg-red-900/20 border border-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {!loading && programState && programState.programCreated && (
              <div className="mt-6 p-4 bg-blue-900/20 border border-blue-600 rounded-lg">
                <div className="text-sm font-medium text-blue-200 mb-2">Eligibility Criteria:</div>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>Academic Score: {programState.minScore > 0n ? `min ${programState.minScore}%` : 'Not set'}</li>
                  <li>Family Income: {programState.maxIncome > 0n ? `max ₹${programState.maxIncome}` : 'Not set'}</li>
                  <li>Age: {programState.minAge > 0n ? `min ${programState.minAge} years` : 'Not set'}</li>
                </ul>
              </div>
            )}

            <form className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Academic Score (%)</label>
                <div className="mt-2 relative">
                  <input
                    className="w-full rounded-md bg-transparent border border-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--cyan-glow)] transition"
                    type="number"
                    min={0}
                    max={100}
                    value={form.score}
                    onChange={(e) => setForm({...form, score: e.target.value})}
                    placeholder="e.g. 85"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Family Income (₹)</label>
                <div className="mt-2">
                  <input
                    className="w-full rounded-md bg-transparent border border-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--cyan-glow)] transition"
                    type="number"
                    min={0}
                    value={form.income}
                    onChange={(e) => setForm({...form, income: e.target.value})}
                    placeholder="e.g. 250000"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Age</label>
                <div className="mt-2">
                  <input
                    className="w-full rounded-md bg-transparent border border-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--cyan-glow)] transition"
                    type="number"
                    min={0}
                    max={150}
                    value={form.dob}
                    onChange={(e) => setForm({...form, dob: e.target.value})}
                    placeholder="e.g. 21"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-3">
                {!eligibility.eligible && !loading && (
                  <div className="mb-4 p-3 bg-amber-900/20 border border-amber-700 rounded-lg text-sm text-amber-300">
                    <strong>Not Eligible:</strong> {eligibility.reason}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={!callTx || status === 'generating' || status === 'submitting' || !eligibility.eligible}
                  className="btn-primary px-6 py-3 rounded-full font-medium glow flex items-center gap-3 w-full md:w-auto"
                >
                  {status === 'generating' && <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)" strokeWidth="4" fill="none"/></svg>}
                  {status === 'submitting' && <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)" strokeWidth="4" fill="none"/></svg>}
                  {status === 'success'
  ? 'Proof Submitted'
  : !callTx
    ? 'Loading Contract...'
    : 'Generate & Submit Proof'}
                </button>
              </div>

              {status === 'success' && (
                <div className="mt-4 p-4 bg-green-900/30 border border-green-600 rounded-lg">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={20} />
                    <div className="font-semibold">Proof Generated Successfully</div>
                  </div>
                  <div className="text-sm text-gray-300 mt-2">
                    Your scholarship eligibility proof was submitted without revealing your private inputs.
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    Proof: Submitted • Privacy: Protected • Verified by Midnight ZK circuit
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-900/20 border border-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="glass p-4 rounded-xl">
            <div className="text-sm text-gray-300 mb-2">Wallet Status</div>
            <div className="text-sm">
              {walletConnected ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400">Connected</span>
                </div>
              ) : (
                <span className="text-gray-400">Not Connected</span>
              )}
            </div>
          </div>

          <div className="glass p-4 rounded-xl">
            <div className="text-sm text-gray-300 mb-2">Privacy Flow</div>
            <div className="text-xs text-gray-400 space-y-2">
              <div className="flex items-center gap-2">
                <Lock size={12} className="text-[var(--cyan-glow)]" />
                <div>🔒 Private inputs remain confidential</div>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles size={12} className="text-[var(--cyan-glow)]" />
                <div>⚡ Eligibility is verified using a ZK circuit</div>
              </div>
              <div className="flex items-center gap-2">
                <Database size={12} className="text-[var(--cyan-glow)]" />
                <div>⛓ Proof transaction is submitted to Midnight</div>
              </div>
            </div>
          </div>

          <div className="glass p-4 rounded-xl">
            <div className="text-sm text-gray-300 mb-2">Recent Transactions</div>
            <div className="text-xs text-gray-400">
              Eligibility proof transactions are submitted directly to the Midnight network.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
