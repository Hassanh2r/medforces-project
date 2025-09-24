// src/app/articles/[slug]/page.js
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';

export const runtime = 'edge';

// دالة بسيطة لاكتشاف اللغة (عربي / إنجليزي) بناءً على الحروف
function detectDirection(text) {
  const arabicRegex = /[\u0600-\u06FF]/; // رينج الحروف العربية
  return arabicRegex.test(text) ? "rtl" : "ltr";
}

export default async function ArticlePage({ params }) {
  const { slug } = params;

  const { data: article, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) console.error("Error fetching article:", error);
  if (!article) return <div>Article not found.</div>;

  // تحديد الاتجاه من عنوان المقال أو المحتوى
  const dir = detectDirection(article.title || article.content || "");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50" dir={dir}>
      <Header />
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-xl">
          
          {/* صورة غلاف المقال */}
          {article.cover_image && (
            <div className="mb-8">
              <img
                src={article.cover_image}
                alt={article.title}
                className="w-full h-64 object-cover rounded-xl shadow-md"
              />
            </div>
          )}

          {/* محتوى المقال */}
          <article
            dir={dir}
            className={`prose prose-lg lg:prose-xl max-w-none prose-headings:font-extrabold prose-p:leading-loose prose-p:text-gray-700 ${
              dir === "rtl" ? "text-right" : "text-left"
            }`}
          >
            {/* العنوان */}
            <h1
              className={`text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-snug ${
                dir === "rtl" ? "text-right" : "text-left"
              }`}
            >
              {article.title}
            </h1>

            {/* التاريخ */}
            <p
              className={`text-sm md:text-base text-gray-500 mb-10 ${
                dir === "rtl"
                  ? "text-right border-r-4 border-blue-500 pr-3"
                  : "text-left border-l-4 border-blue-500 pl-3"
              }`}
            >
              ✍️ Published on{" "}
              {new Date(article.created_at).toLocaleDateString(
                dir === "rtl" ? "ar-EG" : "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </p>

            {/* النص */}
            <div
              className={`text-lg md:text-xl leading-relaxed text-gray-800 whitespace-pre-line tracking-wide ${
                dir === "rtl" ? "text-right" : "text-left"
              }`}
            >
              {article.content}
            </div>
          </article>

          {/* ختام */}
          <div className="mt-12 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm md:text-base">
              {dir === "rtl"
                ? "هل أعجبك الشرح؟ شارك الموقع مع زملائك ليستفيدوا 👩‍⚕️👨‍⚕️"
                : "Did you like the article? Share it with your colleagues 👩‍⚕️👨‍⚕️"}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
