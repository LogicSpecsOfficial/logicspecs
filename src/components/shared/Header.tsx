// v1.2.2
// Changelog: Hard-coded performance SVGs for Dark Mode toggle and fixed visibility/interaction logic.

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';

export default function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [compareCount, setCompareCount] = useState(0);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const updateCount = () => {
      const categories = ['iPhone', 'iPad', 'Mac', 'Watch', 'Others'];
      let total = 0;
      categories.forEach(cat => {
        const saved = localStorage.getItem(`compare_mem_${cat}`) || '';
        if (saved) total += saved.split(',').filter(s => s !== '').length;
      });
      setCompareCount(total);
    };

    updateCount();
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('storage', updateCount);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', updateCount);
    };
  }, []);

  if (!mounted) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-[999] flex justify-center pt-6 pointer-events-none">
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`
          pointer-events-auto flex items-center px-4 py-2 rounded-full border transition-all duration-700
          ${isScrolled 
            ? 'bg-white/90 dark:bg-black/80 backdrop-blur-2xl border-gray-200 dark:border-white/10 shadow-xl w-[95%] max-w-2xl' 
            : 'bg-white/60 dark:bg-white/5 backdrop-blur-md border-white/40 dark:border-white/10 w-[90%] max-w-lg shadow-sm'}
        `}
      >
        {/* LOGO */}
        <Link href="/" className="px-4 py-2 flex items-center gap-2 group">
          <div className="w-5 h-5 bg-black dark:bg-white rounded-md flex items-center justify-center">
            <span className="text-[8px] text-white dark:text-black font-black">L</span>
          </div>
          <span className="text-xs font-black uppercase tracking-tighter dark:text-white">LogicSpecs</span>
        </Link>

        {/* NAVIGATION */}
        <div className="flex-1 flex justify-center gap-1">
          {[
            { name: 'Finder', path: '/finder' },
            { name: 'Matrix', path: '/compare', count: true }
          ].map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.path} href={item.path} className="relative px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 flex items-center gap-2 group">
                {isActive && (
                  <motion.div layoutId="header-pill" className="absolute inset-0 bg-gray-100 dark:bg-white/10 rounded-full -z-10" />
                )}
                <span className={isActive ? 'text-black dark:text-white' : 'group-hover:text-black dark:group-hover:text-white transition-colors'}>
                  {item.name}
                </span>
                {item.count && compareCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[8px] font-black text-white">
                    {compareCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-2">
          {/* THEME TOGGLE BUTTON */}
          <button 
            onClick={toggleTheme}
            aria-label="Toggle Dark Mode"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white active:scale-90"
          >
            {isDark ? (
              /* Sun Icon */
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m.386-6.364l1.591 1.591M12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />
              </svg>
            ) : (
              /* Moon Icon */
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
          </button>

          {/* COMMAND TRIGGER */}
          <button className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50/50 dark:bg-white/5 rounded-full border border-gray-100 dark:border-white/10 hover:border-blue-500 transition-all group">
            <span className="text-[8px] font-black text-gray-400 group-hover:text-blue-600 tracking-tighter transition-colors">⌘K</span>
          </button>
        </div>
      </motion.nav>
    </header>
  );
}