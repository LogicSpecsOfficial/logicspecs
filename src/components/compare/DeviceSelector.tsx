'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CategorySwitcher({ currentCategory }: { currentCategory: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Save current devices to memory whenever they change
  useEffect(() => {
    const devices = searchParams.get('devices');
    if (devices) {
      localStorage.setItem(`compare_mem_${currentCategory}`, devices);
    }
  }, [searchParams, currentCategory]);

  const handleCategorySwitch = (newCat: string) => {
    // 2. Retrieve memory for the new category
    const savedDevices = localStorage.getItem(`compare_mem_${newCat}`);
    
    if (savedDevices) {
      router.push(`/compare?category=${newCat}&devices=${savedDevices}`);
    } else {
      router.push(`/compare?category=${newCat}`);
    }
  };

  return (
    <div className="flex bg-white/60 backdrop-blur-xl p-1.5 rounded-full border border-white shadow-sm">
      {['iPhone', 'iPad', 'Mac', 'Watch'].map((cat) => (
        <button
          key={cat}
          onClick={() => handleCategorySwitch(cat)}
          className={`px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
            currentCategory === cat ? 'bg-black text-white shadow-xl scale-105' : 'text-gray-400 hover:text-black'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}