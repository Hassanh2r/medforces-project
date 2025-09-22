// src/utils/supabaseServer.js
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// ✅ Wrapper لإنشاء client من جوه Server Component
export async function getSupabaseServerClient() {
  // لازم await cookies() مع App Router
  const cookieStore = await cookies();

  // إنشاء Supabase client مربوط بالكوكيز
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  return supabase;
}
