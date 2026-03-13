import React from "react";
import { Link } from "react-router-dom";
import { BrainCircuit, Sparkles, Calendar, CheckSquare, Activity, ArrowRight, Github } from "lucide-react";
import { motion } from "motion/react";

export default function LandingPage() {
  return (
    <div className="bg-white">
      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-2xl text-indigo-600">
          <BrainCircuit className="w-8 h-8" />
          <span>AI StudyOS</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-gray-600 font-medium hover:text-indigo-600 transition-all">Login</Link>
          <Link to="/signup" className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-sm font-bold mb-8"
        >
          <Sparkles className="w-4 h-4" />
          <span>The Future of Student Productivity</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-7xl font-bold text-gray-900 leading-tight mb-8"
        >
          Master Your Studies with <br />
          <span className="text-indigo-600">Intelligent Planning</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-500 max-w-2xl mx-auto mb-12"
        >
          AI StudyOS combines smart scheduling, habit tracking, and focus tools to help you achieve your academic goals faster and with less stress.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/signup" className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
            Start Planning Now <ArrowRight className="w-5 h-5" />
          </Link>
          <button className="bg-white text-gray-700 border border-gray-200 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all">
            Watch Demo
          </button>
        </motion.div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to succeed</h2>
            <p className="text-gray-500">A complete ecosystem for the modern student.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "AI Study Planner", desc: "Automatically generated schedules based on your exam dates and difficulty.", icon: Calendar },
              { title: "Task Management", desc: "Keep track of assignments and deadlines with a clean, intuitive interface.", icon: CheckSquare },
              { title: "Habit Tracker", desc: "Build productive study habits and track your consistency over time.", icon: Activity },
              { title: "Focus Timer", desc: "Built-in Pomodoro timer to help you stay focused during study sessions.", icon: BrainCircuit },
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2 font-bold text-xl text-gray-400">
          <BrainCircuit className="w-6 h-6" />
          <span>AI StudyOS</span>
        </div>
        <p className="text-gray-400 text-sm">© 2026 AI StudyOS. All rights reserved.</p>
        <div className="flex gap-6">
          <Github className="w-6 h-6 text-gray-400 hover:text-gray-600 cursor-pointer" />
        </div>
      </footer>
    </div>
  );
}
