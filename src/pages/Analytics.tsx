import React from "react";
import { 
  TrendingUp, 
  PieChart as PieIcon, 
  BarChart as BarIcon, 
  Calendar,
  BrainCircuit,
  Activity
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function Analytics({ user }: { user: any }) {
  const studyData = [
    { name: "Week 1", hours: 15 },
    { name: "Week 2", hours: 22 },
    { name: "Week 3", hours: 18 },
    { name: "Week 4", hours: 28 },
  ];

  const subjectData = [
    { name: "Math", value: 400 },
    { name: "Physics", value: 300 },
    { name: "CS", value: 500 },
    { name: "History", value: 200 },
  ];

  const COLORS = ['#4F46E5', '#818CF8', '#C7D2FE', '#E0E7FF'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Productivity Analytics</h1>
        <p className="text-gray-500 mt-1">Deep dive into your study patterns and progress</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Study Hours Trend */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            Weekly Study Hours
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="hours" fill="#4F46E5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Distribution */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <PieIcon className="w-6 h-6 text-indigo-600" />
            Subject-wise Focus
          </h2>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 pr-8">
              {subjectData.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-sm font-medium text-gray-600">{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-indigo-900">AI Productivity Insights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            "Your focus is highest during morning sessions (8am - 11am).",
            "Physics requires 20% more revision time based on recent task completion.",
            "Maintaining a 7-day streak increases your productivity score by 15%."
          ].map((insight, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100">
              <p className="text-gray-700 text-sm leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
