"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      // Sesuaikan key 'access_token' dengan struktur response dari backend Laravel Anda
      const token = response.data.access_token;

      if (token) {
        localStorage.setItem("access_token", token);
        // Redirect sementara ke lelang ID 4 untuk pengujian
        router.push("/auctions/4");
      } else {
        setError("Sistem gagal memvalidasi token otorisasi.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Kredensial tidak valid atau server tidak merespons.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
      <div className="max-w-md w-full p-8 bg-white border rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Otorisasi Sistem</h2>

        {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm border border-red-200">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black" required />
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-black text-white font-bold py-3 px-4 rounded hover:bg-gray-800 disabled:bg-gray-400 transition-colors">
            {isLoading ? "MEMPROSES..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
}
