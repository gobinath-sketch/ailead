import { SiteFrame } from "@/components/site-frame";

const modules = [
  {
    title: "Generative Architecture & Core Mechanics",
    skills: ["LLM Behavioral Analysis", "Privacy Frameworks", "Token Economics"],
    description: "Before driving, you must understand the engine. This module strips away the magic of Generative AI to reveal the underlying mechanisms. You will learn precisely how transformer models generate tokens, where hallucinations occur, and how to construct a robust mental model for safe, enterprise-grade AI adoption."
  },
  {
    title: "Advanced Prompt Frameworks & Context Routing",
    skills: ["Few-Shot Prompting", "Chain of Thought", "System Directives"],
    description: "Stop writing brittle prompts. We teach you how to engineer instructions that reliably extract high-fidelity outputs. This module covers the science of context window management, role-play framing, and iterative prompt design to guarantee the AI consistently executes complex commands without deviation."
  },
  {
    title: "Autonomous Agents & Multi-Step Workflows",
    skills: ["Agent Design", "Task Decomposition", "Workflow Automation"],
    description: "Transition from single queries to delegated workflows. You will design 'Agentic' systems that can plan, reason, and operate over multiple steps. By the end of this module, you will have configured specialized AI collaborators trained on your specific voice, data, and daily operational needs."
  },
  {
    title: "Multimodal Synthesis & Visual Storytelling",
    skills: ["Prompt-to-Image", "Visual Consistency", "Creative Ideation"],
    description: "Text is only half the equation. Master the art of directing powerful visual AI models. Learn the syntax required for exact artistic control, storyboard generation, and creating pixel-perfect multimodal assets that elevate your presentations, products, and marketing material."
  },
];

export default function ModulesPage() {
  return (
    <SiteFrame title="Curriculum Breakdown">
      <div className="pt-20 pb-24 w-full">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <p className="inline-block px-3 py-1 rounded-full border border-outskill-lime/30 bg-outskill-lime/10 text-outskill-lime text-xs font-bold tracking-widest uppercase mb-4">
            The Knowledge Stack
          </p>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight drop-shadow-xl mb-4">
            Curriculum Depth
          </h2>
          <p className="text-gray-300 font-light text-lg">
            A deeply structured, step-by-step pathway designed to transform novices into highly capable AI operators. We do not teach tools; we teach fundamental AI literacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {modules.map((module) => (
             <article key={module.title} className="glass-panel p-8 relative overflow-hidden group">
               {/* Hover Glow */}
               <div className="absolute -inset-1 bg-gradient-to-r from-outskill-lime/0 via-outskill-lime/10 to-outskill-lime/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur"></div>
               
               <div className="relative z-10 flex flex-col h-full">
                 <header className="border-b border-white/10 pb-6 mb-6">
                   <h3 className="text-2xl font-bold text-white leading-tight">
                     {module.title}
                   </h3>
                 </header>
                 
                 <p className="text-gray-300 font-light leading-relaxed flex-grow">
                   {module.description}
                 </p>
                 
                 <div className="mt-8 pt-6 border-t border-white/5">
                   <p className="text-xs uppercase tracking-widest text-outskill-lime mb-3 font-semibold">
                     Acquired Skills
                   </p>
                   <div className="flex flex-wrap gap-2">
                     {module.skills.map(skill => (
                       <span key={skill} className="px-3 py-1 rounded border border-white/10 bg-white/5 text-xs text-gray-200 backdrop-blur-sm">
                         {skill}
                       </span>
                     ))}
                   </div>
                 </div>
               </div>
             </article>
          ))}
        </div>
      </div>
    </SiteFrame>
  );
}
