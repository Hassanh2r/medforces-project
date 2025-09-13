// src/app/challenges/page.js
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';
import useAuth from '@/hooks/useAuth';

// دالة لحساب حالة المسابقة (مجدولة، جارية، منتهية)
const getContestStatus = (start, end) => {
  const now = new Date();
  const startTime = new Date(start);
  const endTime = new Date(end);
  if (now < startTime) return { text: 'Scheduled', class: 'bg-blue-100 text-blue-800' };
  if (now >= startTime && now < endTime) return { text: 'Running', class: 'bg-green-100 text-green-800 animate-pulse' };
  return { text: 'Finished', class: 'bg-gray-100 text-gray-800' };
};

export default function ChallengesPage() {
  const { user, loading } = useAuth();
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    if (user) {
      const fetchChallenges = async () => {
        // جلب المسابقات فقط
        const { data } = await supabase.from('challenges').select('*').eq('is_contest', true).order('start_time');
        setChallenges(data || []);
      };
      fetchChallenges();
    }
  }, [user]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-800">Contests</h1>
          <p className="mt-2 text-lg text-gray-600">Join our scheduled contests and test your skills in real-time.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {challenges?.map((challenge) => {
            const status = getContestStatus(challenge.start_time, challenge.end_time);
            return (
              <div key={challenge.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-blue-800">{challenge.title}</h2>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${status.class}`}>
                      {status.text}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{challenge.description}</p>
                </div>
                <div className="border-t border-gray-200 p-4 space-y-2 text-sm text-gray-500">
                    <p><strong>Starts:</strong> {new Date(challenge.start_time).toLocaleString()}</p>
                    <p><strong>Ends:</strong> {new Date(challenge.end_time).toLocaleString()}</p>
                </div>
                <div className="p-4">
                  <Link href={`/challenges/${challenge.id}`} className="w-full text-center block px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                    View Contest
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}