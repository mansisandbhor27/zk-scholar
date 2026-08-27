import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, CheckCircle, Clock, TrendingUp, Users } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState<any>({
    totalApplicants: 1247,
    eligible: 892,
    successRate: '71%',
    activeApps: 5,
    minScore: 75,
    maxIncome: 800000,
    minAge: 18
  });

  return (
    <section className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Award} title="Total Applicants" value={data.totalApplicants} />
        <StatCard icon={CheckCircle} title="Eligible" value={data.eligible} />
        <StatCard icon={TrendingUp} title="Success Rate" value={data.successRate} />
        <StatCard icon={Users} title="Active Apps" value={data.activeApps} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">Program Criteria</h3>
          <div className="space-y-4">
            <CriteriaRow label="Min Academic Score" value={data.minScore + '%'} />
            <CriteriaRow label="Max Family Income" value={'₹' + (data.maxIncome / 100000).toFixed(0) + 'L'} />
            <CriteriaRow label="Min Age" value={data.minAge + '+ years'} />
          </div>
        </div>

        <div className="glass p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/scholarships" className="bg-gradient-to-br from-[var(--accent-start)] to-[var(--accent-end)] p-4 rounded-xl text-center hover:opacity-90 transition">
              <Award size={24} className="mx-auto mb-2" />
              <div className="font-medium">Scholarships</div>
            </Link>
            <Link to="/eligibility" className="bg-gradient-to-br from-cyan-500 to-blue-500 p-4 rounded-xl text-center hover:opacity-90 transition">
              <CheckCircle size={24} className="mx-auto mb-2" />
              <div className="font-medium">Check Eligibility</div>
            </Link>
            <Link to="/privacy" className="bg-gradient-to-br from-purple-500 to-indigo-500 p-4 rounded-xl text-center hover:opacity-90 transition">
              <Shield size={24} className="mx-auto mb-2" />
              <div className="font-medium">Privacy View</div>
            </Link>
            <Link to="/claims" className="bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-xl text-center hover:opacity-90 transition">
              <Users size={24} className="mx-auto mb-2" />
              <div className="font-medium">My Claims</div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

interface StatCardProps {
  icon: any;
  title: string;
  value: string | number;
}

function StatCard({ icon: Icon, title, value }: StatCardProps) {
  return (
    <div className="glass p-6 rounded-xl text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[var(--accent-start)] to-[var(--accent-end)] mb-3">
        <Icon size={24} className="text-white" />
      </div>
      <div className="text-sm text-gray-400 mb-1">{title}</div>
      <div className="text-3xl font-bold text-white">{value}</div>
    </div>
  );
}

interface CriteriaRowProps {
  label: string;
  value: string;
}

function CriteriaRow({ label, value }: CriteriaRowProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
      <span className="text-gray-300">{label}</span>
      <span className="font-bold text-white">{value}</span>
    </div>
  );
}

import { Shield } from 'lucide-react';
