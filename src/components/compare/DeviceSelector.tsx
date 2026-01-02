'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchModal from './SearchModal';
import { motion } from 'framer-motion';

interface DeviceSelectorProps {
  index: number;
  device: any | null;
  category: string;
  currentSlugs: string[];
}

export default function DeviceSelector({ index, device, category, currentSlugs }: DeviceSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleSelect = (newSlug: string) => {
    const newSlugs = [...currentSlugs];
    if (device) {
      newSlugs[index] = newSlug;
    } else {
      newSlugs.push(newSlug);
    }
    updateUrl(newSlugs);
    setIsModalOpen(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newSlugs = currentSlugs.filter((_, i) => i !== index);
    updateUrl(newSlugs);
  };

  const updateUrl = (slugs: string[]) => {
    const params = new URLSearchParams();
    params.set('category', category);
    if (slugs.length > 0) {
      params.set('devices', slugs.join(','));
    }
    router.push(`/compare?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="relative h-[120px] w-full rounded-[2rem] overflow-hidden group cursor-pointer transition-all duration-300"
      >
        {/* Background Layer */}
        <div className={`absolute inset-0 transition-all duration-500 ${
          device 
          ? 'bg-gray-50 group-hover:bg-gray-100 border border-gray-200' 
          : 'bg-white border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50/30'
        }`} />

        <div className="relative z-10 p-5 h-full flex flex-col justify-center items-center text-center">
          {device ? (
            <>
               <button 
                 onClick={handleRemove}
                 className="absolute top-3 right-3 w-5 h-5 bg-white shadow-sm rounded-full text-gray-400 text-[10px] flex items-center justify-center hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100"
               >
                 ✕
               </button>
               
               <div className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">
                 Model {index + 1}
               </div>
               <h2 className="text-sm md:text-base font-bold text-gray-900 leading-tight line-clamp-2 px-2">
                 {device.model_name}
               </h2>
               <div className="mt-2 text-[9px] font-bold text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
                 Swap
               </div>
            </>
          ) : (
            <div className="flex flex-col items-center">
               <div className="text-2xl text-gray-300 group-hover:text-blue-500 transition-colors mb-1">+</div>
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Add</span>
            </div>
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