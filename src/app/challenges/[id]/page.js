// src/app/challenges/[id]/page.js
"use client";

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

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      const { data: challengeData } = await supabase
        .from('challenges')
        .select(`*, contest_questions(questions(*))`)
        .eq('id', resolvedParams.id)
        .single();
      
      if (challengeData) {
        const contestQuestions = challengeData.contest_questions.map(cq => cq.questions);
        setChallenge(challengeData);

        if (user) {
          const { data: existingResult } = await supabase
            .from('quiz_results').select('score').eq('user_id', user.id).eq('challenge_id', challengeData.id).maybeSingle();
          if (existingResult) {
            setHasCompleted(true);
            setScore(existingResult.score);
          }
        }
        
        const shuffledQuestions = shuffleArray(contestQuestions || []);
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
      setLoading(false);
    };
    if(resolvedParams.id) fetchData();
  }, [resolvedParams.id]);

  // The rest of the file is unchanged...
  // (useEffect for timer, handlers, JSX)
}