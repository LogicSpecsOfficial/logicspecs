// v1.2.0
// Changelog: Removed lucide-react dependency in favor of performance-optimized Inline SVGs.

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function CommandK() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const searchDevices = async () => {
      setLoading(true);
      const tables = ['iPhones', 'Macs', 'iPads', 'Watches'];
      const promises = tables.map(table => 
        supabase
          .from(table)
          .select('model_name, slug, release_date')
          .ilike('model_name', `%${query}%`)
          .limit(3)
      );

      const responses = await Promise.all(promises);
      const combined = responses.flatMap((res, index) => 
        (res.data || []).map(item => ({ ...item, category: tables[index] }))
      );

      setResults(combined);
      setLoading(false);
    };

    const timer = setTimeout(searchDevices, 150);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (slug: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/device/${slug}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-[#F5F5F7]/80 dark:bg-black/80 backdrop-blur-xl"
          />
          
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-[#121214] rounded-[2.5rem] shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden"
          >
            <div className="flex items-center px-6 py-5 border-b border-gray-100 dark:border-white/5">
              <svg className="w-5 h-5 text-gray-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input 
                autoFocus
                placeholder="Search specs..."
                className="w-full bg-transparent border-none outline-none text-lg font-medium text-gray-900 dark:text-white"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="max-h-[400px] overflow-y-auto p-4">
              {results.map((item) => (
                <button
                  key={item.slug}
                  onClick={() => handleSelect(item.slug)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-blue-50 dark:hover:bg-white/5 group transition-all"
                >
                  <div className="text-left">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">{item.model_name}</div>
                    <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{item.category}</div>
                  </div>
                  <svg className="w-4 h-4 text-gray-200 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}