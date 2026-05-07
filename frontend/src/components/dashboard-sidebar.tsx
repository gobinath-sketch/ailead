"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Award, 
  ChevronLeft, 
  ChevronRight,
  Terminal,
  Calendar,
  Upload,
  Link as LinkIcon,
  FileText,
  Bell
} from "lucide-react";
import Link from "next/link";

const learnerMenuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Terminal, label: "Prompt Library", href: "/dashboard/prompts" },
  { icon: BookOpen, label: "Courses", href: "/dashboard/courses" },
  { icon: Award, label: "Practice Lab", href: "/dashboard/practice" },
  { icon: Calendar, label: "Events", href: "/dashboard/events" },
];

const adminMenuItems = [
  { icon: LayoutDashboard, label: "Admin Overview", href: "/dashboard" },
  { icon: Upload, label: "Content Manager", href: "/dashboard/admin/courses" },
  { icon: Bell, label: "Event Reminders", href: "/dashboard/admin/reminders" },
];

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function DashboardSidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const [menuItems, setMenuItems] = useState(learnerMenuItems);
  const [userRole, setUserRole] = useState("LEARNER");
  const [userName, setUserName] = useState("My Account");

  useEffect(() => {
    const data = localStorage.getItem("registrationData");
    if (data) {
      const user = JSON.parse(data);
      if (user.role === "ADMIN") {
        setMenuItems(adminMenuItems);
        setUserRole("ADMIN");
        setUserName(user.fullName || "Gobinath M");
      } else {
        setUserName(user.fullName || "My Account");
      }
    }
  }, []);

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? "80px" : "280px" }}
      transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
      className="fixed left-0 top-0 h-screen z-[100] bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col"
    >
      {/* Sidebar Header */}
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white font-black italic uppercase tracking-tighter text-xl"
          >
            AILeads
          </motion.h2>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2 mt-8">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-4 p-3 hover:bg-white/5 group transition-colors relative"
          >
            <item.icon 
              size={22} 
              className="text-white/60 group-hover:text-[#B8EF43] transition-colors shrink-0" 
            />
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-white/80 group-hover:text-white text-sm font-bold uppercase tracking-widest"
              >
                {item.label}
              </motion.span>
            )}
            
            {/* Active Indicator Hover */}
            <div className="absolute left-0 top-0 w-1 h-full bg-[#B8EF43] opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </nav>

      {/* Footer / User Profile Brief */}
      <div className="p-6 border-t border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/10 flex items-center justify-center shrink-0">
             <Users size={20} className="text-[#B8EF43]" />
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="overflow-hidden"
            >
              <p className="text-white text-[10px] font-black uppercase tracking-widest truncate">{userName}</p>
              <p className="text-white/40 text-[9px] uppercase tracking-widest">{userRole === "ADMIN" ? "Administrator" : "Standard User"}</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
