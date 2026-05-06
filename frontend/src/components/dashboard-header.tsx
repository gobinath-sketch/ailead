"use client";

import React from "react";
import { LogOut, Bell, User } from "lucide-react";

export function DashboardHeader() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/AILeads";
  };

  return (
    <div className="fixed top-0 right-0 p-6 z-[90] flex items-center gap-4">
      {/* Notifications / User profile can go here later */}
      <button className="p-3 bg-black/20 backdrop-blur-md border border-white/10 text-white/60 hover:text-white transition-all hover:bg-black/40">
        <Bell size={18} />
      </button>
      
      <button 
        onClick={handleLogout}
        className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 px-6 py-3 text-white hover:bg-red-600/20 hover:border-red-500/40 transition-all group"
      >
        <LogOut size={18} className="group-hover:text-red-400 transition-colors" />
      </button>
    </div>
  );
}
