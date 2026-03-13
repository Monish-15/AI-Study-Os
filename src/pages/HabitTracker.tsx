import React, { useState, useEffect } from "react";
import { 
  Activity, 
  Plus, 
  Flame, 
  Calendar, 
  CheckCircle2, 
  TrendingUp,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function HabitTracker({ user }: { user: any }) {
  const [habits, setHabits] = useState<any[]>([]);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    const res = await fetch("/api/habits", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    const data = await res.json();
    setHabits(data);
  };

  const addHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    const res = await fetch("/api/habits", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ name: newName })
    });
    const data = await res.json();
    setHabits([...habits, data]);
    setNewName("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Habit Tracker</h1>
          <p className="text-gray-500 mt-1">Build consistency and track your daily progress</p>
        </div>
      </div>

      {/* Add Habit */}
      <form onSubmit={addHabit} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex gap-4">
        <input
          type="text"
          required
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New habit (e.g., Morning Reading, Exercise)"
          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button type="submit" className="bg-indigo-600 text-white px-8 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Habit
        </button>
      </form>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4">
            <Flame className="w-6 h-6" />
          </div>
          <p className="text-sm text-gray-500 font-medium">Longest Streak</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">12 Days</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <p className="text-sm text-gray-500 font-medium">Completion Rate</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">78%</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
            <Award className="w-6 h-6" />
          </div>
          <p className="text-sm text-gray-500 font-medium">Badges Earned</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">4</p>
        </div>
      </div>

      {/* Habit List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {habits.map((habit) => (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:border-indigo-100 transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{habit.name}</h3>
                <p className="text-sm text-gray-500">Daily Goal</p>
              </div>
              <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">
                <Flame className="w-4 h-4" /> {habit.streak} Day Streak
              </div>
            </div>

            <div className="flex justify-between gap-2 mb-6">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                    i < 5 ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-300"
                  )}>
                    {i < 5 && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                  </span>
                </div>
              ))}
            </div>

            <button className="w-full py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-all">
              Mark Completed Today
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

import { cn } from "../lib/utils";
