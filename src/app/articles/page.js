// src/app/articles/page.js
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import ArticlesList from "./ArticlesList"; // ✨ component للبحث + العرض

export const runtime = "edge";
export const revalidate = 0;

export default async function ArticlesListPage() {
  const { data: articles, error } = await supabase
    .from("articles")
    .select("title, slug, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching articles:", error);
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
            📚 Articles & Learning
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our curated collection of articles and explanations, crafted
            to help you learn effectively and stay inspired.
          </p>
        </div>

        {/* Articles with Search */}
        <ArticlesList articles={articles || []} />
      </main>
      <Footer />
    </div>
  );
}
