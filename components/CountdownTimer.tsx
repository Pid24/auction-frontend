"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  targetDate: string;
  onExpire?: () => void; // Fungsi pelaporan ke halaman induk
}

export function CountdownTimer({ targetDate, onExpire }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>("--:--:--");
  const [isCritical, setIsCritical] = useState<boolean>(false);

  useEffect(() => {
    let hasExpired = false;

    const calculateTime = () => {
      if (hasExpired) return false;

      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const distance = target - now;

      // Saat waktu menyentuh 0
      if (distance <= 0) {
        setTimeLeft("HALTED");
        setIsCritical(false);
        hasExpired = true;

        // Laporkan ke halaman induk bahwa waktu sudah habis
        if (onExpire) {
          onExpire();
        }

        return false;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const format = (num: number) => num.toString().padStart(2, "0");
      setTimeLeft(`${format(hours)}:${format(minutes)}:${format(seconds)}`);

      setIsCritical(distance <= 120000);
      return true;
    };

    const shouldContinue = calculateTime();
    if (!shouldContinue) return;

    const timer = setInterval(() => {
      const active = calculateTime();
      if (!active) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onExpire]);

  return (
    <span
      className={`text-2xl lg:text-3xl font-black italic tracking-widest transition-colors duration-300 ${
        isCritical ? "text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse" : "text-p3-white"
      } ${timeLeft === "HALTED" ? "text-gray-500 animate-none" : ""}`}
    >
      {timeLeft}
    </span>
  );
}
