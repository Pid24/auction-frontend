"use client";

import { use, useEffect, useState } from "react";
import api from "@/services/api/axios";
import { useEcho } from "@/components/providers/EchoProvider";
import { CountdownTimer } from "@/components/CountdownTimer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AuctionRoom({ params }: { params: Promise<any> }) {
  const resolvedParams = use(params);
  const auctionId = resolvedParams.id;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [auction, setAuction] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bids, setBids] = useState<any[]>([]);
  const [bidAmount, setBidAmount] = useState<number | string>("");
  const [message, setMessage] = useState<string>("");

  const echo = useEcho();

  useEffect(() => {
    fetchAuction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auctionId]);

  const fetchAuction = async () => {
    try {
      const response = await api.get(`/auctions/${auctionId}`);
      const data = response.data.data || response.data;
      setAuction(data);
      setBids(data.bids || []);
    } catch (error) {
      console.error("Gagal memuat lelang:", error);
    }
  };

  useEffect(() => {
    if (!echo || !auctionId) return;

    const channel = echo.channel(`auction.${auctionId}`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    channel.listen(".bid.placed", (e: any) => {
      setAuction((prev: any) => ({
        ...prev,
        current_price: e.auction.current_price,
      }));

      if (e.bid) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setBids((prevBids: any[]) => {
          // Filter absolut: Cegah injeksi duplikat jika ID bid sudah ada di memori
          const isDuplicate = prevBids.some((b) => b.id === e.bid.id);
          if (isDuplicate) return prevBids;

          return [e.bid, ...prevBids];
        });
      }
    });

    return () => {
      echo.leaveChannel(`auction.${auctionId}`);
    };
  }, [echo, auctionId]);

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Memproses...");
    try {
      await api.post(`/auctions/${auctionId}/bids`, {
        bid_amount: Number(bidAmount),
      });
      setMessage("Bid berhasil dikirim.");
      setBidAmount("");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Transaksi gagal.");
    }
  };

  if (!auction) return <div className="p-10 text-center font-mono">Memuat koneksi ke server...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 font-sans">
      <div className="border rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-3xl font-bold">{auction.title}</h1>
          <div className="text-right bg-gray-100 p-3 rounded-lg border">
            <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">{auction.status === "pending" ? "Dimulai Dalam" : auction.status === "active" ? "Berakhir Dalam" : "Waktu"}</span>
            {auction.status === "closed" ? <span className="text-xl font-mono font-bold text-gray-500 tracking-wider">SELESAI</span> : <CountdownTimer targetDate={auction.status === "pending" ? auction.start_time : auction.end_time} />}
          </div>
        </div>
        <p className="text-gray-600 mb-6">{auction.description}</p>

        {auction.status === "closed" && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6 rounded text-yellow-900">
            <h3 className="font-bold text-lg mb-1">LELANG TELAH DITUTUP</h3>
            {bids.length > 0 ? (
              <p>
                Pemenang resmi: <span className="font-extrabold">{bids[0]?.user?.name || "Memuat..."}</span> dengan penawaran tertinggi <span className="font-extrabold">Rp {Number(bids[0]?.bid_amount).toLocaleString("id-ID")}</span>.
              </p>
            ) : (
              <p className="italic">Lelang ditutup tanpa ada satu pun penawaran yang masuk.</p>
            )}
          </div>
        )}

        <div className="flex justify-between items-center bg-gray-50 p-6 rounded border mb-6">
          <div>
            <span className="block text-sm text-gray-500 uppercase tracking-wider mb-1">Harga Tertinggi Saat Ini</span>
            <span className="text-4xl font-bold text-green-600">Rp {Number(auction.current_price).toLocaleString("id-ID")}</span>
          </div>
          <div className="text-right">
            <span className="block text-sm text-gray-500 uppercase tracking-wider mb-1">Status Sistem</span>
            <span className={`px-4 py-2 rounded text-white font-bold uppercase tracking-wide ${auction.status === "active" ? "bg-blue-600" : auction.status === "pending" ? "bg-yellow-500" : "bg-red-600"}`}>{auction.status}</span>
          </div>
        </div>

        <form onSubmit={handleBid} className="flex gap-4 items-stretch">
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            placeholder={`Minimal bid: Rp ${(Number(auction.current_price) + 1).toLocaleString("id-ID")}`}
            className="flex-1 border-2 border-gray-300 p-4 rounded text-lg focus:outline-none focus:border-blue-500 transition-colors"
            required
            disabled={auction.status !== "active"}
          />
          <button type="submit" disabled={auction.status !== "active"} className="bg-black text-white px-8 py-4 rounded text-lg font-bold hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
            TEMPATKAN BID
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-4 rounded border ${message.includes("berhasil") ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}>
            <p className="font-semibold">{message}</p>
          </div>
        )}
      </div>

      <div className="border rounded-lg shadow-sm p-6 bg-white">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">Riwayat Penawaran</h2>
        {bids.length === 0 ? (
          <p className="text-gray-500 text-sm italic font-mono">Data kosong. Belum ada penawaran yang masuk di database.</p>
        ) : (
          <ul className="space-y-3">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {bids.map((bid: any, index: number) => (
              <li key={bid.id || index} className="flex justify-between items-center bg-gray-50 p-4 rounded border">
                <div>
                  <span className="font-bold text-gray-800 block">{bid.user?.name || "Memuat Identitas..."}</span>
                  <span className="text-xs text-gray-500">{new Date(bid.created_at).toLocaleString("id-ID")}</span>
                </div>
                <span className="text-xl font-bold text-black">Rp {Number(bid.bid_amount).toLocaleString("id-ID")}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
