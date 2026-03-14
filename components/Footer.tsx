"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const supportLinks = [
    { name: "FAQ & Helpdesk", href: "/support" },
    { name: "How to Bid", href: "#" },
    { name: "How to Sell", href: "#" },
    { name: "Payment & Escrow", href: "/about" },
    { name: "Client Advisory", href: "#" },
  ];

  const corporateLinks = [
    { name: "About Auction.OS", href: "/about" },
    { name: "Careers", href: "#" },
    { name: "Press & Media", href: "#" },
    { name: "Server Locations", href: "#" },
    { name: "System Architecture", href: "#" },
  ];

  const legalLinks = [
    { name: "Terms & Conditions", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Security Protocols", href: "#" },
    { name: "KYC Information", href: "#" },
    { name: "Data Restitution", href: "#" },
  ];

  return (
    <footer className="relative mt-20 bg-p3-dark border-t border-p3-cyan/30 pt-16 pb-8 px-6 overflow-hidden">
      {/* Background Ornament */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-p3-cyan/5 pointer-events-none z-0" style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Section: Main Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-10 mb-16">
          {/* Column 1: Brand & System Status (Span 4) */}
          <div className="col-span-2 lg:col-span-4 pr-0 lg:pr-8">
            <h2 className="text-3xl font-black italic tracking-widest text-p3-white uppercase mb-4 drop-shadow-md">
              AUCTION<span className="text-p3-cyan">.OS</span>
            </h2>
            <p className="text-[11px] text-gray-400 font-medium leading-relaxed mb-8 max-w-sm uppercase tracking-wider">
              Sistem pelelangan aset terenkripsi dengan protokol
              <span className="text-p3-cyan font-bold italic"> Escrow Mutlak</span>. Operasi real-time ditenagai oleh arsitektur Headless CMS.
            </p>

            <div className="bg-p3-blue/5 p-4 border border-p3-blue/30 relative" style={{ clipPath: "polygon(0 0, 100% 0, 95% 100%, 0 100%)" }}>
              <div className="absolute top-0 left-0 w-1 h-full bg-p3-cyan" />
              <div className="flex items-center gap-3 mb-2 ml-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                <span className="text-xs font-mono text-p3-white tracking-widest uppercase font-bold">Mainframe Active</span>
              </div>
              <p className="text-[10px] text-gray-500 font-mono leading-relaxed ml-2">
                WebSockets: Connected [cite: 9] <br />
                Escrow Protocol: V4.0-Stable [cite: 40]
              </p>
            </div>
          </div>

          {/* Column 2: Support (Span 2) */}
          <div className="col-span-1 lg:col-span-2">
            <h3 className="text-p3-white font-bold uppercase tracking-widest text-xs mb-6 border-b border-p3-blue/50 pb-2">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[11px] text-gray-400 hover:text-p3-cyan uppercase tracking-wider transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Corporate (Span 2) */}
          <div className="col-span-1 lg:col-span-2">
            <h3 className="text-p3-white font-bold uppercase tracking-widest text-xs mb-6 border-b border-p3-blue/50 pb-2">Corporate</h3>
            <ul className="space-y-3">
              {corporateLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[11px] text-gray-400 hover:text-p3-cyan uppercase tracking-wider transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal (Span 2) */}
          <div className="col-span-1 lg:col-span-2">
            <h3 className="text-p3-white font-bold uppercase tracking-widest text-xs mb-6 border-b border-p3-blue/50 pb-2">More Info</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[11px] text-gray-400 hover:text-p3-cyan uppercase tracking-wider transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Social Channels (Span 2) */}
          <div className="col-span-1 lg:col-span-2">
            <h3 className="text-p3-cyan font-bold italic uppercase tracking-widest text-xs mb-6 border-b border-p3-cyan/50 pb-2">Channels</h3>
            <div className="flex flex-wrap gap-2">
              {["[ X ]", "[ FB ]", "[ IG ]", "[ YT ]"].map((social) => (
                <a key={social} href="#" className="px-2 py-1 bg-p3-blue/10 border border-p3-blue/30 text-[10px] font-black italic text-gray-300 hover:bg-p3-cyan hover:text-p3-dark transition-all uppercase tracking-widest">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Sotheby's Style Disclaimer */}
        <div className="pt-6 border-t border-p3-blue/20 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <p className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">&copy; {currentYear} AUCTION.OS // FULL-DECOUPLED ARCHITECTURE [cite: 2]</p>
          <div className="text-[9px] font-mono text-gray-600 tracking-widest uppercase lg:text-right max-w-xl">
            All digital asset transfers are secured by Escrow Protocol. Validated by Auction.OS network. Do not share your access token.
          </div>
        </div>
      </div>
    </footer>
  );
}
