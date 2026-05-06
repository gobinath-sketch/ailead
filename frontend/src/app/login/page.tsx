"use client";

import { SiteFrame } from "@/components/site-frame";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_ENDPOINTS, apiUrl } from "@/lib/api-config";
import Link from "next/link";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [step, setStep] = useState(1); // For forgot password steps
  
  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  // Auto-verify OTP when 4 digits are entered
  useEffect(() => {
    if (mode === "forgot" && step === 2 && otp.length === 4) {
      handleVerifyForgotOtp();
    }
  }, [otp]);

  // --- LOGIN LOGIC ---
  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Please enter both email and password.");
      return;
    }
    setBusy(true);
    setMessage("Authenticating...");
    try {
      const res = await fetch(apiUrl(API_ENDPOINTS.auth.login), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed.");
      
      // Save user details for dashboard
      localStorage.setItem("registrationData", JSON.stringify(data.user));
      setMessage("Success! Redirecting...");
      window.location.href = "/dashboard";
    } catch (err: any) {
      setMessage(err.message || "Invalid credentials.");
    } finally {
      setBusy(false);
    }
  };

  // --- FORGOT PASSWORD FLOW ---
  const handleSendForgotOtp = async () => {
    if (!email || !email.includes("@")) {
      setMessage("Enter your registered email first.");
      return;
    }
    setBusy(true);
    setMessage("Verifying account...");
    try {
      const res = await fetch(apiUrl(API_ENDPOINTS.auth.loginOtp), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to initiate reset.");
      
      setStep(2);
      setMessage("Verification code sent to your email.");
    } catch (err: any) {
      setMessage(err.message || "Account not found.");
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyForgotOtp = async () => {
    setBusy(true);
    setMessage("Verifying code...");
    try {
      const res = await fetch(apiUrl(API_ENDPOINTS.auth.verifyOtp), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      if (!res.ok) throw new Error("Invalid or expired code.");
      
      setStep(3); // Move to password creation
      setMessage("Code verified! Create your new password.");
    } catch (err: any) {
      setMessage(err.message || "Invalid code.");
      setOtp(""); // Clear on error
    } finally {
      setBusy(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    if (newPassword.length < 4) {
      setMessage("Password too short.");
      return;
    }

    setBusy(true);
    setMessage("Updating password...");
    try {
      const res = await fetch(apiUrl(API_ENDPOINTS.auth.updatePassword), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: newPassword }),
      });
      if (!res.ok) throw new Error("Failed to update password.");
      
      setMessage("Password updated! Please login.");
      setMode("login");
      setStep(1);
      setNewPassword("");
      setConfirmPassword("");
      setOtp("");
    } catch (err: any) {
      setMessage(err.message || "Error updating password.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <SiteFrame title="Access Control - Global Knowledge Technologies">
      <div className="w-full py-24 flex flex-col items-center justify-center min-h-[600px]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-12 max-w-md w-full border-[#B8EF43]/20 bg-black/40 backdrop-blur-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#B8EF43]/5 blur-[100px] rounded-full -mr-24 -mt-24" />

          <div className="text-center mb-10 relative z-10">
             <p className="text-[#B8EF43] text-[10px] font-black uppercase tracking-[0.4em] mb-2">
               {mode === "login" ? "Welcome Back" : "Security Recovery"}
             </p>
             <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
               {mode === "login" ? "Login" : "Reset Access"}
             </h1>
          </div>

          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <motion.div 
                key="login-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 relative z-10"
              >
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest block">Email Address</label>
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full bg-white/5 border border-white/10 px-6 py-4 text-white focus:border-[#B8EF43]/50 outline-none text-sm transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest block">Password</label>
                      <button 
                        onClick={() => { setMode("forgot"); setStep(1); setMessage(""); }}
                        className="text-[9px] text-[#B8EF43] hover:underline uppercase font-bold tracking-widest"
                      >
                        Forgot?
                      </button>
                    </div>
                    <input 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 px-6 py-4 text-white focus:border-[#B8EF43]/50 outline-none text-sm transition-all"
                    />
                  </div>
                </div>
                <button 
                  onClick={handleLogin}
                  disabled={busy}
                  className="w-full bg-[#B8EF43] text-black font-black py-4 text-xs uppercase tracking-widest hover:bg-[#c9f95d] transition-all shadow-[0_10px_30px_rgba(184,239,67,0.2)]"
                >
                  {busy ? "Authenticating..." : "Login to Dashboard →"}
                </button>
                <p className="text-center text-[10px] text-gray-500 uppercase tracking-widest">
                  New here? <Link href="/register" className="text-[#B8EF43] hover:underline">Secure Your Spot</Link>
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="forgot-flow"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 relative z-10"
              >
                {step === 1 && (
                  <div className="space-y-4">
                    <p className="text-xs text-gray-400 font-light leading-relaxed">Enter your registered email to receive a secure verification code.</p>
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full bg-white/5 border border-white/10 px-6 py-4 text-white focus:border-[#B8EF43]/50 outline-none text-sm transition-all"
                    />
                    <button 
                      onClick={handleSendForgotOtp}
                      disabled={busy}
                      className="w-full bg-[#B8EF43] text-black font-black py-4 text-xs uppercase tracking-widest hover:bg-[#c9f95d] transition-all"
                    >
                      {busy ? "Finding Account..." : "Send Reset Code →"}
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6 text-center">
                    <p className="text-xs text-gray-400 font-light">Verification code sent to your email.</p>
                    <input 
                      type="text"
                      maxLength={4}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="0000"
                      className="w-full bg-white/5 border-2 border-white/10 text-white px-6 py-4 text-center text-4xl tracking-[1.2em] font-mono focus:border-[#B8EF43]/50 outline-none transition-all"
                    />
                    <div className="flex justify-center items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-[#B8EF43] animate-pulse" />
                       <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Auto-Validating...</p>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest block">New Password</label>
                      <input 
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New Password"
                        className="w-full bg-white/5 border border-white/10 px-6 py-4 text-white focus:border-[#B8EF43]/50 outline-none text-sm transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest block">Confirm Password</label>
                      <input 
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Retype New Password"
                        className="w-full bg-white/5 border border-white/10 px-6 py-4 text-white focus:border-[#B8EF43]/50 outline-none text-sm transition-all"
                      />
                    </div>
                    <button 
                      onClick={handleUpdatePassword}
                      disabled={busy}
                      className="w-full bg-[#B8EF43] text-black font-black py-4 text-xs uppercase tracking-widest hover:bg-[#c9f95d] transition-all"
                    >
                      {busy ? "Updating..." : "Confirm Create Password →"}
                    </button>
                  </div>
                )}

                <button 
                  onClick={() => { setMode("login"); setStep(1); setMessage(""); }}
                  className="w-full text-[10px] text-gray-500 uppercase font-black tracking-widest hover:text-white transition-colors mt-4"
                >
                  ← Return to Login
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {message && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-white/5 border border-white/10 text-center"
            >
              <p className="text-[10px] text-[#B8EF43] font-black uppercase tracking-widest leading-relaxed">{message}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </SiteFrame>
  );
}
