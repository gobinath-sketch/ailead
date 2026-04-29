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
      <div className="h-[calc(100dvh-120px)] w-full grid grid-rows-[auto_1fr] gap-4 pt-2 pb-2 overflow-hidden">
        <div className="text-center mb-2 max-w-3xl mx-auto">
          <p className="inline-block px-3 py-1 rounded-none border border-outskill-lime/30 bg-outskill-lime/10 text-outskill-lime text-xs font-bold tracking-widest uppercase mb-3">
            The Knowledge Stack
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-xl mb-2">
            Curriculum Depth
          </h2>
          <p className="text-gray-300 font-light text-sm md:text-base">
            A deeply structured, step-by-step pathway designed to transform novices into highly capable AI operators. We do not teach tools; we teach fundamental AI literacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          {modules.map((module) => (
             <article key={module.title} className="module-card p-5 group">
               <div className="relative z-10 flex flex-col h-full">
                 <header className="module-card-title">
                   <h3 className="text-xl font-bold text-white leading-tight">
                     {module.title}
                   </h3>
                 </header>
                 
                 <p className="text-gray-300 font-light leading-relaxed text-sm flex-grow">
                   {module.description}
                 </p>
                 
                 <div className="mt-4 pt-4 border-t border-white/5">
                   <p className="text-xs uppercase tracking-widest text-outskill-lime mb-3 font-semibold">
                     Acquired Skills
                   </p>
                   <div className="flex flex-wrap gap-2">
                     {module.skills.map(skill => (
                       <span key={skill} className="module-skill-chip">
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
