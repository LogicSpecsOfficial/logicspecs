import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="pt-40 pb-40 px-6">
      
      {/* Hero: Authority Section */}
      <section className="max-w-6xl mx-auto mb-32 text-center">
        <h1 className="hero-heading mb-8">
          The Data. <br /> 
          <span className="text-apple-gray-400 italic">Redefined.</span>
        </h1>
        <p className="text-xl md:text-2xl font-medium text-apple-gray-400 max-w-2xl mx-auto leading-relaxed">
          LogicSpecs is a professional technical laboratory for Apple Intelligence, Silicon architecture, and device longevity.
        </p>
      </section>

      {/* Grid: Feature Ecosystem */}
      <section className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Finder: Liquid Style */}
        <Link href="/finder" className="liquid-glass rounded-apple p-12 h-[450px] flex flex-col justify-between group overflow-hidden relative">
          <div className="relative z-10">
            <span className="text-apple-blue font-bold text-xs uppercase tracking-[0.2em]">01 / Exploration</span>
            <h2 className="text-5xl font-bold tracking-tighter mt-6 leading-none">Device <br/> Finder</h2>
          </div>
          <div className="relative z-10 flex items-center gap-2 font-bold text-sm group-hover:gap-4 transition-all">
            Launch Database <span className="text-apple-blue text-lg">→</span>
          </div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-apple-blue/5 rounded-full blur-3xl group-hover:bg-apple-blue/10 transition-all duration-1000"></div>
        </Link>

        {/* Silicon: Dark Mode Contrast */}
        <Link href="/benchmarks" className="bg-apple-gray-900 rounded-apple p-12 h-[450px] flex flex-col justify-between group relative overflow-hidden text-white shadow-2xl">
          <div>
            <span className="text-apple-gray-400 font-bold text-xs uppercase tracking-[0.2em]">02 / Performance</span>
            <h2 className="text-5xl font-bold tracking-tighter mt-6 leading-none text-white">Apple <br/> Silicon</h2>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
            <p className="text-[10px] font-bold uppercase text-apple-gray-400 mb-2">Latest Neural Engine Score</p>
            <div className="flex justify-between items-end">
               <span className="text-3xl font-light tracking-tighter italic">M5 Ultra</span>
               <span className="text-apple-blue font-bold">Top Class</span>
            </div>
          </div>
        </Link>

        {/* Advisor: AEO Focus */}
        <Link href="/advisor" className="liquid-glass rounded-apple p-12 h-[450px] flex flex-col justify-between group overflow-hidden">
          <div>
            <span className="text-apple-blue font-bold text-xs uppercase tracking-[0.2em]">03 / Intelligence</span>
            <h2 className="text-5xl font-bold tracking-tighter mt-6 leading-none">Upgrade <br/> Advisor</h2>
          </div>
          <p className="text-apple-gray-400 font-medium">AI-driven insight on when to hold and when to upgrade.</p>
        </Link>

      </section>
    </main>
  );
}