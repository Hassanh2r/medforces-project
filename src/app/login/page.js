// src/app/login/page.js
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // لاستخدامه في توجيه المستخدم
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter(); // تهيئة الـ router
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      // في حالة نجاح تسجيل الدخول، قم بتوجيه المستخدم للصفحة الرئيسية
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-xl">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Login to MedForces
          </h1>
          <p className="mt-2 text-gray-600">
            Welcome back, future clinician!
          </p>
        </div>
        
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Login
            </button>
          </div>
        </form>

        {/* عرض رسائل الخطأ فقط */}
        {message && (
          <p className="text-center text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
            {message}
          </p>
        )}

        <p className="text-center text-sm text-gray-600">
         <p>Don&apos;t have an account?{' '}</p>
          <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}