import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'LogicSpecs | Professional Apple Database',
  description: 'The definitive technical source for Apple Silicon, iPhone specs, and upgrade advice.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#fbfbfd] text-[#1d1d1f] antialiased transition-colors duration-500">
        
        {/* Apple-Style Navigation Bar */}
        <nav className="fixed top-0 w-full z-[100] bg-white/70 backdrop-blur-xl border-b border-gray-200/50">
          <div className="max-w-[1400px] mx-auto px-6 h-14 flex justify-between items-center">
            <Link href="/" className="text-lg font-bold tracking-tighter italic">LOGICSPECS</Link>
            
            <div className="hidden lg:flex gap-8 text-[11px] font-semibold uppercase tracking-widest text-gray-500">
              <Link href="/finder" className="hover:text-blue-600 transition-colors">Finder</Link>
              <Link href="/compare" className="hover:text-blue-600 transition-colors">Compare</Link>
              <Link href="/advisor" className="hover:text-blue-600 transition-colors">Advisor</Link>
              <Link href="/benchmarks" className="hover:text-blue-600 transition-colors">Benchmarks</Link>
              <Link href="/os-support" className="hover:text-blue-600 transition-colors">OS</Link>
              <Link href="/deals" className="hover:text-blue-600 transition-colors">Refurbished</Link>
              <Link href="/rumors" className="hover:text-red-500 transition-colors text-red-400">Rumors</Link>
            </div>

            <div className="flex items-center gap-4">
               {/* Search Icon Placeholder */}
               <button className="text-gray-400 hover:text-black">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               </button>
            </div>
          </div>
        </nav>

        <main className="pt-14">{children}</main>

        {/* Liquid Glass Footer */}
        <footer className="bg-white border-t border-gray-100 py-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-xs text-gray-400 font-medium">LOGICSPECS. DATA LABORATORY.</p>
            <div className="mt-4 flex justify-center gap-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              <Link href="/about">About</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/affiliate">Affiliate Disclosure</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}