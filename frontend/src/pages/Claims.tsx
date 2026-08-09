import React, { useState } from 'react';
import { Award, CheckCircle, Clock, AlertCircle, FileCheck } from 'lucide-react';

export default function Claims() {
  const [claims] = useState([
    { id: '1', scholarship: 'Midnight Women in Tech', status: 'approved', submitted: '2024-06-15', amount: 5000 },
    { id: '2', scholarship: 'Blockchain Innovation Grant', status: 'pending', submitted: '2024-07-01', amount: 10000 },
    { id: '3', scholarship: 'Privacy Fellowship', status: 'approved', submitted: '2024-05-20', amount: 7500 }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-orange-500/20 text-orange-400';
      case 'rejected': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <section className="py-8">
      <div className="max-w-4xl mx-auto">
        <div className="glass p-6 rounded-xl mb-6">
          <h1 className="text-2xl font-bold mb-2">My Claims</h1>
          <p className="text-gray-400">Track your scholarship applications and disbursements</p>
        </div>

        <div className="space-y-4">
          {claims.map((claim) => (
            <div key={claim.id} className="glass p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-[var(--accent-start)] to-[var(--accent-end)] rounded-lg">
                    <Award size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{claim.scholarship}</h3>
                    <p className="text-sm text-gray-400">Claim ID: {claim.id}</p>
                    <p className="text-xs text-gray-500">Submitted: {claim.submitted}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                    {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                  </div>
                  <div className="text-lg font-bold mt-2">₹{claim.amount.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}