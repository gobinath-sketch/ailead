import { SiteFrame } from "@/components/site-frame";
import Link from "next/link";

export default function CertificatePage() {
  return (
    <SiteFrame title="Completion Certificate">
      <div className="w-full py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] gap-12 items-center">
          
          <div className="flex flex-col gap-6">
            <p className="inline-block w-fit px-3 py-1 rounded-full border border-outskill-lime/30 bg-outskill-lime/10 text-outskill-lime text-xs font-bold tracking-widest uppercase">
              Verifiable Execution
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-xl leading-tight">
              A Credential Built on <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-outskill-lime to-white">Demonstrable Skill.</span>
            </h2>
            <p className="text-gray-300 font-light text-lg">
              Participation trophies do not advance careers. This certificate is awarded strictly to those who successfully construct, test, and deploy functional AI architectures during the intensive bootcamp.
            </p>
            
            <div className="mt-6 space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-1 border border-white/20">
                  <span className="text-outskill-lime font-bold">1</span>
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Blockchain Secured</h4>
                  <p className="text-gray-400 text-sm mt-1">Easily verifiable endpoint allowing employers to cryptographicly confirm your graduation status and exact transcript.</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-1 border border-white/20">
                  <span className="text-outskill-lime font-bold">2</span>
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Portfolio Linked</h4>
                  <p className="text-gray-400 text-sm mt-1">Directly connects recruiters to the exact Agentic workflows and prompts you engineered during the program.</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-1 border border-white/20">
                  <span className="text-outskill-lime font-bold">3</span>
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">LinkedIn Authorized</h4>
                  <p className="text-gray-400 text-sm mt-1">One-click integration to display your credential natively under your absolute Education and Certifications tab.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            {/* Certificate Display Mockup */}
            <div className="absolute inset-0 bg-outskill-lime/20 blur-[60px] rounded-full"></div>
            <article className="glass-panel p-2 relative shadow-2xl border-white/20 rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="border border-white/10 bg-black/80 rounded-xl p-8 text-center h-[500px] flex flex-col justify-between" style={{ backgroundImage: "radial-gradient(circle at center, rgba(30,30,30,1) 0%, rgba(0,0,0,1) 100%)" }}>
                 <div className="opacity-80">
                   <p className="text-[10px] tracking-[0.3em] uppercase text-gray-500 mb-2">Proof of Competence</p>
                   <span className="inline-block w-8 h-8 rounded-full border border-outskill-lime/50 flex items-center justify-center shadow-[0_0_10px_#B8EF43]">
                     <span className="w-3 h-3 bg-outskill-lime rounded-full"></span>
                   </span>
                 </div>
                 
                 <div>
                   <h3 className="text-2xl font-serif text-white mb-2">Lead with AI</h3>
                   <p className="text-outskill-lime uppercase tracking-widest text-xs font-semibold mb-6">Certified Practitioner</p>
                   
                   <p className="text-[10px] text-gray-500 max-w-[200px] mx-auto uppercase">Has successfully demonstrated mastery in Prompt Architecture & Autonomous Agents.</p>
                 </div>
                 
                 <div className="border-t border-white/10 pt-4 flex justify-between px-4">
                   <div className="text-left">
                     <p className="font-signature text-gray-400 text-sm">Instructor</p>
                     <div className="h-px w-16 bg-white/20 mt-1"></div>
                   </div>
                   <div className="text-right">
                     <p className="text-gray-400 text-[9px] uppercase tracking-wider">Date Issued</p>
                     <p className="text-white text-xs font-mono mt-1">2026.04</p>
                   </div>
                 </div>
              </div>
            </article>
            
            <div className="mt-8 text-center flex flex-col gap-3">
              <Link href="/register" className="cta w-full text-center block">Access The Program</Link>
              <Link href="/program" className="text-xs text-gray-400 hover:text-white transition-colors uppercase tracking-widest">Review Curriculum</Link>
            </div>
          </div>
          
        </div>
      </div>
    </SiteFrame>
  );
}
