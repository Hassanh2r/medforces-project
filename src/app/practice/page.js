"use client";

import { useState } from "react";

export default function PracticePage() {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "What is the primary function of hemoglobin?",
      options: [
        "Transport oxygen",
        "Digest proteins",
        "Store glycogen",
        "Produce antibodies",
      ],
      answer: "Transport oxygen",
    },
    {
      id: 2,
      question: "Which organ produces insulin?",
      options: ["Liver", "Pancreas", "Stomach", "Kidney"],
      answer: "Pancreas",
    },
    {
      id: 3,
      question: "Which vitamin is essential for blood clotting?",
      options: ["Vitamin A", "Vitamin B12", "Vitamin K", "Vitamin D"],
      answer: "Vitamin K",
    },
  ]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleAnswer = (option) => {
    setSelectedOption(option);
    if (option === questions[currentQuestion].answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setScore(0);
    setCurrentQuestion(0);
    setShowResult(false);
    setSelectedOption(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-2xl p-8 bg-white shadow-lg rounded-xl">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Practice Questions
        </h1>

        {!showResult ? (
          <div>
            <p className="text-lg font-medium text-gray-800 mb-4">
              {questions[currentQuestion].question}
            </p>
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className={`w-full px-4 py-2 border rounded-lg text-left ${
                    selectedOption === option
                      ? option === questions[currentQuestion].answer
                        ? "bg-green-100 border-green-500"
                        : "bg-red-100 border-red-500"
                      : "bg-gray-50 border-gray-300"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              <span className="text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <button
                onClick={handleNext}
                disabled={!selectedOption}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {currentQuestion + 1 < questions.length ? "Next" : "Finish"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Results</h2>
            <p className="text-gray-700 mb-2">
              You scored {score} out of {questions.length}.
            </p>
            <p className="text-yellow-700 mb-4">
              Focus on questions you&apos;ve answered incorrectly to improve your
              weak points.
            </p>
            <button
              onClick={handleRestart}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Restart Practice
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
