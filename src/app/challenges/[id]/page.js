// src/app/challenges/[id]/page.js

"use client";
export const runtime = 'edge';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';

const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

export default function ContestPage({ params }) {
  const resolvedParams = use(params);
  
  const [loading, setLoading] = useState(true);
  const [challenge, setChallenge] = useState(null);
  const [user, setUser] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [contestState, setContestState] = useState('Loading');
  const [hasCompleted, setHasCompleted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizManuallyFinished, setQuizManuallyFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState(null); // <<-- التعديل الأول: إضافة متغير حالة جديد

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        const { data: challengeData, error: challengeError } = await supabase
          .from('challenges')
          .select(`*, contest_questions(questions(*))`)
          .eq('id', resolvedParams.id)
          .single();

        if (challengeError) throw challengeError;
        
        if (challengeData) {
          const contestQuestions = (challengeData.contest_questions || [])
            .map(cq => cq.questions)
            .filter(Boolean);
          
          setChallenge(challengeData);

          if (user) {
            const { data: existingResult } = await supabase
              .from('quiz_results').select('score').eq('user_id', user.id).eq('challenge_id', challengeData.id).maybeSingle();
            if (existingResult) {
              setHasCompleted(true);
              setScore(existingResult.score);
            }
          }
          
          const shuffledQuestions = shuffleArray(contestQuestions);
          const questionsWithShuffledOptions = shuffledQuestions.map(q => {
              const options = [...q.options];
              const correctAnswerText = options[q.correct_answer_index];
              const shuffledOptions = shuffleArray(options);
              const newCorrectIndex = shuffledOptions.findIndex(opt => opt === correctAnswerText);
              return { ...q, options: shuffledOptions, correct_answer_index: newCorrectIndex };
          });
          setQuestions(questionsWithShuffledOptions);

          if (user) {
            const { data: registrationData } = await supabase
              .from('contest_registrations').select('*').eq('user_id', user.id).eq('challenge_id', challengeData.id).single();
            if (registrationData) setIsRegistered(true);
          }
        }
      } catch (error) {
        console.error("Failed to fetch contest data:", error);
      } finally {
        setLoading(false);
      }
    };
    if(resolvedParams.id) fetchData();
  }, [resolvedParams.id]);

  useEffect(() => {
    if (!challenge) return;
    const interval = setInterval(() => {
      if (quizManuallyFinished || hasCompleted) {
        setContestState('Finished');
        setTimeRemaining('Contest Ended');
        clearInterval(interval);
        return;
      }
      const now = new Date();
      const startTime = new Date(challenge.start_time);
      const endTime = new Date(challenge.end_time);
      if (now < startTime) {
        setContestState('Lobby');
        const diff = startTime.getTime() - now.getTime();
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setTimeRemaining(`${d}d ${h}h ${m}m ${s}s`);
      } else if (now >= startTime && now < endTime) {
        setContestState('Running');
        const diff = endTime.getTime() - now.getTime();
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setTimeRemaining(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
      } else {
        setContestState('Finished');
        setTimeRemaining('Contest Ended');
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [challenge, quizManuallyFinished, hasCompleted]); 

  // <<-- التعديل الثاني: هذا التأثير الجديد يسجل وقت بدء الاختبار -->>
  useEffect(() => {
    if (contestState === 'Running' && !quizStartTime) {
      setQuizStartTime(Date.now());
    }
  }, [contestState, quizStartTime]);
  
  // <<-- التعديل الثالث: تحديث دالة `handleNextQuestion` بالكامل -->>
  const handleNextQuestion = async () => {
    if (selectedAnswer === null) return;
    const isCorrect = selectedAnswer === questions[currentQuestionIndex].correct_answer_index;
    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex < questions.length) {
      if (isCorrect) { 
        setScore(prevScore => prevScore + 1); 
      }
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(null);
    } else {
      if (isSubmitting) return; 
      setIsSubmitting(true);
      
      const finalScore = isCorrect ? score + 1 : score;
      setScore(finalScore);
      
      // حساب الوقت المستغرق بالثواني
      const endTime = Date.now();
      const totalTimeSeconds = quizStartTime ? Math.round((endTime - quizStartTime) / 1000) : 0;

      if (user) {
        // حفظ النتيجة مع الوقت المستغرق
        await supabase.from('quiz_results').insert([{
          user_id: user.id,
          challenge_id: challenge.id,
          score: finalScore,
          total_time_seconds: totalTimeSeconds 
        }]);
      }
      setQuizManuallyFinished(true);
    }
  };

  const handleRegister = async () => {
    if (!user) { alert('Please login to register.'); return; }
    const { error } = await supabase.from('contest_registrations').insert({ user_id: user.id, challenge_id: challenge.id });
    if (error) { alert('Error registering: ' + error.message); } else { setIsRegistered(true); }
  };
  
  const QuizInterface = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) {
      if (questions.length > 0 && currentQuestionIndex >= questions.length) {
        return <p className="text-center text-gray-800">Calculating final score...</p>;
      }
      return <p className="text-center text-gray-800">No questions available for this contest.</p>;
    }
    return (
      <div>
        <p className="text-lg font-medium text-gray-900 mb-6">
          {currentQuestionIndex + 1}. {currentQuestion.question_text}
        </p>
        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <button 
              key={index} 
              onClick={() => setSelectedAnswer(index)} 
              className={`w-full text-left p-4 rounded-lg border-2 text-gray-800 ${selectedAnswer === index ? 'border-blue-500 bg-blue-50' : 'bg-white hover:border-blue-400'}`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleNextQuestion} 
            disabled={selectedAnswer === null} 
            className="px-8 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish Contest' : 'Submit & Next'}
          </button>
        </div>
      </div>
    );
  };
  
  const renderContent = () => {
    if (loading) return <p className="text-center animate-pulse text-gray-800">Loading Contest...</p>;
    if (!challenge) return <p className="text-center text-gray-800">Contest not found.</p>;

    if (hasCompleted) {
        return (
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">Contest Already Completed</h1>
                <p className="mt-4 text-lg text-gray-800">You have already participated in this contest.</p>
                <div className="mt-6 bg-blue-50 p-6 rounded-lg">
                    <p className="text-lg font-semibold text-blue-800">Your Score:</p>
                    <p className="text-4xl font-bold text-green-600">{score} / {questions.length}</p>
                </div>
                <Link href="/leaderboard" className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">
                    View Leaderboard
                </Link>
            </div>
        );
    }

    switch (contestState) {
      case 'Lobby':
        return (
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-blue-800 mb-4">{challenge.title}</h1>
            <p className="text-lg text-gray-800 mb-6">{challenge.description}</p>
            <div className="bg-blue-100 text-blue-800 p-6 rounded-xl mb-8">
              <p className="text-lg font-semibold">Contest Starts In:</p>
              <p className="text-4xl font-bold tracking-widest">{timeRemaining}</p>
            </div>
            {isRegistered 
              ? <p className="px-10 py-3 bg-green-200 text-green-800 font-bold text-xl rounded-lg">You are Registered!</p> 
              : <button onClick={handleRegister} className="px-10 py-3 bg-green-600 text-white font-bold text-xl rounded-lg shadow-md hover:bg-green-700">Register Now</button>}
          </div>
        );
      case 'Running':
        return (
          <div className="text-left">
            <div className="text-center mb-8 border-b pb-4">
              <p className="font-semibold text-gray-800">Time Remaining:</p>
              <p className="text-4xl font-bold tracking-widest text-red-600">{timeRemaining}</p>
            </div>
            {isRegistered 
              ? <QuizInterface /> 
              : ( <div className="text-center p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">The Contest is Running!</h2>
                    <p className="text-red-600 font-semibold mb-6">You must register to participate.</p>
                    <button onClick={handleRegister} className="px-10 py-3 bg-green-600 text-white font-bold text-xl rounded-lg shadow-md hover:bg-green-700">Register & Join Now</button>
                  </div> )}
          </div>
        );
      case 'Finished':
        return (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">Contest Finished</h1>
            <p className="mt-4 text-xl text-gray-800">
              Your final score: <span className="font-bold text-green-600">{score}</span> / {questions.length}
            </p>
            <p className="mt-4 text-gray-800">
              Check the <Link href="/leaderboard" className="text-blue-600 font-bold hover:underline">Leaderboard</Link> for final standings.
            </p>
          </div>
        );
      default:
        return <p className="text-center animate-pulse text-gray-800">Calculating contest status...</p>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto text-gray-800">
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
}