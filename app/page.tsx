"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/services/api/axios";

export default function Dashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [auctions, setAuctions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Validasi token dasar. Jika tidak ada, tendang ke halaman login.
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchAuctions();
  }, [router]);

  const fetchAuctions = async () => {
    try {
      const response = await api.get("/auctions");
      // Ekstraksi array data dari arsitektur pagination/resource Laravel
      setAuctions(response.data.data || response.data);
    } catch (error) {
      console.error("Gagal memuat daftar lelang:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  if (isLoading) return <div className="p-10 text-center font-mono font-bold">Memuat koneksi ke server...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10 font-sans">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold">Katalog Lelang Sistem</h1>
        <button onClick={handleLogout} className="text-white bg-red-600 px-4 py-2 font-bold rounded hover:bg-red-800 transition-colors">
          LOGOUT TUGAS
        </button>
      </div>

      {auctions.length === 0 ? (
        <div className="text-center text-gray-500 py-10 border rounded bg-gray-50 font-mono">Data lelang kosong di database.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <div key={auction.id} className="border rounded-lg shadow-sm p-6 flex flex-col bg-white">
              <h2 className="text-xl font-bold mb-2 truncate">{auction.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-2">{auction.description}</p>

              <div className="mt-auto">
                <div className="flex justify-between items-center mb-3 border-t pt-3">
                  <span className="text-sm font-bold text-gray-500">Harga Tertinggi:</span>
                  <span className="text-lg font-bold text-green-600">Rp {Number(auction.current_price).toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between items-center mb-5">
                  <span className="text-sm font-bold text-gray-500">Status Server:</span>
                  <span className={`px-3 py-1 rounded text-xs text-white font-bold uppercase tracking-wide ${auction.status === "active" ? "bg-blue-600" : auction.status === "pending" ? "bg-yellow-500" : "bg-red-600"}`}>
                    {auction.status}
                  </span>
                </div>
                <Link href={`/auctions/${auction.id}`} className="block w-full text-center bg-black text-white font-bold py-3 rounded hover:bg-gray-800 transition-colors">
                  MASUK ROOM
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
