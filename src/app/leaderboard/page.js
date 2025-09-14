// src/app/leaderboard/page.js
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';

// A safer version of the getRankInfo function
const getRankInfo = (rating) => {
  if (rating === null || rating === undefined) {
    return { title: 'Unrated', color: 'text-gray-500' };
  }
  if (rating >= 2400) return { title: 'Grandmaster', color: 'text-red-600' };
  if (rating >= 2100) return { title: 'Master', color: 'text-orange-500' };
  if (rating >= 1900) return { title: 'Candidate Master', color: 'text-purple-600' };
  if (rating >= 1600) return { title: 'Expert', color: 'text-blue-600' };
  if (rating >= 1400) return { title: 'Specialist', color: 'text-cyan-600' };
  if (rating >= 1200) return { title: 'Pupil', color: 'text-green-600' };
  return { title: 'Newbie', color: 'text-gray-500' };
};

export default async function LeaderboardPage() {
  
  // Fetching the new professional leaderboard data
  const { data: leaderboardData, error } = await supabase.rpc('get_professional_leaderboard');

  if (error) {
    console.error('Error fetching leaderboard:', error);
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
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-center">#</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-center">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaderboardData?.map((user) => {
                const rankInfo = getRankInfo(user.rating);
                let rankClass = '';
                if (user.rank === 1) rankClass = 'bg-yellow-100/50';
                if (user.rank === 2) rankClass = 'bg-gray-200/50';
                if (user.rank === 3) rankClass = 'bg-orange-200/50';
                
                return (
                  <tr key={user.rank} className={`${rankClass} hover:bg-blue-50`}>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-lg text-gray-700">{user.rank}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-lg">
                        <span className={rankInfo.color}>{user.full_name}</span>
                      </div>
                      <div className="text-sm text-gray-500">{rankInfo.title}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-bold text-xl ${rankInfo.color}`}>{user.rating}</span>
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