"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import api from "@/services/api/axios";
import { motion } from "framer-motion";
import { useEcho } from "@/components/providers/EchoProvider";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const echo = useEcho();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [wallet, setWallet] = useState<any>(null);

  useEffect(() => {
    // Jangan muat header di halaman login/register
    if (pathname === "/login" || pathname === "/register") return;

    const token = localStorage.getItem("access_token");
    if (token) fetchUserData();
  }, [pathname]);

  const fetchUserData = async () => {
    try {
      const response = await api.get("/user");
      setUser(response.data);
      setWallet(response.data.wallet);
    } catch (error) {
      console.error("Gagal menarik data otorisasi:", error);
    }
  };

  // Sinkronisasi Dompet Global via WebSocket
  useEffect(() => {
    if (!echo || !user?.id) return;

    const channel = echo.private(`user.${user.id}`);
    channel.listen(".auction.won", fetchUserData);
    channel.listen(".outbid.notification", fetchUserData);

    return () => {
      echo.leaveChannel(`user.${user.id}`);
    };
  }, [echo, user?.id]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <header className="relative z-50 w-full flex flex-col shadow-cyan-glow">
      {/* TIER 1: UTILITY BAR (Top Bar) */}
      <div className="bg-p3-dark border-b border-p3-blue py-1 px-6 flex justify-between items-center text-[10px] font-black italic uppercase tracking-widest text-gray-400">
        <div className="flex gap-4"></div>
        <div className="flex gap-6 items-center">
          <Link href="/about" className="hover:text-p3-white transition-colors">
            Information
          </Link>
          <Link href="/support" className="hover:text-p3-white transition-colors">
            Support
          </Link>
          {user ? (
            <button onClick={handleLogout} className="text-red-500 hover:text-red-400 transition-colors">
              Disconnect (Logout)
            </button>
          ) : (
            <Link href="/login" className="text-p3-cyan hover:text-white transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* TIER 2: MAIN NAVBAR (Bottom Bar) */}
      <div className="bg-p3-dark/90 backdrop-blur-md border-b border-p3-cyan py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo & Identity */}
          <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
            <Link href="/" className="block text-3xl md:text-4xl font-black italic tracking-widest text-p3-white uppercase drop-shadow-md hover:scale-105 transition-transform">
              <span className="text-p3-cyan">Auction</span>.OS
            </Link>
          </motion.div>

          {/* Navigation Control & Financial HUD */}
          <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.4 }} className="flex flex-wrap gap-4 items-center justify-end">
            {/* Financial Panel */}
            {wallet && (
              <div className="flex flex-col text-right mr-2 border-r border-p3-blue/50 pr-6">
                <span className="text-[10px] font-bold text-p3-cyan uppercase tracking-widest opacity-80 mb-0.5">Available Funds</span>
                <span className="text-sm font-black italic text-p3-white tracking-widest drop-shadow-sm">Rp {Number(wallet.balance - wallet.frozen_balance).toLocaleString("id-ID")}</span>
                {Number(wallet.frozen_balance) > 0 && <span className="text-[10px] font-bold text-red-400 tracking-widest mt-0.5">[HOLD: Rp {Number(wallet.frozen_balance).toLocaleString("id-ID")}]</span>}
              </div>
            )}

            {/* Navigation Buttons */}
            {user?.role === "admin" && (
              <Link
                href="/admin"
                className="px-6 py-2 bg-red-600/20 border-2 border-red-600 text-red-500 font-bold italic tracking-wider uppercase transition-all hover:bg-red-600 hover:text-p3-white shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" }}
              >
                Admin
              </Link>
            )}

            {user && (
              <>
                <Link
                  href="/auctions/create"
                  className="px-6 py-2 bg-p3-blue text-p3-white font-bold italic tracking-wider uppercase transition-all hover:bg-p3-cyan hover:text-p3-dark"
                  style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" }}
                >
                  Create Auction
                </Link>
                <Link
                  href="/profile"
                  className="px-6 py-2 bg-transparent border-2 border-p3-cyan text-p3-cyan font-bold italic tracking-wider uppercase transition-all hover:bg-p3-cyan hover:text-p3-dark"
                  style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" }}
                >
                  Profile
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </header>
  );
}
