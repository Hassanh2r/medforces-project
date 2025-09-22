// src/app/page.js
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// This line tells Vercel to build a static version of this page
// and only rebuild it when you deploy new code.
export const revalidate = false; 

// Placeholder icons from Heroicons (SVG code)
const BeakerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5v-2.121c0-.623-.32-1.206-.862-1.581L14.25 8.192M19 14.5H5a2.25 2.25 0 00-2.25 2.25v1.125c0 1.242 1.008 2.25 2.25 2.25h14.5a2.25 2.25 0 002.25-2.25v-1.125a2.25 2.25 0 00-2.25-2.25z" />
  </svg>
);
const BookOpenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6-2.292m0 0v14.25" />
  </svg>
);
const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 011.316-5.033l.24-1.202a5.25 5.25 0 019.848 0l.24 1.202A9.75 9.75 0 0116.5 18.75zM12 12.75V3" />
  </svg>
);

export default function Home() {
  return (
    <div>
      <Header />

      {/* Hero Section */}
      <main className="hero-bg py-20 px-6 text-center">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
            The Competitive Edge for Medical Students
          </h1>
          <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
            Hone your clinical skills, challenge your peers, and climb the ranks on a platform built for the next generation of medical leaders.
          </p>
          <div className="mt-8 flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
            <Link href="/challenges" className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
              Start Challenges
            </Link>
            <Link href="/practice" className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition duration-300">
              Browse Questions
            </Link>
            <Link href="/leaderboard" className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition duration-300">
              View Leaderboard
            </Link>
          </div>
        </div>
      </main>

      {/* Why MedForces Section */}
      <section className="bg-white py-20 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-blue-800">Why MedForces?</h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <div className="flex justify-center items-center mb-4">
                <div className="bg-emerald-100 p-3 rounded-full text-emerald-700">
                  <BeakerIcon />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Competitive Challenges</h3>
              <p className="text-gray-600">Put your knowledge to the test with real-world clinical cases and timed quizzes.</p>
            </div>
            {/* Card 2 */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <div className="flex justify-center items-center mb-4">
                <div className="bg-emerald-100 p-3 rounded-full text-emerald-700">
                  <BookOpenIcon />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Interactive Questions</h3>
              <p className="text-gray-600">Practice thousands of MCQs with detailed explanations to learn effectively.</p>
            </div>
            {/* Card 3 */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <div className="flex justify-center items-center mb-4">
                <div className="bg-emerald-100 p-3 rounded-full text-emerald-700">
                  <TrophyIcon />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Community Leaderboard</h3>
              <p className="text-gray-600">Connect with peers, track your progress, and climb the ranks.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}