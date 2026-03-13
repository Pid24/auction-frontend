import type { Metadata } from "next";
import { Chakra_Petch, Inter } from "next/font/google";
import "./globals.css";
import { EchoProvider } from "@/components/providers/EchoProvider";
import { GlobalNotification } from "@/components/GlobalNotification";

const chakra = Chakra_Petch({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-chakra",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Auction Hub | System",
  description: "Operative Real-Time Auction System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${chakra.variable} ${inter.variable} antialiased`}>
        <EchoProvider>
          <GlobalNotification />
          {children}
        </EchoProvider>
      </body>
    </html>
  );
}
