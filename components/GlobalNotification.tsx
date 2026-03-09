"use client";

import { useEffect, useState } from "react";
import { useEcho } from "./providers/EchoProvider";
import api from "@/services/api/axios";

export function GlobalNotification() {
  const echo = useEcho();
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    if (!echo) return;

    let userId: number | null = null;

    // Ambil ID user yang sedang login untuk membuka channel privatnya
    api
      .get("/user")
      .then((res) => {
        userId = res.data.id;
        if (userId) {
          echo
            .private(`user.${userId}`)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .listen(".outbid.notification", (e: any) => {
              const msg = `PERINGATAN OUTBID: Posisi Anda di lelang "${e.auctionTitle}" telah disalip! Harga terbaru: Rp ${Number(e.newPrice).toLocaleString("id-ID")}`;
              setNotifications((prev) => [...prev, msg]);

              // Auto-hilang setelah 7 detik
              setTimeout(() => {
                setNotifications((prev) => prev.slice(1));
              }, 7000);
            });
        }
      })
      .catch(() => console.log("Unauthenticated for global notifications"));

    return () => {
      if (userId) echo.leaveChannel(`user.${userId}`);
    };
  }, [echo]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 font-sans">
      {notifications.map((notif, i) => (
        <div key={i} className="bg-red-600 border-l-4 border-black text-white px-6 py-4 rounded shadow-2xl font-bold animate-bounce">
          {notif}
        </div>
      ))}
    </div>
  );
}
