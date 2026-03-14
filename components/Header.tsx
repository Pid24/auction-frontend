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
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/`);
    }
  };

  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <header className="relative z-50 w-full flex flex-col shadow-cyan-glow">
      {/* TIER 1: UTILITY BAR */}
      <div className="bg-p3-dark border-b border-p3-blue py-1.5 px-6 flex justify-between items-center text-[10px] font-bold tracking-widest text-gray-400">
        <div className="flex gap-4"></div>
        <div className="flex gap-6 items-center uppercase">
          <Link href="/about" className="hover:text-p3-white transition-colors">
            Information
          </Link>
          <Link href="/support" className="hover:text-p3-white transition-colors">
            Support
          </Link>
          {user ? (
            <button onClick={handleLogout} className="text-red-500 hover:text-red-400 transition-colors">
              Logout
            </button>
          ) : (
            <Link href="/login" className="text-p3-cyan hover:text-white transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* TIER 2: MAIN NAVBAR */}
      <div className="bg-p3-dark/95 backdrop-blur-md border-b border-p3-cyan py-3 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 lg:gap-8">
          {/* Logo & Identity */}
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.4 }} className="shrink-0">
            <Link href="/" className="block text-2xl md:text-3xl font-black italic tracking-widest text-p3-white uppercase drop-shadow-md hover:scale-105 transition-transform">
              <span className="text-p3-cyan">Auction</span>.OS
            </Link>
          </motion.div>

          {/* Global Search Bar - Dibuat lebih ramping */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-auto relative hidden md:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets..."
              className="w-full bg-p3-blue/5 border border-p3-blue/50 text-p3-white px-4 py-2 text-sm placeholder-p3-blue/50 focus:outline-none focus:border-p3-cyan focus:bg-p3-blue/10 transition-all"
              style={{ clipPath: "polygon(2% 0, 100% 0, 98% 100%, 0% 100%)" }}
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-5 bg-p3-blue/20 text-p3-cyan text-xs font-black italic tracking-widest uppercase hover:bg-p3-cyan hover:text-p3-dark transition-colors"
              style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)" }}
            >
              FIND
            </button>
          </form>

          {/* Navigation Control & Financial HUD */}
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.4 }} className="flex flex-wrap gap-5 items-center justify-end shrink-0">
            {/* Financial Panel - Teks diperkecil */}
            {wallet && (
              <div className="flex flex-col text-right mr-2 border-r border-p3-blue/30 pr-5">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Balance</span>
                <span className="text-sm font-black text-p3-cyan tracking-wider">Rp {Number(wallet.balance - wallet.frozen_balance).toLocaleString("id-ID")}</span>
                {Number(wallet.frozen_balance) > 0 && <span className="text-[9px] font-bold text-red-400 tracking-widest mt-0.5">[HOLD: Rp {Number(wallet.frozen_balance).toLocaleString("id-ID")}]</span>}
              </div>
            )}

            {/* Navigation Links - Dibersihkan dari box/clip-path agresif */}
            {user?.role === "admin" && (
              <Link href="/admin" className="text-sm font-bold text-red-500 hover:text-red-400 uppercase tracking-wider transition-colors">
                Admin
              </Link>
            )}

            {user && (
              <>
                <Link href="/profile" className="text-sm font-bold text-p3-white hover:text-p3-cyan uppercase tracking-wider transition-colors">
                  Profile
                </Link>
                {/* CTA Button - Tetap menggunakan desain mencolok namun ukurannya dipadatkan */}
                <Link
                  href="/auctions/create"
                  className="px-5 py-2 bg-p3-cyan text-p3-dark text-sm font-black italic tracking-widest uppercase hover:bg-p3-white transition-colors"
                  style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" }}
                >
                  Create
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </header>
  );
}
