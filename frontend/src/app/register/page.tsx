"use client";

import { SiteFrame } from "@/components/site-frame";
import { FormEvent, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const api = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    role: "",
    goals: "",
  });
  const [paymentId, setPaymentId] = useState("");
  const [paid, setPaid] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const onPay = async () => {
    try {
      setBusy(true);
      setMessage("");
      // Add visual delay effect for secure connection
      await new Promise(r => setTimeout(r, 600)); 
      
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

      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "Lead with AI Program",
        description: "Official Enrollment Credential",
        theme: {
          color: "#B8EF43" 
        },
        prefill: { name: form.fullName, email: form.email, contact: form.phone },
        handler: async (response: Record<string, string>) => {
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
          if (!verify.ok) throw new Error("Payment verification failed.");
          const result = await verify.json();
          setPaid(true);
          setPaymentId(result.paymentId);
          setMessage("Payment securely confirmed. You may now complete enrollment.");
        },
      });
      razorpay.open();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Payment connection failed.");
    } finally {
      setBusy(false);
    }
  };

  const onRegister = async (event: FormEvent) => {
    event.preventDefault();
    if (!paid || !paymentId) {
      setMessage("Please complete the secure payment authorization first.");
      return;
    }
    setBusy(true);
    setMessage("");
    const response = await fetch(`${api}/registrations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, paymentId }),
    });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) {
      setMessage(result.message ?? "Registration initialization failed.");
      return;
    }
    setMessage(`Access Granted. Welcome to the cohort. Reference ID: ${result.id}`);
  };

  return (
    <SiteFrame title="Secure Registration">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="w-full py-6">
        
        <div className="text-center mb-6">
          <p className="inline-block px-3 py-0.5 rounded-none border border-outskill-lime/30 bg-outskill-lime/10 text-outskill-lime text-[10px] font-bold tracking-widest uppercase mb-2">
            Official Enrollment
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-xl">
            Secure Your Access
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-6 items-start">
          
          <form onSubmit={onRegister} className="glass-panel p-6 pb-8 grid grid-cols-2 gap-4 relative shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-outskill-lime to-transparent"></div>
            
            <h3 className="col-span-2 text-lg font-bold text-white mb-2">Participant Details</h3>
            
            {[
              ["fullName", "Legal Full Name"],
              ["email", "Professional Email"],
              ["phone", "Direct Phone / Mobile"],
              ["organization", "Current Organization"],
              ["role", "Professional Title"],
            ].map(([key, label]) => (
              <label key={key} className={`grid gap-1.5 text-sm text-gray-300 ${key === "fullName" || key === "organization" ? "col-span-2" : "col-span-2 md:col-span-1"}`}>
                <span className="font-semibold uppercase tracking-wider text-[9px] text-gray-400">{label}</span>
                <input
                  className="bg-black/40 border border-white/10 rounded-none px-4 py-2.5 text-white focus:outline-none focus:border-outskill-lime/50 focus:ring-1 focus:ring-outskill-lime/50 transition-all placeholder:text-gray-600 text-sm"
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                  required={key === "fullName" || key === "email" || key === "phone"}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  suppressHydrationWarning
                />
              </label>
            ))}
            
            <label className="grid gap-1.5 text-sm text-gray-300 col-span-2 mt-1">
              <span className="font-semibold uppercase tracking-wider text-[9px] text-gray-400">Primary Learning Goals</span>
              <textarea 
                className="bg-black/40 border border-white/10 rounded-none px-4 py-2.5 text-white focus:outline-none focus:border-outskill-lime/50 focus:ring-1 focus:ring-outskill-lime/50 transition-all min-h-[90px] resize-none text-sm" 
                value={form.goals} 
                onChange={(e) => setForm((prev) => ({ ...prev, goals: e.target.value }))} 
                placeholder="What are the specific workflows or problems you are trying to solve?"
              />
            </label>
            
            <div className="col-span-2 pt-6 border-t border-white/10 mt-2">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button type="button" className={`cta flex-1 w-full text-center py-3 text-sm ${paid ? "opacity-50" : ""}`} onClick={onPay} disabled={busy || paid}>
                  {paid ? "Payment Authorized" : "Authorize Payment Securely"}
                </button>
                <button type="submit" className={`flex-1 w-full text-center px-6 py-3 text-sm font-bold rounded-none transition-all ${paid && !busy ? "bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.3)]" : "bg-transparent border border-white/20 text-gray-500 cursor-not-allowed"}`} disabled={!paid || busy}>
                  Complete Enrollment
                </button>
              </div>
              
              {message && (
                <div className={`mt-4 p-3 rounded-none text-xs ${paid ? "bg-outskill-lime/10 text-outskill-lime border border-outskill-lime/20" : "bg-white/5 text-gray-300 border border-white/10"}`}>
                  {message}
                </div>
              )}
            </div>
          </form>

          <div className="flex flex-col gap-4">
            <div className="glass-panel p-5 border-outskill-lime/20 shadow-[0_0_30px_rgba(184,239,67,0.05)]">
               <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-none bg-outskill-lime"></span>
                 Cohort Guarantee
               </h3>
               <p className="text-gray-400 text-xs leading-relaxed font-light mb-3">
                 Enrollment secures your access to the exclusive fully-guided curriculum, active technical mentoring, and issuance of the verified cryptographic completion certificate.
               </p>
               <div className="space-y-2 pt-3 border-t border-white/10">
                 <div className="flex items-center gap-3 text-[11px] text-gray-300">
                   <svg className="w-3.5 h-3.5 text-outskill-lime" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                   Direct 1-on-1 Architect support
                 </div>
                 <div className="flex items-center gap-3 text-[11px] text-gray-300">
                   <svg className="w-3.5 h-3.5 text-outskill-lime" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                   Permanent Alumni Network Access
                 </div>
                 <div className="flex items-center gap-3 text-[11px] text-gray-300">
                   <svg className="w-3.5 h-3.5 text-outskill-lime" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                   Lifetime access to program library
                 </div>
               </div>
            </div>
            
            <div className="glass-panel p-5 bg-black/60">
               <div className="flex items-center gap-3 mb-1">
                 <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                 <span className="text-white text-xs font-bold">256-Bit Secure Encrypted</span>
               </div>
               <p className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">
                 Transactions are routed directly through Razorpay PCI-DSS Level 1 compliant gateways.
               </p>
            </div>
          </div>

        </div>
      </div>
    </SiteFrame>
  );
}
