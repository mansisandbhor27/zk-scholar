import React, { useState } from 'react';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';

export default function CheckEligibility() {
  const [formData, setFormData] = useState({
    academicScore: '',
    familyIncome: '',
    age: '',
    program: 'default'
  });
  const [showResult, setShowResult] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate ZK proof eligibility check
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const score = parseInt(formData.academicScore);
    const income = parseInt(formData.familyIncome);
    const age = parseInt(formData.age);
    
    // Simplified eligibility: score >= 70, income <= 150000, age >= 18
    const eligible = score >= 70 && income <= 150000 && age >= 18;
    
    setIsEligible(eligible);
    setShowResult(true);
    setLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="py-8">
      <div className="max-w-2xl mx-auto">
        <div className="glass p-6 rounded-xl mb-6">
          <h1 className="text-2xl font-bold mb-4">Check Scholarship Eligibility</h1>
          <p className="text-gray-400">
            Enter your details to check if you qualify for available scholarships.
            Your information will be verified through zero-knowledge proofs.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass p-6 rounded-xl space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Academic Score (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.academicScore}
              onChange={(e) => handleInputChange('academicScore', e.target.value)}
              className="w-full glass p-4 rounded-xl focus:outline-none"
              placeholder="e.g., 85"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Family Income (₹)</label>
            <input
              type="number"
              min="0"
              value={formData.familyIncome}
              onChange={(e) => handleInputChange('familyIncome', e.target.value)}
              className="w-full glass p-4 rounded-xl focus:outline-none"
              placeholder="e.g., 120000"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Age (years)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              className="w-full glass p-4 rounded-xl focus:outline-none"
              placeholder="e.g., 20"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 rounded-full font-bold glow disabled:opacity-50"
          >
            {loading ? 'Checking Eligibility...' : 'Check Eligibility'}
          </button>
        </form>

        {showResult && (
          <div className="glass p-6 rounded-xl mt-6 animate-fade-in">
            <div className="text-center">
              {isEligible ? (
                <>
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2 text-green-400">You Are Eligible!</h3>
                  <p className="text-gray-300 mb-4">
                    Congratulations! You meet the scholarship criteria.
                  </p>
                  <button
                    onClick={() => {/* Navigate to ZK proof flow */}}
                    className="btn-primary px-6 py-3 rounded-full font-bold glow"
                  >
                    Generate ZK Proof
                  </button>
                </>
              ) : (
                <>
                  <Shield className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2 text-orange-400">Not Eligible</h3>
                  <p className="text-gray-300 mb-4">
                    Your current profile does not meet the scholarship requirements.
                  </p>
                  <div className="glass p-4 rounded-xl">
                    <h4 className="font-semibold mb-2">Criteria:</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Academic Score: ≥ 70%</li>
                      <li>• Family Income: ≤ ₹150,000</li>
                      <li>• Age: ≥ 18 years</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
