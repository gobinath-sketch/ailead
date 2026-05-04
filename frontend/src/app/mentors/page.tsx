"use client";

import React, { useState } from "react";
import { SiteFrame } from "@/components/site-frame";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";

const mentors = [
  {
    id: "s",
    name: "Sendhil Kumar S",
    role: "Founder and Chairman",
    focus: "AI Learning Strategy & Adoption Roadmaps",
    bio: "Pioneering the shift in enterprise AI adoption, Sendhil establishes the foundational roadmaps that multi-national organizations use to upskill their entire engineering workforce. He translates theoretical AI potential into direct, measurable ROI.",
    achievements: ["Advises Fortune 500 boards on AI transition", "Architected 50+ enterprise transformation roadmaps"],
    image: "/mentors/s.webp"
  },
  {
    id: "p",
    name: "Peter Darius",
    role: "AI Technology Leader",
    focus: "Cloud Engineering & Enterprise Systems",
    bio: "Peter leads the technical implementation of LLMs securely within cloud environments. With deep expertise in Kubernetes, AWS, and secure data enclaves, he teaches the critical infrastructural requirements needed to support autonomous agents.",
    achievements: ["Led deployment of secure LLMs for Finance sectors", "Expert in AWS & Neural Network Infrastructure"],
    image: "/mentors/p.webp"
  },
  {
    id: "r",
    name: "Dr. Radhika S",
    role: "VP Technical",
    focus: "Neural Networks & Computer Vision",
    bio: "Bringing rigorous academic depth and commercial pragmatism, Dr. Radhika focuses on the exact science of multimodal models. She breaks down the math behind transformers so operators can intuitively understand model behavior and hallucination prevention.",
    achievements: ["Ph.D. in applied Computer Vision", "Published multiple papers on model optimization"],
    image: "/mentors/r.webp"
  },
  {
    id: "d",
    name: "Dinesh T",
    role: "Chief Technology Officer",
    focus: "Product Strategy & Applied Architectures",
    bio: "Dinesh connects the dots between raw AI capability and shipping actual products. He teaches the frameworks required to map business problems to AI solutions, ensuring that every prompt and workflow directly solves a customer need.",
    achievements: ["Shipped 12+ AI-native commercial products", "Specializes in rapid conceptual prototyping"],
    image: "/mentors/d.webp"
  },
];

export default function MentorsPage() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const nextMentor = () => {
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx + 1) % mentors.length);
    }
  };

  const prevMentor = () => {
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx - 1 + mentors.length) % mentors.length);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <SiteFrame title="Your Mentors">
      <div className="w-full h-[calc(100vh-120px)] flex flex-col justify-center relative px-4">
        
        {/* Header - Only visible in grid view */}
        <AnimatePresence>
          {selectedIdx === null && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center mb-12"
            >
              <p className="inline-block px-3 py-1 rounded-none border border-outskill-lime/30 bg-outskill-lime/10 text-outskill-lime text-xs font-bold tracking-widest uppercase mb-4">
                Our Faculty
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-xl mb-4">
                Learn from Practitioners.
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative w-full max-w-7xl mx-auto h-[600px] flex items-center justify-center">
          
          {/* Grid View */}
          <AnimatePresence mode="wait">
            {selectedIdx === null ? (
              <motion.div
                key="grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
              >
                {mentors.map((mentor, idx) => (
                  <motion.div
                    key={mentor.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="relative group cursor-pointer overflow-hidden border border-white/10 hover:border-outskill-lime/50 transition-all duration-500 rounded-none shadow-2xl"
                    onClick={() => setSelectedIdx(idx)}
                  >
                    <div className="aspect-[4/5] relative w-full overflow-hidden">
                      <Image 
                        src={mentor.image} 
                        alt={mentor.name} 
                        fill 
                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Text Overlay */}
                      <div className="absolute bottom-0 left-0 w-full p-6 transform group-hover:-translate-y-2 transition-transform duration-500">
                        <div className="w-8 h-1 bg-outskill-lime mb-3 group-hover:w-12 transition-all duration-500" />
                        <h3 className="text-xl font-bold text-white tracking-tight leading-tight">{mentor.name}</h3>
                        <p className="text-[10px] text-outskill-lime font-black uppercase tracking-[0.2em] mt-2 opacity-80 group-hover:opacity-100">
                          {mentor.role}
                        </p>
                      </div>

                      {/* Hover Info Icon */}
                      <div className="absolute top-4 right-4 w-8 h-8 rounded-none border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500 bg-black/40 backdrop-blur-md">
                         <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                         </svg>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              /* Detail View */
              <motion.div
                key="detail"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex flex-col md:flex-row items-center gap-12 relative"
              >
                {/* Back Button */}
                <button 
                  onClick={() => setSelectedIdx(null)}
                  className="absolute -top-12 left-0 text-gray-400 hover:text-white flex items-center gap-2 text-sm uppercase tracking-widest font-bold transition-colors group"
                >
                  <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                  Back to Faculty
                </button>

                {/* Left Side: Photo & Quick Info */}
                <motion.div 
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "circOut" }}
                  className="w-full md:w-1/3 flex flex-col items-center md:items-start"
                >
                  <div className="aspect-[4/5] w-full max-w-[320px] relative overflow-hidden border border-white/10 shadow-2xl group">
                    <Image 
                      src={mentors[selectedIdx].image} 
                      alt={mentors[selectedIdx].name} 
                      fill 
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-90" />
                    
                    {/* Text Overlay */}
                    <div className="absolute bottom-0 left-0 w-full p-6">
                      <div className="w-8 h-1 bg-outskill-lime mb-3" />
                      <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">{mentors[selectedIdx].name}</h3>
                      <p className="text-[10px] text-outskill-lime font-black uppercase tracking-[0.2em] mt-2">
                        {mentors[selectedIdx].role}
                      </p>
                    </div>
                  </div>
                  
                  {/* Focus Details Below */}
                  <div className="mt-8 text-center md:text-left">
                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold">Primary Focus Area</p>
                    <p className="text-sm text-gray-300 font-medium mt-2 leading-relaxed max-w-[280px]">{mentors[selectedIdx].focus}</p>
                  </div>
                </motion.div>

                {/* Right Side: About Card */}
                <motion.div 
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "circOut", delay: 0.2 }}
                  className="w-full md:w-2/3 glass-panel p-8 md:p-12 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-outskill-lime/5 rounded-none blur-[60px]" />
                  
                  <h4 className="text-xs uppercase tracking-[0.3em] text-outskill-lime font-black mb-6">Professional Narrative</h4>
                  <p className="text-lg md:text-xl text-gray-200 font-light leading-relaxed mb-10">
                    {mentors[selectedIdx].bio}
                  </p>

                  <div className="space-y-6">
                    <h5 className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-bold">Strategic Impact & Accomplishments</h5>
                    <ul className="grid grid-cols-1 gap-4">
                      {mentors[selectedIdx].achievements.map((item, i) => (
                        <li key={i} className="flex items-start gap-4 text-gray-300">
                          <span className="w-2 h-2 bg-outskill-lime shrink-0 mt-1.5" />
                          <span className="text-sm md:text-base font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                {/* Navigation Arrows */}
                <div className="fixed inset-y-1/2 left-10 md:left-20 flex items-center">
                  <button 
                    onClick={prevMentor}
                    className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-white/30 transition-all group"
                  >
                    <svg className="w-6 h-6 text-white group-hover:-translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                </div>
                <div className="fixed inset-y-1/2 right-10 md:right-20 flex items-center">
                  <button 
                    onClick={nextMentor}
                    className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-white/30 transition-all group"
                  >
                    <svg className="w-6 h-6 text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </SiteFrame>
  );
}
