import React, { useState, useEffect } from "react";
import { 
  CheckSquare, 
  Plus, 
  Calendar, 
  Tag, 
  Trash2, 
  CheckCircle2,
  Clock,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function TaskManager({ user }: { user: any }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    const data = await res.json();
    setTasks(data);
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ title: newTitle, subject: newSubject, deadline: newDeadline })
    });
    const data = await res.json();
    setTasks([...tasks, data]);
    setNewTitle("");
    setNewSubject("");
    setNewDeadline("");
  };

  const toggleTask = async (id: number, completed: boolean) => {
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ completed: !completed })
    });
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !completed } : t));
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
          <p className="text-gray-500 mt-1">Organize your study assignments and deadlines</p>
        </div>
      </div>

      {/* Add Task Form */}
      <form onSubmit={addTask} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <input
            type="text"
            required
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <input
            type="text"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder="Subject (optional)"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button type="submit" className="bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" /> Add Task
        </button>
        <div className="md:col-span-2">
          <input
            type="datetime-local"
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </form>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'pending', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all",
              filter === f ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-white text-gray-500 border border-gray-100 hover:bg-gray-50"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task) => (
            <motion.div
              layout
              key={task.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "bg-white p-4 rounded-2xl border transition-all flex items-center gap-4 group",
                task.completed ? "border-gray-100 opacity-60" : "border-gray-100 shadow-sm hover:border-indigo-100"
              )}
            >
              <button 
                onClick={() => toggleTask(task.id, task.completed)}
                className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                  task.completed ? "bg-green-500 border-green-500 text-white" : "border-gray-200 hover:border-indigo-500"
                )}
              >
                {task.completed && <CheckCircle2 className="w-4 h-4" />}
              </button>
              
              <div className="flex-1 min-w-0">
                <h3 className={cn("font-bold text-gray-900 truncate", task.completed && "line-through text-gray-400")}>
                  {task.title}
                </h3>
                <div className="flex items-center gap-4 mt-1">
                  {task.subject && (
                    <span className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">
                      <Tag className="w-3 h-3" /> {task.subject}
                    </span>
                  )}
                  {task.deadline && (
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" /> {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <button className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                <Trash2 className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No tasks found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { cn } from "../lib/utils";
