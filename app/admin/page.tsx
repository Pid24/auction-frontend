"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/services/api/axios";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [systemData, setSystemData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchSystemData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSystemData = async () => {
    try {
      const response = await api.get("/admin/auctions");
      setSystemData(response.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response?.status === 403) {
        router.push("/"); // Tendang user biasa keluar dari zona admin
      } else {
        console.error("Transmission failed:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceDelete = async (id: number) => {
    if (!confirm("WARNING: THIS ACTION IS IRREVERSIBLE. PURGE ASSET?")) return;

    try {
      const response = await api.delete(`/admin/auctions/${id}/force`);
      setMessage(response.data.message);
      // Hapus data dari state lokal tanpa perlu memuat ulang dari server
      setSystemData(systemData.filter((auction) => auction.id !== id));

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Purge command failed:", error);
      setMessage("SYSTEM OVERRIDE FAILED.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-p3-dark">
        <motion.div animate={{ opacity: [0.3, 1, 0.3], scale: [0.98, 1.02, 0.98] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-red-500 text-2xl font-black italic tracking-widest uppercase">
          ACCESSING SECURE MAINFRAME...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-p3-dark font-sans relative overflow-hidden pb-20 pt-10 px-6">
      {/* Background Ornament - Red theme for Admin */}
      <div className="fixed top-0 left-0 w-1/2 h-screen bg-red-900/10 pointer-events-none z-0" style={{ clipPath: "polygon(0 0, 100% 0, 70% 100%, 0% 100%)" }} />

      <div className="max-w-7xl mx-auto relative z-10 mb-6 flex justify-between items-end border-b-2 border-red-600 pb-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl md:text-5xl font-black italic tracking-widest text-p3-white uppercase drop-shadow-md">
            Overwatch <span className="text-red-500">Panel</span>
          </h1>
          <p className="text-red-500/80 font-mono text-sm tracking-widest mt-2 font-bold">/// LEVEL 5 CLEARANCE ACCEPTED</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Link
            href="/"
            className="inline-block px-8 py-2 bg-transparent border-2 border-red-500 text-red-500 font-bold italic tracking-widest uppercase transition-colors hover:bg-red-500 hover:text-p3-dark"
            style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" }}
          >
            &#171; EXIT
          </Link>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {message && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-900/40 text-red-400 p-4 mb-6 font-bold tracking-widest uppercase italic text-sm border-l-4 border-red-500">
            [SYSTEM OVERRIDE] {message}
          </motion.div>
        )}

        <div className="bg-p3-dark/80 border border-red-900 shadow-[0_0_15px_rgba(220,38,38,0.3)] p-6 relative" style={{ clipPath: "polygon(0 0, 100% 0, 100% 98%, 98% 100%, 0 100%)" }}>
          <div className="absolute top-0 left-0 w-1 h-full bg-red-600" />

          <h2 className="text-xl font-black italic tracking-widest text-p3-white uppercase mb-6 border-b border-red-900/50 pb-2">Global Asset Registry</h2>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-red-900 text-red-500 text-xs tracking-widest uppercase italic">
                  <th className="p-4 font-black">ID</th>
                  <th className="p-4 font-black">Asset Entity</th>
                  <th className="p-4 font-black">Operative (Owner)</th>
                  <th className="p-4 font-black">Status</th>
                  <th className="p-4 font-black text-right">Intervention</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {systemData.map((auction) => (
                    <motion.tr key={auction.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }} className="border-b border-red-900/30 hover:bg-red-900/10 transition-colors text-sm font-bold">
                      <td className="p-4 text-p3-white/50 font-mono">#{auction.id}</td>
                      <td className="p-4 text-p3-white truncate max-w-xs">{auction.title}</td>
                      <td className="p-4 text-p3-cyan/80">{auction.user?.name || "UNKNOWN"}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 text-[10px] font-black italic uppercase tracking-wider text-p3-dark ${auction.status === "active" ? "bg-p3-cyan" : auction.status === "pending" ? "bg-yellow-400" : "bg-red-600 text-white"}`}
                          style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" }}
                        >
                          {auction.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleForceDelete(auction.id)}
                          className="bg-red-600 text-white px-6 py-2 text-xs font-black italic tracking-widest uppercase hover:bg-red-800 transition-colors"
                          style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" }}
                        >
                          PURGE
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {systemData.length === 0 && <div className="text-center py-10 text-red-500/50 font-mono tracking-widest text-sm">NO ASSETS DETECTED IN MAINFRAME.</div>}
        </div>
      </div>
    </div>
  );
}
