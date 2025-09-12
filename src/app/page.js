// src/app/page.js
import Link from 'next/link';
import Header from '@/components/Header'; // استيراد الهيدر
import Footer from '@/components/Footer'; // استيراد الفوتر

// Placeholder icons...
const IconStethoscope = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2a.3.3 0 0 0-.2.3V10a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V4H4.8z"/><path d="M8 12v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1"/><circle cx="12" cy="12" r="10"/><path d="m16.2 7.8 1.4-1.4"/><path d="m21.5 12.5-1.4-1.4"/><path d="m16.2 16.2 1.4 1.4"/></svg>;
const IconBrainCircuit = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2.5 2.5 0 0 1 3 4.85"/><path d="M12 2a2.5 2.5 0 0 0-3 4.85"/><path d="M12 11.15a2.5 2.5 0 0 1 3 4.85"/><path d="M12 11.15a2.5 2.5 0 0 0-3 4.85"/><path d="M12 22a2.5 2.5 0 0 1 3-4.85"/><path d="M12 22a2.5 2.5 0 0 0-3-4.85"/><path d="M15 6.85a2.5 2.5 0 0 1 4.33-2.5"/><path d="M19.33 4.35a2.5 2.5 0 0 1 2.5 4.33"/><path d="M21.83 8.68a2.5 2.5 0 0 1 0 5.66"/><path d="M21.83 15.32a2.5 2.5 0 0 1-2.5 4.33"/><path d="M19.33 19.65a2.5 2.5 0 0 1-4.33 2.5"/><path d="M15 17.15a2.5 2.5 0 0 1-4.33 2.5"/><path d="M9 17.15a2.5 2.5 0 0 1-4.33-2.5"/><path d="M4.67 19.65a2.5 2.5 0 0 1-2.5-4.33"/><path d="M2.17 15.32a2.5 2.5 0 0 1 0-5.66"/><path d="M2.17 8.68a2.5 2.5 0 0 1 2.5-4.33"/><path d="M4.67 4.35a2.5 2.5 0 0 1 4.33-2.5"/><path d="M9 6.85a2.5 2.5 0 0 1 4.33 2.5"/></svg>;
const IconUsers = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;


export default function Home() {
  return (
    <div className="min-h-screen bg-blue-50 font-sans">
      <Header />

      {/* ===== Main Hero Section ===== */}
      <main className="w-full max-w-7xl mx-auto px-6 py-20 md:py-28 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800">
          The Arena for Future Clinicians
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Sharpen your diagnostic skills, compete with peers, and master clinical knowledge on a platform built for medical excellence.
        </p>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link href="#" className="pro-card block bg-white rounded-xl shadow-md p-8 text-left">
            <h3 className="text-2xl font-bold text-blue-600 mb-2">Start Challenges</h3>
            <p className="text-gray-600">Engage in timed contests and solve complex clinical cases under pressure.</p>
          </Link>
          <Link href="#" className="pro-card block bg-white rounded-xl shadow-md p-8 text-left">
            <h3 className="text-2xl font-bold text-blue-600 mb-2">Browse Questions</h3>
            <p className="text-gray-600">Access a vast question bank covering all medical specialties to practice at your own pace.</p>
          </Link>
          <Link href="#" className="pro-card block bg-white rounded-xl shadow-md p-8 text-left">
            <h3 className="text-2xl font-bold text-blue-600 mb-2">View Leaderboard</h3>
            <p className="text-gray-600">Track your progress, compare your rank, and see how you stack up against the best.</p>
          </Link>
        </div>
      </main>

      {/* ===== Why MedForces Section ===== */}
      <section className="bg-white w-full py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Why MedForces?</h2>
          <p className="text-lg text-gray-600 mb-12">A platform designed to bridge theory and practice.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="feature-item p-6 rounded-lg">
                <div className="flex justify-center items-center h-16 w-16 bg-blue-100 text-blue-600 rounded-full mx-auto mb-4"><IconStethoscope /></div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Competitive Challenges</h3>
                <p className="text-gray-600">Simulate real-world clinical scenarios to boost your decision-making skills.</p>
            </div>
            <div className="feature-item p-6 rounded-lg">
                <div className="flex justify-center items-center h-16 w-16 bg-blue-100 text-blue-600 rounded-full mx-auto mb-4"><IconBrainCircuit /></div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Interactive Learning</h3>
                <p className="text-gray-600">Practice thousands of MCQs with detailed explanations to learn effectively.</p>
            </div>
            <div className="feature-item p-6 rounded-lg">
                <div className="flex justify-center items-center h-16 w-16 bg-blue-100 text-blue-600 rounded-full mx-auto mb-4"><IconUsers /></div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Thriving Community</h3>
                <p className="text-gray-600">Connect with peers, share knowledge, and grow together in a supportive environment.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}