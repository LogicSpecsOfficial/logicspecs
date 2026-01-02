'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchModal from './SearchModal';

interface DeviceSelectorProps {
  index: number;
  device: any | null; // Null means "Add Slot"
  category: string;
  currentSlugs: string[];
}

export default function DeviceSelector({ index, device, category, currentSlugs }: DeviceSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // Handle Adding/Swapping a Device
  const handleSelect = (newSlug: string) => {
    const newSlugs = [...currentSlugs];
    
    if (device) {
      // Swap existing at index
      newSlugs[index] = newSlug;
    } else {
      // Add new to end
      newSlugs.push(newSlug);
    }

    updateUrl(newSlugs);
    setIsModalOpen(false);
  };

  // Handle Removing a Device
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop card click
    const newSlugs = currentSlugs.filter((_, i) => i !== index);
    updateUrl(newSlugs);
  };

  const updateUrl = (slugs: string[]) => {
    const params = new URLSearchParams();
    params.set('category', category); // Persist category
    if (slugs.length > 0) {
      params.set('devices', slugs.join(','));
    }
    router.push(`/compare?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="relative group h-[160px] flex flex-col justify-center items-center text-center cursor-pointer transition-all duration-500"
      >
        <div className="absolute inset-0 bg-white/60 backdrop-blur-2xl border border-white/40 shadow-sm rounded-[2rem] group-hover:bg-white/80 group-hover:shadow-lg transition-all duration-300" />

        <div className="relative z-10 p-4 w-full flex flex-col items-center justify-between h-full py-6">
          {device ? (
            <>
               {/* Remove Button (Only show if > 1 device to avoid empty state issues) */}
               <button 
                 onClick={handleRemove}
                 className="absolute top-2 right-2 w-6 h-6 bg-gray-200 rounded-full text-gray-500 text-xs flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
               >
                 ✕
               </button>

               <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                 Slot {index + 1}
               </div>
               <h2 className="text-lg md:text-xl font-bold tracking-tight text-[#1d1d1f] leading-tight">
                 {device.model_name}
               </h2>
               <div className="mt-auto text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                 Change
               </div>
            </>
          ) : (
            <>
               <div className="w-12 h-12 bg-white rounded-full shadow-sm mb-2 flex items-center justify-center text-2xl text-gray-300 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-300 border border-dashed border-gray-300">
                 +
               </div>
               <span className="font-bold text-gray-400 text-sm group-hover:text-gray-900 transition-colors">
                 Add Device
               </span>
            </>
          )}
        </div>
      </div>

      <SearchModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelect={handleSelect}
        category={category}
      />
    </>
  );
}