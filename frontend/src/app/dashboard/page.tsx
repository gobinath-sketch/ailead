"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { API_ENDPOINTS, apiUrl } from "../../lib/api-config";
import { AnimatedTicket } from "../../components/ui/ticket-confirmation-card";
import { DashboardSidebar } from "../../components/dashboard-sidebar";
import { DashboardHeader } from "../../components/dashboard-header";
import { Download } from "lucide-react";
import * as htmlToImage from "html-to-image";


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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

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

      const checkAndShowTicket = () => {
        setIsPaid(true);
        if (!localStorage.getItem("ticketViewed")) {
          setShowTicket(true);
          localStorage.setItem("ticketViewed", "true");
        }
      };

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
              // Build ticket from existing payment record
              setTicketData({
                ticketId: (freshData.payment.razorpayPaymentId || freshData.id || "OFFLINE").slice(-10).toUpperCase(),
                amount: freshData.payment.amount ? freshData.payment.amount / 100 : 499,
                date: new Date(freshData.payment.updatedAt || freshData.createdAt || Date.now()),
                cardHolder: freshData.fullName,
                last4Digits: "PAID",
                barcodeValue: freshData.id || Math.floor(Math.random() * 1e12).toString(),
              });
              checkAndShowTicket();
            }
          }
        }
      } catch {
        // Fallback to localStorage data
        if (parsed.payment?.status === "PAID") {
          checkAndShowTicket();
        }
      }
    };

    initDashboard();
  }, [router]);

  const handleDownloadTicket = async () => {
    const node = document.getElementById("ticket-capture");
    if (!node) return;
    
    setIsDownloading(true);
    try {
      const filter = (node: HTMLElement) => {
        if (node.classList && node.classList.contains('hide-on-download')) {
          return false;
        }
        return true;
      };
      
      const dataUrl = await htmlToImage.toPng(node, { 
        quality: 1.0, 
        pixelRatio: 2,
        filter: filter as any
      });
      const link = document.createElement("a");
      link.download = `AILeads-Ticket-${ticketData?.ticketId || 'Pass'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download ticket", err);
      alert("Failed to download ticket. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

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
    <div className="min-h-screen relative overflow-hidden bg-black">
      <DashboardSidebar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed} 
      />
      <DashboardHeader />

      {/* --- DASHBOARD BACKGROUND --- */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/AILeads/bg/dashboard-bg.jpg')" }}
      />
      
      {/* --- DASHBOARD CONTENT --- */}
      <motion.div 
        animate={{ 
          paddingLeft: isSidebarCollapsed ? "80px" : "280px" 
        }}
        transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
        className="relative z-10 w-full min-h-screen flex flex-col p-8"
      >
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="opacity-10 pointer-events-none select-none text-center">
             <h1 className="text-8xl font-black italic uppercase tracking-tighter text-white">DASHBOARD</h1>
             <p className="text-white/40 font-mono mt-4 tracking-[1em] text-sm uppercase">Canvas Ready</p>
          </div>
        </div>
      </motion.div>

      {/* --- TICKET POPUP (MODAL) --- */}
      <AnimatePresence>
        {isPaid && showTicket && ticketData && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-[100] p-4"
          >
            {/* Dark Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            />
            
            {/* The Ticket Popup */}
            <motion.div
              initial={{ scale: 0.8, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-sm"
            >
              <div className="flex justify-center" id="ticket-capture">
                <AnimatedTicket 
                  ticketId={ticketData.ticketId}
                  amount={ticketData.amount}
                  date={ticketData.date}
                  cardHolder={ticketData.cardHolder}
                  last4Digits={ticketData.last4Digits}
                  barcodeValue={ticketData.barcodeValue}
                  onDownload={handleDownloadTicket}
                  isDownloading={isDownloading}
                />
              </div>
              
              <div className="mt-12 flex justify-center">
                <button 
                  onClick={() => setShowTicket(false)}
                  className="flex items-center justify-center gap-2 px-12 py-4 rounded-none bg-white text-black text-[11px] uppercase font-black tracking-[0.2em] hover:scale-105 transition-all duration-300 shadow-[0_10px_30px_rgba(255,255,255,0.2)]"
                >
                  Dashboard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- RESTORE TICKET BUTTON (SMALL FLOATING TOGGLE) --- */}
      {isPaid && !showTicket && (
        <button 
          onClick={() => setShowTicket(true)}
          className="fixed bottom-8 right-8 z-[110] bg-black text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-none hover:scale-105 transition-all shadow-2xl border border-white/10"
        >
          View Ticket
        </button>
      )}

      {/* --- PAYMENT MODAL (ONLY WHEN NOT PAID) --- */}
      <AnimatePresence>
        {!isPaid && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
            
            <div className="relative border border-gray-200 p-8 md:p-12 w-full max-w-md text-center bg-white shadow-2xl rounded-none">
              <div className="w-16 h-16 bg-[#B8EF43]/10 rounded-none flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900 mb-2">Unlock Pass</h2>
              <p className="text-gray-500 text-sm mb-8 font-medium">Complete your enrollment to instantly receive your official dev-pass ticket.</p>
              
              <div className="bg-gray-50 border border-gray-100 p-6 rounded-none mb-8 flex justify-between items-center text-left">
                 <div>
                   <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Total Fee</p>
                   <p className="text-gray-900 font-black italic">REGISTRATION</p>
                 </div>
                 <div className="text-right">
                   <p className="text-3xl font-black text-gray-900 tracking-tighter">₹499</p>
                 </div>
              </div>

              <button 
                onClick={handlePayment}
                disabled={busy}
                className="w-full bg-black text-white font-black py-5 rounded-none text-xs uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl flex justify-center items-center"
              >
                {busy ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-none animate-spin" />
                ) : (
                  "Enroll Now →"
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
