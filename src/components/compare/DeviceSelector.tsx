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

  const updateUrl = (slugs: string[]) => {
    const params = new URLSearchParams();
    params.set('category', category);
    if (slugs.length > 0) {
      params.set('devices', slugs.join(','));
    }
    router.push(`/compare?${params.toString()}`, { scroll: false });
  };

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

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="relative h-[120px] w-full rounded-[2.2rem] overflow-hidden group cursor-pointer transition-all duration-300"
      >
        <div className={`absolute inset-0 transition-all duration-500 ${
          device 
          ? 'bg-gray-50 group-hover:bg-white border border-gray-200 group-hover:border-blue-200 shadow-sm' 
          : 'bg-white border-2 border-dashed border-gray-100 hover:border-blue-400 hover:bg-blue-50/30'
        }`} />

        <div className="relative z-10 p-5 h-full flex flex-col justify-center items-center text-center">
          {device ? (
            <div className="w-full relative">
               <button 
                 onClick={handleRemove}
                 className="absolute -top-1 -right-1 w-6 h-6 bg-white shadow-md rounded-full text-gray-400 text-[10px] flex items-center justify-center hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100 border border-gray-100"
               >
                 ✕
               </button>
               
               <div className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">
                 Model {index + 1}
               </div>
               <h2 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2 px-2">
                 {device.model_name}
               </h2>
            </div>
          ) : (
            <div className="flex flex-col items-center">
               <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:text-blue-500 mb-1 border border-gray-100">
                 <span className="text-xl">+</span>
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Add</span>
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