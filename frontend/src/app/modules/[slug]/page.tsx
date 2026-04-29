import { SiteFrame } from "@/components/site-frame";
import { moduleData } from "@/lib/modules";
import { notFound } from "next/navigation";
import { ModuleNavigator } from "@/components/module-navigator";

export default async function ModuleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const selectedModule = moduleData[slug as keyof typeof moduleData];

  if (!selectedModule) {
    notFound();
  }

  const isGenerativeModule = selectedModule.title.toLowerCase().includes("generative");
  const isAgenticModule = selectedModule.title.toLowerCase().includes("agentic");
  const isVibeCodingModule = selectedModule.title.toLowerCase().includes("vibe");
  const isVisualModule = selectedModule.title.toLowerCase().includes("visual");

  return (
    <SiteFrame title={`${selectedModule.title} | Module Explorer`}>
      <ModuleNavigator currentSlug={slug} />
      <div className="w-full h-[calc(100vh-140px)] flex flex-col gap-4 py-2 overflow-hidden">

        {/* Title Section */}
        <div className="border-b border-white/10 pb-4">
          <h2 className="text-3xl font-bold text-white tracking-tight">{selectedModule.title}</h2>
          <p className="text-xs text-outskill-lime font-bold uppercase tracking-widest mt-1 opacity-80">{selectedModule.subtitle}</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8 h-full min-h-0">

          {/* Left: Comprehensive Explanation */}
          <div className="flex flex-col overflow-hidden h-full">
            <section className="glass-panel p-8 border-white/10 bg-black/40 flex flex-col h-full min-h-0">
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-outskill-lime mb-6">
                {isGenerativeModule ? "Brief About Gen AI" : isAgenticModule ? "Brief About Agentic AI" : isVibeCodingModule ? "Brief About Vibe Coding" : isVisualModule ? "Brief About Visual Storytelling" : "Module Overview"}
              </h3>
              <div className="overflow-hidden flex-grow">
                {isGenerativeModule ? (
                  <div className="text-gray-200 leading-relaxed font-light space-y-3 text-sm">
                    <p className="text-lg text-white font-semibold">What is Generative AI?</p>
                    <p>Generative AI (Gen AI) is a type of artificial intelligence that can create new content such as text, images, code, audio, or video by learning patterns from existing data.</p>
                    <div>
                      <p className="font-semibold text-white mb-1">How it works (simple)</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>It is trained on large amounts of data</li>
                        <li>It learns patterns, structure, and relationships</li>
                        <li>When you give input (prompt), it generates new content based on that learning</li>
                      </ul>
                    </div>
                    <div className="border-t border-white/10 pt-3">
                      <p className="font-semibold text-white mb-1">Simple Example</p>
                      <div className="glass-panel p-3 border-white/5 bg-white/[0.03] space-y-1">
                        <p className="text-xs text-gray-400">You type: <span className="text-white">&quot;Write a story about space&quot;</span></p>
                        <p className="text-xs text-gray-400">ChatGPT creates a new story instantly</p>
                        <p className="text-outskill-lime text-[10px] font-bold uppercase tracking-wide">The story is not copied — it is generated</p>
                      </div>
                    </div>
                    <div className="border-t border-white/10 pt-3">
                      <p className="font-semibold text-white mb-2">Key Features</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="glass-panel p-2 border-white/5 bg-white/[0.03]">
                          <p className="text-xs text-gray-300">Creates new, original content</p>
                        </div>
                        <div className="glass-panel p-2 border-white/5 bg-white/[0.03]">
                          <p className="text-xs text-gray-300">Works from patterns in data</p>
                        </div>
                        <div className="glass-panel p-2 border-white/5 bg-white/[0.03]">
                          <p className="text-xs text-gray-300">Supports text, image, video, code</p>
                        </div>
                        <div className="glass-panel p-2 border-white/5 bg-white/[0.03]">
                          <p className="text-xs text-gray-300">Used in automation, design, media</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : isAgenticModule ? (
                  <div className="text-gray-200 leading-relaxed font-light space-y-3 text-sm">
                    <p className="text-lg text-white font-semibold">What is Agentic AI?</p>
                    <p>Agentic AI is a type of AI that can think, plan, and act on its own to complete a goal — not just respond to a prompt.</p>
                    <p className="text-outskill-lime font-semibold text-xs uppercase tracking-wide">Agentic AI = AI that can do tasks independently like a human assistant</p>
                    <div>
                      <p className="font-semibold text-white mb-1">It can:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Set goals</li>
                        <li>Plan steps</li>
                        <li>Take actions</li>
                        <li>Learn from results</li>
                      </ul>
                    </div>
                    <p>Agentic AI systems can achieve goals with minimal human help and make decisions autonomously.</p>
                    <div className="border-t border-white/10 pt-3">
                      <p className="font-semibold text-white mb-2">How Agentic AI Works (simple flow)</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="glass-panel p-3 border-white/5 bg-white/[0.03]">
                          <p className="text-outskill-lime text-[10px] font-bold uppercase mb-1">① Understand Goal</p>
                          <p className="text-xs text-gray-400">&quot;Build a website&quot;</p>
                        </div>
                        <div className="glass-panel p-3 border-white/5 bg-white/[0.03]">
                          <p className="text-outskill-lime text-[10px] font-bold uppercase mb-1">② Plan Steps</p>
                          <p className="text-xs text-gray-400">Design → Code → Test → Deploy</p>
                        </div>
                        <div className="glass-panel p-3 border-white/5 bg-white/[0.03]">
                          <p className="text-outskill-lime text-[10px] font-bold uppercase mb-1">③ Take Actions</p>
                          <p className="text-xs text-gray-400">Writes code, runs tools, fixes errors</p>
                        </div>
                        <div className="glass-panel p-3 border-white/5 bg-white/[0.03]">
                          <p className="text-outskill-lime text-[10px] font-bold uppercase mb-1">④ Check Results</p>
                          <p className="text-xs text-gray-400">Improves itself via feedback</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-2 italic">Plan → Act → Reflect → Improve is core to Agentic AI</p>
                    </div>
                  </div>
                ) : isVibeCodingModule ? (
                  <div className="text-gray-200 leading-relaxed font-light space-y-3 text-sm">
                    <p className="text-lg text-white font-semibold">What is Vibe Coding?</p>
                    <p>Vibe coding is a modern way of coding where you use AI to write, improve, and manage code by giving instructions (prompts) instead of manually writing everything.</p>
                    <div className="border-t border-white/10 pt-3">
                      <p className="font-semibold text-white mb-2">How it works (simple)</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="glass-panel p-3 border-white/5 bg-white/[0.03]">
                          <p className="text-outskill-lime text-[10px] font-bold uppercase mb-1">① Describe</p>
                          <p className="text-xs text-gray-400">&quot;Build a login page with validation&quot;</p>
                        </div>
                        <div className="glass-panel p-3 border-white/5 bg-white/[0.03]">
                          <p className="text-outskill-lime text-[10px] font-bold uppercase mb-1">② AI Generates</p>
                          <p className="text-xs text-gray-400">UI + logic + structure</p>
                        </div>
                        <div className="glass-panel p-3 border-white/5 bg-white/[0.03]">
                          <p className="text-outskill-lime text-[10px] font-bold uppercase mb-1">③ You Refine</p>
                          <p className="text-xs text-gray-400">&quot;Add JWT auth&quot;, &quot;Make it responsive&quot;</p>
                        </div>
                        <div className="glass-panel p-3 border-white/5 bg-white/[0.03]">
                          <p className="text-outskill-lime text-[10px] font-bold uppercase mb-1">④ AI Updates</p>
                          <p className="text-xs text-gray-400">Improves and fixes automatically</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-2 italic">It becomes a collaborative coding process with AI</p>
                    </div>
                    <div className="border-t border-white/10 pt-3">
                      <p className="font-semibold text-white mb-2">It combines:</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="glass-panel p-2 border-white/5 bg-white/[0.03]"><p className="text-xs text-gray-300">Generative AI (code creation)</p></div>
                        <div className="glass-panel p-2 border-white/5 bg-white/[0.03]"><p className="text-xs text-gray-300">Prompting (instructions)</p></div>
                        <div className="glass-panel p-2 border-white/5 bg-white/[0.03]"><p className="text-xs text-gray-300">Iteration (refinement)</p></div>
                        <div className="glass-panel p-2 border-white/5 bg-white/[0.03]"><p className="text-xs text-gray-300">Tool usage (APIs, frameworks)</p></div>
                      </div>
                    </div>
                    <div className="border-t border-white/10 pt-3">
                      <p className="font-semibold text-white mb-1">Why it matters</p>
                      <ul className="list-disc pl-5 space-y-1 text-gray-400">
                        <li>Faster development</li>
                        <li>Less manual coding</li>
                        <li>Focus on architecture &amp; logic</li>
                        <li>Enables agent-based development workflows</li>
                      </ul>
                    </div>
                  </div>
                ) : isVisualModule ? (
                  <div className="text-gray-200 leading-relaxed font-light space-y-3 text-sm">
                    <p className="text-lg text-white font-semibold">What is Visual Storytelling using AI?</p>
                    <p>AI Visual Storytelling is the process of using artificial intelligence to turn ideas (text prompts) into stories and visual content like images, videos, and animations.</p>
                    <div className="border-t border-white/10 pt-3">
                      <p className="font-semibold text-white mb-2">How it works (simple flow)</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="glass-panel p-3 border-white/5 bg-white/[0.03]">
                          <p className="text-outskill-lime text-[10px] font-bold uppercase mb-1">① Input Idea</p>
                          <p className="text-xs text-gray-400">&quot;A hero saving a futuristic city&quot;</p>
                        </div>
                        <div className="glass-panel p-3 border-white/5 bg-white/[0.03]">
                          <p className="text-outskill-lime text-[10px] font-bold uppercase mb-1">② AI Creates Story</p>
                          <p className="text-xs text-gray-400">Characters, scenes, sequence</p>
                        </div>
                        <div className="glass-panel p-3 border-white/5 bg-white/[0.03]">
                          <p className="text-outskill-lime text-[10px] font-bold uppercase mb-1">③ AI Generates Visuals</p>
                          <p className="text-xs text-gray-400">Images or video for each scene</p>
                        </div>
                        <div className="glass-panel p-3 border-white/5 bg-white/[0.03]">
                          <p className="text-outskill-lime text-[10px] font-bold uppercase mb-1">④ AI Combines</p>
                          <p className="text-xs text-gray-400">Final video, animation, or presentation</p>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-white/10 pt-3">
                      <p className="font-semibold text-white mb-1">Professional Understanding</p>
                      <p className="text-gray-400 text-xs mb-2">AI visual storytelling combines:</p>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="glass-panel p-2 border-white/5 bg-white/[0.03]"><p className="text-xs text-gray-300">Language models → story</p></div>
                        <div className="glass-panel p-2 border-white/5 bg-white/[0.03]"><p className="text-xs text-gray-300">Image/video models → visuals</p></div>
                        <div className="glass-panel p-2 border-white/5 bg-white/[0.03]"><p className="text-xs text-gray-300">Multimodal AI → connects both</p></div>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-2 italic">Idea → final media, end-to-end content creation pipeline</p>
                    </div>
                    <div className="border-t border-white/10 pt-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="font-semibold text-white mb-1 text-xs uppercase tracking-wide">Key Features</p>
                          <ul className="list-disc pl-4 space-y-1 text-gray-400 text-xs">
                            <li>Converts text → visuals</li>
                            <li>Maintains story continuity</li>
                            <li>Generates original content</li>
                            <li>Automates production</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold text-white mb-1 text-xs uppercase tracking-wide">Where it is used</p>
                          <ul className="list-disc pl-4 space-y-1 text-gray-400 text-xs">
                            <li>Movies &amp; short films</li>
                            <li>Marketing videos</li>
                            <li>YouTube / Reels</li>
                            <li>Game design &amp; Education</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xl md:text-2xl text-gray-200 leading-relaxed font-light">
                    {selectedModule.description}
                  </p>
                )}
              </div>

              {/* Explore More CTA at the bottom of left panel */}
              <div className="mt-auto pt-6">
                <a
                  href={selectedModule.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta w-full text-center py-3 text-xs block"
                >
                  Explore More
                </a>
              </div>
            </section>
          </div>

          {/* Right: Video + Architecture Brief */}
          <div className="flex flex-col h-full overflow-hidden gap-4">
            <div className="flex-grow glass-panel border-white/20 bg-black overflow-hidden relative shadow-[0_0_50px_rgba(184,239,67,0.1)]">
              {selectedModule.video ? (
                <video
                  src={selectedModule.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain object-top transition-all duration-1000"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-white/5">
                  <span className="text-gray-700 uppercase tracking-widest text-xs font-bold">Module Visual Data Missing</span>
                </div>
              )}
            </div>

            {/* Architecture Brief */}
            <div className="glass-panel p-6 border-white/5 bg-white/[0.02]">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-[10px] uppercase tracking-widest text-outskill-lime font-bold">Architecture Brief</h4>
                <div className="flex gap-4">
                  <div className="text-right">
                    <p className="text-[8px] text-gray-400 uppercase font-bold">Latency</p>
                    <p className="text-[10px] text-white font-mono">14ms</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] text-gray-400 uppercase font-bold">Tokens/Sec</p>
                    <p className="text-[10px] text-white font-mono">2.4k</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed font-light mb-4">
                The visual feed demonstrates the end-to-end synthesis pipeline. We map high-dimensional embedding vectors through recursive attention layers to generate real-time, contextually-aware outputs.
              </p>
              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                <div>
                  <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Compute Layer</p>
                  <p className="text-[10px] text-white font-mono uppercase tracking-tighter">NVIDIA H100 Cluster</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Model State</p>
                  <p className="text-[10px] text-outskill-lime font-bold uppercase tracking-tighter">OPTIMIZED</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </SiteFrame>
  );
}
