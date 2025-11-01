"use client";

import Link from "next/link";
import { Shield, Home, Users, FileText } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/fact-checker", label: "Fact Checker", icon: Shield },
  ];

  return (
    <nav className="bg-white border-b border-[#ECEFF1] shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF9800] to-[#F57C00] flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <span className="text-2xl font-bold text-[#263238]">Nayak Niti</span>
          </Link>

          <div className="flex items-center gap-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-[#00BCD4] to-[#0097A7] text-white shadow-md"
                      : "text-[#424242] hover:bg-[#ECEFF1]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-semibold text-sm">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}