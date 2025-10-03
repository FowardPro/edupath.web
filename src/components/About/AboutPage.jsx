// components/About/AboutPage.jsx
import React from "react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-indigo-300 mb-12">
          About EduPath
        </h1>

        {/* Our Mission */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-white/20 rounded-xl p-8 mb-10 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            At EduPath, we're revolutionizing education through the power of
            artificial intelligence. We believe every student deserves
            personalized guidance and innovative tools to excel in their
            academic journey.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-cyan-400 font-semibold mb-2">
                For High School Students
              </h3>
              <p className="text-gray-300">
                Our AI-powered career exploration helps students discover their
                passion and find the perfect career path based on their
                interests, skills, and goals.
              </p>
            </div>
            <div>
              <h3 className="text-purple-400 font-semibold mb-2">
                For University Students
              </h3>
              <p className="text-gray-300">
                Transform your study notes into interactive quizzes with our
                intelligent quiz generator, making learning more engaging and
                effective.
              </p>
            </div>
          </div>
        </div>

        {/* Our History */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-white/20 rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Our History</h2>
          <p className="text-gray-300 leading-relaxed">
            Founded with the vision of making quality education accessible to
            all, EduPath combines cutting-edge AI technology with proven
            educational methodologies. Our platform has helped thousands of
            students achieve their academic and career goals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
