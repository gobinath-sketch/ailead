import { SiteFrame } from "@/components/site-frame";
import Link from "next/link";

export default function CertificatePage() {
  return (
    <SiteFrame title="Completion Certificate">
      <div className="w-full py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] gap-12 items-center">
          
          <div className="flex flex-col gap-6">
            <p className="inline-block w-fit px-3 py-1 rounded-none border border-outskill-lime/30 bg-outskill-lime/10 text-outskill-lime text-xs font-bold tracking-widest uppercase">
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
                <div className="w-8 h-8 rounded-none bg-white/10 flex items-center justify-center shrink-0 mt-1 border border-white/20">
                  <span className="text-outskill-lime font-bold">1</span>
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Blockchain Secured</h4>
                  <p className="text-gray-400 text-sm mt-1">Easily verifiable endpoint allowing employers to cryptographicly confirm your graduation status and exact transcript.</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-none bg-white/10 flex items-center justify-center shrink-0 mt-1 border border-white/20">
                  <span className="text-outskill-lime font-bold">2</span>
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Portfolio Linked</h4>
                  <p className="text-gray-400 text-sm mt-1">Directly connects recruiters to the exact Agentic workflows and prompts you engineered during the program.</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-none bg-white/10 flex items-center justify-center shrink-0 mt-1 border border-white/20">
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
            <div className="absolute inset-0 bg-outskill-lime/20 blur-[60px] rounded-none"></div>
            <article className="glass-panel p-2 relative shadow-2xl border-white/20 rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="border border-white/10 bg-black/80 rounded-none p-1 flex items-center justify-center relative overflow-hidden group">
                 <img 
                   src="/AILeads/certificate-mockup.png" 
                   alt="Certificate Mockup" 
                   className="w-full h-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-500" 
                 />
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
