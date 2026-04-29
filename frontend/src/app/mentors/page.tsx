import { SiteFrame } from "@/components/site-frame";

const mentors = [
  {
    name: "Sendhil Kumar S",
    role: "Founder and Chairman",
    focus: "AI Learning Strategy & Adoption Roadmaps",
    bio: "Pioneering the shift in enterprise AI adoption, Sendhil establishes the foundational roadmaps that multi-national organizations use to upskill their entire engineering workforce. He translates theoretical AI potential into direct, measurable ROI.",
    achievements: ["Advises Fortune 500 boards on AI transition", "Architected 50+ enterprise transformation roadmaps"]
  },
  {
    name: "Peter Darius",
    role: "AI Technology Leader",
    focus: "Cloud Engineering & Enterprise Systems",
    bio: "Peter leads the technical implementation of LLMs securely within cloud environments. With deep expertise in Kubernetes, AWS, and secure data enclaves, he teaches the critical infrastructural requirements needed to support autonomous agents.",
    achievements: ["Led deployment of secure LLMs for Finance sectors", "Expert in AWS & Neural Network Infrastructure"]
  },
  {
    name: "Dr. Radhika S",
    role: "VP Technical",
    focus: "Neural Networks & Computer Vision",
    bio: "Bringing rigorous academic depth and commercial pragmatism, Dr. Radhika focuses on the exact science of multimodal models. She breaks down the math behind transformers so operators can intuitively understand model behavior and hallucination prevention.",
    achievements: ["Ph.D. in applied Computer Vision", "Published multiple papers on model optimization"]
  },
  {
    name: "Dinesh T",
    role: "Chief Technology Officer",
    focus: "Product Strategy & Applied Architectures",
    bio: "Dinesh connects the dots between raw AI capability and shipping actual products. He teaches the frameworks required to map business problems to AI solutions, ensuring that every prompt and workflow directly solves a customer need.",
    achievements: ["Shipped 12+ AI-native commercial products", "Specializes in rapid conceptual prototyping"]
  },
];

export default function MentorsPage() {
  return (
    <SiteFrame title="Your Mentors">
      <div className="w-full py-12 md:py-16">
        <div className="text-center mb-16">
          <p className="inline-block px-3 py-1 rounded-full border border-outskill-lime/30 bg-outskill-lime/10 text-outskill-lime text-xs font-bold tracking-widest uppercase mb-4">
            Instructors
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-xl mb-4">
            Learn from Practitioners. <br/>Not Theorists.
          </h2>
          <p className="text-gray-300 font-light text-lg max-w-3xl mx-auto">
            Our faculty consists strictly of engineers, leaders, and CTOs who are actively deploying AI into production today. No fluff, just hard-earned enterprise experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mentors.map((mentor) => (
            <article key={mentor.name} className="glass-panel p-8 relative overflow-hidden group hover:border-white/20 transition-all duration-300">
               <div className="absolute top-0 right-0 w-24 h-24 bg-outskill-lime/5 rounded-full blur-[30px] group-hover:bg-outskill-lime/15 transition-all"></div>
               
               <header className="mb-6 border-b border-white/10 pb-6 relative z-10">
                 <h3 className="text-3xl font-bold text-white mb-1">{mentor.name}</h3>
                 <p className="text-outskill-lime font-medium">{mentor.role}</p>
                 <p className="text-sm text-gray-400 mt-2 uppercase tracking-wide">Focus: {mentor.focus}</p>
               </header>
               
               <p className="text-gray-300 leading-relaxed font-light mb-6 relative z-10">
                 {mentor.bio}
               </p>
               
               <div className="relative z-10">
                 <p className="text-xs uppercase tracking-widest text-white/50 mb-3 font-semibold">Key Highlights</p>
                 <ul className="space-y-2">
                   {mentor.achievements.map((acc) => (
                     <li key={acc} className="flex items-center gap-3 text-sm text-gray-200">
                       <span className="w-1.5 h-1.5 rounded-full bg-outskill-lime shadow-[0_0_5px_#B8EF43]"></span>
                       {acc}
                     </li>
                   ))}
                 </ul>
               </div>
            </article>
          ))}
        </div>
      </div>
    </SiteFrame>
  );
}
