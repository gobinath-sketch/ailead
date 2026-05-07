"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { Calendar, Clock, MapPin, Bell, ExternalLink, CalendarPlus } from "lucide-react";
import { API_ENDPOINTS, apiUrl } from "@/lib/api-config";

export default function EventsPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch(apiUrl(API_ENDPOINTS.lms.events))
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error("Events fetch error:", err));
  }, []);

  const addToGoogleCalendar = (event: any) => {
    const start = new Date(event.startTime).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(event.endTime).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(event.description || "")}&location=${encodeURIComponent(event.location || "Online")}&sf=true&output=xml`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white">
      <DashboardSidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      
      <motion.div 
        animate={{ paddingLeft: isSidebarCollapsed ? "80px" : "280px" }}
        className="relative z-10 w-full min-h-screen flex flex-col"
      >
        <DashboardHeader />
        
        <main className="flex-1 p-8">
          <header className="mb-12 flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black italic uppercase tracking-tighter">Event Schedule</h1>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">Live Classes, Workshops & Milestones</p>
            </div>
            <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
               <Bell size={14} className="text-[#B8EF43]" /> Notification Settings
            </button>
          </header>

          <div className="space-y-6">
            {events.map((event) => {
              const startDate = new Date(event.startTime);
              const endDate = new Date(event.endTime);
              return (
                <motion.div 
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border border-white/10 bg-white/5 p-8 flex flex-col md:flex-row gap-8 items-start md:items-center group hover:border-[#B8EF43]/30 transition-all"
                >
                  <div className="w-full md:w-48 text-center md:border-r border-white/10 pr-0 md:pr-8">
                     <p className="text-[#B8EF43] text-2xl font-black italic tracking-tighter leading-none">{startDate.getDate()}</p>
                     <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">
                       {startDate.toLocaleString('en-US', { month: 'short' })} {startDate.getFullYear()}
                     </p>
                  </div>

                  <div className="flex-1">
                     <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-0.5 bg-white/10 text-white/60 text-[8px] font-black uppercase tracking-widest">
                          {startDate > new Date() ? "Live Session" : "Past Event"}
                        </span>
                        <div className="flex items-center gap-2 text-white/40 text-[9px] font-bold uppercase tracking-widest">
                           <Clock size={12} /> {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="flex items-center gap-2 px-2 py-0.5 bg-[#B8EF43]/10 text-[#B8EF43] text-[8px] font-black uppercase tracking-widest animate-pulse">
                          <Bell size={8} /> Auto-Sync Active
                        </div>
                     </div>
                     <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2 group-hover:text-[#B8EF43] transition-colors">{event.title}</h3>
                     <p className="text-xs text-white/40 uppercase font-medium max-w-xl">{event.description}</p>
                  </div>

                  <div className="flex flex-col gap-3 w-full md:w-auto">
                     <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2">
                        <MapPin size={14} className="text-[#B8EF43]" /> {event.location || "Online"}
                     </div>
                     <button 
                      onClick={() => addToGoogleCalendar(event)}
                      className="flex items-center justify-center gap-3 bg-[#B8EF43] text-black px-6 py-4 font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all"
                     >
                        <CalendarPlus size={16} /> Sync to Google
                     </button>
                     <button className="flex items-center justify-center gap-3 border border-white/10 bg-white/5 px-6 py-4 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                        <ExternalLink size={14} /> Join Meeting
                     </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </main>
      </motion.div>
    </div>
  );
}
