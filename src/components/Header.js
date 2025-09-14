// src/components/Header.js
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

// دالة لتحديد لون التقييم
const getRankColor = (rating) => {
  if (!rating) return "text-gray-700";
  if (rating < 1200) return "text-gray-600";
  if (rating < 1400) return "text-green-600";
  if (rating < 1600) return "text-cyan-600";
  if (rating < 1900) return "text-blue-600";
  if (rating < 2100) return "text-purple-600";
  return "text-orange-500";
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const sessionUser = session?.user ?? null;
        setUser(sessionUser);
        if (sessionUser) {
          const { data: profileData } = await supabase
            .from("profiles").select("full_name, rating").eq("id", sessionUser.id).single();
          setProfile(profileData);
        } else {
          setProfile(null);
        }
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-800">
          MedForces
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-600 hover:text-blue-600 transition">Home</Link>
          <Link href="/challenges" className="text-gray-600 hover:text-blue-600 transition">Challenges</Link>
          <Link href="/practice" className="text-gray-600 hover:text-blue-600 transition">Practice</Link>
          <Link href="/leaderboard" className="text-gray-600 hover:text-blue-600 transition">Leaderboard</Link>
          <Link href="/profile" className="text-gray-600 hover:text-blue-600 transition">Profile</Link>
        </div>

        {/* Auth section for Desktop */}
        <div className="hidden md:flex items-center space-x-4 min-w-[200px] justify-end">
          {isMounted && (
            user ? (
              <>
                <Link href="/profile" className={`text-sm font-semibold transition ${getRankColor(profile?.rating)}`}>
                  {profile?.full_name ?? "Unknown"} [{profile?.rating ?? "Unrated"}]
                </Link>
                <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-red-600">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-blue-600 font-semibold">Login</Link>
                <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700">Sign Up</Link>
              </>
            )
          )}
        </div>

        {/* Hamburger Menu Button for Mobile */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 focus:outline-none">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu (Conditionally Rendered) */}
      {isMenuOpen && (
         <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Home</Link>
            <Link href="/challenges" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Challenges</Link>
            <Link href="/practice" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Practice</Link>
            <Link href="/leaderboard" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Leaderboard</Link>
            <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Profile</Link>
            <hr className="my-2"/>
             {isMounted && (
               user ? (
                  <div className="px-3 py-2">
                    <p className={`text-base font-semibold truncate ${getRankColor(profile?.rating)}`}>
                      {profile?.full_name ?? "Unknown"} [{profile?.rating ?? "Unrated"}]
                    </p>
                    <button onClick={handleLogout} className="mt-2 w-full bg-red-500 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-red-600">
                      Logout
                    </button>
                  </div>
               ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Login</Link>
                    <Link href="/signup" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Sign Up</Link>
                  </>
               )
             )}
          </div>
        </div>
      )}
    </header>
  );
}