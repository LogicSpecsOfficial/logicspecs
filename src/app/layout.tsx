/* v1.4.2 
   Changelog: $ Phase 1: Removed hardcoded bg/text colors from body to let globals.css variables govern the theme.
*/

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Header from "../components/shared/Header";
import CommandK from "../components/shared/CommandK";
import { ThemeProvider } from "../components/shared/ThemeProvider";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "LogicSpecs | The Definitive Apple Hardware Matrix",
  description: "Advanced technical database and comparison engine for the Apple ecosystem.",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0A0A0B',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const saved = localStorage.getItem('ls-theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      {/* REMOVED: bg-white dark:bg-[#0A0A0B] text-[#1D1D1F] dark:text-[#F5F5F7]
          WHY: These were overriding the CSS variables in globals.css.
      */}
      <body className={`${inter.variable} font-sans antialiased transition-colors duration-500`}>
        <ThemeProvider>
          <Header />
          <CommandK />
          
          <div className="relative min-h-screen flex flex-col">
            <main className="flex-grow">
              {children}
            </main>
            
            <footer className="py-12 px-6 border-t border-gray-200 dark:border-white/5 glass-morphism">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-black dark:bg-white rounded-lg flex items-center justify-center transition-colors">
                    <span className="text-[10px] text-white dark:text-black font-black">L</span>
                  </div>
                  <span className="text-sm font-black uppercase tracking-tighter italic">LogicSpecs</span>
                </div>
                <p className="text-[10px] font-bold text-subtle uppercase tracking-widest">
                  © 2026 LogicSpecs Database. Hardware Revision: 1.4.2
                </p>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}