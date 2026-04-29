import { SiteFrame } from "@/components/site-frame";
import Link from "next/link";

export default function SchedulePage() {
  return (
    <SiteFrame title="Event Schedule">
      <div className="pt-20 pb-24 w-full">
        <div className="text-center mb-16">
          <p className="inline-block px-3 py-1 rounded-none border border-outskill-lime/30 bg-outskill-lime/10 text-outskill-lime text-xs font-bold tracking-widest uppercase mb-4">
            Timeline
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-xl mb-4">
            Structured for Velocity
          </h2>
          <p className="text-gray-300 font-light text-lg">
            Two intense days of immersive learning, practical teardowns, and live architecture building.
          </p>
        </div>

        <div className="space-y-12">
          {/* Day 1 */}
          <div className="glass-panel p-8 relative">
            <div className="absolute top-0 right-0 p-4">
              
            </div>
            <h3 className="text-2xl font-bold text-outskill-lime border-b border-white/10 pb-4 mb-6">Day 1: Foundations & Architecture</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-[100px_1fr] gap-4 items-start">
                <div className="text-sm font-semibold text-gray-400 mt-1">09:00 AM</div>
                <div>
                  <h4 className="text-lg font-bold text-white">The Generative Mindset</h4>
                  <p className="text-sm text-gray-400 mt-2">Dismantling preconceived notions of AI capabilities and resetting baseline understanding of large language models.</p>
                </div>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-4 items-start">
                <div className="text-sm font-semibold text-gray-400 mt-1">11:30 AM</div>
                <div>
                  <h4 className="text-lg font-bold text-white">Advanced Prompting Workshop</h4>
                  <p className="text-sm text-gray-400 mt-2">Hands-on tear down of brittle prompts. Rebuilding them using few-shot methodologies and system constraints.</p>
                </div>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-4 items-start">
                <div className="text-sm font-semibold text-gray-400 mt-1">02:00 PM</div>
                <div>
                  <h4 className="text-lg font-bold text-white">Agentic Workflows Part I</h4>
                  <p className="text-sm text-gray-400 mt-2">Transitioning from text generation to task delegation. Creating the first personalized agent.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Day 2 */}
          <div className="glass-panel p-8 relative">
            <div className="absolute top-0 right-0 p-4">
            </div>
            <h3 className="text-2xl font-bold text-outskill-lime border-b border-white/10 pb-4 mb-6">Day 2: Multimodality & Integration</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-[100px_1fr] gap-4 items-start">
                <div className="text-sm font-semibold text-gray-400 mt-1">09:00 AM</div>
                <div>
                  <h4 className="text-lg font-bold text-white">Visual Content Synthesis</h4>
                  <p className="text-sm text-gray-400 mt-2">Mastering diffusion models. Prompting for precise image generation, branding, and presentation assets.</p>
                </div>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-4 items-start">
                <div className="text-sm font-semibold text-gray-400 mt-1">11:30 AM</div>
                <div>
                  <h4 className="text-lg font-bold text-white">AI Product Prototyping</h4>
                  <p className="text-sm text-gray-400 mt-2">Using low-code AI tooling to build working prototypes of ideas formulated in Day 1.</p>
                </div>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-4 items-start">
                <div className="text-sm font-semibold text-gray-400 mt-1">03:00 PM</div>
                <div>
                  <h4 className="text-lg font-bold text-white">Ethics, Closure & Portfolio</h4>
                  <p className="text-sm text-gray-400 mt-2">Final project presentations, ethical deployment strategies, and graduation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
            <Link href="/register" className="cta text-lg px-8 py-4">Register For Next Cohort</Link>
        </div>
      </div>
    </SiteFrame>
  );
}
