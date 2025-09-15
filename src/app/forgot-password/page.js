"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`, // صفحة إعادة التعيين
    });

    if (error) {
      setMessage("❌ Error: " + error.message);
    } else {
      setMessage("✅ Check your email for reset link!");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Forgot Password</h1>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleForgotPassword}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
        {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
      </div>
    </div>
  );
}
