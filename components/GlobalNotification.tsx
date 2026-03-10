"use client";

import { useEffect, useState } from "react";
import { useEcho } from "./providers/EchoProvider";
import api from "@/services/api/axios";

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

          // Listener Outbid
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          channel.listen(".outbid.notification", (e: any) => {
            const msg = `PERINGATAN OUTBID: Posisi Anda di lelang "${e.auctionTitle}" telah disalip! Harga terbaru: Rp ${Number(e.newPrice).toLocaleString("id-ID")}`;
            setOutbidNotifs((prev) => [...prev, msg]);
            setTimeout(() => setOutbidNotifs((prev) => prev.slice(1)), 7000);
          });

          // Listener Kemenangan
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          channel.listen(".auction.won", (e: any) => {
            const msg = `SELAMAT! Anda resmi memenangkan lelang "${e.auctionTitle}" dengan harga akhir Rp ${Number(e.winningAmount).toLocaleString("id-ID")}.`;
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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 font-sans">
      {outbidNotifs.map((notif, i) => (
        <div key={`outbid-${i}`} className="bg-red-600 border-l-4 border-black text-white px-6 py-4 rounded shadow-2xl font-bold animate-bounce">
          {notif}
        </div>
      ))}
      {winNotifs.map((notif, i) => (
        <div key={`win-${i}`} className="bg-green-600 border-l-4 border-black text-white px-6 py-4 rounded shadow-2xl font-bold animate-bounce">
          {notif}
        </div>
      ))}
    </div>
  );
}
