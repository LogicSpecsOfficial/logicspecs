'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function FloatingCompareBar({ category }: { category: string }) {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);

  const updateFromStorage = () => {
    const saved = localStorage.getItem(`compare_mem_${category}`) || '';
    setSelectedSlugs(saved ? saved.split(',') : []);
  };

  useEffect(() => {
    updateFromStorage();
    window.addEventListener('storage', updateFromStorage);
    return () => window.removeEventListener('storage', updateFromStorage);
  }, [category]);

  return (
    <AnimatePresence>
      {selectedSlugs.length > 0 && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-2xl"
        >
          <div className="bg-black/90 backdrop-blur-2xl rounded-[2.5rem] p-4 flex items-center justify-between shadow-2xl border border-white/10">
            <div className="flex items-center gap-4 ml-4">
              <div className="flex -space-x-3">
                {selectedSlugs.map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-blue-600 border-2 border-black flex items-center justify-center text-[10px] font-bold text-white">
                    {i + 1}
                  </div>
                ))}
              </div>
              <div className="text-white text-xs font-bold uppercase tracking-widest">
                {selectedSlugs.length} Selected
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => {
                  localStorage.setItem(`compare_mem_${category}`, '');
                  window.dispatchEvent(new Event('storage'));
                }}
                className="px-6 py-3 rounded-full text-[10px] font-black uppercase text-gray-400 hover:text-white transition-colors"
              >
                Clear
              </button>
              <Link 
                href={`/compare?category=${category}&devices=${selectedSlugs.join(',')}`}
                className="px-8 py-3 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all"
              >
                Launch Matrix
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}