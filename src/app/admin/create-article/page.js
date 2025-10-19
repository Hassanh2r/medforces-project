// src/app/admin/create-article/page.js
"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import useAuth from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// مكون فرعي لكل مكعب محتوى
const ContentBlockEditor = ({ block, index, updateBlock, removeBlock }) => {
  const handleInputChange = (field, value) => {
    updateBlock(index, field, value);
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50 relative">
      <button onClick={() => removeBlock(index)} className="absolute top-2 right-2 text-red-500 font-bold">X</button>
      <p className="font-semibold capitalize mb-2">{block.block_type}</p>
      
      {block.block_type === 'heading' && <input type="text" placeholder="Heading Text" value={block.content || ''} onChange={(e) => handleInputChange('content', e.target.value)} className="w-full p-2 border rounded"/>}
      {block.block_type === 'paragraph' && <textarea placeholder="Paragraph Text" value={block.content || ''} onChange={(e) => handleInputChange('content', e.target.value)} className="w-full p-2 border rounded" rows="4"/>}
      {block.block_type === 'high-yield' && <textarea placeholder="High-Yield Point" value={block.content || ''} onChange={(e) => handleInputChange('content', e.target.value)} className="w-full p-2 border rounded bg-yellow-50"/>}
      {block.block_type === 'image' && <input type="text" placeholder="Image URL" value={block.image_url || ''} onChange={(e) => handleInputChange('image_url', e.target.value)} className="w-full p-2 border rounded"/>}
      {block.block_type === 'mcq' && (
        <div className="space-y-2">
          <textarea placeholder="Question Text" value={block.quiz_question || ''} onChange={(e) => handleInputChange('quiz_question', e.target.value)} className="w-full p-2 border rounded"/>
          <input type="text" placeholder='Options (JSON format, e.g., ["A", "B", "C"])' value={JSON.stringify(block.quiz_options || [])} onChange={(e) => handleInputChange('quiz_options', JSON.parse(e.target.value))} className="w-full p-2 border rounded"/>
          <input type="number" placeholder="Correct Index (0, 1, 2...)" value={block.quiz_correct_answer_index || ''} onChange={(e) => handleInputChange('quiz_correct_answer_index', parseInt(e.target.value))} className="w-full p-2 border rounded"/>
          <textarea placeholder="Explanation" value={block.quiz_explanation || ''} onChange={(e) => handleInputChange('quiz_explanation', e.target.value)} className="w-full p-2 border rounded"/>
        </div>
      )}
    </div>
  );
};


export default function CreateArticlePage() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(true); // Assume admin for now

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [language, setLanguage] = useState('ar');
  const [blocks, setBlocks] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const addBlock = (type) => {
    setBlocks([...blocks, { block_type: type }]);
  };

  const updateBlock = (index, field, value) => {
    const newBlocks = [...blocks];
    newBlocks[index][field] = value;
    setBlocks(newBlocks);
  };

  const removeBlock = (index) => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    setBlocks(newBlocks);
  };

  const handleSaveArticle = async () => {
    setIsSubmitting(true);
    setMessage('');

try {
      await supabase.auth.refreshSession();
    } catch (refreshError) {
      setMessage('Error refreshing session: ' + refreshError.message);
      setIsSubmitting(false);
      return;
    }

    const { data, error } = await supabase.rpc('create_full_article', {
        article_title: title,
        article_slug: slug,
        cover_image_url: coverImage,
        article_language: language,
        content_blocks: blocks
    });

    if(error){
        setMessage('Error saving article: ' + error.message);
    } else {
        setMessage(`Article created successfully with ID: ${data}`);
        // Reset form
        setTitle(''); setSlug(''); setCoverImage(''); setBlocks([]);
    }
    setIsSubmitting(false);
  };
  
  if (authLoading) return <p>Loading...</p>;
  if (!isAdmin) return <p>Access Denied.</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">Create New Interactive Article</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
          {/* Article Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Article Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded"/>
            <input type="text" placeholder="Article Slug (e.g., intro-to-ecg)" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full p-2 border rounded"/>
            <input type="text" placeholder="Cover Image URL (Optional)" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className="w-full p-2 border rounded"/>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full p-2 border rounded">
                <option value="ar">Arabic (RTL)</option>
                <option value="en">English (LTR)</option>
            </select>
          </div>
          
          <hr/>

          {/* Content Blocks */}
          <h2 className="text-2xl font-semibold">Content Blocks</h2>
          <div className="space-y-4">
            {blocks.map((block, index) => (
              <ContentBlockEditor key={index} index={index} block={block} updateBlock={updateBlock} removeBlock={removeBlock} />
            ))}
          </div>

          {/* Add Block Buttons */}
          <div className="flex flex-wrap gap-2">
            <button onClick={() => addBlock('heading')} className="px-3 py-1 bg-gray-200 rounded text-sm">Add Heading</button>
            <button onClick={() => addBlock('paragraph')} className="px-3 py-1 bg-gray-200 rounded text-sm">Add Paragraph</button>
            <button onClick={() => addBlock('high-yield')} className="px-3 py-1 bg-yellow-200 rounded text-sm">Add High-Yield</button>
            <button onClick={() => addBlock('image')} className="px-3 py-1 bg-gray-200 rounded text-sm">Add Image</button>
            <button onClick={() => addBlock('mcq')} className="px-3 py-1 bg-blue-200 rounded text-sm">Add MCQ</button>
          </div>
          
          <hr/>

          {/* Save Button */}
          <div className="text-center">
            <button onClick={handleSaveArticle} disabled={isSubmitting} className="px-10 py-3 bg-green-600 text-white font-bold text-lg rounded-lg shadow-md hover:bg-green-700">
                {isSubmitting ? 'Saving...' : 'Save Full Article'}
            </button>
          </div>
          
          {message && <p className="text-center mt-4 font-semibold">{message}</p>}
        </div>
      </main>
      <Footer />
    </div>
  );
}