import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import SmartComparisonGrid from '@/components/compare/SmartComparisonGrid';
import DeviceSelector from '@/components/compare/DeviceSelector';
import Link from 'next/link';

async function getDevices(slugs: string[], table: string) {
  if (slugs.length === 0) return [];
  const { data } = await supabase.from(table).select('*').in('slug', slugs);
  return slugs.map(slug => data?.find((d: any) => d.slug === slug)).filter(Boolean);
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ devices?: string; category?: string }>;
}) {
  const params = await searchParams;
  const category = params.category || 'iPhone';
  const rawDevices = params.devices ? params.devices.split(',') : [];
  const deviceSlugs = rawDevices.slice(0, 5);

  const table = category === 'Mac' ? 'Macs' : 
                category === 'iPad' ? 'iPads' : 
                category === 'Watch' ? 'Watches' : 
                'iPhones';

  const devices = await getDevices(deviceSlugs, table);
  const slots = [...devices];
  if (slots.length < 5) slots.push(null);

  return (
    <main className="min-h-screen bg-[#F5F5F7] pt-24 pb-40 font-sans selection:bg-blue-100">
      
      {/* 1. PAGE HEADER */}
      <div className="max-w-[1800px] mx-auto px-6 mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="space-y-2">
          <Link href="/" className="text-blue-600 text-xs font-bold uppercase tracking-widest hover:underline transition-all">
            ← LogicSpecs Database
          </Link>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-[#1D1D1F]">
            {category}<span className="text-blue-600">.</span>
          </h1>
          <p className="text-gray-400 font-medium text-lg">
            Technical Matrix — Comparing {devices.length} models.
          </p>
        </div>
        
        {/* Category Pill Switcher */}
        <div className="flex bg-white/60 backdrop-blur-xl p-1.5 rounded-full border border-white shadow-sm">
          {['iPhone', 'iPad', 'Mac', 'Watch'].map((cat) => (
            <Link
              key={cat}
              href={`/compare?category=${cat}`}
              className={`px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                category === cat ? 'bg-black text-white shadow-xl scale-105' : 'text-gray-400 hover:text-black'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-6">
        
        {/* 2. STICKY HEADER BOX (Device Selectors) */}
        <div className="sticky top-6 z-50 mb-12">
          <div className="bg-white/70 backdrop-blur-2xl rounded-[3rem] p-4 border border-white/50 shadow-2xl shadow-gray-200/50">
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
               {slots.map((device: any, index: number) => (
                 <div key={device ? device.slug : `empty-${index}`} className="min-w-[220px] flex-1">
                   <DeviceSelector 
                     index={index}
                     device={device} 
                     category={category} 
                     currentSlugs={deviceSlugs}
                   />
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* 3. THE SMART MATRIX */}
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            <div className="h-96 bg-gray-200 rounded-[2.5rem]" />
            <div className="h-96 bg-gray-200 rounded-[2.5rem]" />
          </div>
        }>
           <SmartComparisonGrid devices={devices} />
        </Suspense>
      </div>
    </main>
  );
}