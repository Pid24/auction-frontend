import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-transparent font-sans pt-10 pb-20 px-6 relative overflow-hidden">
      <div className="fixed top-0 right-0 w-1/2 h-screen bg-p3-blue/5 pointer-events-none z-0" style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }} />

      <div className="max-w-4xl mx-auto relative z-10 bg-p3-dark/80 border border-p3-blue/50 p-8 md:p-12 shadow-lg backdrop-blur-sm">
        <div className="mb-10">
          <Link href="/" className="text-sm font-bold text-p3-cyan hover:text-p3-white uppercase tracking-widest transition-colors">
            &laquo; Return to Dashboard
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl font-black italic text-p3-white uppercase tracking-widest border-b border-p3-cyan pb-4 mb-8 shadow-cyan-glow w-max">System Information</h1>

        <div className="space-y-8 text-sm md:text-base text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-p3-cyan uppercase tracking-wider mb-3">1. Platform Overview</h2>
            <p>
              Auction.OS adalah infrastruktur pelelangan terdesentralisasi (C2C) yang memfasilitasi pertukaran aset secara *real-time*. Sistem ini ditenagai oleh arsitektur WebSocket berlatensi rendah untuk menjamin presisi tawaran
              (*bidding*) hingga hitungan milidetik.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-p3-cyan uppercase tracking-wider mb-3">2. Escrow & Virtual Wallet Protocol</h2>
            <p className="mb-3">Untuk mencegah manipulasi pasar dan penipuan (Fraud), Auction.OS menerapkan protokol penahanan dana absolut (*Escrow*):</p>
            <ul className="list-disc list-inside space-y-2 ml-2 text-gray-400">
              <li>Setiap pengguna diwajibkan melakukan deposit ke dalam dompet virtual (Wallet) sebelum dapat mengeksekusi tawaran.</li>
              <li>Saat pengguna menjadi penawar tertinggi, sistem secara otomatis akan membekukan dana sebesar nilai tawaran tersebut (Frozen Balance).</li>
              <li>Jika pengguna tersalip (*Outbid*) oleh entitas lain, dana yang dibekukan akan dikembalikan (*Refund*) ke saldo utama secara instan.</li>
              <li>Saat lelang ditutup (*Closed*), dana dari pemenang akan dipotong secara permanen dan ditransfer ke dompet kreator lelang.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-p3-cyan uppercase tracking-wider mb-3">3. Anti-Sniping System</h2>
            <p>
              Platform ini dilengkapi dengan algoritma perpanjangan waktu dinamis. Jika ada tawaran valid yang masuk dalam kurun waktu 3 menit sebelum batas waktu lelang (*End Time*) berakhir, sistem akan memperpanjang durasi lelang secara
              otomatis selama 3 menit tambahan untuk memberikan ekuitas bagi semua partisipan.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-p3-cyan uppercase tracking-wider mb-3">4. Disclaimer of Liability</h2>
            <p>
              Administrator Auction.OS hanya bertanggung jawab atas stabilitas mesin transaksi dan keamanan pangkalan data. Segala bentuk perselisihan terkait keaslian aset fisik, keterlambatan pengiriman, atau perbedaan deskripsi barang
              sepenuhnya adalah tanggung jawab antara entitas pemenang dan kreator lelang terkait.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
