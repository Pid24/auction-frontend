"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api/axios";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      const token = response.data.access_token;

      if (token) {
        localStorage.setItem("access_token", token);
        // Redirect dinormalisasi ke Dashboard Utama
        router.push("/");
      } else {
        setError("SYSTEM FAILED TO VALIDATE AUTHORIZATION TOKEN.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "INVALID CREDENTIALS OR SERVER UNRESPONSIVE.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-p3-dark font-sans relative overflow-hidden px-6">
      {/* Background Ornament */}
      <div className="fixed top-0 left-0 w-full h-screen bg-p3-blue/5 pointer-events-none z-0" style={{ clipPath: "polygon(0 0, 50% 0, 20% 100%, 0% 100%)" }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full p-8 bg-p3-dark/80 border border-p3-blue shadow-blue-glow relative z-10 flex flex-col gap-6"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 92%, 92% 100%, 0 100%)" }}
      >
        {/* Top Accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-p3-cyan" />

        <h2 className="text-3xl font-black italic text-center tracking-widest text-p3-white uppercase drop-shadow-md border-b border-p3-blue/50 pb-4">
          System <span className="text-p3-cyan">Auth</span>
        </h2>

        {error && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-red-900/40 text-red-400 p-3 text-sm font-bold tracking-widest uppercase italic border-l-4 border-red-500">
            [ERROR] {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-bold text-p3-cyan uppercase tracking-widest opacity-80 mb-2">Operative Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-p3-blue/10 border-b-2 border-p3-blue text-p3-white font-bold focus:outline-none focus:border-p3-cyan focus:bg-p3-blue/20 transition-all placeholder-p3-blue/50"
              placeholder="Enter identification..."
              required
              style={{ clipPath: "polygon(0 0, 100% 0, 98% 100%, 0% 100%)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-p3-cyan uppercase tracking-widest opacity-80 mb-2">Security Passcode</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-p3-blue/10 border-b-2 border-p3-blue text-p3-white font-bold focus:outline-none focus:border-p3-cyan focus:bg-p3-blue/20 transition-all placeholder-p3-blue/50"
              placeholder="Enter passcode..."
              required
              style={{ clipPath: "polygon(0 0, 100% 0, 98% 100%, 0% 100%)" }}
            />
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.05, filter: "drop-shadow(0 0 10px var(--color-p3-cyan))" }}
            whileTap={{ scale: isLoading ? 1 : 0.95 }}
            className="w-full mt-4 bg-p3-blue text-p3-white font-black italic tracking-widest uppercase py-4 disabled:bg-gray-800 disabled:text-gray-500 transition-colors"
            style={{ clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0% 100%)" }}
          >
            {isLoading ? "AUTHENTICATING..." : "INITIALIZE LOGIN"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
