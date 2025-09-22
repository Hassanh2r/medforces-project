// src/app/articles/page.js
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';

// سيتم تحديث هذه الصفحة كل ساعة (3600 ثانية)
export const revalidate = 3600;

// هذه صفحة خادم (Server Component) لجلب البيانات بسرعة
export default async function ArticlesListPage() {
  const { data: articles, error } = await supabase
    .from('articles')
    .select('title, slug, created_at')
    .order('created_at', { ascending: false });

  if (error) console.error('Error fetching articles:', error);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-800">Learn</h1>
          <p className="mt-2 text-lg text-gray-600">Browse our collection of articles and explanations.</p>
        </div>


        <div className="max-w-4xl mx-auto space-y-6">
          {articles?.map((article) => (
            <Link 
              href={`/articles/${article.slug}`} 
              key={article.slug}
              className="block bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-2xl font-bold text-blue-800">{article.title}</h2>
              <p className="text-sm text-gray-500 mt-2">
                Published on: {new Date(article.created_at).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}