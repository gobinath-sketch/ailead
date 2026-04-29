import Link from "next/link";
import { SiteFrame } from "@/components/site-frame";
import { Marquee } from "@/components/marquee";

export default function Home() {
  return (
    <SiteFrame title="Lead with AI">
      <div className="flex flex-col gap-8 pt-4 pb-4">
        
        {/* Cinematic Hero Section */}
        <section className="text-center max-w-4xl mx-auto flex flex-col items-center gap-4 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-outskill-lime/20 blur-[100px] rounded-none pointer-events-none"></div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-none border border-white/10 bg-white/5 backdrop-blur-md mb-2">
            <span className="w-2 h-2 rounded-none bg-outskill-lime shadow-[0_0_8px_#B8EF43] animate-pulse"></span>
            <span className="text-xs font-medium tracking-widest uppercase text-gray-200">Ultimate AI Mastery Syllabus</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight text-white drop-shadow-2xl whitespace-nowrap">
            Architect the Future that Leads with AI
          </h2>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mt-2 font-light drop-shadow-md">
            Transform from a passive user to an AI operator. Build practical confidence, design unbreakable workflows, and become the undisputed standard in your industry.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-6 relative z-10">
            <Link href="/register" className="cta text-lg px-8 py-4">
              Secure Your Access
            </Link>
            <Link href="/program" className="cta-secondary text-lg px-8 py-4">
              Explore Program depth
            </Link>
          </div>
          
          {/* Abstract Stats */}
          <div className="mt-6 pt-4 border-t border-white/10 flex gap-12 justify-center opacity-80 transition-all duration-500">
             <div className="text-center">
               <p className="text-4xl font-bold text-white">2+<span className="text-outskill-lime text-2xl relative -top-3">Days</span></p>
               <p className="text-xs uppercase tracking-widest mt-2 text-gray-400">Intensive Training</p>
             </div>
             <div className="text-center">
               <p className="text-4xl font-bold text-white">100<span className="text-outskill-lime text-2xl relative -top-3">%</span></p>
               <p className="text-xs uppercase tracking-widest mt-2 text-gray-400">Actionable Outcome</p>
             </div>
             <div className="text-center hidden sm:block">
               <p className="text-4xl font-bold text-white">10<span className="text-outskill-lime text-2xl relative -top-3">x</span></p>
               <p className="text-xs uppercase tracking-widest mt-2 text-gray-400">Workflow Impact</p>
             </div>
          </div>
        </section>

        {/* Feature Cards - Glassmorphism */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <article className="glass-panel glass-panel-hover p-6 relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-outskill-lime/10 blur-[40px] rounded-none group-hover:bg-outskill-lime/20 transition-all duration-500"></div>
            
            <h3 className="text-xl font-bold text-white mb-2">Foundational Adoption</h3>
            <p className="text-gray-300 leading-relaxed font-light text-sm">
              We break down large language models to their core. Learn how context windows, system prompts, and memory vectors actually influence AI output. Establish safe data habits from day one.
            </p>
          </article>
          
          <article className="glass-panel glass-panel-hover p-6 relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-outskill-lime/10 blur-[40px] rounded-none group-hover:bg-outskill-lime/20 transition-all duration-500"></div>
            
            <h3 className="text-xl font-bold text-white mb-2">Agentic Implementation</h3>
            <p className="text-gray-300 leading-relaxed font-light text-sm">
              Move beyond treating AI as a search engine. Learn to architect custom, personalized AI agents capable of executing multi-step enterprise workflows using modular prompting strategies.
            </p>
          </article>
          
          <article className="glass-panel glass-panel-hover p-6 relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-outskill-lime/10 blur-[40px] rounded-none group-hover:bg-outskill-lime/20 transition-all duration-500"></div>
            
            <h3 className="text-xl font-bold text-white mb-2">Career Transformation</h3>
            <p className="text-gray-300 leading-relaxed font-light text-sm">
              Finalize prototypes that you can deploy at work the next morning. Turn theory into measurable output that drastically improves your professional velocity and leadership standing.
            </p>
          </article>
        </section>

        {/* Global MNC Marquee representing trusted placement / network */}
        <section className="relative z-10 -mx-4 pb-12 w-[calc(100%+2rem)]">
           <div className="text-center mb-6">
             <p className="text-sm uppercase tracking-[0.2em] font-semibold text-outskill-lime">Our Network & Alumni Landscape</p>
             <p className="text-gray-400 font-light mt-1 text-sm">Join leaders driving AI innovation across the globe.</p>
           </div>
           <Marquee />
        </section>
      </div>
    </SiteFrame>
  );
}
