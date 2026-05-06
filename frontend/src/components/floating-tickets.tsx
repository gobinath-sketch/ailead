"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const events = [
  { id: 1, time: "Day 1 · 9:00 AM", title: "Foundations of GenAI", desc: "Context windows, LLM internals & prompt architecture" },
  { id: 2, time: "Day 1 · 12:00 PM", title: "Agentic Workflows", desc: "Build multi-step AI agents that work autonomously" },
  { id: 3, time: "Day 1 · 3:00 PM", title: "Prompt Engineering Lab", desc: "Hands-on structured prompting & chain-of-thought" },
  { id: 4, time: "Day 2 · 9:00 AM", title: "Enterprise AI Integration", desc: "Deploy AI into your business workflows" },
  { id: 5, time: "Day 2 · 12:00 PM", title: "AI Tools Masterclass", desc: "Cursor, Midjourney, Notion AI & 10+ tools" },
  { id: 6, time: "Day 2 · 3:00 PM", title: "Certification & Closing", desc: "Live Q&A, certification & next steps" },
];

export function FloatingTickets() {
  return (
    <div className="fixed right-[5%] lg:right-[20%] top-[42%] -translate-y-1/2 select-none z-[50]">
      <Link href="/schedule">
        <motion.div
          initial={{ y: 0, rotate: -15 }}
          className="cursor-pointer hover:scale-105 transition-transform relative"
        >
          {/* Back Ticket 2 */}
          <div className="absolute top-[-10px] left-[5px] rotate-[2deg] opacity-40">
            <TicketShape isStatic />
          </div>
          {/* Back Ticket 1 */}
          <div className="absolute top-[-5px] left-[2px] rotate-[1deg] opacity-70">
            <TicketShape isStatic />
          </div>
          {/* Front Ticket */}
          <div className="relative">
            <TicketShape />
          </div>
        </motion.div>
      </Link>
    </div>
  );
}

function TicketShape({ isStatic = false }: { isStatic?: boolean }) {
  const color = "#dc143c";
  const accent = "#fa8072";

  return (
    <div className="relative" style={{ width: 220, height: 110 }}>
      {/* Background with Corner Punch-outs - Using radial gradients to create the notched look */}
      <div 
        className="absolute inset-0 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        style={{
          backgroundColor: "transparent",
          backgroundImage: `
            radial-gradient(circle at 17px 17px, transparent 17px, ${color} 18px),
            radial-gradient(circle at calc(100% - 17px) 17px, transparent 17px, ${color} 18px),
            radial-gradient(circle at 17px calc(100% - 17px), transparent 17px, ${color} 18px),
            radial-gradient(circle at calc(100% - 17px) calc(100% - 17px), transparent 17px, ${color} 18px)
          `,
          backgroundPosition: "0 0, 100% 0, 0 100%, 100% 100%",
          backgroundSize: "100% 100%", 
          backgroundRepeat: "no-repeat",
        }}
      />
      
      {/* Solid fill for the middle area to prevent gaps between radial gradients */}
      <div className="absolute inset-[17px] pointer-events-none" style={{ backgroundColor: color }} />
      <div className="absolute top-0 bottom-0 left-[17px] right-[17px] pointer-events-none" style={{ backgroundColor: color }} />
      <div className="absolute left-0 right-0 top-[17px] bottom-[17px] pointer-events-none" style={{ backgroundColor: color }} />

      {/* Left/Right Zigzag Edges */}
      <div 
        className="absolute top-[17px] bottom-[17px] left-[-7px] right-[-7px] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 75%, ${color} 75%),
            linear-gradient(135deg, transparent 75%, ${color} 75%),
            linear-gradient(-45deg, transparent 75%, ${color} 75%),
            linear-gradient(-135deg, transparent 75%, ${color} 75%)
          `,
          backgroundSize: "7px 7px",
          backgroundRepeat: "repeat-y",
          backgroundPosition: "0 0, 0 0, 100% 0, 100% 0",
        }}
      />

      {!isStatic && (
        <>
          {/* Inner Border and Serial Area */}
          <div 
            className="absolute left-[12px] top-[12px] bottom-[12px] right-[12px] border-[2px] rounded-[8px] pointer-events-none"
            style={{ borderColor: accent }}
          >
            {/* Ticket Text */}
            <div className="absolute left-[10px] right-[55px] top-0 bottom-0 flex items-center justify-center">
              <p style={{ 
                color: "#1a1a1a", 
                fontFamily: "Impact, 'Arial Narrow', sans-serif", 
                fontSize: 32, 
                textTransform: "uppercase",
                lineHeight: 1,
                letterSpacing: "1px"
              }}>View Events</p>
            </div>

            {/* Separator Line */}
            <div 
              className="absolute right-[50px] top-[10%] bottom-[10%] border-l-[2px]"
              style={{ borderColor: accent }}
            />

            {/* Serial Number area now has Click To View */}
            <div className="absolute right-0 top-0 bottom-0 w-[50px] flex items-center justify-center">
              <p style={{
                color: "#1a1a1a",
                fontFamily: "monospace",
                fontSize: 9,
                fontWeight: "bold",
                transform: "rotate(-90deg)",
                whiteSpace: "nowrap",
                opacity: 0.8
              }}>CLICK TO VIEW</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
