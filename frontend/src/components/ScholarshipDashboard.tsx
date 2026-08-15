import React, { useEffect, useState } from 'react';
import { Lock, ShieldCheck, Database, Sparkles } from 'lucide-react';
import { INDEXER_URL, INDEXER_WS_URL } from '../lib/indexer';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { ledger } from '../../managed/contract/index';
import type { ContractAddress } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';

const publicDataProvider = indexerPublicDataProvider(INDEXER_URL, INDEXER_WS_URL);

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || '';

export default function ScholarshipDashboard() {
  const [programData, setProgramData] = useState<{ minScore:number; maxIncome:number; minAge:number; claimCount:number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ score: '', income: '', dob: '' });
  const [status, setStatus] = useState<'idle'|'generating'|'submitting'|'success'|'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProgram() {
      if (!contractAddress) {
        setError('Contract address not configured.');
        setLoading(false);
        return;
      }

      try {
        const contractState =
          await publicDataProvider.watchForContractState(
            contractAddress as ContractAddress
          );
        const contractLedger = ledger(contractState.data);
        setProgramData({
          minScore: Number(contractLedger.minScore),
          maxIncome: Number(contractLedger.maxIncome),
          minAge: Number(contractLedger.minAge),
          claimCount: Number(contractLedger.claimCount),
        });
      } catch (err) {
        setError('Unable to read contract state from indexer.');
      } finally {
        setLoading(false);
      }
    }

    fetchProgram();
  }, []);

  const submitProof = async (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    setMessage(null);
    setError(null);

    if (!contractAddress) {
      setError('Contract address not configured.');
      return;
    }

    if (!form.score || !form.income || !form.dob) {
      setError('Please fill all privacy-preserving inputs.');
      return;
    }

    try {
      setStatus('generating');
      // --- proof generation (unchanged logic) ---
      const score = Number(form.score);
      const income = Number(form.income);
      const age = Number(form.dob);

      const saltArray = new Uint8Array(16);
      window.crypto.getRandomValues(saltArray);
      const saltHex = Array.from(saltArray).map(b => b.toString(16).padStart(2, '0')).join('');

      const toHash = JSON.stringify({ score, income, age, contract: contractAddress, method: 'proveEligibility', salt: saltHex });
      const encoder = new TextEncoder();
      const data = encoder.encode(toHash);
      const digest = await window.crypto.subtle.digest('SHA-256', data);
      const hashHex = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');

      const localRecord = { score: 'redacted', income: 'redacted', age: 'redacted', salt: saltHex, hash: hashHex, createdAt: new Date().toISOString() };
      const saved = JSON.parse(localStorage.getItem('zk-scholar-proofs') || '[]');
      saved.push(localRecord);
      localStorage.setItem('zk-scholar-proofs', JSON.stringify(saved));

      setStatus('submitting');
      const payload = {
        contract: contractAddress,
        method: 'proveEligibility',
        proof: { hash: hashHex },
        publicSignals: { contract: contractAddress, method: 'proveEligibility', timestamp: Date.now() },
      };

      const response = await fetch('/api/prove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setStatus('error');
        setError('Proof submission failed');
        return;
      }

      setStatus('success');
      setMessage('Eligibility proof generated locally and submitted (inputs kept private).');
      setForm({ score: '', income: '', dob: '' });
    } catch (err) {
      setStatus('error');
      setError('Proof generation or submission failed.');
    }
  };

  return (
    <section className="mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="glass p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-semibold">Scholarship Eligibility Proof</h3>
                <p className="text-sm text-gray-400">Submit a privacy-preserving proof without revealing your personal information.</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">Program Min Score</div>
                <div className="font-medium">{programData ? `${programData.minScore}%` : '—'}</div>
              </div>
            </div>

            <form className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={submitProof}>
              <div>
                <label className="block text-sm text-gray-300">Academic Score (%)</label>
                <div className="mt-2 relative">
                  <input className="w-full rounded-md bg-transparent border border-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--cyan-glow)] transition" type="number" min={0} max={100} value={form.score} onChange={(e)=>setForm({...form, score: e.target.value})} placeholder="e.g. 85" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-300">Family Income (₹)</label>
                <div className="mt-2">
                  <input className="w-full rounded-md bg-transparent border border-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--cyan-glow)] transition" type="number" min={0} value={form.income} onChange={(e)=>setForm({...form, income: e.target.value})} placeholder="e.g. 250000" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-300">Age</label>
                <div className="mt-2">
                  <input className="w-full rounded-md bg-transparent border border-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--cyan-glow)] transition" type="number" min={0} value={form.dob} onChange={(e)=>setForm({...form, dob: e.target.value})} placeholder="e.g. 21" />
                </div>
              </div>

              <div className="md:col-span-3 flex items-center justify-end mt-2">
                <button type="submit" disabled={status==='generating' || status==='submitting'} className="btn-primary px-6 py-3 rounded-full font-medium glow flex items-center gap-3">
                  {status==='generating' && <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)" strokeWidth="4" fill="none"/></svg>}
                  {status==='submitting' && <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)" strokeWidth="4" fill="none"/></svg>}
                  {status==='success' ? 'Submitted' : status==='generating' ? 'Generating Proof...' : status==='submitting' ? 'Submitting Proof...' : 'Generate & Submit Proof'}
                </button>
              </div>
            </form>

              {status==='success' && (
              <div className="mt-4 p-4 bg-green-900/30 border border-green-600 rounded-lg">
                <div className="flex items-center gap-3"><ShieldCheck /><div className="font-semibold">Proof Generated Successfully</div></div>
                <div className="text-sm text-gray-300 mt-2">Your scholarship eligibility proof was submitted without revealing your private inputs.</div>
                <div className="mt-2 text-xs text-gray-400">Proof status: Submitted • Privacy: Protected • Verification: Not yet implemented</div>
              </div>
            )}

            {error && <div className="mt-4 p-4 bg-red-900/20 border border-red-700 rounded-lg text-sm">{error}</div>}
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-300">Program State</div>
                <div className="text-lg font-medium">{programData ? `${programData.claimCount} proofs` : '—'}</div>
              </div>
              <div className="text-right text-xs text-gray-400">Min Age: {programData?.minAge ?? '—'}</div>
            </div>
            <div className="mt-4 text-sm text-gray-400">Minimum Score: {programData?.minScore ?? '—'}%</div>
            <div className="text-sm text-gray-400">Max Income: ₹{programData?.maxIncome ?? '—'}</div>
          </div>

          <div className="glass p-4 rounded-xl">
            <div className="text-sm text-gray-300">Wallet</div>
            <div className="mt-2 text-sm text-gray-400">Connect your Midnight wallet to interact with the network.</div>
          </div>

        </div>
      </div>

      {/* Privacy Flow */}
      <div className="mt-8 glass p-6 rounded-xl">
        <h4 className="text-lg font-semibold">How ZK-Scholar Protects Your Privacy</h4>
        <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-md"><Lock /></div>
            <div>
              <div className="font-medium">Private Student Data</div>
              <div className="text-sm text-gray-400">Inputs remain in your browser.</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-md"><Sparkles /></div>
            <div>
              <div className="font-medium">Client-side Proof Generation</div>
              <div className="text-sm text-gray-400">Proofs are computed locally (simulated).</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-md"><Database /></div>
            <div>
              <div className="font-medium">Backend</div>
              <div className="text-sm text-gray-400">Only proof hashes and public signals are submitted.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
