'use client';
import { motion } from 'framer-motion';

export default function ComparisonMatrix({ left, right, category }: { left: any, right: any, category: string }) {
  
  // Helper to highlight the "Winner" (Simple logic: bigger number usually better)
  const getWinnerClass = (val1: any, val2: any) => {
    if (!val1 || !val2) return "text-gray-900";
    if (typeof val1 === 'number' && typeof val2 === 'number') {
      if (val1 > val2) return "text-green-600 font-black";
      if (val1 < val2) return "text-gray-500";
    }
    return "text-gray-900";
  };

  // Define rows based on category
  const specs = [
    { label: "Release Date", key: "release_date" },
    { label: "Chipset", key: "chip_name" },
    { label: "RAM", key: "ram_gb", unit: "GB" },
    { label: "Storage", key: "base_storage_gb", unit: "GB" },
    { label: "Display", key: "display_size_inches", unit: '"' },
    { label: "Refresh Rate", key: "refresh_rate_hz", unit: "Hz" },
    { label: "Battery", key: "battery_mah", unit: " mAh" },
    { label: "Geekbench (Multi)", key: "geekbench_multi" },
  ];

  return (
    <div className="space-y-4">
      {specs.map((spec, index) => (
        <motion.div 
          key={spec.key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-transparent hover:border-blue-100"
        >
          {/* Label in the middle (Desktop) or Top (Mobile) */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
            {spec.label}
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-12 mt-4 text-center">
            {/* Left Value */}
            <div className={`text-lg md:text-2xl font-medium ${left ? getWinnerClass(left[spec.key], right?.[spec.key]) : 'text-gray-300'}`}>
              {left?.[spec.key] || "—"}{spec.unit}
            </div>

            {/* Right Value */}
            <div className={`text-lg md:text-2xl font-medium ${right ? getWinnerClass(right?.[spec.key], left?.[spec.key]) : 'text-gray-300'}`}>
              {right?.[spec.key] || "—"}{spec.unit}
            </div>
          </div>

          {/* Visual Bar Comparison (Only for numbers) */}
          {left && right && typeof left[spec.key] === 'number' && typeof right[spec.key] === 'number' && (
             <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden flex">
               <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${(left[spec.key] / (Math.max(left[spec.key], right[spec.key]) * 1.2)) * 50}%` }} />
               <div className="flex-1" />
               <div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: `${(right[spec.key] / (Math.max(left[spec.key], right[spec.key]) * 1.2)) * 50}%` }} />
             </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}