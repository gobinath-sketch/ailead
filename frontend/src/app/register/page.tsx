"use client";

import { SiteFrame } from "@/components/site-frame";
import { useState } from "react";
import Script from "next/script";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { API_ENDPOINTS, apiUrl } from "@/lib/api-config";
import { SteppedRegistration } from "@/components/stepped-registration";

async function waitForRazorpay(timeoutMs = 12000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (typeof window !== "undefined" && typeof (window as any).Razorpay === "function") return;
    await new Promise((r) => setTimeout(r, 50));
  }
  throw new Error("Razorpay checkout script did not load.");
}

export default function RegisterPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [form, setForm] = useState({
    userType: "professional",
    fullName: "",
    lastName: "",
    email: "",
    phone: "",
    collegeName: "",
    courseName: "",
    studyYear: "",
    organization: "",
    role: "",
    experience: "",
    domain: "",
    goals: "",
    password: "",
  });
  
  const [paymentId, setPaymentId] = useState("");
  const [enrolled, setEnrolled] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const onPay = async () => {
    try {
      setBusy(true);
      setMessage("");
      await waitForRazorpay();
      
      const orderResponse = await fetch(apiUrl(API_ENDPOINTS.payments.createOrder), {
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
            
            const verify = await fetch(apiUrl(API_ENDPOINTS.payments.verify), {
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

            const regResponse = await fetch(apiUrl(API_ENDPOINTS.registrations.root), {
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
      
      <div className="w-full py-12 flex flex-col items-center min-h-[700px] justify-center relative">
        
        {mounted && (
          <AnimatePresence mode="wait">
            {enrolled ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-12 text-center max-w-xl w-full border-[#B8EF43]/30 bg-[#B8EF43]/5 shadow-2xl relative rounded-none"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-[#B8EF43]" />
                <div className="w-20 h-20 bg-[#B8EF43] rounded-none flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(184,239,67,0.4)]">
                  <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-4xl font-black text-white mb-4 italic tracking-tight uppercase">Seat Secured!</h2>
                <p className="text-gray-300 text-lg font-light leading-relaxed mb-8">
                  Welcome to the cohort, <span className="text-[#B8EF43] font-bold">{form.fullName}</span>. Your registration is complete and your spot is officially locked.
                </p>
                <div className="p-4 bg-white/5 border border-white/10 text-xs text-gray-400 font-mono mb-8 tracking-widest rounded-none">
                  ENROLLMENT_ID: {paymentId.toUpperCase() || "PENDING"}
                </div>
                <Link href="/program" className="bg-[#B8EF43] text-black font-black px-8 py-3 text-sm inline-block uppercase tracking-widest hover:bg-[#c9f95d] rounded-none">Explore Your Journey</Link>
              </motion.div>
            ) : (
              <div className="w-full">
                 <SteppedRegistration 
                    onSuccess={setPaymentId}
                    busy={busy}
                    setBusy={setBusy}
                    setMessage={setMessage}
                    form={form}
                    setForm={setForm}
                    onPay={onPay}
                 />
                 
                 {message && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-black/80 backdrop-blur-md border border-[#B8EF43]/30 text-[#B8EF43] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl rounded-none"
                    >
                      {message}
                    </motion.div>
                 )}
              </div>
            )}
          </AnimatePresence>
        )}
      </div>
    </SiteFrame>
  );
}
