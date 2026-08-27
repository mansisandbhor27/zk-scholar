import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, MapPin, Calendar, Award } from 'lucide-react';

interface Scholarship {
  id: string;
  name: string;
  description: string;
  amount: number;
  deadline: string;
  location: string;
  eligibility: { score: number; income: number; age: number };
}

export default function Scholarships() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(true);
    // Sample data - would normally fetch from API
    const sampleScholarships: Scholarship[] = [
      {
        id: '1',
        name: 'Midnight Women in Tech Scholarship',
        description: 'For women pursuing careers in technology and blockchain',
        amount: 5000,
        deadline: '2024-12-15',
        location: 'Global',
        eligibility: { score: 80, income: 100000, age: 18 }
      },
      {
        id: '2',
        name: 'Blockchain Innovation Grant',
        description: 'Supporting innovative blockchain projects and research',
        amount: 10000,
        deadline: '2024-11-30',
        location: 'Global',
        eligibility: { score: 85, income: 150000, age: 21 }
      },
      {
        id: '3',
        name: 'Midnight Privacy Fellowship',
        description: 'For privacy-focused development and research',
        amount: 7500,
        deadline: '2024-10-31',
        location: 'Global',
        eligibility: { score: 90, income: 200000, age: 18 }
      }
    ];
    setScholarships(sampleScholarships);
    setLoading(false);
  }, []);

  const filteredScholarships = scholarships.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <section className="py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass p-6 rounded-xl h-48"></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Available Scholarships</h1>
        <div className="glass p-4 rounded-xl">
          <input
            type="text"
            placeholder="Search scholarships..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent outline-none text-white placeholder-gray-400"
          />
        </div>
      </div>

      {filteredScholarships.length === 0 ? (
        <div className="text-center py-12">
          <GraduationCap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Scholarships Found</h3>
          <p className="text-gray-400">
            {searchTerm ? 'Try a different search term' : 'No scholarships are currently available'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholarships.map((scholarship) => (
            <Link
              key={scholarship.id}
              to={`/scholarships/${scholarship.id}`}
              className="glass p-6 rounded-xl hover:transform hover:scale-105 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-[var(--accent-start)] to-[var(--accent-end)] rounded-lg">
                  <Award size={24} className="text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{scholarship.name}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{scholarship.description}</p>
              <div className="border-t border-white/10 pt-4 mb-4">
                <div className="flex items-center text-sm text-gray-300 mb-2">
                  <MapPin size={14} className="mr-2" />
                  {scholarship.location}
                </div>
                <div className="flex items-center text-sm text-gray-300 mb-2">
                  <Calendar size={14} className="mr-2" />
                  Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <Award size={14} className="mr-2" />
                  Amount: ${scholarship.amount.toLocaleString()}
                </div>
              </div>
              <button className="w-full btn-primary py-2 rounded-full font-medium glow">
                View Details
              </button>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
