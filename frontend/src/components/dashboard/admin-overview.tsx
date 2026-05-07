"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  BookOpen, 
  Upload, 
  Bell, 
  ArrowUpRight,
  TrendingUp,
  Activity
} from "lucide-react";

import { useState, useEffect } from "react";
import { API_ENDPOINTS, apiUrl } from "@/lib/api-config";

export function AdminOverview({ userData }: { userData: any }) {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(apiUrl(API_ENDPOINTS.lms.stats))
      .then(res => res.json())
      .then(data => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch(err => console.error("Stats fetch error:", err));
  }, []);

  const stats = [
    { label: "Total Learners", value: dashboardData?.totalLearners || "0", icon: Users, color: "text-blue-400" },
    { label: "Active Courses", value: dashboardData?.activeCourses || "0", icon: BookOpen, color: "text-[#B8EF43]" },
    { label: "Avg. Completion", value: `${dashboardData?.avgCompletion || 0}%`, icon: TrendingUp, color: "text-purple-400" },
    { label: "Platform Uptime", value: dashboardData?.platformUptime || "99.9%", icon: Activity, color: "text-orange-400" },
  ];

  const recentLogs = dashboardData?.recentActivity?.map((activity: any) => ({
    user: activity.user,
    action: `${activity.type === 'COMPLETION' ? 'Completed' : 'Started'}: ${activity.item}`,
    time: new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })) || [
    { user: "Sarah K.", action: "Completed: Prompt Engineering", time: "2m ago" },
    { user: "System", action: "Course 'AI Fundamentals' Published", time: "1h ago" },
    { user: "Mike R.", action: "New Enrollment: LLM Advanced", time: "3h ago" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <header>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter">Command Center</h1>
        <p className="text-white/40 text-xs font-bold uppercase tracking-[0.3em] mt-1">LMS Platform Administrator</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 border border-white/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <stat.icon size={48} />
            </div>
            <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-3xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-black uppercase tracking-widest text-white/60">Quick Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Upload New Course", desc: "Add video lessons & resources", icon: Upload, href: "/dashboard/admin/courses" },
              { title: "Broadcast Announcement", desc: "Notify all users in real-time", icon: Bell, href: "/dashboard/admin/reminders" },
            ].map((action) => (
              <button 
                key={action.title}
                className="p-6 border border-white/10 bg-white/5 hover:bg-[#B8EF43]/10 hover:border-[#B8EF43]/30 transition-all text-left group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-white/5 text-[#B8EF43] group-hover:bg-[#B8EF43] group-hover:text-black transition-colors">
                    <action.icon size={20} />
                  </div>
                  <ArrowUpRight size={16} className="text-white/20 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold uppercase text-xs tracking-widest mb-1">{action.title}</h3>
                <p className="text-[10px] text-white/40 uppercase font-medium">{action.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* System Health / Recent Logs */}
        <div className="space-y-4">
          <h2 className="text-sm font-black uppercase tracking-widest text-white/60">Recent Activity</h2>
          <div className="border border-white/10 bg-white/5 p-6 space-y-6">
            {recentLogs.map((log: any, i: number) => (
              <div key={i} className="flex gap-4 text-[10px]">
                <div className="w-1 h-full bg-[#B8EF43]" />
                <div>
                   <p className="font-black uppercase tracking-widest text-white/80">{log.action}</p>
                   <p className="text-white/40 uppercase font-medium mt-1">{log.user} • {log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
