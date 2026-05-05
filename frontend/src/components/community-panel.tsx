"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_ENDPOINTS, apiUrl } from "@/lib/api-config";

export function CommunityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    role: "",
    experience: "",
    joinMastermind: false,
    joinNewsletter: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setForm((prev) => ({ ...prev, [target.name]: target.checked }));
    } else {
      setForm((prev) => ({ ...prev, [target.name]: target.value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Save to Database
      await fetch(apiUrl(API_ENDPOINTS.community.lead), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      // 2. WhatsApp redirect with prefilled message
      const message = encodeURIComponent(
        `Hi! I'd like to join the Global Knowledge Technologies AI Community.\nName: ${form.name}\nEmail: ${form.email}\nRole: ${form.role}`
      );
      window.open(`https://wa.me/+916384757116?text=${message}`, "_blank");
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to save lead:", err);
      // Still redirect to WhatsApp even if DB fails to not lose the user
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Trigger Button — floats on the left edge */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-50 bg-[#B8EF43] text-black font-black text-xs uppercase tracking-[0.2em] px-3 py-6 writing-mode-vertical hover:px-4 transition-all duration-300 shadow-[4px_0_20px_rgba(184,239,67,0.4)]"
        style={{ writingMode: "vertical-rl", transform: "translateY(-50%) rotate(180deg)" }}
      >
        Join Community
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            />

            {/* Slide-in Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 200 }}
              className="fixed left-0 top-0 h-full z-[70] w-full max-w-md bg-[#0a0a0a] border-r border-white/10 shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
                <div>
                  <p className="text-[#B8EF43] text-[10px] font-bold uppercase tracking-[0.3em] mb-1">Global Knowledge Technologies</p>
                  <h2 className="text-white text-2xl font-black leading-tight">Join the AI Community</h2>
                  <p className="text-gray-400 text-xs mt-1 font-light">Get instant access to our WhatsApp AI Mastermind</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-white transition-colors ml-4 shrink-0"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="flex-grow overflow-y-auto p-6 custom-scrollbar">
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Name */}
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase font-bold tracking-[0.2em] block mb-2">Full Name</label>
                      <input
                        required
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 px-4 py-3 text-sm focus:outline-none focus:border-[#B8EF43]/50 transition-colors"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase font-bold tracking-[0.2em] block mb-2">Email Address</label>
                      <input
                        required
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 px-4 py-3 text-sm focus:outline-none focus:border-[#B8EF43]/50 transition-colors"
                      />
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase font-bold tracking-[0.2em] block mb-2">WhatsApp Number</label>
                      <div className="flex">
                        <span className="bg-white/5 border border-r-0 border-white/10 px-3 flex items-center text-gray-400 text-sm">🇮🇳 +91</span>
                        <input
                          required
                          name="whatsapp"
                          type="tel"
                          value={form.whatsapp}
                          onChange={handleChange}
                          placeholder="9876543210"
                          className="flex-grow bg-white/5 border border-white/10 text-white placeholder-gray-600 px-4 py-3 text-sm focus:outline-none focus:border-[#B8EF43]/50 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Role */}
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase font-bold tracking-[0.2em] block mb-2">What describes you?</label>
                      <select
                        required
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#B8EF43]/50 transition-colors appearance-none"
                      >
                        <option value="" disabled className="bg-[#0a0a0a] text-gray-500">Select your role</option>
                        <option value="Salaried Professional" className="bg-[#0a0a0a]">Salaried Professional</option>
                        <option value="Self-Employed" className="bg-[#0a0a0a]">Self-Employed</option>
                        <option value="Founder" className="bg-[#0a0a0a]">Founder / Entrepreneur</option>
                        <option value="Student" className="bg-[#0a0a0a]">Student</option>
                      </select>
                    </div>

                    {/* Experience */}
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase font-bold tracking-[0.2em] block mb-2">Years of Experience</label>
                      <select
                        required
                        name="experience"
                        value={form.experience}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#B8EF43]/50 transition-colors appearance-none"
                      >
                        <option value="" disabled className="bg-[#0a0a0a] text-gray-500">Select experience</option>
                        <option value="0" className="bg-[#0a0a0a]">0 Years</option>
                        <option value="1" className="bg-[#0a0a0a]">1 Year</option>
                        <option value="2" className="bg-[#0a0a0a]">2 Years</option>
                        <option value="3" className="bg-[#0a0a0a]">3 Years</option>
                        <option value="4" className="bg-[#0a0a0a]">4 Years</option>
                        <option value="5+" className="bg-[#0a0a0a]">5+ Years</option>
                      </select>
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-3 pt-1">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          name="joinMastermind"
                          checked={form.joinMastermind}
                          onChange={handleChange}
                          className="mt-0.5 accent-[#B8EF43] w-4 h-4 shrink-0"
                        />
                        <span className="text-xs text-gray-400 group-hover:text-white transition-colors">Join the community</span>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          name="joinNewsletter"
                          checked={form.joinNewsletter}
                          onChange={handleChange}
                          className="mt-0.5 accent-[#B8EF43] w-4 h-4 shrink-0"
                        />
                        <span className="text-xs text-gray-400 group-hover:text-white transition-colors">Subscribe to the Newsletter</span>
                      </label>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#B8EF43] text-black font-black uppercase tracking-[0.1em] py-4 text-sm hover:bg-[#d4f76e] transition-colors flex items-center justify-center gap-3 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                          SUBMITTING...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.845L.057 23.868l6.197-1.524A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.658-.494-5.19-1.357l-.373-.22-3.678.904.978-3.576-.243-.388A10 10 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                          </svg>
                          Get Instant Access →
                        </>
                      )}
                    </button>

                    <p className="text-[10px] text-gray-600 text-center">By submitting, you agree to receive AI insights on WhatsApp</p>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-full text-center py-16 gap-6"
                  >
                    <div className="w-16 h-16 bg-[#B8EF43] flex items-center justify-center">
                      <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white text-xl font-black mb-2">Welcome to the Community!</h3>
                      <p className="text-gray-400 text-sm">You have been redirected to WhatsApp. Send the message to complete your registration.</p>
                    </div>
                    <button
                      onClick={() => { setSubmitted(false); setIsOpen(false); }}
                      className="text-[#B8EF43] text-xs uppercase font-bold tracking-widest hover:opacity-70 transition-opacity"
                    >
                      Close Panel
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Social Footer */}
              <div className="p-6 border-t border-white/10 bg-black/40">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em] mb-4">Follow Us On</p>
                <div className="flex gap-4">
                  <a href="https://www.linkedin.com/company/global-knowledge-technologies" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#B8EF43] transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
                  <a href="https://www.instagram.com/globalknowledgetech" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#B8EF43] transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                  <a href="https://www.youtube.com/@globalknowledgetech" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#B8EF43] transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                  <a href="https://wa.me/+916384757116" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#B8EF43] transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(184,239,67,0.3); }
      `}</style>
    </>
  );
}
