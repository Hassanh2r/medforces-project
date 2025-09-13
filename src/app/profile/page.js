// src/app/profile/page.js
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';
import useAuth from '@/hooks/useAuth';

// Helper function for rank color (can be moved to a separate file later)
const getRankColor = (rating) => {
  if (!rating) return "text-gray-700";
  if (rating < 1200) return "text-gray-600";
  if (rating < 1400) return "text-green-600";
  if (rating < 1600) return "text-cyan-600";
  if (rating < 1900) return "text-blue-600";
  if (rating < 2100) return "text-purple-600";
  return "text-orange-500";
};

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({ total_attempts: 0, average_score: 0 });
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        setLoadingData(true);
        
        // Fetch all data in parallel for better performance
        const [profileRes, resultsRes, statsRes] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', user.id).single(),
          supabase.rpc('get_user_results', { p_user_id: user.id }),
          supabase.rpc('get_user_stats', { p_user_id: user.id })
        ]);

        if(profileRes.data) setProfile(profileRes.data);
        if(resultsRes.data) setResults(resultsRes.data);
        if(statsRes.data && statsRes.data.length > 0) setStats(statsRes.data[0]);
        
        setLoadingData(false);
      };
      fetchData();
    }
  }, [user]);

  if (authLoading || loadingData) {
    return <div className="text-center py-10">Loading profile...</div>;
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-12">
        {/* Profile Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-800">{profile?.full_name || user.email}</h1>
          <p className={`mt-2 text-2xl font-bold ${getRankColor(profile?.rating)}`}>
            Rating: {profile?.rating || 'N/A'}
          </p>
        </div>

        {/* Stats and Recent Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Stats */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Statistics</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Quizzes Taken</span>
                  <span className="font-bold text-lg text-blue-600">{stats.total_attempts}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Score</span>
                  <span className="font-bold text-lg text-green-600">
                    {Number(stats.average_score || 0).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
             <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Ready for more?</h2>
                <Link href="/challenges" className="w-full inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105">
                    Go to contests
                </Link>
            </div>
          </div>

          {/* Right Column: Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h2>
            {results.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {results.slice(0, 10).map((result, index) => ( // Show last 10 attempts
                  <li key={index} className="py-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-lg text-blue-800">{result.challenge_title}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(result.taken_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-xl text-green-600">{result.score}</p>
                      <p className="text-sm text-gray-500">Points</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-center py-10"><p>You haven&apos;t completed any challenges yet.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}