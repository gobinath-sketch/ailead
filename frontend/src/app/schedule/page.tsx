import { SiteFrame } from "@/components/site-frame";

export default function SchedulePage() {
  return (
    <SiteFrame title="Events">
      <div className="pt-8 pb-12 w-full h-full flex flex-col justify-center">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto w-full">
          {/* Day 1 */}
          <div className="glass-panel p-6 relative flex flex-col">
            <h3 className="text-xl font-bold text-outskill-lime border-b border-white/10 pb-3 mb-4 flex items-center gap-2">
              <span className="bg-outskill-lime text-black px-2 py-0.5 text-xs font-black">01</span>
              Day 1: Foundations & Architecture
            </h3>
            
            <div className="space-y-4 flex-grow">
              <div className="grid grid-cols-[80px_1fr] gap-3 items-start group">
                <div className="text-xs font-bold text-gray-500 group-hover:text-outskill-lime transition-colors mt-1">09:00 AM</div>
                <div>
                  <h4 className="text-base font-bold text-white group-hover:translate-x-1 transition-transform">The Generative Mindset</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">Dismantling preconceived notions of AI capabilities and resetting baseline understanding of large language models.</p>
                </div>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-3 items-start group">
                <div className="text-xs font-bold text-gray-500 group-hover:text-outskill-lime transition-colors mt-1">11:30 AM</div>
                <div>
                  <h4 className="text-base font-bold text-white group-hover:translate-x-1 transition-transform">Advanced Prompting Workshop</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">Hands-on tear down of brittle prompts. Rebuilding them using few-shot methodologies and system constraints.</p>
                </div>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-3 items-start group">
                <div className="text-xs font-bold text-gray-500 group-hover:text-outskill-lime transition-colors mt-1">02:00 PM</div>
                <div>
                  <h4 className="text-base font-bold text-white group-hover:translate-x-1 transition-transform">Agentic Workflows Part I</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">Transitioning from text generation to task delegation. Creating the first personalized agent.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Day 2 */}
          <div className="glass-panel p-6 relative flex flex-col">
            <h3 className="text-xl font-bold text-outskill-lime border-b border-white/10 pb-3 mb-4 flex items-center gap-2">
              <span className="bg-outskill-lime text-black px-2 py-0.5 text-xs font-black">02</span>
              Day 2: Multimodality & Integration
            </h3>
            
            <div className="space-y-4 flex-grow">
              <div className="grid grid-cols-[80px_1fr] gap-3 items-start group">
                <div className="text-xs font-bold text-gray-500 group-hover:text-outskill-lime transition-colors mt-1">09:00 AM</div>
                <div>
                  <h4 className="text-base font-bold text-white group-hover:translate-x-1 transition-transform">Visual Content Synthesis</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">Mastering diffusion models. Prompting for precise image generation, branding, and presentation assets.</p>
                </div>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-3 items-start group">
                <div className="text-xs font-bold text-gray-500 group-hover:text-outskill-lime transition-colors mt-1">11:30 AM</div>
                <div>
                  <h4 className="text-base font-bold text-white group-hover:translate-x-1 transition-transform">AI Product Prototyping</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">Using low-code AI tooling to build working prototypes of ideas formulated in Day 1.</p>
                </div>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-3 items-start group">
                <div className="text-xs font-bold text-gray-500 group-hover:text-outskill-lime transition-colors mt-1">03:00 PM</div>
                <div>
                  <h4 className="text-base font-bold text-white group-hover:translate-x-1 transition-transform">Ethics, Closure & Portfolio</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">Final project presentations, ethical deployment strategies, and graduation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </SiteFrame>
  );
}
