'use client';
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase'; // Using @ alias to avoid path errors
import Link from 'next/link';
import FloatingCompareBar from '@/components/finder/FloatingCompareBar';

const isModern = (dateStr: string) => {
  if (!dateStr) return false;
  const year = parseInt(dateStr.split(' ')[1] || dateStr.split('-')[0]);
  return year >= 2021;
};

export default function FinderPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('iPhone');
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  
  const mainCategories = ['iPhone', 'iPad', 'Mac', 'Watch', 'Others'];

  const [filters, setFilters] = useState({
    era: 'All',
    size: 'All',
    port: 'All',
    features: { ai: false, fiveG: false, aod: false, wifi6: false },
    subType: 'All'
  });

  // Load comparison selection from memory
  useEffect(() => {
    const saved = localStorage.getItem(`compare_mem_${category}`) || '';
    setSelectedSlugs(saved ? saved.split(',') : []);
  }, [category]);

  const toggleCompare = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    e.stopPropagation();
    let slugs = [...selectedSlugs];
    if (slugs.includes(slug)) {
      slugs = slugs.filter(s => s !== slug);
    } else {
      if (slugs.length >= 5) return alert("Max 5 devices");
      slugs.push(slug);
    }
    setSelectedSlugs(slugs);
    localStorage.setItem(`compare_mem_${category}`, slugs.join(','));
    window.dispatchEvent(new Event('storage'));
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      let data: any[] = [];
      if (category === 'Others') {
        const [spatial, audio, home, acc] = await Promise.all([
          supabase.from('spatial_computers').select('*').order('release_date', { ascending: false }),
          supabase.from('audio_devices').select('*').order('release_date', { ascending: false }),
          supabase.from('home_entertainment').select('*').order('release_date', { ascending: false }),
          supabase.from('Accessories').select('*').order('release_date', { ascending: false })
        ]);
        data = [...(spatial.data||[]), ...(audio.data||[]), ...(home.data||[]), ...(acc.data||[])];
      } else {
        const tableName = category === 'iPhone' ? 'iPhones' : category === 'iPad' ? 'iPads' : category === 'Mac' ? 'Macs' : 'Watches';
        const res = await supabase.from(tableName).select('*').order('release_date', { ascending: false });
        data = res.data || [];
      }
      setItems(data);
      setLoading(false);
    }
    fetchData();
  }, [category]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (filters.era === 'Modern' && !isModern(item.release_date)) return false;
      if (filters.era === 'Vintage' && isModern(item.release_date)) return false;
      if (filters.features.ai) {
        const hasAI = item.apple_intelligence === 'Yes' || item.chip_name?.includes('M') || item.chip_name?.includes('A18');
        if (!hasAI) return false;
      }
      return true;
    });
  }, [items, filters]);

  return (
    <main className="min-h-screen pt-32 pb-40 px-6 max-w-[1600px] mx-auto">
      <header className="mb-12 flex flex-col items-center gap-6">
        <h1 className="text-4xl font-black tracking-tighter uppercase italic">Device Finder</h1>
        <div className="inline-flex bg-gray-100 p-1.5 rounded-full">
          {mainCategories.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)} className={`px-6 py-2 text-xs font-bold rounded-full transition-all ${category === cat ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-black'}`}>
              {cat}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div key={item.slug} className="group relative bg-white rounded-[2.5rem] p-8 border border-gray-100 hover:shadow-2xl transition-all h-[400px] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{item.chip_name || 'Apple Silicon'}</span>
                <button 
                  onClick={(e) => toggleCompare(e, item.slug)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${selectedSlugs.includes(item.slug) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-black'}`}
                >
                  {selectedSlugs.includes(item.slug) ? '✓' : '+'}
                </button>
              </div>
              <h2 className="text-2xl font-bold mt-2 tracking-tight">{item.model_name}</h2>
              <p className="text-gray-400 text-xs mt-1 font-medium italic">{item.release_date}</p>
            </div>

            <div className="space-y-4">
              <Link href={`/device/${item.slug}`} className="block w-full py-4 bg-gray-50 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                View Specs
              </Link>
            </div>
          </div>
        ))}
      </div>

      <FloatingCompareBar category={category} />
    </main>
  );
}