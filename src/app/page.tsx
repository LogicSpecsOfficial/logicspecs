import Link from 'next/link'

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      {/* Hero: The Big Vision */}
      <section className="pt-32 pb-20 px-6 text-center">
        <h1 className="text-7xl font-semibold tracking-tighter mb-6">The Apple Authority.</h1>
        <p className="text-2xl text-gray-400 max-w-2xl mx-auto font-medium">
          Professional data, benchmarks, and intelligence for every product.
        </p>
      </section>

      {/* Grid Dashboard */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-40">
        
        {/* Finder Card */}
        <Link href="/finder" className="group bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm hover:shadow-2xl transition-all h-[400px] flex flex-col justify-between">
          <div>
            <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">Tool</span>
            <h2 className="text-4xl font-semibold mt-4 tracking-tight">Device Finder</h2>
            <p className="mt-4 text-gray-500 leading-relaxed">Search thousands of specs to find your perfect match.</p>
          </div>
          <span className="text-blue-500 font-bold group-hover:translate-x-2 transition-transform inline-block mt-4 italic">Open Finder →</span>
        </Link>

        {/* Benchmark Card (Liquid Glass Style) */}
        <Link href="/benchmarks" className="bg-black rounded-[2.5rem] p-10 shadow-2xl h-[400px] flex flex-col justify-between text-white">
          <div>
            <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Data</span>
            <h2 className="text-4xl font-semibold mt-4 tracking-tight">Apple Silicon Benchmarks</h2>
            <p className="mt-4 text-gray-400">M1 through M5. Every GPU and CPU score compared.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex justify-between border border-white/10">
            <span className="text-xs font-bold uppercase">Latest: M5 Ultra</span>
            <span className="text-blue-400 font-bold italic">Top Score</span>
          </div>
        </Link>

        {/* Rumors Card */}
        <Link href="/rumors" className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm hover:shadow-2xl transition-all h-[400px] flex flex-col justify-between overflow-hidden relative">
          <div>
            <span className="text-red-500 font-bold text-xs uppercase tracking-widest">Live Updates</span>
            <h2 className="text-4xl font-semibold mt-4 tracking-tight">Product Rumors</h2>
            <p className="mt-4 text-gray-500 leading-relaxed">Everything coming in the 2026/2027 cycle.</p>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-100/50 rounded-full blur-3xl"></div>
          <span className="text-red-500 font-bold italic">See the future →</span>
        </Link>

      </section>
    </div>
  )
}