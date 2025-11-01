"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Users, 
  Shield, 
  Bot, 
  Menu, 
  X
} from 'lucide-react';

const NavbarSimple = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

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
    { href: '/dashboard', label: 'Dashboard', icon: Users },
    { href: '/fact-checker', label: 'Fact Checker', icon: Shield },
    { href: '/chat', label: 'AI Assistant', icon: Bot },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  // Different styles for homepage vs other pages
  const navbarClasses = isHomePage
    ? `fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
          : 'bg-transparent'
      }`
    : `fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
          : 'bg-white border-b border-gray-100'
      }`;

  const textColor = isHomePage && !isScrolled ? 'text-white' : 'text-gray-700';
  const buttonTextColor = isHomePage && !isScrolled ? 'text-white' : 'text-[#FF9800]';
  const buttonBorderColor = isHomePage && !isScrolled ? 'border-white' : 'border-[#FF9800]';
  const buttonHoverBg = isHomePage && !isScrolled ? 'hover:bg-white hover:text-[#FF9800]' : 'hover:bg-[#FF9800] hover:text-white';

  return (
    <nav className={navbarClasses}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl ${
                isHomePage && !isScrolled 
                  ? 'bg-white/20 backdrop-blur-sm' 
                  : 'bg-gradient-to-br from-[#FF9800] to-[#F57C00]'
              }`}>
                <span className={`font-bold text-xl sm:text-2xl ${
                  isHomePage && !isScrolled ? 'text-white' : 'text-white'
                }`}>N</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#4CAF50] rounded-full animate-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <span className={`text-2xl font-bold ${
                isHomePage && !isScrolled 
                  ? 'text-white' 
                  : 'bg-gradient-to-r from-[#FF9800] to-[#F57C00] bg-clip-text text-transparent'
              }`}>
                NayaNiti
              </span>
              <p className={`text-xs -mt-1 ${
                isHomePage && !isScrolled ? 'text-white/80' : 'text-gray-500'
              }`}>Know Your Neta</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-[#FF9800] to-[#F57C00] text-white shadow-md'
                      : isHomePage && !isScrolled
                        ? 'text-white hover:bg-white/10'
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
            <Link href="/auth/signin">
              <Button 
                variant="outline" 
                className={`border-2 ${buttonBorderColor} ${buttonTextColor} ${buttonHoverBg} font-semibold rounded-lg`}
              >
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-gradient-to-r from-[#FF9800] to-[#F57C00] hover:from-[#F57C00] hover:to-[#E65100] text-white font-semibold rounded-lg shadow-md hover:shadow-lg">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isHomePage && !isScrolled 
                ? 'hover:bg-white/10' 
                : 'hover:bg-gray-100'
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className={`w-6 h-6 ${textColor}`} />
            ) : (
              <Menu className={`w-6 h-6 ${textColor}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4 space-y-2 bg-white">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);

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
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarSimple;