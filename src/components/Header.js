// src/components/Header.js
"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-800">
          MedForces
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-600 hover:text-blue-600 transition duration-300">Home</Link>
          <Link href="/challenges" className="text-gray-600 hover:text-blue-600 transition duration-300">Challenges</Link>
          <Link href="/questions" className="text-gray-600 hover:text-blue-600 transition duration-300">Questions</Link>
          <Link href="/leaderboard" className="text-gray-600 hover:text-blue-600 transition duration-300">Leaderboard</Link>
          <Link href="/profile" className="text-gray-600 hover:text-blue-600 transition duration-300">Profile</Link>
        </div>

        {/* Login/Logout for Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/login" className="text-gray-600 hover:text-blue-600 font-semibold transition duration-300">Login</Link>
        </div>

        {/* Hamburger Menu Button for Mobile */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu (Conditional Rendering) */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Home</Link>
            <Link href="/challenges" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Challenges</Link>
            <Link href="/questions" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Questions</Link>
            <Link href="/leaderboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Leaderboard</Link>
            <Link href="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Profile</Link>
            <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Login</Link>
          </div>
        </div>
      )}
    </header>
  );
}