"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { 
  Plus, 
  Trash2, 
  Video, 
  FileText, 
  Type, 
  ChevronDown, 
  ChevronUp, 
  Save,
  ArrowLeft
} from "lucide-react";
import { API_ENDPOINTS, apiUrl } from "@/lib/api-config";
import Link from "next/link";

export default function AdminCourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;
  const [course, setCourse] = useState<any>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState<string | null>(null); // chapterId
  const [newLesson, setNewLesson] = useState({ title: "", type: "video", content: "", duration: 15 });
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    const res = await fetch(apiUrl(API_ENDPOINTS.lms.courses));
    if (res.ok) {
      const all = await res.json();
      const found = all.find((c: any) => c.id === courseId);
      setCourse(found);
    }
  };

  const handleAddChapter = async () => {
    if (!newChapterTitle) return;
    setBusy(true);
    try {
      const res = await fetch(apiUrl(API_ENDPOINTS.lms.chapters(courseId)), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newChapterTitle, order: (course.chapters?.length || 0) + 1 }),
      });
      if (res.ok) {
        setNewChapterTitle("");
        fetchCourse();
      }
    } finally {
      setBusy(false);
    }
  };

  const handleAddLesson = async () => {
    if (!showLessonModal || !newLesson.title) return;
    setBusy(true);
    try {
      const res = await fetch(apiUrl(API_ENDPOINTS.lms.lessons(showLessonModal)), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newLesson, order: 1 }),
      });
      if (res.ok) {
        setShowLessonModal(null);
        setNewLesson({ title: "", type: "video", content: "", duration: 15 });
        fetchCourse();
      }
    } finally {
      setBusy(false);
    }
  };

  if (!course) return null;

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white">
      <DashboardSidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      
      <motion.div 
        animate={{ paddingLeft: isSidebarCollapsed ? "80px" : "280px" }}
        className="relative z-10 w-full min-h-screen flex flex-col"
      >
        <DashboardHeader />
        
        <main className="flex-1 p-8">
          <Link href="/dashboard/admin/courses" className="flex items-center gap-2 text-white/40 hover:text-white text-[10px] font-black uppercase tracking-widest mb-8 transition-colors">
             <ArrowLeft size={14} /> Back to Curriculum
          </Link>

          <header className="mb-12">
            <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-2">{course.title}</h1>
            <p className="text-white/40 text-xs font-medium uppercase tracking-[0.2em]">{course.instructor} • {course.chapters?.length || 0} Modules</p>
          </header>

          <div className="max-w-4xl space-y-12">
            {/* Chapters */}
            <div className="space-y-6">
              {course.chapters?.map((chapter: any, index: number) => (
                <div key={chapter.id} className="border border-white/10 bg-white/5 overflow-hidden">
                  <div className="p-6 flex justify-between items-center border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                       <span className="text-white/20 font-black italic text-2xl">0{index + 1}</span>
                       <h3 className="text-lg font-black italic uppercase tracking-tight">{chapter.title}</h3>
                    </div>
                    <button 
                      onClick={() => setShowLessonModal(chapter.id)}
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all"
                    >
                      <Plus size={14} /> Add Lesson
                    </button>
                  </div>

                  <div className="p-6 space-y-4">
                    {chapter.lessons?.map((lesson: any) => (
                      <div key={lesson.id} className="flex justify-between items-center p-4 border border-white/5 bg-black/20 group">
                         <div className="flex items-center gap-4">
                            <div className="text-white/40">
                               {lesson.type === "video" ? <Video size={16} /> : <FileText size={16} />}
                            </div>
                            <div>
                               <p className="text-xs font-bold uppercase tracking-widest">{lesson.title}</p>
                               <p className="text-[9px] text-white/20 uppercase font-medium mt-0.5">{lesson.duration}m • {lesson.type}</p>
                            </div>
                         </div>
                         <button className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-500/10 transition-all">
                            <Trash2 size={14} />
                         </button>
                      </div>
                    ))}
                    {chapter.lessons?.length === 0 && (
                      <p className="text-center py-8 text-[10px] text-white/20 uppercase font-black tracking-widest">No lessons in this module</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Chapter Form */}
            <div className="p-8 border border-dashed border-white/20 bg-white/[0.02] flex gap-4">
               <input 
                 type="text" 
                 value={newChapterTitle}
                 onChange={(e) => setNewChapterTitle(e.target.value)}
                 placeholder="Enter Module Title..."
                 className="flex-1 bg-white/5 border border-white/10 p-4 outline-none focus:border-[#B8EF43]/50 text-xs uppercase font-bold tracking-widest"
               />
               <button 
                onClick={handleAddChapter}
                disabled={busy}
                className="bg-white text-black px-8 py-4 font-black text-xs uppercase tracking-widest hover:bg-[#B8EF43] transition-all"
               >
                 Add Module
               </button>
            </div>
          </div>
        </main>
      </motion.div>

      {/* Lesson Modal */}
      <AnimatePresence>
        {showLessonModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setShowLessonModal(null)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-[#111] border border-white/10 p-12 max-w-lg w-full rounded-none"
            >
              <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 text-[#B8EF43]">Append New Lesson</h2>
              <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setNewLesson({...newLesson, type: "video"})}
                      className={`p-4 border ${newLesson.type === 'video' ? 'border-[#B8EF43] bg-[#B8EF43]/10' : 'border-white/10 bg-white/5'} flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest`}
                    >
                      <Video size={16} /> Video
                    </button>
                    <button 
                      onClick={() => setNewLesson({...newLesson, type: "pdf"})}
                      className={`p-4 border ${newLesson.type === 'pdf' ? 'border-[#B8EF43] bg-[#B8EF43]/10' : 'border-white/10 bg-white/5'} flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest`}
                    >
                      <FileText size={16} /> Document
                    </button>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] text-white/40 font-black uppercase tracking-widest">Lesson Title</label>
                    <input 
                      type="text"
                      value={newLesson.title}
                      onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-[#B8EF43]/50 text-xs uppercase font-bold tracking-widest"
                      placeholder="e.g. Introduction to Transformers"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] text-white/40 font-black uppercase tracking-widest">{newLesson.type === 'video' ? 'Video URL' : 'Document Link'}</label>
                    <input 
                      type="text"
                      value={newLesson.content}
                      onChange={(e) => setNewLesson({...newLesson, content: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-[#B8EF43]/50 text-xs"
                      placeholder="https://..."
                    />
                 </div>
                 <button 
                  onClick={handleAddLesson}
                  disabled={busy}
                  className="w-full bg-[#B8EF43] text-black font-black py-5 text-xs uppercase tracking-widest hover:scale-105 transition-all flex justify-center items-center gap-2"
                 >
                   {busy ? "Appending..." : <><Save size={16} /> Save Lesson </>}
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
