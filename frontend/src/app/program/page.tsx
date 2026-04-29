import { SiteFrame } from "@/components/site-frame";
import { Marquee } from "@/components/marquee";
import Link from "next/link";

export default function ProgramPage() {
  return (
    <SiteFrame title="Program Value">
      <div className="pt-20 pb-16 w-full">
        <div className="mb-16">
          <p className="inline-block px-3 py-1 rounded-none border border-outskill-lime/30 bg-outskill-lime/10 text-outskill-lime text-xs font-bold tracking-widest uppercase mb-4">
            Why Attend?
          </p>
          <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight drop-shadow-xl mb-6 leading-tight">
            AI Fluency for <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-outskill-lime to-white">Real-World Execution.</span>
          </h2>
          <p className="text-xl text-gray-300 font-light leading-relaxed max-w-3xl drop-shadow-md">
            This intensive program bridges the gap between passive curiosity and active capability. We bypass the hype cycle and focus purely on functional, high-leverage workflows. You will leave with the capability to ask better questions, validate sophisticated data models, and build tools that drastically cut down your operational time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-panel p-6 border-outskill-lime/20 shadow-[0_0_15px_rgba(184,239,67,0.05)]">
            <div className="w-10 h-10 rounded-none bg-white/10 flex items-center justify-center mb-4 text-outskill-lime">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Accelerated Literacy</h3>
            <p className="text-sm text-gray-400">Rapidly grow the critical data and AI intuition demanded by modern enterprises.</p>
          </div>
          <div className="glass-panel p-6">
            <div className="w-10 h-10 rounded-none bg-white/10 flex items-center justify-center mb-4 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Symbiotic Workflows</h3>
            <p className="text-sm text-gray-400">Establish Human + AI collaboration as your team&apos;s baseline operating model.</p>
          </div>
          <div className="glass-panel p-6">
            <div className="w-10 h-10 rounded-none bg-white/10 flex items-center justify-center mb-4 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Ethics & Integrity</h3>
            <p className="text-sm text-gray-400">Use responsible guardrails as a competitive advantage to ensure enterprise safety.</p>
          </div>
        </div>

        <div className="glass-panel p-8 mb-16 text-center bg-black/40">
           <h3 className="text-xl font-bold text-white mb-6">The Five Pillars of AI Integration</h3>
           <div className="flex flex-wrap justify-center gap-3">
             {["Strategic Clarity", "Precision Prompting", "Diagnostic Verification", "Workflow Automation", "Bottom-Line Impact"].map((item) => (
               <div key={item} className="px-5 py-3 rounded-none border border-white/20 bg-white/5 text-sm font-semibold tracking-wide text-gray-200">
                 {item}
               </div>
             ))}
           </div>
        </div>
        
        <div className="text-center mt-12 mb-8">
           <Link href="/modules" className="cta inline-block w-auto">Dive Into The Syllabus</Link>
        </div>
        
        {/* Adds massive scrolling proof to program page too */}
        <div className="-mx-4 w-[calc(100%+2rem)] border-t border-white/10 pt-8 mt-12">
            <p className="text-center text-sm uppercase tracking-[0.2em] font-semibold text-outskill-lime mb-2">Alumni Hiring Landscape</p>
            <Marquee />
        </div>
      </div>
    </SiteFrame>
  );
}
