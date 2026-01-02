{/* SUMMARY HIGHLIGHTS - Testing Turbopack with more logic */}
{!focusedCategory && (
  <motion.div 
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="md:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-2xl overflow-hidden relative"
  >
    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div className="max-w-md">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">LogicSpecs Insight</span>
        <h3 className="text-2xl font-bold mt-2 leading-tight">
          Comparison Overview
        </h3>
        <p className="text-blue-100 text-sm mt-2 font-medium">
          Based on raw technical specs, the <span className="underline decoration-2 underline-offset-4 decoration-blue-300">
            {devices.reduce((prev, current) => (prev.geekbench_multi > current.geekbench_multi) ? prev : current).model_name}
          </span> leads in raw processing power.
        </p>
      </div>
      
      <div className="flex gap-4">
        {devices.map((d, i) => (
          <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/10">
            <div className="text-[9px] font-bold opacity-50 uppercase tracking-tighter">Score</div>
            <div className="text-lg font-black tracking-tighter">{d.geekbench_multi || 'N/A'}</div>
          </div>
        ))}
      </div>
    </div>
    
    {/* Abstract Background Detail */}
    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
  </motion.div>
)}