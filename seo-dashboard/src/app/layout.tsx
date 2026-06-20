import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Analytics Central Dashboard",
  description: "Multi-chain hotel analytics dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex bg-gray-50">
        <Sidebar />
        <div className="flex-1 min-w-0 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
