import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Award, CheckCircle, Shield, Clock, FileCheck } from 'lucide-react';

export default function ScholarshipDetails() {
  const { id } = useParams<{ id: string }>();
  const [showProofModal, setShowProofModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scholarship = {
    id,
    name: 'Midnight Women in Tech Scholarship',
    description: 'For women pursuing careers in technology and blockchain',
    amount: 5000,
    deadline: '2024-12-15',
    eligibility: { score: 80, income: 150000, age: 18 },
    progress: 65
  };

  const handleGenerateProof = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setShowProofModal(true);
  };

  return (
    <section className="py-8">
      <Link to="/scholarships" className="text-[var(--accent-start)] hover:underline text-sm mb-6 inline-block">
        ← Back to Scholarships
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="glass p-6 rounded-xl mb-6">
            <h1 className="text-2xl font-bold mb-4">{scholarship.name}</h1>
            <p className="text-gray-300 mb-6">{scholarship.description}</p>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Eligibility Criteria</h3>
              <div className="glass p-4 rounded-xl">
                <div className="flex items-center mb-2">
                  <Award size={16} className="text-gray-400 mr-2" />
                  <span className="text-gray-300">Minimum Academic Score: {scholarship.eligibility.score}%</span>
                </div>
                <div className="flex items-center mb-2">
                  <Shield size={16} className="text-gray-400 mr-2" />
                  <span className="text-gray-300">Max Family Income: ₹{scholarship.eligibility.income.toLocaleString()}</span>
                </div>
                <div className="flex items-center mb-2">
                  <Clock size={16} className="text-gray-400 mr-2" />
                  <span className="text-gray-300">Min Age: {scholarship.eligibility.age}+ years</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Your Eligibility</h3>
              <div className="glass p-4 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-full bg-white/10 rounded-full h-2.5 mr-3">
                    <div 
                      className="bg-gradient-to-br from-[var(--accent-start)] to-[var(--accent-end)] h-2.5 rounded-full" 
                      style={{ width: `${scholarship.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{scholarship.progress}% Match</span>
                </div>
                <button
                  onClick={handleGenerateProof}
                  disabled={isSubmitting}
                  className="w-full btn-primary py-2 rounded-full font-medium glow"
                >
                  {isSubmitting ? 'Generating...' : 'Generate ZK Proof'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="glass p-4 rounded-xl">
            <div className="text-center mb-4">
              <div className="text-2xl font-bold mb-1">₹{scholarship.amount.toLocaleString()}</div>
              <div className="text-gray-400 text-sm">Award Amount</div>
            </div>
            <div className="border-t border-white/10 pt-4">
              <div className="text-sm mb-2">
                <span className="text-gray-400">Deadline:</span>
                <span className="ml-2 text-white">{new Date(scholarship.deadline).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showProofModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass p-6 rounded-xl max-w-md w-full">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Proof Generated!</h3>
              <p className="text-gray-300 mb-4">Your ZK proof has been created successfully.</p>
              <button 
                onClick={() => setShowProofModal(false)}
                className="btn-primary px-6 py-3 rounded-full font-bold glow"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
