"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/services/api/axios";
import { motion, AnimatePresence } from "framer-motion";

export default function Profile() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"wallet" | "my_auctions" | "my_bids" | "won_auctions">("wallet");
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

  if (isLoading || !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-p3-dark">
        <motion.div animate={{ opacity: [0.3, 1, 0.3], scale: [0.98, 1.02, 0.98] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-p3-cyan text-2xl font-black italic tracking-widest uppercase">
          SYNCHRONIZING DOSSIER...
        </motion.div>
      </div>
    );
  }

  const { user, my_auctions, my_bids, won_auctions } = profileData;
  const wallet = user.wallet;

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
                {user.name} // {user.email}
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT PANEL: Navigasi Tab */}
          <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="lg:col-span-4 flex flex-col gap-3">
            {[
              { id: "wallet", label: "Financial Ledger" },
              { id: "my_auctions", label: "Deployed Assets" },
              { id: "my_bids", label: "Transmission Log" },
              { id: "won_auctions", label: "Acquired Assets" },
            ].map((tab) => (
              <button
                key={tab.id}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onClick={() => setActiveTab(tab.id as any)}
                className={`text-left px-6 py-4 font-black italic tracking-widest uppercase transition-all ${
                  activeTab === tab.id ? "bg-p3-cyan text-p3-dark shadow-cyan-glow scale-105 ml-2" : "bg-p3-dark/80 border border-p3-blue text-p3-cyan hover:bg-p3-blue/30 hover:ml-2"
                }`}
                style={{ clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0% 100%)" }}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* RIGHT PANEL: Area Konten Dinamis */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-8 bg-p3-dark/80 border border-p3-blue p-6 relative shadow-blue-glow h-[500px] flex flex-col"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 95%, 95% 100%, 0 100%)" }}
          >
            <div className="absolute top-0 right-0 w-1 h-full bg-p3-cyan" />

            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="flex flex-col h-full">
                {/* MODUL 1: DOMPET & MUTASI */}
                {activeTab === "wallet" && (
                  <>
                    <h2 className="text-2xl font-black italic tracking-widest text-p3-white uppercase mb-4 border-b border-p3-blue/50 pb-2">Financial Ledger</h2>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-p3-blue/10 border border-p3-cyan p-4" style={{ clipPath: "polygon(0 0, 100% 0, 95% 100%, 0% 100%)" }}>
                        <span className="block text-xs text-p3-cyan uppercase tracking-widest font-bold mb-1">Available Funds</span>
                        <span className="text-2xl font-black italic text-p3-white drop-shadow-sm">Rp {Number(wallet?.balance - wallet?.frozen_balance).toLocaleString("id-ID")}</span>
                      </div>
                      <div className="bg-red-900/20 border border-red-500 p-4" style={{ clipPath: "polygon(0 0, 100% 0, 95% 100%, 0% 100%)" }}>
                        <span className="block text-xs text-red-400 uppercase tracking-widest font-bold mb-1">Frozen Escrow</span>
                        <span className="text-2xl font-black italic text-red-500 drop-shadow-sm">Rp {Number(wallet?.frozen_balance).toLocaleString("id-ID")}</span>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-p3-cyan uppercase tracking-widest mb-3">Mutation Log</h3>
                    <div className="overflow-y-auto custom-scrollbar flex-1 pr-2 space-y-3">
                      {wallet?.transactions && wallet.transactions.length > 0 ? (
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        wallet.transactions.map((trx: any) => (
                          <div key={trx.id} className="flex justify-between items-center bg-p3-blue/5 p-3 border-l-2 border-p3-blue hover:bg-p3-blue/10 transition-colors">
                            <div>
                              <span className={`font-black italic uppercase tracking-wider text-sm ${trx.type === "payment" ? "text-red-400" : trx.type === "refund" ? "text-green-400" : "text-yellow-400"}`}>{trx.type}</span>
                              <span className="block text-xs text-gray-500 font-mono mt-1">{new Date(trx.created_at).toLocaleString("id-ID")}</span>
                            </div>
                            <span className={`font-bold ${trx.type === "payment" ? "text-red-400" : "text-p3-white"}`}>
                              {trx.type === "payment" ? "-" : "+"}Rp {Number(trx.amount).toLocaleString("id-ID")}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 italic font-mono text-sm">NO TRANSACTION DATA.</p>
                      )}
                    </div>
                  </>
                )}

                {/* MODUL 2: LELANG YANG DIPUBLIKASIKAN */}
                {activeTab === "my_auctions" && (
                  <>
                    <h2 className="text-2xl font-black italic tracking-widest text-p3-white uppercase mb-4 border-b border-p3-blue/50 pb-2">Deployed Assets</h2>
                    <div className="overflow-y-auto custom-scrollbar flex-1 pr-2 space-y-4">
                      {my_auctions.length === 0 ? (
                        <p className="text-p3-cyan/50 text-sm italic font-mono tracking-widest mt-4">NO ASSETS DEPLOYED.</p>
                      ) : (
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        my_auctions.map((auction: any) => (
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
                  </>
                )}

                {/* MODUL 3: RIWAYAT BIDDING */}
                {activeTab === "my_bids" && (
                  <>
                    <h2 className="text-2xl font-black italic tracking-widest text-p3-white uppercase mb-4 border-b border-p3-blue/50 pb-2">Transmission Log</h2>
                    <div className="overflow-y-auto custom-scrollbar flex-1 pr-2 space-y-4">
                      {my_bids.length === 0 ? (
                        <p className="text-p3-cyan/50 text-sm italic font-mono tracking-widest mt-4">NO TRANSMISSIONS LOGGED.</p>
                      ) : (
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        my_bids.map((bid: any) => (
                          <motion.div
                            key={bid.id}
                            whileHover={{ x: 5, backgroundColor: "rgba(0, 71, 171, 0.2)" }}
                            className="border border-p3-blue/50 p-4 bg-p3-blue/10 flex justify-between items-center transition-all"
                            style={{ clipPath: "polygon(2% 0, 100% 0, 98% 100%, 0% 100%)" }}
                          >
                            <div>
                              <Link href={`/auctions/${bid.auction?.id}`} className="font-bold text-p3-cyan text-lg italic tracking-wider hover:underline block mb-1">
                                {bid.auction?.title || "UNKNOWN ENTITY"}
                              </Link>
                              <p className="text-xs text-p3-white/60 font-mono tracking-widest">{new Date(bid.created_at).toLocaleString("id-ID")}</p>
                            </div>
                            <div className="text-right">
                              <span className="block text-[10px] text-p3-cyan font-bold uppercase tracking-widest">Your Bid</span>
                              <span className="font-black italic text-p3-white drop-shadow-md">Rp {Number(bid.bid_amount).toLocaleString("id-ID")}</span>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </>
                )}

                {/* MODUL 4: LELANG YANG DIMENANGKAN */}
                {activeTab === "won_auctions" && (
                  <>
                    <h2 className="text-2xl font-black italic tracking-widest text-p3-white uppercase mb-4 border-b border-p3-blue/50 pb-2">Acquired Assets</h2>
                    <div className="overflow-y-auto custom-scrollbar flex-1 pr-2 space-y-4">
                      {won_auctions.length === 0 ? (
                        <p className="text-p3-cyan/50 text-sm italic font-mono tracking-widest mt-4">NO ASSETS ACQUIRED YET.</p>
                      ) : (
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        won_auctions.map((auction: any) => (
                          <motion.div
                            key={auction.id}
                            whileHover={{ scale: 1.02 }}
                            className="border border-yellow-500 p-4 bg-yellow-900/20 shadow-[0_0_15px_rgba(234,179,8,0.1)] flex justify-between items-center relative"
                            style={{ clipPath: "polygon(2% 0, 100% 0, 98% 100%, 0% 100%)" }}
                          >
                            <div className="absolute top-0 right-0 bg-yellow-500 text-p3-dark text-[10px] font-black italic px-3 py-1 uppercase" style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" }}>
                              VICTORY
                            </div>
                            <div className="mt-2">
                              <h3 className="font-black italic text-lg text-yellow-500 truncate">{auction.title}</h3>
                              <p className="text-xs text-yellow-500/60 font-mono tracking-widest uppercase">CLEARED ON: {new Date(auction.end_time).toLocaleDateString("id-ID")}</p>
                            </div>
                            <span className="font-black text-xl italic text-p3-white drop-shadow-md mt-2">Rp {Number(auction.current_price).toLocaleString("id-ID")}</span>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
