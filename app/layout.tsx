import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ChatBot from "@/components/ChatBot";
import NavbarSimple from "@/components/NavbarSimple";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NayaNiti - Know Your Neta",
  description: "Empowering citizens with transparent political information",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavbarSimple />
        {children}
        <ChatBot />
      </body>
    </html>
  );
}
