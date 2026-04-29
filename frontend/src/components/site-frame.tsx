import Link from "next/link";
import React from "react";

const links = [
  ["/", "Home"],
  ["/program", "Program"],
  ["/schedule", "Schedule"],
  ["/mentors", "Mentors"],
  ["/modules", "Modules"],
  ["/certificate", "Certificate"],
];

interface SiteFrameProps {
  title: string;
  children: React.ReactNode;
}

export function SiteFrame({ title, children }: SiteFrameProps) {
  const isHome = title === "Lead with AI";
  
  return (
    <div className={`shell relative ${isHome ? 'h-screen overflow-hidden' : ''}`}>
      {/* Universal Desktop Background */}
      <div 
        className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ backgroundImage: `url('/bg/1e5a5ff11f4a6bb60f86b9361ab0aaa3.jpg')` }}
      >
        {/* Dark overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70" />
      </div>

      {/* Fixed Navigation for premium feel */}
      <div className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-center">
        <header className="nav-pill flex items-center justify-between gap-8 max-w-7xl xl:max-w-[1440px] w-full hover:bg-black/80 transition-all duration-500">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-outskill-lime inline-block shadow-[0_0_10px_#B8EF43] opacity-90"></span>
              Upskill
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-2">
            {links.map(([href, label]) => (
              <Link key={href} href={href} className="nav-link px-4 py-2 text-sm">
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
             <Link href="/register" className="cta text-sm py-2 px-5 hidden sm:block">
                Start Now
             </Link>
          </div>
        </header>
      </div>

      {/* Main Content Area - padded top to account for fixed header */}
      <main className={`px-4 pt-24 flex flex-col items-center relative z-10 w-full ${isHome ? 'h-full pb-0' : 'min-h-[100dvh] pb-12'}`}>
        <div className="w-full max-w-7xl xl:max-w-[1440px]">{children}</div>
      </main>
    </div>
  );
}
