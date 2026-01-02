'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchModal from './SearchModal';
import { motion } from 'framer-motion';

interface DeviceSelectorProps {
  index: number;
  device: any | null; // Null represents an empty "Add" slot
  category: string;
  currentSlugs: string[];
}

export default function DeviceSelector({ index, device, category, currentSlugs }: DeviceSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // Logic to update the URL with the new set of device slugs
  const updateUrl = (slugs: string[]) => {
    const params = new URLSearchParams();
    params.set('category', category); // Keep the current category
    if (slugs.length > 0) {
      params.set('devices', slugs.join(','));
    }
    // Update the URL without a full page reload
    router.push(`/compare?${params.toString()}`, { scroll: false });
  };

  const handleSelect = (newSlug: string) => {
    const newSlugs = [...currentSlugs];
    if (device) {
      // If a device already exists in this slot, replace it (Swap)
      newSlugs[index] = newSlug;
    } else {
      // If this is an empty slot, append the new device
      newSlugs.push(newSlug);
    }
    updateUrl(newSlugs);
    setIsModalOpen(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click event from firing
    const newSlugs = currentSlugs.filter((_, i) => i !== index);
    updateUrl(newSlugs);
  };

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="relative h-[120px] w-full rounded-[2.2rem] overflow-hidden group cursor-pointer transition-all duration-300"
      >
        {/* Dynamic Background Layer */}
        <div className={`absolute inset-0 transition-all duration-500 ${
          device 
          ? 'bg-gray-50 group-hover:bg-white border border-gray-200 group-hover:border-blue-200 group-hover:shadow-lg' 
          : 'bg-white border-2 border-dashed border-gray-100 hover:border-blue-400 hover:bg-blue-50/30 shadow-sm'
        }`} />

        <div className="relative z-10 p-5 h-full flex flex-col justify-center items-center text-center">
          {device ? (
            <>
               {/* Remove Button */}
               <button 
                 onClick={handleRemove}
                 className="absolute top-3 right-3 w-6 h-6 bg-white shadow-md rounded-full text-gray-400 text-[10px] flex items-center justify-center hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 border border-gray-100"
               >
                 ✕
               </button>
               
               <div className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1 opacity-80">
                 Model {index + 1}
               </div>
               <h2 className="text-sm md:text-base font-bold text-gray-900 leading-tight line-clamp-2 px-2 tracking-tight">
                 {device.model_name}
               </h2>
               
               {/* Hover Indicator */}
               <motion.div 
                 initial={{ opacity: 0, y: 5 }}
                 whileHover={{ opacity: 1, y: 0 }}
                 className="mt-2 text-[8px] font-black text-blue-500 uppercase tracking-widest"
               >
                 Click to Swap
               </motion.div>
            </>
          ) : (
            /* Empty Slot UI */
            <div className="flex flex-col items-center">
               <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all mb-1 border border-gray-100">
                 <span className="text-xl font-light">+</span>
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 group-hover:text-blue-400 transition-colors">
                 Add {category}
               </span>
            </div>
          )}
        </div>
      </div>

      {/* The Search Portal */}
      <SearchModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelect={handleSelect}
        category={category}
      />
    </>
  );
}