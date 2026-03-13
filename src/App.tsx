import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  Activity, 
  Timer, 
  Award, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  BookOpen,
  BrainCircuit,
  TrendingUp,
  Flame
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./lib/utils";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import StudyPlanner from "./pages/StudyPlanner";
import TaskManager from "./pages/TaskManager";
import HabitTracker from "./pages/HabitTracker";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("/api/user/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.id) setUser(data);
        else localStorage.removeItem("token");
      })
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Study Planner", path: "/planner", icon: Calendar },
    { name: "Task Manager", path: "/tasks", icon: CheckSquare },
    { name: "Habit Tracker", path: "/habits", icon: Activity },
    { name: "Focus Timer", path: "/timer", icon: Timer },
    { name: "Analytics", path: "/analytics", icon: TrendingUp },
    { name: "Profile", path: "/profile", icon: Settings },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isAuthPage = ["/", "/login", "/signup"].includes(location.pathname);

  if (!user && !isAuthPage) {
    return <LoginPage setUser={setUser} />;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans">
      <AnimatePresence mode="wait">
        {user && !isAuthPage ? (
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              className={cn(
                "bg-white border-r border-gray-200 flex flex-col transition-all duration-300 z-50",
                isSidebarOpen ? "w-64" : "w-20"
              )}
            >
              <div className="p-6 flex items-center justify-between">
                {isSidebarOpen && (
                  <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
                    <BrainCircuit className="w-8 h-8" />
                    <span>StudyOS</span>
                  </Link>
                )}
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
                  {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>

              <nav className="flex-1 px-4 space-y-2 mt-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl transition-all",
                      location.pathname === item.path 
                        ? "bg-indigo-50 text-indigo-600 font-medium" 
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    {isSidebarOpen && <span>{item.name}</span>}
                  </Link>
                ))}
              </nav>

              <div className="p-4 border-t border-gray-100">
                <div className={cn("flex items-center gap-3 p-3", !isSidebarOpen && "justify-center")}>
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                    {user.name[0]}
                  </div>
                  {isSidebarOpen && (
                    <div className="flex-1 overflow-hidden">
                      <p className="font-medium truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">Level {user.level}</p>
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleLogout}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all mt-2",
                    !isSidebarOpen && "justify-center"
                  )}
                >
                  <LogOut className="w-5 h-5 shrink-0" />
                  {isSidebarOpen && <span>Logout</span>}
                </button>
              </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-gray-50/50 p-8">
              <Routes>
                <Route path="/dashboard" element={<Dashboard user={user} />} />
                <Route path="/planner" element={<StudyPlanner user={user} />} />
                <Route path="/tasks" element={<TaskManager user={user} />} />
                <Route path="/habits" element={<HabitTracker user={user} />} />
                <Route path="/timer" element={<FocusTimer user={user} />} />
                <Route path="/analytics" element={<Analytics user={user} />} />
                <Route path="/profile" element={<Profile user={user} />} />
                <Route path="*" element={<Dashboard user={user} />} />
              </Routes>
            </main>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage setUser={setUser} />} />
            <Route path="/signup" element={<SignupPage setUser={setUser} />} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
        )}
      </AnimatePresence>
    </div>
  );
}

function FocusTimer({ user }: { user: any }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'study' | 'break'>('study');

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (mode === 'study') {
        fetch("/api/study-sessions", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({ subject: "Focus Session", durationMinutes: 25 })
        });
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('study');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'study' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100"
      >
        <h2 className="text-2xl font-bold mb-8 text-gray-800">
          {mode === 'study' ? 'Focus Session' : 'Short Break'}
        </h2>
        
        <div className="relative w-64 h-64 mx-auto mb-12">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-100"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={754}
              strokeDashoffset={754 - (754 * timeLeft) / (mode === 'study' ? 25 * 60 : 5 * 60)}
              className="text-indigo-600 transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-mono font-bold text-gray-900">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button 
            onClick={toggleTimer}
            className={cn(
              "px-8 py-3 rounded-xl font-bold transition-all",
              isActive ? "bg-amber-100 text-amber-600" : "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
            )}
          >
            {isActive ? "Pause" : "Start Focus"}
          </button>
          <button 
            onClick={resetTimer}
            className="px-8 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
          >
            Reset
          </button>
        </div>
      </motion.div>
    </div>
  );
}
