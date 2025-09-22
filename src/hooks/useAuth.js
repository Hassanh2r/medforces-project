// src/hooks/useAuth.js
"use in client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start in a loading state
  const router = useRouter();

  useEffect(() => {
    // Check for user on initial mount
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      // We set loading to false here ONLY if there is no user,
      // otherwise we wait for onAuthStateChange to provide the final confirmed user state.
      if (!user) {
        setLoading(false);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        setLoading(false);
      }
    );

    // Cleanup the subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Effect to handle redirection
  useEffect(() => {
    // Only redirect if loading is finished AND there is no user.
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  return { user, loading };
}