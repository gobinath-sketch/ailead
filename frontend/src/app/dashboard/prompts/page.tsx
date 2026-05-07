"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { Terminal, Copy, Check, Search, Filter } from "lucide-react";
import { API_ENDPOINTS, apiUrl } from "@/lib/api-config";

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    const res = await fetch(apiUrl(API_ENDPOINTS.lms.prompts));
    if (res.ok) {
      setPrompts(await res.json());
    } else {
      // Fallback data if API fails or is empty
      setPrompts([
        { id: '1', title: 'System Architect Persona', category: 'General', description: 'Transform AI into a senior system architect.', content: 'You are an expert system architect with 20 years of experience...' },
        { id: '2', title: 'Refactoring Specialist', category: 'Coding', description: 'Optimization focused refactoring.', content: 'Review the following code for technical debt...' },
      ]);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredPrompts = prompts.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

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
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">Prompt Toolbox</h1>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">Ready-to-use high-performance AI prompts</p>
          </header>

          <div className="flex gap-4 mb-8">
             <div className="flex-1 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input 
                  type="text" 
                  placeholder="Search prompts..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 pl-12 pr-6 py-4 text-sm outline-none focus:border-[#B8EF43]/50 transition-all"
                />
             </div>
             <button className="px-6 py-4 border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                <Filter size={16} /> Filter
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map((prompt) => (
              <motion.div 
                key={prompt.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-white/10 bg-white/5 p-6 flex flex-col group hover:border-[#B8EF43]/30 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-[#B8EF43]/10 text-[#B8EF43]">
                     <Terminal size={18} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/30">{prompt.category}</span>
                </div>
                
                <h3 className="text-lg font-black italic uppercase tracking-tight mb-2">{prompt.title}</h3>
                <p className="text-xs text-white/40 uppercase font-medium mb-8 flex-1">{prompt.description}</p>
                
                <button 
                  onClick={() => handleCopy(prompt.id, prompt.content)}
                  className="w-full py-3 bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-[#B8EF43] transition-all flex justify-center items-center gap-2"
                >
                  {copiedId === prompt.id ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy Prompt</>}
                </button>
              </motion.div>
            ))}
          </div>
        </main>
      </motion.div>
    </div>
  );
}
