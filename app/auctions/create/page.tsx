"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/services/api/axios";
import { motion } from "framer-motion";

export default function CreateAuction() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    starting_price: "",
    start_time: "",
    end_time: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Mengonversi FileList menjadi Array standar
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Konstruksi FormData untuk multipart/form-data
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("starting_price", formData.starting_price);
      payload.append("start_time", formData.start_time);
      payload.append("end_time", formData.end_time);

      // Injeksi array gambar ke dalam payload
      images.forEach((image, index) => {
        payload.append(`images[${index}]`, image);
      });

      await api.post("/auctions", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      router.push("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Validation failed. Please verify your input parameters or file size (Max 5MB).");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-p3-dark font-sans relative overflow-hidden pt-16 pb-20 px-6">
      {/* Background Ornament */}
      <div className="fixed top-0 left-0 w-1/3 h-screen bg-p3-cyan/5 pointer-events-none z-0" style={{ clipPath: "polygon(0 0, 100% 0, 70% 100%, 0% 100%)" }} />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Return Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <Link
            href="/"
            className="inline-block px-8 py-2 bg-transparent border-2 border-p3-cyan text-p3-cyan font-bold italic tracking-widest uppercase transition-colors hover:bg-p3-cyan hover:text-p3-dark"
            style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" }}
          >
            &#171; BACK
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-black italic tracking-widest text-p3-white uppercase drop-shadow-md border-b-2 border-p3-cyan pb-4 inline-block pr-12" style={{ clipPath: "polygon(0 0, 100% 0, 95% 100%, 0% 100%)" }}>
            Initialize <span className="text-p3-cyan">Asset</span>
          </h1>
        </motion.div>

        {error && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-red-900/40 text-red-400 p-4 mb-6 border-l-4 border-red-500 font-bold tracking-widest uppercase italic text-sm">
            [SYSTEM ERROR] {error}
          </motion.div>
        )}

        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          onSubmit={handleSubmit}
          className="bg-p3-dark/80 p-8 border border-p3-blue shadow-blue-glow relative flex flex-col gap-6"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 95%, 96% 100%, 0 100%)" }}
        >
          {/* Left Line Accent */}
          <div className="absolute top-0 left-0 w-1 h-full bg-p3-cyan" />

          <div>
            <label className="block text-xs font-bold text-p3-cyan uppercase tracking-widest opacity-80 mb-2">Asset / Entity Name</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-4 bg-p3-blue/10 border-b-2 border-p3-blue text-p3-white font-bold text-lg focus:outline-none focus:border-p3-cyan focus:bg-p3-blue/20 transition-all placeholder-p3-blue/50"
              placeholder="Input asset identity..."
              required
              style={{ clipPath: "polygon(0 0, 100% 0, 98% 100%, 0% 100%)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-p3-cyan uppercase tracking-widest opacity-80 mb-2">Description Parameters</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-4 bg-p3-blue/10 border-b-2 border-p3-blue text-p3-white font-bold focus:outline-none focus:border-p3-cyan focus:bg-p3-blue/20 transition-all placeholder-p3-blue/50 custom-scrollbar"
              placeholder="Specify asset details..."
              required
              style={{ clipPath: "polygon(0 0, 100% 0, 99% 100%, 0% 100%)" }}
            />
          </div>

          {/* Sistem Upload Multi-Gambar */}
          <div>
            <label className="block text-xs font-bold text-p3-cyan uppercase tracking-widest opacity-80 mb-2">Visual Data (Upload Media)</label>
            <div className="w-full p-4 bg-p3-blue/10 border-b-2 border-p3-blue text-p3-white font-bold focus-within:border-p3-cyan focus-within:bg-p3-blue/20 transition-all" style={{ clipPath: "polygon(0 0, 100% 0, 98% 100%, 0% 100%)" }}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-p3-white file:mr-4 file:py-2 file:px-6 file:rounded-none file:border-0 file:text-sm file:font-black file:italic file:uppercase file:tracking-widest file:bg-p3-blue file:text-p3-white hover:file:bg-p3-cyan hover:file:text-p3-dark file:transition-colors cursor-pointer"
              />
              {images.length > 0 && <div className="mt-3 text-xs text-p3-cyan/80 font-mono">{images.length} file(s) attached for transmission.</div>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-p3-cyan uppercase tracking-widest opacity-80 mb-2">Starting Value (IDR)</label>
            <input
              type="number"
              name="starting_price"
              value={formData.starting_price}
              onChange={handleChange}
              min="1"
              className="w-full p-4 bg-p3-blue/10 border-b-2 border-p3-blue text-p3-white font-bold text-lg focus:outline-none focus:border-p3-cyan focus:bg-p3-blue/20 transition-all placeholder-p3-blue/50"
              placeholder="Example: 150000"
              required
              style={{ clipPath: "polygon(0 0, 100% 0, 98% 100%, 0% 100%)" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-p3-cyan uppercase tracking-widest opacity-80 mb-2">Commencement (Start)</label>
              <input
                type="datetime-local"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                className="w-full p-4 bg-p3-blue/10 border-b-2 border-p3-blue text-p3-white font-bold focus:outline-none focus:border-p3-cyan focus:bg-p3-blue/20 transition-all"
                required
                style={{ clipPath: "polygon(0 0, 100% 0, 96% 100%, 0% 100%)" }}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-p3-cyan uppercase tracking-widest opacity-80 mb-2">Termination (End)</label>
              <input
                type="datetime-local"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                className="w-full p-4 bg-p3-blue/10 border-b-2 border-p3-blue text-p3-white font-bold focus:outline-none focus:border-p3-cyan focus:bg-p3-blue/20 transition-all"
                required
                style={{ clipPath: "polygon(0 0, 100% 0, 96% 100%, 0% 100%)" }}
              />
            </div>
          </div>

          <div className="pt-6 mt-2 border-t border-p3-blue/50 flex flex-col md:flex-row justify-end gap-4">
            <motion.button
              type="button"
              onClick={() => router.push("/")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-transparent border-2 border-p3-cyan text-p3-cyan font-black italic uppercase tracking-widest transition-colors hover:bg-p3-cyan hover:text-p3-dark"
              style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" }}
            >
              Abort
            </motion.button>
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.05, filter: "drop-shadow(0 0 10px var(--color-p3-cyan))" }}
              whileTap={{ scale: isLoading ? 1 : 0.95 }}
              className="bg-p3-blue text-p3-white px-10 py-4 font-black italic uppercase tracking-widest disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
              style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" }}
            >
              {isLoading ? "TRANSMITTING..." : "EXECUTE AUCTION"}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
