{/* ... inside results.map((item) => ... */}
<Command.Item
  key={item.slug}
  value={item.slug}
  onSelect={() => onSelect(item.slug)}
  className="flex items-center justify-between px-5 py-4 rounded-2xl cursor-pointer hover:bg-blue-50/50 transition-all duration-200 aria-selected:bg-blue-600 aria-selected:text-white group mb-2 border border-transparent aria-selected:border-blue-400 shadow-sm hover:shadow-md"
>
  <div className="flex flex-col">
    {/* Model Name - Larger and bolder */}
    <span className="font-bold text-lg tracking-tight group-aria-selected:text-white text-gray-900 transition-colors">
      {item.model_name}
    </span>
    
    {/* Enhanced Meta Data Row */}
    <div className="flex items-center gap-2 mt-1">
      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-gray-100 group-aria-selected:bg-blue-500/30 text-gray-400 group-aria-selected:text-blue-100 transition-colors">
        Released
      </span>
      <span className="text-xs font-medium text-gray-500 group-aria-selected:text-blue-100 transition-colors">
        {item.release_date || 'TBA'}
      </span>
    </div>
  </div>

  <div className="flex items-center gap-3">
    <span className="opacity-0 group-aria-selected:opacity-100 text-xs font-bold uppercase tracking-widest transition-opacity">
      Compare Now
    </span>
    <span className="text-xl group-aria-selected:translate-x-1 transition-transform inline-block">
      →
    </span>
  </div>
</Command.Item>