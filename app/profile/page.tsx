"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/services/api/axios";

export default function Profile() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/profile");
      setProfileData(response.data);
    } catch (error) {
      console.error("Gagal memuat profil:", error);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center font-mono font-bold">Memuat data profil...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10 font-sans">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold">Profil Pengguna</h1>
          <p className="text-gray-600 mt-1">
            {profileData.user.name} ({profileData.user.email})
          </p>
        </div>
        <Link href="/" className="bg-black text-white px-6 py-2 font-bold rounded hover:bg-gray-800 transition-colors">
          KEMBALI KE DASBOR
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Panel Barang yang Dilelang */}
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Barang yang Saya Lelang</h2>
          {profileData.my_auctions.length === 0 ? (
            <p className="text-sm text-gray-500 italic">Belum ada lelang yang Anda buat.</p>
          ) : (
            <ul className="space-y-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {profileData.my_auctions.map((auction: any) => (
                <li key={auction.id} className="border p-4 rounded bg-gray-50 flex justify-between items-center">
                  <div>
                    <Link href={`/auctions/${auction.id}`} className="font-bold text-blue-600 hover:underline">
                      {auction.title}
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">
                      Status: <span className="font-bold uppercase">{auction.status}</span>
                    </p>
                  </div>
                  <span className="font-bold text-green-600">Rp {Number(auction.current_price).toLocaleString("id-ID")}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Panel Riwayat Bidding */}
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Riwayat Penawaran Saya</h2>
          {profileData.my_bids.length === 0 ? (
            <p className="text-sm text-gray-500 italic">Belum ada riwayat penawaran.</p>
          ) : (
            <ul className="space-y-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {profileData.my_bids.map((bid: any) => (
                <li key={bid.id} className="border p-4 rounded bg-gray-50 flex justify-between items-center">
                  <div>
                    <Link href={`/auctions/${bid.auction?.id}`} className="font-bold text-blue-600 hover:underline">
                      {bid.auction?.title || "Data tidak ditemukan"}
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">{new Date(bid.created_at).toLocaleString("id-ID")}</p>
                  </div>
                  <span className="font-bold text-black">Rp {Number(bid.bid_amount).toLocaleString("id-ID")}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
