import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="relative w-[400px] h-[760px] bg-white shadow-2xl overflow-hidden">
            <AuthGuard>
              {children}
            </AuthGuard>
            <Navbar />
          </div>
        </div>
      </body>
    </html>
  );
}