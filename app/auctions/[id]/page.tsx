"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/services/api/axios";
import { useEcho } from "@/components/providers/EchoProvider";
import { CountdownTimer } from "@/components/CountdownTimer";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage` : "http://localhost:8000/storage";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AuctionRoom({ params }: { params: Promise<any> }) {
  const resolvedParams = use(params);
  const auctionId = resolvedParams.id;
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [auction, setAuction] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bids, setBids] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activeImage, setActiveImage] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [bidAmount, setBidAmount] = useState<number | string>("");
  const [message, setMessage] = useState<string>("");

  // State khusus untuk menahan layar dan memunculkan notifikasi instan
  const [isHalted, setIsHalted] = useState(false);
  const [localWinNotif, setLocalWinNotif] = useState<string>("");

  const echo = useEcho();

  useEffect(() => {
    fetchAuction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auctionId]);

  const fetchAuction = async () => {
    try {
      const [auctionRes, userRes] = await Promise.all([api.get(`/auctions/${auctionId}`), api.get("/user")]);

      const data = auctionRes.data.data || auctionRes.data;
      setAuction(data);
      setBids(data.bids || []);
      setCurrentUser(userRes.data);

      if (data.media && data.media.length > 0) {
        const primaryImage = data.media.find((m: any) => m.is_primary) || data.media[0];
        setActiveImage(primaryImage);
      }
    } catch (error) {
      console.error("Transmission failed:", error);
    }
  };

  useEffect(() => {
    if (!echo || !auctionId) return;

    const channel = echo.channel(`auction.${auctionId}`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    channel.listen(".bid.placed", (e: any) => {
      setAuction((prev: any) => ({
        ...prev,
        current_price: e.auction.current_price,
        end_time: e.auction.end_time,
      }));

      if (e.bid) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setBids((prevBids: any[]) => {
          const isDuplicate = prevBids.some((b) => b.id === e.bid.id);
          if (isDuplicate) return prevBids;
          return [e.bid, ...prevBids];
        });
      }
    });

    return () => {
      echo.leaveChannel(`auction.${auctionId}`);
    };
  }, [echo, auctionId]);

  // Efek ini akan berjalan otomatis sesaat setelah CountdownTimer melaporkan waktu habis
  useEffect(() => {
    if (isHalted && auction) {
      // Validasi apakah kamu adalah pemenang tertinggi saat ini
      if (bids.length > 0 && currentUser && bids[0].user_id === currentUser.id) {
        setLocalWinNotif(`OPERATION CONCLUDED: Anda mengamankan aset "${auction.title}". Menunggu pemotongan Escrow mutlak...`);
        // Tahan layarnya 5 detik biar kamu bisa baca notifnya, baru lempar ke Dasbor
        setTimeout(() => {
          router.push("/");
        }, 5000);
      } else {
        // Kalau bukan pemenang atau tidak ada bid, lempar lebih cepat (2 detik)
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    }
  }, [isHalted, auction, bids, currentUser, router]);

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Processing...");
    try {
      await api.post(`/auctions/${auctionId}/bids`, {
        bid_amount: Number(bidAmount),
      });
      setMessage("BID ACCEPTED.");
      setBidAmount("");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setMessage(error.response?.data?.message || "TRANSACTION FAILED.");
    }
  };

  if (!auction) {
    return (
      <div className="min-h-screen bg-p3-dark flex items-center justify-center">
        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-p3-cyan text-2xl font-black italic uppercase tracking-widest">
          Synchronizing Data...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-p3-dark font-sans relative overflow-hidden pb-20 pt-10 px-6">
      <div className="fixed top-0 right-0 w-1/2 h-screen bg-p3-blue/10 pointer-events-none z-0" style={{ clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0% 100%)" }} />

      <div className="max-w-7xl mx-auto relative z-10 mb-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link
            href="/"
            className="inline-block px-8 py-2 bg-transparent border-2 border-p3-cyan text-p3-cyan font-bold italic tracking-widest uppercase transition-colors hover:bg-p3-cyan hover:text-p3-dark"
            style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" }}
          >
            &#171; BACK
          </Link>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-p3-dark/60 border border-p3-blue p-8 relative" style={{ clipPath: "polygon(0 0, 100% 0, 100% 95%, 95% 100%, 0 100%)" }}>
            <div className="absolute top-0 left-0 w-2 h-full bg-p3-cyan" />

            <h1 className="text-4xl md:text-5xl font-black italic tracking-widest text-p3-white uppercase mb-6 drop-shadow-md">{auction.title}</h1>

            {auction.media && auction.media.length > 0 && (
              <div className="mb-8 border-b border-p3-blue/50 pb-8">
                <div className="relative w-full aspect-video bg-p3-blue/10 border-2 border-p3-blue mb-4 overflow-hidden group" style={{ clipPath: "polygon(0 0, 100% 0, 100% 92%, 95% 100%, 0 100%)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`${STORAGE_URL}/${activeImage.file_path}`} alt="Asset Primary" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-0 left-0 bg-p3-cyan text-p3-dark px-4 py-1 font-black italic uppercase tracking-widest text-xs shadow-cyan-glow" style={{ clipPath: "polygon(0 0, 100% 0, 90% 100%, 0% 100%)" }}>
                    VISUAL DATA
                  </div>
                </div>

                {auction.media.length > 1 && (
                  <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-2">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {auction.media.map((media: any) => (
                      <motion.div
                        key={media.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveImage(media)}
                        className={`relative w-24 h-24 shrink-0 cursor-pointer border-2 transition-all ${activeImage?.id === media.id ? "border-p3-cyan shadow-cyan-glow" : "border-p3-blue opacity-50 hover:opacity-100"}`}
                        style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%)" }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`${STORAGE_URL}/${media.file_path}`} alt="Thumbnail" className="w-full h-full object-cover" />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <h3 className="text-p3-cyan text-sm font-black italic tracking-widest uppercase mb-2">Description Parameters:</h3>
            <p className="text-gray-400 text-lg leading-relaxed whitespace-pre-wrap">{auction.description}</p>
          </motion.div>

          <AnimatePresence>
            {auction.status === "closed" && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-yellow-400 p-6 border-b-4 border-yellow-600 relative overflow-hidden"
                style={{ clipPath: "polygon(0 0, 95% 0, 100% 20%, 100% 100%, 0 100%)" }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300 opacity-50 rotate-45 transform translate-x-10 -translate-y-10" />
                <h3 className="font-black italic text-p3-dark text-2xl tracking-widest uppercase mb-2">OPERATION CONCLUDED</h3>
                {bids.length > 0 ? (
                  <p className="text-p3-dark text-lg font-bold">
                    Victor: <span className="font-black text-xl bg-p3-dark text-yellow-400 px-3 py-1 mx-1 skew-x-12 inline-block">{bids[0]?.user?.name || "Loading..."}</span>
                    <br className="md:hidden" /> Final Bid: <span className="font-black text-xl italic drop-shadow-sm">Rp {Number(bids[0]?.bid_amount).toLocaleString("id-ID")}</span>
                  </p>
                ) : (
                  <p className="text-p3-dark italic font-bold">Auction closed with zero participants.</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-p3-dark/80 border border-p3-blue p-6 relative shadow-blue-glow" style={{ clipPath: "polygon(5% 0, 100% 0, 100% 100%, 0% 100%)" }}>
            <div className="flex justify-between items-start mb-6 border-b border-p3-blue/50 pb-4">
              <div>
                <span className="block text-xs text-p3-cyan uppercase tracking-widest opacity-80 mb-1 font-bold">Current Peak</span>
                <motion.span key={auction.current_price} initial={{ scale: 1.2, color: "#fff" }} animate={{ scale: 1, color: "var(--color-p3-cyan)" }} className="text-4xl md:text-5xl font-black italic drop-shadow-md text-p3-cyan block">
                  Rp {Number(auction.current_price).toLocaleString("id-ID")}
                </motion.span>
              </div>
              <div className="text-right">
                <span
                  className={`px-4 py-1 text-sm font-black italic uppercase tracking-widest block mb-2 ${auction.status === "active" ? "bg-p3-cyan text-p3-dark shadow-cyan-glow" : auction.status === "pending" ? "bg-yellow-400 text-p3-dark" : "bg-red-600 text-white"}`}
                  style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" }}
                >
                  {auction.status}
                </span>
                <div className="text-right">
                  <span className="block text-xs text-p3-cyan uppercase tracking-widest opacity-80 mb-1 font-bold">{auction.status === "pending" ? "COMMENCES IN" : auction.status === "active" ? "TERMINATES IN" : "STATUS"}</span>
                  {auction.status === "closed" ? (
                    <span className="text-xl font-black italic text-gray-500 tracking-widest">HALTED</span>
                  ) : (
                    <CountdownTimer targetDate={auction.status === "pending" ? auction.start_time : auction.end_time} onExpire={() => setIsHalted(true)} />
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={handleBid} className="flex flex-col gap-4">
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder={`MIN: Rp ${(Number(auction.current_price) + 10000).toLocaleString("id-ID")}`}
                className="w-full bg-transparent border-2 border-p3-blue text-p3-white p-4 font-bold text-lg placeholder-p3-blue/50 focus:outline-none focus:border-p3-cyan focus:shadow-cyan-glow transition-all"
                required
                disabled={auction.status !== "active" || isHalted}
                style={{ clipPath: "polygon(2% 0, 100% 0, 98% 100%, 0% 100%)" }}
              />
              <motion.button
                type="submit"
                disabled={auction.status !== "active" || isHalted}
                whileHover={auction.status === "active" && !isHalted ? { scale: 1.02, filter: "drop-shadow(0 0 10px var(--color-p3-cyan))" } : {}}
                whileTap={auction.status === "active" && !isHalted ? { scale: 0.98 } : {}}
                className="w-full bg-p3-blue text-p3-white py-4 font-black italic tracking-widest uppercase disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                style={{ clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0% 100%)" }}
              >
                EXECUTE BID
              </motion.button>
            </form>

            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-3 font-bold text-center tracking-wider italic uppercase border-l-4 ${message.includes("ACCEPTED") ? "bg-p3-cyan/20 border-p3-cyan text-p3-cyan" : "bg-red-900/40 border-red-500 text-red-400"}`}
              >
                {message}
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-p3-dark/60 border border-p3-blue p-6 flex-1 max-h-[400px] overflow-y-auto custom-scrollbar"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 95%, 95% 100%, 0 100%)" }}
          >
            <h2 className="text-xl font-black italic tracking-widest text-p3-white uppercase mb-4 border-b border-p3-blue/50 pb-2">Transmission Log</h2>
            {bids.length === 0 ? (
              <p className="text-p3-cyan/50 text-sm italic font-mono tracking-widest">NO DATA IN LOG.</p>
            ) : (
              <ul className="space-y-3">
                <AnimatePresence>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {bids.map((bid: any, index: number) => (
                    <motion.li
                      key={bid.id || index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="flex justify-between items-center bg-p3-blue/10 p-3 border-l-2 border-p3-cyan hover:bg-p3-blue/20 transition-colors"
                    >
                      <div>
                        <span className="font-bold text-p3-white block text-sm">{bid.user?.name || "Unknown Entity"}</span>
                        <span className="text-xs text-p3-cyan/60 font-mono">{new Date(bid.created_at).toLocaleString("id-ID")}</span>
                      </div>
                      <span className="text-lg font-black italic text-p3-cyan drop-shadow-sm">Rp {Number(bid.bid_amount).toLocaleString("id-ID")}</span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </motion.div>
        </div>
      </div>

      {/* INJEKSI NOTIFIKASI INSTAN SAAT "HALTED" */}
      <AnimatePresence>
        {localWinNotif && (
          <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans max-w-sm">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-p3-blue/90 border-l-4 border-p3-cyan shadow-cyan-glow text-p3-white px-6 py-4 font-black italic uppercase tracking-widest text-xs"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%)" }}
            >
              {localWinNotif}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
