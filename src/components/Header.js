"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <header className="w-full bg-white/80 backdrop-blur-sm shadow-sm py-4 px-6 md:px-10 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="text-3xl font-extrabold text-blue-600 tracking-tight">
          MedForces
        </Link>
        <button onClick={() => setSidebarOpen(true)} className="text-gray-600 text-3xl md:hidden">☰</button>
      </header>

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
            <Link href="/login" className="text-lg font-semibold text-gray-700 hover:text-blue-600">Login</Link>
            <Link href="#" className="w-full bg-blue-600 text-white py-2 rounded-lg text-lg font-bold hover:bg-blue-700">Sign Up</Link>
        </nav>
      </div>
    </>
  );
}