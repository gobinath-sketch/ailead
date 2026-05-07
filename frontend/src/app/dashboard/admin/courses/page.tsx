"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { Plus, Trash2, Edit2, ChevronRight, Video, FileText, Layout, Save } from "lucide-react";
import { API_ENDPOINTS, apiUrl } from "@/lib/api-config";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: "", description: "", instructor: "Gobinath M" });
  const [busy, setBusy] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [newChapter, setNewChapter] = useState({ title: "", order: 1 });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const res = await fetch(apiUrl(API_ENDPOINTS.lms.courses));
    if (res.ok) {
      setCourses(await res.json());
    }
  };

  const handleCreateCourse = async () => {
    setBusy(true);
    try {
      const res = await fetch(apiUrl(API_ENDPOINTS.lms.courses), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCourse),
      });
      if (res.ok) {
        setShowModal(false);
        fetchCourses();
        setNewCourse({ title: "", description: "", instructor: "Gobinath M" });
      }
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("Are you sure? This will delete all chapters and lessons.")) return;
    const res = await fetch(`${apiUrl(API_ENDPOINTS.lms.courses)}/${id}`, { method: "DELETE" });
    if (res.ok) fetchCourses();
  };

  const handleAddChapter = async () => {
    if (!selectedCourse) return;
    const res = await fetch(apiUrl(API_ENDPOINTS.lms.chapters(selectedCourse.id)), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newChapter),
    });
    if (res.ok) {
      setShowChapterModal(false);
      fetchCourses();
      setNewChapter({ title: "", order: selectedCourse.chapters.length + 1 });
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
          <header className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl font-black italic uppercase tracking-tighter">Curriculum Builder</h1>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">Manage Course Content & Modules</p>
            </div>
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-[#B8EF43] text-black px-6 py-3 font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all"
            >
              <Plus size={16} /> New Course
            </button>
          </header>

          {/* Courses List */}
          <div className="grid grid-cols-1 gap-6">
            {courses.length === 0 ? (
              <div className="border border-dashed border-white/10 p-20 text-center">
                 <Layout size={48} className="mx-auto text-white/10 mb-4" />
                 <p className="text-white/40 text-sm font-black uppercase tracking-widest">No courses found. Start building!</p>
              </div>
            ) : (
              courses.map((course) => (
                <div key={course.id} className="border border-white/10 bg-white/5 overflow-hidden group">
                  <div className="p-6 flex justify-between items-center bg-white/5 border-b border-white/5">
                    <div className="flex gap-6 items-center">
                      <div className="w-12 h-12 bg-white/5 flex items-center justify-center border border-white/10">
                         <Video size={20} className="text-[#B8EF43]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black italic uppercase tracking-tight">{course.title}</h3>
                        <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">{course.chapters?.length || 0} Chapters • {course.instructor}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => { setSelectedCourse(course); setShowChapterModal(true); }}
                        className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-[#B8EF43] hover:text-black transition-all"
                      >
                         <Plus size={14} /> Add Chapter
                      </button>
                      <button 
                        onClick={() => handleDeleteCourse(course.id)}
                        className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all"
                      >
                         <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Chapters List */}
                  <div className="p-6 space-y-3">
                    {course.chapters?.length === 0 ? (
                      <p className="text-[10px] text-white/20 uppercase font-bold italic">No chapters added yet.</p>
                    ) : (
                      course.chapters.map((chapter: any) => (
                        <div key={chapter.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 group/chap">
                           <div className="flex items-center gap-4">
                              <span className="text-[#B8EF43] font-black italic text-xs">#{chapter.order}</span>
                              <h4 className="text-xs font-bold uppercase tracking-widest">{chapter.title}</h4>
                           </div>
                           <div className="flex items-center gap-4">
                              <span className="text-[10px] text-white/40 font-medium uppercase">{chapter.lessons?.length || 0} Lessons</span>
                              <button className="text-white/20 hover:text-[#B8EF43] transition-colors">
                                 <Plus size={14} />
                              </button>
                           </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setShowModal(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-[#111] border border-white/10 p-12 max-w-lg w-full rounded-none"
            >
              <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 text-[#B8EF43]">Initialize New Course</h2>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] text-white/40 font-black uppercase tracking-widest">Course Title</label>
                    <input 
                      type="text"
                      value={newCourse.title}
                      onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-[#B8EF43]/50"
                      placeholder="e.g. Advanced Prompt Engineering"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] text-white/40 font-black uppercase tracking-widest">Description</label>
                    <textarea 
                      value={newCourse.description}
                      onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-[#B8EF43]/50 h-32"
                      placeholder="Course overview..."
                    />
                 </div>
                 <button 
                  onClick={handleCreateCourse}
                  disabled={busy}
                  className="w-full bg-[#B8EF43] text-black font-black py-5 text-xs uppercase tracking-widest hover:scale-105 transition-all flex justify-center items-center gap-2"
                 >
                   {busy ? "Creating..." : <><Save size={16} /> Save Course </>}
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Chapter Modal */}
      <AnimatePresence>
        {showChapterModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setShowChapterModal(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-[#111] border border-white/10 p-12 max-w-lg w-full rounded-none"
            >
              <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 text-[#B8EF43]">Add Chapter to {selectedCourse?.title}</h2>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] text-white/40 font-black uppercase tracking-widest">Chapter Title</label>
                    <input 
                      type="text"
                      value={newChapter.title}
                      onChange={(e) => setNewChapter({...newChapter, title: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-[#B8EF43]/50"
                      placeholder="e.g. Introduction to LLMs"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] text-white/40 font-black uppercase tracking-widest">Order Index</label>
                    <input 
                      type="number"
                      value={newChapter.order}
                      onChange={(e) => setNewChapter({...newChapter, order: parseInt(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-[#B8EF43]/50"
                    />
                 </div>
                 <button 
                  onClick={handleAddChapter}
                  className="w-full bg-[#B8EF43] text-black font-black py-5 text-xs uppercase tracking-widest hover:scale-105 transition-all flex justify-center items-center gap-2"
                 >
                   <Save size={16} /> Save Chapter
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
