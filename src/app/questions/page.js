// src/app/questions/page.js
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';

export default async function QuestionsPage() {
  
  // جلب كل الأسئلة مع اسم التحدي المرتبط بها
  const { data: questions, error } = await supabase
    .from('questions')
    .select(`
      *,
      challenges (
        title
      )
    `);

  if (error) {
    console.error('Error fetching questions:', error);
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-800">Question Bank</h1>
          <p className="mt-2 text-lg text-gray-600">Browse all available questions.</p>
        </div>

        <div className="space-y-6 max-w-4xl mx-auto">
          {questions?.map((question, index) => (
            <div key={question.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="mb-4">
                <p className="text-sm font-semibold text-blue-600 mb-1">
                  From Challenge: {question.challenges.title}
                </p>
                <p className="text-lg font-medium text-gray-800">
                  {index + 1}. {question.question_text}
                </p>
              </div>
              <ul className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <li 
                    key={optionIndex}
                    className={`p-3 rounded-md text-sm ${
                      optionIndex === question.correct_answer_index 
                      ? 'bg-green-100 text-green-800 font-semibold border border-green-200' 
                      : 'bg-gray-50 text-gray-700'
                    }`}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}