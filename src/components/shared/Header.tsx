/* v1.5.0 
   Changelog: @ Stylist Update: Boosted contrast for nav text and logo to fix "Grey on Dark" readability.
*/

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-[999] flex justify-center pt-6 pointer-events-none">
      <motion.nav 
        className={`
          pointer-events-auto flex items-center px-6 py-2 rounded-full border transition-all duration-500 glass-morphism
          ${isScrolled ? 'w-[95%] max-w-2xl shadow-xl' : 'w-[90%] max-w-lg shadow-sm'}
        `}
      >
        <Link href="/" className="px-4 py-2 flex items-center gap-2 group">
          {/* Logo contrast boost */}
          <div className="w-5 h-5 bg-black dark:bg-white rounded-md flex items-center justify-center transition-colors">
            <span className="text-[8px] text-white dark:text-black font-black italic">L</span>
          </div>
          <span className="text-xs font-black uppercase tracking-tighter text-nav">LogicSpecs</span>
        </Link>

        <div className="flex-1 flex justify-center gap-2">
          {[{ name: 'Finder', path: '/finder' }, { name: 'Matrix', path: '/compare' }].map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.path} href={item.path} className="relative px-5 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-nav hover:text-blue-500 transition-colors">
                {isActive && (
                  <motion.div layoutId="nav-glow" className="absolute inset-0 bg-black/5 dark:bg-white/10 rounded-full -z-10" />
                )}
                <span className={isActive ? 'text-blue-600 dark:text-blue-400' : ''}>{item.name}</span>
              </Link>
            );
          })}
        </div>

        <button className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-black/5 dark:bg-white/5 rounded-full border border-transparent hover:border-blue-500/50 transition-all">
          <span className="text-[8px] font-black text-nav opacity-60 uppercase tracking-widest">Search</span>
          <kbd className="text-[9px] font-sans text-nav opacity-40">⌘K</kbd>
        </button>
      </motion.nav>
    </header>
  );
}