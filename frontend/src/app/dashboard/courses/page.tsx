"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { Play, Clock, BookOpen, ChevronRight } from "lucide-react";
import { API_ENDPOINTS, apiUrl } from "@/lib/api-config";
import Link from "next/link";

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const res = await fetch(apiUrl(API_ENDPOINTS.lms.courses));
    if (res.ok) {
      setCourses(await res.json());
    } else {
      // Mock data for preview
      setCourses([
        { id: '1', title: 'Prompt Engineering for Enterprise', instructor: 'Gobinath M', description: 'Master high-level prompt engineering techniques.', chapters: [1, 2, 3] },
        { id: '2', title: 'Advanced LLM Architectures', instructor: 'Gobinath M', description: 'Deep dive into Transformer models.', chapters: [1, 2] },
      ]);
    }
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
          <header className="mb-12">
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">My Courses</h1>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">Access your learning curriculum</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Link key={course.id} href={`/dashboard/courses/${course.id}`}>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="border border-white/10 bg-white/5 overflow-hidden group cursor-pointer"
                >
                  <div className="aspect-video bg-white/5 relative flex items-center justify-center overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                     <div className="z-20 text-[#B8EF43] opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                        <Play size={48} fill="currentColor" />
                     </div>
                  </div>
                  
                  <div className="p-6 relative z-20">
                    <div className="flex justify-between items-start mb-4">
                       <span className="text-[9px] font-black uppercase tracking-widest text-[#B8EF43]">{course.instructor}</span>
                       <div className="flex gap-2 items-center text-white/40 text-[9px] font-bold uppercase tracking-widest">
                          <Clock size={12} /> 12h 45m
                       </div>
                    </div>
                    
                    <h3 className="text-xl font-black italic uppercase tracking-tight mb-2 group-hover:text-[#B8EF43] transition-colors">{course.title}</h3>
                    <p className="text-xs text-white/40 uppercase font-medium line-clamp-2 mb-6">{course.description}</p>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                       <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                          <BookOpen size={14} className="text-[#B8EF43]" />
                          {course.chapters?.length || 0} Modules
                       </div>
                       <ChevronRight size={16} className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </main>
      </motion.div>
    </div>
  );
}
