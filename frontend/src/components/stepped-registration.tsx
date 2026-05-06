"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createWorker } from "tesseract.js";
import { API_ENDPOINTS, apiUrl } from "../lib/api-config";

interface SteppedRegistrationProps {
  onSuccess: (paymentId: string) => void;
  busy: boolean;
  setBusy: (busy: boolean) => void;
  setMessage: (msg: string) => void;
  form: any;
  setForm: (form: any) => void;
  onPay: () => void;
}

export function SteppedRegistration({
  onSuccess,
  busy,
  setBusy,
  setMessage,
  form,
  setForm,
  onPay
}: SteppedRegistrationProps) {
  const [step, setStep] = useState(0); // 0: Type, 1: Details Form, 2: OTP
  const [userType, setUserType] = useState<"student" | "professional" | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [otp, setOtp] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    { id: "type", title: "Who are you?" },
    { id: "details", title: "Complete Details" },
    { id: "otp", title: "Verification" }
  ];

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    // --- STRICT VALIDATION ---
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!form.fullName || form.fullName.length < 3) {
      setMessage("Please enter your full name.");
      return;
    }

    if (!emailRegex.test(form.email)) {
      setMessage("Invalid email format (e.g. name@domain.com).");
      return;
    }

    if (!phoneRegex.test(form.phone)) {
      setMessage("Phone number must be exactly 10 digits.");
      return;
    }

    setBusy(true);
    setMessage("Generating OTP...");
    try {
      const res = await fetch(apiUrl(API_ENDPOINTS.auth.sendOtp), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: form.email, 
          name: form.fullName,
          phone: form.phone 
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");

      setMessage("OTP sent to your email!");
      setStep(2); // Go to OTP step
    } catch (err: any) {
      setMessage(err.message || "Error generating OTP.");
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyOtp = async () => {
    setBusy(true);
    setMessage("Verifying OTP...");
    try {
      const res = await fetch(apiUrl(API_ENDPOINTS.auth.verifyOtp), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp }),
      });
      if (!res.ok) throw new Error("Invalid OTP");
      
      // Save form to localStorage for the dashboard
      localStorage.setItem("registrationData", JSON.stringify({ ...form, userType }));
      setMessage("Verification successful! Redirecting...");
      
      // Redirect to Dashboard
      window.location.href = "/AILeads/dashboard";
    } catch (err) {
      setMessage("Invalid or expired OTP.");
    } finally {
      setBusy(false);
    }
  };

  // --- OCR ENGINE ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setMessage("Initializing AI Scanner...");

    try {
      const worker = await createWorker('eng');
      const result = await worker.recognize(file);
      const text = result.data.text;
      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 2);
      
      const extracted: any = {};
      const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
      if (emailMatch) extracted.email = emailMatch[0];

      const phoneMatch = text.match(/\b\d{10}\b/);
      if (phoneMatch) extracted.phone = phoneMatch[0];

      const nameLine = lines.find(l => l.toLowerCase().includes('name')) || lines[0];
      if (nameLine) {
        const cleanName = nameLine.replace(/name/i, '').replace(/[:]/g, '').trim();
        extracted.fullName = cleanName;
      }

      const collegeKeywords = ["college", "university", "institute", "school", "iit", "nit"];
      const companyKeywords = ["ltd", "private", "solutions", "corp", "inc", "technologies"];
      
      for (const line of lines) {
        if (collegeKeywords.some(k => line.toLowerCase().includes(k))) {
          extracted.collegeName = line;
          break;
        }
        if (companyKeywords.some(k => line.toLowerCase().includes(k))) {
          extracted.organization = line;
          break;
        }
      }

      setForm((prev: any) => ({ ...prev, ...extracted }));
      setMessage("Scan Complete! Fields updated.");
      await worker.terminate();
      setIsScanning(false);
    } catch (err) {
      setMessage("Scanner failed. Please fill manually.");
      setIsScanning(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Progress Bar */}
      <div className="flex justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -translate-y-1/2 z-0" />
        {steps.map((s, i) => (
          <div key={s.id} className="relative z-10 flex flex-col items-center">
            <div className={`w-3 h-3 rounded-none transition-all duration-500 ${i <= step ? 'bg-[#B8EF43] shadow-[0_0_15px_rgba(184,239,67,0.8)]' : 'bg-white/20'}`} />
            <p className={`text-[8px] uppercase tracking-[0.2em] mt-4 font-bold ${i <= step ? 'text-white' : 'text-gray-600'}`}>{s.title}</p>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="glass-panel p-8 md:p-12 min-h-[400px] flex flex-col justify-center relative overflow-hidden"
        >
          {/* STEP 0: USER TYPE */}
          {step === 0 && (
            <div className="text-center space-y-8">
              <div className="space-y-2">
                <p className="text-[#B8EF43] text-[10px] font-bold tracking-[0.4em] uppercase">Begin Journey</p>
                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Choose Your Path</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <button
                  onClick={() => { setUserType("student"); handleChange("userType", "student"); setStep(1); }}
                  className="group relative p-8 bg-white/5 border border-white/10 hover:border-[#B8EF43]/50 transition-all text-left overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-0 bg-[#B8EF43] group-hover:h-full transition-all duration-500" />
                  <h3 className="text-xl font-black text-white mb-2 uppercase italic">Student</h3>
                  <p className="text-gray-400 text-xs font-light leading-relaxed">Currently pursuing education and seeking AI mastery to kickstart your career.</p>
                </button>
                <button
                  onClick={() => { setUserType("professional"); handleChange("userType", "professional"); setStep(1); }}
                  className="group relative p-8 bg-white/5 border border-white/10 hover:border-[#B8EF43]/50 transition-all text-left overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-0 bg-[#B8EF43] group-hover:h-full transition-all duration-500" />
                  <h3 className="text-xl font-black text-white mb-2 uppercase italic">Professional</h3>
                  <p className="text-gray-400 text-xs font-light leading-relaxed">Working expert looking to integrate AI workflows into your organization.</p>
                </button>
              </div>
            </div>
          )}

          {/* STEP 1: UNIFIED FORM */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                 <div className="space-y-2">
                   <p className="text-[#B8EF43] text-[10px] font-bold tracking-[0.4em] uppercase">Details</p>
                   <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Complete Profile</h2>
                 </div>
                 
                 {/* AI ID Scanner */}
                 <div className="relative group w-32">
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isScanning}
                    className={`w-full py-2 border border-dashed transition-all duration-500 flex items-center justify-center gap-2 ${isScanning ? 'border-[#B8EF43] bg-[#B8EF43]/5' : 'border-white/10 hover:border-[#B8EF43]/30 bg-white/5'}`}
                  >
                    {isScanning ? (
                      <div className="w-4 h-4 border-2 border-[#B8EF43]/30 border-t-[#B8EF43] rounded-none animate-spin" />
                    ) : (
                      <span className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">+ Scan ID Card</span>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">First Name</label>
                  <input className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-[#B8EF43]/50 outline-none text-sm transition-all" value={form.fullName} onChange={(e) => handleChange("fullName", e.target.value)} placeholder="First Name" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Last Name</label>
                  <input className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-[#B8EF43]/50 outline-none text-sm transition-all" value={form.lastName} onChange={(e) => handleChange("lastName", e.target.value)} placeholder="Last Name" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Email Address</label>
                  <input className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-[#B8EF43]/50 outline-none text-sm transition-all" value={form.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="name@work.com" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Account Password</label>
                  <input 
                    type="password"
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-[#B8EF43]/50 outline-none text-sm transition-all" 
                    value={form.password || ""} 
                    onChange={(e) => handleChange("password", e.target.value)} 
                    placeholder="Create a password" 
                  />
                </div>

                {userType === "student" ? (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">College / University Name</label>
                      <input className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-[#B8EF43]/50 outline-none text-sm transition-all" value={form.collegeName} onChange={(e) => handleChange("collegeName", e.target.value)} placeholder="Institution name" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Phone Number</label>
                      <input 
                        className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-[#B8EF43]/50 outline-none text-sm transition-all" 
                        value={form.phone} 
                        maxLength={10}
                        onChange={(e) => handleChange("phone", e.target.value.replace(/\D/g, ''))} 
                        placeholder="10-digit mobile" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Course / Degree</label>
                      <input className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-[#B8EF43]/50 outline-none text-sm transition-all" value={form.courseName} onChange={(e) => handleChange("courseName", e.target.value)} placeholder="e.g. B.Tech CS" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Study Year</label>
                      <select className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-[#B8EF43]/50 outline-none text-sm transition-all" value={form.studyYear} onChange={(e) => handleChange("studyYear", e.target.value)}>
                        <option value="">Select Year</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="Final Year">Final Year</option>
                        <option value="Graduated">Graduated</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Current Organization</label>
                      <input className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-[#B8EF43]/50 outline-none text-sm transition-all" value={form.organization} onChange={(e) => handleChange("organization", e.target.value)} placeholder="Company name" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Phone Number</label>
                      <input 
                        className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-[#B8EF43]/50 outline-none text-sm transition-all" 
                        value={form.phone} 
                        maxLength={10}
                        onChange={(e) => handleChange("phone", e.target.value.replace(/\D/g, ''))} 
                        placeholder="10-digit mobile" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Role / Designation</label>
                      <input className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-[#B8EF43]/50 outline-none text-sm transition-all" value={form.role} onChange={(e) => handleChange("role", e.target.value)} placeholder="e.g. Lead Engineer" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Years of Experience</label>
                      <select 
                        className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-[#B8EF43]/50 outline-none text-sm transition-all" 
                        value={form.experience} 
                        onChange={(e) => handleChange("experience", e.target.value)}
                      >
                        <option value="">Select Experience</option>
                        <option value="Fresher / 0 Years">Fresher / 0 Years</option>
                        <option value="1-2 Years">1-2 Years</option>
                        <option value="3-5 Years">3-5 Years</option>
                        <option value="6-10 Years">6-10 Years</option>
                        <option value="10+ Years">10+ Years</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
              <div className="flex justify-between pt-4">
                <button onClick={() => setStep(0)} className="text-gray-500 hover:text-white text-[10px] font-bold uppercase tracking-widest">← Back</button>
                <button onClick={handleRegister} disabled={busy || !form.email || !form.fullName} className="bg-[#B8EF43] text-black font-black px-10 py-3 text-[10px] uppercase tracking-widest hover:bg-[#c9f95d] transition-all disabled:opacity-50">
                  {busy ? "Processing..." : "Register →"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === 2 && (
            <div className="text-center space-y-8 max-w-sm mx-auto">
              <div className="space-y-2">
                <p className="text-[#B8EF43] text-[10px] font-bold tracking-[0.4em] uppercase">Verification</p>
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Enter Code</h2>
                <p className="text-gray-500 text-xs font-light">We sent a 4-digit code to <span className="text-white">{form.email}</span></p>
              </div>
              
              <div className="space-y-6">
                <input
                  type="text"
                  maxLength={4}
                  className="w-full bg-white/5 border-2 border-white/10 hover:border-white/20 focus:border-[#B8EF43]/50 outline-none px-6 py-4 text-center text-4xl tracking-[1em] text-white font-mono rounded-none transition-all placeholder:text-white/10"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="0000"
                />
                
                <button 
                  onClick={handleVerifyOtp}
                  disabled={busy || otp.length !== 4}
                  className="w-full bg-[#B8EF43] text-black font-black py-4 text-sm uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_40px_rgba(184,239,67,0.3)] disabled:opacity-50 disabled:hover:scale-100 rounded-none"
                >
                  {busy ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-none animate-spin mx-auto" />
                  ) : "Verify & Unlock →"}
                </button>
              </div>

              <div className="flex justify-center gap-4 pt-4 text-[10px] font-bold uppercase tracking-widest">
                 <button onClick={() => setStep(1)} className="text-gray-500 hover:text-white transition-colors">← Edit Email</button>
                 <span className="text-white/10">|</span>
                 <button onClick={handleRegister} className="text-[#B8EF43] hover:text-[#c9f95d] transition-colors">Resend Code</button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
