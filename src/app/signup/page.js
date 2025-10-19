// src/app/signup/page.js
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  // --- متغيرات الحالة الجديدة ---
  const [university, setUniversity] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  // -------------------------
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const universityList = [
"South Valley University",
"South Valley National University",
"Cairo University",
"Alexandria University",
"Mansoura University",
"Assiut University",
"Aswan University",
"Ain Shams University",
"Zagazig University",
"Suez Canal University",
"Tanta University",
"Benha University",
"Al-Fayoum University",
"Beni Suef University",
"Sohag University",
"Helwan University",
"Misr University for Science and Technology",
"October 6 University",
"New Giza University",
"Delta University for Science and Technology",
"King Salman International University",
"New Mansoura University",
"Galala University",
"Horús University",
"Nahda University in Beni Suef",
"Modern University for Technology and Information (MTI)",
"Other"
];
  const yearList = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "1nd Intern", "2nd Intern"];

  const handleSignUp = async (event) => {
    event.preventDefault();
    setMessage('');
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
            full_name: fullName,
            university: university, // <<-- إرسال البيانات الجديدة
            academic_year: academicYear
        },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });
    
    setLoading(false);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("✅ Account created! Please check your email to confirm before logging in.");
      // ... clear form fields ...
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-xl">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Create a New Account
          </h1>
          <p className="mt-2 text-gray-700">
            Join the MedForces community today!
          </p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSignUp}>
          {/* Full Name Input */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-900">Full Name</label>
            <div className="mt-1">
              <input id="fullName" name="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full px-3 py-2 border rounded-md"/>
            </div>
          </div>

          {/* ===== الحقول الجديدة ===== */}
          <div>
            <label htmlFor="university" className="block text-sm font-medium text-gray-900">University</label>
            <div className="mt-1">
              <select id="university" value={university} onChange={(e) => setUniversity(e.target.value)} required className="w-full px-3 py-2 border rounded-md">
                <option value="" disabled>Select your university</option>
                {universityList.map(uni => <option key={uni} value={uni}>{uni}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="academicYear" className="block text-sm font-medium text-gray-900">Academic Year</label>
            <div className="mt-1">
              <select id="academicYear" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} required className="w-full px-3 py-2 border rounded-md">
                <option value="" disabled>Select your year</option>
                {yearList.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            </div>
          </div>
          {/* ======================= */}
          
          {/* Email and Password Inputs */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">Email address</label>
            <div className="mt-1">
              <input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded-md"/>
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-800">Password</label>
            <div className="mt-1">
              <input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 border rounded-md"/>
            </div>
          </div>
          
          <div>
            <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </div>
        </form>

        {message && (
          <p className={`text-center text-sm p-3 rounded-md border ${message.startsWith("Error") ? "text-red-600 bg-red-50 border-red-200" : "text-green-600 bg-green-50 border-green-200"}`}>
            {message}
          </p>
        )}

        <p className="text-center text-sm text-gray-700">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}