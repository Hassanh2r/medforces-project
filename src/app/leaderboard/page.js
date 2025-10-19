"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";

const getRankInfo = (rating) => {
  if (rating === null || rating === undefined) {
    return { title: "Unrated", color: "text-gray-500" };
  }
  if (rating >= 2400) return { title: "Grandmaster", color: "text-red-600" };
  if (rating >= 2100) return { title: "Master", color: "text-orange-500" };
  if (rating >= 1900) return { title: "Candidate Master", color: "text-purple-600" };
  if (rating >= 1600) return { title: "Expert", color: "text-blue-600" };
  if (rating >= 1400) return { title: "Specialist", color: "text-cyan-600" };
  if (rating >= 1200) return { title: "Pupil", color: "text-green-600" };
  return { title: "Newbie", color: "text-gray-500" };
};

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login"); // ⬅️ redirect لو مفيش مستخدم
        return;
      }

      // جيب سنة المستخدم
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("academic_year")
        .eq("id", user.id)
        .single();

    if (profileError) {
  console.error("Error fetching profile:", profileError);
  return;
      }

      const userYear = profile.academic_year;

      // جلب بيانات leaderboard
      const { data, error } = await supabase.rpc("get_professional_leaderboard");
      if (error) {
        console.error("Error fetching leaderboard:", error);
      } else {
        const filtered = (data || []).filter((u) => u.academic_year === userYear);

        // ترتيب وإضافة rank
        filtered.sort((a, b) => b.rating - a.rating);
        const ranked = filtered.map((u, i) => ({ ...u, rank: i + 1 }));

        setLeaderboard(ranked);
      }

      // Realtime listener
      const channel = supabase
        .channel("leaderboard-changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "contest_results" },
          (payload) => {
            setLeaderboard((prev) => {
              let updated = [...prev];
              const newUser = payload.new;

              // تجاهل لو مش نفس السنة
              if (newUser.academic_year !== userYear) return prev;

              if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
                const idx = updated.findIndex((u) => u.user_id === newUser.user_id);
                if (idx !== -1) {
                  updated[idx] = { ...updated[idx], rating: newUser.rating };
                } else {
                  updated.push(newUser);
                }
              } else if (payload.eventType === "DELETE") {
                updated = updated.filter((u) => u.user_id !== payload.old.user_id);
              }

              updated.sort((a, b) => b.rating - a.rating);
              updated = updated.map((u, i) => ({ ...u, rank: i + 1 }));

              return updated;
            });
          }
        )
        .subscribe();

      setLoading(false);

      return () => {
        supabase.removeChannel(channel);
      };
    };

    checkAuthAndFetch();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Official Rankings</h1>
          <p className="mt-3 text-lg text-gray-600">
            See the official ratings of all MedForces competitors (filtered by your year).
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
          <table className="min-w-full text-left">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-center">#</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-center">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaderboard.map((user) => {
                const rankInfo = getRankInfo(user.rating);
                let rankClass = "";
                if (user.rank === 1) rankClass = "bg-yellow-100/50";
                if (user.rank === 2) rankClass = "bg-gray-200/50";
                if (user.rank === 3) rankClass = "bg-orange-200/50";

                return (
                  <tr key={user.user_id} className={`${rankClass} hover:bg-blue-50`}>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-lg text-gray-700">{user.rank}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-lg">
                        <span className={rankInfo.color}>{user.full_name}</span>
                      </div>
                      <div className="text-sm text-gray-500">{rankInfo.title}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-bold text-xl ${rankInfo.color}`}>{user.rating}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
}
