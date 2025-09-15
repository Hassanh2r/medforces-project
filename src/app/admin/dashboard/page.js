// src/app/admin/dashboard/page.js
"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import useAuth from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Papa from 'papaparse';

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      const checkAdminRole = async () => {
        const { data } = await supabase.rpc('get_my_role');
        if (data === 'admin') {
          setIsAdmin(true);
        }
      };
      checkAdminRole();
    }
  }, [user]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setParsedData([]);
  };

  const handlePreview = () => {
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setParsedData(results.data);
        setMessage(`${results.data.length} questions ready for review.`);
      },
    });
  };

  const handleSaveAll = async () => {
    if (parsedData.length === 0) return;
    setUploading(true);

    const questionsToInsert = parsedData.map(row => {
      let optionsArray;

      try {
        // جرّب تعمل parse كـ JSON
        optionsArray = JSON.parse(row.options);
        if (!Array.isArray(optionsArray)) {
          throw new Error("Not an array");
        }
      } catch (e) {
        // fallback: split by comma
        optionsArray = row.options
          ? row.options.split(",").map(opt => opt.trim())
          : [];
      }

      return {
        question_text: row.question_text,
        options: optionsArray,
        correct_answer_index: parseInt(row.correct_answer_index, 10),
        explanation: row.explanation,
        lecture_id: parseInt(row.lecture_id, 10)
      };
    });

    const { error } = await supabase.from('questions').insert(questionsToInsert);
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage(`Successfully saved ${questionsToInsert.length} questions to the database!`);
      setParsedData([]);
      setFile(null);
    }
    setUploading(false);
  };

  if (authLoading) return <p>Loading & Verifying Access...</p>;
  if (!isAdmin) return <p>Access Denied. You must be an administrator to view this page.</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
        <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Bulk Question Upload</h2>
            <p className="mb-4 text-gray-600">Step 1: Choose a CSV file. Step 2: Preview the data. Step 3: Save to database.</p>
            <div className="flex items-center gap-4">
              <input 
                type="file" 
                accept=".csv"
                key={file ? 'file-reset' : 'file-input'}
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <button 
                onClick={handlePreview} 
                disabled={!file}
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-400"
              >
                Preview
              </button>
            </div>
          </div>
          
          {message && <p className="text-center font-semibold text-green-700">{message}</p>}

          {parsedData.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Data Preview</h3>
              <div className="overflow-x-auto max-h-96">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      {Object.keys(parsedData[0]).map(key => <th key={key} className="p-2">{key}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {parsedData.map((row, i) => (
                      <tr key={i}>
                        {Object.values(row).map((val, j) => <td key={j} className="p-2 whitespace-nowrap">{val}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-center mt-6">
                <button 
                  onClick={handleSaveAll} 
                  disabled={uploading}
                  className="px-10 py-3 bg-green-600 text-white font-bold text-lg rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400"
                >
                  {uploading ? 'Saving...' : 'Save All to Database'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
