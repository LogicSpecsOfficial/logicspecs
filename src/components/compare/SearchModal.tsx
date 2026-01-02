'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Command } from 'cmdk';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (slug: string) => void;
  category: string;
}

// Ensure "export default" is present here
export default function SearchModal({ isOpen, onClose, onSelect, category }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query || query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      const table = category === 'Mac' ? 'Macs' : 
                    category === 'iPad' ? 'iPads' : 
                    category === 'Watch' ? 'Watches' : 'iPhones';

      try {
        const { data } = await supabase
          .from(table)
          .select('model_name, slug, release_date')
          .ilike('model_name', `%${query}%`)
          .order('release_date', { ascending: false })
          .limit(10);

        setResults(data || []);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchResults, 300);
    return () => clearTimeout(timeoutId);
  }, [query, category]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] px-4 font-sans">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-md"
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-xl bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl overflow-hidden"
        >
          <Command shouldFilter={false} className="w-full">
            <div className="flex items-center border-b border-gray-200/50 px-5 py-4">
              <span className="text-xl mr-4">🔍</span>
              <Command.Input 
                autoFocus
                placeholder={`Search ${category}...`}
                value={query}
                onValueChange={setQuery}
                className="w-full bg-transparent outline-none text-xl font-medium placeholder-gray-400 text-gray-900"
              />
            </div>

            <Command.List className="max-h-[60vh] overflow-y-auto p-2">
              {loading && <div className="p-8 text-center text-gray-400 animate-pulse">Searching...</div>}
              
              {results.map((item) => (
                <Command.Item
                  key={item.slug}
                  value={item.slug}
                  onSelect={() => onSelect(item.slug)}
                  className="flex items-center justify-between px-5 py-4 rounded-2xl cursor-pointer hover:bg-blue-50/50 aria-selected:bg-blue-600 aria-selected:text-white group mb-2 transition-all shadow-sm"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-lg group-aria-selected:text-white text-gray-900">{item.model_name}</span>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-gray-100 group-aria-selected:bg-blue-500/30 text-gray-400 group-aria-selected:text-blue-100">Released</span>
                        <span className="text-xs font-medium text-gray-500 group-aria-selected:text-blue-100">{item.release_date}</span>
                    </div>
                  </div>
                  <span className="text-xl group-aria-selected:translate-x-1 transition-transform">→</span>
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}