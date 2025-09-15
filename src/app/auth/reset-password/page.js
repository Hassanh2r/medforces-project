// src/app/reset-password/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // لما يفتح الصفحة، Supabase بيعمل auto-session من الـ token
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("access_token")) {
      supabase.auth.getSession().then(({ data, error }) => {
        if (error) {
          setMessage("Invalid or expired reset link.");
        }
      });
    }
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Password updated successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-xl">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Reset Your Password
        </h1>

        <form className="space-y-6" onSubmit={handleUpdatePassword}>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900"
            >
              New Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        {message && (
          <p className="text-center text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
