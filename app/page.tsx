"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/services/api/axios";
import { motion } from "framer-motion";

function DashboardContent() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [auctions, setAuctions] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchCategories();
  }, [router]);

  useEffect(() => {
    fetchAuctions(selectedCategory, searchQuery);
  }, [selectedCategory, searchQuery]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchAuctions = async (categorySlug: string, search: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (categorySlug) params.append("category", categorySlug);
      if (search) params.append("search", search);

      const endpoint = params.toString() ? `/auctions?${params.toString()}` : "/auctions";
      const response = await api.get(endpoint);
      setAuctions(response.data.data || response.data);
    } catch (error) {
      console.error("Transmission failed:", error);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && auctions.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-p3-dark">
        <motion.div animate={{ opacity: [0.3, 1, 0.3], scale: [0.98, 1.02, 0.98] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-p3-cyan text-2xl font-black italic tracking-widest uppercase">
          Extracting Entities...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-transparent font-sans relative overflow-hidden pb-12 pt-10">
      <div className="fixed top-0 right-0 w-2/3 h-screen bg-p3-blue/10 pointer-events-none z-0" style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Indikator Pencarian Aktif */}
        {searchQuery && (
          <div className="mb-4 bg-p3-cyan/20 border-l-4 border-p3-cyan p-3 text-p3-cyan font-bold italic tracking-widest uppercase text-sm">
            Searching for: "{searchQuery}"
            <Link href="/" className="ml-4 text-p3-white hover:text-red-400 underline decoration-p3-cyan">
              Clear Search
            </Link>
          </div>
        )}

        {/* Category Filter Navigation */}
        <div className="mb-8 flex flex-wrap gap-3 border-b border-p3-blue/50 pb-4">
          <button
            onClick={() => setSelectedCategory("")}
            className={`px-6 py-2 text-sm font-bold italic tracking-widest uppercase transition-colors ${selectedCategory === "" ? "bg-p3-cyan text-p3-dark shadow-cyan-glow" : "bg-p3-blue/20 text-p3-cyan hover:bg-p3-blue/40"}`}
            style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" }}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-6 py-2 text-sm font-bold italic tracking-widest uppercase transition-colors ${selectedCategory === cat.slug ? "bg-p3-cyan text-p3-dark shadow-cyan-glow" : "bg-p3-blue/20 text-p3-cyan hover:bg-p3-blue/40"}`}
              style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Auction List */}
        {isLoading ? (
          <div className="text-center py-20 text-p3-cyan font-black italic tracking-widest animate-pulse uppercase">Synchronizing Data...</div>
        ) : auctions.length === 0 ? (
          <div className="text-center py-20 border border-p3-blue bg-p3-dark/50 text-p3-cyan font-mono tracking-widest" style={{ clipPath: "polygon(2% 0, 100% 0, 98% 100%, 0% 100%)" }}>
            [ NO ACTIVE AUCTIONS DETECTED ]
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {auctions.map((auction, index) => (
              <motion.div
                key={auction.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5, filter: "drop-shadow(0 0 15px rgba(0, 229, 255, 0.4))" }}
                className="relative bg-p3-dark/80 border border-p3-blue flex flex-col group overflow-hidden"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 90% 100%, 0 100%)" }}
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-p3-cyan transition-transform origin-top scale-y-0 group-hover:scale-y-100 duration-300" />

                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-2xl font-black italic tracking-wide mb-2 truncate text-p3-white group-hover:text-p3-cyan transition-colors">{auction.title}</h2>

                  {auction.category && (
                    <span className="inline-block bg-p3-blue/20 text-xs font-bold text-p3-cyan px-2 py-1 mb-4 w-max uppercase tracking-wider border border-p3-blue/50" style={{ clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0% 100%)" }}>
                      {auction.category.name}
                    </span>
                  )}

                  <p className="text-gray-400 mb-6 line-clamp-2 text-sm">{auction.description}</p>

                  <div className="mt-auto">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-p3-cyan uppercase tracking-widest opacity-80">Current Price</span>
                      <span className="text-xl font-bold text-p3-white drop-shadow-md">Rp {Number(auction.current_price).toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xs font-bold text-p3-cyan uppercase tracking-widest opacity-80">Status</span>
                      <span
                        className={`px-4 py-1 text-xs font-black italic uppercase tracking-wider text-p3-dark ${auction.status === "active" ? "bg-p3-cyan shadow-cyan-glow" : auction.status === "pending" ? "bg-yellow-400" : "bg-red-500 text-white"}`}
                        style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" }}
                      >
                        {auction.status}
                      </span>
                    </div>

                    <Link
                      href={`/auctions/${auction.id}`}
                      className="block w-full text-center bg-p3-white text-p3-dark font-black italic tracking-widest py-3 uppercase transition-all group-hover:bg-p3-cyan"
                      style={{ clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0% 100%)" }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Mengunci komponen yang menggunakan useSearchParams ke dalam Suspense boundary
// untuk menghindari peringatan statis di Next.js saat build time.
export default function Dashboard() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center bg-p3-dark">
          <div className="text-p3-cyan text-2xl font-black italic tracking-widest uppercase animate-pulse">Extracting Entities...</div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
