// v1.3.0
// Changelog: Updated naming from 'Compare' to 'Matrix' and optimized for global theme persistence.

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';

export default function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return null;

  const navItems = [
    { name: 'Finder', path: '/finder' },
    { name: 'Matrix', path: '/compare' }, // Logical name is Matrix, path remains /compare for SEO
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[999] flex justify-center pt-6 pointer-events-none">
      <motion.nav 
        className={`
          pointer-events-auto flex items-center px-4 py-2 rounded-full border transition-all duration-500
          ${isScrolled 
            ? 'bg-white/90 dark:bg-[#0A0A0B]/90 backdrop-blur-2xl border-gray-200 dark:border-white/10 shadow-xl w-[95%] max-w-2xl' 
            : 'bg-white/60 dark:bg-white/5 backdrop-blur-md border-white/40 dark:border-white/10 w-[90%] max-w-lg shadow-sm'}
        `}
      >
        <Link href="/" className="px-4 py-2 flex items-center gap-2 group">
          <div className="w-5 h-5 bg-black dark:bg-white rounded-md flex items-center justify-center">
            <span className="text-[8px] text-white dark:text-black font-black italic">L</span>
          </div>
          <span className="text-xs font-black uppercase tracking-tighter dark:text-white">LogicSpecs</span>
        </Link>

        <div className="flex-1 flex justify-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.path} href={item.path} className="relative px-5 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 dark:text-gray-400">
                {isActive && (
                  <motion.div layoutId="nav-glow" className="absolute inset-0 bg-gray-100 dark:bg-white/10 rounded-full -z-10" />
                )}
                <span className={isActive ? 'text-black dark:text-white' : ''}>{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-800 dark:text-gray-200"
            aria-label="Toggle Appearance"
          >
            {isDark ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m.386-6.364l1.591 1.591M12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"/></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/></svg>
            )}
          </button>
        </div>
      </motion.nav>
    </header>
  );
}