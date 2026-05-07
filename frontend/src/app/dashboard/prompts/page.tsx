"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { Terminal, Copy, Check, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { API_ENDPOINTS, apiUrl } from "@/lib/api-config";

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const res = await fetch(apiUrl(API_ENDPOINTS.lms.prompts));
      if (res.ok) {
        setPrompts(await res.json());
      }
    } catch (e) {
      console.error("Failed to fetch prompts:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Extract unique categories dynamically from seeded database
  const categories = ["ALL", ...Array.from(new Set(prompts.map(p => p.category.toUpperCase())))];

  const filteredPrompts = prompts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.category.toLowerCase().includes(search.toLowerCase()) ||
                          p.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "ALL" || p.category.toUpperCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white font-sans">
      <DashboardSidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      
      {/* Dynamic Grid Background Overlay */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '30px 30px' }} />

      <motion.div 
        animate={{ paddingLeft: isSidebarCollapsed ? "80px" : "280px" }}
        transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
        className="relative z-10 w-full min-h-screen flex flex-col"
      >
        <DashboardHeader />
        
        <main className="flex-1 p-8 space-y-8">
          <header className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 text-[#B8EF43] mb-1">
                <Sparkles size={14} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em]">AI Prompt System Live</span>
              </div>
              <h1 className="text-4xl font-black italic uppercase tracking-tighter">Prompt Toolbox</h1>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">
                Currently serving {prompts.length} high-performance engineered prompts
              </p>
            </div>
          </header>

          {/* Search and Filters Section */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input 
                  type="text" 
                  placeholder="Search prompts by persona, content, or tags..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 pl-12 pr-6 py-4 text-xs font-bold uppercase tracking-wider outline-none focus:border-[#B8EF43]/50 transition-all placeholder-white/20"
                />
              </div>
            </div>

            {/* Premium Category Filter Pills */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all border ${
                    selectedCategory === cat 
                      ? "border-[#B8EF43] bg-[#B8EF43]/10 text-[#B8EF43]" 
                      : "border-white/10 bg-white/5 hover:border-white/30 text-white/60"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Grid Section */}
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin h-8 w-8 border-2 border-[#B8EF43] border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredPrompts.map((prompt) => (
                  <motion.div 
                    key={prompt.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="border border-white/10 bg-white/5 p-6 flex flex-col group hover:border-[#B8EF43]/30 transition-all relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-1 bg-white/[0.02] border-l border-b border-white/10 text-[8px] font-black uppercase tracking-widest text-white/30 px-2 py-0.5">
                      {prompt.category}
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-[#B8EF43]/10 text-[#B8EF43] border border-[#B8EF43]/20">
                        <Terminal size={16} />
                      </div>
                      <h3 className="text-lg font-black italic uppercase tracking-tight text-white group-hover:text-[#B8EF43] transition-colors">
                        {prompt.title}
                      </h3>
                    </div>
                    
                    <p className="text-[10px] text-white/40 uppercase font-bold leading-relaxed mb-6 flex-1 line-clamp-3">
                      {prompt.description || "Activate this engineered context persona to execute specialized platform commands."}
                    </p>
                    
                    <button 
                      onClick={() => handleCopy(prompt.id, prompt.content)}
                      className="w-full py-3 bg-white text-black font-black text-[9px] uppercase tracking-widest hover:bg-[#B8EF43] transition-all flex justify-center items-center gap-2"
                    >
                      {copiedId === prompt.id ? (
                        <>
                          <Check size={12} className="text-emerald-600" /> 
                          <span className="text-emerald-600">Copied to Clipboard</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} /> 
                          <span>Copy Prompt Payload</span>
                        </>
                      )}
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {!loading && filteredPrompts.length === 0 && (
            <div className="text-center py-12 border border-dashed border-white/10 bg-white/[0.01]">
              <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">No matching engineered prompts found.</p>
            </div>
          )}
        </main>
      </motion.div>
    </div>
  );
}
