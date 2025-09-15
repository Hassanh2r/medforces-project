"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ConfirmEmailPage() {
  const router = useRouter();

  useEffect(() => {
    const handleConfirmation = async () => {
      // Supabase automatically exchanges the token from the URL
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error confirming email:", error.message);
      }

      // بعد ثواني نرجعه ع صفحة login
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    };

    handleConfirmation();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-green-600">
          ✅ Email confirmed successfully!
        </h1>
        <p className="mt-2 text-gray-600">
          Redirecting you to login...
        </p>
      </div>
    </div>
  );
}
