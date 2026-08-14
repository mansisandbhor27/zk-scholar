import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, AlertCircle, Clock, Users } from 'lucide-react';

export default function ZkProofProgress() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const totalSteps = 5;
  const steps = [
    { id: 1, name: 'Generate Proof', desc: 'Creating privacy-preserving proof' },
    { id: 2, name: 'Submit to Contract', desc: 'Submitting proof to blockchain' },
    { id: 3, name: 'Verify on Chain', desc: 'Verifying proof validity' },
    { id: 4, name: 'Update State', desc: 'Updating eligibility records' },
    { id: 5, name: 'Complete', desc: 'Proof successfully submitted' }
  ];

  const handleNext = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setStep(prev => Math.min(prev + 1, totalSteps));
    
    if (step === totalSteps) {
      setResult({ success: true, txHash: '0xabc123...' });
    }
  };

  useEffect(() => {
    handleNext();
  }, []);

  return (
    <section className="py-8">
      <div className="max-w-2xl mx-auto">
        <div className="glass p-6 rounded-xl mb-6">
          <h1 className="text-2xl font-bold mb-4">Zero-Knowledge Proof Progress</h1>
          <p className="text-gray-400">
            Your privacy-preserving proof is being generated and submitted to the Midnight blockchain.
          </p>
        </div>

        <div className="glass p-6 rounded-xl">
          <div className="flex justify-between items-center mb-8">
            {steps.map((s, index) => (
              <React.Fragment key={s.id}>
                <div className="text-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= s.id 
                      ? 'bg-gradient-to-br from-[var(--accent-start)] to-[var(--accent-end)] text-white'
                      : 'bg-white/10 text-gray-400'
                  }`}>
                    {step > s.id ? <CheckCircle size={20} /> : step === s.id ? <Clock size={20} /> : s.id}
                  </div>
                  <div className="text-xs mt-2 font-medium">{s.name}</div>
                  <div className="text-xs text-gray-400 max-w-20">{s.desc}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 bg-white/10"></div>
                )}
              </React.Fragment>
            ))}
          </div>

          {result ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Proof Successful!</h3>
              <p className="text-gray-300 mb-4">Your zero-knowledge proof has been verified on-chain.</p>
              <div className="glass p-4 rounded-xl mb-6">
                <div className="text-sm text-gray-400">Transaction Hash</div>
                <div className="font-mono text-xs text-[var(--cyan-glow)] break-all">
                  {result.txHash}
                </div>
              </div>
              <button 
                onClick={() => window.location.href = '/my-proofs'}
                className="btn-primary px-6 py-3 rounded-full font-bold glow"
              >
                View My Proofs
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin w-12 h-12 border-4 border-[var(--accent-start)] border-transparent rounded-full mb-4"></div>
              <p className="text-gray-400">Processing...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}