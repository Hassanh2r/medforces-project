// src/app/articles/[slug]/page.js
"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';
import useAuth from '@/hooks/useAuth';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// مكون مخصص لعرض كل نوع من أنواع المحتوى
const ContentBlock = ({ block, onAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSelectAnswer = (index) => {
    setSelectedAnswer(index);
    setShowFeedback(true);
    onAnswer(block.id, index); // إرسال الإجابة للمكون الأب
  };

  switch (block.block_type) {
    case 'heading':
      return <h2 className="text-3xl font-bold mt-8 mb-4">{block.content}</h2>;
    case 'paragraph':
      return (
  <div className="text-lg leading-relaxed mb-4 prose prose-blue max-w-none">
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {block.content}
    </ReactMarkdown>
  </div>
);

    case 'image':
      return <img src={block.image_url} alt="Article illustration" className="my-6 rounded-lg shadow-md" />;
    case 'high-yield':
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 my-6 rounded-r-lg">
      <p className="font-bold">High-Yield Point!</p>
      <div><ReactMarkdown>{block.content}</ReactMarkdown></div>
    </div>
  );
    case 'mcq':
      const isCorrect = selectedAnswer === block.quiz_correct_answer_index;
      return (
        <div className="my-8 p-6 border-2 border-blue-200 rounded-lg bg-blue-50/50">
          <h4 className="font-bold text-lg mb-4">{block.quiz_question}</h4>
          <div className="space-y-3">
            {block.quiz_options.map((option, index) => (
              <button 
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={showFeedback}
                className={`w-full text-left p-3 rounded-md border transition-all 
                  ${showFeedback && index === block.quiz_correct_answer_index ? 'bg-green-200 border-green-400' : ''}
                  ${showFeedback && selectedAnswer === index && !isCorrect ? 'bg-red-200 border-red-400' : ''}
                  ${!showFeedback ? 'bg-white hover:bg-gray-100 border-gray-300' : ''}`}
              >
                {option}
              </button>
            ))}
          </div>
          {showFeedback && (
            <div className="mt-4 text-sm text-gray-700">
              <p className="font-semibold">Explanation:</p>
              <p>{block.quiz_explanation}</p>
            </div>
          )}
        </div>
      );
    default:
      return null;
  }
};

export default function ArticlePage({ params }) {
  const { user, loading: authLoading } = useAuth();
  const [article, setArticle] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchArticle = async () => {
        // جلب معلومات المقال وكل مكعبات المحتوى الخاصة به مرة واحدة
        const { data, error } = await supabase
          .from('articles')
          .select(`*, article_content_blocks (*)`)
          .eq('slug', params.slug)
          .single();
        
        if (data) {
          setArticle(data);
          // ترتيب مكعبات المحتوى
          data.article_content_blocks.sort((a, b) => a.block_order - b.block_order);
          setBlocks(data.article_content_blocks);
        }
        setLoading(false);
      };
      fetchArticle();
    }
  }, [user, params.slug]);
  
  if (authLoading || loading) {
    return <div>Loading article...</div>;
  }
  
  if (!article) return <div>Article Not Found</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-lg">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">{article.title}</h1>
          <p className="text-gray-500 mb-8">Published on: {new Date(article.created_at).toLocaleDateString()}</p>
          {article.cover_image && <img src={article.cover_image} alt={article.title} className="w-full mb-8 rounded-lg shadow-md"/>}
          
          {/* عرض كل مكعبات المحتوى بالترتيب */}
          <div>
            {blocks.map(block => (
              <ContentBlock key={block.id} block={block} onAnswer={(blockId, answerIndex) => {
                // يمكنك هنا إضافة منطق لتسجيل إجابة المستخدم
                console.log(`User answered question in block ${blockId} with option ${answerIndex}`);
              }}/>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}