/* Version: v1.0.0
   Changelog: Initial release of the CMD+K Command Palette with live Supabase search and keyboard navigation.
*/

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Search, Monitor, Smartphone, Tablet, Watch, ArrowRight } from 'lucide-react';

export default function CommandK() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle Keyboard Toggle
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

  // Neural Search Logic (Debounced)
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const searchDevices = async () => {
      setLoading(true);
      
      // Multi-table search strategy for 2026 AEO
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

  const getIcon = (cat: string) => {
    if (cat.includes('iPhone')) return <Smartphone size={14} />;
    if (cat.includes('Mac')) return <Monitor size={14} />;
    if (cat.includes('iPad')) return <Tablet size={14} />;
    return <Watch size={14} />;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-[#F5F5F7]/80 backdrop-blur-xl"
          />
          
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl border border-gray-200 overflow-hidden"
          >
            <div className="flex items-center px-6 py-5 border-b border-gray-100">
              <Search className="text-gray-400 mr-4" size={20} />
              <input 
                autoFocus
                placeholder="Search models, chips, or years..."
                className="w-full bg-transparent border-none outline-none text-lg font-medium text-gray-900 placeholder:text-gray-300"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-[10px] text-gray-400 font-sans">ESC</kbd>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-4">
              {loading && <div className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">Analyzing Database...</div>}
              
              {!loading && results.length > 0 && (
                <div className="space-y-1">
                  {results.map((item) => (
                    <button
                      key={item.slug}
                      onClick={() => handleSelect(item.slug)}
                      className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-blue-50 group transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                          {getIcon(item.category)}
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-bold text-gray-900">{item.model_name}</div>
                          <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{item.category.slice(0, -1)} • {new Date(item.release_date).getFullYear()}</div>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-gray-200 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              )}

              {query.length >= 2 && !loading && results.length === 0 && (
                <div className="p-10 text-center text-gray-400 font-medium">No precise match found for "{query}"</div>
              )}

              {query.length < 2 && (
                <div className="p-6">
                  <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4">Quick Shortcuts</div>
                  <div className="grid grid-cols-2 gap-2">
                    {['iPhone 16 Pro', 'MacBook Pro M4', 'iPad Air', 'Ultra 2'].map(term => (
                      <button 
                        key={term}
                        onClick={() => setQuery(term)}
                        className="text-left px-4 py-3 rounded-xl bg-gray-50 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 px-6 py-3 flex justify-between items-center border-t border-gray-100">
              <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">LogicSpecs Neural Search v1.0</span>
              <div className="flex gap-4">
                <span className="flex items-center gap-1 text-[9px] font-bold text-gray-400"><ArrowRight size={10}/> Select</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}