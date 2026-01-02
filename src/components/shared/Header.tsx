/* Version: v1.1.0
  Changelog: Added real-time comparison counter with localStorage event synchronization.
*/

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [compareCount, setCompareCount] = useState(0);

  // Sync with localStorage across the app
  const updateCompareCount = () => {
    // We check common categories to sum up selections
    const categories = ['iPhone', 'iPad', 'Mac', 'Watch', 'Others'];
    let total = 0;
    categories.forEach(cat => {
      const saved = localStorage.getItem(`compare_mem_${cat}`) || '';
      if (saved) {
        total += saved.split(',').filter(s => s !== '').length;
      }
    });
    setCompareCount(total);
  };

  useEffect(() => {
    setMounted(true);
    
    // Initial check
    updateCompareCount();

    // Listen for scroll
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);

    // Listen for custom storage events from Finder/Cards
    window.addEventListener('storage', updateCompareCount);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', updateCompareCount);
    };
  }, []);

  if (!mounted) return null;

  const navItems = [
    { name: 'Finder', path: '/finder' },
    { name: 'Matrix', path: '/compare', showCount: true },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[999] flex justify-center pt-6 pointer-events-none">
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`
          pointer-events-auto flex items-center px-4 py-2 rounded-full border transition-all duration-700
          ${isScrolled 
            ? 'bg-white/90 backdrop-blur-2xl border-gray-200 shadow-xl w-[95%] max-w-2xl' 
            : 'bg-white/60 backdrop-blur-md border-white/40 w-[90%] max-w-lg shadow-sm'}
        `}
      >
        {/* LOGO */}
        <Link href="/" className="px-4 py-2 flex items-center gap-2 group">
          <div className="w-5 h-5 bg-black rounded-md flex items-center justify-center group-hover:bg-blue-600 transition-colors">
            <span className="text-[8px] text-white font-black">L</span>
          </div>
          <span className="text-xs font-black uppercase tracking-tighter">LogicSpecs</span>
        </Link>

        {/* NAVIGATION */}
        <div className="flex-1 flex justify-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.path} 
                href={item.path} 
                className="relative px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors flex items-center gap-2"
              >
                {isActive && (
                  <motion.div 
                    layoutId="header-active" 
                    className="absolute inset-0 bg-gray-100 rounded-full -z-10" 
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className={isActive ? 'text-black' : ''}>{item.name}</span>
                
                {/* COMPARE BADGE */}
                {item.showCount && compareCount > 0 && (
                  <AnimatePresence>
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[8px] font-black text-white"
                    >
                      {compareCount}
                    </motion.span>
                  </AnimatePresence>
                )}
              </Link>
            );
          })}
        </div>

        {/* SEARCH ACTION */}
        <button className="hidden md:flex items-center gap-3 px-4 py-1.5 bg-gray-50/50 rounded-full border border-gray-100 hover:border-blue-400 transition-all group">
          <span className="text-[8px] font-black text-gray-400 group-hover:text-blue-600 tracking-tighter">COMMAND</span>
          <kbd className="text-[9px] bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-300 font-sans">⌘K</kbd>
        </button>
      </motion.nav>
    </header>
  );
}