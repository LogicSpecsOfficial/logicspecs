'use client';

import { useState, useEffect } from 'react';
import { Command } from 'cmdk'; // The magic library
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (slug: string) => void;
  category: string; // 'iPhone', 'Mac', etc.
}

export default function SearchModal({ isOpen, onClose, onSelect, category }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // DEBOUNCED SEARCH EFFECT
  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      // Determine table based on category
      const table = category === 'Mac' ? 'Macs' : 
                    category === 'iPad' ? 'iPads' : 
                    category === 'Watch' ? 'Watches' : 'iPhones';

      const { data } = await supabase
        .from(table)
        .select('model_name, slug, release_date')
        .ilike('model_name', `%${query}%`) // Case-insensitive search
        .limit(5);

      setResults(data || []);
      setLoading(false);
    };

    // Wait 300ms after typing stops before searching (saves DB calls)
    const timeoutId = setTimeout(fetchResults, 300);
    return () => clearTimeout(timeoutId);
  }, [query, category]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
        
        {/* Backdrop (Click to close) */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        />

        {/* The Search Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl overflow-hidden"
        >
          <Command className="w-full">
            <div className="flex items-center border-b border-gray-200/50 px-4">
              <span className="text-gray-400 mr-3">🔍</span>
              <Command.Input 
                autoFocus
                placeholder={`Search ${category}...`}
                value={query}
                onValueChange={setQuery}
                className="w-full py-4 bg-transparent outline-none text-lg font-medium placeholder-gray-400 text-gray-900"
              />
            </div>

            <Command.List className="max-h-[300px] overflow-y-auto p-2">
              {loading && <div className="p-4 text-center text-sm text-gray-400">Searching database...</div>}
              
              {!loading && results.length === 0 && query.length > 1 && (
                <div className="p-4 text-center text-sm text-gray-400">No devices found.</div>
              )}

              {results.map((item) => (
                <Command.Item
                  key={item.slug}
                  onSelect={() => onSelect(item.slug)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors aria-selected:bg-blue-50 group"
                >
                  <span className="font-semibold text-gray-800">{item.model_name}</span>
                  <span className="text-xs text-gray-400 font-mono group-hover:text-blue-500 transition-colors">{item.release_date}</span>
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}