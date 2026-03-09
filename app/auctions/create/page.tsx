"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api/axios";

export default function CreateAuction() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    starting_price: "",
    start_time: "",
    end_time: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await api.post("/auctions", {
        ...formData,
        starting_price: Number(formData.starting_price),
      });
      // Redirect kembali ke dashboard setelah berhasil
      router.push("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Validasi gagal. Periksa kembali input Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 font-sans">
      <h1 className="text-3xl font-bold mb-8 border-b pb-4">Buat Lelang Baru</h1>

      {error && <div className="bg-red-50 text-red-700 p-4 rounded mb-6 border border-red-200 font-semibold">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 border rounded-lg shadow-sm">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Nama Barang</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black" required />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black" required />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Harga Buka (Rp)</label>
          <input type="number" name="starting_price" value={formData.starting_price} onChange={handleChange} min="1" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Waktu Mulai</label>
            <input type="datetime-local" name="start_time" value={formData.start_time} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Waktu Selesai</label>
            <input type="datetime-local" name="end_time" value={formData.end_time} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black" required />
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end gap-4">
          <button type="button" onClick={() => router.push("/")} className="px-6 py-3 font-bold text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
            BATAL
          </button>
          <button type="submit" disabled={isLoading} className="bg-black text-white px-8 py-3 rounded font-bold hover:bg-gray-800 disabled:bg-gray-400 transition-colors">
            {isLoading ? "MENYIMPAN..." : "SIMPAN LELANG"}
          </button>
        </div>
      </form>
    </div>
  );
}
