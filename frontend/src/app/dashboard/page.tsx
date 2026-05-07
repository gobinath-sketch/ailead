"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "../../components/dashboard-sidebar";
import { DashboardHeader } from "../../components/dashboard-header";
import { LearnerOverview } from "../../components/dashboard/learner-overview";
import { AdminOverview } from "../../components/dashboard/admin-overview";
import { AnimatedTicket } from "../../components/ui/ticket-confirmation-card";
import * as htmlToImage from "html-to-image";

export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    setMounted(true);
    const data = localStorage.getItem("registrationData");
    if (!data) {
      router.push("/login");
      return;
    }
    const parsed = JSON.parse(data);
    setUserData(parsed);
    // Automatically show ticket on first load for non-admin learners if not shown before
    const ticketShown = localStorage.getItem("ticketShown");
    if (parsed.role !== "ADMIN" && !ticketShown) {
      setShowTicket(true);
    }
  }, [router]);

  const handleDismissTicket = () => {
    setShowTicket(false);
    localStorage.setItem("ticketShown", "true");
  };

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
      link.download = `AILeads-Ticket-${userData.paymentId?.slice(-10).toUpperCase() || userData.id?.slice(-10).toUpperCase() || "GKLEAD99"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download ticket", err);
      alert("Failed to download ticket. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!mounted || !userData) return null;

  const isAdmin = userData.role === "ADMIN";

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white font-sans">
      <DashboardSidebar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed} 
      />
      
      {/* Background with slight grid/noise pattern */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <motion.div 
        animate={{ 
          paddingLeft: isSidebarCollapsed ? "80px" : "280px" 
        }}
        transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
        className={`relative z-10 w-full min-h-screen flex flex-col transition-all duration-1000 ${
          !isAdmin && showTicket ? "blur-md opacity-30 pointer-events-none select-none" : "blur-none opacity-100"
        }`}
      >
        <DashboardHeader />
        
        <main className="flex-1 p-8">
          <AnimatePresence mode="wait">
            {isAdmin ? (
              <AdminOverview key="admin" userData={userData} />
            ) : (
              <LearnerOverview key="learner" userData={userData} />
            )}
          </AnimatePresence>
        </main>
      </motion.div>

      {/* --- PREMIUM TICKET POPUP (MODAL) --- */}
      <AnimatePresence>
        {!isAdmin && showTicket && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-[150] p-4"
          >
            {/* Dark Backdrop with blur effect */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
              onClick={handleDismissTicket}
            />
            
            {/* The Ticket Card */}
            <motion.div
              initial={{ scale: 0.8, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-sm"
            >
              <div className="flex justify-center" id="ticket-capture">
                <AnimatedTicket 
                  ticketId={userData.paymentId?.slice(-10).toUpperCase() || userData.id?.slice(-10).toUpperCase() || "GKLEAD99"}
                  amount={499}
                  date={new Date(userData.createdAt || Date.now())}
                  cardHolder={userData.fullName}
                  last4Digits="PAID"
                  barcodeValue={userData.id || "9876543210"}
                  onDownload={handleDownloadTicket}
                  isDownloading={isDownloading}
                />
              </div>
              
              <button 
                onClick={handleDismissTicket}
                className="mt-8 mx-auto bg-[#B8EF43] text-black font-black px-8 py-3 text-xs uppercase tracking-widest hover:bg-[#c9f95d] transition-all rounded-none block shadow-[0_10px_30px_rgba(184,239,67,0.2)]"
              >
                Access Dashboard →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- VIEW TICKET FLOAT TRIGGER --- */}
      {!isAdmin && !showTicket && (
        <button 
          onClick={() => setShowTicket(true)}
          className="fixed bottom-8 right-8 z-[110] bg-[#B8EF43] text-black text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-none hover:scale-105 transition-all shadow-2xl border border-[#B8EF43]/20"
        >
          View Pass Ticket
        </button>
      )}
    </div>
  );
}
