'use client';
import { useRouter, useSearchParams } from 'next/navigation';

export default function DeviceSelector({ side, device, category }: { side: 'left' | 'right', device: any, category: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (e: any) => {
    // In a real app, this would be a Combobox/Search Modal
    // For now, we simulate changing the device via prompt or hardcoded list
    const newSlug = e.target.value; 
    
    // Construct new URL
    const params = new URLSearchParams(searchParams);
    params.set(side, newSlug);
    
    // Smooth update without full reload
    router.push(`/compare?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="liquid-glass rounded-[2rem] p-6 text-center relative group min-h-[160px] flex flex-col justify-center items-center cursor-pointer hover:bg-white/80 transition-all">
      
      {device ? (
        <>
          <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">{side === 'left' ? 'Device A' : 'Device B'}</div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tighter leading-none mb-2">{device.model_name}</h2>
          <p className="text-gray-400 font-medium text-sm">{device.release_date}</p>
          
          <button className="mt-4 text-[10px] bg-gray-100 hover:bg-black hover:text-white px-4 py-2 rounded-full font-bold uppercase transition-colors">
            Change
          </button>
        </>
      ) : (
        <div className="text-gray-400">
           <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">+</div>
           <span className="font-bold text-sm">Add {category}</span>
        </div>
      )}

      {/* Hidden Select for prototype functionality */}
      <select 
        onChange={handleSearch} 
        className="absolute inset-0 opacity-0 cursor-pointer"
      >
        <option value="">Select...</option>
        {/* You would populate this list dynamically */}
        <option value="iphone-13">iPhone 13</option>
        <option value="iphone-14-pro">iPhone 14 Pro</option>
        <option value="iphone-15-pro-max">iPhone 15 Pro Max</option>
      </select>
    </div>
  );
}