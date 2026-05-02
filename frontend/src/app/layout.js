import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SONDT Furniture - Nội thất hiện đại cao cấp",
  description: "Khám phá bộ sưu tập nội thất đẳng cấp, hiện đại từ SONDT. Giao hàng toàn quốc, bảo hành lâu dài.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white">
        <Header />
        <main className="flex-grow pt-[160px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
