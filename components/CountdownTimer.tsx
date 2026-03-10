"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  targetDate: string;
}

export function CountdownTimer({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>("Menghitung...");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft("0h 0j 0m 0d");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}h ${hours}j ${minutes}m ${seconds}d`);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return <span className="text-2xl font-mono font-bold text-red-600 tracking-wider">{timeLeft}</span>;
}
