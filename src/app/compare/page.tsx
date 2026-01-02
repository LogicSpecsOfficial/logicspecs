import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import SmartComparisonGrid from '@/components/compare/SmartComparisonGrid';
import DeviceSelector from '@/components/compare/DeviceSelector';
import Link from 'next/link';

// Helper: Fetch multiple devices at once
async function getDevices(slugs: string[], table: string) {
  if (slugs.length === 0) return [];
  const { data } = await supabase.from(table).select('*').in('slug', slugs);
  
  // Sort data to match the order of slugs in the URL (Supabase returns arbitrary order)
  return slugs.map(slug => data?.find((d: any) => d.slug === slug)).filter(Boolean);
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ devices?: string; category?: string }>;
}) {
  const params = await searchParams;
  const category = params.category || 'iPhone';
  
  // 1. Parse URL: "iphone-13,iphone-14" -> ['iphone-13', 'iphone-14']
  const rawDevices = params.devices ? params.devices.split(',') : [];
  const deviceSlugs = rawDevices.slice(0, 5); // Hard limit 5

  // 2. Determine Table
  const table = category === 'Mac' ? 'Macs' : 
                category === 'iPad' ? 'iPads' : 
                category === 'Watch' ? 'Watches' : 
                'iPhones';

  // 3. Fetch Data
  const devices = await getDevices(deviceSlugs, table);

  // 4. Prepare "Slots" for the UI (We always render the devices + 1 empty "Add" slot if < 5)
  const slots = [...devices];
  if (slots.length < 5) {
    slots.push(null); // Null indicates an "Add Device" button
  }

  return (
    <main className="min-h-screen bg-[#F5F5F7] pt-24 pb-20 font-sans">
      
      {/* Header */}
      <div className="max-w-[1800px] mx-auto px-6 mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#1D1D1F]">
            Compare {category}.
          </h1>
          <p className="text-gray-500 mt-2">
            Comparing <span className="font-bold text-black">{devices.length}</span> models. Max 5.
          </p>
        </div>
        
        {/* Category Switcher (Resets comparison when switched) */}
        <div className="flex bg-white/50 backdrop-blur-md p-1 rounded-full border border-gray-200/50">
          {['iPhone', 'iPad', 'Mac', 'Watch'].map((cat) => (
            <Link
              key={cat}
              href={`/compare?category=${cat}`} // Reset devices on category switch
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                category === cat ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:text-black'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-6">
        
        {/* DYNAMIC DEVICE SELECTOR ROW */}
        {/* We use a flex row that scrolls horizontally on mobile */}
        <div className="flex gap-4 mb-8 sticky top-24 z-30 bg-[#F5F5F7]/95 backdrop-blur-sm py-4 border-b border-gray-200/50 overflow-x-auto pb-6 scrollbar-hide">
           {slots.map((device: any, index: number) => (
             <div key={device ? device.slug : `empty-${index}`} className="min-w-[200px] flex-1">
               <DeviceSelector 
                 index={index}
                 device={device} 
                 category={category} 
                 currentSlugs={deviceSlugs}
               />
             </div>
           ))}
        </div>

        {/* The Multi-Column Matrix */}
        <Suspense fallback={<div className="h-96 bg-gray-200 animate-pulse rounded-[2.5rem]" />}>
           <SmartComparisonGrid devices={devices} />
        </Suspense>
      </div>

    </main>
  );
}