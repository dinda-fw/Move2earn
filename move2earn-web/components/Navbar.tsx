'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Flame, 
  Coins, 
  LayoutDashboard, 
  History, 
  Wallet, 
  Gift, 
  TicketCheck, 
  ShieldAlert, 
  Dumbbell,
  Menu,
  X
} from 'lucide-react';
import { Move2EarnStore } from '@/lib/store';

export default function Navbar() {
  const pathname = usePathname();
  const [balance, setBalance] = useState<number>(75);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateBalance = () => {
      const summary = Move2EarnStore.getWalletSummary();
      setBalance(summary.balance);
    };
    updateBalance();
    window.addEventListener('storage', updateBalance);
    const interval = setInterval(updateBalance, 2000);
    return () => {
      window.removeEventListener('storage', updateBalance);
      clearInterval(interval);
    };
  }, []);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/workout', label: 'Workout', icon: Dumbbell },
    { href: '/history', label: 'History', icon: History },
    { href: '/wallet', label: 'Wallet', icon: Wallet },
    { href: '/rewards', label: 'Rewards', icon: Gift },
    { href: '/redemptions', label: 'My Vouchers', icon: TicketCheck },
    { href: '/admin', label: 'Admin', icon: ShieldAlert },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0b0f19]/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-green-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6 text-black fill-black" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                MOVE<span className="text-green-400">2EARN</span>
              </span>
              <span className="block text-[10px] text-gray-400 font-mono tracking-wider -mt-1">
                SCROLL LESS • MOVE MORE
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-green-500/20 text-green-300 border border-green-500/50 shadow-md shadow-green-500/10'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Move Coins Balance */}
          <div className="flex items-center gap-3">
            <Link
              href="/wallet"
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full hover:border-amber-400 transition-colors shadow-sm"
            >
              <Coins className="w-4 h-4 text-amber-400 animate-pulse" />
              <div className="text-right">
                <span className="text-xs text-amber-200/70 font-mono block -mb-1 leading-none">Coins</span>
                <span className="text-sm font-bold text-amber-300 font-mono">{balance}</span>
              </div>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-800 bg-[#0e1424] px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
