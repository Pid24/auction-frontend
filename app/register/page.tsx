"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/services/api/axios";
import { motion } from "framer-motion";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (formData.password !== formData.password_confirmation) {
      setError("PASSCODES DO NOT MATCH.");
      setIsLoading(false);
      return;
    }

    try {
      await api.post("/register", formData);
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "REGISTRATION FAILED. VERIFY YOUR INPUT.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-p3-dark font-sans relative overflow-hidden px-6 py-12">
      {/* Background Ornament */}
      <div className="fixed top-0 right-0 w-full h-screen bg-p3-blue/5 pointer-events-none z-0" style={{ clipPath: "polygon(80% 0, 100% 0, 100% 100%, 50% 100%)" }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full p-8 bg-p3-dark/80 border border-p3-blue shadow-blue-glow relative z-10 flex flex-col gap-6"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 95%, 92% 100%, 0 100%)" }}
      >
        {/* Top Accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-p3-cyan" />

        <h2 className="text-3xl font-black italic text-center tracking-widest text-p3-white uppercase drop-shadow-md border-b border-p3-blue/50 pb-4">
          Operative <span className="text-p3-cyan">Enrollment</span>
        </h2>

        {error && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-red-900/40 text-red-400 p-3 text-sm font-bold tracking-widest uppercase italic border-l-4 border-red-500">
            [ERROR] {error}
          </motion.div>
        )}

        {success && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-p3-cyan/20 text-p3-cyan p-3 text-sm font-bold tracking-widest uppercase italic border-l-4 border-p3-cyan">
            ENROLLMENT SUCCESSFUL. REDIRECTING TO AUTH...
          </motion.div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-bold text-p3-cyan uppercase tracking-widest opacity-80 mb-2">Operative Designation (Name)</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-4 bg-p3-blue/10 border-b-2 border-p3-blue text-p3-white font-bold focus:outline-none focus:border-p3-cyan focus:bg-p3-blue/20 transition-all placeholder-p3-blue/50"
              placeholder="Enter designation..."
              required
              style={{ clipPath: "polygon(0 0, 100% 0, 98% 100%, 0% 100%)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-p3-cyan uppercase tracking-widest opacity-80 mb-2">Network Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-4 bg-p3-blue/10 border-b-2 border-p3-blue text-p3-white font-bold focus:outline-none focus:border-p3-cyan focus:bg-p3-blue/20 transition-all placeholder-p3-blue/50"
              placeholder="Create passcode..."
              required
              style={{ clipPath: "polygon(0 0, 100% 0, 98% 100%, 0% 100%)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-p3-cyan uppercase tracking-widest opacity-80 mb-2">Verify Passcode</label>
            <input
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              className="w-full p-4 bg-p3-blue/10 border-b-2 border-p3-blue text-p3-white font-bold focus:outline-none focus:border-p3-cyan focus:bg-p3-blue/20 transition-all placeholder-p3-blue/50"
              placeholder="Confirm passcode..."
              required
              style={{ clipPath: "polygon(0 0, 100% 0, 98% 100%, 0% 100%)" }}
            />
          </div>

          <motion.button
            type="submit"
            disabled={isLoading || success}
            whileHover={{ scale: isLoading || success ? 1 : 1.05, filter: "drop-shadow(0 0 10px var(--color-p3-cyan))" }}
            whileTap={{ scale: isLoading || success ? 1 : 0.95 }}
            className="w-full mt-2 bg-p3-blue text-p3-white font-black italic tracking-widest uppercase py-4 disabled:bg-gray-800 disabled:text-gray-500 transition-colors"
            style={{ clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0% 100%)" }}
          >
            {isLoading ? "PROCESSING..." : "REGISTER OPERATIVE"}
          </motion.button>
        </form>

        <div className="text-center mt-4 border-t border-p3-blue/30 pt-4">
          <Link href="/login" className="text-xs font-bold text-p3-cyan/80 uppercase tracking-widest hover:text-p3-cyan transition-colors">
            ALREADY ENROLLED? INITIALIZE LOGIN
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
