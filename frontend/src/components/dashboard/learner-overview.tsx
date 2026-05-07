"use client";

import { motion } from "framer-motion";
import { 
  Play, 
  Terminal, 
  Calendar, 
  ArrowRight,
  Clock,
  Trophy
} from "lucide-react";

import { useState, useEffect } from "react";
import { API_ENDPOINTS, apiUrl } from "@/lib/api-config";

export function LearnerOverview({ userData }: { userData: any }) {
  const [progressData, setProgressData] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progRes, eventRes, notifyRes] = await Promise.all([
          fetch(apiUrl(API_ENDPOINTS.lms.userProgress(userData.id))),
          fetch(apiUrl(API_ENDPOINTS.lms.events)),
          fetch(apiUrl(`${API_ENDPOINTS.registrations.root}/${userData.id}/notifications`)) // Assuming this endpoint exists
        ]);

        const [prog, ev, notify] = await Promise.all([
          progRes.json(),
          eventRes.json(),
          notifyRes.ok ? notifyRes.json() : []
        ]);

        setProgressData(prog);
        setEvents(ev);
        setNotifications(notify);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData.id]);

  const latestLesson = progressData.length > 0 ? progressData[progressData.length - 1].lesson : null;
  const upcomingEvent = events.find(e => new Date(e.startTime) > new Date());

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-12"
    >
      <header className="flex justify-between items-end">
        <div>
          <p className="text-[#B8EF43] text-[10px] font-black uppercase tracking-[0.4em] mb-2">Welcome Back</p>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">{userData.fullName.split(' ')[0]}</h1>
        </div>
        <div className="text-right hidden md:block">
           <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Level 4 Learner</p>
           <div className="w-32 h-1 bg-white/10 mt-2">
              <div className="w-3/4 h-full bg-[#B8EF43]" />
           </div>
        </div>
      </header>

      {/* Hero: Continue Learning */}
      <section className="relative group overflow-hidden border border-white/10 bg-white/5 p-8 md:p-12 transition-all hover:border-[#B8EF43]/30">
        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
           <Play size={200} />
        </div>
        
        <div className="relative z-10 max-w-xl">
           <span className="inline-block px-3 py-1 bg-[#B8EF43] text-black text-[9px] font-black uppercase tracking-widest mb-6">Continue Learning</span>
           <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter mb-4 leading-tight">
             {latestLesson?.title || "Explore Our Courses"}
           </h2>
           <p className="text-white/40 text-sm font-medium uppercase tracking-widest mb-8">
             {latestLesson ? `Last Accessed: ${latestLesson.type}` : "Start your AI journey today"}
           </p>
           
           <button className="flex items-center gap-4 bg-white text-black px-8 py-4 font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
              {latestLesson ? "Resume Lesson" : "Browse Courses"} <ArrowRight size={16} />
           </button>
        </div>
      </section>

      {/* Sync Status Banner */}
      <div className="p-4 border border-[#B8EF43]/20 bg-[#B8EF43]/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-[#B8EF43] rounded-full animate-pulse" />
          <p className="text-[9px] font-black uppercase tracking-widest text-[#B8EF43]">Calendar Auto-Sync Active</p>
        </div>
        <p className="text-[9px] text-white/40 uppercase font-medium tracking-widest">Invitations are sent to {userData.email} automatically</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Links */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
           {[
             { title: "Prompt Library", desc: "Access the AI Toolbox", icon: Terminal, color: "text-[#B8EF43]" },
             { title: "Upcoming Events", desc: upcomingEvent ? `Next: ${upcomingEvent.title}` : "No upcoming events", icon: Calendar, color: "text-blue-400" },
             { title: "Learning Path", desc: `${progressData.length} Lessons Completed`, icon: Trophy, color: "text-purple-400" },
             { title: "Recent Activity", desc: "Real-time updates active", icon: Clock, color: "text-orange-400" },
           ].map((item) => (
             <button key={item.title} className="p-6 border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-left group">
                <div className={`mb-4 ${item.color}`}>
                   <item.icon size={24} />
                </div>
                <h3 className="font-bold uppercase text-xs tracking-widest mb-1">{item.title}</h3>
                <p className="text-[10px] text-white/40 uppercase font-medium">{item.desc}</p>
             </button>
           ))}
        </div>

        {/* Notifications / Announcements */}
        <div className="space-y-4">
          <h2 className="text-sm font-black uppercase tracking-widest text-white/60">Announcements</h2>
          <div className="space-y-2">
             {notifications.length > 0 ? notifications.slice(0, 3).map((msg, i) => (
               <div key={i} className="p-4 bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                  {msg.title}: {msg.message}
               </div>
             )) : (
               <div className="p-4 bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/40">
                  No new announcements
               </div>
             )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
