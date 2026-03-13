import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  CheckCircle2, 
  Flame, 
  Trophy, 
  Clock, 
  ArrowRight,
  Plus,
  Calendar as CalendarIcon,
  Activity,
  BrainCircuit
} from "lucide-react";
import { motion } from "motion/react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

export default function Dashboard({ user }: { user: any }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [habits, setHabits] = useState<any[]>([]);
  const [stats, setStats] = useState({
    studyHours: 0,
    completionRate: 0,
    streak: 0,
    productivityScore: 0
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch("/api/tasks", { headers }).then(res => res.json()),
      fetch("/api/habits", { headers }).then(res => res.json()),
    ]).then(([tasksData, habitsData]) => {
      setTasks(tasksData.filter((t: any) => !t.completed).slice(0, 5));
      setHabits(habitsData);
      
      // Mock stats for demo
      setStats({
        studyHours: 12.5,
        completionRate: 85,
        streak: 5,
        productivityScore: 92
      });
    });
  }, []);

  const chartData = [
    { name: "Mon", hours: 2 },
    { name: "Tue", hours: 4 },
    { name: "Wed", hours: 3 },
    { name: "Thu", hours: 5 },
    { name: "Fri", hours: 2 },
    { name: "Sat", hours: 6 },
    { name: "Sun", hours: 4 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
          <p className="text-gray-500 mt-1">You're on a {stats.streak} day streak. Keep it up!</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 flex items-center gap-2 shadow-sm">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="font-bold">{user.xp} XP</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 flex items-center gap-2 shadow-sm">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span className="font-bold">Level {user.level}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Study Hours", value: stats.studyHours + "h", icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Completion", value: stats.completionRate + "%", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
          { label: "Current Streak", value: stats.streak + " Days", icon: Flame, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Productivity", value: stats.productivityScore, icon: Activity, color: "text-indigo-600", bg: "bg-indigo-50" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-900">Study Activity</h2>
            <select className="bg-gray-50 border-none rounded-lg text-sm font-medium px-3 py-1 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#4F46E5" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#4F46E5', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tasks Preview */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Tasks</h2>
            <Link to="/tasks" className="text-indigo-600 text-sm font-bold hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {tasks.length > 0 ? tasks.map((task, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all group">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{task.title}</p>
                  <p className="text-xs text-gray-500">{task.subject}</p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-all">
                  <CheckCircle2 className="w-5 h-5" />
                </button>
              </div>
            )) : (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">No pending tasks</p>
                <button className="mt-4 text-indigo-600 font-bold text-sm flex items-center gap-1 mx-auto">
                  <Plus className="w-4 h-4" /> Add Task
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Habits & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Habit Streaks</h2>
          <div className="grid grid-cols-2 gap-4">
            {habits.map((habit, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-700">{habit.name}</span>
                  <Flame className="w-4 h-4 text-orange-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{habit.streak} Days</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-600 p-8 rounded-3xl shadow-xl shadow-indigo-200 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <BrainCircuit className="w-6 h-6" />
              <h2 className="text-xl font-bold">AI Productivity Insights</h2>
            </div>
            <div className="space-y-4">
              <p className="text-indigo-100">"You study most efficiently between 6pm and 9pm. Consider scheduling difficult subjects during this time."</p>
              <div className="h-1 w-full bg-indigo-500/50 rounded-full overflow-hidden">
                <div className="h-full bg-white w-3/4 rounded-full" />
              </div>
              <p className="text-xs text-indigo-200">Exam Readiness: 74% for Data Structures</p>
            </div>
          </div>
          <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
