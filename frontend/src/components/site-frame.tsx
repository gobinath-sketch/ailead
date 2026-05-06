import Link from "next/link";
import React from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/program", label: "Program" },
  { href: "/schedule", label: "Events" },
  { href: "/mentors", label: "Mentors" },
  { href: "/certificate", label: "Certificate" },
];



const mainModules = [
  { name: "Generative AI", slug: "generative-ai" },
  { name: "Agentic AI", slug: "agentic-ai" },
  { name: "Vibe Coding", slug: "vibe-coding" },
  { name: "Visual Storytelling", slug: "visual-storytelling" },
];

import { Chatbot } from "./chatbot";
import { CommunityPanel } from "./community-panel";

interface SiteFrameProps {
  title: string;
  children: React.ReactNode;
}

export function SiteFrame({ title, children }: SiteFrameProps) {
  const isNoScroll = title === "Global Knowledge Technologies" || title === "Program Details" || title === "Event Schedule" || title === "Your Mentors" || title.includes("Module Explorer");
  
  return (
    <div className={`shell relative ${isNoScroll ? 'h-screen overflow-hidden' : ''}`}>
      {/* Universal Desktop Background */}
      <div 
        className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ backgroundImage: `url('/AILeads/bg/1e5a5ff11f4a6bb60f86b9361ab0aaa3.jpg')` }}
      >
        {/* Dark overlay for legibility (brightened) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70" />
      </div>

      {/* Fixed Navigation for premium feel */}
      <div className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-center">
        <header className="nav-pill flex items-center justify-between gap-8 max-w-7xl xl:max-w-[1440px] w-full hover:bg-black/80 transition-all duration-500">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
              <img src="/AILeads/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
              Global Knowledge Technologies
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-0.5">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="nav-link px-3 py-2 text-sm whitespace-nowrap">
                {link.label}
              </Link>
            ))}
            
            {/* Modules Dropdown */}
            <div className="relative group px-1">
              <button className="nav-link flex items-center gap-1.5 px-3 py-2 text-sm cursor-pointer border-none bg-transparent">
                Modules
                <svg className="w-3 h-3 opacity-60 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              <div className="absolute top-full left-0 pt-3 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-none p-2 min-w-[220px] shadow-2xl">
                  {mainModules.map((m) => (
                    <Link 
                      key={m.slug} 
                      href={`/modules/${m.slug}`}
                      className="flex flex-col px-4 py-3 rounded-none hover:bg-white/5 transition-colors group/item"
                    >
                      <span className="text-white text-sm font-semibold group-hover/item:text-outskill-lime transition-colors">
                        {m.name}
                      </span>
                      
                    </Link>
                  ))}
                  <div className="mt-2 pt-2 border-t border-white/5">
                  
                  </div>
                </div>
              </div>
            </div>


          </nav>
          <div className="flex items-center gap-3">
             <Link href="/login" className="cta text-sm py-2 px-5 hidden sm:block">
                Login
             </Link>
             <Link href="/register" className="cta text-sm py-2 px-5 hidden sm:block">
                Register
             </Link>
          </div>
        </header>
      </div>

      {/* Main Content Area - padded top to account for fixed header */}
      <main className={`px-4 pt-24 flex flex-col items-center relative z-10 w-full ${isNoScroll ? 'h-full pb-0' : 'min-h-[100dvh] pb-12'}`}>
        <div className="w-full max-w-7xl xl:max-w-[1440px]">{children}</div>
      </main>

      {/* Global Chatbot */}
      <Chatbot />
      {/* Community Slide-In Panel */}
      <CommunityPanel />
    </div>
  );
}
