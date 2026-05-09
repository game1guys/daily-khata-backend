import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/logo.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0b1120] text-white pt-24 pb-12 relative overflow-hidden mt-10">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=2000')] opacity-5 bg-cover bg-center mix-blend-screen"></div>
      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[150px] -z-10 mix-blend-screen"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-20">
          
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-3 mb-6 block w-full">
               <img src={logoImg} alt="Daily Khata Logo" className="h-[2.5rem] w-auto object-contain brightness-0 invert drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
               <span className="text-[1.8rem] font-black tracking-tighter text-white hover:text-blue-400 transition-colors">Daily-KHATA</span>
            </Link>
            <p className="text-slate-400 font-medium leading-relaxed max-w-sm mb-8 text-[15px]">
              The absolute pinnacle of personal finance ecosystems. Built to empower millions of users with data clarity and robust accounting algorithms natively.
            </p>
            <div className="flex items-center gap-3">
               <a href="#" className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:border-blue-500 hover:text-white transition-all font-bold text-sm shadow-lg shadow-black/20">FB</a>
               <a href="#" className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-sky-500 hover:border-sky-400 hover:text-white transition-all font-bold text-sm shadow-lg shadow-black/20">TW</a>
               <a href="#" className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-indigo-600 hover:border-indigo-500 hover:text-white transition-all font-bold text-sm shadow-lg shadow-black/20">IN</a>
               <a href="#" className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:border-slate-500 hover:text-white transition-all font-bold text-sm shadow-lg shadow-black/20">GH</a>
            </div>
          </div>
          
          <div className="lg:col-span-2 lg:col-start-7">
            <h4 className="text-[14px] font-black mb-8 text-white uppercase tracking-widest">Platform</h4>
            <ul className="space-y-4 text-slate-400 font-medium text-[15px]">
              <li><Link to="/#features" className="hover:text-white hover:translate-x-1 inline-block transition-all">Feature Grid</Link></li>
              <li><Link to="/pricing" className="hover:text-white hover:translate-x-1 inline-block transition-all">Pricing & Tiers</Link></li>
              <li><Link to="/#download" className="hover:text-white hover:translate-x-1 inline-block transition-all">Mobile Application</Link></li>
              <li><Link to="/#testimonials" className="hover:text-white hover:translate-x-1 inline-block transition-all">Stories</Link></li>
              <li><Link to="/admin/login" className="hover:text-white hover:translate-x-1 inline-block transition-all">Admin Gateway</Link></li>
            </ul>
          </div>
          
          <div className="lg:col-span-2">
            <h4 className="text-[14px] font-black mb-8 text-white uppercase tracking-widest">Resources</h4>
            <ul className="space-y-4 text-slate-400 font-medium text-[15px]">
              <li><Link to="/help" className="hover:text-white hover:translate-x-1 inline-block transition-all">Help Center</Link></li>
              <li><Link to="/community" className="hover:text-white hover:translate-x-1 inline-block transition-all">Community Forums</Link></li>
              <li><Link to="/glossary" className="hover:text-white hover:translate-x-1 inline-block transition-all">Financial Glossary</Link></li>
              <li><Link to="/blog" className="hover:text-white hover:translate-x-1 inline-block transition-all">Blog</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[14px] font-black mb-8 text-white uppercase tracking-widest">Legal</h4>
            <ul className="space-y-4 text-slate-400 font-medium text-[15px]">
              <li><Link to="/privacy" className="hover:text-white hover:translate-x-1 inline-block transition-all">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white hover:translate-x-1 inline-block transition-all">Terms of Service</Link></li>
              <li><Link to="/refund" className="hover:text-white hover:translate-x-1 inline-block transition-all">Refund Agreement</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-10 mt-10 flex flex-col md:flex-row items-center justify-between text-slate-500 font-medium text-sm">
           <p>&copy; 2026 Daily-KHATA Organization. All rights automatically preserved.</p>
           <p className="mt-4 md:mt-0 flex items-center gap-1.5 border border-slate-800 rounded-full px-5 py-2 font-bold bg-slate-900 shadow-inner">
              Built with <span className="text-rose-500 animate-pulse text-[16px]">❤️</span> for Worldwide Financial Freedom
           </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
