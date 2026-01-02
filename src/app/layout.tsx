/* Version: v1.2.0
   Changelog: Integrated Global Header, optimized font loading for zero CLS, and fixed stacking context for floating UI.
*/

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/shared/Header";
import "./globals.css";

// 2026 Font Optimization: Using variable font for performance
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "LogicSpecs | The Definitive Apple Hardware Matrix",
  description: "Advanced technical database and comparison engine for the Apple ecosystem. 15+ years of specs, benchmarks, and evolution tracking.",
  keywords: ["iPhone specs", "Mac benchmarks", "Apple hardware database", "iPhone comparison matrix"],
  authors: [{ name: "LogicSpecs Team" }],
  robots: "index, follow",
};

// 2026 AEO Check: Defining viewport for mobile-first AI indexing
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} font-sans antialiased bg-[#F5F5F7] text-[#1D1D1F] selection:bg-blue-600 selection:text-white`}
      >
        {/* GLOBAL NAVIGATION 
          Placed at the root to enable persistence across page transitions 
        */}
        <Header />

        {/* MAIN CONTENT AREA 
          The pt-24 ensures content starts below the floating header 
        */}
        <div className="relative min-h-screen flex flex-col">
          <main className="flex-grow">
            {children}
          </main>
          
          {/* FOOTER 
            Minimalist 2026 footer for AEO link crawling 
          */}
          <footer className="py-12 px-6 border-t border-gray-200 bg-white/50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-[10px] text-white font-black">L</span>
                </div>
                <span className="text-sm font-black uppercase tracking-tighter italic">LogicSpecs</span>
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                © 2026 LogicSpecs Database. Hardware data is provided for informational purposes.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}