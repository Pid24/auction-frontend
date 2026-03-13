"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/services/api/axios";
import { motion } from "framer-motion";

export default function Profile() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/profile");
      setProfileData(response.data);
    } catch (error) {
      console.error("Transmission failed:", error);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-p3-dark">
        <motion.div animate={{ opacity: [0.3, 1, 0.3], scale: [0.98, 1.02, 0.98] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-p3-cyan text-2xl font-black italic tracking-widest uppercase">
          SYNCHRONIZING DOSSIER...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-p3-dark font-sans relative overflow-hidden pt-16 pb-20 px-6">
      {/* Background Ornament */}
      <div className="fixed top-0 right-0 w-1/3 h-screen bg-p3-blue/10 pointer-events-none z-0" style={{ clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0% 100%)" }} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header / Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b-2 border-p3-cyan pb-6">
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <h1 className="text-4xl font-black italic tracking-widest text-p3-white uppercase drop-shadow-md mb-3">
              Operative <span className="text-p3-cyan">Dossier</span>
            </h1>
            <div className="flex items-center gap-4">
              <span className="bg-p3-cyan text-p3-dark px-4 py-1 font-black italic text-sm tracking-widest uppercase" style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" }}>
                ID
              </span>
              <p className="text-p3-cyan/80 font-mono tracking-wider font-bold">
                {profileData.user.name} // {profileData.user.email}
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-transparent border-2 border-p3-cyan text-p3-cyan font-bold italic tracking-widest uppercase transition-colors hover:bg-p3-cyan hover:text-p3-dark"
              style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" }}
            >
              &#171; BACK
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Panel 1: Deployed Assets */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-p3-dark/80 border border-p3-blue p-6 relative shadow-blue-glow h-[500px] flex flex-col"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 95%, 95% 100%, 0 100%)" }}
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-p3-cyan" />
            <h2 className="text-xl font-black italic tracking-widest text-p3-white uppercase mb-4 border-b border-p3-blue/50 pb-2">Deployed Assets</h2>

            <div className="overflow-y-auto custom-scrollbar flex-1 pr-2 space-y-4">
              {profileData.my_auctions.length === 0 ? (
                <p className="text-p3-cyan/50 text-sm italic font-mono tracking-widest mt-4">NO ASSETS DEPLOYED.</p>
              ) : (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                profileData.my_auctions.map((auction: any) => (
                  <motion.div
                    key={auction.id}
                    whileHover={{ x: 5, backgroundColor: "rgba(0, 71, 171, 0.2)" }}
                    className="border border-p3-blue/50 p-4 bg-p3-blue/10 flex justify-between items-center transition-all"
                    style={{ clipPath: "polygon(2% 0, 100% 0, 98% 100%, 0% 100%)" }}
                  >
                    <div>
                      <Link href={`/auctions/${auction.id}`} className="font-bold text-p3-cyan text-lg italic tracking-wider hover:underline block mb-1">
                        {auction.title}
                      </Link>
                      <p className="text-xs text-p3-white/60 font-mono tracking-widest uppercase">
                        STATUS: <span className={`font-bold ${auction.status === "active" ? "text-p3-cyan drop-shadow-md" : auction.status === "pending" ? "text-yellow-400" : "text-red-500"}`}>{auction.status}</span>
                      </p>
                    </div>
                    <span className="font-black italic text-p3-white drop-shadow-md">Rp {Number(auction.current_price).toLocaleString("id-ID")}</span>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Panel 2: Transmission Log */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-p3-dark/80 border border-p3-blue p-6 relative shadow-blue-glow h-[500px] flex flex-col"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 95%, 95% 100%, 0 100%)" }}
          >
            <div className="absolute top-0 right-0 w-1 h-full bg-p3-cyan" />
            <h2 className="text-xl font-black italic tracking-widest text-p3-white uppercase mb-4 border-b border-p3-blue/50 pb-2">Transmission Log</h2>

            <div className="overflow-y-auto custom-scrollbar flex-1 pr-2 space-y-4">
              {profileData.my_bids.length === 0 ? (
                <p className="text-p3-cyan/50 text-sm italic font-mono tracking-widest mt-4">NO TRANSMISSIONS LOGGED.</p>
              ) : (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                profileData.my_bids.map((bid: any) => (
                  <motion.div
                    key={bid.id}
                    whileHover={{ x: -5, backgroundColor: "rgba(0, 71, 171, 0.2)" }}
                    className="border border-p3-blue/50 p-4 bg-p3-blue/10 flex justify-between items-center transition-all"
                    style={{ clipPath: "polygon(2% 0, 100% 0, 98% 100%, 0% 100%)" }}
                  >
                    <div>
                      <Link href={`/auctions/${bid.auction?.id}`} className="font-bold text-p3-cyan text-lg italic tracking-wider hover:underline block mb-1">
                        {bid.auction?.title || "UNKNOWN ENTITY"}
                      </Link>
                      <p className="text-xs text-p3-white/60 font-mono tracking-widest">{new Date(bid.created_at).toLocaleString("id-ID")}</p>
                    </div>
                    <span className="font-black italic text-p3-cyan drop-shadow-md">Rp {Number(bid.bid_amount).toLocaleString("id-ID")}</span>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
