"use client";

import { useEffect, useState } from "react";
import { useEcho } from "./providers/EchoProvider";
import api from "@/services/api/axios";
import { motion, AnimatePresence } from "framer-motion";

export function GlobalNotification() {
  const echo = useEcho();
  const [outbidNotifs, setOutbidNotifs] = useState<string[]>([]);
  const [winNotifs, setWinNotifs] = useState<string[]>([]);

  useEffect(() => {
    if (!echo) return;

    let userId: number | null = null;

    api
      .get("/user")
      .then((res) => {
        userId = res.data.id;
        if (userId) {
          const channel = echo.private(`user.${userId}`);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          channel.listen(".outbid.notification", (e: any) => {
            const msg = `OUTBID WARNING: Posisi pada aset "${e.auctionTitle}" disalip. Nilai Puncak Baru: Rp ${Number(e.newPrice).toLocaleString("id-ID")}`;
            setOutbidNotifs((prev) => [...prev, msg]);
            setTimeout(() => setOutbidNotifs((prev) => prev.slice(1)), 7000);
          });

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          channel.listen(".auction.won", (e: any) => {
            const msg = `OPERATION CONCLUDED: Anda memenangkan aset "${e.auctionTitle}". Dana Rp ${Number(e.winningAmount).toLocaleString("id-ID")} dipotong mutlak.`;
            setWinNotifs((prev) => [...prev, msg]);
            setTimeout(() => setWinNotifs((prev) => prev.slice(1)), 10000);
          });
        }
      })
      .catch(() => console.log("Unauthenticated for global notifications"));

    return () => {
      if (userId) echo.leaveChannel(`user.${userId}`);
    };
  }, [echo]);

  if (outbidNotifs.length === 0 && winNotifs.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans max-w-sm pointer-events-none">
      <AnimatePresence>
        {outbidNotifs.map((notif, i) => (
          <motion.div
            key={`outbid-${i}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-red-900/90 border-l-4 border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.5)] text-red-100 px-6 py-4 font-black italic uppercase tracking-widest text-xs pointer-events-auto"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%)" }}
          >
            {notif}
          </motion.div>
        ))}
        {winNotifs.map((notif, i) => (
          <motion.div
            key={`win-${i}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-p3-blue/90 border-l-4 border-p3-cyan shadow-cyan-glow text-p3-white px-6 py-4 font-black italic uppercase tracking-widest text-xs pointer-events-auto"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%)" }}
          >
            {notif}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
