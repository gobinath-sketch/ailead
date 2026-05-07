"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  BookOpen, 
  Upload, 
  Bell, 
  ArrowUpRight,
  TrendingUp,
  Activity,
  Shield,
  Trash2,
  Plus,
  Search,
  Award,
  ExternalLink,
  CheckCircle,
  FileText
} from "lucide-react";
import { API_ENDPOINTS, apiUrl } from "@/lib/api-config";

export function AdminOverview({ userData }: { userData: any }) {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"metrics" | "learners" | "courses" | "links">("metrics");
  
  // Interactive states
  const [courses, setCourses] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const [learners, setLearners] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch stats
    fetch(apiUrl(API_ENDPOINTS.lms.stats))
      .then(res => res.json())
      .then(data => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch(err => console.error("Stats fetch error:", err));

    // Fetch courses
    fetch(apiUrl(API_ENDPOINTS.lms.courses))
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error("Courses fetch error:", err));

    // Fetch links
    fetch(apiUrl(API_ENDPOINTS.lms.links))
      .then(res => res.json())
      .then(data => setLinks(data))
      .catch(err => console.error("Links fetch error:", err));

    // Seed mock learners for visualization (since they are registration models)
    setLearners([
      { id: "1", name: "Gobinath M", email: "gobinathgobinath643@gmail.com", role: "LEARNER", points: 840, level: 4 },
      { id: "2", name: "Sarah Connor", email: "sarah.c@gktech.ai", role: "LEARNER", points: 620, level: 3 },
      { id: "3", name: "James Rick", email: "james.r@aileads.com", role: "LEARNER", points: 290, level: 1 },
      { id: "4", name: "Kaviya Priya", email: "kaviya.p@gktech.ai", role: "LEARNER", points: 950, level: 5 },
    ]);
  }, []);

  // Handlers for interactive deletions
  const handleDeleteCourse = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      const res = await fetch(apiUrl(`${API_ENDPOINTS.lms.courses}/${id}`), {
        method: "DELETE",
      });
      if (res.ok) {
        setCourses(prev => prev.filter(c => c.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource link?")) return;
    try {
      const res = await fetch(apiUrl(`${API_ENDPOINTS.lms.links}/${id}`), {
        method: "DELETE",
      });
      if (res.ok) {
        setLinks(prev => prev.filter(l => l.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const stats = [
    { label: "Total Learners", value: dashboardData?.totalLearners || "4", icon: Users, color: "text-blue-400" },
    { label: "Active Courses", value: courses.length || "0", icon: BookOpen, color: "text-[#B8EF43]" },
    { label: "Avg. Completion", value: `${dashboardData?.avgCompletion || 74}%`, icon: TrendingUp, color: "text-purple-400" },
    { label: "Platform Uptime", value: "99.98%", icon: Activity, color: "text-orange-400" },
  ];

  const filteredLearners = learners.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6 flex flex-col h-full overflow-hidden"
    >
      {/* Header */}
      <header className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-2">
            <Shield className="text-[#B8EF43]" size={28} />
            Command Center
          </h1>
          <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mt-0.5">
            LMS Platform Administrator • Active Session: {userData?.fullName || "Admin"}
          </p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 border border-white/10 bg-white/5 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon size={36} />
            </div>
            <p className="text-[8px] text-white/40 font-black uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-2xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Interactive Admin Tab Bar */}
      <div className="flex-1 min-h-0 flex flex-col bg-white/[0.01] border border-white/10 p-6">
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-4 shrink-0 overflow-x-auto">
          {[
            { id: "metrics", label: "Overview & Logs", icon: Activity },
            { id: "learners", label: "Learner Directory", icon: Users },
            { id: "courses", label: "Course Library", icon: BookOpen },
            { id: "links", label: "Resource Links", icon: ExternalLink }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setSearchTerm(""); }}
              className={`flex items-center gap-2 px-4 py-2 border text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'border-[#B8EF43] bg-[#B8EF43]/10 text-[#B8EF43]' : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'}`}
            >
              <tab.icon size={12} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Panels */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: METRICS & SYSTEM LOGS */}
            {activeTab === "metrics" && (
              <motion.div 
                key="tab-metrics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {/* Quick Management Shortcuts */}
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Quick Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a 
                      href="/dashboard/admin/courses"
                      className="p-5 border border-white/10 bg-white/5 hover:bg-[#B8EF43]/10 hover:border-[#B8EF43]/30 transition-all text-left group flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-2.5 bg-white/5 text-[#B8EF43] group-hover:bg-[#B8EF43] group-hover:text-black transition-colors">
                          <Upload size={16} />
                        </div>
                        <ArrowUpRight size={14} className="text-white/20 group-hover:text-white" />
                      </div>
                      <div>
                        <h4 className="font-black text-xs uppercase tracking-widest mb-1">Content Manager</h4>
                        <p className="text-[9px] text-white/40 uppercase font-medium">Upload video lessons & study manuals</p>
                      </div>
                    </a>

                    <a 
                      href="/dashboard/admin/reminders"
                      className="p-5 border border-white/10 bg-white/5 hover:bg-[#B8EF43]/10 hover:border-[#B8EF43]/30 transition-all text-left group flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-2.5 bg-white/5 text-[#B8EF43] group-hover:bg-[#B8EF43] group-hover:text-black transition-colors">
                          <Bell size={16} />
                        </div>
                        <ArrowUpRight size={14} className="text-white/20 group-hover:text-white" />
                      </div>
                      <div>
                        <h4 className="font-black text-xs uppercase tracking-widest mb-1">Event Reminders</h4>
                        <p className="text-[9px] text-white/40 uppercase font-medium">Sync scheduled programs with calendar invitations</p>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Live Activity Stream */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Recent Activity</h3>
                  <div className="border border-white/10 bg-white/5 p-4 space-y-4 max-h-[180px] overflow-y-auto">
                    {[
                      { user: "Gobinath M", desc: "Completed: RLHF Alignment Exercise", time: "5m ago" },
                      { user: "Sarah Connor", desc: "Started: RAG Retrieval Architectures", time: "1h ago" },
                      { user: "System Scheduler", desc: "ICS Calendar Auto-Sync Dispatched", time: "3h ago" }
                    ].map((log, index) => (
                      <div key={index} className="flex gap-3 text-[9px] border-b border-white/5 pb-2 last:border-0 last:pb-0">
                        <div className="w-1 bg-[#B8EF43] self-stretch" />
                        <div>
                          <p className="font-black uppercase tracking-widest text-white/80">{log.desc}</p>
                          <p className="text-white/40 uppercase font-bold mt-1">{log.user} • {log.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: LEARNER DIRECTORY */}
            {activeTab === "learners" && (
              <motion.div 
                key="tab-learners"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Search learners by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 p-2.5 text-xs focus:border-[#B8EF43]/50 outline-none uppercase tracking-widest font-black"
                  />
                </div>

                <div className="border border-white/10 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5">
                        <th className="p-3 text-[9px] font-black uppercase tracking-widest text-white/40">Learner Name</th>
                        <th className="p-3 text-[9px] font-black uppercase tracking-widest text-white/40">Email</th>
                        <th className="p-3 text-[9px] font-black uppercase tracking-widest text-white/40">Role</th>
                        <th className="p-3 text-[9px] font-black uppercase tracking-widest text-white/40 text-center">Practice Level</th>
                        <th className="p-3 text-[9px] font-black uppercase tracking-widest text-white/40 text-right">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLearners.map(learner => (
                        <tr key={learner.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                          <td className="p-3 text-[10px] font-black uppercase tracking-widest text-[#B8EF43]">{learner.name}</td>
                          <td className="p-3 text-[10px] font-bold text-white/60">{learner.email}</td>
                          <td className="p-3 text-[9px] font-black uppercase"><span className="bg-white/10 border border-white/10 px-2 py-0.5">{learner.role}</span></td>
                          <td className="p-3 text-[10px] font-bold text-center">Lvl {learner.level}</td>
                          <td className="p-3 text-[10px] font-black text-right text-emerald-400">{learner.points} pts</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* TAB 3: COURSE CATALOG */}
            {activeTab === "courses" && (
              <motion.div 
                key="tab-courses"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="border border-white/10 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5">
                        <th className="p-3 text-[9px] font-black uppercase tracking-widest text-white/40">Course Title</th>
                        <th className="p-3 text-[9px] font-black uppercase tracking-widest text-white/40">Instructor</th>
                        <th className="p-3 text-[9px] font-black uppercase tracking-widest text-white/40">Modules Count</th>
                        <th className="p-3 text-[9px] font-black uppercase tracking-widest text-white/40 text-center">Status</th>
                        <th className="p-3 text-[9px] font-black uppercase tracking-widest text-white/40 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map(course => (
                        <tr key={course.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                          <td className="p-3 text-[10px] font-black uppercase tracking-widest text-white">{course.title}</td>
                          <td className="p-3 text-[10px] font-bold text-white/60">{course.instructor || "Gobinath M"}</td>
                          <td className="p-3 text-[10px] font-bold text-white/60">{(course.chapters?.length || 0) + 1} Modules</td>
                          <td className="p-3 text-[9px] font-black text-center"><span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5">Published</span></td>
                          <td className="p-3 text-right">
                            <button 
                              onClick={() => handleDeleteCourse(course.id)}
                              className="text-white/40 hover:text-red-400 transition-colors p-1"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* TAB 4: RESOURCE LINKS */}
            {activeTab === "links" && (
              <motion.div 
                key="tab-links"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="border border-white/10 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5">
                        <th className="p-3 text-[9px] font-black uppercase tracking-widest text-white/40">Link Label</th>
                        <th className="p-3 text-[9px] font-black uppercase tracking-widest text-white/40">Category</th>
                        <th className="p-3 text-[9px] font-black uppercase tracking-widest text-white/40">External URL</th>
                        <th className="p-3 text-[9px] font-black uppercase tracking-widest text-white/40 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {links.map(link => (
                        <tr key={link.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                          <td className="p-3 text-[10px] font-black uppercase tracking-widest text-white">{link.title}</td>
                          <td className="p-3 text-[10px] font-bold text-[#B8EF43]">{link.category || "Research"}</td>
                          <td className="p-3 text-[10px] font-bold text-white/40 truncate max-w-[200px]">{link.url}</td>
                          <td className="p-3 text-right">
                            <button 
                              onClick={() => handleDeleteLink(link.id)}
                              className="text-white/40 hover:text-red-400 transition-colors p-1"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
