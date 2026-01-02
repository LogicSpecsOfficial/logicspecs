'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchModal from './SearchModal'; // Import the new modal

interface DeviceSelectorProps {
  side: 'left' | 'right';
  device: any;
  category: string;
}

export default function DeviceSelector({ side, device, category }: DeviceSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelect = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(side, slug);
    router.push(`/compare?${params.toString()}`, { scroll: false });
    setIsModalOpen(false); // Close modal after selection
  };

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)} // Open modal on click
        className="relative group min-h-[180px] flex flex-col justify-center items-center text-center cursor-pointer transition-all duration-500"
      >
        
        {/* Card Background */}
        <div className="absolute inset-0 bg-white/60 backdrop-blur-2xl border border-white/40 shadow-xl rounded-[2.5rem] group-hover:bg-white/80 transition-all duration-300" />

        <div className="relative z-10 p-6 w-full flex flex-col items-center">
          {device ? (
            <>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3 bg-blue-50 px-3 py-1 rounded-full">
                {side === 'left' ? 'Device A' : 'Device B'}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1d1d1f] leading-tight mb-2">
                {device.model_name}
              </h2>
              <p className="text-sm font-medium text-gray-400">Released {device.release_date}</p>
              
              <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 group-hover:text-black transition-colors">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Change Device
              </div>
            </>
          ) : (
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
      </div>

      {/* The Search Modal Portal */}
      <SearchModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelect={handleSelect}
        category={category}
      />
    </>
  );
}