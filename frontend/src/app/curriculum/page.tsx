"use client";

import { SiteFrame } from "@/components/site-frame";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sessions = [
  {
    id: "01",
    title: "Getting Started with Generative AI",
    timing: "DAY 1 • SESSION 1 • 12 PM - 2 PM IST",
    description: "Understand where you stand in the AI landscape and learn how AI really works — the foundation for everything that follows.",
    items: [
      "Identify whether you're a specialist (20%) or generalist (80%) — and which path fits your goals",
      "Learn what Large Language Models actually are and how they process language",
      "Understand the 5-step LLM pipeline: tokenization → embeddings → attention → prediction → output",
      "See inside an LLM when you type a prompt — demystify the \"magic trick\"",
      "Explore the Outskil prompt framework (Context + Task + Instruction + Delta) that works across any AI",
      "Get a complete map of available AI assistants (ChatGPT, Claude, Gemini, Meta AI, Copilot, Grok)"
    ]
  },
  {
    id: "02",
    title: "Building Personalised AI Agents",
    timing: "DAY 1 • SESSION 2 • 12 PM - 2 PM IST",
    description: "Create custom AI assistants tailored to your exact needs — master prompt engineering, Custom GPTs, Gems, voice agents, and system prompts.",
    items: [
      "Master prompt engineering fundamentals: system prompts and markdown formatting",
      "Build Custom GPTs — design, configure, and deploy tailored AI assistants",
      "Create Google Gems for personalized, reusable AI workflows",
      "Build and deploy Voice Agents for conversational AI experiences",
      "Write effective system prompts that control AI behavior precisely",
      "Use markdown to structure prompts for consistent, high-quality outputs",
      "Create custom instructions to make AI behave exactly how you want it to",
      "Deploy your custom GPT/Gem to solve real problems in your work",
      "Explore the future of AI — agentic capabilities and what's next in the AI revolution"
    ]
  },
  {
    id: "03",
    title: "Building Products Using AI",
    timing: "DAY 2 • SESSION 3 • 10AM TO 2PM IST",
    description: "Transform ideas into functional AI-powered products without writing code — master no-code platforms, Vibe Coding, and rapid prototyping.",
    items: [
      "Learn the step-by-step process of turning concepts into functional products",
      "Understand Vibe Coding — building products without writing code",
      "Explore Replit and no-code/low-code platforms for rapid prototyping",
      "Understand how to combine AI with real-world applications",
      "Build something usable and deployable in the same session (hands-on project)",
      "Create products that are efficient, scalable, and solve practical problems",
      "Learn to integrate AI for scalable and user-friendly solutions",
      "Master the complete workflow from concept to functional product"
    ]
  },
  {
    id: "04",
    title: "Visual Storytelling & Content Creation Using AI",
    timing: "DAY 2 • SESSION 4 • 3PM TO 6PM IST",
    description: "Create professional images and videos for marketing, storytelling, and creative work — understand and master diffusion models.",
    items: [
      "Understand how diffusion models work (Image & Video generation)",
      "Master HD prompting to generate marketing images and ad creatives",
      "Learn text-to-image prompting with Midjourney and alternatives",
      "Master image-to-image editing and refinement techniques",
      "Generate realistic product photos and marketing collaterals on demand",
      "Create short-form videos and long-form creative content",
      "Learn video generation and manipulation with Krea AI, Kling AI, Higgsfield, Sora, Google Veo 3, Eleven Labs, Suno AI, and more",
      "Understand how to convert static images to video",
      "Build a complete visual content workflow from concept to finished asset",
      "Create HD ad films and short-form content for marketing/creative use"
    ]
  },
  {
    id: "05",
    title: "Mastermind Graduation",
    timing: "DAY 2 • SESSION 2 • 6PM TO 7PM IST",
    description: "Celebrate your achievement, recap your learning, and launch your AI journey beyond the workshop with confidence and community.",
    items: [
      "Celebrate completing an intensive, transformative AI education",
      "Hear from instructors and mentors about next steps and future learning paths",
      "Review core frameworks and mental models that will serve you forever",
      "Understand how all sessions connect into a coherent AI mastery arc",
      "Connect with your cohort and continue learning together",
      "Get resources and guidance for staying ahead in the rapidly evolving AI landscape",
      "Leave inspired and equipped to apply what you've learned in your work and life"
    ]
  }
];

export default function CurriculumPage() {
  const [activeSession, setActiveSession] = useState("01");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      root: scrollContainerRef.current,
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSession(entry.target.id);
        }
      });
    }, observerOptions);

    const sessionElements = document.querySelectorAll(".session-card");
    sessionElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollToSession = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <SiteFrame title="Curriculum Breakdown">
      <div className="w-full lg:h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-8 lg:gap-12 py-4 lg:py-0">
        
        {/* Sticky Sidebar Navigation */}
        <aside className="lg:w-[350px] lg:h-full lg:sticky lg:top-0 flex flex-col justify-center">
          <div className="space-y-4">
            <h2 className="text-outskill-lime text-xs font-bold tracking-[0.3em] uppercase mb-8 opacity-60">Full Curriculum</h2>
            {sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollToSession(s.id)}
                className={`flex items-center gap-4 text-left group w-full transition-all duration-300 ${
                  activeSession === s.id ? "opacity-100 scale-105" : "opacity-30 hover:opacity-60"
                }`}
              >
                <span className={`text-2xl font-black italic tracking-tighter ${
                  activeSession === s.id ? "text-outskill-lime" : "text-white"
                }`}>
                  {s.id}
                </span>
                <span className={`text-sm font-bold uppercase tracking-widest leading-tight ${
                  activeSession === s.id ? "text-white" : "text-gray-400"
                }`}>
                  {s.title}
                </span>
                {activeSession === s.id && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="w-1 h-8 bg-outskill-lime ml-auto"
                  />
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* Scrollable Content Area */}
        <main 
          ref={scrollContainerRef}
          className="flex-grow lg:h-full lg:overflow-y-auto lg:pr-6 custom-scrollbar space-y-12 pb-20"
        >
          {sessions.map((s) => (
            <section 
              key={s.id} 
              id={s.id}
              className="session-card glass-panel overflow-hidden border-white/5 hover:border-outskill-lime/20 transition-colors duration-500"
            >
              <div className="relative p-6 lg:p-10">
                {/* Header Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-outskill-lime text-black px-2 py-0.5 text-[10px] font-black tracking-tighter">
                      SESSION {s.id}
                    </span>
                    <span className="text-gray-500 text-[10px] font-bold tracking-[0.2em] uppercase">
                      {s.timing}
                    </span>
                  </div>
                  <h3 className="text-2xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                    {s.title}
                  </h3>
                  <p className="text-gray-400 text-sm lg:text-base font-light leading-relaxed max-w-2xl">
                    {s.description}
                  </p>
                </div>

                {/* Outcomes Checklist */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {s.items.map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-start group">
                      <div className="w-5 h-5 rounded-none bg-outskill-lime/10 border border-outskill-lime/30 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-outskill-lime group-hover:text-black transition-all duration-300">
                        <span className="text-[10px] font-bold text-outskill-lime group-hover:text-black transition-colors">{idx + 1}</span>
                      </div>
                      <span className="text-xs lg:text-sm text-gray-300 font-medium leading-snug group-hover:text-white transition-colors">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(184, 239, 67, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(184, 239, 67, 0.5);
        }
      `}</style>
    </SiteFrame>
  );
}
