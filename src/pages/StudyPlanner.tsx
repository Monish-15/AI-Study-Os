import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Sparkles, 
  Clock, 
  BookOpen,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { generateStudyPlan } from "../services/gemini";

export default function StudyPlanner({ user }: { user: any }) {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [newSubject, setNewSubject] = useState("");
  const [examDate, setExamDate] = useState("");
  const [dailyHours, setDailyHours] = useState(4);
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<any>(null);

  useEffect(() => {
    fetch("/api/study-plan", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => res.json())
    .then(data => setPlan(data));
  }, []);

  const addSubject = () => {
    if (newSubject && !subjects.includes(newSubject)) {
      setSubjects([...subjects, newSubject]);
      setNewSubject("");
    }
  };

  const removeSubject = (sub: string) => {
    setSubjects(subjects.filter(s => s !== sub));
  };

  const handleGenerate = async () => {
    if (subjects.length === 0 || !examDate) return;
    setIsGenerating(true);
    try {
      const result = await generateStudyPlan({
        subjects,
        topics: subjects.reduce((acc, s) => ({ ...acc, [s]: ["Core Concepts", "Advanced Topics"] }), {}),
        examDate,
        difficulty: subjects.reduce((acc, s) => ({ ...acc, [s]: 3 }), {}),
        dailyHours
      });
      setPlan(result);
      await fetch("/api/study-plan", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ plan: result })
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Study Planner</h1>
          <p className="text-gray-500 mt-1">Generate an optimized study schedule using AI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              Subjects
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSubject()}
                placeholder="Add subject..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button onClick={addSubject} className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {subjects.map(sub => (
                <span key={sub} className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  {sub}
                  <button onClick={() => removeSubject(sub)}><Trash2 className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Exam Date
            </h2>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              Daily Study Hours
            </h2>
            <input
              type="range"
              min="1"
              max="12"
              value={dailyHours}
              onChange={(e) => setDailyHours(parseInt(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-500 font-medium">
              <span>1h</span>
              <span className="text-indigo-600 font-bold">{dailyHours}h</span>
              <span>12h</span>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || subjects.length === 0 || !examDate}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </div>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Study Plan
              </>
            )}
          </button>
        </div>

        {/* Plan Display */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {plan ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {plan.weeklyPlan.map((day: any, i: number) => (
                  <div key={i} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-bold text-gray-800">{day.day}</h3>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                        {day.tasks.length} Sessions
                      </span>
                    </div>
                    <div className="p-6 space-y-4">
                      {day.tasks.map((task: any, j: number) => (
                        <div key={j} className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-transparent hover:border-indigo-100 transition-all">
                          <div className="w-12 h-12 bg-white rounded-xl flex flex-col items-center justify-center shadow-sm border border-gray-100">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">{task.time.split(' ')[1]}</span>
                            <span className="text-sm font-bold text-indigo-600">{task.time.split(' ')[0]}</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-gray-900">{task.subject}</p>
                            <p className="text-sm text-gray-500">{task.topic}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-indigo-600">{task.duration}</p>
                            <ChevronRight className="w-4 h-4 text-gray-300 ml-auto mt-1" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Calendar className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">No Study Plan Yet</h3>
                <p className="text-gray-500 max-w-xs mt-2">
                  Configure your subjects and exam date to generate an AI-powered study schedule.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
