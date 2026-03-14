"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 bg-p3-dark border-t-2 border-p3-blue/30 pt-16 pb-8 px-6 overflow-hidden">
      {/* Background Ornament */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-p3-cyan/5 pointer-events-none z-0" style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand Section */}
          <div className="md:col-span-5">
            <h2 className="text-3xl font-black italic tracking-widest text-p3-white uppercase mb-4">
              AUCTION<span className="text-p3-cyan">.OS</span>
            </h2>
            <p className="text-gray-400 font-medium leading-relaxed max-w-sm">
              Sistem pelelangan aset digital terenkripsi dengan protokol
              <span className="text-p3-cyan italic"> Escrow Mutlak</span>. Operasi real-time ditenagai oleh arsitektur Headless CMS.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h3 className="text-p3-cyan font-black italic uppercase tracking-widest text-sm mb-6 border-l-4 border-p3-cyan pl-3">Navigation</h3>
            <ul className="space-y-3 font-bold italic uppercase text-xs tracking-tighter">
              <li>
                <Link href="/" className="text-gray-400 hover:text-p3-white transition-colors">
                  Main Hub
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-400 hover:text-p3-white transition-colors">
                  Operative Dossier
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-gray-400 hover:text-p3-white transition-colors">
                  Admin Terminal
                </Link>
              </li>
            </ul>
          </div>

          {/* System Status */}
          <div className="md:col-span-4">
            <h3 className="text-p3-cyan font-black italic uppercase tracking-widest text-sm mb-6 border-l-4 border-p3-cyan pl-3">System Status</h3>
            <div className="bg-p3-blue/10 p-4 border border-p3-blue/30" style={{ clipPath: "polygon(0 0, 100% 0, 95% 100%, 0 100%)" }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                <span className="text-xs font-mono text-p3-white tracking-widest uppercase font-bold">Mainframe Active</span>
              </div>
              <p className="text-[10px] text-gray-500 font-mono leading-tight">
                WebSockets: Connected [cite: 9] <br />
                Escrow Protocol: V4.0-Stable [cite: 40]
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-p3-blue/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">&copy; {currentYear} AUCTION.OS // FULL-DECOUPLED ARCHITECTURE [cite: 2]</p>
          <div className="flex gap-6">
            <span className="text-[10px] font-black italic text-p3-cyan uppercase tracking-widest opacity-50">Level 5 Clearance Required</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
