// src/app/signup/page.js
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient'; // استيراد العميل للتواصل مع Supabase

export default function SignupPage() {
  // استخدام الحالة لتخزين مدخلات المستخدم
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState(''); // لعرض رسائل النجاح أو الخطأ

  // دالة يتم استدعاؤها عند إرسال النموذج
  const handleSignUp = async (event) => {
    event.preventDefault(); // منع إعادة تحميل الصفحة
    setMessage(''); // مسح أي رسالة قديمة

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        // يمكننا هنا إضافة بيانات إضافية للمستخدم مثل الاسم
        data: {
          full_name: fullName,
        }
      }
    });

    if (error) {
      // في حالة وجود خطأ، قم بعرضه
      setMessage(`Error: ${error.message}`);
    } else if (data.user) {
      // في حالة النجاح
      setMessage('Account created successfully! Please check your email to verify.');
      // إفراغ الحقول بعد النجاح
      setEmail('');
      setPassword('');
      setFullName('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-xl">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Create a New Account
          </h1>
          <p className="mt-2 text-gray-600">
            Join the MedForces community today!
          </p>
        </div>
        
        {/* ربط النموذج بدالة handleSignUp */}
        <form className="space-y-6" onSubmit={handleSignUp}>
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="mt-1">
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={fullName} // ربط القيمة بالحالة
                onChange={(e) => setFullName(e.target.value)} // تحديث الحالة عند الكتابة
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
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
              Sign Up
            </button>
          </div>
        </form>

        {/* عرض رسالة الحالة هنا */}
        {message && (
          <p className="text-center text-sm text-green-600 bg-green-50 p-3 rounded-md border border-green-200">
            {message}
          </p>
        )}

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}