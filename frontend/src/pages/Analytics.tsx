import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Award, TrendingUp, Clock } from 'lucide-react';

export default function Analytics() {
  const [stats, setStats] = useState({
    totalApplicants: 0,
    verifiedCount: 0,
    successRate: 0,
    avgProcessingTime: 0
  });

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalApplicants: 1247,
        verifiedCount: 892,
        successRate: 71.5,
        avgProcessingTime: 2.3
      });
    }, 1000);
  }, []);

  return (
    <section className="py-8">
      <div className="max-w-4xl mx-auto">
        <div className="glass p-6 rounded-xl mb-6">
          <h1 className="text-2xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Real-time program metrics and insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={Users} 
            title="Total Applicants" 
            value={stats.totalApplicants} 
            change="+12% this month"
          />
          <StatCard 
            icon={Award} 
            title="Verified Scholarships" 
            value={stats.verifiedCount} 
            change="+8% this month"
          />
          <StatCard 
            icon={TrendingUp} 
            title="Success Rate" 
            value={stats.successRate + '%'} 
            change="+3% improvement"
          />
          <StatCard 
            icon={Clock} 
            title="Avg Processing" 
            value={stats.avgProcessingTime + 'h'} 
            change="-15% faster"
          />
        </div>

        <div className="glass p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">Recent Trends</h3>
          <div className="h-48 bg-gradient-to-br from-[var(--accent-start)]/10 to-[var(--accent-end)]/10 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mb-2" />
              <p className="text-gray-500">Analytics visualization would appear here</p>
            </div>
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
  change: string;
}

function StatCard({ icon: Icon, title, value, change }: StatCardProps) {
  return (
    <div className="glass p-4 rounded-xl text-center">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-start)] to-[var(--accent-end)] mb-3">
        <Icon size={20} className="text-white" />
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-gray-400 mb-2">{title}</div>
      <div className="text-xs text-green-400">{change}</div>
    </div>
  );
}