"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { Plus, Trash2, Link as LinkIcon, Save, ExternalLink } from "lucide-react";

export default function AdminLinksPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [links, setLinks] = useState([
    { id: "1", title: "Course Resources Drive", url: "https://drive.google.com", category: "Resource" },
    { id: "2", title: "Community Slack", url: "https://slack.com", category: "Community" },
  ]);
  const [newLink, setNewLink] = useState({ title: "", url: "", category: "Resource" });

  const handleAdd = () => {
    if (!newLink.title || !newLink.url) return;
    setLinks([...links, { ...newLink, id: Date.now().toString() }]);
    setNewLink({ title: "", url: "", category: "Resource" });
    setShowModal(false);
  };

  const handleDelete = (id: string) => setLinks(links.filter(l => l.id !== id));

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white">
      <DashboardSidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      <motion.div animate={{ paddingLeft: isSidebarCollapsed ? "80px" : "280px" }} className="relative z-10 w-full min-h-screen flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-8">
          <header className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl font-black italic uppercase tracking-tighter">Resource Links</h1>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">Broadcast links to all learners</p>
            </div>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#B8EF43] text-black px-6 py-3 font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
              <Plus size={16} /> Add Link
            </button>
          </header>

          <div className="space-y-4">
            {links.map((link) => (
              <div key={link.id} className="border border-white/10 bg-white/5 p-6 flex justify-between items-center group hover:border-[#B8EF43]/30 transition-all">
                <div className="flex items-center gap-6">
                  <div className="p-3 bg-white/5 text-[#B8EF43]"><LinkIcon size={20} /></div>
                  <div>
                    <p className="font-black uppercase tracking-widest text-sm">{link.title}</p>
                    <p className="text-white/40 text-[10px] uppercase font-medium mt-1">{link.category} • {link.url}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <a href={link.url} target="_blank" rel="noreferrer" className="p-3 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all">
                    <ExternalLink size={16} />
                  </a>
                  <button onClick={() => handleDelete(link.id)} className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
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
              <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 text-[#B8EF43]">Add Resource Link</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-white/40 font-black uppercase tracking-widest">Title</label>
                  <input type="text" value={newLink.title} onChange={e => setNewLink({ ...newLink, title: e.target.value })} className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-[#B8EF43]/50" placeholder="e.g. Course Resource Drive" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-white/40 font-black uppercase tracking-widest">URL</label>
                  <input type="url" value={newLink.url} onChange={e => setNewLink({ ...newLink, url: e.target.value })} className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-[#B8EF43]/50" placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-white/40 font-black uppercase tracking-widest">Category</label>
                  <select value={newLink.category} onChange={e => setNewLink({ ...newLink, category: e.target.value })} className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-[#B8EF43]/50 text-white">
                    <option className="bg-black" value="Resource">Resource</option>
                    <option className="bg-black" value="Community">Community</option>
                    <option className="bg-black" value="Tool">Tool</option>
                    <option className="bg-black" value="Reference">Reference</option>
                  </select>
                </div>
                <button onClick={handleAdd} className="w-full bg-[#B8EF43] text-black font-black py-5 text-xs uppercase tracking-widest hover:scale-105 transition-all flex justify-center items-center gap-2">
                  <Save size={16} /> Save Link
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
