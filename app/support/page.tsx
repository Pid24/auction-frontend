"use client";

import { useState } from "react";
import Link from "next/link";

export default function SupportPage() {
  const [ticketData, setTicketData] = useState({ subject: "", description: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrasi ke endpoint API pelaporan tiket
    setIsSubmitted(true);
    setTicketData({ subject: "", description: "" });
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-transparent font-sans pt-10 pb-20 px-6 relative overflow-hidden">
      <div className="fixed top-0 left-0 w-1/3 h-screen bg-red-900/5 pointer-events-none z-0" style={{ clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)" }} />

      <div className="max-w-5xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Kolom FAQ */}
        <div className="bg-p3-dark/80 border border-p3-blue/50 p-8 shadow-lg backdrop-blur-sm">
          <div className="mb-8">
            <Link href="/" className="text-sm font-bold text-p3-cyan hover:text-p3-white uppercase tracking-widest transition-colors">
              &laquo; Dashboard
            </Link>
          </div>

          <h2 className="text-2xl font-black italic text-p3-white uppercase tracking-widest border-b border-p3-blue pb-4 mb-6">Frequently Asked Questions</h2>

          <div className="space-y-6 text-sm text-gray-300">
            <div>
              <h3 className="font-bold text-p3-cyan uppercase tracking-wider mb-1">Q: Mengapa saya tidak bisa melakukan bid?</h3>
              <p className="text-gray-400">Pastikan saldo dompet (Balance) Anda mencukupi dan tidak sedang ditahan (Frozen) di lelang lain. Anda tidak bisa menawar lelang milik Anda sendiri.</p>
            </div>
            <div>
              <h3 className="font-bold text-p3-cyan uppercase tracking-wider mb-1">Q: Bagaimana cara membatalkan bid?</h3>
              <p className="text-gray-400">Protokol sistem melarang pembatalan tawaran yang sudah masuk ke pangkalan data. Setiap eksekusi bersifat mutlak.</p>
            </div>
            <div>
              <h3 className="font-bold text-p3-cyan uppercase tracking-wider mb-1">Q: Barang yang saya terima tidak sesuai?</h3>
              <p className="text-gray-400">Gunakan fitur pelaporan (Report) pada halaman detail barang, atau buat tiket keluhan di panel samping agar Admin dapat membekukan akun kreator terkait.</p>
            </div>
          </div>
        </div>

        {/* Kolom Ticket Submission */}
        <div className="bg-p3-dark/80 border border-p3-cyan/30 p-8 shadow-lg backdrop-blur-sm flex flex-col">
          <h2 className="text-2xl font-black italic text-p3-white uppercase tracking-widest border-b border-p3-cyan pb-4 mb-6 shadow-cyan-glow w-max">Submit Support Ticket</h2>

          <p className="text-sm text-gray-400 mb-6">Jika Anda mendeteksi anomali pada sistem transaksional atau ingin melaporkan entitas penipuan, kirimkan log keluhan Anda di bawah ini.</p>

          {isSubmitted && <div className="mb-6 p-4 bg-green-900/40 border-l-4 border-green-500 text-green-400 text-sm font-bold uppercase tracking-wider">[SYSTEM] Ticket successfully transmitted to Administrator.</div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
            <div>
              <label className="block text-xs font-bold text-p3-cyan uppercase tracking-widest mb-2">Subject / Reference ID</label>
              <input
                type="text"
                required
                value={ticketData.subject}
                onChange={(e) => setTicketData({ ...ticketData, subject: e.target.value })}
                className="w-full bg-p3-blue/5 border border-p3-blue/50 text-p3-white px-4 py-3 text-sm focus:outline-none focus:border-p3-cyan focus:bg-p3-blue/10 transition-colors"
                placeholder="e.g. Issue with Auction ID #1042"
              />
            </div>

            <div className="flex-1 flex flex-col">
              <label className="block text-xs font-bold text-p3-cyan uppercase tracking-widest mb-2">Issue Description</label>
              <textarea
                required
                rows={6}
                value={ticketData.description}
                onChange={(e) => setTicketData({ ...ticketData, description: e.target.value })}
                className="w-full flex-1 bg-p3-blue/5 border border-p3-blue/50 text-p3-white px-4 py-3 text-sm focus:outline-none focus:border-p3-cyan focus:bg-p3-blue/10 transition-colors resize-none"
                placeholder="Detail the anomaly here..."
              ></textarea>
            </div>

            <button type="submit" className="mt-4 px-6 py-3 bg-p3-cyan text-p3-dark font-black italic tracking-widest uppercase hover:bg-p3-white transition-colors self-end" style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" }}>
              Transmit Data
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
