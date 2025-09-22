// src/app/profile/page.js
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';
import useAuth from '@/hooks/useAuth';

// 📊 مكتبة الرسم البياني
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Helper function for rank color
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

  // ⬇️ بيانات جديدة
  const [ratingHistory, setRatingHistory] = useState([]);
  const [performance, setPerformance] = useState([]);

  // For editing username
  const [newName, setNewName] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        setLoadingData(true);
        
        const [profileRes, resultsRes, statsRes, ratingRes, perfRes] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', user.id).single(),
          supabase.rpc('get_user_results', { p_user_id: user.id }),
          supabase.rpc('get_user_stats', { p_user_id: user.id }),
          supabase.rpc('get_user_rating_history', { p_user_id: user.id }),
          supabase.rpc('get_performance_by_subject', { p_user_id: user.id })
        ]);

        if (profileRes.data) {
          setProfile(profileRes.data);
          setNewName(profileRes.data.full_name || ""); // pre-fill input
        }
        if (resultsRes.data) setResults(resultsRes.data);
        if (statsRes.data && statsRes.data.length > 0) setStats(statsRes.data[0]);
        if (ratingRes.data) setRatingHistory(ratingRes.data);
        if (perfRes.data) setPerformance(perfRes.data);
        
        setLoadingData(false);
      };
      fetchData();
    }
  }, [user]);

  const handleUpdateName = async () => {
    if (!newName.trim()) {
      setUpdateMessage("Name cannot be empty.");
      return;
    }
    setUpdating(true);
    setUpdateMessage("");

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: newName })
      .eq("id", user.id);

    if (error) {
      setUpdateMessage("Error updating name. Try again.");
    } else {
      setProfile({ ...profile, full_name: newName });
      setUpdateMessage("Name updated successfully!");
      setEditing(false);
    }
    setUpdating(false);
  };

  if (authLoading || loadingData) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-12">
        {/* Profile Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-800">
            {profile?.full_name ?? user?.email}
          </h1>
          <p className={`mt-2 text-2xl font-bold ${getRankColor(profile?.rating ?? 0)}`}>
            Rating: {profile?.rating ?? "N/A"}
          </p>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="mt-3 text-blue-600 hover:underline"
            >
              Change your name
            </button>
          )}
        </div>

        {/* Edit Username Section */}
        {editing && (
          <div className="mb-12 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Change Username</h2>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new username"
              />
              <button
                onClick={handleUpdateName}
                disabled={updating}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105 disabled:opacity-50"
              >
                {updating ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
            {updateMessage && (
              <p className="mt-3 text-sm text-gray-600">{updateMessage}</p>
            )}
          </div>
        )}

        {/* Stats and Recent Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Stats */}
          <div className="lg:col-span-1 space-y-8">
            {/* 📌 Statistics */}
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

            {/* 📊 Rating History Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Rating Progress</h2>
              {ratingHistory.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={ratingHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="contest_date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="new_rating" stroke="#2563eb" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center">No rating history yet.</p>
              )}
            </div>

            {/* 🔗 Go to contests */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Ready for more?</h2>
              <Link
                href="/challenges"
                className="w-full inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
              >
                Go to contests
              </Link>
            </div>
          </div>

          {/* Right Column: Performance + Recent Activity */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 📚 Performance by Subject */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Performance by Subject</h2>
              {performance.length > 0 ? (
                <ul className="space-y-4">
                  {performance.map((subj, index) => (
                    <li key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold">{subj.subject_name}</span>
                        <span className="text-sm text-gray-800">
                          {subj.accuracy.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full"
                          style={{ width: `${subj.accuracy}%` }}
                        ></div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-800 text-center">No subject performance data yet.</p>
              )}
            </div>

            {/* 🕓 Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h2>
              {results.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {results.slice(0, 10).map((result, index) => ( 
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
                <p className="text-gray-600 text-center py-10">You haven&apos;t completed any challenges yet.</p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
