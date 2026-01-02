'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Finder', path: '/finder' },
    { name: 'Matrix', path: '/compare' },
    { name: 'Timeline', path: '/history' }, // New feature idea
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-6 pointer-events-none">
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`
          pointer-events-auto flex items-center px-2 py-2 rounded-full border transition-all duration-500
          ${isScrolled 
            ? 'bg-white/80 backdrop-blur-2xl border-gray-200 shadow-2xl w-[95%] max-w-2xl' 
            : 'bg-white/40 backdrop-blur-md border-white/20 w-[90%] max-w-lg shadow-sm'}
        `}
      >
        {/* LOGO LINK */}
        <Link href="/" className="px-6 py-2 flex items-center gap-2 group">
          <div className="w-6 h-6 bg-black rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
            <span className="text-[10px] text-white font-black">L</span>
          </div>
          <span className="text-sm font-black tracking-tighter uppercase italic">LogicSpecs</span>
        </Link>

        <div className="h-4 w-[1px] bg-gray-200 mx-2" />

        {/* DYNAMIC NAV LINKS */}
        <div className="flex items-center flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.path} href={item.path} className="relative px-6 py-2 text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
                {isActive && (
                  <motion.div 
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-blue-50 border border-blue-100 rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className={isActive ? 'text-blue-600' : ''}>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* SEARCH TRIGGER (CMD+K) */}
        <button className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-full border border-gray-100 hover:border-blue-400 transition-all group">
          <span className="text-[9px] font-bold text-gray-400 group-hover:text-blue-500">SEARCH</span>
          <kbd className="text-[9px] bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-300">⌘K</kbd>
        </button>
      </motion.nav>
    </header>
  );
}