// src/app/leaderboard/page.js
"use client"; // This makes it a Client Component

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';
import useAuth from '@/hooks/useAuth'; // We'll use this to protect the page

const getRankInfo = (rating) => {
  if (rating === null || rating === undefined) return { title: 'Unrated', color: 'text-gray-500' };
  if (rating >= 2400) return { title: 'Grandmaster', color: 'text-red-600' };
  if (rating >= 2100) return { title: 'Master', color: 'text-orange-500' };
  if (rating >= 1900) return { title: 'Candidate Master', color: 'text-purple-600' };
  if (rating >= 1600) return { title: 'Expert', color: 'text-blue-600' };
  if (rating >= 1400) return { title: 'Specialist', color: 'text-cyan-600' };
  if (rating >= 1200) return { title: 'Pupil', color: 'text-green-600' };
  return { title: 'Newbie', color: 'text-gray-500' };
};

export default function LeaderboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This function fetches the latest data
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase.rpc('get_professional_leaderboard');
      if (error) {
        console.error('Error fetching leaderboard:', error);
      } else {
        setLeaderboardData(data);
      }
      setIsLoading(false);
    };

    if (user) {
      // 1. Fetch the initial data
      fetchLeaderboard();

      // 2. Set up the real-time listener
      const channel = supabase
        .channel('public:quiz_results')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'quiz_results' },
          (payload) => {
            // When a new result is inserted, fetch the whole leaderboard again
            fetchLeaderboard();
          }
        )
        .subscribe();
      
      // 3. Clean up the listener when the page is closed
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  if (authLoading || isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Official Rankings</h1>
          <p className="mt-3 text-lg text-gray-600">See the official ratings of all MedForces competitors.</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
          <table className="min-w-full text-left">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase text-center">#</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">User</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase text-center">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaderboardData?.map((userData) => {
                const rankInfo = getRankInfo(userData.rating);
                return (
                  <tr key={userData.rank} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-center font-bold text-lg">{userData.rank}</td>
                    <td className="px-6 py-4">
                      <div className={`font-bold ${rankInfo.color}`}>{userData.full_name}</div>
                      <div className="text-sm text-gray-500">{rankInfo.title}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-bold text-xl ${rankInfo.color}`}>{userData.rating}</span>
                    </td>
                  </tr>
                );

              })}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
}