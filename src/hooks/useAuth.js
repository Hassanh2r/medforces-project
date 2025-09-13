// src/hooks/useAuth.js
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        // إذا لم يكن هناك مستخدم، قم بإعادة التوجيه
        router.push('/login');
      }
      setLoading(false);
    };

    checkUser();
  }, [router]);

  return { user, loading };
}