/* v1.5.1 
   Changelog: @ Stylist Update: Forced true-black background on main and boosted typography contrast.
*/

import Link from 'next/link';

export default function LandingPage() {
  const categories = [
    { name: 'iPhone', icon: '📱' },
    { name: 'Mac', icon: '💻' },
    { name: 'iPad', icon: '📟' },
    { name: 'Watch', icon: '⌚' },
  ];

  return (
    /* Force bg-primary to kill any remaining white from layout.tsx */
    <main className="min-h-screen bg-[var(--bg-primary)] transition-colors duration-500">
      <section className="pt-48 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Explicitly using text-[var(--text-primary)] for maximum OLED pop */}
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-[var(--text-primary)]">
            LOGIC<span className="text-blue-600 uppercase italic">Specs</span>
          </h1>
          
          <p className="text-xl md:text-2xl font-medium text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            The professional technical database for the Apple ecosystem. 
            Select, Compare, and Analyze with 30+ data points.
          </p>

          <div className="pt-10 flex flex-wrap justify-center gap-6">
            <Link href="/finder" className="px-12 py-6 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-2xl">
              Start Finding
            </Link>
            <Link href="/compare" className="px-12 py-6 glass-morphism rounded-full font-bold text-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-[var(--text-primary)]">
              Launch Matrix
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link key={cat.name} href={`/finder?category=${cat.name}`}>
            <div className="group relative h-72 rounded-[3.5rem] glass-morphism p-10 hover:shadow-2xl hover:border-blue-500/50 transition-all overflow-hidden border border-[var(--border-subtle)]">
              <span className="text-5xl mb-4 block">{cat.icon}</span>
              <h3 className="text-3xl font-black tracking-tighter text-[var(--text-primary)]">{cat.name}</h3>
              
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all" />
              
              <div className="absolute bottom-10 right-10 w-12 h-12 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all text-[var(--text-primary)]">
                →
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}