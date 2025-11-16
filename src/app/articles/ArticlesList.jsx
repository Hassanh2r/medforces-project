// src/app/articles/ArticlesList.jsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ArticlesList({ articles, moduleFilter }) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const modules = ["CNS", "Endocrine", "Reproductive", "CVS", "Renal"];

  const filteredArticles = useMemo(() => {
    return articles.filter((a) =>
      a.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [articles, search]);

  const handleFilterChange = (e) => {
    const value = e.target.value;

    if (value === "all") {
      router.push("/articles");
    } else {
      router.push(`/articles?module=${value}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">

      {/* Module Filter */}
      <div className="mb-6 flex justify-end">
        <select
          className="border rounded-xl p-2 text-gray-700 bg-white shadow-sm"
          onChange={handleFilterChange}
          defaultValue={moduleFilter || "all"}
        >
          <option value="all">All Modules</option>
          {modules.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Search Bar */}
      <div className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="🔍 Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-2/3 lg:w-1/2 px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Articles Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.map((article) => (
          <Link
            href={`/articles/${article.slug}`}
            key={article.slug}
            className="group block bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="p-6 flex flex-col h-full">
              <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
                {article.title}
              </h2>

              <p className="mt-4 text-sm text-gray-500">
                {new Date(article.created_at).toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>

              <div className="mt-auto pt-4">
                <span className="inline-flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-800">
                  Read more →
                </span>
              </div>
            </div>
          </Link>
        ))}

        {/* حالة لو مفيش نتائج */}
        {filteredArticles.length === 0 && (
          <div className="col-span-full text-center text-gray-500 text-lg">
            No articles match your search.
          </div>
        )}
      </div>
    </div>
  );
}
