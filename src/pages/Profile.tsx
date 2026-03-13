import React from "react";
import { User, Mail, GraduationCap, Shield, Bell, Moon } from "lucide-react";

export default function Profile({ user }: { user: any }) {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and preferences</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex items-center gap-6">
          <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center text-4xl font-bold">
            {user.name[0]}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
            <div className="flex gap-2 mt-2">
              <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold">
                Level {user.level}
              </span>
              <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold">
                {user.xp} XP
              </span>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" />
                Personal Info
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
                  <p className="font-medium text-gray-900">{user.name}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Education Level</label>
                  <p className="font-medium text-gray-900">{user.education_level}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-600" />
                Preferences
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Study Reminders</span>
                  <div className="w-10 h-5 bg-indigo-600 rounded-full relative">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Dark Mode</span>
                  <div className="w-10 h-5 bg-gray-200 rounded-full relative">
                    <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100">
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
