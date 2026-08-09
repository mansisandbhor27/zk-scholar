import React, { useState } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';

export default function CreateScholarship() {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    minScore: '',
    maxIncome: '',
    minAge: '',
    deadline: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass p-8 rounded-xl">
            <Sparkles className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Program Created Successfully!</h3>
            <p className="text-gray-300 mb-6">
              Your scholarship program has been configured. 
              Please deploy the contract to make it active.
            </p>
            <button 
              onClick={() => setSubmitted(false)}
              className="btn-primary px-6 py-3 rounded-full font-bold glow"
            >
              Create Another Program
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="max-w-2xl mx-auto">
        <div className="glass p-6 rounded-xl mb-6">
          <h1 className="text-2xl font-bold mb-2">Create Scholarship Program</h1>
          <p className="text-gray-400">Configure a new privacy-preserving scholarship</p>
        </div>

        <form onSubmit={handleSubmit} className="glass p-6 rounded-xl space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Program Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full glass p-4 rounded-xl"
              placeholder="e.g., Midnight Women in Tech Scholarship"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Award Amount (₹)</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              className="w-full glass p-4 rounded-xl"
              placeholder="50000"
              required
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Min Score (%)</label>
              <input
                type="number"
                value={formData.minScore}
                onChange={(e) => setFormData({...formData, minScore: e.target.value})}
                className="w-full glass p-4 rounded-xl"
                placeholder="75"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Max Income (₹)</label>
              <input
                type="number"
                value={formData.maxIncome}
                onChange={(e) => setFormData({...formData, maxIncome: e.target.value})}
                className="w-full glass p-4 rounded-xl"
                placeholder="150000"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Min Age</label>
              <input
                type="number"
                value={formData.minAge}
                onChange={(e) => setFormData({...formData, minAge: e.target.value})}
                className="w-full glass p-4 rounded-xl"
                placeholder="18"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Application Deadline</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({...formData, deadline: e.target.value})}
              className="w-full glass p-4 rounded-xl"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full btn-primary py-3 rounded-full font-bold glow"
          >
            Create Program
          </button>
        </form>
      </div>
    </section>
  );
}