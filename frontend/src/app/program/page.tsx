"use client";

import { SiteFrame } from "@/components/site-frame";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sessions = [
  {
    id: "01",
    title: "Getting Started with Generative AI",
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
    description: "Celebrate your achievement, recap your learning, and launch your AI journey beyond the workshop with confidence and community.",
    items: [
      "Celebrate completing an intensive, transformative AI education",
      "Hear from instructors and speakers about next steps and future learning paths",
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
  const [isWheeling, setIsWheeling] = useState(false);

  const currentIndex = sessions.findIndex(s => s.id === activeSession);
  const currentSession = sessions[currentIndex] || sessions[0];

  const handleWheel = (e: React.WheelEvent) => {
    if (isWheeling) return;

    if (e.deltaY > 50) {
      // Scroll Down -> Next
      if (currentIndex < sessions.length - 1) {
        setIsWheeling(true);
        setActiveSession(sessions[currentIndex + 1].id);
        setTimeout(() => setIsWheeling(false), 800);
      }
    } else if (e.deltaY < -50) {
      // Scroll Up -> Previous
      if (currentIndex > 0) {
        setIsWheeling(true);
        setActiveSession(sessions[currentIndex - 1].id);
        setTimeout(() => setIsWheeling(false), 800);
      }
    }
  };

  return (
    <SiteFrame title="Program Details">
      <div className="w-full h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-8 lg:gap-12 py-4 lg:py-0 overflow-hidden">
        
        {/* Sticky Sidebar Navigation */}
        <aside className="lg:w-[350px] h-full flex flex-col justify-center">
          <div className="space-y-6">
            <h2 className="text-outskill-lime text-xs font-bold tracking-[0.3em] uppercase mb-8 opacity-60">Program Journey</h2>
            {sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSession(s.id)}
                className={`flex items-center gap-6 text-left group w-full transition-all duration-300 ${
                  activeSession === s.id ? "opacity-100" : "opacity-30 hover:opacity-60"
                }`}
              >
                <div className="w-10 shrink-0">
                  <span className={`text-3xl font-black italic tracking-tighter block transition-colors duration-300 ${
                    activeSession === s.id ? "text-outskill-lime" : "text-white"
                  }`}>
                    {s.id}
                  </span>
                </div>
                <span className={`text-sm font-bold uppercase tracking-widest leading-tight transition-colors duration-300 ${
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

        {/* Single Card Display Area */}
        <main 
          onWheel={handleWheel}
          className="flex-grow h-full flex items-center justify-center relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.section 
              key={currentSession.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="session-card glass-panel w-full overflow-hidden border-white/5 hover:border-outskill-lime/20 transition-colors duration-500"
            >
              <div className="relative p-6 lg:p-10">
                {/* Header Section */}
                <div className="mb-6 lg:mb-8">
                  <h3 className="text-2xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                    {currentSession.title}
                  </h3>
                  <p className="text-gray-400 text-sm lg:text-base font-light leading-relaxed max-w-2xl">
                    {currentSession.description}
                  </p>
                </div>

                {/* Outcomes Checklist */}
                <div className="grid grid-cols-1 gap-y-4 lg:gap-y-5">
                  {currentSession.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start group">
                      <div className="w-6 h-6 rounded-none bg-outskill-lime/10 border border-outskill-lime/30 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-outskill-lime group-hover:text-black transition-all duration-300">
                        <span className="text-[10px] font-bold text-outskill-lime group-hover:text-black transition-colors">{idx + 1}</span>
                      </div>
                      <span className="text-sm lg:text-base text-gray-300 font-medium leading-relaxed group-hover:text-white transition-colors">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          </AnimatePresence>
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
