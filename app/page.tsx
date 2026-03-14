"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/services/api/axios";
import { motion } from "framer-motion";
import { useEcho } from "@/components/providers/EchoProvider";

export default function Dashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [auctions, setAuctions] = useState<any[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [wallet, setWallet] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const echo = useEcho();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }
    initializeSystem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listener WebSocket Khusus Sinkronisasi Dompet
  useEffect(() => {
    if (!echo || !userId) return;

    const channel = echo.private(`user.${userId}`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    channel.listen(".auction.won", () => {
      syncWallet();
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    channel.listen(".outbid.notification", () => {
      syncWallet();
    });

    return () => {
      echo.leaveChannel(`user.${userId}`);
    };
  }, [echo, userId]);

  const syncWallet = async () => {
    try {
      const response = await api.get("/user");
      setWallet(response.data.wallet);
    } catch (error) {
      console.error("Gagal menyinkronkan data dompet:", error);
    }
  };

  const initializeSystem = async () => {
    try {
      const [userResponse, auctionsResponse] = await Promise.all([api.get("/user"), api.get("/auctions")]);

      setUserId(userResponse.data.id);
      setUserRole(userResponse.data.role);
      setWallet(userResponse.data.wallet); // Menangkap entitas dompet
      setAuctions(auctionsResponse.data.data || auctionsResponse.data);
    } catch (error) {
      console.error("System initialization failed:", error);
      localStorage.removeItem("access_token");
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-p3-dark">
        <motion.div animate={{ opacity: [0.3, 1, 0.3], scale: [0.98, 1.02, 0.98] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-p3-cyan text-2xl font-black italic tracking-widest uppercase">
          Establishing Connection...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-p3-dark font-sans relative overflow-hidden pb-12">
      {/* Background Ornament */}
      <div className="fixed top-0 right-0 w-2/3 h-screen bg-p3-blue/10 pointer-events-none z-0" style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }} />

      {/* HEADER / NAVBAR */}
      <nav className="relative z-50 bg-p3-dark/80 backdrop-blur-md border-b border-p3-cyan shadow-cyan-glow mb-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
            <h1 className="text-3xl md:text-4xl font-black italic tracking-widest text-p3-white uppercase drop-shadow-md">
              <span className="text-p3-cyan">Auction</span> Hub
            </h1>
          </motion.div>

          <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.4 }} className="flex flex-wrap gap-4 items-center justify-end">
            {/* Financial HUD Panel */}
            {wallet && (
              <div className="flex flex-col text-right mr-2 border-r border-p3-blue/50 pr-6">
                <span className="text-[10px] font-bold text-p3-cyan uppercase tracking-widest opacity-80 mb-0.5">Available Funds</span>
                <span className="text-sm font-black italic text-p3-white tracking-widest drop-shadow-sm">Rp {Number(wallet.balance - wallet.frozen_balance).toLocaleString("id-ID")}</span>
                {Number(wallet.frozen_balance) > 0 && <span className="text-[10px] font-bold text-red-400 tracking-widest mt-0.5">[HOLD: Rp {Number(wallet.frozen_balance).toLocaleString("id-ID")}]</span>}
              </div>
            )}

            {userRole === "admin" && (
              <Link
                href="/admin"
                className="px-6 py-2 bg-red-600/20 border-2 border-red-600 text-red-500 font-bold italic tracking-wider uppercase transition-all hover:bg-red-600 hover:text-p3-white shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" }}
              >
                Overwatch
              </Link>
            )}

            <Link
              href="/auctions/create"
              className="px-6 py-2 bg-p3-blue text-p3-white font-bold italic tracking-wider uppercase transition-all hover:bg-p3-cyan hover:text-p3-dark"
              style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" }}
            >
              Initialize
            </Link>
            <Link
              href="/profile"
              className="px-6 py-2 bg-transparent border-2 border-p3-cyan text-p3-cyan font-bold italic tracking-wider uppercase transition-all hover:bg-p3-cyan hover:text-p3-dark"
              style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" }}
            >
              Profile
            </Link>
            <button onClick={handleLogout} className="px-6 py-2 bg-red-600 text-white font-bold italic tracking-wider uppercase transition-all hover:bg-red-500" style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" }}>
              Logout
            </button>
          </motion.div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {auctions.length === 0 ? (
          <div className="text-center py-20 border border-p3-blue bg-p3-dark/50 text-p3-cyan font-mono tracking-widest" style={{ clipPath: "polygon(2% 0, 100% 0, 98% 100%, 0% 100%)" }}>
            [ NO ACTIVE AUCTIONS DETECTED ]
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {auctions.map((auction, index) => (
              <motion.div
                key={auction.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5, filter: "drop-shadow(0 0 15px rgba(0, 229, 255, 0.4))" }}
                className="relative bg-p3-dark/80 border border-p3-blue flex flex-col group overflow-hidden"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 90% 100%, 0 100%)" }}
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-p3-cyan transition-transform origin-top scale-y-0 group-hover:scale-y-100 duration-300" />

                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-2xl font-black italic tracking-wide mb-2 truncate text-p3-white group-hover:text-p3-cyan transition-colors">{auction.title}</h2>
                  <p className="text-gray-400 mb-6 line-clamp-2 text-sm">{auction.description}</p>

                  <div className="mt-auto">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-p3-cyan uppercase tracking-widest opacity-80">Current Peak</span>
                      <span className="text-xl font-bold text-p3-white drop-shadow-md">Rp {Number(auction.current_price).toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xs font-bold text-p3-cyan uppercase tracking-widest opacity-80">System Status</span>
                      <span
                        className={`px-4 py-1 text-xs font-black italic uppercase tracking-wider text-p3-dark ${auction.status === "active" ? "bg-p3-cyan shadow-cyan-glow" : auction.status === "pending" ? "bg-yellow-400" : "bg-red-500 text-white"}`}
                        style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" }}
                      >
                        {auction.status}
                      </span>
                    </div>

                    <Link
                      href={`/auctions/${auction.id}`}
                      className="block w-full text-center bg-p3-white text-p3-dark font-black italic tracking-widest py-3 uppercase transition-all group-hover:bg-p3-cyan"
                      style={{ clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0% 100%)" }}
                    >
                      Infiltrate Room
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
