"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 text-green-600">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 text-red-600">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

export default function PracticePage() {
  const [user, setUser] = useState(null);
  const [modules, setModules] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [questionLimit, setQuestionLimit] = useState('all');
  const [quizMode, setQuizMode] = useState('study');
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      const { data: modulesData } = await supabase.from('modules').select('*').order('name');
      setModules(modulesData || []);
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!selectedModule) {
      setSubjects([]);
      setLectures([]);
      return;
    }
    const fetchSubjects = async () => {
      const { data } = await supabase.from('subjects').select('*').eq('module_id', selectedModule.id).order('name');
      setSubjects(data || []);
    };
    fetchSubjects();
    setSelectedSubject(null);
    setSelectedLecture(null);
  }, [selectedModule]);

  useEffect(() => {
    if (!selectedSubject) {
      setLectures([]);
      return;
    }
    const fetchLectures = async () => {
      const { data } = await supabase.from('lectures').select('*').eq('subject_id', selectedSubject.id).order('name');
      setLectures(data || []);
    };
    fetchLectures();
    setSelectedLecture(null);
  }, [selectedSubject]);

  const recordPerformance = async (questionId, isCorrect) => {
    if (!user) return;
    await supabase.from('user_question_performance').insert([{ user_id: user.id, question_id: questionId, is_correct: isCorrect }]);
  };

  const handleStartWeaknessPractice = async () => {
    if (!user) return;
    setIsLoading(true);
    const { data, error } = await supabase.rpc('get_weakness_questions', { p_user_id: user.id });
    if (error) {
      console.error("Error fetching weakness questions:", error);
      setIsLoading(false);
      return;
    }

    if (!data || data.length === 0) {
      alert("Congratulations! You have no incorrect answers to practice.");
      setIsLoading(false);
      return;
    }

    const shuffledQuestions = shuffleArray(data || []);
    const questionsWithShuffledOptions = shuffledQuestions.map(q => {
      const options = [...q.options];
      const correctAnswerText = options[q.correct_answer_index];
      const shuffledOptions = shuffleArray(options);
      const newCorrectIndex = shuffledOptions.findIndex(opt => opt === correctAnswerText);
      return { ...q, options: shuffledOptions, correct_answer_index: newCorrectIndex };
    });
    setQuestions(questionsWithShuffledOptions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setQuizCompleted(false);
    setUserAnswers([]);
    setQuizActive(true);
    setIsLoading(false);
  };

  const handleStartPractice = async () => {
    if (!selectedLecture) return;
    setIsLoading(true);
    const { data } = await supabase.from('questions').select('*').eq('lecture_id', selectedLecture.id);
    const shuffledQuestions = shuffleArray(data || []);
    const questionsWithShuffledOptions = shuffledQuestions.map(q => {
      const options = [...q.options];
      const correctAnswerText = options[q.correct_answer_index];
      const shuffledOptions = shuffleArray(options);
      const newCorrectIndex = shuffledOptions.findIndex(opt => opt === correctAnswerText);
      return { ...q, options: shuffledOptions, correct_answer_index: newCorrectIndex };
    });
    let finalQuestions = questionsWithShuffledOptions;
    if (questionLimit !== 'all') {
      finalQuestions = finalQuestions.slice(0, questionLimit);
    }
    setQuestions(finalQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setQuizCompleted(false);
    setUserAnswers([]);
    setQuizActive(true);
    setIsLoading(false);
  };

  const handleAnswer = (index) => {
    const isCorrect = index === questions[currentQuestionIndex].correct_answer_index;
    setSelectedAnswer(index);
    if (isCorrect) { setScore(score + 1); }
    recordPerformance(questions[currentQuestionIndex].id, isCorrect);
    if (quizMode === 'study') {
      setShowFeedback(true);
    } else {
      const newAnswers = [...userAnswers];
      newAnswers[currentQuestionIndex] = index;
      setUserAnswers(newAnswers);
      handleNextQuestion(false);
    }
  };

  const handleNextQuestion = (isStudyMode = true) => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(null);
      if (isStudyMode) setShowFeedback(false);
    } else {
      if (quizMode === 'exam') {
        let finalScore = 0;
        const currentAnswers = [...userAnswers];
        if (selectedAnswer !== null) { currentAnswers[currentQuestionIndex] = selectedAnswer; }
        questions.forEach((q, index) => { if (currentAnswers[index] === q.correct_answer_index) { finalScore++; } });
        setScore(finalScore);
      }
      setQuizActive(false);
      setQuizCompleted(true);
    }
  };

  const currentQuestion = quizActive ? questions[currentQuestionIndex] : null;
  const progress = quizActive ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const SelectionUI = () => (
    <div className="max-w-4xl mx-auto space-y-10">
      {user && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 text-center">
          <h2 className="text-2xl font-bold text-yellow-800 mb-2">Personalized Practice</h2>
          <p className="text-yellow-700 mb-4">Focus on questions you've answered incorrectly to improve your weak points.</p>
          <button
            onClick={handleStartWeaknessPractice}
            className="px-8 py-3 bg-yellow-400 text-yellow-900 font-bold rounded-lg shadow-md hover:bg-yellow-500 transition-transform transform hover:scale-105"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Practice Your Weaknesses'}
          </button>
        </div>
      )}

      <div className="relative">
        <hr />
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-50 px-4 text-gray-500 font-semibold">OR</div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-700 mb-1">Standard Practice</h2>
        <p className="text-gray-500 mb-4">Select from the options below to start a standard session.</p>
        <div className="space-y-6">

          {/* Step 1 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Step 1: Select a Module</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modules.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModule(m)}
                  className={`p-6 text-left rounded-lg border-2 w-full transition-all duration-200 ${selectedModule?.id === m.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500' : 'bg-white hover:border-blue-400'}`}
                >
                  <h3 className="font-bold text-lg text-gray-800">{m.name}</h3>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2 */}
          {selectedModule && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Step 2: Select a Subject</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSubject(s)}
                    className={`p-6 text-left w-full rounded-lg border-2 transition-all duration-200 ${selectedSubject?.id === s.id ? 'border-green-500 bg-green-50 ring-2 ring-green-500' : 'bg-white hover:border-green-400'}`}
                  >
                    <h3 className="font-bold text-lg text-gray-800">{s.name}</h3>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 */}
          {selectedSubject && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Step 3: Select a Lecture</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lectures.map(l => (
                  <button
                    key={l.id}
                    onClick={() => setSelectedLecture(l)}
                    className={`p-6 w-full text-left rounded-lg border-2 transition-all duration-200 ${selectedLecture?.id === l.id ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-500' : 'bg-white hover:border-purple-400'}`}
                  >
                    <h3 className="font-bold text-lg text-gray-800">{l.name}</h3>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4 */}
          {selectedLecture && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Step 4: Choose Question Count</h3>
              <div className="flex flex-wrap gap-4">
                {[10, 20, 'all'].map(limit => (
                  <button
                    key={limit}
                    onClick={() => setQuestionLimit(limit)}
                    className={`px-5 py-2 rounded-lg font-semibold transition-colors ${questionLimit === limit ? 'bg-blue-600 text-white' : 'bg-white hover:bg-blue-50 border'}`}
                  >
                    {limit === 'all' ? 'All' : limit} Questions
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5 */}
          {selectedLecture && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Step 5: Choose Mode</h3>
              <div className="flex flex-wrap gap-4">
                {['study', 'exam'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => setQuizMode(mode)}
                    className={`px-5 py-2 rounded-lg font-semibold transition-colors capitalize ${quizMode === mode ? 'bg-blue-600 text-white' : 'bg-white hover:bg-blue-50 border'}`}
                  >
                    {mode} Mode
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Start */}
          {selectedLecture && (
            <div className="mt-10 text-center">
              <button
                onClick={handleStartPractice}
                className="px-10 py-4 bg-green-600 text-white font-semibold text-lg rounded-lg shadow-lg hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Start Practice'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const ResultsUI = () => (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg text-center">
      <h2 className="text-3xl font-bold text-blue-800 mb-4">Practice Complete!</h2>
      <p className="text-xl text-gray-700 mb-8">Your final score: <span className="font-bold text-green-600">{score}</span> out of {questions.length}</p>
      {quizMode === 'exam' && (
        <div className="space-y-6 text-left mb-8">
          <h3 className="text-2xl font-bold text-gray-800 text-center">Review Your Answers</h3>
          {questions.map((q, index) => {
            const userAnswerIndex = userAnswers[index];
            const isCorrect = userAnswerIndex === q.correct_answer_index;
            return (
              <div key={q.id} className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <p className="font-semibold text-gray-800 mb-2">{index + 1}. {q.question_text}</p>
                <p className="text-sm text-gray-600">Your answer: <span className={!isCorrect ? 'font-bold text-red-700' : ''}>{q.options[userAnswerIndex] || "No answer"}</span></p>
                {!isCorrect && <p className="text-sm text-gray-600">Correct answer: <span className="font-bold text-green-700">{q.options[q.correct_answer_index]}</span></p>}
                <p className="mt-2 text-sm text-gray-500 border-t pt-2">Explanation: {q.explanation}</p>
              </div>
            )
          })}
        </div>
      )}
      <div className="flex justify-center gap-4">
        <button onClick={handleStartPractice} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">Retry</button>
        <button onClick={() => { setQuizCompleted(false); setQuizActive(false); setSelectedModule(null); setSelectedSubject(null); setSelectedLecture(null); }} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300">Choose Another Lecture</button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-800">Practice Question Bank</h1>
          <p className="mt-2 text-lg text-gray-600">Enhance your knowledge one question at a time.</p>
        </div>
        {!quizActive && !quizCompleted && <SelectionUI />}
        {quizActive && currentQuestion && (
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <div className="mb-6">
              <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-blue-700">Progress</span>
                <span className="text-sm font-medium text-blue-700">{currentQuestionIndex + 1} of {questions.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
            <p className="text-lg font-medium text-gray-800 mb-6">{currentQuestion.question_text}</p>
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => {
                const isCorrect = index === currentQuestion.correct_answer_index;
                const isSelected = selectedAnswer === index;
                let feedbackClass = '';
                if (showFeedback) {
                  if (isCorrect) feedbackClass = 'bg-green-100 border-green-500 ring-2 ring-green-500';
                  else if (isSelected) feedbackClass = 'bg-red-100 border-red-500 ring-2 ring-red-500';
                }
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-colors duration-200 flex items-center justify-between ${isSelected ? 'border-blue-600 ring-2 ring-blue-600' : 'bg-white hover:border-blue-400'} ${feedbackClass}`}
                  >
                    <span>{option}</span>
                    {showFeedback && (isCorrect ? <CheckIcon /> : (isSelected ? <XIcon /> : null))}
                  </button>
                );
              })}
            </div>
            {showFeedback && (
              <div className="mt-6 bg-gray-50 p-4 rounded-lg border">
                <p className="text-sm text-gray-700"><span className="font-semibold">Explanation:</span> {currentQuestion.explanation}</p>
              </div>
            )}
            {selectedAnswer !== null && (
              <div className="mt-6 flex justify-end">
                <button onClick={() => handleNextQuestion(true)} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">Next</button>
              </div>
            )}
          </div>
        )}
        {quizCompleted && <ResultsUI />}
      </main>
      <Footer />
    </div>
  );
}
