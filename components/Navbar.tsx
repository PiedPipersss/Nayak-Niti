"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Users, 
  FileText, 
  Shield, 
  Bot, 
  Menu, 
  X,
  LogOut,
  User,
  Settings,
  ChevronDown
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't show navbar on auth pages
  if (pathname?.startsWith('/auth')) {
    return null;
  }

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/dashboard', label: 'Dashboard', icon: Users, requireAuth: true },
    { href: '/fact-checker', label: 'Fact Checker', icon: Shield }
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
        : 'bg-white border-b border-gray-100'
    }`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#FF9800] to-[#F57C00] flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl">
                <span className="text-white font-bold text-xl sm:text-2xl">N</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#4CAF50] rounded-full animate-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <span className="text-2xl font-bold bg-gradient-to-r from-[#FF9800] to-[#F57C00] bg-clip-text text-transparent">
                NayaNiti
              </span>
              <p className="text-xs text-gray-500 -mt-1">Know Your Neta</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              
              // Skip auth-required links if not authenticated
              if (link.requireAuth && status !== 'authenticated') {
                return null;
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-[#FF9800] to-[#F57C00] text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {status === 'loading' ? (
              <div className="w-8 h-8 border-2 border-[#FF9800] border-t-transparent rounded-full animate-spin"></div>
            ) : status === 'authenticated' ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-[#FF9800] transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00BCD4] to-[#0097A7] flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-sm text-gray-700">
                    {session?.user?.name || 'User'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{session?.user?.name}</p>
                      <p className="text-xs text-gray-500">{session?.user?.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button 
                    variant="outline" 
                    className="border-2 border-[#FF9800] text-[#FF9800] hover:bg-[#FF9800] hover:text-white font-semibold rounded-lg"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-gradient-to-r from-[#FF9800] to-[#F57C00] hover:from-[#F57C00] hover:to-[#E65100] text-white font-semibold rounded-lg shadow-md hover:shadow-lg">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4 space-y-2 bg-white">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);

              if (link.requireAuth && status !== 'authenticated') {
                return null;
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    active
                      ? 'bg-gradient-to-r from-[#FF9800] to-[#F57C00] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <div className="pt-4 border-t border-gray-100 space-y-2">
              {status === 'authenticated' ? (
                <>
                  <div className="px-4 py-2 bg-gray-50 rounded-lg">
                    <p className="text-sm font-semibold text-gray-900">{session?.user?.name}</p>
                    <p className="text-xs text-gray-500">{session?.user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button 
                      variant="outline" 
                      className="w-full border-2 border-[#FF9800] text-[#FF9800] hover:bg-[#FF9800] hover:text-white font-semibold"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-[#FF9800] to-[#F57C00] hover:from-[#F57C00] hover:to-[#E65100] text-white font-semibold">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;