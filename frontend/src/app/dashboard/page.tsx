"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "../../components/dashboard-sidebar";
import { DashboardHeader } from "../../components/dashboard-header";
import { LearnerOverview } from "../../components/dashboard/learner-overview";
import { AdminOverview } from "../../components/dashboard/admin-overview";

export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const data = localStorage.getItem("registrationData");
    if (!data) {
      router.push("/login");
      return;
    }
    setUserData(JSON.parse(data));
  }, [router]);

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
        className="relative z-10 w-full min-h-screen flex flex-col"
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
    </div>
  );
}
