"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { Plus, Trash2, FileText, Save, Download } from "lucide-react";

export default function AdminDocsPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [docs, setDocs] = useState([
    { id: "1", title: "AI Fundamentals Handbook", url: "https://example.com/doc1.pdf", category: "Curriculum", size: "2.4 MB" },
    { id: "2", title: "Prompt Engineering Cheatsheet", url: "https://example.com/doc2.pdf", category: "Reference", size: "580 KB" },
  ]);
  const [newDoc, setNewDoc] = useState({ title: "", url: "", category: "Curriculum", size: "" });

  const handleAdd = () => {
    if (!newDoc.title || !newDoc.url) return;
    setDocs([...docs, { ...newDoc, id: Date.now().toString() }]);
    setNewDoc({ title: "", url: "", category: "Curriculum", size: "" });
    setShowModal(false);
  };

  const handleDelete = (id: string) => setDocs(docs.filter(d => d.id !== id));

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white">
      <DashboardSidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      <motion.div animate={{ paddingLeft: isSidebarCollapsed ? "80px" : "280px" }} className="relative z-10 w-full min-h-screen flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-8">
          <header className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl font-black italic uppercase tracking-tighter">Documents</h1>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">Share PDFs and documents with all learners</p>
            </div>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#B8EF43] text-black px-6 py-3 font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
              <Plus size={16} /> Upload Document
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {docs.map((doc) => (
              <div key={doc.id} className="border border-white/10 bg-white/5 p-6 group hover:border-[#B8EF43]/30 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-white/5 text-[#B8EF43]"><FileText size={24} /></div>
                  <button onClick={() => handleDelete(doc.id)} className="opacity-0 group-hover:opacity-100 p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="font-black uppercase tracking-tight text-sm mb-1">{doc.title}</p>
                <p className="text-white/40 text-[10px] uppercase font-medium mb-6">{doc.category} • {doc.size}</p>
                <a href={doc.url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full bg-white/5 hover:bg-white text-white/60 hover:text-black border border-white/10 py-3 font-black text-[10px] uppercase tracking-widest transition-all">
                  <Download size={14} /> Download
                </a>
              </div>
            ))}
          </div>
        </main>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowModal(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#111] border border-white/10 p-12 max-w-lg w-full">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 text-[#B8EF43]">Upload Document</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-white/40 font-black uppercase tracking-widest">Document Title</label>
                  <input type="text" value={newDoc.title} onChange={e => setNewDoc({ ...newDoc, title: e.target.value })} className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-[#B8EF43]/50" placeholder="e.g. AI Fundamentals Handbook" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-white/40 font-black uppercase tracking-widest">Document URL / Link</label>
                  <input type="url" value={newDoc.url} onChange={e => setNewDoc({ ...newDoc, url: e.target.value })} className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-[#B8EF43]/50" placeholder="https://drive.google.com/..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/40 font-black uppercase tracking-widest">Category</label>
                    <select value={newDoc.category} onChange={e => setNewDoc({ ...newDoc, category: e.target.value })} className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-[#B8EF43]/50 text-white">
                      <option className="bg-black" value="Curriculum">Curriculum</option>
                      <option className="bg-black" value="Reference">Reference</option>
                      <option className="bg-black" value="Assignment">Assignment</option>
                      <option className="bg-black" value="Certificate">Certificate</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/40 font-black uppercase tracking-widest">File Size</label>
                    <input type="text" value={newDoc.size} onChange={e => setNewDoc({ ...newDoc, size: e.target.value })} className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-[#B8EF43]/50" placeholder="e.g. 2.4 MB" />
                  </div>
                </div>
                <button onClick={handleAdd} className="w-full bg-[#B8EF43] text-black font-black py-5 text-xs uppercase tracking-widest hover:scale-105 transition-all flex justify-center items-center gap-2">
                  <Save size={16} /> Save Document
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
