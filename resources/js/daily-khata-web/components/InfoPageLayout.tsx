import React, { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, BookOpen } from 'lucide-react';
import Footer from './Footer';

interface InfoPageLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  accentColor?: 'blue' | 'purple' | 'emerald' | 'amber';
}

const InfoPageLayout: React.FC<InfoPageLayoutProps> = ({ title, subtitle, children, accentColor = 'blue' }) => {
  
  // Dynamic gradient map based on accent
  const bgMap = {
    blue: 'from-blue-600/20 via-indigo-600/10 to-sky-400/20',
    purple: 'from-purple-600/20 via-fuchsia-600/10 to-pink-400/20',
    emerald: 'from-emerald-600/20 via-teal-600/10 to-cyan-400/20',
    amber: 'from-amber-600/20 via-orange-600/10 to-yellow-400/20'
  };

  const textGradientMap = {
    blue: 'from-blue-700 via-indigo-700 to-sky-600',
    purple: 'from-purple-700 via-fuchsia-700 to-pink-600',
    emerald: 'from-emerald-700 via-teal-700 to-cyan-600',
    amber: 'from-amber-700 via-orange-700 to-yellow-600'
  }

  return (
    <div className="min-h-screen bg-[#fafcff] font-sans flex flex-col relative overflow-hidden">
      
      {/* Ultra Rich Background Orbs */}
      <div className={`absolute top-0 right-0 w-[1000px] h-[1000px] bg-gradient-to-br ${bgMap[accentColor]} rounded-full blur-[140px] -z-10 mix-blend-multiply opacity-80 pointer-events-none translate-x-1/4 -translate-y-1/4`}></div>
      <div className="absolute top-[30%] left-[-10%] w-[800px] h-[800px] bg-sky-400/10 rounded-full blur-[150px] -z-10 pointer-events-none"></div>
      
      {/* Floating Glass Navbar */}
      <nav className="fixed w-full z-50 top-6 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between h-[4.5rem] bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] rounded-[2rem] px-4 sm:px-6 transition-all">
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 text-[15px] font-black rounded-[1.4rem] bg-slate-900 text-white hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all">
            <ArrowLeft size={18} /> Back To Daily-KHATA
          </Link>
          <div className="hidden sm:flex items-center gap-2 text-slate-500 font-bold text-[13px] tracking-wide uppercase bg-slate-100/80 px-5 py-3 rounded-full border border-slate-200/50 shadow-inner">
             <Sparkles size={16} className="text-amber-500"/> Verified Document
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-32">
        
        {/* Rich Glassmorphic Content Card */}
        <div className="bg-white/80 backdrop-blur-3xl border border-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] p-8 sm:p-16 lg:p-24 relative z-10">
            
            <header className="mb-16 border-b border-slate-200/60 pb-12 flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="flex-shrink-0 w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-slate-100 to-slate-200 border border-white shadow-md flex items-center justify-center text-slate-800">
                 <BookOpen size={36} />
              </div>
              <div>
                <h1 className={`text-5xl md:text-6xl lg:text-[4rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r ${textGradientMap[accentColor]} drop-shadow-sm leading-tight pb-2`}>
                  {title}
                </h1>
                {subtitle && <p className="mt-4 text-xl md:text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl">{subtitle}</p>}
              </div>
            </header>

            {/* Custom styled Prose for intense typographical richness */}
            <article className="prose prose-slate prose-lg lg:prose-xl max-w-none text-slate-600 font-medium leading-relaxed
                prose-headings:font-black prose-headings:text-slate-800 prose-headings:tracking-tight 
                prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:pb-4 prose-h2:border-b prose-h2:border-slate-100
                prose-strong:text-slate-900 prose-strong:font-black
                prose-a:text-blue-600 prose-a:font-bold hover:prose-a:text-blue-500
                prose-li:marker:text-blue-500 prose-ul:bg-slate-50/50 prose-ul:p-8 prose-ul:px-12 prose-ul:rounded-[2rem] prose-ul:border prose-ul:border-slate-100/80 prose-ul:shadow-inner
                prose-p:mb-8"
            >
              {children}
            </article>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InfoPageLayout;
