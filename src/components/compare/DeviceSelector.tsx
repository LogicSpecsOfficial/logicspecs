'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface DeviceSelectorProps {
  side: 'left' | 'right';
  device: any;      // The current device data (or null)
  category: string; // 'iPhone', 'Mac', etc.
}

export default function DeviceSelector({ side, device, category }: DeviceSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // 1. Get the new slug (e.g., "iphone-15-pro")
    const newSlug = e.target.value; 
    
    // 2. Clone current params so we don't lose the other device
    const params = new URLSearchParams(searchParams.toString());
    
    // 3. Update the specific side ('left' or 'right')
    params.set(side, newSlug);
    
    // 4. Update the URL (scroll: false keeps the user's place on the page)
    router.push(`/compare?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="relative group min-h-[180px] flex flex-col justify-center items-center text-center cursor-pointer transition-all duration-500">
      
      {/* The "Liquid Glass" Card Container */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-2xl border border-white/40 shadow-xl rounded-[2.5rem] group-hover:bg-white/80 transition-all duration-300" />

      {/* Content Layer (z-10 to sit above the glass background) */}
      <div className="relative z-10 p-6 w-full flex flex-col items-center">
        
        {device ? (
          <>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3 bg-blue-50 px-3 py-1 rounded-full">
              {side === 'left' ? 'Device A' : 'Device B'}
            </span>
            
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1d1d1f] leading-tight mb-2">
              {device.model_name}
            </h2>
            
            <p className="text-sm font-medium text-gray-400">
              Released {device.release_date}
            </p>
            
            <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 group-hover:text-black transition-colors">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Change Device
            </div>
          </>
        ) : (
          /* Empty State */
          <>
             <div className="w-16 h-16 bg-white rounded-full shadow-sm mb-4 flex items-center justify-center text-3xl text-gray-300 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-300">
               +
             </div>
             <span className="font-bold text-gray-400 group-hover:text-gray-900 transition-colors">
               Add {category}
             </span>
          </>
        )}
      </div>

      {/* Hidden Native Select for interaction (Prototype Mode) */}
      {/* In a production app, this would trigger a nice Modal instead */}
      <select 
        onChange={handleSearch} 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        value="" // Always reset to empty so you can re-select the same item if needed
      >
        <option value="" disabled>Select a device...</option>
        
        {/* Dynamic Options based on Category */}
        {category === 'iPhone' && (
          <>
            <option value="iphone-16-pro-max">iPhone 16 Pro Max</option>
            <option value="iphone-16-pro">iPhone 16 Pro</option>
            <option value="iphone-15-pro-max">iPhone 15 Pro Max</option>
            <option value="iphone-15-pro">iPhone 15 Pro</option>
            <option value="iphone-14-pro-max">iPhone 14 Pro Max</option>
            <option value="iphone-13">iPhone 13</option>
          </>
        )}
        
        {category === 'Mac' && (
          <>
            <option value="macbook-pro-14-m3-max">MacBook Pro 14 (M3 Max)</option>
            <option value="macbook-air-13-m3">MacBook Air 13 (M3)</option>
            <option value="mac-studio-m2-ultra">Mac Studio (M2 Ultra)</option>
          </>
        )}

        {/* Fallback for other categories */}
        <option value="ipad-pro-13-m4">iPad Pro 13 (M4)</option>
        <option value="apple-watch-ultra-2">Apple Watch Ultra 2</option>
      </select>
    </div>
  );
}