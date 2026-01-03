/* v1.5.3 
   Changelog: @ Stylist Update: Converted card to glass-morphism and semantic text variables.
*/

import Link from 'next/link';

export default function DeviceCard({ device }: { device: any }) {
  return (
    <Link href={`/device/${device.slug}`}>
      <div className="group relative h-full glass-morphism rounded-[2.5rem] p-6 hover:shadow-2xl hover:border-blue-500/50 transition-all duration-500 overflow-hidden flex flex-col">
        
        {/* Hardware Image Container */}
        <div className="aspect-square rounded-3xl bg-black/[0.03] dark:bg-white/[0.03] mb-6 overflow-hidden flex items-center justify-center p-8">
          <img 
            src={device.image_url} 
            alt={device.model_name}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out" 
          />
        </div>

        {/* Technical Labeling */}
        <div className="space-y-3 flex-grow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
              {device.chip_name}
            </span>
            <span className="text-[10px] font-bold text-[var(--text-secondary)] opacity-60">
              {new Date(device.release_date).getFullYear()}
            </span>
          </div>
          
          <h3 className="text-xl font-black tracking-tighter text-[var(--text-primary)] leading-none">
            {device.model_name}
          </h3>
          
          <p className="text-[11px] font-medium text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
            {device.cpu_cores} Core CPU • {device.ram_gb}GB Base Memory
          </p>
        </div>

        {/* Contextual Action Button */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
            View Matrix →
          </span>
          <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
            <span className="text-xs">→</span>
          </div>
        </div>

        {/* Subtle Glow Effect for Dark Mode */}
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-all pointer-events-none" />
      </div>
    </Link>
  );
}