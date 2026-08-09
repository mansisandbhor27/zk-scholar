import React from 'react';
import { Shield, Users, Award, CheckCircle } from 'lucide-react';

export default function PrivacyVisualization() {
  return (
    <section className="py-8">
      <div className="max-w-4xl mx-auto">
        <div className="glass p-6 rounded-xl mb-6">
          <h1 className="text-2xl font-bold mb-4">Privacy Visualization</h1>
          <p className="text-gray-400">
            See how your data remains private while proving eligibility.
          </p>
        </div>

        <div className="glass p-6 rounded-xl mb-6">
          <h3 className="text-lg font-semibold mb-4">Your Data Flow</h3>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center mb-2">
                  <Users size={24} className="text-white" />
                </div>
                <div className="text-sm font-medium">Your Identity</div>
              </div>
              <div className="flex-1 h-1 bg-dashed border-dashed border-white/20"></div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-2">
                  <Shield size={24} className="text-white" />
                </div>
                <div className="text-sm font-medium">ZK Proof</div>
              </div>
              <div className="flex-1 h-1 bg-dashed border-dashed border-white/20"></div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-2">
                  <CheckCircle size={24} className="text-white" />
                </div>
                <div className="text-sm font-medium">Smart Contract</div>
              </div>
            </div>
            
            <div className="glass p-4 rounded-xl">
              <h4 className="font-semibold mb-2">What is Revealed:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle size={14} className="text-green-400 mr-2" />
                  <span className="text-gray-300">✓ Eligibility status (yes/no)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle size={14} className="text-green-400 mr-2" />
                  <span className="text-gray-300">✓ Public statistics (verified count)</span>
                </li>
                <li className="flex items-center">
                  <AlertCircle size={14} className="text-orange-400 mr-2" />
                  <span className="text-gray-300">✗ Your actual scores, income, age</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">How ZK Proofs Work</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Step 1: Input Your Data</h4>
              <p className="text-sm text-gray-400">
                Enter your confidential information (score, income, age).
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Step 2: Generate Proof</h4>
              <p className="text-sm text-gray-400">
                The system creates a zero-knowledge proof that verifies you meet criteria
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Step 3: Submit Proof</h4>
              <p className="text-sm text-gray-400">
                Submit only the proof (not your actual data) to the smart contract
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Step 4: Verification</h4>
              <p className="text-sm text-gray-400">
                The contract verifies the proof without seeing your data
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { AlertCircle } from 'lucide-react';