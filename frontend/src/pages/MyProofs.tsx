import React, { useState } from 'react';
import { Shield, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function MyProofs() {
  const [proofs] = useState([
    {
      id: '1',
      type: 'Eligibility Proof',
      status: 'verified',
      createdAt: '2024-06-15',
      scholarship: 'Midnight Women in Tech Scholarship',
      txHash: '0xabc123...',
      expires: 'Never'
    },
    {
      id: '2',
      type: 'Income Proof',
      status: 'pending',
      createdAt: '2024-07-01',
      scholarship: 'Blockchain Innovation Grant',
      txHash: '-',
      expires: '2024-12-31'
    }
  ]);

  return (
    <section className="py-8">
      <div className="max-w-4xl mx-auto">
        <div className="glass p-6 rounded-xl mb-6">
          <h1 className="text-2xl font-bold mb-2">My Zero-Knowledge Proofs</h1>
          <p className="text-gray-400">All your privacy-preserving proofs on the blockchain</p>
        </div>

        <div className="space-y-4">
          {proofs.map((proof) => (
            <div key={proof.id} className="glass p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    proof.status === 'verified' 
                      ? 'bg-green-500/20' 
                      : proof.status === 'pending' 
                        ? 'bg-orange-500/20' 
                        : 'bg-red-500/20'
                  }`}>
                    {proof.status === 'verified' ? (
                      <CheckCircle className="text-green-400" size={20} />
                    ) : proof.status === 'pending' ? (
                      <Clock className="text-orange-400" size={20} />
                    ) : (
                      <AlertCircle className="text-red-400" size={20} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{proof.type}</h3>
                    <p className="text-sm text-gray-400">{proof.scholarship}</p>
                    <p className="text-xs text-gray-500">Created: {proof.createdAt}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium capitalize">{proof.status}</div>
                  <div className="text-xs text-gray-400">Expires: {proof.expires}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}