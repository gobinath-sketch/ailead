"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const moduleOrder = ["generative-ai", "agentic-ai", "vibe-coding", "visual-storytelling"];

interface ModuleNavigatorProps {
  currentSlug: string;
}

export function ModuleNavigator({ currentSlug }: ModuleNavigatorProps) {
  const router = useRouter();
  const currentIndex = moduleOrder.indexOf(currentSlug);

  const prevModule = currentIndex > 0 ? moduleOrder[currentIndex - 1] : null;
  const nextModule = currentIndex < moduleOrder.length - 1 ? moduleOrder[currentIndex + 1] : null;

  const navigateTo = (slug: string | null) => {
    if (slug) {
      router.push(`/modules/${slug}`);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        navigateTo(prevModule);
      } else if (e.key === "ArrowRight") {
        navigateTo(nextModule);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevModule, nextModule]);

  return (
    <div className="fixed inset-y-0 left-0 right-0 pointer-events-none z-40 flex items-center justify-between px-4">
      {/* Previous Button */}
      <button
        onClick={() => navigateTo(prevModule)}
        disabled={!prevModule}
        className={`pointer-events-auto p-4 transition-all duration-300 group border-none bg-transparent ${
          !prevModule ? "opacity-0 invisible" : "opacity-40 hover:opacity-100"
        }`}
        aria-label="Previous Module"
      >
        <div className="flex flex-col items-center gap-2">
           <svg className="w-8 h-8 text-white group-hover:text-outskill-lime transition-all duration-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
           </svg>
           <span className="text-[10px] uppercase tracking-widest text-white/40 group-hover:text-white font-bold transition-colors">Prev</span>
        </div>
      </button>

      {/* Next Button */}
      <button
        onClick={() => navigateTo(nextModule)}
        disabled={!nextModule}
        className={`pointer-events-auto p-4 transition-all duration-300 group border-none bg-transparent ${
          !nextModule ? "opacity-0 invisible" : "opacity-40 hover:opacity-100"
        }`}
        aria-label="Next Module"
      >
         <div className="flex flex-col items-center gap-2">
            <svg className="w-8 h-8 text-white group-hover:text-outskill-lime transition-all duration-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <span className="text-[10px] uppercase tracking-widest text-white/40 group-hover:text-white font-bold transition-colors">Next</span>
         </div>
      </button>
    </div>
  );
}
