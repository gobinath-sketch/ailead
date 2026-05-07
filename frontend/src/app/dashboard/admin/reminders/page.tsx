"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { API_ENDPOINTS, apiUrl } from "@/lib/api-config";
import { Plus, Trash2, Bell, Save, CalendarPlus, Clock } from "lucide-react";

export default function AdminRemindersPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [newEvent, setNewEvent] = useState({ title: "", description: "", date: "", time: "", location: "" });

  useEffect(() => {
    fetch(apiUrl(API_ENDPOINTS.lms.events))
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error("Events fetch error:", err));
  }, []);

  const handleCreate = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) return;
    setBusy(true);
    
    try {
      const startTime = new Date(`${newEvent.date}T${newEvent.time}`);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour duration

      const response = await fetch(apiUrl(API_ENDPOINTS.lms.events), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newEvent.title,
          description: newEvent.description,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          location: newEvent.location
        })
      });

      if (response.ok) {
        const savedEvent = await response.json();
        setEvents([...events, savedEvent]);
        setNewEvent({ title: "", description: "", date: "", time: "", location: "" });
        setShowModal(false);
      }
    } catch (err) {
      console.error("Event creation error:", err);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = (id: string) => {
    // For now just local delete, can add DELETE endpoint later
    setEvents(events.filter(e => e.id !== id));
  };

  const addToGoogleCalendar = (event: any) => {
    const formatGoogleDate = (dateString: string) => {
      const d = new Date(dateString);
      return d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    };
    const start = formatGoogleDate(event.startTime);
    const end = formatGoogleDate(event.endTime);
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(event.location || '')}&sf=true&output=xml`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white">
      <DashboardSidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      <motion.div animate={{ paddingLeft: isSidebarCollapsed ? "80px" : "280px" }} className="relative z-10 w-full min-h-screen flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-8">
          <header className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl font-black italic uppercase tracking-tighter">Event Reminders</h1>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">Schedule events and auto-notify all learners</p>
            </div>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#B8EF43] text-black px-6 py-3 font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
              <Plus size={16} /> Create Event
            </button>
          </header>

          {/* Reminder Schedule Info */}
          <div className="mb-10 p-6 border border-[#B8EF43]/20 bg-[#B8EF43]/5">
            <div className="flex items-center gap-3 mb-4">
              <Bell size={18} className="text-[#B8EF43]" />
              <h2 className="text-sm font-black uppercase tracking-widest text-[#B8EF43]">Auto-Reminder Schedule</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["1 Day Before", "12 Hours Before", "1 Hour Before", "30 Min Before"].map(t => (
                <div key={t} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60">
                  <Clock size={12} className="text-[#B8EF43]" /> {t}
                </div>
              ))}
            </div>
            <p className="text-[10px] text-white/40 uppercase font-medium mt-4 tracking-widest">Email reminders sent to all enrolled learners automatically at each interval above.</p>
          </div>

          {/* Events List */}
          <div className="space-y-4">
            {events.map((event) => {
              const startDate = new Date(event.startTime);
              return (
                <div key={event.id} className="border border-white/10 bg-white/5 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center group hover:border-[#B8EF43]/30 transition-all">
                  <div className="text-center w-20 shrink-0">
                    <p className="text-[#B8EF43] text-3xl font-black italic">{startDate.getDate()}</p>
                    <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">
                      {startDate.toLocaleString("en-US", { month: "short" })} {startDate.getFullYear()}
                    </p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="px-2 py-0.5 bg-[#B8EF43]/10 text-[#B8EF43] text-[8px] font-black uppercase tracking-widest">
                        {startDate > new Date() ? "Scheduled" : "Completed"}
                      </span>
                      <span className="text-white/40 text-[9px] uppercase font-medium">
                        {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {event.location || "Online"}
                      </span>
                    </div>
                    <h3 className="text-lg font-black italic uppercase tracking-tight">{event.title}</h3>
                    <p className="text-xs text-white/40 uppercase font-medium mt-1">{event.description}</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => addToGoogleCalendar(event)} className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-[#B8EF43]/50 px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all">
                      <CalendarPlus size={14} className="text-[#B8EF43]" /> Sync
                    </button>
                    <button onClick={() => handleDelete(event.id)} className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowModal(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#111] border border-white/10 p-12 max-w-lg w-full">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 text-[#B8EF43]">Create Event</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-white/40 font-black uppercase tracking-widest">Event Title</label>
                  <input type="text" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-[#B8EF43]/50" placeholder="e.g. Live AI Masterclass" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-white/40 font-black uppercase tracking-widest">Description</label>
                  <textarea value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-[#B8EF43]/50 h-24" placeholder="Session details..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/40 font-black uppercase tracking-widest">Date</label>
                    <input type="date" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-[#B8EF43]/50 text-white [color-scheme:dark]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/40 font-black uppercase tracking-widest">Time</label>
                    <input type="time" value={newEvent.time} onChange={e => setNewEvent({ ...newEvent, time: e.target.value })} className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-[#B8EF43]/50 text-white [color-scheme:dark]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-white/40 font-black uppercase tracking-widest">Location / Platform</label>
                  <input type="text" value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-[#B8EF43]/50" placeholder="e.g. Zoom / Google Meet" />
                </div>
                <button onClick={handleCreate} disabled={busy} className="w-full bg-[#B8EF43] text-black font-black py-5 text-xs uppercase tracking-widest hover:scale-105 transition-all flex justify-center items-center gap-2">
                  {busy ? "Scheduling..." : <><Save size={16} /> Schedule Event</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
