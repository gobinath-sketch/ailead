"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-[350px] bg-black/90 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col"
            style={{ borderRadius: '0px' }}
          >
            {/* Header */}
            <div className="py-2 px-4 bg-outskill-lime flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center">
                  <Image 
                    src="/AILeads/chatbot-icon.png" 
                    alt="Bot" 
                    width={32} 
                    height={32} 
                    className="object-contain"
                  />
                </div>
                <div>
                  <h4 className="text-black font-bold text-sm">Assistant</h4>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-black/60 hover:text-black transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Chat Content */}
            <div className="h-[400px] p-4 overflow-y-auto space-y-4">
              <div className="flex flex-col gap-1">
                <div className="bg-white/5 border border-white/10 p-3 text-white text-sm font-light leading-relaxed">
                  Hello! How can I assist you with your AI journey today?
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3">Quick Inquiries</p>
                <div className="flex flex-col gap-2">
                  {["About the Program", "Curriculum Details", "Speaker Profiles", "Certification"].map((q) => (
                    <button 
                      key={q}
                      className="text-left px-3 py-2 text-xs text-white bg-white/5 hover:bg-outskill-lime hover:text-black transition-all duration-300 border border-white/5 font-medium"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 flex gap-2">
              <input 
                type="text" 
                placeholder="Type your message..." 
                className="flex-1 bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-outskill-lime transition-colors"
              />
              <button className="bg-outskill-lime p-2 text-black hover:bg-outskill-lime-hover transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-32 h-32 flex items-center justify-center relative group bg-transparent border-none p-0 cursor-pointer outline-none drop-shadow-[0_0_20px_rgba(184,239,67,0.3)] hover:drop-shadow-[0_0_35px_rgba(184,239,67,0.5)] transition-all duration-500"
      >
        <Image 
          src="/AILeads/chatbot-icon.png" 
          alt="Chatbot" 
          width={120} 
          height={120} 
          className="object-contain"
        />
      </motion.button>
    </div>
  );
}
