"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { 
  Play, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp, 
  Video, 
  FileText,
  Clock,
  ArrowLeft
} from "lucide-react";
import { API_ENDPOINTS, apiUrl } from "@/lib/api-config";
import Link from "next/link";

export default function CoursePlayerPage() {
  const params = useParams();
  const courseId = params.id as string;
  const [course, setCourse] = useState<any>(null);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    const res = await fetch(apiUrl(API_ENDPOINTS.lms.courses));
    if (res.ok) {
      const all = await res.json();
      const found = all.find((c: any) => c.id === courseId);
      if (found) {
        setCourse(found);
        if (found.chapters?.[0]?.lessons?.[0]) {
          setCurrentLesson(found.chapters[0].lessons[0]);
          setExpandedChapters([found.chapters[0].id]);
        }
      }
    } else {
       // Mock for preview
       setCourse({
          title: "Prompt Engineering for Enterprise",
          chapters: [
            { id: 'c1', title: 'The Foundations', lessons: [{ id: 'l1', title: 'Intro to LLMs', type: 'video', duration: 10, content: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }] }
          ]
       });
       setCurrentLesson({ id: 'l1', title: 'Intro to LLMs', type: 'video', duration: 10, content: 'https://www.youtube.com/embed/dQw4w9WgXcQ' });
    }
  };

  const toggleChapter = (id: string) => {
    setExpandedChapters(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
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
        
        <main className="flex-1 flex flex-col lg:flex-row">
          {/* Main Content Area */}
          <div className="flex-1 p-8 lg:p-12 space-y-8">
            <Link href="/dashboard/courses" className="flex items-center gap-2 text-white/40 hover:text-white text-[10px] font-black uppercase tracking-widest mb-4 transition-colors">
               <ArrowLeft size={14} /> All Courses
            </Link>

            {/* Video Player Section */}
            <div className="aspect-video bg-white/5 border border-white/10 relative group overflow-hidden">
               {currentLesson?.type === "video" ? (
                 <iframe 
                   src={currentLesson.content}
                   className="w-full h-full"
                   allowFullScreen
                 />
               ) : (
                 <div className="w-full h-full flex flex-col items-center justify-center text-center p-12">
                    <FileText size={64} className="text-[#B8EF43] mb-6" />
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-4">{currentLesson?.title}</h2>
                    <p className="text-white/40 uppercase text-xs font-bold tracking-widest mb-8">This is a document-based lesson.</p>
                    <a href={currentLesson?.content} target="_blank" className="bg-white text-black px-8 py-4 font-black text-xs uppercase tracking-widest hover:bg-[#B8EF43] transition-all">
                       Download Resource
                    </a>
                 </div>
               )}
            </div>

            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-black italic uppercase tracking-tighter">{currentLesson?.title}</h1>
                  <button className="px-6 py-3 border border-[#B8EF43] text-[#B8EF43] text-[10px] font-black uppercase tracking-widest hover:bg-[#B8EF43] hover:text-black transition-all">
                     Mark as Complete
                  </button>
               </div>
               <p className="text-white/40 text-xs font-medium uppercase tracking-widest">{course.title} • Module {course.chapters?.findIndex((c:any) => c.id === currentLesson?.chapterId) + 1}</p>
            </div>
          </div>

          {/* Sidebar: Curriculum List */}
          <div className="w-full lg:w-96 border-l border-white/10 bg-white/[0.02] flex flex-col h-[calc(100vh-80px)] overflow-y-auto">
             <div className="p-6 border-b border-white/10">
                <h2 className="text-sm font-black uppercase tracking-widest">Curriculum</h2>
                <div className="flex items-center gap-2 mt-2">
                   <div className="flex-1 h-1 bg-white/10">
                      <div className="w-1/4 h-full bg-[#B8EF43]" />
                   </div>
                   <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">25%</span>
                </div>
             </div>

             <div className="flex-1">
                {course.chapters?.map((chapter: any, idx: number) => (
                  <div key={chapter.id} className="border-b border-white/10 last:border-0">
                    <button 
                      onClick={() => toggleChapter(chapter.id)}
                      className="w-full p-6 flex justify-between items-center hover:bg-white/5 transition-colors text-left"
                    >
                      <div className="flex gap-4 items-center">
                         <span className="text-white/20 font-black italic text-lg">0{idx + 1}</span>
                         <h3 className="text-[11px] font-black uppercase tracking-widest">{chapter.title}</h3>
                      </div>
                      {expandedChapters.includes(chapter.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    <AnimatePresence>
                      {expandedChapters.includes(chapter.id) && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-black/40"
                        >
                          {chapter.lessons?.map((lesson: any) => (
                            <button 
                              key={lesson.id}
                              onClick={() => setCurrentLesson(lesson)}
                              className={`w-full p-4 pl-12 flex gap-4 items-center transition-all border-l-2 ${currentLesson?.id === lesson.id ? 'border-[#B8EF43] bg-[#B8EF43]/5' : 'border-transparent hover:bg-white/5'}`}
                            >
                               <div className={currentLesson?.id === lesson.id ? 'text-[#B8EF43]' : 'text-white/20'}>
                                  {lesson.type === "video" ? <Video size={14} /> : <FileText size={14} />}
                               </div>
                               <div className="text-left">
                                  <p className={`text-[10px] font-bold uppercase tracking-widest ${currentLesson?.id === lesson.id ? 'text-white' : 'text-white/60'}`}>{lesson.title}</p>
                                  <p className="text-[8px] text-white/20 uppercase font-medium mt-1">{lesson.duration}m</p>
                               </div>
                               <div className="ml-auto">
                                  <CheckCircle size={12} className="text-white/10" />
                               </div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
             </div>
          </div>
        </main>
      </motion.div>
    </div>
  );
}
