import React, { useState, useEffect } from 'react';
import { Activity, Clock, Users, Award, CheckCircle } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: string;
  tx: string;
  time: string;
  success: boolean;
}

export default function BlockchainActivity() {
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setActivity([
        { id: '1', type: 'Proof Verified', tx: '0xabc123...', time: '2 mins ago', success: true },
        { id: '2', type: 'Eligibility Check', tx: '0xdef456...', time: '5 mins ago', success: true },
        { id: '3', type: 'Claim Submitted', tx: '0xghi789...', time: '10 mins ago', success: true },
        { id: '4', type: 'Wallet Connected', tx: '-', time: '1 hour ago', success: true }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <section className="py-8">
      <div className="max-w-4xl mx-auto">
        <div className="glass p-6 rounded-xl mb-6">
          <h1 className="text-2xl font-bold mb-2">Blockchain Activity</h1>
          <p className="text-gray-400">Recent on-chain interactions</p>
        </div>

        {loading ? (
          <div className="glass p-8 rounded-xl text-center">
            <div className="animate-spin h-8 w-8 border-4 border-[var(--cyan-glow)] border-transparent rounded-full mb-4 mx-auto"></div>
            <p className="text-gray-400">Loading activity...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activity.map((item: ActivityItem) => (
              <div key={item.id} className="glass p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-500">
                      <CheckCircle size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.type}</h3>
                      <p className="text-xs text-gray-500">{item.tx !== '-' ? `${item.tx.slice(0, 10)}...` : '-'} • {item.time}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
