"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { API_ENDPOINTS, apiUrl } from "../../lib/api-config";
import { AnimatedTicket } from "../../components/ui/ticket-confirmation-card";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [busy, setBusy] = useState(false);
  const [ticketData, setTicketData] = useState<any>(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    // Load Razorpay Script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    // Load User Data and fetch fresh payment status
    const initDashboard = async () => {
      const data = localStorage.getItem("registrationData");
      if (!data) {
        router.push("/register");
        return;
      }

      const parsed = JSON.parse(data);
      setUserData(parsed);

      // Always re-fetch fresh data from server to get latest payment status
      try {
        const res = await fetch(apiUrl(API_ENDPOINTS.registrations.byEmail), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: parsed.email }),
        });
        if (res.ok) {
          const freshData = await res.json();
          if (freshData) {
            setUserData(freshData);
            localStorage.setItem("registrationData", JSON.stringify(freshData));
            if (freshData.payment?.status === "PAID") {
              setIsPaid(true);
              // Build ticket from existing payment record
              setTicketData({
                ticketId: (freshData.payment.razorpayPaymentId || freshData.id || "OFFLINE").slice(-10).toUpperCase(),
                amount: freshData.payment.amount ? freshData.payment.amount / 100 : 499,
                date: new Date(freshData.payment.updatedAt || freshData.createdAt || Date.now()),
                cardHolder: freshData.fullName,
                last4Digits: "PAID",
                barcodeValue: freshData.id || Math.floor(Math.random() * 1e12).toString(),
              });
            }
          }
        }
      } catch {
        // Fallback to localStorage data
        if (parsed.payment?.status === "PAID") {
          setIsPaid(true);
        }
      }
    };

    initDashboard();
  }, [router]);

  const handlePayment = async () => {
    if (!razorpayLoaded || !userData) {
      alert("Payment gateway is loading. Please wait.");
      return;
    }

    setBusy(true);

    try {
      // 1. Create Razorpay Order
      const orderRes = await fetch(apiUrl(API_ENDPOINTS.payments.createOrder), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fullName: userData.fullName,
          email: userData.email,
          phone: userData.phone
        })
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.orderId) throw new Error("Could not create order");

      // 2. Open Razorpay
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "AI Camp Registration",
        description: "Event Enrollment Pass",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // 3. Verify Payment
            const verifyRes = await fetch(apiUrl(API_ENDPOINTS.payments.verify), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                fullName: userData.fullName,
                email: userData.email,
                phone: userData.phone
              })
            });
          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            // 4. Save Registration to DB
            const finalData = { ...userData, paymentId: verifyData.paymentId };
            await fetch(apiUrl(API_ENDPOINTS.registrations.root), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(finalData)
            });

            // 5. Unlock Dashboard
            setTicketData({
              ticketId: response.razorpay_payment_id.slice(-10).toUpperCase(),
              amount: 499,
              date: new Date(),
              cardHolder: userData.fullName,
              last4Digits: "PAID",
              barcodeValue: Math.floor(Math.random() * 1000000000000).toString()
            });
            setIsPaid(true);
            
            // 6. Update localStorage so status persists on refresh
            const updatedData = { ...userData, payment: { status: "PAID" } };
            localStorage.setItem("registrationData", JSON.stringify(updatedData));
            setUserData(updatedData);
          } else {
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: userData.fullName,
          email: userData.email,
          contact: userData.phone
        },
        theme: {
          color: "#B8EF43"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function () {
        alert("Payment failed or cancelled.");
      });
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong initiating payment.");
    } finally {
      setBusy(false);
    }
  };

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans pt-24">
      {/* --- DASHBOARD CONTENT (BLURRED INITIALLY) --- */}
      <div className={`transition-all duration-1000 w-full max-w-6xl mx-auto p-4 ${!isPaid ? "blur-md opacity-40 pointer-events-none select-none" : "blur-none opacity-100"}`}>
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">Welcome, {userData.fullName}</h1>
            <p className="text-[#B8EF43] font-mono mt-2 tracking-widest text-sm">EVENT DASHBOARD</p>
          </div>
          {isPaid && (
            <div className="bg-[#B8EF43]/10 text-[#B8EF43] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-[#B8EF43]/30">
              Access Granted
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Area */}
          <div className="lg:col-span-2 space-y-6">
             <div className="bg-white/5 border border-white/10 p-8 rounded-2xl h-64 flex flex-col justify-end relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700" />
                <div className="relative z-20">
                  <span className="bg-[#B8EF43] text-black text-[10px] font-bold px-3 py-1 uppercase tracking-widest mb-4 inline-block">Upcoming Live Session</span>
                  <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Introduction to GenAI</h2>
                  <p className="text-gray-400 font-mono text-sm">Starts in: 02d 14h 30m</p>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold mb-4">Course Progress</h3>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="w-[10%] h-full bg-[#B8EF43]" />
                  </div>
                  <p className="text-right text-gray-500 mt-2 text-xs">10% Completed</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold mb-4">Certificates</h3>
                  <p className="text-gray-500 text-sm">Complete modules to unlock your verified certificates.</p>
                </div>
             </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            {isPaid && ticketData ? (
               <div className="flex justify-center w-full">
                 <AnimatedTicket 
                   ticketId={ticketData.ticketId}
                   amount={ticketData.amount}
                   date={ticketData.date}
                   cardHolder={ticketData.cardHolder}
                   last4Digits={ticketData.last4Digits}
                   barcodeValue={ticketData.barcodeValue}
                 />
               </div>
            ) : (
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl h-96 flex items-center justify-center">
                 <p className="text-gray-500 font-mono text-sm">Your Ticket Appears Here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- PAYMENT MODAL (ONLY WHEN NOT PAID) --- */}
      <AnimatePresence>
        {!isPaid && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute inset-0 flex items-center justify-center z-50 p-4"
          >
            {/* Dark overlay specifically for the modal to pop out */}
            <div className="absolute inset-0 bg-black/60" />
            
            <div className="relative glass-panel border border-white/10 p-8 md:p-12 w-full max-w-md text-center bg-black/80 backdrop-blur-2xl shadow-2xl">
              <div className="w-16 h-16 bg-[#B8EF43]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#B8EF43]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-2">Unlock Dashboard</h2>
              <p className="text-gray-400 text-sm mb-8">Complete your enrollment to instantly access all event modules, live sessions, and your official Dev Pass ticket.</p>
              
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl mb-8 flex justify-between items-center text-left">
                 <div>
                   <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Enrollment Fee</p>
                   <p className="text-white font-bold">Registration Pass</p>
                 </div>
                 <div className="text-right">
                   <p className="text-2xl font-black text-[#B8EF43]">₹499</p>
                 </div>
              </div>

              <button 
                onClick={handlePayment}
                disabled={busy}
                className="w-full bg-[#B8EF43] text-black font-black py-4 text-sm uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_40px_rgba(184,239,67,0.3)] flex justify-center items-center"
              >
                {busy ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  "Proceed to Pay →"
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
