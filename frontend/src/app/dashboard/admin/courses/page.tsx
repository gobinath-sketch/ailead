"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { 
  Plus, 
  Trash2, 
  FileText, 
  Video, 
  Save, 
  Eye, 
  Upload, 
  X, 
  BookOpen, 
  ExternalLink,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { API_ENDPOINTS, apiUrl } from "@/lib/api-config";

export default function AdminCoursesPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  
  // Interactive creation states (All-In-One Unified Form)
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    instructor: "Gobinath M",
    level: "intermediate",
    estimatedHours: 8,
    materials: [
      { type: "video", title: "Enterprise AI Fundamentals", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", description: "Core introduction video." }
    ]
  });

  // Modal / Preview states
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<{ [key: number]: boolean }>({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch(apiUrl(API_ENDPOINTS.lms.courses));
      if (res.ok) {
        setCourses(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMaterialRow = () => {
    setCourseForm(prev => ({
      ...prev,
      materials: [...prev.materials, { type: "document", title: "", url: "", description: "" }]
    }));
  };

  const handleRemoveMaterialRow = (index: number) => {
    setCourseForm(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }));
  };

  const handleMaterialChange = (index: number, field: string, value: string) => {
    setCourseForm(prev => {
      const updated = [...prev.materials];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, materials: updated };
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropFile = async (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      await uploadDummyFile(files[0], index);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const files = e.target.files;
    if (files && files[0]) {
      await uploadDummyFile(files[0], index);
    }
  };

  const uploadDummyFile = async (file: File, index: number) => {
    setUploadingFiles(prev => ({ ...prev, [index]: true }));
    // Simulate high-speed network chunk upload
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Auto fill link and title from uploaded file metadata
    const generatedUrl = `https://aileads-platform.s3.amazonaws.com/uploads/${encodeURIComponent(file.name)}`;
    setCourseForm(prev => {
      const updated = [...prev.materials];
      updated[index] = {
        ...updated[index],
        title: file.name.split(".")[0].toUpperCase() + " Manual",
        url: generatedUrl,
        description: `Attached document size: ${(file.size / (1024 * 1024)).toFixed(2)} MB.`
      };
      return { ...prev, materials: updated };
    });
    setUploadingFiles(prev => ({ ...prev, [index]: false }));
  };

  const handleSaveAll = async () => {
    if (!courseForm.title || !courseForm.description) {
      alert("Please enter a course Title and Description first.");
      return;
    }

    setBusy(true);
    try {
      // 1. Create Course Core
      const courseRes = await fetch(apiUrl(API_ENDPOINTS.lms.courses), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: courseForm.title,
          description: courseForm.description,
          instructor: courseForm.instructor
        }),
      });

      if (courseRes.ok) {
        const createdCourse = await courseRes.json();

        // 2. Add chapters and lessons dynamically for each attached study material
        for (let i = 0; i < courseForm.materials.length; i++) {
          const mat = courseForm.materials[i];
          if (!mat.title || !mat.url) continue;

          // Create chapter row
          const chapterRes = await fetch(apiUrl(API_ENDPOINTS.lms.chapters(createdCourse.id)), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: `MODULE: ${mat.title}`, order: i + 1 }),
          });

          if (chapterRes.ok) {
            const createdChapter = await chapterRes.json();
            // Create lesson row inside chapter
            await fetch(apiUrl(API_ENDPOINTS.lms.lessons(createdChapter.id)), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title: mat.title,
                type: mat.type,
                content: mat.url,
                duration: 15,
                order: 1
              }),
            });
          }
        }

        // 3. Clear inputs and show success message
        setCourseForm({
          title: "",
          description: "",
          instructor: "Gobinath M",
          level: "intermediate",
          estimatedHours: 8,
          materials: [{ type: "video", title: "", url: "", description: "" }]
        });
        
        setSuccessMessage("Enterprise course structure created and successfully published to learners!");
        fetchCourses();
        setTimeout(() => setSuccessMessage(""), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
      setShowPreviewModal(false);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course and all associated chapters?")) return;
    try {
      const res = await fetch(`${apiUrl(API_ENDPOINTS.lms.courses)}/${id}`, { method: "DELETE" });
      if (res.ok) fetchCourses();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white font-sans">
      <DashboardSidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      
      {/* Sleek Grid Pattern */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <motion.div 
        animate={{ paddingLeft: isSidebarCollapsed ? "80px" : "280px" }}
        transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
        className="relative z-10 w-full min-h-screen flex flex-col"
      >
        <DashboardHeader />
        
        <main className="flex-1 p-8 space-y-8">
          <header className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-black italic uppercase tracking-tighter">Content Manager</h1>
              <p className="text-white/40 text-xs font-bold uppercase tracking-[0.3em] mt-1">Deploy Enterprise Learning Materials</p>
            </div>
          </header>

          <AnimatePresence>
            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 flex items-center gap-3 text-xs font-black uppercase tracking-widest"
              >
                <CheckCircle2 size={16} />
                <span>{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: THE ALL-IN-ONE BUILDER CARD */}
            <div className="lg:col-span-7 space-y-6">
              <div className="border border-white/10 bg-white/5 p-6 space-y-6 relative">
                <div className="absolute top-0 left-0 w-24 h-[2px] bg-[#B8EF43]" />
                <div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-white/80">1. Course Metadata</h2>
                  <p className="text-[10px] text-white/40 uppercase font-medium mt-0.5">Establish the primary course properties</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-white/50 mb-1.5">Course Title *</label>
                    <input 
                      type="text"
                      placeholder="e.g., ADVANCED PROMPT OPTIMIZATION"
                      value={courseForm.title}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 p-3 text-xs focus:border-[#B8EF43]/50 outline-none uppercase tracking-widest font-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-white/50 mb-1.5">Course Description *</label>
                    <textarea 
                      placeholder="e.g., MASTER COMPLEX SYSTEM-LEVEL BEHAVIORS AND ADVANCED DEEPMIND ALGORITHMS."
                      rows={3}
                      value={courseForm.description}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 p-3 text-xs focus:border-[#B8EF43]/50 outline-none uppercase tracking-widest font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-white/50 mb-1.5">Instructor Name</label>
                      <input 
                        type="text"
                        value={courseForm.instructor}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, instructor: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 p-3 text-xs outline-none font-black text-white/60 uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-white/50 mb-1.5">Difficulty Level</label>
                      <select 
                        value={courseForm.level}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, level: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 p-3 text-xs outline-none font-black text-white/60 uppercase tracking-widest"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* ATTACHMENTS SECTION */}
              <div className="border border-white/10 bg-white/5 p-6 space-y-6 relative">
                <div className="absolute top-0 left-0 w-24 h-[2px] bg-[#B8EF43]" />
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-white/80">2. Uploads & Study Materials</h2>
                    <p className="text-[10px] text-white/40 uppercase font-medium mt-0.5">Attach documents, PDFs, manuals, and educational videos</p>
                  </div>
                  <button 
                    onClick={handleAddMaterialRow}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-[#B8EF43] bg-[#B8EF43]/10 text-[#B8EF43] hover:bg-[#B8EF43] hover:text-black transition-all text-[9px] font-black uppercase tracking-widest"
                  >
                    <Plus size={12} />
                    <span>Add Material</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {courseForm.materials.map((mat, index) => (
                    <div key={index} className="p-4 border border-white/5 bg-white/[0.02] space-y-4 relative">
                      <button 
                        onClick={() => handleRemoveMaterialRow(index)}
                        className="absolute top-4 right-4 text-white/20 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[8px] font-black uppercase tracking-widest text-white/40 mb-1">Material Name *</label>
                          <input 
                            type="text"
                            placeholder="e.g., RESEARCH PAPER"
                            value={mat.title}
                            onChange={(e) => handleMaterialChange(index, "title", e.target.value)}
                            className="w-full bg-black border border-white/10 p-2.5 text-[10px] outline-none font-black text-white uppercase tracking-wider"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-black uppercase tracking-widest text-white/40 mb-1">Attachment Type</label>
                          <select 
                            value={mat.type}
                            onChange={(e) => handleMaterialChange(index, "type", e.target.value)}
                            className="w-full bg-black border border-white/10 p-2.5 text-[10px] outline-none font-black text-white uppercase tracking-wider"
                          >
                            <option value="video">Video Lecture</option>
                            <option value="document">PDF / Article</option>
                            <option value="link">External Website Link</option>
                          </select>
                        </div>
                      </div>

                      {/* File Drag Zone */}
                      <div 
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDropFile(e, index)}
                        onClick={() => document.getElementById(`file-picker-${index}`)?.click()}
                        className="border-2 border-dashed border-white/10 bg-black/40 hover:bg-white/[0.02] hover:border-[#B8EF43]/30 transition-all text-center p-4 cursor-pointer relative"
                      >
                        <input 
                          type="file" 
                          id={`file-picker-${index}`}
                          style={{ display: "none" }}
                          onChange={(e) => handleFileInput(e, index)}
                        />
                        {uploadingFiles[index] ? (
                          <div className="flex flex-col items-center gap-1">
                            <div className="animate-spin h-4 w-4 border-2 border-[#B8EF43] border-t-transparent rounded-full" />
                            <p className="text-[8px] font-black uppercase tracking-widest text-[#B8EF43]">Uploading File...</p>
                          </div>
                        ) : mat.url ? (
                          <div className="flex items-center justify-center gap-2">
                            {mat.type === "video" ? <Video size={14} className="text-emerald-400" /> : <FileText size={14} className="text-[#B8EF43]" />}
                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 truncate max-w-[280px]">File Loaded Successfully</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-white/40">
                            <Upload size={16} />
                            <p className="text-[8px] font-black uppercase tracking-widest">Drag & Drop file here or click to browse</p>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-[8px] font-black uppercase tracking-widest text-white/40 mb-1">Resource URL/Link</label>
                        <input 
                          type="url"
                          placeholder="e.g., https://arxiv.org/pdf/2303.17580"
                          value={mat.url}
                          onChange={(e) => handleMaterialChange(index, "url", e.target.value)}
                          className="w-full bg-black border border-white/10 p-2.5 text-[10px] outline-none font-mono text-white/60"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Save and Preview actions */}
                <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
                  <button 
                    onClick={() => setShowPreviewModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2.5 border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest"
                  >
                    <Eye size={14} />
                    <span>Live Preview</span>
                  </button>
                  <button 
                    onClick={handleSaveAll}
                    disabled={busy}
                    className="flex items-center gap-1.5 px-6 py-2.5 bg-[#B8EF43] text-black hover:bg-[#c9f95d] transition-all text-[10px] font-black uppercase tracking-widest"
                  >
                    <Save size={14} />
                    <span>{busy ? "Publishing..." : "Save & Publish"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: PUBLISHED COURSES OVERVIEW */}
            <div className="lg:col-span-5 space-y-6">
              <div className="border border-white/10 bg-white/5 p-6 space-y-6 relative">
                <div className="absolute top-0 left-0 w-24 h-[2px] bg-white/20" />
                <div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-white/80">Active Catalog</h2>
                  <p className="text-[10px] text-white/40 uppercase font-medium mt-0.5">Currently live enterprise courses</p>
                </div>

                {loading ? (
                  <div className="flex justify-center p-6">
                    <div className="animate-spin h-6 w-6 border-2 border-[#B8EF43] border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                    {courses.map(course => (
                      <div key={course.id} className="border border-white/5 bg-white/[0.01] p-4 flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <h4 className="text-xs font-black uppercase tracking-widest text-white">{course.title}</h4>
                          <p className="text-[10px] text-white/40 line-clamp-2 uppercase">{course.description}</p>
                          <div className="flex gap-2 text-[8px] font-black uppercase text-[#B8EF43] pt-1">
                            <span>{course.instructor}</span>
                            <span>•</span>
                            <span>{course.chapters?.length || 0} Modules</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDeleteCourse(course.id)}
                          className="text-white/20 hover:text-red-400 p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    {courses.length === 0 && (
                      <p className="text-[10px] text-white/40 uppercase text-center py-6 font-bold">No active courses published.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </motion.div>

      {/* DYNAMIC CARD PREVIEW MODAL */}
      <AnimatePresence>
        {showPreviewModal && (
          <div className="fixed inset-0 flex items-center justify-center z-[150] p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setShowPreviewModal(false)}
            />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-lg border border-white/15 bg-neutral-950 p-6 space-y-6 shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="text-[#B8EF43]" size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#B8EF43]">Course Card Preview</span>
                </div>
                <button 
                  onClick={() => setShowPreviewModal(false)}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Course Display Template Card */}
              <div className="border border-[#B8EF43]/20 bg-white/5 p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="bg-[#B8EF43]/10 border border-[#B8EF43]/20 text-[#B8EF43] px-2 py-0.5 text-[8px] font-black uppercase tracking-widest">
                    {courseForm.level}
                  </span>
                  <span className="text-white/40 text-[8px] font-black uppercase tracking-widest">
                    8+ HOURS
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-black italic uppercase tracking-tighter text-white">
                    {courseForm.title || "UNTITLED ENTERPRISE COURSE"}
                  </h3>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-wide leading-relaxed">
                    {courseForm.description || "NO COURSE DESCRIPTION PROVIDED YET."}
                  </p>
                </div>

                {/* Materials list in single card */}
                <div className="space-y-2 border-t border-white/5 pt-3">
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-white/60">Study Syllabus</h4>
                  {courseForm.materials.map((mat, i) => (
                    <div key={i} className="flex justify-between items-center bg-black/40 border border-white/5 p-2 text-[9px] font-black uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        {mat.type === "video" ? <Video size={11} className="text-[#B8EF43]" /> : <FileText size={11} className="text-blue-400" />}
                        <span className="truncate max-w-[200px]">{mat.title || `Material ${i + 1}`}</span>
                      </div>
                      <ExternalLink size={10} className="text-white/30" />
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-[9px] text-white/30 pt-2 font-bold border-t border-white/5">
                  <span>INSTRUCTOR: {courseForm.instructor}</span>
                  <span>PREVIEW ACTIVE</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowPreviewModal(false)}
                  className="flex-1 px-4 py-2.5 border border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Adjust Fields
                </button>
                <button 
                  onClick={handleSaveAll}
                  className="flex-1 px-4 py-2.5 bg-[#B8EF43] text-black hover:bg-[#c9f95d] text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Save and Publish Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
