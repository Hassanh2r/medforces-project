// src/app/confirm-email/confirm-email-form.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ConfirmEmailForm() {
  const [message, setMessage] = useState("Confirming your email...");
  const router = useRouter();

  useEffect(() => {
    // Supabase بيعمل auto-session لو فيه token في URL
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        setMessage("❌ Invalid or expired confirmation link.");
      } else if (data?.session) {
        setMessage("✅ Email confirmed successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setMessage("⚠️ Something went wrong. Please try again.");
      }
    });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Email Confirmation
        </h1>
        <p
          className={`text-sm p-3 rounded-md border ${
            message.startsWith("✅")
              ? "text-green-700 bg-green-50 border-green-200"
              : message.startsWith("❌")
              ? "text-red-700 bg-red-50 border-red-200"
              : "text-blue-700 bg-blue-50 border-blue-200"
          }`}
        >
          {message}
        </p>
      </div>
    </div>
  );
}
