'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // Import Portal
import { Command } from 'cmdk';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (slug: string) => void;
  category: string;
}

export default function SearchModal({ isOpen, onClose, onSelect, category }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 1. Handle Portal Mounting (Prevents hydration mismatch)
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. Debounced Search Logic
  useEffect(() => {
    const fetchResults = async () => {
      if (!query || query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      
      const table = category === 'Mac' ? 'Macs' : 
                    category === 'iPad' ? 'iPads' : 
                    category === 'Watch' ? 'Watches' : 
                    'iPhones';

      try {
        const { data, error } = await supabase
          .from(table)
          .select('model_name, slug, release_date')
          .ilike('model_name', `%${query}%`)
          .order('release_date', { ascending: false })
          .limit(10);

        if (error) console.error('Supabase error:', error);
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

  // 3. Render via Portal (Fixes "Weird Appearance")
  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] px-4 font-sans">
        
        {/* Dark Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-md transition-all"
        />

        {/* The Search Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          className="relative w-full max-w-xl bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl overflow-hidden"
        >
          {/* IMPORTANT: shouldFilter={false} fixes the "First Search Fails" bug */}
          <Command shouldFilter={false} className="w-full">
            
            {/* Input Header */}
            <div className="flex items-center border-b border-gray-200/50 px-5 py-4">
              <span className="text-xl mr-4">🔍</span>
              <Command.Input 
                autoFocus
                placeholder={`Search ${category} (e.g. "Pro Max")...`}
                value={query}
                onValueChange={setQuery}
                className="w-full bg-transparent outline-none text-xl font-medium placeholder-gray-400 text-gray-900"
              />
              <button 
                onClick={onClose}
                className="ml-2 text-xs font-bold uppercase text-gray-400 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-md transition-colors"
              >
                ESC
              </button>
            </div>

            {/* Results List */}
            <Command.List className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200">
              
              {loading && (
                <div className="p-8 text-center text-gray-400 animate-pulse">
                  Searching database...
                </div>
              )}
              
              {!loading && results.length === 0 && query.length > 1 && (
                <div className="p-8 text-center text-gray-400">
                  No devices found matching "{query}".
                </div>
              )}

              {/* Start Typing Prompt */}
              {!loading && query.length < 2 && (
                <div className="p-8 text-center text-gray-300 text-sm">
                  Type at least 2 characters to search...
                </div>
              )}

              {results.map((item) => (
                <Command.Item
                  key={item.slug}
                  value={item.slug} // Pass value for selection
                  onSelect={() => onSelect(item.slug)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer hover:bg-blue-50 hover:scale-[0.99] transition-all duration-200 aria-selected:bg-blue-50 group mb-1"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800 text-lg">{item.model_name}</span>
                    <span className="text-xs text-gray-400 font-mono mt-0.5">{item.release_date || 'Unknown Date'}</span>
                  </div>
                  <span className="opacity-0 group-hover:opacity-100 text-blue-600 text-sm font-bold transition-opacity">
                    Select →
                  </span>
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body // This renders the modal at the very top of your HTML
  );
}