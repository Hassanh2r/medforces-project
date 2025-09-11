// src/app/page.js
"use client";

import { useState } from 'react';
import Link from 'next/link'; // الخطوة 1: استيراد مكون Link

// Placeholder icons...
const IconStethoscope = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2a.3.3 0 0 0-.2.3V10a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V4H4.8z"/><path d="M8 12v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1"/><circle cx="12" cy="12" r="10"/><path d="m16.2 7.8 1.4-1.4"/><path d="m21.5 12.5-1.4-1.4"/><path d="m16.2 16.2 1.4 1.4"/></svg>;
const IconBrainCircuit = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2.5 2.5 0 0 1 3 4.85"/><path d="M12 2a2.5 2.5 0 0 0-3 4.85"/><path d="M12 11.15a2.5 2.5 0 0 1 3 4.85"/><path d="M12 11.15a2.5 2.5 0 0 0-3 4.85"/><path d="M12 22a2.5 2.5 0 0 1 3-4.85"/><path d="M12 22a2.5 2.5 0 0 0-3-4.85"/><path d="M15 6.85a2.5 2.5 0 0 1 4.33-2.5"/><path d="M19.33 4.35a2.5 2.5 0 0 1 2.5 4.33"/><path d="M21.83 8.68a2.5 2.5 0 0 1 0 5.66"/><path d="M21.83 15.32a2.5 2.5 0 0 1-2.5 4.33"/><path d="M19.33 19.65a2.5 2.5 0 0 1-4.33 2.5"/><path d="M15 17.15a2.5 2.5 0 0 1-4.33 2.5"/><path d="M9 17.15a2.5 2.5 0 0 1-4.33-2.5"/><path d="M4.67 19.65a2.5 2.5 0 0 1-2.5-4.33"/><path d="M2.17 15.32a2.5 2.5 0 0 1 0-5.66"/><path d="M2.17 8.68a2.5 2.5 0 0 1 2.5-4.33"/><path d="M4.67 4.35a2.5 2.5 0 0 1 4.33-2.5"/><path d="M9 6.85a2.5 2.5 0 0 1 4.33 2.5"/></svg>;
const IconUsers = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;


export default function Home() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-blue-50 font-sans">
      
      {/* ===== Header ===== */}
      <header className="w-full bg-white/80 backdrop-blur-sm shadow-sm py-4 px-6 md:px-10 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="text-3xl font-extrabold text-blue-600 tracking-tight">
          MedForces
        </Link>
        <button onClick={() => setSidebarOpen(true)} className="text-gray-600 text-3xl md:hidden">☰</button>
      </header>

      {/* ===== Mobile Sidebar (Hidden by default) ===== */}
      <div 
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-end p-5">
          <button onClick={() => setSidebarOpen(false)} className="text-gray-700 text-4xl">&times;</button>
        </div>
        <nav className="flex flex-col p-5 space-y-4 text-center">
            <Link href="#" className="text-lg font-semibold text-gray-700 hover:text-blue-600">Start Challenges</Link>
            <Link href="#" className="text-lg font-semibold text-gray-700 hover:text-blue-600">Browse Questions</Link>
            <Link href="#" className="text-lg font-semibold text-gray-700 hover:text-blue-600">Leaderboard</Link>
            <hr/>
            <Link href="#" className="text-lg font-semibold text-gray-700 hover:text-blue-600">Login</Link>
            <Link href="#" className="w-full bg-blue-600 text-white py-2 rounded-lg text-lg font-bold hover:bg-blue-700">Sign Up</Link>
        </nav>
      </div>
      
      {/* ===== Main Hero Section ===== */}
      <main className="w-full max-w-7xl mx-auto px-6 py-20 md:py-28 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800">
          The Arena for Future Clinicians
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Sharpen your diagnostic skills, compete with peers, and master clinical knowledge on a platform built for medical excellence.
        </p>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Challenges */}
          <Link href="#" className="pro-card block bg-white rounded-xl shadow-md p-8 text-left">
            <h3 className="text-2xl font-bold text-blue-600 mb-2">Start Challenges</h3>
            <p className="text-gray-600">Engage in timed contests and solve complex clinical cases under pressure.</p>
          </Link>
          
          {/* Card 2: Questions */}
          <Link href="#" className="pro-card block bg-white rounded-xl shadow-md p-8 text-left">
            <h3 className="text-2xl font-bold text-blue-600 mb-2">Browse Questions</h3>
            <p className="text-gray-600">Access a vast question bank covering all medical specialties to practice at your own pace.</p>
          </Link>
          
          {/* Card 3: Leaderboard */}
          <Link href="#" className="pro-card block bg-white rounded-xl shadow-md p-8 text-left">
            <h3 className="text-2xl font-bold text-blue-600 mb-2">View Leaderboard</h3>
            <p className="text-gray-600">Track your progress, compare your rank, and see how you stack up against the best.</p>
          </Link>
        </div>
      </main>

      {/* ===== Why MedForces Section ===== */}
      <section className="bg-white w-full py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Why MedForces?</h2>
          <p className="text-lg text-gray-600 mb-12">A platform designed to bridge theory and practice.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="feature-item p-6 rounded-lg">
              <div className="flex justify-center items-center h-16 w-16 bg-blue-100 text-blue-600 rounded-full mx-auto mb-4">
                <IconStethoscope />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Competitive Challenges</h3>
              <p className="text-gray-600">Simulate real-world clinical scenarios to boost your decision-making skills.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="feature-item p-6 rounded-lg">
              <div className="flex justify-center items-center h-16 w-16 bg-blue-100 text-blue-600 rounded-full mx-auto mb-4">
                <IconBrainCircuit />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Interactive Learning</h3>
              <p className="text-gray-600">Practice thousands of MCQs with detailed explanations to learn effectively.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="feature-item p-6 rounded-lg">
              <div className="flex justify-center items-center h-16 w-16 bg-blue-100 text-blue-600 rounded-full mx-auto mb-4">
                <IconUsers />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Thriving Community</h3>
              <p className="text-gray-600">Connect with peers, share knowledge, and grow together in a supportive environment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="w-full bg-gray-800 py-6 text-center text-gray-300">
        <p>&copy; 2025 MedForces. All rights reserved.</p>
      </footer>
    </div>
  );
}