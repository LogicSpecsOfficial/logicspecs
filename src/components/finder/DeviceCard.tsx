'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DeviceCard({ device, category }: { device: any, category: string }) {
  const [isSelected, setIsSelected] = useState(false);

  // Sync with localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`compare_mem_${category}`) || '';
    setIsSelected(saved.split(',').includes(device.slug));
  }, [device.slug, category]);

  const toggleCompare = () => {
    const saved = localStorage.getItem(`compare_mem_${category}`) || '';
    let slugs = saved ? saved.split(',') : [];

    if (slugs.includes(device.slug)) {
      slugs = slugs.filter(s => s !== device.slug);
      setIsSelected(false);
    } else {
      if (slugs.length >= 5) {
        alert("Max 5 devices allowed");
        return;
      }
      slugs.push(device.slug);
      setIsSelected(true);
    }
    localStorage.setItem(`compare_mem_${category}`, slugs.join(','));
    // Trigger a storage event so the floating bar updates
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <motion.div 
      layout
      className="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-gray-900">{device.model_name}</h3>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">
            {device.chip_name}
          </p>
        </div>
        <button 
          onClick={toggleCompare}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isSelected ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
          }`}
        >
          {isSelected ? '✓' : '+'}
        </button>
      </div>

      <div className="space-y-3 mb-8">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400 font-medium">Multi-Core</span>
          <span className="font-bold text-gray-900">{device.geekbench_multi || '—'}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400 font-medium">Display</span>
          <span className="font-bold text-gray-900">{device.display_size_inches}" {device.display_tech}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link 
          href={`/device/${device.slug}`}
          className="py-3 rounded-2xl bg-gray-50 text-[10px] font-black uppercase text-center hover:bg-black hover:text-white transition-all"
        >
          Details
        </Link>
        <button 
          onClick={toggleCompare}
          className={`py-3 rounded-2xl text-[10px] font-black uppercase border transition-all ${
            isSelected ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-100 text-gray-400 hover:border-black hover:text-black'
          }`}
        >
          {isSelected ? 'Selected' : 'Compare'}
        </button>
      </div>
    </motion.div>
  );
}