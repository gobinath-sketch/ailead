"use client";

import { SiteFrame } from "@/components/site-frame";
import { useState } from "react";
import Script from "next/script";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type RazorpayInstance = { open: () => void };
type RazorpayConstructor = new (options: Record<string, unknown>) => RazorpayInstance;

declare global {
  interface window {
    Razorpay?: RazorpayConstructor;
  }
}

const api = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

async function waitForRazorpay(timeoutMs = 12000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (typeof window !== "undefined" && typeof (window as any).Razorpay === "function") return;
    await new Promise((r) => setTimeout(r, 50));
  }
  throw new Error("Razorpay checkout script did not load.");
}

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    role: "",
    goals: "",
  });
  const [showSummary, setShowSummary] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [enrolled, setEnrolled] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const isEmailValid = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  const isPhoneValid = (value: string) => /^[0-9]{10}$/.test(value);
  const isFullNameValid = (value: string) => value.trim().length > 0 && value.trim().length <= 120;

  const isReadyForPayment =
    isFullNameValid(form.fullName) && isEmailValid(form.email) && isPhoneValid(form.phone);

  const onPay = async () => {
    try {
      setBusy(true);
      setMessage("");
      await waitForRazorpay();
      
      const orderResponse = await fetch(`${api}/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
        }),
      });
      
      if (!orderResponse.ok) throw new Error("Could not initialize secure payment channel.");
      const order = await orderResponse.json();

      const RazorpayCtor = (window as any).Razorpay;
      if (!RazorpayCtor) throw new Error("Razorpay is unavailable.");

      const razorpay = new RazorpayCtor({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "Global Knowledge Technologies",
        description: "Official Enrollment Credential",
        theme: { color: "#B8EF43" },
        prefill: { name: form.fullName, email: form.email, contact: form.phone },
        handler: async (response: Record<string, string>) => {
          try {
            setBusy(true);
            setMessage("Verifying payment...");
            
            const verify = await fetch(`${api}/payments/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                ...form
              }),
            });
            
            if (!verify.ok) throw new Error("Verification failed.");
            const verifyResult = await verify.json();
            
            setPaymentId(verifyResult.paymentId);
            setMessage("Finalizing enrollment...");

            const regResponse = await fetch(`${api}/registrations`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...form, paymentId: verifyResult.paymentId }),
            });
            
            const regResult = await regResponse.json();
            if (!regResponse.ok) throw new Error(regResult.message);
            
            setEnrolled(true);
          } catch (err) {
            setMessage(err instanceof Error ? err.message : "Error during finalization.");
          } finally {
            setBusy(false);
          }
        },
      });
      razorpay.open();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Payment failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <SiteFrame title="Secure Registration">
      <Script id="rzp-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      
      <div className="w-full py-12 flex flex-col items-center min-h-[600px] justify-center">
        
        <AnimatePresence mode="wait">
          {enrolled ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel p-12 text-center max-w-xl w-full border-outskill-lime/30 bg-outskill-lime/5 shadow-2xl relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-outskill-lime" />
              <div className="w-20 h-20 bg-outskill-lime rounded-none flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(184,239,67,0.4)]">
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-4xl font-black text-white mb-4 italic tracking-tight uppercase">Seat Secured!</h2>
              <p className="text-gray-300 text-lg font-light leading-relaxed mb-8">
                Welcome to the cohort, <span className="text-outskill-lime font-bold">{form.fullName}</span>. Your registration is complete and your spot is officially locked.
              </p>
              <div className="p-4 bg-white/5 border border-white/10 text-xs text-gray-400 font-mono mb-8 tracking-widest">
                ENROLLMENT_ID: {paymentId.toUpperCase() || "PENDING"}
              </div>
              <Link href="/program" className="cta px-8 py-3 text-sm inline-block">Explore Your Journey</Link>
            </motion.div>
          ) : (
            <motion.div 
              key="process"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 items-start"
            >
              {/* Left Column: Form or Summary */}
              <div>
                {!showSummary ? (
                  <div className="w-full">
                    <div className="mb-8">
                      <p className="text-outskill-lime text-[10px] font-bold tracking-[0.4em] uppercase mb-2">Step 01 / 02</p>
                      <h2 className="text-4xl font-black text-white italic tracking-tight uppercase">Participant Details</h2>
                    </div>

                    <div className="glass-panel p-8 grid grid-cols-1 md:grid-cols-2 gap-6 relative shadow-2xl">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-outskill-lime to-transparent" />
                      
                      {[
                        ["fullName", "Legal Full Name"],
                        ["email", "Professional Email"],
                        ["phone", "Direct Phone / Mobile"],
                        ["organization", "Current Organization"],
                        ["role", "Professional Title"],
                      ].map(([key, label]) => (
                        <div key={key} className={key === "fullName" || key === "organization" ? "col-span-2" : "col-span-1"}>
                          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-2">{label}</label>
                          <input
                            className="w-full bg-black/40 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-outskill-lime/50 transition-all placeholder:text-gray-700 text-sm"
                            value={form[key as keyof typeof form]}
                            onChange={(e) => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                            placeholder={`Enter ${label.toLowerCase()}`}
                          />
                        </div>
                      ))}

                      <div className="col-span-2">
                        <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-2">Learning Goals</label>
                        <textarea 
                          className="w-full bg-black/40 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-outskill-lime/50 min-h-[100px] resize-none text-sm"
                          value={form.goals}
                          onChange={(e) => setForm(prev => ({ ...prev, goals: e.target.value }))}
                          placeholder="What specific workflows are you trying to solve?"
                        />
                      </div>

                      <div className="col-span-2 pt-6 flex justify-end">
                        <button 
                          disabled={!isReadyForPayment}
                          onClick={() => setShowSummary(true)}
                          className="cta px-12 py-4 text-sm font-black disabled:opacity-30 disabled:grayscale transition-all"
                        >
                          AUTHORIZE PAYMENT SECURELY →
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="mb-8">
                      <p className="text-outskill-lime text-[10px] font-bold tracking-[0.4em] uppercase mb-2">Step 02 / 02</p>
                      <h2 className="text-4xl font-black text-white italic tracking-tight uppercase">Payment Summary</h2>
                    </div>

                    <div className="glass-panel overflow-hidden border-outskill-lime/30 max-w-2xl shadow-2xl">
                      <div className="bg-outskill-lime p-8 flex items-center justify-between">
                         <div className="w-16 h-16 bg-black flex items-center justify-center font-black text-3xl text-outskill-lime italic shadow-lg">G</div>
                         <div className="text-right">
                           <p className="text-[11px] text-black/60 font-black uppercase tracking-tight mb-1">Total Enrollment Fee</p>
                           <p className="text-5xl font-black text-black tracking-tighter">₹499</p>
                         </div>
                      </div>
                      
                      <div className="p-8 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="border-b border-white/10 pb-4">
                            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest block mb-1">Participant</span>
                            <span className="text-base text-white font-bold">{form.fullName}</span>
                          </div>
                          <div className="border-b border-white/10 pb-4">
                            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest block mb-1">Contact</span>
                            <span className="text-base text-white font-bold">{form.phone}</span>
                          </div>
                        </div>
                        
                        <div className="pt-6 flex flex-col gap-4">
                          <button 
                            disabled={busy}
                            onClick={onPay}
                            className="w-full bg-outskill-lime text-black font-black py-5 text-base uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(184,239,67,0.3)]"
                          >
                            {busy ? "INITIALIZING SECURE GATEWAY..." : "PAY ₹499 NOW →"}
                          </button>
                          <button 
                            disabled={busy}
                            onClick={() => setShowSummary(false)}
                            className="w-full text-center text-gray-500 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors py-2"
                          >
                            ← BACK TO DETAILS
                          </button>
                        </div>
                        
                        {message && (
                          <div className="mt-4 p-4 bg-outskill-lime/10 border border-outskill-lime/20 text-center">
                            <p className="text-outskill-lime text-xs font-bold animate-pulse uppercase tracking-widest">{message}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Guarantees */}
              <div className="flex flex-col gap-6 lg:mt-[104px]">
                <div className="glass-panel p-6 border-outskill-lime/20 bg-black/40 shadow-xl">
                   <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2 uppercase tracking-widest">
                     <span className="w-1.5 h-1.5 bg-outskill-lime"></span>
                     Cohort Guarantee
                   </h3>
                   <div className="space-y-4">
                     {[
                       "Direct 1-on-1 Architect support",
                       "Permanent Alumni Network Access",
                       "Lifetime access to program library"
                     ].map(text => (
                       <div key={text} className="flex items-start gap-3 text-[11px] text-gray-400 leading-tight">
                         <svg className="w-3.5 h-3.5 text-outskill-lime shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                         {text}
                       </div>
                     ))}
                   </div>
                </div>
                
                <div className="glass-panel p-6 bg-black/60 border-white/5 shadow-xl">
                   <div className="flex items-center gap-3 mb-2">
                     <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                     <span className="text-white text-[10px] font-black uppercase tracking-widest">256-Bit SSL Secured</span>
                   </div>
                   <p className="text-[9px] text-gray-500 uppercase leading-relaxed tracking-wider">
                     PCI-DSS Level 1 compliant gateway. Your credentials are never stored.
                   </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SiteFrame>
  );
}
